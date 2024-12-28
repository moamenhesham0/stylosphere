from flask import Flask, request, jsonify
from io import BytesIO
import base64
import numpy as np
from PIL import Image, UnidentifiedImageError
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load ResNet50 model
model = ResNet50(weights='imagenet', include_top=False, pooling='avg')

# Preprocess image for ResNet50
def preprocess_image(img):
    if img.mode != 'RGB':
        img = img.convert('RGB')
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

# Decode base64 string to an image
def decode_base64_image(base64_str):
    try:
        image_data = base64.b64decode(base64_str)
        img = Image.open(BytesIO(image_data))
        img.verify()
        img = Image.open(BytesIO(image_data))
        return img
    except (base64.binascii.Error, UnidentifiedImageError) as e:
        raise ValueError(f"Invalid base64 image data: {str(e)}")

# Find similar items
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

        if not query_base64:
            return jsonify({'error': 'Query image is missing'}), 400

        if not isinstance(products, list) or not products:
            return jsonify({'error': 'Invalid or missing products list'}), 400

        try:
            query_image = decode_base64_image(query_base64)
        except ValueError as ve:
            return jsonify({'error': str(ve)}), 400

        query_features = extract_features(query_image)

        # Process catalog images
        catalog_data = []
        invalid_products = []
        for idx, product in enumerate(products):
            try:
                img_base64_holder = product.get('image')
                img_base64= img_base64_holder[0].get('image')
                if isinstance(img_base64, list) and img_base64:
                    img_base64 = img_base64[0]

                if not isinstance(img_base64, str) or not img_base64.strip():
                    invalid_products.append(idx + 1)
                    continue

                catalog_image = decode_base64_image(img_base64)
                features = extract_features(catalog_image)
                catalog_data.append({'product': product, 'features': features})

            except ValueError as ve:
                invalid_products.append(idx + 1)
            except Exception as e:
                invalid_products.append(idx + 1)

        if not catalog_data:
            return jsonify({'error': 'No valid catalog images fetched', 'invalid_products': invalid_products}), 400

        # Find similar products
        similar_products = find_similar_items(query_features, catalog_data, top_n=3)

        return jsonify({'similar_products': similar_products})

    except Exception as e:
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500

if __name__ == '__main__':
    import os
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow info and warning messages
    app.run(debug=True)












