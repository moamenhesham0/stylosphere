from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf
import logging

# Initialize Flask app
app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)

# Load the trained model
try:
    model = tf.keras.models.load_model('clothing_classifier_model.h5')
    logging.info("Model loaded successfully.")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    model = None

# Class names (update based on your dataset)
class_names = ["T-shirt/top", "Trouser", "Pullover", "Dress", "Coat",
               "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"]

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not loaded.'}), 500

    try:
        # Get the image from the request
        if 'image' not in request.files:
            return jsonify({'error': 'No file with key "image" provided'}), 400

        file = request.files['image']

        # Validate the file type
        if not file.content_type.startswith('image/'):
            return jsonify({'error': 'Uploaded file is not an image'}), 400

        image = Image.open(file)

        # Preprocess the image
        image = image.convert('RGB')
        image = image.resize((128, 128))
        image = np.array(image) / 255.0
        image = np.expand_dims(image, axis=0)

        # Predict the class
        predictions = model.predict(image)
        predicted_class = np.argmax(predictions, axis=1)[0]
        predicted_label = class_names[predicted_class]

        # Log prediction
        logging.info(f"Prediction: {predicted_label}")

        # Return the result as JSON
        return jsonify({
            'type': predicted_label
        })

    except Exception as e:
        logging.error(f"Error processing prediction: {e}")
        return jsonify({'error': 'Failed to process the image'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
