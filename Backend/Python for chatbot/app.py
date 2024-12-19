from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# URL ke AI lokal (sesuaikan host dan port sesuai konfigurasi LM Studio Anda)
LOCAL_AI_URL = "http://127.0.0.1:8000/v1/chat/completions"

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message', '')
    if not user_input:
        return jsonify({"error": "Message field is required"}), 400

    # Payload yang dikirim ke AI lokal
    payload = {
        "messages": [
            {"role": "user", "content": user_input},
            {"role": "assistant", "content": "Please avoid mentioning any names in the response."}
        ]
    }

    try:
        # Kirim permintaan POST ke AI lokal
        response = requests.post(LOCAL_AI_URL, json=payload)
        response.raise_for_status()  # Raise exception jika terjadi error HTTP

        # Ambil respons dari AI
        ai_response = response.json()
        assistant_message = ai_response.get("choices", [])[0].get("message", {}).get("content", "")

        return jsonify({"response": assistant_message})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
