const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const db = new Database('sqlite.db');

async function seed() {
  console.log('🌱 Seeding database...');
  
  try {
    // Create demo users
    const demoPassword = await bcrypt.hash('demo123', 10);
    
    const users = [
      {
        id: randomUUID(),
        name: 'Demo User',
        email: 'demo@example.com',
        password: demoPassword,
        targetRole: 'swe',
        experienceLevel: 'mid',
        weeklyGoal: 5,
        onboardingComplete: 1,
      },
      {
        id: randomUUID(),
        name: 'Alex Chen',
        email: 'alex@example.com',
        password: demoPassword,
        targetRole: 'swe',
        experienceLevel: 'senior',
        weeklyGoal: 7,
        onboardingComplete: 1,
      }
    ];
    
    // Insert users
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password, target_role, experience_level, weekly_goal, onboarding_complete)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const user of users) {
      insertUser.run(
        user.id, user.name, user.email, user.password, 
        user.targetRole, user.experienceLevel, user.weeklyGoal, user.onboardingComplete
      );
      console.log(`✅ Created user: ${user.name} (${user.email})`);
      
      // Create user stats
      db.prepare(`
        INSERT INTO user_stats (id, user_id, total_sessions, average_score, best_score, current_streak)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(randomUUID(), user.id, 0, 0, 0, 0);
    }
    
    // Seed question bank
    const questions = [
      // Software Engineering
      {
        domain: 'swe',
        difficulty: 'junior',
        questionText: 'Explain the difference between a stack and a queue data structure.',
        questionType: 'technical',
        topic: 'Data Structures',
        sampleAnswer: 'A stack follows Last-In-First-Out (LIFO) principle, while a queue follows First-In-First-Out (FIFO). Stack operations are push/pop, queue operations are enqueue/dequeue.',
      },
      {
        domain: 'swe',
        difficulty: 'mid',
        questionText: 'How would you design a caching system for a web application?',
        questionType: 'system-design',
        topic: 'System Design',
        sampleAnswer: 'Consider cache levels (browser, CDN, application, database), cache strategies (LRU, TTL), cache invalidation, and distributed caching solutions like Redis.',
      },
      {
        domain: 'swe',
        difficulty: 'senior',
        questionText: 'Describe how you would architect a system to handle 1 million concurrent users.',
        questionType: 'architecture',
        topic: 'Scalability',
        sampleAnswer: 'Use load balancers, microservices architecture, horizontal scaling, database sharding, caching layers, and CDNs. Consider async processing and eventual consistency.',
      },
      
      // Product Management
      {
        domain: 'pm',
        difficulty: 'junior',
        questionText: 'How do you prioritize features in a product roadmap?',
        questionType: 'strategy',
        topic: 'Product Strategy',
        sampleAnswer: 'Use frameworks like RICE (Reach, Impact, Confidence, Effort) or MoSCoW. Consider user value, business impact, technical feasibility, and resource constraints.',
      },
      {
        domain: 'pm',
        difficulty: 'mid',
        questionText: 'Walk me through how you would launch a new feature.',
        questionType: 'process',
        topic: 'Product Launch',
        sampleAnswer: 'Research and validate, define success metrics, create launch plan, coordinate with engineering and design, prepare go-to-market strategy, launch, monitor, and iterate.',
      },
      
      // Data Science
      {
        domain: 'ds',
        difficulty: 'junior',
        questionText: 'Explain the bias-variance tradeoff in machine learning.',
        questionType: 'technical',
        topic: 'Machine Learning',
        sampleAnswer: 'Bias is error from overly simplistic assumptions. Variance is error from sensitivity to training data. High bias = underfitting, high variance = overfitting. Need to balance both.',
      },
      {
        domain: 'ds',
        difficulty: 'mid',
        questionText: 'How would you design an A/B test for a new recommendation algorithm?',
        questionType: 'experimental-design',
        topic: 'Experimentation',
        sampleAnswer: 'Define hypothesis, choose metrics (CTR, engagement), determine sample size, randomize users, control for confounding variables, run test, analyze results with statistical significance.',
      }
    ];
    
    const insertQuestion = db.prepare(`
      INSERT INTO question_bank (id, domain, difficulty, question_text, question_type, topic, sample_answer)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const question of questions) {
      insertQuestion.run(
        randomUUID(),
        question.domain,
        question.difficulty,
        question.questionText,
        question.questionType,
        question.topic,
        question.sampleAnswer
      );
    }
    
    console.log(`✅ Seeded ${questions.length} questions`);
    
    // Create a sample session for the demo user
    const demoUserId = users[0].id;
    const sessionId = randomUUID();
    
    db.prepare(`
      INSERT INTO sessions (id, user_id, domain, difficulty, question_count, status, current_question_index, total_score, started_at, completed_at, duration_minutes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      sessionId, demoUserId, 'swe', 'mid', 3, 'completed', 2, 85,
      new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      new Date().toISOString(), // now
      15
    );
    
    // Add sample questions to the session
    const sampleQuestions = [
      {
        sessionId,
        questionIndex: 0,
        questionText: 'Explain the difference between SQL and NoSQL databases.',
        userAnswer: 'SQL databases are relational with fixed schemas and ACID properties. NoSQL databases are flexible, schema-less, and designed for horizontal scaling.',
        feedback: {
          clarity: { score: 85, tip: 'Good clear explanation with key differences highlighted.' },
          depth: { score: 80, tip: 'Could provide more specific examples of use cases.' },
          relevance: { score: 90, tip: 'Directly answered the question with relevant points.' },
          communication: { score: 88, tip: 'Well articulated response with good structure.' },
          totalScore: 86,
          overallFeedback: 'Strong answer covering the main differences between SQL and NoSQL databases.'
        }
      },
      {
        sessionId,
        questionIndex: 1,
        questionText: 'How do you handle errors in a distributed system?',
        userAnswer: 'Use circuit breakers, retry mechanisms with exponential backoff, timeouts, and proper logging. Implement graceful degradation and have monitoring in place.',
        feedback: {
          clarity: { score: 90, tip: 'Excellent structure and clear technical explanations.' },
          depth: { score: 88, tip: 'Great coverage of multiple error handling strategies.' },
          relevance: { score: 85, tip: 'All points directly relate to distributed system error handling.' },
          communication: { score: 87, tip: 'Technical concepts explained clearly and concisely.' },
          totalScore: 88,
          overallFeedback: 'Comprehensive answer demonstrating strong understanding of distributed systems.'
        }
      }
    ];
    
    const insertSessionQuestion = db.prepare(`
      INSERT INTO questions (id, session_id, question_index, question_text, question_type, user_answer, clarity_score, depth_score, relevance_score, communication_score, total_score, feedback, answered_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const q of sampleQuestions) {
      insertSessionQuestion.run(
        randomUUID(),
        q.sessionId,
        q.questionIndex,
        q.questionText,
        'main',
        q.userAnswer,
        q.feedback.clarity.score,
        q.feedback.depth.score,
        q.feedback.relevance.score,
        q.feedback.communication.score,
        q.feedback.totalScore,
        JSON.stringify(q.feedback),
        new Date().toISOString()
      );
    }
    
    console.log('✅ Created sample session with questions');
    
    // Update user stats
    db.prepare(`
      UPDATE user_stats 
      SET total_sessions = 1, average_score = 85, best_score = 88, current_streak = 1, last_activity_date = ?
      WHERE user_id = ?
    `).run(new Date().toISOString(), demoUserId);
    
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('Demo credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: demo123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    db.close();
  }
}

seed();