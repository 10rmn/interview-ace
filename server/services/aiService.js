const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
const preferredModelName = process.env.GEMINI_MODEL;
let cachedModelName = null;
let lastListModelsError = null;

const getModelBaseName = (name) => String(name || '').replace(/^models\//, '');

const listModels = async () => {
  if (!geminiApiKey) return [];

  const endpoints = [
    'https://generativelanguage.googleapis.com/v1beta/models',
    'https://generativelanguage.googleapis.com/v1/models',
  ];

  for (const url of endpoints) {
    try {
      const { data } = await axios.get(url, {
        params: { key: geminiApiKey },
        timeout: 15000,
      });
      lastListModelsError = null;
      return data?.models || [];
    } catch (e) {
      lastListModelsError = e;
      // try next endpoint
    }
  }

  return [];
};

const resolveModelName = async () => {
  if (cachedModelName) return cachedModelName;

  const fallbackCandidates = [
    preferredModelName,
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
  ].filter(Boolean);

  const models = await listModels();
  const supported = models
    .filter((m) => Array.isArray(m?.supportedGenerationMethods))
    .filter((m) => m.supportedGenerationMethods.includes('generateContent'))
    .map((m) => ({
      name: getModelBaseName(m.name),
      displayName: m.displayName,
    }));

  const supportedNames = new Set(supported.map((m) => m.name));
  for (const candidate of fallbackCandidates) {
    const base = getModelBaseName(candidate);
    if (supportedNames.has(base)) {
      cachedModelName = base;
      return cachedModelName;
    }
  }

  // Otherwise pick the first supported Gemini model
  const gemini = supported.find((m) => m.name.toLowerCase().includes('gemini'));
  if (gemini?.name) {
    cachedModelName = gemini.name;
    return cachedModelName;
  }

  if (models.length === 0) {
    const listModelsMessage =
      lastListModelsError?.response?.data?.error?.message ||
      lastListModelsError?.message ||
      'ListModels returned no data';
    throw new Error(
      'No Gemini models available for this API key. ' +
        'Please verify your GEMINI_API_KEY has access to the Gemini API and that the Generative Language API is enabled. ' +
        'ListModels error: ' +
        listModelsMessage
    );
  }

  throw new Error(
    'No models supporting generateContent were returned by ListModels for this API key.'
  );
};

const isModelNotFoundError = (err) => {
  const msg = String(err?.message || '');
  return (
    msg.includes('404') &&
    (msg.includes('models/') || msg.includes('models/gemini') || msg.includes('is not found'))
  );
};

const isQuotaExceededError = (err) => {
  const msg = String(err?.message || '');
  const status =
    err?.status ||
    err?.statusCode ||
    err?.response?.status ||
    err?.cause?.status ||
    err?.cause?.statusCode ||
    err?.error?.code;
  return (
    status === 429 ||
    /\b429\b/.test(msg) ||
    /too many requests/i.test(msg) ||
    /quota exceeded/i.test(msg) ||
    /rate limit/i.test(msg)
  );
};

const extractRetryAfterSeconds = (err) => {
  const details = err?.errorDetails;
  if (Array.isArray(details)) {
    const retryInfo = details.find(
      (d) => d && typeof d === 'object' && String(d['@type'] || '').includes('RetryInfo')
    );
    const retryDelay = retryInfo?.retryDelay;
    if (typeof retryDelay === 'string') {
      const m = retryDelay.match(/(\d+(?:\.\d+)?)s/);
      if (m) return Math.ceil(Number(m[1]));
    }
  }

  const msg = String(err?.message || '');
  const m1 = msg.match(/retry in\s+(\d+(?:\.\d+)?)s/i);
  if (m1) return Math.ceil(Number(m1[1]));
  const m1b = msg.match(/please retry in\s+(\d+(?:\.\d+)?)s/i);
  if (m1b) return Math.ceil(Number(m1b[1]));
  const m2 = msg.match(/retryDelay"\s*:\s*"(\d+)s"/i);
  if (m2) return Math.ceil(Number(m2[1]));
  const headerRetry = err?.response?.headers?.['retry-after'];
  if (headerRetry && !Number.isNaN(Number(headerRetry))) return Math.ceil(Number(headerRetry));
  return null;
};

const fallbackQuestionsFor = (role, difficulty) => {
  const byRole = {
    Frontend: [
      { question: 'Explain the difference between flexbox and CSS grid and when you would use each.', topic: 'CSS Layout' },
      { question: 'What is the virtual DOM and why is it useful?', topic: 'React Fundamentals' },
      { question: 'How do you improve web performance on the client side?', topic: 'Performance' },
      { question: 'What are CORS and preflight requests?', topic: 'Web Security' },
      { question: 'Explain debouncing vs throttling with examples.', topic: 'JavaScript' },
    ],
    Backend: [
      { question: 'Design a REST API for a simple todo application. What endpoints would you create?', topic: 'API Design' },
      { question: 'What is the difference between authentication and authorization?', topic: 'Security' },
      { question: 'How would you handle rate limiting in an API?', topic: 'Scalability' },
      { question: 'Explain indexes in databases and trade-offs.', topic: 'Databases' },
      { question: 'How do you ensure idempotency in distributed systems?', topic: 'Distributed Systems' },
    ],
    DSA: [
      { question: 'Explain time complexity and space complexity with an example.', topic: 'Complexity' },
      { question: 'How do you detect a cycle in a linked list?', topic: 'Linked List' },
      { question: 'Explain BFS vs DFS and typical use cases.', topic: 'Graphs' },
      { question: 'Given an array, find the maximum subarray sum.', topic: 'Arrays' },
      { question: 'What is dynamic programming and when should you use it?', topic: 'DP' },
    ],
    HR: [
      { question: 'Tell me about yourself and what you are looking for in your next role.', topic: 'Introduction' },
      { question: 'Describe a time you handled conflict in a team.', topic: 'Teamwork' },
      { question: 'What are your strengths and weaknesses?', topic: 'Self-awareness' },
      { question: 'Why do you want to work here?', topic: 'Motivation' },
      { question: 'Describe a challenging situation and how you solved it.', topic: 'Problem Solving' },
    ],
  };

  const base = byRole[role] || byRole.Frontend;
  const count = difficulty === 'Easy' ? 5 : difficulty === 'Medium' ? 7 : 10;
  const repeated = [];
  while (repeated.length < count) {
    repeated.push(...base);
  }
  return repeated.slice(0, count);
};

class AIService {
  /**
   * Generate interview questions based on role and difficulty
   * @param {string} role - Frontend, Backend, DSA, HR
   * @param {string} difficulty - Easy, Medium, Hard
   * @param {string} resumeText - Optional resume text for customization
   * @returns {Promise<Array>} Array of questions
   */
  async generateQuestions(role, difficulty, resumeText = null) {
    try {
      if (!genAI) {
        throw new Error('GEMINI_API_KEY is not configured');
      }
      let prompt = this.buildQuestionPrompt(role, difficulty, resumeText);

      let modelName = await resolveModelName();
      let model = genAI.getGenerativeModel({ model: modelName });
      let result;
      try {
        result = await model.generateContent(prompt);
      } catch (e) {
        if (isModelNotFoundError(e)) {
          cachedModelName = null;
          modelName = await resolveModelName();
          model = genAI.getGenerativeModel({ model: modelName });
          result = await model.generateContent(prompt);
        } else {
          throw e;
        }
      }
      const response = await result.response;
      const content = response.text();

      // Parse JSON response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response as JSON');
      }

      const questions = JSON.parse(jsonMatch[0]);
      return questions.slice(0, 10); // Return max 10 questions
    } catch (error) {
      if (isQuotaExceededError(error)) {
        const retryAfterSeconds = extractRetryAfterSeconds(error);
        const fallback = fallbackQuestionsFor(role, difficulty);
        fallback.retryAfterSeconds = retryAfterSeconds;
        fallback.fallback = true;
        return fallback;
      }
      console.error('Error generating questions:', error);
      throw new Error('Failed to generate questions: ' + error.message);
    }
  }

  /**
   * Evaluate user answer and provide feedback
   * @param {string} question - The interview question
   * @param {string} userAnswer - User's answer
   * @param {string} role - Interview role for context
   * @returns {Promise<Object>} Feedback and scores
   */
  async evaluateAnswer(question, userAnswer, role = 'General') {
    try {
      if (!genAI) {
        throw new Error('GEMINI_API_KEY is not configured');
      }
      const prompt = `
You are an expert technical interviewer. Evaluate the following answer to an interview question.

Question: ${question}
User's Answer: ${userAnswer}
Interview Role: ${role}

Provide a detailed evaluation in JSON format with the following structure:
{
  "feedback": "Detailed constructive feedback",
  "score": <0-100>,
  "clarity": <0-100>,
  "technicalAccuracy": <0-100>,
  "confidence": <0-100>,
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "suggestedTopics": ["topic1", "topic2"]
}

Be constructive and encouraging in your feedback.`;

      const modelName = await resolveModelName();
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse evaluation response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      if (isQuotaExceededError(error)) {
        const retryAfterSeconds = extractRetryAfterSeconds(error);
        return {
          aiUnavailable: true,
          retryAfterSeconds,
          feedback:
            'AI evaluation is temporarily unavailable due to rate limits. Please try again later.',
          score: 0,
          clarity: 0,
          technicalAccuracy: 0,
          confidence: 0,
          strengths: [],
          areasForImprovement: [],
        };
      }
      console.error('Error evaluating answer:', error);
      throw new Error('Failed to evaluate answer: ' + error.message);
    }
  }

  /**
   * Generate follow-up question based on performance
   * @param {Array} previousQuestions - Previous questions and answers
   * @param {string} role - Interview role
   * @param {string} difficulty - Current difficulty level
   * @returns {Promise<Object>} Follow-up question
   */
  async generateFollowUp(previousQuestions, role, difficulty) {
    try {
      if (!genAI) {
        throw new Error('GEMINI_API_KEY is not configured');
      }
      // Find weak areas
      const weakAreas = this.identifyWeakAreas(previousQuestions);

      const prompt = `
You are an expert ${role} interviewer. Based on the candidate's previous performance, generate a follow-up question.

Previous Questions and Scores:
${previousQuestions
  .map(
    (q, i) =>
      `${i + 1}. Q: ${q.questionText}\nScore: ${q.score}\nTopic: ${q.topic}`
  )
  .join('\n')}

Weak Areas: ${weakAreas.join(', ')}
Difficulty Level: ${difficulty}

Generate a follow-up question that helps assess understanding in one of the weak areas. 
Return as JSON:
{
  "question": "The question text",
  "topic": "Topic being assessed"
}`;

      const modelName = await resolveModelName();
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse follow-up response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      if (isQuotaExceededError(error)) {
        return {
          question: 'What would you improve in your previous answer if you had more time?',
          topic: 'Reflection',
        };
      }
      console.error('Error generating follow-up:', error);
      throw new Error('Failed to generate follow-up: ' + error.message);
    }
  }

  /**
   * Extract text from resume (mock implementation)
   * In production, use pdf-parse or similar library
   * @param {Buffer} resumeBuffer - PDF buffer
   * @returns {Promise<string>} Extracted text
   */
  async extractResumeText(resumeBuffer) {
    try {
      // Mock implementation - in production use pdf-parse
      // const pdfParse = require('pdf-parse');
      // const data = await pdfParse(resumeBuffer);
      // return data.text;

      // For now, return a mock response
      return 'Resume text extracted successfully';
    } catch (error) {
      console.error('Error extracting resume:', error);
      throw new Error('Failed to extract resume text: ' + error.message);
    }
  }

  /**
   * Helper: Build unique question prompt based on role and difficulty
   */
  buildQuestionPrompt(role, difficulty, resumeText = null) {
    const questionCount = difficulty === 'Easy' ? 5 : difficulty === 'Medium' ? 7 : 10;

    let basePrompt = `Generate ${questionCount} ${difficulty} level ${role} interview questions.`;

    if (resumeText) {
      basePrompt += ` Customize questions based on this resume: ${resumeText.substring(0, 500)}`;
    }

    basePrompt += `

Return as a JSON array with this structure:
[
  {
    "question": "Question text here",
    "topic": "Topic category",
    "expectedKeywords": ["keyword1", "keyword2"]
  }
]

Ensure questions are:
- Specific to ${role} development
- Appropriate for ${difficulty} level
- Progressive in difficulty
- Cover different subtopics`;

    return basePrompt;
  }

  /**
   * Helper: Identify weak areas from previous answers
   */
  identifyWeakAreas(questions) {
    const threshold = 60;
    return questions
      .filter((q) => q.score < threshold)
      .map((q) => q.topic)
      .filter((topic, index, arr) => arr.indexOf(topic) === index) // unique
      .slice(0, 3); // top 3 weak areas
  }
}

module.exports = new AIService();
