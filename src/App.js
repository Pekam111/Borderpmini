import React, { useState } from 'react';
import { Download, Palette, Eye, Grid } from 'lucide-react';

const A4BorderDesigner = () => {
  const [borderWidth, setBorderWidth] = useState(0.8);
  const [borderStyle, setBorderStyle] = useState('gradient');
  const [colors, setColors] = useState(['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24']);
  const [gradientDirection, setGradientDirection] = useState('45deg');
  const [patternType, setPatternType] = useState('diagonal');
  const [content, setContent] = useState('Your document content goes here...\n\nThis is a sample A4 page with a customizable colorful border.\n\nYou can modify the border width, colors, and patterns using the controls on the left.');
  const [title, setTitle] = useState('Document Title');
  const [showIconPanel, setShowIconPanel] = useState(false);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [iconSpacing, setIconSpacing] = useState(3);
  const [iconSize, setIconSize] = useState(0.4);
  const [iconColor, setIconColor] = useState('#666666');
  const [iconOpacity, setIconOpacity] = useState(0.7);

  const availableIcons = [
    { name: 'Circle', svg: '<circle cx="12" cy="12" r="10" fill="currentColor"/>' },
    { name: 'Triangle', svg: '<polygon points="12,2 22,20 2,20" fill="currentColor"/>' },
    { name: 'Square', svg: '<rect x="4" y="4" width="16" height="16" fill="currentColor"/>' },
    { name: 'Hexagon', svg: '<polygon points="12,2 20,7 20,17 12,22 4,17 4,7" fill="currentColor"/>' },
    { name: 'Diamond', svg: '<polygon points="12,2 22,12 12,22 2,12" fill="currentColor"/>' },
    { name: 'Star', svg: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>' }
  ];

  const presetColorSchemes = [
    { name: 'Sunset', colors: ['#ff6b6b', '#ff8e53', '#ff6b9d', '#c44569'] },
    { name: 'Ocean', colors: ['#4ecdc4', '#45b7d1', '#96ceb4', '#54a0ff'] },
    { name: 'Forest', colors: ['#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'] }
  ];

  const toggleIcon = (icon) => {
    setSelectedIcons(prev => 
      prev.some(i => i.name === icon.name) 
        ? prev.filter(i => i.name !== icon.name) 
        : [...prev, icon]
    );
  };

  const getBorderStyle = () => {
    const borderWidthCm = `${borderWidth}cm`;
    
    switch (borderStyle) {
      case 'gradient':
        return {
          border: `${borderWidthCm} solid`,
          borderImage: `linear-gradient(${gradientDirection}, ${colors.join(', ')}) 1`
        };
      case 'solid':
        return {
          border: `${borderWidthCm} solid ${colors[0]}`
        };
      case 'pattern':
        return {
          border: `${borderWidthCm} solid #f0f0f0`,
          backgroundImage: getPatternBackground(),
          backgroundSize: '0.4cm 0.4cm'
        };
      default:
        return {
          border: `${borderWidthCm} ${borderStyle} ${colors[0]}`
        };
    }
  };

  const getPatternBackground = () => {
    switch (patternType) {
      case 'diagonal':
        return `linear-gradient(45deg, ${colors[0]} 25%, transparent 25%), 
                linear-gradient(-45deg, ${colors[1]} 25%, transparent 25%)`;
      case 'checkerboard':
        return `linear-gradient(45deg, ${colors[0]} 50%, ${colors[1]} 50%)`;
      default:
        return `linear-gradient(90deg, ${colors.join(', ')})`;
    }
  };

  const handleColorChange = (index, newColor) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  const applyPreset = (preset) => {
    setColors(preset.colors);
  };

  const generateIcons = () => {
    if (selectedIcons.length === 0) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const icon = selectedIcons[i % selectedIcons.length];
          return (
            <div 
              key={i}
              className="absolute"
              style={{
                color: iconColor,
                opacity: iconOpacity,
                width: `${iconSize}cm`,
                height: `${iconSize}cm`,
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 90 + 5}%`
              }}
            >
              <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: icon.svg }} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">A4 Page Border Designer</h1>
            <p className="text-blue-100">Create beautiful A4 pages with customizable colorful borders</p>
          </div>
          
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 p-6 bg-gray-50 border-r border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Palette className="mr-2" size={20} />
                Border Settings
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Border Width (cm)</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{borderWidth}cm</span>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Border Style</label>
                <select
                  value={borderStyle}
                  onChange={(e) => setBorderStyle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="gradient">Gradient</option>
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="pattern">Pattern</option>
                </select>
              </div>
              
              {borderStyle === 'gradient' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Gradient Direction</label>
                  <select
                    value={gradientDirection}
                    onChange={(e) => setGradientDirection(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="45deg">Diagonal ↗</option>
                    <option value="90deg">Vertical ↑</option>
                    <option value="0deg">Horizontal →</option>
                  </select>
                </div>
              )}
              
              {borderStyle === 'pattern' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Pattern Type</label>
                  <select
                    value={patternType}
                    onChange={(e) => setPatternType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="diagonal">Diagonal</option>
                    <option value="checkerboard">Checkerboard</option>
                  </select>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Colors</label>
                <div className="grid grid-cols-2 gap-2">
                  {colors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="flex-1 p-1 text-xs border border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Color Presets</label>
                <div className="grid grid-cols-1 gap-2">
                  {presetColorSchemes.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => applyPreset(preset)}
                      className="flex items-center space-x-2 p-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <div className="flex space-x-1">
                        {preset.colors.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-sm">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <button 
                  onClick={() => setShowIconPanel(!showIconPanel)}
                  className="flex items-center space-x-2 mb-2 text-blue-600"
                >
                  <Grid size={20} />
                  <span>Border Icons ({selectedIcons.length})</span>
                </button>

                {showIconPanel && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-2">Select Icons</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {availableIcons.map((icon, index) => (
                        <div 
                          key={index}
                          onClick={() => toggleIcon(icon)}
                          className={`p-2 border rounded-md cursor-pointer ${
                            selectedIcons.some(i => i.name === icon.name) 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <svg 
                              viewBox="0 0 24 24" 
                              width="20" 
                              height="20"
                              className="text-gray-800"
                              dangerouslySetInnerHTML={{ __html: icon.svg }}
                            />
                            <span>{icon.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedIcons.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Icon Settings</label>
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs">Size (cm)</label>
                            <input
                              type="range"
                              min="0.1"
                              max="1"
                              step="0.1"
                              value={iconSize}
                              onChange={(e) => setIconSize(parseFloat(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-xs">Color</label>
                            <input
                              type="color"
                              value={iconColor}
                              onChange={(e) => setIconColor(e.target.value)}
                              className="w-full h-8"
                            />
                          </div>
                          <div>
                            <label className="text-xs">Opacity</label>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={iconOpacity}
                              onChange={(e) => setIconOpacity(parseFloat(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Document Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <button
                onClick={() => {
                  const html = document.documentElement.outerHTML;
                  const blob = new Blob([html], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'border-design.html';
                  a.click();
                }}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download size={20} />
                <span>Download HTML</span>
              </button>
            </div>
            
            <div className="lg:w-2/3 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Eye className="mr-2" size={20} />
                Preview
              </h2>
              
              <div className="bg-gray-200 p-4 rounded-lg overflow-auto">
                <div className="mx-auto" style={{ width: '21cm', height: '29.7cm', transform: 'scale(0.4)', transformOrigin: 'top left' }}>
                  <div
                    className="bg-white relative"
                    style={{
                      width: '21cm',
                      height: '29.7cm',
                      ...getBorderStyle()
                    }}
                  >
                    {generateIcons()}
                    <div
                      className="overflow-hidden"
                      style={{
                        padding: '1cm',
                        height: 'calc(100% - 2cm)'
                      }}
                    >
                      <h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default A4BorderDesigner;
