import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Clock,
  Award,
  Brain,
  Mic,
} from 'lucide-react';

const Analytics = () => {
  const weeklyData = [
    { day: 'Mon', score: 75, sessions: 1 },
    { day: 'Tue', score: 82, sessions: 2 },
    { day: 'Wed', score: 78, sessions: 1 },
    { day: 'Thu', score: 85, sessions: 2 },
    { day: 'Fri', score: 91, sessions: 1 },
    { day: 'Sat', score: 88, sessions: 2 },
    { day: 'Sun', score: 83, sessions: 1 },
  ];

  const skillBreakdown = [
    { skill: 'Technical Knowledge', score: 85, trend: 'up' },
    { skill: 'Communication', score: 72, trend: 'down' },
    { skill: 'Problem Solving', score: 88, trend: 'up' },
    { skill: 'Confidence', score: 79, trend: 'up' },
    { skill: 'Clarity', score: 76, trend: 'stable' },
  ];

  const insights = [
    {
      icon: Target,
      title: 'Strength Area',
      description: 'Technical concepts are your strongest area with 85% average score',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      icon: Mic,
      title: 'To Improve',
      description: 'Reduce filler words - average 8 per session',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      icon: TrendingUp,
      title: 'Progress',
      description: '15% score improvement over the last 2 weeks',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const maxScore = Math.max(...weeklyData.map(d => d.score));

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Performance Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your interview performance and identify areas for improvement
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              83
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-600 dark:text-green-400">+5% this week</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              91
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Best Score</p>
          <div className="flex items-center gap-1 mt-2">
            <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Personal record</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              12
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Hours</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-600 dark:text-green-400">+3h this week</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              6
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sessions/Week</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-600 dark:text-green-400">Consistent</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Weekly Performance
          </h2>
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={day.day} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">
                  {day.day}
                </span>
                <div className="flex-1 relative">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.score / maxScore) * 100}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    />
                  </div>
                </div>
                <span className={`text-sm font-medium ${getScoreColor(day.score)} w-12 text-right`}>
                  {day.score}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                  {day.sessions}s
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skill Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Skill Breakdown
          </h2>
          <div className="space-y-4">
            {skillBreakdown.map((skill, index) => (
              <div key={skill.skill} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {skill.skill}
                  </span>
                  {getTrendIcon(skill.trend)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        skill.score >= 80
                          ? 'bg-green-500'
                          : skill.score >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.score}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${getScoreColor(skill.score)} w-10 text-right`}>
                    {skill.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className={`${insight.bgColor} rounded-2xl p-6 border border-opacity-20 ${
              insight.color.includes('green')
                ? 'border-green-600'
                : insight.color.includes('yellow')
                ? 'border-yellow-600'
                : 'border-blue-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <insight.icon className={`w-6 h-6 ${insight.color} mt-1`} />
              <div>
                <h3 className={`font-semibold text-gray-900 dark:text-white mb-1`}>
                  {insight.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {insight.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Analytics;
