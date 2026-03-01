import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, TrendingUp } from 'lucide-react';

const InterviewCard = ({
  question,
  topic,
  difficulty,
  questionNumber,
  totalQuestions,
  onAnswer,
  onRecord,
  isRecording,
  disabled = false,
}) => {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              difficultyColors[difficulty] || difficultyColors.Medium
            }`}
          >
            {difficulty}
          </span>
        </div>
        {topic && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Topic: {topic}
          </p>
        )}
      </div>

      {/* Question */}
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
          {question}
        </h3>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Text Answer */}
          <button
            onClick={onAnswer}
            disabled={disabled}
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Type Answer
            </span>
          </button>

          {/* Record Answer */}
          <button
            onClick={onRecord}
            disabled={disabled}
            className={`flex-1 px-4 py-3 rounded-xl transition-all ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-sm font-medium">
              {isRecording ? 'Stop Recording' : 'Record Answer'}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewCard;
