# Suvidhaa (सुविधा) - Your Bridge to Transparent Governance

![Platform Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Frontend](https://img.shields.io/badge/Frontend-React%20Native%20%2F%20Expo-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2F%20Python-green)
![AI](https://img.shields.io/badge/AI-NVIDIA%20%2F%20Llama--4-orange)
![Storage](https://img.shields.io/badge/Storage-Cloudinary%20%2F%20MongoDB-purple)

## 🌟 About Suvidhaa

Suvidhaa is a comprehensive civic platform that empowers Nepali citizens to understand, engage with, and receive solutions from their government through transparent, accessible participation. Built by **RaaStafix** and authored by **Mohsin Raja**.

### The Three Pillars

1. **🔍 UNDERSTAND** (समझाउ - Samjhaau): AI-powered document simplification
2. **⚡ ACT** (कार्य - Kaarya): Questions, suggestions, and grievances
3. **📊 TRACK** (ट्र्याक - Track): Watchlists and transparency dashboards

## 📁 Project Structure

```
Suvidhaa/
├── backend/                     # FastAPI Backend Server
│   ├── server.py               # Main FastAPI application
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Backend environment variables
├── frontend/                    # React Native Mobile App
│   ├── app/                    # Expo Router pages
│   │   ├── index.tsx          # Welcome screen
│   │   ├── user-setup.tsx     # User onboarding
│   │   ├── _layout.tsx        # Root layout
│   │   └── (tabs)/            # Tab navigation
│   │       ├── _layout.tsx    # Tab layout
│   │       ├── understand.tsx # Document processing UI
│   │       ├── act.tsx        # Engagement hub
│   │       ├── track.tsx      # Dashboard & watchlists
│   │       └── profile.tsx    # User profile
│   ├── components/             # Reusable components
│   │   └── UserProfile.tsx    # Profile component
│   ├── services/              # API and external services
│   │   └── api.ts             # API client with axios
│   ├── store/                 # State management
│   │   └── useStore.ts        # Zustand store
│   ├── package.json           # Node.js dependencies
│   ├── .env                   # Frontend environment variables
│   ├── app.json               # Expo configuration
│   ├── tsconfig.json          # TypeScript configuration
│   └── yarn.lock              # Dependency lock file
├── tests/                      # Test files
├── .emergent/                  # Emergent configuration
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── warp.md                     # Detailed documentation
└── test_result.md              # Testing results
```

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.8+)
- **Database**: MongoDB with Motor async driver
- **AI Processing**: NVIDIA AI (Llama-4 Scout model)
- **Storage**: Cloudinary with base64 fallback
- **File Processing**: PyPDF2, python-docx, Pillow

### Frontend
- **Framework**: React Native with Expo (SDK 53)
- **Navigation**: Expo Router with tabs
- **State Management**: Zustand with AsyncStorage
- **UI Components**: React Native Paper
- **Forms**: React Hook Form
- **HTTP Client**: Axios

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18+ and npm/yarn
- **Python**: 3.8+ and pip
- **MongoDB**: Local instance or cloud (MongoDB Atlas)
- **Git**: For version control

### Required API Keys
- **NVIDIA API Key**: For AI document processing
- **Cloudinary Account**: For media storage
  - Cloud name
  - API key 
  - API secret

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Suvidhaa
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables
Create `backend/.env` file:

```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=suvidhaa_db

# NVIDIA AI
NVIDIA_API_KEY=your_nvidia_api_key_here
NVIDIA_MODEL=meta/llama-4-scout-17b-16e-instruct

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

#### Get Your API Keys

**NVIDIA API Key:**
1. Visit [NVIDIA NGC](https://ngc.nvidia.com/)
2. Create an account and get your API key
3. Add to `.env` file

**Cloudinary Setup:**
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Add to `.env` file

### 3. Frontend Setup

#### Install Node.js Dependencies
```bash
cd frontend
yarn install
# or
npm install
```

#### Configure Environment Variables
Create `frontend/.env` file:

```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 4. Database Setup

#### Local MongoDB
```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify MongoDB is running
sudo systemctl status mongodb
```

#### MongoDB Atlas (Cloud Option)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGO_URL` in `backend/.env`

## 🏃‍♂️ Running the Application

### Start Backend Server

```bash
cd backend

# Development mode (auto-reload)
uvicorn server:app --reload --port 8000

# Production mode
uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
```

**Backend will be available at:** http://localhost:8000

**API Documentation:** http://localhost:8000/docs (FastAPI auto-generated)

### Start Frontend App

```bash
cd frontend

# Start Expo development server
yarn start
# or
npm start
```

**Options after starting:**
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Press `w` for web browser
- Scan QR code with Expo Go app on mobile

### 🔄 Development Workflow

#### Terminal Setup (Recommended)
```bash
# Terminal 1 - Backend
cd backend && uvicorn server:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend && yarn start

# Terminal 3 - MongoDB (if local)
mongod
```

## 📱 Mobile Development

### iOS Development
```bash
# Install iOS dependencies
cd frontend
yarn ios

# Or use Expo CLI
Expo start --ios
```

### Android Development
```bash
# Install Android dependencies
cd frontend
yarn android

# Or use Expo CLI
expo start --android
```

### Web Development
```bash
cd frontend
yarn web

# Or use Expo CLI
expo start --web
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/ -v

# Test specific endpoint
curl -X GET http://localhost:8000/api/
```

### Frontend Testing
```bash
cd frontend
yarn test

# Run with coverage
yarn test --coverage
```

### API Testing with curl
```bash
# Test backend health
curl http://localhost:8000/api/

# Test document upload
curl -X POST http://localhost:8000/api/documents/upload \
  -F "file=@sample.pdf" \
  -F "title=Sample Document" \
  -F "document_type=policy"

# Get dashboard stats
curl http://localhost:8000/api/dashboard/stats
```

## 🚦 API Endpoints

### Core Endpoints
- `GET /api/` - API health check
- `POST /api/documents/upload` - Upload and process documents
- `GET /api/documents` - List all documents
- `POST /api/questions` - Submit questions with evidence
- `POST /api/suggestions` - Submit suggestions
- `POST /api/grievances` - File grievances
- `GET /api/dashboard/stats` - Platform statistics

### Full API Documentation
Visit http://localhost:8000/docs when backend is running for interactive API documentation.

## 🔧 Troubleshooting

### Common Issues

#### Backend Issues
```bash
# Port already in use
Error: [Errno 48] Address already in use
Solution: kill -9 $(lsof -t -i:8000)

# MongoDB connection failed
Error: ServerSelectionTimeoutError
Solution: Check MongoDB is running and MONGO_URL is correct

# NVIDIA API key invalid
Error: Unauthorized
Solution: Verify NVIDIA_API_KEY in .env file
```

#### Frontend Issues
```bash
# Metro bundler issues
Solution: yarn start --reset-cache

# Package installation issues
Solution: rm -rf node_modules && yarn install

# iOS simulator issues
Solution: expo install --fix
```

#### Environment Variables
```bash
# Check if .env files exist and are properly formatted
ls -la backend/.env frontend/.env

# Verify no spaces around = in .env files
cat backend/.env
```

## 🌟 Key Features

### UNDERSTAND Pillar
- ✅ Document upload (PDF, DOCX, TXT)
- ✅ NVIDIA AI-powered analysis
- ✅ Multi-language summaries (Nepali/English)
- ✅ Key points extraction
- ✅ Affected groups identification

### ACT Pillar
- ✅ Question submission with evidence
- ✅ Suggestion system with co-signatures
- ✅ Grievance filing with documentation
- ✅ Government office routing

### TRACK Pillar
- ✅ Personal watchlists
- ✅ Dashboard statistics
- ✅ Response rate tracking
- ✅ Resolution monitoring

## 🤝 Contributing

### Development Guidelines
1. Follow code style (Black for Python, Prettier for TypeScript)
2. Add tests for new features
3. Update documentation
4. Create feature branches
5. Submit pull requests

### Code Formatting
```bash
# Backend formatting
cd backend
black .
isort .

# Frontend formatting  
cd frontend
npx prettier --write .
```

## 📄 License

This project is part of the RaaStafix civic technology initiative.

## 🙏 Acknowledgments

- **NVIDIA**: AI processing capabilities
- **Cloudinary**: Media storage and CDN
- **Expo**: Mobile development platform
- **FastAPI**: High-performance web framework
- **MongoDB**: Document database

---

**Built with ❤️ for transparent governance in Nepal**

*For detailed technical documentation, see [warp.md](./warp.md)*
