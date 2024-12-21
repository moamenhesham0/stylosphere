from flask import Flask, request, jsonify
from io import BytesIO
import base64
import requests
from PIL import Image, UnidentifiedImageError
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing import image
from sklearn.metrics.pairwise import cosine_similarity
import time

app = Flask(__name__)

# Load ResNet50 model pretrained on ImageNet for feature extraction
model = ResNet50(weights='imagenet', include_top=False, pooling='avg')

# Function to preprocess image
def preprocess_image(img):
    img = img.resize((224, 224))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
    return img_array

# Function to extract features from an image
def extract_features(img):
    img_array = preprocess_image(img)
    features = model.predict(img_array)
    return features.flatten()  # Flatten the features to 1D vector

# Function to calculate cosine similarity
def calculate_similarity(query_features, catalog_features):
    similarities = cosine_similarity([query_features], catalog_features)
    return similarities.flatten()

# Function to find the most similar items
def find_similar_items(query_image, catalog_images, top_n=5):
    # Extract features for the query image
    query_features = extract_features(query_image)
    
    # Extract features for the catalog images
    catalog_features = np.array([extract_features(img) for img in catalog_images])
    
    # Calculate similarities
    similarities = calculate_similarity(query_features, catalog_features)
    
    # Get the top N most similar items
    top_indices = np.argsort(similarities)[::-1][:top_n]
    
    return [catalog_images[i] for i in top_indices]

# Function to fetch image from URL with retries (handling rate limiting)
def fetch_image_from_url(img_url, retries=3):
    attempt = 0
    while attempt < retries:
        try:
            response = requests.get(img_url)
            if response.status_code == 200:
                print(f"Successfully fetched image from {img_url}")
                return Image.open(BytesIO(response.content))
            else:
                print(f"Failed to fetch image from {img_url}: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Error occurred: {e}")
        
        attempt += 1
        backoff_time = 2 ** attempt  # Exponential backoff
        time.sleep(backoff_time)
    
    return None

@app.route('/compare', methods=['POST'])
def compare_images():
    try:
        # Parse the incoming JSON data
        data = request.get_json()
        query_base64 = data.get('query_image')  # Base64 string of the query image
        products = data.get('products')  # List of product objects containing imgur URLs

        # Function to decode base64 and open the query image
        def decode_image(base64_str):
            try:
                image_data = base64.b64decode(base64_str)
                img = Image.open(BytesIO(image_data))
                img.verify()  # Verify if it's a valid image
                img = Image.open(BytesIO(image_data))  # Open again after verification
                return img
            except (base64.binascii.Error, UnidentifiedImageError) as e:
                raise ValueError(f"Invalid image or base64 data: {str(e)}")

        # Decode the query image
        query_image = decode_image(query_base64)

        # Fetch catalog images from the Imgur URLs (from the products)
        catalog_images = []
        for product in products:
            img_url = product.get('image')
            img = fetch_image_from_url(img_url)
            if img:
                catalog_images.append(img)
            else:
                print(f"Failed to fetch image from {img_url}")

        print(f"Fetched {len(catalog_images)} catalog images.")

        # If no images were fetched, return an error
        if not catalog_images:
            return jsonify({'error': 'No catalog images could be fetched'})

        # Find similar items
        similar_items = find_similar_items(query_image, catalog_images, top_n=3)

        # Return the result (send back the products corresponding to the similar images)
        similar_products = []
        for img in similar_items:
            # Find the product corresponding to the image in the catalog
            for product in products:
                if fetch_image_from_url(product['image']) == img:
                    similar_products.append(product)
                    break

        return jsonify({'similar_products': similar_products})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)








