'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, RotateCcw, X, User } from 'lucide-react';

export const AudioPlayer = ({
  surahName,
  recitations = [],
  currentReciterIndex = 0,
  onReciterChange,
  onClose,
  isOpen = false,
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const currentReciter = recitations[currentReciterIndex] || recitations[0];
  const audioUrl = currentReciter?.audio_url;

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.load();
      if (isOpen) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [audioUrl, isOpen]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlaybackRate = () => {
    const rates = [1, 1.25, 1.5];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !audioUrl) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 bg-base-100/95 backdrop-blur-md border-t border-base-300 shadow-2xl transition-all">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto min-w-0 justify-between sm:justify-start">
          <div className="flex items-center gap-2.5 min-w-0 truncate">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Volume2 className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0 truncate">
              <h4 className="text-xs font-semibold text-base-content truncate">
                Murattal QS. {surahName}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] text-base-content/60 truncate">
                <User className="w-3 h-3 shrink-0" />
                <span className="truncate">{currentReciter?.name}</span>
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="sm:hidden p-1.5 rounded-lg text-base-content/60 hover:text-base-content hover:bg-base-200"
            aria-label="Tutup pemutar audio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Controls & Scrubber */}
        <div className="flex items-center gap-3 w-full sm:w-1/2">
          {/* Play / Pause button */}
          <button
            onClick={togglePlay}
            type="button"
            className="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center shrink-0 hover:opacity-90 shadow-sm transition-all"
            aria-label={isPlaying ? 'Jeda Murattal' : 'Putar Murattal'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>

          {/* Time scrubber */}
          <div className="flex-1 flex items-center gap-2">
            <span className="text-[11px] text-base-content/60 font-mono w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-base-300 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-[11px] text-base-content/60 font-mono w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Reciter switch, Speed, and Close */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {/* Reciter dropdown if more than 1 */}
          {recitations.length > 1 && (
            <select
              value={currentReciterIndex}
              onChange={(e) => onReciterChange && onReciterChange(Number(e.target.value))}
              className="py-1 px-2 rounded-lg border border-base-300 bg-base-100 text-xs text-base-content focus:outline-none focus:border-primary"
            >
              {recitations.map((r, idx) => (
                <option key={idx} value={idx}>
                  {r.name.split(' ')[0]}...
                </option>
              ))}
            </select>
          )}

          {/* Speed button */}
          <button
            onClick={togglePlaybackRate}
            type="button"
            className="px-2 py-1 rounded-md text-xs font-medium border border-base-300 bg-base-100 hover:bg-base-200 text-base-content/80 transition-colors"
            title="Kecepatan putar"
          >
            {playbackRate}x
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors"
            title="Tutup pemutar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
