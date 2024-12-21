from flask import Flask, request, jsonify
from io import BytesIO
import base64
import requests
from PIL import Image, UnidentifiedImageError
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from sklearn.metrics.pairwise import cosine_similarity

from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Load ResNet50 model pretrained on ImageNet for feature extraction
model = ResNet50(weights='imagenet', include_top=False, pooling='avg')

# Preprocess image for ResNet50
def preprocess_image(img):
    img = img.resize((224, 224))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
    return img_array

# Extract features from an image
def extract_features(img):
    img_array = preprocess_image(img)
    features = model.predict(img_array)
    return features.flatten()

# Fetch image from URL with headers to mimic a browser
def fetch_image_from_url(img_url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
    }
    try:
        print(f"Attempting to fetch image from URL: {img_url}")
        response = requests.get(img_url, headers=headers, timeout=10)
        if response.status_code == 200:
            if 'image' in response.headers.get('Content-Type', ''):
                print(f"Successfully fetched image from {img_url}")
                return Image.open(BytesIO(response.content))
            else:
                print(f"URL did not return an image: {img_url}")
        else:
            print(f"Failed to fetch image from {img_url}, Status Code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {img_url}: {e}")
    return None

# Decode base64 string to an image
def decode_base64_image(base64_str):
    try:
        image_data = base64.b64decode(base64_str)
        img = Image.open(BytesIO(image_data))
        img.verify()
        img = Image.open(BytesIO(image_data))  # Reopen after verification
        return img
    except (base64.binascii.Error, UnidentifiedImageError) as e:
        raise ValueError(f"Invalid image or base64 data: {str(e)}")

# Find the most similar items
def find_similar_items(query_features, catalog_data, top_n=5):
    catalog_features = np.array([data['features'] for data in catalog_data])
    similarities = cosine_similarity([query_features], catalog_features).flatten()
    top_indices = np.argsort(similarities)[::-1][:top_n]
    return [catalog_data[i]['product'] for i in top_indices]

@app.route('/compare', methods=['POST'])
def compare_images():
    try:
        data = request.get_json()
        query_base64 = data.get('query_image')
        products = data.get('products')

        # Decode query image
        if not query_base64:
            return jsonify({'error': 'Query image is missing'}), 400
        try:
            query_image = decode_base64_image(query_base64)
        except ValueError as ve:
            print(f"Error decoding query image: {ve}")
            return jsonify({'error': 'Invalid query image'}), 400

        query_features = extract_features(query_image)

        # Fetch and process catalog images
        catalog_data = []
        for product in products:
            try:
                img_url = product.get('image')
                if not img_url:
                    print(f"Product missing 'image' field: {product}")
                    continue
                img = fetch_image_from_url(img_url[0])
                if img:
                    print(f"Processing image from URL: {img_url[0]}")
                    features = extract_features(img)
                    catalog_data.append({'product': product, 'features': features})
                else:
                    print(f"Failed to process image from URL: {img_url[0]}")
            except Exception as e:
                print(f"Error processing product {product}: {e}")

        if not catalog_data:
            print("No valid catalog images fetched")
            return jsonify({'error': 'No valid catalog images fetched'}), 400

        # Find similar products
        similar_products = find_similar_items(query_features, catalog_data, top_n=3)

        return jsonify({'similar_products': similar_products})

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)







