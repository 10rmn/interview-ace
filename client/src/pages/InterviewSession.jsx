import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import interviewService from '../services/interviewService';
import authService from '../services/authService';
import AnswerInput from '../components/AnswerInput';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const InterviewSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [nextInfo, setNextInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionComplete, setSessionComplete] = useState(false);

  // Fetch session details on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setError('');
        const response = await interviewService.getSessionDetail(sessionId);

        if (!response.success || !response.session) {
          setError(response.message || 'Failed to load session');
          return;
        }

        setSession(response.session);
        setCurrentQuestionIndex(0);
        setNextInfo(null);
      } catch (err) {
        setError(err?.message || 'Failed to load session');
      }
    };

    fetchSession();
  }, [sessionId]);

  const totalQuestions = session?.questions?.length || session?.totalQuestions || 10;
  const currentQuestion = session?.questions?.[currentQuestionIndex];

  const handleSubmitted = (response) => {
    setError('');
    if (response.success) {
      setFeedback(response.evaluation);
      setNextInfo(response.next || null);

      if (response.sessionStatus === 'completed') {
        setSessionComplete(true);
      }
    } else {
      setError(response.message || 'Failed to submit answer');
    }
  };

  const handleNextQuestion = () => {
    if (!nextInfo) {
      setError('Next question is not available yet.');
      return;
    }

    const nextIndex = nextInfo.questionIndex;

    setSession((prev) => {
      if (!prev) return prev;
      const prevQuestions = Array.isArray(prev.questions) ? prev.questions : [];
      const updatedQuestions = [...prevQuestions];
      if (updatedQuestions[nextIndex]) {
        updatedQuestions[nextIndex] = {
          ...updatedQuestions[nextIndex],
          questionText: nextInfo.question || updatedQuestions[nextIndex].questionText,
          topic: nextInfo.topic || updatedQuestions[nextIndex].topic,
        };
      }
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });

    setAnswer('');
    setFeedback(null);
    setNextInfo(null);
    setCurrentQuestionIndex(nextIndex);
  };

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-green-500 mb-4">
            Interview Complete! 🎉
          </h2>
          <p className="text-gray-600 mb-8">
            Great job! Your interview has been completed and evaluated.
          </p>
          <button
            onClick={() => navigate(`/session/${sessionId}`)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mb-3"
          >
            View Detailed Feedback
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Interview Session</h1>
          <p className="text-gray-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Progress</h2>
            <span className="text-gray-600">
              {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-4">
            <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {session?.role ? `${session.role} Interview` : 'Interview'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {currentQuestion?.questionText || 'Loading question...'}
          </h3>
          {currentQuestion?.topic && (
            <p className="text-gray-600 leading-relaxed mb-4">Topic: {currentQuestion.topic}</p>
          )}
        </div>

        {/* Answer Section */}
        {!feedback && (
          <AnswerInput
            submitUrl={`${API_BASE_URL}/interview/answer`}
            token={authService.getToken()}
            initialValue={answer}
            disabled={loading}
            extraPayload={{ sessionId, questionIndex: currentQuestionIndex }}
            onSubmitted={handleSubmitted}
          />
        )}

        {/* Feedback Section */}
        {feedback && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-blue-600">Feedback</h3>

            {feedback.aiUnavailable && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
                {feedback.retryAfterSeconds
                  ? `AI feedback is temporarily unavailable due to rate limits. Please retry in about ${feedback.retryAfterSeconds}s.`
                  : 'AI feedback is temporarily unavailable due to rate limits. Please try again later.'}
              </div>
            )}

            {/* Scores */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 font-semibold mb-2">Clarity</p>
                <p className="text-3xl font-bold text-blue-600">
                  {feedback.aiUnavailable ? 'N/A' : `${feedback.clarity}%`}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 font-semibold mb-2">Accuracy</p>
                <p className="text-3xl font-bold text-green-600">
                  {feedback.aiUnavailable ? 'N/A' : `${feedback.technicalAccuracy}%`}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 font-semibold mb-2">Confidence</p>
                <p className="text-3xl font-bold text-orange-600">
                  {feedback.aiUnavailable ? 'N/A' : `${feedback.confidence}%`}
                </p>
              </div>
            </div>

            {/* Overall Score */}
            <div className="bg-purple-50 rounded-lg p-6 mb-8">
              <p className="text-gray-600 font-semibold mb-2">Overall Score</p>
              <p className="text-4xl font-bold text-purple-600">
                {feedback.aiUnavailable ? 'N/A' : `${feedback.score}/100`}
              </p>
            </div>

            {/* Feedback Text */}
            <div className="mb-8">
              <h4 className="font-bold text-lg mb-3">Detailed Feedback</h4>
              <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
            </div>

            {/* Strengths */}
            {feedback.strengths?.length > 0 && (
              <div className="mb-8">
                <h4 className="font-bold text-lg mb-3 text-green-600">
                  Strengths ✓
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {feedback.areasForImprovement?.length > 0 && (
              <div className="mb-8">
                <h4 className="font-bold text-lg mb-3 text-orange-600">
                  Areas for Improvement
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {feedback.areasForImprovement.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={handleNextQuestion}
              disabled={!nextInfo}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Next Question
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default InterviewSession;
