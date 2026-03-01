import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import InterviewCard from '../components/InterviewCard';
import AnalyticsCard from '../components/AnalyticsCard';
import WaveformVisualizer from '../components/WaveformVisualizer';

const Practice = () => {
  const [currentQuestion, setCurrentQuestion] = useState({
    text: 'Explain the difference between useState and useEffect in React, and provide a practical example of when you would use each.',
    topic: 'React Hooks',
    difficulty: 'Medium',
  });
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [analytics, setAnalytics] = useState({
    confidenceScore: 0,
    fillerWords: 0,
    speakingSpeed: 0,
    pauseCount: 0,
    aiUnavailable: false,
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const analyserRef = useRef(null);
  const startTimeRef = useRef(null);
  const pauseCountRef = useRef(0);

  const questionNumber = 1;
  const totalQuestions = 5;

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      startTimeRef.current = Date.now();
      pauseCountRef.current = 0;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Here you would typically send the audio to a speech-to-text service
        // For now, we'll simulate it
        const duration = (Date.now() - startTimeRef.current) / 1000;
        const words = answer.trim().split(/\s+/).length;
        const wpm = Math.round((words / duration) * 60);
        
        // Simulate filler word detection
        const fillerMatches = answer.match(/\b(um|uh|like|you know)\b/gi) || [];
        const fillerCount = fillerMatches.length;

        setAnalytics(prev => ({
          ...prev,
          speakingSpeed: wpm,
          fillerWords: fillerCount,
          pauseCount: pauseCountRef.current,
        }));

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      analyserRef.current = null;
    }
  };

  // Submit answer
  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to evaluate answer
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate AI response
      const mockResponse = {
        confidenceScore: Math.floor(Math.random() * 40) + 60, // 60-100
        aiUnavailable: Math.random() > 0.7, // 30% chance of AI unavailable
      };

      setAnalytics(prev => ({
        ...prev,
        ...mockResponse,
      }));

      setShowFeedback(true);
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Next question
  const handleNextQuestion = () => {
    setShowFeedback(false);
    setAnswer('');
    setAnalytics({
      confidenceScore: 0,
      fillerWords: 0,
      speakingSpeed: 0,
      pauseCount: 0,
      aiUnavailable: false,
    });
  };

  // Detect pauses during typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (answer.trim() && !isRecording) {
        pauseCountRef.current += 1;
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [answer, isRecording]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Progress
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {questionNumber} of {totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="mb-8">
          <InterviewCard
            question={currentQuestion.text}
            topic={currentQuestion.topic}
            difficulty={currentQuestion.difficulty}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            onAnswer={() => document.getElementById('answer-textarea')?.focus()}
            onRecord={isRecording ? stopRecording : startRecording}
            isRecording={isRecording}
            disabled={isSubmitting}
          />
        </div>

        {/* Answer Input */}
        {!showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8"
          >
            {/* Waveform */}
            <div className="mb-6">
              <WaveformVisualizer
                isRecording={isRecording}
                analyser={analyserRef.current}
              />
            </div>

            {/* Textarea */}
            <div className="mb-4">
              <textarea
                id="answer-textarea"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here or use the record button above..."
                className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={submitAnswer}
              disabled={isSubmitting || !answer.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Answer
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnalyticsCard {...analytics} />

              {/* Next Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleNextQuestion}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all flex items-center gap-2"
                >
                  Next Question
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Practice;
