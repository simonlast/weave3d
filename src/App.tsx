import { useState } from 'react'
import WeavePattern from './components/WeavePattern'
import './App.css'

export type WeaveType = 'plain' | 'twill' | 'satin' | 'basket'

function App() {
  const [zoom, setZoom] = useState(20)
  const [weaveType, setWeaveType] = useState<WeaveType>('plain')

  const weaveTypes: WeaveType[] = ['plain', 'twill', 'satin', 'basket']

  return (
    <div className="app">
      <div className="weave-buttons">
        {weaveTypes.map((type) => (
          <button
            key={type}
            className={`weave-button ${weaveType === type ? 'active' : ''}`}
            onClick={() => setWeaveType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Weave
          </button>
        ))}
      </div>
      <WeavePattern zoom={zoom} weaveType={weaveType} />
      <input
        type="range"
        className="zoom-slider"
        min="5"
        max="50"
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
      />
    </div>
  )
}

export default App