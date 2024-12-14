from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf

# Initialize Flask app
app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model('clothing_classifier_model.h5')

# Class names (update based on your dataset)
class_names = ["T-shirt/top", "Trouser", "Pullover", "Dress", "Coat",
               "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the image from the request
        file = request.files['image']  # Expecting a file with key 'image'
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

        # Return the result as JSON
        if predicted_label == "dress":
                return None
        return jsonify({      
            'type': predicted_label
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)