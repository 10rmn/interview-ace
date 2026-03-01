import React from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
} from 'lucide-react';

const CircularProgress = ({ value, size = 120, strokeWidth = 8, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        className="text-gray-200 dark:text-gray-700"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={color}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
    </svg>
  );
};

const AnalyticsCard = ({
  confidenceScore,
  fillerWords,
  speakingSpeed,
  pauseCount,
  aiUnavailable = false,
}) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSpeedLabel = (wpm) => {
    if (wpm < 120) return { label: 'Slow', color: 'text-blue-500' };
    if (wpm <= 160) return { label: 'Optimal', color: 'text-green-500' };
    return { label: 'Fast', color: 'text-yellow-500' };
  };

  const speedInfo = getSpeedLabel(speakingSpeed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        Performance Analytics
      </h3>

      {aiUnavailable && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                AI Analysis Unavailable
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Rate limit reached. Basic metrics shown below.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Confidence Score */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <CircularProgress
              value={aiUnavailable ? 0 : confidenceScore}
              color={getScoreColor(confidenceScore)}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className={`text-2xl font-bold ${getScoreColor(confidenceScore)}`}>
                  {aiUnavailable ? 'N/A' : confidenceScore}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Confidence
          </p>
        </div>

        {/* Filler Words */}
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {fillerWords}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Filler Words</p>
          {fillerWords > 5 && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Try to reduce fillers
            </p>
          )}
        </div>

        {/* Speaking Speed */}
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {aiUnavailable ? 'N/A' : speakingSpeed}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">WPM</p>
          {!aiUnavailable && (
            <p className={`text-xs mt-1 ${speedInfo.color}`}>
              {speedInfo.label}
            </p>
          )}
        </div>

        {/* Pauses */}
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {pauseCount}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pauses</p>
          {pauseCount > 3 && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              Consider smoother flow
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsCard;
