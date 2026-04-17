// Mock AI responses for when OpenAI API is not configured
export const mockQuestions = {
  swe: {
    junior: [
      "Tell me about a challenging coding problem you've solved recently.",
      "How do you approach debugging a piece of code that isn't working?",
      "Explain the difference between a class and an object.",
      "What is your experience with version control systems like Git?",
      "Describe a time when you had to learn a new programming language or framework."
    ],
    mid: [
      "How do you design a system that needs to handle high traffic?",
      "Tell me about a time when you had to optimize the performance of an application.",
      "How do you ensure code quality in a team environment?",
      "Explain how you would approach migrating a legacy system to a modern architecture.",
      "Describe your experience with automated testing and CI/CD pipelines."
    ],
    senior: [
      "How do you make technical decisions that affect the entire engineering team?",
      "Describe a system you architected that had to scale to millions of users.",
      "How do you balance technical debt with feature development?",
      "Tell me about a time when you had to mentor junior developers through a complex project.",
      "How do you evaluate and introduce new technologies into your team's stack?"
    ]
  },
  pm: {
    junior: [
      "How do you prioritize features when you have limited development resources?",
      "Tell me about a time when you had to gather requirements from stakeholders.",
      "How do you measure the success of a product feature?",
      "Describe your experience with user research and how it influenced product decisions.",
      "What frameworks do you use for product planning and roadmapping?"
    ],
    mid: [
      "How do you handle conflicting priorities between different stakeholders?",
      "Describe a product launch you managed from conception to release.",
      "How do you work with engineering teams to estimate and plan development work?",
      "Tell me about a time when a product feature didn't perform as expected.",
      "How do you balance user needs with business objectives?"
    ],
    senior: [
      "How do you develop and communicate product strategy across the organization?",
      "Describe how you've built and managed product teams.",
      "How do you make decisions about product direction with incomplete information?",
      "Tell me about a time when you had to pivot a product strategy.",
      "How do you ensure product-market fit for new initiatives?"
    ]
  },
  ds: {
    junior: [
      "Explain how you would approach a new data science project.",
      "Tell me about a time when you had to clean and prepare messy data.",
      "How do you validate the results of a machine learning model?",
      "Describe your experience with statistical analysis and hypothesis testing.",
      "What tools and libraries do you typically use for data analysis?"
    ],
    mid: [
      "How do you design and implement A/B tests for product features?",
      "Describe a machine learning pipeline you've built in production.",
      "How do you communicate complex data insights to non-technical stakeholders?",
      "Tell me about a time when you had to handle bias in a dataset or model.",
      "How do you approach feature engineering for a new ML model?"
    ],
    senior: [
      "How do you build and lead data science teams?",
      "Describe how you've scaled machine learning systems for production use.",
      "How do you balance model accuracy with interpretability in business contexts?",
      "Tell me about a data science initiative you led that drove significant business impact.",
      "How do you establish data governance and ethics standards across an organization?"
    ]
  }
};

export const mockFeedback = {
  generateFeedback: (answer: string, questionType: string) => {
    const answerLength = answer.split(' ').length;
    const hasExamples = answer.toLowerCase().includes('example') || answer.toLowerCase().includes('experience');
    const hasMetrics = /\d+/.test(answer);
    
    // Generate scores based on answer characteristics
    const clarity = Math.min(100, Math.max(20, 60 + (answerLength > 50 ? 20 : 0) + (hasExamples ? 10 : 0)));
    const depth = Math.min(100, Math.max(15, 50 + (answerLength > 80 ? 25 : 0) + (hasExamples ? 15 : 0)));
    const relevance = Math.min(100, Math.max(30, 65 + (answerLength > 30 ? 15 : 0) + (hasMetrics ? 10 : 0)));
    const communication = Math.min(100, Math.max(25, 55 + (answerLength > 40 ? 20 : 0) + (hasExamples ? 15 : 0)));
    
    const totalScore = Math.round((clarity + depth + relevance + communication) / 4);
    
    return {
      clarity: {
        score: clarity,
        tip: clarity < 70 ? "Try to structure your answer more clearly with specific examples." : "Good clarity in your response!"
      },
      depth: {
        score: depth,
        tip: depth < 70 ? "Provide more technical details and depth in your explanation." : "Great technical depth!"
      },
      relevance: {
        score: relevance,
        tip: relevance < 70 ? "Make sure to directly address the question asked." : "Very relevant response!"
      },
      communication: {
        score: communication,
        tip: communication < 70 ? "Consider using more specific examples to illustrate your points." : "Excellent communication!"
      },
      totalScore,
      overallFeedback: totalScore >= 80 
        ? "Excellent answer! You demonstrated strong knowledge and communication skills."
        : totalScore >= 60 
        ? "Good response with room for improvement. Consider adding more specific examples."
        : "Your answer could benefit from more structure and specific examples. Practice explaining technical concepts clearly."
    };
  },

  generateFollowUp: (answer: string, originalQuestion: string) => {
    const followUps = [
      "Can you give me a specific example of when you encountered this situation?",
      "How did you measure the success of that approach?",
      "What would you do differently if you faced a similar situation again?",
      "How did you communicate this to stakeholders?",
      "What challenges did you face while implementing this solution?"
    ];
    
    return followUps[Math.floor(Math.random() * followUps.length)];
  }
};

export const generateMockQuestions = (domain: string, difficulty: string, count: number = 5) => {
  const domainQuestions = mockQuestions[domain as keyof typeof mockQuestions] || mockQuestions.swe;
  const difficultyQuestions = domainQuestions[difficulty.toLowerCase() as keyof typeof domainQuestions] || domainQuestions.mid;
  
  // Shuffle and take the requested number
  const shuffled = [...difficultyQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};