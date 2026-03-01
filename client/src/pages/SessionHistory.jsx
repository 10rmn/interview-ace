import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import interviewService from '../services/interviewService';

const SessionHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('history');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyResponse, analyticsResponse] = await Promise.all([
          interviewService.getHistory(),
          interviewService.getAnalytics(),
        ]);

        if (historyResponse.success) {
          setHistory(historyResponse);
        }

        if (analyticsResponse.success) {
          setAnalytics(analyticsResponse);
        }
      } catch (err) {
        setError('Failed to load history and analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Interview History & Analytics
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Statistics */}
        {history && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-2">
                Total Sessions
              </p>
              <p className="text-4xl font-bold text-blue-500">
                {history.stats.totalSessions}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-2">
                Average Score
              </p>
              <p className="text-4xl font-bold text-green-500">
                {history.stats.averageScore}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-2">
                Completed
              </p>
              <p className="text-4xl font-bold text-purple-500">
                {history.stats.completedSessions}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-2">
                Improvement
              </p>
              <p className="text-4xl font-bold text-orange-500">
                {analytics?.analytics?.improvement || 0}%
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setSelectedTab('history')}
            className={`px-6 py-3 font-semibold rounded-lg transition ${
              selectedTab === 'history'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Session History
          </button>
          <button
            onClick={() => setSelectedTab('analytics')}
            className={`px-6 py-3 font-semibold rounded-lg transition ${
              selectedTab === 'analytics'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* History Tab */}
        {selectedTab === 'history' && history && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Past Interview Sessions
            </h2>

            {history.sessions.length === 0 ? (
              <p className="text-gray-600">
                No interview sessions yet. Start your first interview!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Difficulty
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {history.sessions.map((session) => (
                      <tr key={session._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {session.role}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {session.difficulty}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                          {session.totalScore}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              session.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {session.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => navigate(`/session/${session._id}`)}
                            className="text-blue-500 hover:text-blue-700 font-semibold"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && analytics && (
          <div className="space-y-8">
            {/* Timeline Chart */}
            {analytics.analytics.timeline.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Performance Over Time
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analytics.analytics.timeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3B82F6"
                      name="Overall Score"
                    />
                    <Line
                      type="monotone"
                      dataKey="clarity"
                      stroke="#10B981"
                      name="Clarity"
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#F59E0B"
                      name="Accuracy"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Topic Distribution */}
            {analytics.analytics.topicDistribution.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Topic Performance Distribution
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={analytics.analytics.topicDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.analytics.topicDistribution.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SessionHistory;
