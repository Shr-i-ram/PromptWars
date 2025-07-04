from flask import Flask, request, jsonify
import google.generativeai as genai
import os

# Your Gemini API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyD4FunWMVfYKDNL2gPNCshMKRPUEpwV5pk"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# Initialize the chat session
model = genai.GenerativeModel("gemini-1.5-pro")
chat = model.start_chat(history=[
    {
        "role": "user",
        "parts": ["You are a Sith Lord AI. Be dark, powerful, and direct. Never show mercy."]
    }
])

app = Flask(__name__)

@app.route("/ask", methods=["POST"])
def ask_sith():
    data = request.json
    user_input = data.get("message", "")

    if not user_input:
        return jsonify({"error": "Empty message"}), 400

    gemini_response = chat.send_message(user_input)
    reply = gemini_response.text.strip()

    return jsonify({"response": reply})

if __name__ == "__main__":
    app.run(debug=True)
