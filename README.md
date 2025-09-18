# EMT Triage Training App

An AI-powered mobile application for Emergency Medical Technician (EMT) triage training, featuring interactive scenarios and intelligent assessment systems.

## 🚑 Project Overview

The EMT Triage Training App is designed to provide comprehensive training for EMT students and professionals through AI-generated scenarios, real-time assessment, and personalized feedback. The application simulates emergency medical situations to help users develop critical triage decision-making skills.

### Key Features

- **AI-Generated Training Scenarios**: Dynamic medical emergency scenarios powered by multiple AI models
- **Interactive Triage Assessment**: Multiple-choice and open-response questions with intelligent evaluation
- **Progress Tracking**: Comprehensive analytics for students and instructors
- **Multi-Difficulty Levels**: Beginner, intermediate, and advanced training paths
- **Real-time Feedback**: Instant AI-powered feedback and coaching
- **Cross-Platform**: Available on iOS, Android, and web platforms

**Content Warning**: This application contains realistic emergency medical training scenarios that may include:
- Descriptions of traumatic injuries, wounds, and severe medical conditions
- Visual medical content including graphic images of injuries, medical procedures, and emergency interventions
- Simulated emergency situations involving life-threatening conditions and medical distress
- Medical terminology and procedures related to trauma care and emergency medicine
- Realistic depictions of emergency scenarios that may be disturbing or triggering
- Content designed for medical education that may not be suitable for general audiences

This application is intended exclusively for individuals pursuing or engaged in emergency medical training. Users sensitive to medical content, graphic imagery, or emergency situations should exercise discretion. If you experience distress while using this application, discontinue use immediately.

## 👥 Development Team - CodeBlue Collective

- **Meghan Lawrence** - Frontend Development & UI/UX Design
- **Sophia Worsham** - Backend Development & Database Architecture  
- **Daniel Hall** - AI Integration & System Architecture

## 🛠 Technical Stack

### Frontend
- **React Native** with Expo
- **Expo Router** for navigation
- **React Native Paper** for UI components
- **Expo Linear Gradient** for styling

### Backend & Database
- **Firebase Authentication** - User management and security
- **Cloud Firestore** - Real-time database for scenarios and user data
- **Firebase Storage** - File and media storage
- **Firebase Security Rules** - Data access control

### AI Integration
- **OpenAI GPT-4** - Primary scenario generation and fallback system
- **BioBERT** (Hugging Face) - Medical text understanding and entity recognition
- **DialoGPT** (Hugging Face) - Conversational AI for interactive feedback
- **Sentence Transformers** (Hugging Face) - Response similarity assessment

### Development Tools
- **Visual Studio Code** - Primary development environment
- **Git & GitHub** - Version control and collaboration
- **Firebase Console** - Database and service management
- **Expo CLI** - React Native development and testing

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Expo CLI**: `npm install -g @expo/cli`
- **Git** for version control
- **Mobile device** with Expo Go app installed, or
- **iOS Simulator** / **Android Emulator** for testing

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/KrakenDnD/emt-triage-training-app.git
cd emt-triage-training-app/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `frontend/` directory:

```bash
# AI Service API Keys
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
EXPO_PUBLIC_HUGGINGFACE_API_KEY=your_huggingface_token_here

# Application Settings
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_MAX_DAILY_AI_REQUESTS=100
```

### 4. Firebase Setup
The Firebase configuration is already included in `firebaseConfig.js`. The project uses:
- **Project ID**: `emt-triage-training-app`
- **Authentication**: Email/Password
- **Firestore**: Multi-collection database structure
- **Storage**: File and media storage

### 5. Database Initialization
Run the app and use the "Initialize AI Database" button to set up the database schema.

## 🔧 Development Commands

### Start Development Server
```bash
npx expo start
```

### Run on Specific Platforms
```bash
npx expo start --ios        # iOS Simulator
npx expo start --android    # Android Emulator
npx expo start --web        # Web Browser
```

### Build for Production
```bash
expo build:android    # Android APK
expo build:ios        # iOS App
```

## 📱 Usage Instructions

### For Students
1. **Sign Up**: Create an account with email and password
2. **Choose Training Level**: Select beginner, intermediate, or advanced
3. **Complete Scenarios**: Work through AI-generated medical emergency scenarios
4. **Receive Feedback**: Get instant AI-powered assessment and recommendations
5. **Track Progress**: Monitor your improvement over time

### For Instructors
1. **Access Dashboard**: View student progress and performance analytics
2. **Manage Content**: Create and modify training scenarios
3. **Monitor Classes**: Track student engagement and completion rates
4. **Generate Reports**: Export detailed performance reports

### Demo Scenarios
The app includes pre-loaded scenarios covering:
- **Cardiac Emergencies**: Chest pain, cardiac arrest, arrhythmias
- **Trauma Cases**: Motor vehicle accidents, falls, penetrating injuries
- **Respiratory Issues**: Asthma, COPD exacerbation, airway obstruction
- **Pediatric Emergencies**: Age-specific assessment and treatment protocols

## 🤖 AI Integration Details

### Model Usage Strategy
1. **Primary Generation**: OpenAI GPT-4 for scenario creation and complex assessments
2. **Medical Accuracy**: BioBERT for medical entity recognition and clinical validation
3. **Interactive Feedback**: DialoGPT for conversational responses and coaching
4. **Response Assessment**: Sentence Transformers for semantic similarity analysis

### Cost Management
- **Caching System**: Generated content is stored in Firestore to minimize API calls
- **Request Limits**: Daily limits per user to control costs
- **Smart Fallbacks**: Graceful degradation when API limits are reached

### Performance Monitoring
- Real-time tracking of API response times
- Success/failure rate monitoring
- Cost estimation and budget alerts

## 📊 Database Schema

### Core Collections
- `users/` - User profiles and authentication data
- `aiScenarios/` - AI-generated training scenarios
- `trainingSessions/` - User session data and results
- `userResponseAssessments/` - Detailed AI analysis of user responses
- `aiServices/` - Configuration for AI model endpoints
- `aiModelMetrics/` - Performance tracking for AI services

## 🔒 Security & Privacy

### Data Protection
- **Firebase Security Rules**: Authenticated access only, users can only access their own data
- **API Key Management**: Environment variables for sensitive credentials
- **Medical Data Compliance**: No real patient data - training simulations only

### Privacy Considerations
- User responses may be processed by third-party AI services
- All data stored according to Firebase privacy policies
- No personal medical information should be entered

## 📈 Development Timeline

- **Week 1-2**: Project setup, Firebase integration, basic authentication
- **Week 3-4**: AI service integration and database architecture
- **Week 5-6**: Core training functionality and scenario generation
- **Week 7-8**: User interface refinement and progress tracking
- **Week 9-10**: Testing, optimization, and deployment preparation

## 🧪 Testing

### Manual Testing
- Test authentication flow (signup/login)
- Verify scenario generation with different difficulty levels
- Check AI response assessment accuracy
- Validate progress tracking functionality

### Performance Testing
- Monitor AI API response times
- Test app performance with multiple concurrent users
- Verify database query efficiency

## 🚀 Deployment

### Development Deployment
- **Expo Go**: For development and testing
- **Web Version**: Available at local development server

### Production Deployment
- **App Stores**: iOS App Store and Google Play Store (planned)
- **Web Hosting**: Firebase Hosting for web version
- **Backend**: Firebase services handle backend infrastructure

## 📝 Known Issues & Limitations

- AI API rate limits may affect user experience during peak usage
- Generated scenarios should be reviewed for medical accuracy
- Response times may vary based on AI service availability
- Free tier limitations on AI API usage

## 🤝 Contributing

This is an academic project for coursework. For questions or suggestions:

1. Contact team members directly
2. Create issues in the GitHub repository
3. Follow standard Git workflow for contributions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Services
- OpenAI GPT-4: Subject to OpenAI Terms of Service
- Hugging Face Models: Subject to individual model licenses
- Firebase: Subject to Google Firebase Terms of Service

## ⚠️ Medical Disclaimer

**This application is for educational purposes only and should not be used for actual medical decision-making. Always consult qualified medical professionals for real emergencies.**

## 📞 Support & Contact

For technical support or questions about this project:

- **GitHub Issues**: [Project Issues Page](https://github.com/KrakenDnD/emt-triage-training-app/issues)
- **Team Email**: Contact via GitHub profiles
- **Academic Supervisor**: [Course Instructor Information]

---

**Version**: 0.1.0 - Development Phase (Week 1 of 10)
**Last Updated**: January 2025
