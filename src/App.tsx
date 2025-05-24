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
  const [weftColor, setWeftColor] = useState('#8B9DC3')
  const [warpColor, setWarpColor] = useState('#F4E8D0')
  const [showControls, setShowControls] = useState(true)

  const weaveTypes: WeaveType[] = ['plain', 'twill', 'satin', 'basket']
  
  const weftPresets = [
    '#8B9DC3', // Soft blue (default)
    '#D4A5A5', // Dusty rose
    '#A8DADC', // Powder blue
    '#B5A7C6', // Lavender
    '#C9ADA7', // Warm gray
    '#A5C9A5'  // Sage green
  ]
  
  const warpPresets = [
    '#F4E8D0', // Cream (default)
    '#FAF0E6', // Linen
    '#FFF8DC', // Cornsilk
    '#F5F5DC', // Beige
    '#FFEFD5', // Papaya whip
    '#F0EAD6'  // Eggshell
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
        
        
        <div className="control-group">
          <label>Weave Pattern</label>
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
          <label>Weft Color (Horizontal)</label>
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
          <label>Warp Color (Vertical)</label>
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