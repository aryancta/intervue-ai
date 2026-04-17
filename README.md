# IntervueAI

> AI-powered mock interviews with real-time feedback, personalized study plans, and resume-aligned questions.

![IntervueAI Screenshot](https://via.placeholder.com/800x400/3b82f6/ffffff?text=IntervueAI+Landing+Page)

## 🚀 Overview

IntervueAI solves a critical problem for job seekers, especially in India's competitive market with 1.5M+ engineering graduates annually. Traditional interview prep is generic and doesn't adapt to individual experience or provide structured feedback. 

**Key Innovation:** Resume-to-interview alignment that parses your resume and generates questions directly referencing your projects, skills, and experience - making practice feel like the real interview.

### ✨ Features

- **🤖 AI Mock Interviews**: Conversational interview sessions with follow-up questions
- **📄 Resume Alignment**: Personalized questions based on your actual resume
- **📊 Real-time Feedback**: Detailed scoring on clarity, depth, relevance, and communication
- **📈 Progress Analytics**: Track improvement with charts and performance trends
- **📚 Personalized Study Plans**: AI-generated weekly study plans based on weak areas
- **🏆 Community Leaderboard**: Gamified experience with rankings and achievements
- **🎯 Domain Expertise**: Specialized questions for SWE, PM, Data Science, System Design, and more

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI, Framer Motion
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: SQLite with Drizzle ORM
- **AI**: OpenAI API (GPT-4) with mock fallbacks
- **Charts**: Recharts for data visualization
- **Deployment**: Docker containerization

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker (for containerized deployment)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/aryancta/intervue-ai.git
cd intervue-ai

# Build and run with Docker
docker build -t intervue-ai .
docker run -p 3000:3000 intervue-ai
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/aryancta/intervue-ai.git
cd intervue-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Set up the database
npm run db:migrate

# Seed with sample data (optional)
npm run seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📝 Demo Credentials

For testing the full application:
- **Email**: demo@example.com  
- **Password**: demo123

## 🗂️ Project Structure

```
intervue-ai/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Main dashboard
│   │   ├── interview/      # Interview session pages
│   │   ├── onboarding/     # User onboarding flow
│   │   └── api/           # API routes
│   ├── components/         # Reusable components
│   │   └── ui/            # UI component library
│   ├── lib/               # Utility libraries
│   │   ├── ai/            # AI integration & mocks
│   │   ├── auth.ts        # NextAuth configuration
│   │   └── db/            # Database setup
│   └── types/             # TypeScript definitions
├── scripts/               # Database and utility scripts
├── drizzle/              # Database migrations
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=./sqlite.db

# OpenAI (optional - uses mock responses if not provided)
OPENAI_API_KEY=your-openai-api-key
```

### Database Setup

```bash
# Generate migrations
npm run db:generate

# Run migrations  
npm run db:migrate

# View database in Drizzle Studio
npm run db:studio
```

## 🎯 Core Features Walkthrough

### 1. Landing Page
- Hero section with compelling value proposition
- Feature highlights and social proof
- Domain showcase and testimonials
- Fully responsive design

### 2. Authentication
- Email/password registration with validation
- Password strength indicator
- Guest mode for trying without registration
- Secure JWT-based sessions

### 3. Onboarding Flow
- 4-step wizard: Role → Experience → Resume → Goals
- Interactive domain selection
- Optional resume upload with parsing
- Weekly practice goal setting

### 4. Dashboard
- Performance analytics with charts
- Quick interview start
- Recent sessions and study plan preview
- Streak tracking and motivation

### 5. Interview Session
- Immersive dark interface
- Real-time question flow
- AI-powered answer evaluation
- Comprehensive feedback with scoring

### 6. Results & Analytics
- Detailed performance breakdown
- Strengths and improvement areas
- Question-by-question review
- Progress tracking over time

## 🤖 AI Integration

The app supports both OpenAI integration and intelligent mock responses:

### OpenAI Mode (Production)
- Uses GPT-4o-mini for question generation
- Contextual follow-up questions
- Detailed answer evaluation

### Mock Mode (Development/Fallback)
- Deterministic question generation
- Rule-based answer scoring
- Consistent performance simulation

## 📊 Database Schema

Key entities:
- **Users**: Authentication and profile data
- **Sessions**: Interview session records
- **Questions**: Individual Q&A pairs with scoring
- **Question Bank**: Curated question library
- **Study Plans**: Personalized improvement plans
- **User Stats**: Performance analytics

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Docker Production Build

```bash
# Build production image
docker build -t intervue-ai:latest .

# Run with custom port
docker run -p 8080:3000 -e PORT=3000 intervue-ai:latest

# Run with environment file
docker run --env-file .env.production -p 3000:3000 intervue-ai:latest
```

### Traditional Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🛣️ Roadmap

- [ ] **Mobile App**: React Native version
- [ ] **Video Interviews**: WebRTC-based video practice
- [ ] **Voice Input**: Speech-to-text integration
- [ ] **Team Features**: Company accounts and team leaderboards
- [ ] **Advanced AI**: GPT-4 integration and custom models
- [ ] **Content Library**: Expanded question bank and study materials

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the global developer community
- Inspired by the need for better interview preparation tools
- Special thanks to the open-source community

## 📞 Support

- 📧 Email: support@intervueai.com
- 🐛 Issues: [GitHub Issues](https://github.com/aryancta/intervue-ai/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/aryancta/intervue-ai/discussions)

---

**Built by [Aryan Choudhary](mailto:aryancta@gmail.com)** - Making interview preparation accessible and effective for everyone! 🚀