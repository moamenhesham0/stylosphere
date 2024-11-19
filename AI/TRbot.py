from transformers import pipeline

chatbot = pipeline("text-generation", model="gpt2")

print("Chatbot: Hi there! Ask me anything. (Type 'exit' to quit)")

while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        print("Chatbot: Goodbye!")
        break

    # Generate a response
    response = chatbot(f"User: {user_input}\nChatbot:", max_length=50, num_return_sequences=1)
    print(f"Chatbot: {response[0]['generated_text'].split('Chatbot:')[-1].strip()}")
