from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import json
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder

# Load the intents JSON file and extract patterns and responses
with open('intents.json', 'r') as file:
    intents_data = json.load(file)

# Extract patterns and tags (responses will be chosen based on tags)
patterns = []
tags = []
tag_to_responses = {}

for intent in intents_data['intents']:
    tag = intent['tag']
    for pattern in intent['patterns']:
        patterns.append(pattern)
        tags.append(tag)
    tag_to_responses[tag] = intent['responses']

# Tokenize patterns and encode tags
tokenizer = Tokenizer()
tokenizer.fit_on_texts(patterns)
vocab_size = len(tokenizer.word_index) + 1
sequences = tokenizer.texts_to_sequences(patterns)
max_sequence_len = max(len(seq) for seq in sequences)
padded_sequences = pad_sequences(sequences, maxlen=max_sequence_len, padding='post')

# Encode tags as labels
label_encoder = LabelEncoder()
encoded_tags = label_encoder.fit_transform(tags)
num_classes = len(label_encoder.classes_)

# Load the trained model
model = load_model('chatbot_model.h5')

# Flask app setup
app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    user_input = data.get("message")

    # Preprocess user input and make prediction
    user_seq = tokenizer.texts_to_sequences([user_input])
    user_padded = pad_sequences(user_seq, maxlen=max_sequence_len, padding='post')
    prediction = model.predict(user_padded)
    predicted_tag = label_encoder.inverse_transform([np.argmax(prediction)])[0]

    # Select a random response from the predicted tag's responses
    bot_response = np.random.choice(tag_to_responses[predicted_tag])

    return jsonify({"response": bot_response})

if __name__ == '__main__':
    app.run(port=5000)
