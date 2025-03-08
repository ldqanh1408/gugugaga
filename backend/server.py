from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

LLAMA_SERVER = "http://localhost:8080/completion"  

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask server is running!"})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_prompt = data.get("prompt", "")
    
    if not user_prompt:
        return jsonify({"error": "Empty prompt"}), 400
    
    payload = {
        "prompt": user_prompt,
        "n_predict": 256
    }
    
    try:
        response = requests.post(LLAMA_SERVER, json=payload, timeout=10) 
        response.raise_for_status() 
        return jsonify(response.json())
    except requests.exceptions.Timeout:
        return jsonify({"error": "Llama.cpp server timeout"}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to connect to Llama.cpp: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
