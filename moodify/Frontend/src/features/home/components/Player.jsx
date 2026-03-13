import { useRef, useState, useEffect } from 'react'
import '../style/player.scss'
import { useSong } from '../hooks/useSong'

const Player = () => {
  const { song } = useSong()
  const currentSong = song?.[0]
  const audioRef = useRef(null)

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

  if (!currentSong) return null

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
    <div className="musics">
      <div className="play-list">
        <div className="text">
          <h4>Welcome Back</h4>
          <h1>Moodify</h1>
        </div>
        <div className="songs">
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song1akjdsvsdk</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
          <div className="song">
            <img src="https://i.pinimg.com/736x/e9/42/75/e94275abfe9f35338d9dd25a5e7217ce.jpg" alt="" />
            <h3>song2</h3>
          </div>
        </div>
      </div>
      <div className="player-container">
        <audio ref={audioRef} src={currentSong?.url} />

        {/* Poster Image */}
        <div className="player-poster">
          <img src={currentSong.posterUrl} alt={currentSong.title} />
        </div>

        {/* Song Info */}
        <div className="player-info">
          <h3 className="song-title">{currentSong.title}</h3>
          <p className="song-mood">{currentSong.mood}</p>
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
    </div>
  )
}

export default Player