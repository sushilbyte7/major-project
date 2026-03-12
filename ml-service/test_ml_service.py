"""
Test script for Sentiment Analysis ML Service
Run this to verify the ML service is working correctly
"""

import requests
import json

ML_SERVICE_URL = 'http://localhost:5001'

def test_health_check():
    """Test if ML service is running"""
    print("🔍 Testing ML Service Health Check...")
    try:
        response = requests.get(f'{ML_SERVICE_URL}/health')
        if response.status_code == 200:
            print("✅ ML Service is running!")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Health check failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to ML service: {e}")
        print("   Make sure the ML service is running on http://localhost:5001")
        return False

def test_sentiment_analysis():
    """Test sentiment analysis with sample reviews"""
    print("\n🧪 Testing Sentiment Analysis...")
    
    test_cases = [
        {
            "text": "Excellent service! Very professional and punctual. Highly recommend!",
            "expected": "positive"
        },
        {
            "text": "Terrible experience. Very unprofessional and late. Would not recommend.",
            "expected": "negative"
        },
        {
            "text": "The service was okay. Nothing special but got the work done.",
            "expected": "neutral"
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n   Test Case {i}:")
        print(f"   Input: \"{test_case['text'][:50]}...\"")
        
        try:
            response = requests.post(
                f'{ML_SERVICE_URL}/analyze',
                json={'text': test_case['text']},
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                result = response.json()
                if result['success']:
                    data = result['data']
                    sentiment = data['sentiment']
                    score = data['score']
                    confidence = data['confidence']
                    
                    expected = test_case['expected']
                    status = "✅" if sentiment == expected else "⚠️"
                    
                    print(f"   {status} Sentiment: {sentiment} (expected: {expected})")
                    print(f"   Score: {score:.3f}")
                    print(f"   Confidence: {confidence:.3f}")
                else:
                    print(f"   ❌ Analysis failed: {result.get('error', 'Unknown error')}")
            else:
                print(f"   ❌ Request failed with status {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")

def test_batch_analysis():
    """Test batch sentiment analysis"""
    print("\n🧪 Testing Batch Analysis...")
    
    texts = [
        "Great work!",
        "Poor service",
        "It was fine"
    ]
    
    try:
        response = requests.post(
            f'{ML_SERVICE_URL}/batch-analyze',
            json={'texts': texts},
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                print("✅ Batch analysis successful!")
                for i, (text, analysis) in enumerate(zip(texts, result['data']), 1):
                    print(f"   {i}. \"{text}\" → {analysis['sentiment']} ({analysis['score']:.2f})")
            else:
                print(f"❌ Batch analysis failed: {result.get('error', 'Unknown error')}")
        else:
            print(f"❌ Request failed with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print("=" * 60)
    print("  SENTIMENT ANALYSIS ML SERVICE - TEST SUITE")
    print("=" * 60)
    
    # Test health check first
    if not test_health_check():
        print("\n⚠️  ML service is not running. Start it with:")
        print("   cd ml-service")
        print("   python app.py")
        return
    
    # Run other tests
    test_sentiment_analysis()
    test_batch_analysis()
    
    print("\n" + "=" * 60)
    print("  TEST SUITE COMPLETED")
    print("=" * 60)

if __name__ == '__main__':
    main()
