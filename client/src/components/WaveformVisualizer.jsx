import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const WaveformVisualizer = ({ isRecording, analyser }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isRecording || !analyser) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgb(243, 244, 246)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(59, 130, 246)';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, analyser]);

  return (
    <div className="relative h-24 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={96}
        className="w-full h-full"
      />
      {!isRecording && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click "Record Answer" to start
          </p>
        </div>
      )}
    </div>
  );
};

export default WaveformVisualizer;
