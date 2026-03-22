from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
import re

app = Flask(__name__)
CORS(app)

def clean_text(text):
    """Clean and preprocess text"""
    # Convert to lowercase
    text = text.lower()
    # Remove special characters and digits
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Remove extra whitespaces
    text = ' '.join(text.split())
    return text

def analyze_sentiment(text):
    """
    Analyze sentiment using TextBlob
    Returns: sentiment (positive/negative/neutral) and polarity score
    """
    # Clean the text
    cleaned_text = clean_text(text)
    
    # Create TextBlob object
    blob = TextBlob(cleaned_text)
    
    # Get polarity score (-1 to 1)
    polarity = blob.sentiment.polarity
    
    # Determine sentiment category
    if polarity > 0.1:
        sentiment = 'positive'
    elif polarity < -0.1:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    
    return {
        'sentiment': sentiment,
        'score': round(polarity, 3),
        'confidence': round(abs(polarity), 3)
    }

@app.route('/', methods=['GET'])
def home():
    """Home page with service info"""
    return jsonify({
        'service': 'Sentiment Analysis ML Service',
        'version': '1.0.0',
        'status': 'running',
        'endpoints': {
            'health': 'GET /health',
            'analyze': 'POST /analyze - {"text": "your text here"}',
            'batch_analyze': 'POST /batch-analyze - {"texts": ["text1", "text2"]}'
        },
        'documentation': 'See README.md for more details'
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Sentiment Analysis ML Service',
        'version': '1.0.0'
    })

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Analyze sentiment of given text
    Expected JSON: {"text": "review text here"}
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'error': 'Missing text field in request body'
            }), 400
        
        text = data['text']
        
        if not text or len(text.strip()) < 5:
            return jsonify({
                'error': 'Text is too short for analysis'
            }), 400
        
        # Perform sentiment analysis
        result = analyze_sentiment(text)
        
        return jsonify({
            'success': True,
            'data': result
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/batch-analyze', methods=['POST'])
def batch_analyze():
    """
    Analyze sentiment of multiple texts
    Expected JSON: {"texts": ["review 1", "review 2", ...]}
    """
    try:
        data = request.get_json()
        
        if not data or 'texts' not in data:
            return jsonify({
                'error': 'Missing texts field in request body'
            }), 400
        
        texts = data['texts']
        
        if not isinstance(texts, list):
            return jsonify({
                'error': 'texts must be an array'
            }), 400
        
        # Analyze each text
        results = []
        for text in texts:
            if text and len(text.strip()) >= 5:
                result = analyze_sentiment(text)
                results.append(result)
            else:
                results.append({
                    'sentiment': 'neutral',
                    'score': 0,
                    'confidence': 0
                })
        
        return jsonify({
            'success': True,
            'data': results
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("🤖 Starting Sentiment Analysis ML Service...")
    print("📊 Using TextBlob for sentiment analysis")
    print("🌐 Service running on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
