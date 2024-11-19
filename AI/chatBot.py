from flask import Flask, request, jsonify

app = Flask(__name__)

responses = {
    "hello": "Hi there! How can I help you?",
    "how are you": "I'm just a bot, but I'm doing great! How about you?",
    "bye": "Goodbye! Have a great day!",
}

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message', '').lower()
    response = responses.get(user_input, "Sorry, I didn't understand that.")
    return jsonify({"reply": response})

if __name__ == '__main__':
    app.run(debug=True)
