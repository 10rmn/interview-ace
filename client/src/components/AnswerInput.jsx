import React, { useEffect, useMemo, useRef, useState } from 'react';

const getSpeechRecognitionCtor = () => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

const buildErrorMessage = (err) => {
  if (!err) return 'Something went wrong.';
  if (typeof err === 'string') return err;
  if (err?.name === 'NotAllowedError' || err?.name === 'SecurityError') {
    return 'Microphone permission was denied. Please allow microphone access and try again.';
  }
  if (err?.name === 'NotSupportedError') {
    return 'Speech recognition is not supported in this browser.';
  }
  return err?.message || 'Something went wrong.';
};

/**
 * AnswerInput
 * - Mode: Type Answer / Record Answer (Web Speech API)
 * - Transcript is written into the textarea and remains editable
 * - On submit, posts to backend using fetch
 */
const AnswerInput = ({
  submitUrl,
  token,
  initialValue = '',
  placeholder = 'Share your thoughts on this question...',
  disabled = false,
  onSubmitted,
  method = 'POST',
  extraPayload,
}) => {
  const [mode, setMode] = useState('type'); // 'type' | 'record'
  const [text, setText] = useState(initialValue);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  const recognitionRef = useRef(null);
  const finalTextRef = useRef(initialValue);

  useEffect(() => {
    finalTextRef.current = text;
  }, [text]);

  const SpeechRecognitionCtor = useMemo(() => getSpeechRecognitionCtor(), []);

  useEffect(() => {
    const supported = !!SpeechRecognitionCtor;
    setSpeechSupported(supported);
    if (!supported) setMode('type');

    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, [SpeechRecognitionCtor]);

  const stopRecording = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {
      // ignore
    }
    setIsRecording(false);
    setStatus('');
  };

  const startRecording = () => {
    setSpeechError('');
    setSubmitError('');

    if (!SpeechRecognitionCtor) {
      setSpeechSupported(false);
      setSpeechError('Speech recognition is not supported in this browser.');
      return;
    }

    // Create a new instance per run (more reliable across browsers)
    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;

    try {
      recognition.lang = navigator.language || 'en-US';
    } catch {
      // ignore
    }

    recognition.onstart = () => {
      setIsRecording(true);
      setStatus('Listening...');
    };

    recognition.onend = () => {
      setIsRecording(false);
      setStatus('');
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      setStatus('');
      setSpeechError(event?.error ? `Speech error: ${event.error}` : 'Speech recognition error.');
    };

    recognition.onresult = (event) => {
      try {
        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const res = event.results[i];
          const transcript = res?.[0]?.transcript || '';
          if (res.isFinal) finalChunk += transcript;
          else interim += transcript;
        }

        // Append only final text to the persisted value
        if (finalChunk) {
          const next = `${finalTextRef.current}${finalTextRef.current ? ' ' : ''}${finalChunk}`
            .replace(/\s+/g, ' ')
            .trim();
          finalTextRef.current = next;
          setText(next);
        }

        // Show a lightweight status for interim
        if (interim) setStatus('Listening...');
      } catch (e) {
        setSpeechError(buildErrorMessage(e));
      }
    };

    try {
      recognition.start();
    } catch (e) {
      setIsRecording(false);
      setStatus('');
      setSpeechError(buildErrorMessage(e));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSpeechError('');

    const value = text.trim();
    if (!value) {
      setSubmitError('Please enter an answer before submitting.');
      return;
    }

    if (!submitUrl) {
      setSubmitError('Submit URL is missing.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(submitUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          answer: value,
          userAnswer: value,
          ...(extraPayload ? extraPayload : {}),
        }),
      });

      const data = await res
        .json()
        .catch(() => ({ success: false, message: `Request failed with status ${res.status}` }));

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || `Request failed with status ${res.status}`);
      }

      onSubmitted?.(data);
    } catch (err) {
      setSubmitError(buildErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const disableAll = disabled || submitting;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Your Answer</h3>
          <p className="text-sm text-gray-500">
            Choose to type or record. You can edit the text before submitting.
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => {
              if (isRecording) stopRecording();
              setMode('type');
              setSpeechError('');
            }}
            disabled={disableAll}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
              mode === 'type'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            } disabled:opacity-60`}
          >
            Type Answer
          </button>
          <button
            type="button"
            onClick={() => setMode('record')}
            disabled={disableAll || !speechSupported}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
              mode === 'record'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            } disabled:opacity-60`}
            title={!speechSupported ? 'Speech recognition not supported in this browser' : ''}
          >
            <span className="inline-flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 11a7 7 0 0 1-14 0"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 18v3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 21h8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Record Answer
            </span>
          </button>
        </div>
      </div>

      {mode === 'record' && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Speech to text</p>
              <p className="text-xs text-gray-600">
                {speechSupported
                  ? 'Works best in Chromium browsers (Chrome / Edge).'
                  : 'Not supported in this browser. Please use Type Answer.'}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={startRecording}
                disabled={disableAll || isRecording || !speechSupported}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                Start Recording
              </button>
              <button
                type="button"
                onClick={stopRecording}
                disabled={disableAll || !isRecording}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black disabled:opacity-60"
              >
                Stop Recording
              </button>
            </div>
          </div>

          {status && (
            <div className="mt-3 text-xs text-blue-700 font-medium">{status}</div>
          )}

          {!speechSupported && (
            <div className="mt-3 text-xs text-amber-700">
              Tip: Try Chrome/Edge on desktop. Safari and Firefox often do not support this API.
            </div>
          )}

          {speechError && (
            <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {speechError}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disableAll}
          rows={7}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
        />

        {submitError && (
          <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {submitError}
          </div>
        )}

        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="text-xs text-gray-500">
            {isRecording ? 'Recording… Click Stop Recording to finish.' : 'Your answer will be submitted to the backend.'}
          </div>

          <button
            type="submit"
            disabled={disableAll}
            className="px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerInput;
