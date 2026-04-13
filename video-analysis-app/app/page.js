'use client'
import { useRef, useState, useEffect } from 'react'

export default function Home() {
  const videoRef = useRef(null)
  const [events, setEvents] = useState([])
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [player, setPlayer] = useState(null)

  const addEvent = (tipo) => {
    let time = 0
    if (videoRef.current) {
      time = videoRef.current.currentTime
    }
    if (player) {
      time = player.getCurrentTime()
    }

    setEvents(prev => [...prev, {
      id: Date.now().toString(),
      time,
      tipo
    }])
  }

  const goToEvent = (time) => {
    const t = Math.max(0, time - 5)
    if (videoRef.current) {
      videoRef.current.currentTime = t
      videoRef.current.play()
    }
    if (player) {
      player.seekTo(t, true)
    }
  }

  const loadYoutube = () => {
    const id = youtubeUrl.split("v=")[1]
    const tag = document.createElement('script')
    tag.src = "https://www.youtube.com/iframe_api"
    document.body.appendChild(tag)

    window.onYouTubeIframeAPIReady = () => {
      const ytPlayer = new window.YT.Player('yt-player', {
        height: '360',
        width: '640',
        videoId: id,
      })
      setPlayer(ytPlayer)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Video Analysis</h1>

      <input 
        placeholder="YouTube URL"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />
      <button onClick={loadYoutube}>Cargar YouTube</button>

      <div id="yt-player"></div>

      <video ref={videoRef} controls width="600" />

      <div style={{ marginTop: 20 }}>
        <button onClick={() => addEvent('Salida')}>🟢 Salida</button>
        <button onClick={() => addEvent('Perfil')}>🔵 Perfil</button>
        <button onClick={() => addEvent('Defensa')}>🔴 Defensa</button>
        <button onClick={() => addEvent('Transición')}>🟡 Transición</button>
      </div>

      <ul>
        {events.map(e => (
          <li key={e.id} onClick={() => goToEvent(e.time)}>
            {e.tipo} - {e.time.toFixed(2)}s
          </li>
        ))}
      </ul>
    </div>
  )
}
