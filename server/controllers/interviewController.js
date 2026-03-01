const InterviewSession = require('../models/InterviewSession');
const aiService = require('../services/aiService');

/**
 * Start a new interview session
 * @route POST /api/interview/start
 */
exports.startInterview = async (req, res, next) => {
  try {
    const { role, difficulty } = req.body;
    const userId = req.userId;

    // Validation
    if (!role || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Please provide role and difficulty',
      });
    }

    const validRoles = ['Frontend', 'Backend', 'DSA', 'HR'];
    const validDifficulties = ['Easy', 'Medium', 'Hard'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be Frontend, Backend, DSA, or HR',
      });
    }

    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid difficulty. Must be Easy, Medium, or Hard',
      });
    }

    try {
      // Generate questions from AI
      const questionsData = await aiService.generateQuestions(role, difficulty);

      // Create interview session
      const questions = questionsData.map((q) => ({
        questionText: q.question || q.questionText,
        topic: q.topic,
        userAnswer: '',
        aiFeedback: '',
        score: 0,
        clarity: 0,
        technicalAccuracy: 0,
        confidence: 0,
      }));

      const session = await InterviewSession.create({
        userId,
        role,
        difficulty,
        questions,
        status: 'in-progress',
      });

      res.status(201).json({
        success: true,
        message: 'Interview session started',
        session: {
          id: session._id,
          role: session.role,
          difficulty: session.difficulty,
          totalQuestions: session.questions.length,
          currentQuestion: session.questions[0],
          questionIndex: 0,
        },
      });
    } catch (aiError) {
      return res.status(503).json({
        success: false,
        message: 'Failed to generate interview questions. Please try again.',
        error: aiError.message,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Submit answer for current question
 * @route POST /api/interview/answer
 */
exports.submitAnswer = async (req, res, next) => {
  try {
    const { sessionId, questionIndex, userAnswer } = req.body;
    const userId = req.userId;

    if (!sessionId || questionIndex === undefined || !userAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide sessionId, questionIndex, and userAnswer',
      });
    }

    // Get session
    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    if (questionIndex >= session.questions.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question index',
      });
    }

    try {
      // Evaluate answer using AI
      const evaluation = await aiService.evaluateAnswer(
        session.questions[questionIndex].questionText,
        userAnswer,
        session.role
      );

      // Update question with answer and feedback
      session.questions[questionIndex].userAnswer = userAnswer;
      session.questions[questionIndex].aiFeedback = evaluation.feedback;
      session.questions[questionIndex].score = evaluation.score;
      session.questions[questionIndex].clarity = evaluation.clarity;
      session.questions[questionIndex].technicalAccuracy =
        evaluation.technicalAccuracy;
      session.questions[questionIndex].confidence = evaluation.confidence;

      // Save session
      await session.save();

      // Prepare next question
      let nextQuestion = null;
      let nextIndex = -1;

      if (questionIndex + 1 < session.questions.length) {
        nextIndex = questionIndex + 1;
        nextQuestion = session.questions[nextIndex];

        try {
          // Generate adaptive follow-up if more questions available
          if (questionIndex + 2 < session.questions.length) {
            const followUp = await aiService.generateFollowUp(
              session.questions.slice(0, questionIndex + 1),
              session.role,
              session.difficulty
            );
            nextQuestion.questionText = followUp.question;
            nextQuestion.topic = followUp.topic;
            await session.save();
          }
        } catch (aiError) {
          console.error('Error generating follow-up question:', aiError);
          // Continue with predefined questions
        }
      } else {
        // Interview completed
        session.status = 'completed';
        session.completedAt = new Date();
        await session.save();
      }

      res.status(200).json({
        success: true,
        message: 'Answer evaluated successfully',
        evaluation: {
          score: evaluation.score,
          clarity: evaluation.clarity,
          technicalAccuracy: evaluation.technicalAccuracy,
          confidence: evaluation.confidence,
          feedback: evaluation.feedback,
          strengths: evaluation.strengths,
          areasForImprovement: evaluation.areasForImprovement,
        },
        next:
          nextIndex !== -1
            ? {
                question: nextQuestion.questionText,
                topic: nextQuestion.topic,
                questionIndex: nextIndex,
                totalQuestions: session.questions.length,
              }
            : null,
        sessionStatus: session.status,
      });
    } catch (aiError) {
      return res.status(503).json({
        success: false,
        message: 'Failed to evaluate answer. Please try again.',
        error: aiError.message,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get interview history for current user
 * @route GET /api/interview/history
 */
exports.getHistory = async (req, res, next) => {
  try {
    const userId = req.userId;

    const sessions = await InterviewSession.find({ userId })
      .select('-questions')
      .sort({ createdAt: -1 })
      .lean();

    const stats = {
      totalSessions: sessions.length,
      averageScore:
        sessions.length > 0
          ? Math.round(
              sessions.reduce((sum, s) => sum + (s.totalScore || 0), 0) /
                sessions.length
            )
          : 0,
      completedSessions: sessions.filter((s) => s.status === 'completed').length,
      byRole: {},
      byDifficulty: {},
    };

    // Calculate stats by role and difficulty
    sessions.forEach((session) => {
      stats.byRole[session.role] = (stats.byRole[session.role] || 0) + 1;
      stats.byDifficulty[session.difficulty] =
        (stats.byDifficulty[session.difficulty] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      stats,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed session with all questions and feedback
 * @route GET /api/interview/:id
 */
exports.getSessionDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const session = await InterviewSession.findOne({
      _id: id,
      userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    // Calculate topic-wise performance
    const topicPerformance = {};
    session.questions.forEach((q) => {
      if (!topicPerformance[q.topic]) {
        topicPerformance[q.topic] = {
          topic: q.topic,
          scores: [],
          count: 0,
        };
      }
      topicPerformance[q.topic].scores.push(q.score);
      topicPerformance[q.topic].count += 1;
    });

    const topics = Object.keys(topicPerformance).map((topic) => {
      const data = topicPerformance[topic];
      const avgScore = Math.round(
        data.scores.reduce((a, b) => a + b, 0) / data.scores.length
      );
      return {
        topic,
        averageScore: avgScore,
        count: data.count,
      };
    });

    res.status(200).json({
      success: true,
      session: {
        id: session._id,
        role: session.role,
        difficulty: session.difficulty,
        status: session.status,
        totalScore: session.totalScore,
        averageClarity: session.averageClarity,
        averageTechnicalAccuracy: session.averageTechnicalAccuracy,
        averageConfidence: session.averageConfidence,
        createdAt: session.createdAt,
        completedAt: session.completedAt,
        questions: session.questions.map((q) => ({
          questionText: q.questionText,
          topic: q.topic,
          userAnswer: q.userAnswer,
          aiFeedback: q.aiFeedback,
          score: q.score,
          clarity: q.clarity,
          technicalAccuracy: q.technicalAccuracy,
          confidence: q.confidence,
        })),
        topicPerformance: topics,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get performance analytics
 * @route GET /api/interview/analytics/performance
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.userId;

    const sessions = await InterviewSession.find({ userId })
      .sort({ createdAt: 1 })
      .lean();

    if (sessions.length === 0) {
      return res.status(200).json({
        success: true,
        analytics: {
          timeline: [],
          topicDistribution: [],
          improvement: 0,
        },
      });
    }

    // Timeline data for line chart
    const timeline = sessions
      .filter((s) => s.status === 'completed')
      .map((s) => ({
        date: new Date(s.createdAt).toLocaleDateString(),
        score: s.totalScore,
        clarity: s.averageClarity,
        accuracy: s.averageTechnicalAccuracy,
        confidence: s.averageConfidence,
      }));

    // Topic distribution for pie chart
    const topicScores = {};
    sessions.forEach((session) => {
      session.questions.forEach((q) => {
        if (!topicScores[q.topic]) {
          topicScores[q.topic] = {
            name: q.topic,
            value: 0,
            count: 0,
          };
        }
        topicScores[q.topic].value += q.score;
        topicScores[q.topic].count += 1;
      });
    });

    const topicDistribution = Object.values(topicScores).map((t) => ({
      name: t.name,
      value: Math.round(t.value / t.count),
    }));

    // Calculate improvement
    const completedSessions = sessions.filter((s) => s.status === 'completed');
    let improvement = 0;
    if (completedSessions.length > 1) {
      const firstScore = completedSessions[0].totalScore;
      const lastScore = completedSessions[completedSessions.length - 1].totalScore;
      improvement = lastScore - firstScore;
    }

    res.status(200).json({
      success: true,
      analytics: {
        timeline,
        topicDistribution,
        improvement,
        totalSessions: sessions.length,
        averageScore: Math.round(
          sessions.reduce((sum, s) => sum + (s.totalScore || 0), 0) / sessions.length
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};
