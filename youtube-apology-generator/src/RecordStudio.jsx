import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useLocation } from 'react-router-dom';
import './App.css';

function RecordStudio() {
  const [bw, setBW] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isPerforming, setIsPerforming] = useState(false);
  const [recording, setRecording] = useState(false);
  const [clownMode, setClownMode] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [showSavedOverlay, setShowSavedOverlay] = useState(false);

  const location = useLocation();
  const script = location.state?.script || "";

  const webcamRef = useRef(null);
  const audioRef = useRef(new Audio('/sad-violin.mp3'));
  const clownAudioRef = useRef(new Audio('/clown-music.mp3'));
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const teleprompterRef = useRef(null);

  const toggleBW = () => setBW(prev => !prev);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (musicPlaying) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio.loop = true;
      audio.play();
    }
    setMusicPlaying(!musicPlaying);
  };

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);

    const interval = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        beginPerformance();
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const beginPerformance = () => {
    setIsPerforming(true);
    startRecording();
    autoScrollTeleprompter();
  };

  const startRecording = () => {
    const stream = webcamRef.current.stream;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setRecording(false);
      setIsPerforming(false);

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'apology_video.webm';
        a.click();

        setShowSavedOverlay(true);
        setTimeout(() => setShowSavedOverlay(false), 3000);
      };
    }
  };

  const autoScrollTeleprompter = () => {
    const lines = teleprompterRef.current?.querySelectorAll('.tele-line') || [];
    let index = 0;

    const scrollInterval = setInterval(() => {
      if (index >= lines.length) {
        clearInterval(scrollInterval);
        return;
      }
      lines[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      index++;
    }, 2000);
  };

  return (
    <div className="record-page">
      <h1 className="studio-title">Recording Studio</h1>
  
      <div className={`webcam-container ${bw ? 'bw' : ''}`}>
        <Webcam
          ref={webcamRef}
          audio
          muted
          mirrored
          className="webcam-preview"
        />
        {countdown !== null && (
          <div className="countdown-overlay">
            <h1>{countdown}</h1>
          </div>
        )}
        {clownMode && (
          <div className="clown-overlay">🤡</div>
        )}
      </div>
  
      {isPerforming && (
        <div className="teleprompter" ref={teleprompterRef}>
          {script.split('\n').map((line, i) => (
            <p key={i} className="tele-line">{line}</p>
          ))}
        </div>
      )}
  
      <div className="controls-row">
        <button onClick={toggleMusic}>
          {musicPlaying ? 'Stop Violin' : 'Play Sad Violin'}
        </button>
        <button onClick={toggleBW}>
          {bw ? 'Remove B&W' : 'Add B&W'}
        </button>
        <button onClick={() => {
          setClownMode(prev => {
            const audio = clownAudioRef.current;
            if (!prev) {
              audio.loop = true;
              audio.play();
            } else {
              audio.pause();
              audio.currentTime = 0;
            }
            return !prev;
          });
        }}>
          {clownMode ? 'Enough Clowning' : 'Clownify Me'}
        </button>
      </div>
  
      <div className="start-controls">
        <p className="recording-warning">
          ⚠️ WARNING: Filters, emojis, and music are only included for a more immersive recording experience. Feel free to screen record if you would like these effects to be in your video.
        </p>
  
        <div className="start-button-row">
          <button
            onClick={recording ? stopRecording : startCountdown}
            className="start-button">
            {recording ? '🛑 Stop Recording' : '🎬 Start Performance'}
          </button>
        </div>
      </div>
  
      {videoUrl && (
        <div className="video-preview">
          <h3>🎥 Preview</h3>
          <video src={videoUrl} controls width="480" />
        </div>
      )}
  
      {showSavedOverlay && (
        <div className="saved-overlay">
          Apology Saved!
        </div>
      )}
    </div>
  );  
}

export default RecordStudio;