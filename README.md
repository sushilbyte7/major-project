# ServeEase - AI-Powered Home Services Platform

A full-stack home services booking platform with **AI/ML sentiment analysis** for customer reviews using Natural Language Processing.

## 🚀 Key Features

### Core Features
- 🔐 User Authentication & Authorization (JWT)
- 🏠 Service Booking System
- 👨‍🔧 Provider Management
- 📅 Booking Status Tracking
- 👤 User & Admin Dashboards

### 🤖 AI/ML Features
- **Sentiment Analysis** - AI analyzes customer reviews using NLP
- **Automatic Sentiment Classification** - Positive/Negative/Neutral
- **Sentiment Scoring** - Polarity score from -1 to +1
- **Real-time Analytics** - AI-powered review statistics
- **Provider Rating System** - Auto-updated based on reviews

---

## 📁 Project Structure

```
major-project/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   └── services/      # API client
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── controllers/       # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & Admin middleware
│   └── package.json
│
└── ml-service/            # Python ML Service
    ├── app.py             # Flask API for sentiment analysis
    ├── requirements.txt   # Python dependencies
    └── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router DOM** - Routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express 5.2** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### AI/ML Service
- **Python 3.x** - Language
- **Flask** - Web framework
- **TextBlob** - NLP library for sentiment analysis
- **NLTK** - Natural Language Toolkit

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MongoDB (local or Atlas)

### Step 1: Clone the Repository
```bash
cd major-project
```

### Step 2: Setup Backend (Node.js Server)
```bash
cd server
npm install
```

Create `.env` file in `server/` directory:
```env
MONGO_URI=mongodb://localhost:27017/serveease
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
ML_SERVICE_URL=http://localhost:5001
```

### Step 3: Setup Frontend (React Client)
```bash
cd ../client
npm install
```

Create `.env` file in `client/` directory:
```env
VITE_API_URL=http://localhost:5000
```

### Step 4: Setup ML Service (Python)
```bash
cd ../ml-service
pip install -r requirements.txt
```

**Important:** Download TextBlob corpora (one-time setup):
```bash
python -m textblob.download_corpora
```

---

## 🚀 Running the Application

You need to run **3 services** simultaneously:

### Terminal 1: Start MongoDB
```bash
# If using local MongoDB
mongod
```

### Terminal 2: Start ML Service (Python)
```bash
cd ml-service
python app.py
```
ML Service will run on `http://localhost:5001`

### Terminal 3: Start Backend (Node.js)
```bash
cd server
npm run dev
```
Backend will run on `http://localhost:5000`

### Terminal 4: Start Frontend (React)
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

---

## 📊 How AI/ML Works in This Project

### Sentiment Analysis Flow:
1. **User submits review** → Frontend sends to Node.js backend
2. **Backend calls ML service** → Sends review text to Python Flask API
3. **ML service analyzes** → TextBlob performs NLP sentiment analysis
4. **Returns sentiment** → Classification (positive/negative/neutral) + score
5. **Stored in database** → Review saved with AI-generated sentiment
6. **Displayed on UI** → Users see AI-analyzed reviews with badges

### ML Model Details:
- **Algorithm:** TextBlob's pattern-based sentiment analyzer
- **Input:** Customer review text
- **Output:** 
  - Sentiment: positive/negative/neutral
  - Polarity Score: -1 (most negative) to +1 (most positive)
  - Confidence: Absolute value of polarity

### Example:
```
Review: "The service was excellent and the provider was very professional!"
↓
ML Analysis:
{
  "sentiment": "positive",
  "score": 0.8,
  "confidence": 0.8
}
```

---

## 🔑 API Endpoints

### Reviews (AI-Powered)
```
POST   /api/reviews                  # Create review (calls ML service)
GET    /api/reviews/provider/:id     # Get provider reviews with AI stats
GET    /api/reviews/service/:id      # Get service reviews
GET    /api/reviews/my-reviews       # Get user's reviews
DELETE /api/reviews/:id              # Delete review
```

### ML Service API
```
GET    /health                       # Health check
POST   /analyze                      # Analyze single text
POST   /batch-analyze                # Analyze multiple texts
```

---

## 🎓 For University Project / Demo

### Key Points to Highlight:

1. **AI/ML Integration**: Microservices architecture with separate ML service
2. **Real-world Application**: Sentiment analysis for business insights
3. **Modern Tech Stack**: Full-stack development with latest technologies
4. **Scalability**: Modular design, ML service can be scaled independently
5. **Data Analytics**: AI-generated statistics and insights

### Demo Flow:
1. Register/Login as user
2. Browse services and make a booking
3. Admin marks booking as "Completed"
4. User writes a review
5. **AI automatically analyzes sentiment** (show console/network tab)
6. View provider page with AI-powered review analytics
7. Show sentiment distribution charts

### ML Model Improvement Scope (Future):
- Use advanced models (BERT, RoBERTa)
- Train custom model on domain-specific data
- Add multi-language support
- Implement emotion detection (happy, sad, angry, etc.)
- Add review summarization using LLMs

---

## 📝 Seeding Data

Seed admin user:
```bash
cd server
node seed-admin.js
```

Seed services:
```bash
node seed-services.js
```

Default Admin Credentials:
- Email: admin@serveease.com
- Password: admin123

---

## 🐛 Troubleshooting

### ML Service Not Working
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Re-download TextBlob corpora
python -m textblob.download_corpora
```

### Backend Can't Connect to ML Service
- Check if ML service is running on port 5001
- Verify `ML_SERVICE_URL` in `.env`
- Check firewall settings

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Try using MongoDB Atlas (cloud)

---

## 📄 License
MIT License - Free for educational and commercial use

---

## 👨‍💻 Author
Major Project - University Submission

---

## 🎯 Project Highlights for HOD

✅ **AI/ML Integration** - Sentiment Analysis using NLP  
✅ **Microservices Architecture** - Separate ML service  
✅ **Modern Tech Stack** - React, Node.js, Python, MongoDB  
✅ **Real-world Application** - Home services marketplace  
✅ **Scalable Design** - Modular and extensible  
✅ **Data-Driven Insights** - AI-powered analytics  
✅ **Production-Ready** - Error handling, validation, security
