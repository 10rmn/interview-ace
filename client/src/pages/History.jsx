import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Award, Calendar } from 'lucide-react';

const History = () => {
  const mockSessions = [
    {
      id: 1,
      date: '2024-02-28',
      role: 'Frontend Developer',
      difficulty: 'Medium',
      score: 85,
      questionsAnswered: 7,
      duration: '45 min',
      status: 'completed',
    },
    {
      id: 2,
      date: '2024-02-27',
      role: 'React Developer',
      difficulty: 'Hard',
      score: 72,
      questionsAnswered: 10,
      duration: '62 min',
      status: 'completed',
    },
    {
      id: 3,
      date: '2024-02-26',
      role: 'JavaScript',
      difficulty: 'Easy',
      score: 91,
      questionsAnswered: 5,
      duration: '28 min',
      status: 'completed',
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Interview History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and review past interview sessions
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {mockSessions.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              83
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              91
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Best Score</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              3
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
        </motion.div>
      </div>

      {/* Sessions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Sessions
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {mockSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {session.role}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        session.difficulty
                      )}`}
                    >
                      {session.difficulty}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {session.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <span>Score: <strong className={getScoreColor(session.score)}>{session.score}%</strong></span>
                    <span>{session.questionsAnswered} questions</span>
                    <span>{session.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default History;
