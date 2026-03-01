import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import interviewService from '../services/interviewService';

const SessionDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await interviewService.getSessionDetail(sessionId);
        if (response.success) {
          setSession(response.session);
        } else {
          setError('Failed to load session details');
        }
      } catch (err) {
        setError('Failed to load session details');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/history')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {session?.role} Interview - {session?.difficulty} Level
            </h1>
            <p className="text-gray-600 mt-2">
              {new Date(session?.createdAt).toLocaleDateString()} at{' '}
              {new Date(session?.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Back to History
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Overall Scores */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Overall Performance
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-4 text-white">
              <p className="text-sm font-semibold mb-2 opacity-90">Total Score</p>
              <p className="text-3xl font-bold">{session?.totalScore}</p>
              <p className="text-xs mt-1 opacity-75">/100</p>
            </div>

            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-4 text-white">
              <p className="text-sm font-semibold mb-2 opacity-90">Clarity</p>
              <p className="text-3xl font-bold">{session?.averageClarity}</p>
              <p className="text-xs mt-1 opacity-75">Average</p>
            </div>

            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-4 text-white">
              <p className="text-sm font-semibold mb-2 opacity-90">Accuracy</p>
              <p className="text-3xl font-bold">
                {session?.averageTechnicalAccuracy}
              </p>
              <p className="text-xs mt-1 opacity-75">Average</p>
            </div>

            <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg p-4 text-white">
              <p className="text-sm font-semibold mb-2 opacity-90">Confidence</p>
              <p className="text-3xl font-bold">{session?.averageConfidence}</p>
              <p className="text-xs mt-1 opacity-75">Average</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg p-4 text-white">
              <p className="text-sm font-semibold mb-2 opacity-90">Questions</p>
              <p className="text-3xl font-bold">{session?.questions?.length}</p>
              <p className="text-xs mt-1 opacity-75">Total</p>
            </div>
          </div>

          {/* Topic Performance */}
          {session?.topicPerformance && session.topicPerformance.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Performance by Topic
              </h3>
              <div className="space-y-3">
                {session.topicPerformance.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {topic.topic}
                      </p>
                      <p className="text-sm text-gray-600">
                        {topic.count} question{topic.count > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">
                        {topic.averageScore}
                      </p>
                      <p className="text-xs text-gray-600">/100</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Questions & Answers */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Questions & Feedback
          </h2>

          {session?.questions?.map((question, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-500"
            >
              {/* Question */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">
                      QUESTION {index + 1}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Topic: <span className="font-semibold">{question.topic}</span>
                    </p>
                  </div>
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                    {question.score}/100
                  </span>
                </div>
                <p className="text-lg text-gray-800 font-semibold mb-2">
                  {question.questionText}
                </p>
              </div>

              {/* Scores Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Clarity
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {question.clarity}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Accuracy
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {question.technicalAccuracy}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Confidence
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {question.confidence}%
                  </p>
                </div>
              </div>

              {/* User Answer */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  YOUR ANSWER
                </p>
                <p className="text-gray-700">{question.userAnswer}</p>
              </div>

              {/* AI Feedback */}
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-semibold text-green-900 mb-2">
                  AI FEEDBACK
                </p>
                <p className="text-gray-700">{question.aiFeedback}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SessionDetail;
