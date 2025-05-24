import { useState } from 'react'
import { WeavePattern3D } from './components/WeavePattern3D'
import './App.css'

export type WeaveType = 'plain' | 'twill' | 'satin' | 'basket'

function App() {
  const [zoom, setZoom] = useState(30)
  const [weaveType, setWeaveType] = useState<WeaveType>('plain')
  const [threadSpacing, setThreadSpacing] = useState(0.8)
  const [threadThickness, setThreadThickness] = useState(0.28)
  const [weaveHeight, setWeaveHeight] = useState(0.3)
  const [gridSize, setGridSize] = useState(33)
  const [weftColor, setWeftColor] = useState('#4a5d7a')
  const [warpColor, setWarpColor] = useState('#d4c5b9')
  const [showControls, setShowControls] = useState(true)

  const weaveTypes: WeaveType[] = ['plain', 'twill', 'satin', 'basket']
  
  const weftPresets = [
    '#4a5d7a', // Slate blue (default)
    '#8b4513', // Saddle brown
    '#2f4f4f', // Dark slate gray
    '#483d8b', // Dark slate blue
    '#8b0000', // Dark red
    '#556b2f'  // Dark olive green
  ]
  
  const warpPresets = [
    '#d4c5b9', // Beige (default)
    '#f5deb3', // Wheat
    '#faebd7', // Antique white
    '#e6e6fa', // Lavender
    '#ffe4c4', // Bisque
    '#f0e68c'  // Khaki
  ]

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
            min="10"
            max="50"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Thread Spacing: {threadSpacing.toFixed(2)}</label>
          <input
            type="range"
            min="0.3"
            max="1.3"
            step="0.05"
            value={threadSpacing}
            onChange={(e) => setThreadSpacing(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Thread Thickness: {threadThickness.toFixed(2)}</label>
          <input
            type="range"
            min="0.1"
            max="0.5"
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
            max="0.6"
            step="0.05"
            value={weaveHeight}
            onChange={(e) => setWeaveHeight(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Grid Size: {gridSize}</label>
          <input
            type="range"
            min="15"
            max="50"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Weft Color</label>
          <div className="color-presets">
            {weftPresets.map((color) => (
              <button
                key={color}
                className="color-preset"
                style={{ backgroundColor: color }}
                onClick={() => setWeftColor(color)}
                title={color}
              />
            ))}
          </div>
          <input
            type="color"
            value={weftColor}
            onChange={(e) => setWeftColor(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>Warp Color</label>
          <div className="color-presets">
            {warpPresets.map((color) => (
              <button
                key={color}
                className="color-preset"
                style={{ backgroundColor: color }}
                onClick={() => setWarpColor(color)}
                title={color}
              />
            ))}
          </div>
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