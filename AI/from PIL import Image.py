from PIL import Image
import numpy as np
import tensorflow as tf

# Load the trained model
model = tf.keras.models.load_model('clothing_classifier_model.h5')

# Load the image from the hard disk
image_path = "C:/Temp/ba37740db12743a191115c0071f0d687.webp"  # Replace with the actual image path
image = Image.open(image_path)

# Preprocess the image
image = image.convert('RGB')  # Ensure RGB format
image = image.resize((128, 128))  # Resize to match model input
image = np.array(image) / 255.0  # Normalize pixel values
image = np.expand_dims(image, axis=0)  # Add batch dimension

# Predict the class
predictions = model.predict(image)
predicted_class = np.argmax(predictions, axis=1)[0]

# Class names (update based on your dataset)
class_names = ["T-shirt/top", "Trouser", "Pullover", "Dress", "Coat",
               "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"]

# Output the prediction
print(predicted_class)
print(f"Predicted Class: {class_names[predicted_class]}")
