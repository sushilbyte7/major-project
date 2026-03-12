# 🚀 Quick Start Guide - ServeEase with AI/ML

## Fast Setup (5 Minutes)

### 1. Install Dependencies

**Backend:**
```powershell
cd server
npm install
```

**Frontend:**
```powershell
cd ..\client
npm install
```

**ML Service:**
```powershell
cd ..\ml-service
pip install -r requirements.txt
python -m textblob.download_corpora
```

### 2. Create Environment Files

**Server (.env):**
```powershell
cd ..\server
copy .env.example .env
```

Edit `server/.env` and update:
- `MONGO_URI` with your MongoDB connection string
- `JWT_SECRET` with a secure random string

**Client (.env):**
```powershell
cd ..\client
copy .env.example .env
```

### 3. Start MongoDB
```powershell
# If MongoDB is installed locally
mongod
```

Or use MongoDB Atlas (cloud) - update MONGO_URI accordingly

### 4. Seed Initial Data
```powershell
cd ..\server
node seed-admin.js
node seed-services.js
```

### 5. Run All Services

**Option A: Using 3 Separate PowerShell Terminals**

Terminal 1 - ML Service:
```powershell
cd ml-service
python app.py
```

Terminal 2 - Backend:
```powershell
cd server
npm run dev
```

Terminal 3 - Frontend:
```powershell
cd client
npm run dev
```

**Option B: Using the provided terminals in VS Code**

You already have 2 terminals set up:
- Terminal "esbuild" → `cd client` then `npm run dev`
- Terminal "node" → `cd server` then `npm run dev`
- Create a 3rd terminal → `cd ml-service` then `python app.py`

---

## 🧪 Testing the AI/ML Feature

### Step-by-Step Demo:

1. **Login as Admin:**
   - Go to http://localhost:5173/login
   - Email: `admin@serveease.com`
   - Password: `admin123`

2. **Create Test Bookings:**
   - Register as a normal user (logout first)
   - Book any service
   - Login back as admin
   - Mark the booking as "Completed"

3. **Write Reviews with AI Analysis:**
   - Login as the user who made the booking
   - Go to "Dashboard"
   - Click "Write Review" on completed booking
   - Write a review (try these examples):
     - **Positive:** "Excellent service! Very professional and punctual. Highly recommended!"
     - **Negative:** "Very disappointed with the service. Poor quality and unprofessional behavior."
     - **Neutral:** "The service was okay, nothing special but got the job done."

4. **View AI Results:**
   - Check the console/network tab to see ML service call
   - Visit provider detail page to see AI-analyzed reviews
   - See sentiment badges (😊 Positive, 😞 Negative, 😐 Neutral)
   - View AI-powered analytics dashboard

---

## 📊 Verify ML Service is Working

### Test ML API Directly:

```powershell
# Check if ML service is running
curl http://localhost:5001/health

# Test sentiment analysis
curl -X POST http://localhost:5001/analyze ^
  -H "Content-Type: application/json" ^
  -d "{\"text\": \"This is an amazing service!\"}"
```

Expected Response:
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

---

## 🎯 Common Issues & Solutions

### Issue: ML Service Not Starting
**Solution:**
```powershell
pip install --upgrade flask flask-cors textblob
python -m textblob.download_corpora lite
```

### Issue: Backend Can't Connect to ML Service
**Solution:**
- Check if Python service is running on port 5001
- Verify `ML_SERVICE_URL=http://localhost:5001` in server/.env
- Try: `netstat -ano | findstr :5001`

### Issue: MongoDB Connection Failed
**Solution:**
- Start MongoDB: `mongod` or use MongoDB Atlas
- Update `MONGO_URI` in server/.env

### Issue: Port Already in Use
**Solution:**
```powershell
# Check what's using the port
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

---

## 🎓 For Project Demonstration

### Show These Key Features:

1. ✅ **AI/ML Integration** - Open browser dev tools, show ML API call in Network tab
2. ✅ **Real-time Analysis** - Submit review and see instant sentiment classification
3. ✅ **Analytics Dashboard** - Show AI-powered statistics (positive/negative counts)
4. ✅ **Sentiment Scoring** - Explain polarity score (-1 to +1)
5. ✅ **Microservices** - Show 3 separate services running

### Prepare These Talking Points:

- "We use **TextBlob NLP library** for sentiment analysis"
- "AI automatically classifies reviews as positive/negative/neutral"
- "Microservices architecture allows ML service to scale independently"
- "Provider ratings auto-update based on sentiment analysis"
- "Can be extended with advanced models like BERT"

---

## 📱 Access Points

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **ML Service:** http://localhost:5001
- **MongoDB:** mongodb://localhost:27017

---

## 🎉 You're Ready!

Open http://localhost:5173 and start testing your AI-powered home services platform!

For detailed documentation, see [README.md](README.md)
