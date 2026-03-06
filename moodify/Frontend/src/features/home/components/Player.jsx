import React, { useRef, useState, useEffect } from 'react'
import '../style/player.scss'
import { useSong } from '../hooks/useSong'

const Player = () => {
  const { song } = useSong()
  const audioRef = useRef(null)
  if (!song) return null

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleForward = () => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = Math.min(audio.currentTime + 5, audio.duration)
    }
  }

  const handleBackward = () => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = Math.max(audio.currentTime - 5, 0)
    }
  }

  const handleSpeedChange = (newSpeed) => {
    const audio = audioRef.current
    if (audio) {
      audio.playbackRate = newSpeed
      setSpeed(newSpeed)
    }
  }

  const handleProgressChange = (e) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = (e.target.value / 100) * audio.duration
    }
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="player-container">
      <audio ref={audioRef} src={song.url} />

      {/* Poster Image */}
      <div className="player-poster">
        <img src={song.posterUrl} alt={song.title} />
      </div>

      {/* Song Info */}
      <div className="player-info">
        <h3 className="song-title">{song.title}</h3>
        <p className="song-mood">{song.mood}</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <span className="time">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={progressPercentage}
          onChange={handleProgressChange}
          className="progress-bar"
        />
        <span className="time">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="controls">
        <button className="control-btn backward" onClick={handleBackward} title="Backward 5 sec">
          <span>⏪ -5s</span>
        </button>

        <button
          className={`control-btn play-pause ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          <span>{isPlaying ? '⏸' : '▶'}</span>
        </button>

        <button className="control-btn forward" onClick={handleForward} title="Forward 5 sec">
          <span>+5s ⏩</span>
        </button>
      </div>

      {/* Speed Control */}
      <div className="speed-control">
        <label>Speed:</label>
        <select value={speed} onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}>
          <option value={0.5}>0.5x</option>
          <option value={0.75}>0.75x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>
    </div>
  )
}

export default Player