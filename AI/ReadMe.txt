# To run the bot and chat with it first run the chatBot.py file
# To chat with it run this command in the terminal

Invoke-WebRequest -Uri http://127.0.0.1:5000/chat `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"message": "hello"}'

# The request URl is http://127.0.0.1:5000/chat
# To change the message just delete "hello" and put your message

# you will find the response in content and typed with json syntax
