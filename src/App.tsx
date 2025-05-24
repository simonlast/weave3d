import { useState } from 'react'
import { WeavePattern3D } from './components/WeavePattern3D'
import './App.css'

export type WeaveType = 'plain' | 'twill' | 'satin' | 'basket'

function App() {
  const [zoom, setZoom] = useState(20)
  const [weaveType, setWeaveType] = useState<WeaveType>('plain')
  const [threadSpacing, setThreadSpacing] = useState(1)
  const [threadThickness, setThreadThickness] = useState(0.15)
  const [weaveHeight, setWeaveHeight] = useState(0.3)
  const [gridSize, setGridSize] = useState(20)
  const [weftColor, setWeftColor] = useState('#14407a')
  const [warpColor, setWarpColor] = useState('#b4a08c')
  const [showControls, setShowControls] = useState(true)

  const weaveTypes: WeaveType[] = ['plain', 'twill', 'satin', 'basket']

  return (
    <div className="app">
      <div className={`control-panel ${showControls ? 'visible' : ''}`}>
        <button 
          className="toggle-controls"
          onClick={() => setShowControls(!showControls)}
        >
          {showControls ? '×' : '☰'}
        </button>
        
        <h3>Weave Controls</h3>
        
        <div className="control-group">
          <label>Weave Type</label>
          <div className="weave-buttons">
            {weaveTypes.map((type) => (
              <button
                key={type}
                className={`weave-button ${weaveType === type ? 'active' : ''}`}
                onClick={() => setWeaveType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="control-group">
          <label>Zoom: {zoom}</label>
          <input
            type="range"
            min="5"
            max="50"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Thread Spacing: {threadSpacing.toFixed(2)}</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={threadSpacing}
            onChange={(e) => setThreadSpacing(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Thread Thickness: {threadThickness.toFixed(2)}</label>
          <input
            type="range"
            min="0.05"
            max="0.3"
            step="0.01"
            value={threadThickness}
            onChange={(e) => setThreadThickness(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Weave Height: {weaveHeight.toFixed(2)}</label>
          <input
            type="range"
            min="0.1"
            max="0.8"
            step="0.05"
            value={weaveHeight}
            onChange={(e) => setWeaveHeight(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Grid Size: {gridSize}</label>
          <input
            type="range"
            min="10"
            max="40"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Weft Color</label>
          <input
            type="color"
            value={weftColor}
            onChange={(e) => setWeftColor(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>Warp Color</label>
          <input
            type="color"
            value={warpColor}
            onChange={(e) => setWarpColor(e.target.value)}
          />
        </div>
      </div>
      
      <WeavePattern3D 
        zoom={zoom} 
        weaveType={weaveType}
        threadSpacing={threadSpacing}
        threadThickness={threadThickness}
        weaveHeight={weaveHeight}
        gridSize={gridSize}
        weftColor={weftColor}
        warpColor={warpColor}
      />
    </div>
  )
}

export default App