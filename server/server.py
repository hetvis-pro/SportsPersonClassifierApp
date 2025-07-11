from flask import Flask, request, jsonify, send_from_directory
import util
import os

app = Flask(__name__)

# Define UI folder path (1 level up from server.py)
UI_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'UI')

@app.route('/')
def home():
    return send_from_directory(UI_FOLDER, 'app.html')

@app.route('/UI/<path:filename>')
def serve_static_ui(filename):
    return send_from_directory(UI_FOLDER, filename)

@app.route('/classify_image', methods=['POST'])
def classify_image():
    image_data = request.form['image_data']
    response = jsonify(util.classify_image(image_data))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    print("Starting Python Flask Server For Sports Celebrity Image Classification")
    util.load_saved_artifacts()
    app.run(port=5000)
