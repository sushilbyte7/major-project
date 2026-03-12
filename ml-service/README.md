# Sentiment Analysis ML Service

This is a Flask-based microservice that provides sentiment analysis for customer reviews using Natural Language Processing (NLP).

## Features
- Real-time sentiment analysis (Positive/Negative/Neutral)
- Polarity scoring (-1 to +1)
- Confidence metrics
- Batch processing support
- RESTful API

## Technology
- **Flask**: Web framework
- **TextBlob**: NLP library for sentiment analysis
- **CORS**: Cross-origin resource sharing

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Download TextBlob corpora (first time only):
```bash
python -m textblob.download_corpora
```

## Running the Service

```bash
python app.py
```

The service will start on `http://localhost:5001`

## API Endpoints

### Health Check
```
GET /health
```

### Analyze Single Text
```
POST /analyze
Content-Type: application/json

{
  "text": "The service was excellent and the provider was very professional!"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "sentiment": "positive",
    "score": 0.8,
    "confidence": 0.8
  }
}
```

### Batch Analysis
```
POST /batch-analyze
Content-Type: application/json

{
  "texts": [
    "Great service!",
    "Very disappointed",
    "It was okay"
  ]
}
```

## Sentiment Categories
- **Positive**: Score > 0.1
- **Negative**: Score < -0.1
- **Neutral**: Score between -0.1 and 0.1
