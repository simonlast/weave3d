import { useState } from 'react'
import WeavePattern from './components/WeavePattern'
import './App.css'

function App() {
  const [zoom, setZoom] = useState(20)

  return (
    <div className="app">
      <WeavePattern zoom={zoom} />
      <input
        type="range"
        className="zoom-slider"
        min="5"
        max="50"
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        orient="vertical"
      />
    </div>
  )
}

export default App