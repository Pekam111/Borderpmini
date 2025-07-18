import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Download, Palette, Eye, Grid, ChevronDown } from 'lucide-react';

// To make the component self-contained, we define helpers and constants at the top.
const A4_ASPECT_RATIO = 29.7 / 21;

const availableIcons = [
  { name: 'Circle', svg: '<circle cx="12" cy="12" r="10" fill="currentColor"/>' },
  { name: 'Triangle', svg: '<polygon points="12,2 22,20 2,20" fill="currentColor"/>' },
  { name: 'Square', svg: '<rect x="4" y="4" width="16" height="16" fill="currentColor"/>' },
  { name: 'Hexagon', svg: '<polygon points="12,2 20,7 20,17 12,22 4,17 4,7" fill="currentColor"/>' },
  { name: 'Diamond', svg: '<polygon points="12,2 22,12 12,22 2,12" fill="currentColor"/>' },
  { name: 'Star', svg: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>' }
];

const presetColorSchemes = [
  { name: 'Sunset', colors: ['#ff6b6b', '#ff8e53', '#ffc145', '#f7b733'] },
  { name:_('Ocean'), colors: ['#4ecdc4', '#45b7d1', '#5f27cd', '#2e86de'] },
  { name: 'Forest', colors: ['#556b2f', '#8fbc8f', '#2e8b57', '#3cb371'] },
  { name: 'Pastel', colors: ['#a29bfe', '#fd79a8', '#ffeaa7', '#b2bec3'] }
];


const A4BorderDesigner = () => {
  // --- STATE MANAGEMENT ---
  const [borderWidth, setBorderWidth] = useState(0.8);
  const [borderStyle, setBorderStyle] = useState('gradient');
  const [colors, setColors] = useState(['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24']);
  const [gradientDirection, setGradientDirection] = useState('45deg');
  const [patternType, setPatternType] = useState('diagonal');
  
  const [title, setTitle] = useState('Document Title');
  const [content, setContent] = useState('Your document content goes here...\n\nThis is a sample A4 page with a customizable colorful border. You can modify the border width, colors, and patterns using the controls on the left. The download functionality now creates a perfect, self-contained HTML file of this preview.');
  
  // Icon-related state
  const [showIconPanel, setShowIconPanel] = useState(false);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [iconSize, setIconSize] = useState(0.4);
  const [iconColor, setIconColor] = useState('#666666');
  const [iconOpacity, setIconOpacity] = useState(0.3);
  const [iconPositions, setIconPositions] = useState([]);

  // --- DERIVED STATE & MEMOIZED VALUES ---

  // Effect to generate stable icon positions only when selected icons change
  useEffect(() => {
    if (selectedIcons.length === 0) {
      setIconPositions([]);
      return;
    }
    const newPositions = [...Array(40)].map(() => ({
      icon: selectedIcons[Math.floor(Math.random() * selectedIcons.length)],
      top: `${Math.random() * 95 + 2.5}%`,
      left: `${Math.random() * 95 + 2.5}%`,
    }));
    setIconPositions(newPositions);
  }, [selectedIcons]);

  const borderStyleObject = useMemo(() => {
    const borderWidthCm = `${borderWidth}cm`;
    const baseStyle = { boxSizing: 'border-box' };

    switch (borderStyle) {
      case 'gradient':
        return {
          ...baseStyle,
          border: `${borderWidthCm} solid transparent`,
          borderImage: `linear-gradient(${gradientDirection}, ${colors.join(', ')}) 1`,
        };
      case 'solid':
        return { ...baseStyle, border: `${borderWidthCm} solid ${colors[0]}` };
      case 'dashed':
      case 'dotted':
        return { ...baseStyle, border: `${borderWidthCm} ${borderStyle} ${colors[0]}` };
      case 'pattern':
        let backgroundImage, backgroundSize = '0.5cm 0.5cm';
        if (patternType === 'diagonal') {
          backgroundImage = `linear-gradient(45deg, ${colors[0]} 25%, transparent 25%, transparent 75%, ${colors[0]} 75%), linear-gradient(45deg, ${colors[0]} 25%, transparent 25%, transparent 75%, ${colors[0]} 75%)`;
          backgroundSize = '0.8cm 0.8cm';
        } else { // checkerboard
          backgroundImage = `linear-gradient(45deg, ${colors[0]} 25%, transparent 25%), linear-gradient(-45deg, ${colors[0]} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${colors[0]} 75%), linear-gradient(-45deg, transparent 75%, ${colors[0]} 75%)`;
          backgroundSize = `0.8cm 0.8cm`;
        }
        return {
          ...baseStyle,
          border: `${borderWidthCm} solid transparent`,
          backgroundColor: colors[1] || '#f0f0f0',
          backgroundImage: backgroundImage,
          backgroundSize: backgroundSize,
        };
      default:
        return { ...baseStyle, border: `${borderWidthCm} solid black` };
    }
  }, [borderWidth, borderStyle, colors, gradientDirection, patternType]);

  const renderedIcons = useMemo(() => {
    if (selectedIcons.length === 0) return null;
    return iconPositions.map((p, i) => (
      <div
        key={i}
        className="absolute"
        style={{
          color: iconColor,
          opacity: iconOpacity,
          width: `${iconSize}cm`,
          height: `${iconSize}cm`,
          left: p.left,
          top: p.top,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: p.icon.svg }} />
      </div>
    ));
  }, [iconPositions, iconColor, iconOpacity, iconSize, selectedIcons.length]);


  // --- EVENT HANDLERS ---
  const handleColorChange = useCallback((index, newColor) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  }, [colors]);

  const applyPreset = useCallback((preset) => {
    setColors(preset.colors);
  }, []);

  const toggleIcon = useCallback((icon) => {
    setSelectedIcons(prev =>
      prev.some(i => i.name === icon.name)
        ? prev.filter(i => i.name !== icon.name)
        : [...prev, icon]
    );
  }, []);
  
  // --- DOWNLOAD LOGIC ---
  const handleDownload = () => {
    const borderCss = Object.entries(borderStyleObject)
      .map(([key, value]) => {
        const prop = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
        return `${prop}: ${value};`;
      })
      .join(' ');

    const iconsHtml = iconPositions.map((p, i) =>
      `<div style="position: absolute; color: ${iconColor}; opacity: ${iconOpacity}; width: ${iconSize}cm; height: ${iconSize}cm; left: ${p.left}; top: ${p.top}; transform: translate(-50%, -50%);">
         <svg viewBox="0 0 24 24">${p.icon.svg}</svg>
       </div>`
    ).join('');
    
    // Sanitize content for HTML display
    const sanitizedContent = content
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, ''');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
          body {
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
          }
          .page {
            width: 21cm;
            height: 29.7cm;
            background-color: white;
            position: relative;
            ${borderCss}
          }
          .content {
            padding: 1.5cm;
            height: calc(100% - 3cm);
            overflow: hidden;
            box-sizing: border-box;
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 24px;
            color: #333;
          }
          .text-content {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        <div class="page">
          ${iconsHtml}
          <div class="content">
            <h1 class="title">${title}</h1>
            <p class="text-content">${sanitizedContent}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'a4-border-design.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-1">A4 Page Border Designer</h1>
            <p className="text-gray-300">Create, preview, and download beautiful A4 pages with custom borders.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row">
            {/* --- CONTROLS PANEL --- */}
            <div className="lg:w-1/3 p-6 bg-gray-50 border-r border-gray-200 space-y-6 overflow-y-auto" style={{maxHeight: 'calc(100vh - 100px)'}}>
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-700"><Palette className="mr-2" size={20} />Border Settings</h2>
                <div className="space-y-4 pl-2 border-l-2 border-gray-200">
                  <div>
                    <label className="block text-sm font-medium mb-1">Width: <span className="font-normal text-gray-600">{borderWidth}cm</span></label>
                    <input type="range" min="0.1" max="2.5" step="0.1" value={borderWidth} onChange={(e) => setBorderWidth(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Style</label>
                    <select value={borderStyle} onChange={(e) => setBorderStyle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="gradient">Gradient</option> <option value="solid">Solid</option> <option value="dashed">Dashed</option> <option value="dotted">Dotted</option> <option value="pattern">Pattern</option>
                    </select>
                  </div>
                  {borderStyle === 'gradient' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Gradient Direction</label>
                      <select value={gradientDirection} onChange={(e) => setGradientDirection(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                        <option value="45deg">Diagonal ↗</option> <option value="90deg">Vertical ↑</option> <option value="0deg">Horizontal →</option> <option value="135deg">Diagonal ↘</option>
                      </select>
                    </div>
                  )}
                  {borderStyle === 'pattern' && (
                     <div>
                      <label className="block text-sm font-medium mb-1">Pattern Type</label>
                      <select value={patternType} onChange={(e) => setPatternType(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                        <option value="checkerboard">Checkerboard</option> <option value="diagonal">Diagonal Lines</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Colors</label>
                 <div className="grid grid-cols-2 gap-3 pl-2 border-l-2 border-gray-200">
                  {colors.slice(0, borderStyle === 'solid' ? 1 : borderStyle === 'pattern' ? 2 : 4).map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="color" value={color} onChange={(e) => handleColorChange(index, e.target.value)} className="w-8 h-8 p-0 border-none rounded-md cursor-pointer"/>
                      <input type="text" value={color} onChange={(e) => handleColorChange(index, e.target.value)} className="w-full p-1 text-xs border border-gray-300 rounded"/>
                    </div>
                  ))}
                </div>
              </div>

               <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Color Presets</label>
                  <div className="grid grid-cols-2 gap-2">
                    {presetColorSchemes.map((preset) => (
                      <button key={preset.name} onClick={() => applyPreset(preset)} className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200">
                        <div className="flex space-x-1">{preset.colors.map((c, i) => (<div key={i} className="w-4 h-4 rounded-full border border-gray-400" style={{ backgroundColor: c }}/>))}</div>
                        <span className="text-sm">{preset.name}</span>
                      </button>
                    ))}
                  </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
                <button onClick={() => setShowIconPanel(!showIconPanel)} className="w-full flex justify-between items-center p-3 text-left font-semibold text-gray-700">
                  <span className="flex items-center"><Grid className="mr-2" size={20} /> Border Icons ({selectedIcons.length})</span>
                  <ChevronDown size={20} className={`transition-transform duration-300 ${showIconPanel ? 'rotate-180' : ''}`} />
                </button>
                {showIconPanel && (
                  <div className="p-3 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {availableIcons.map((icon) => (
                        <div key={icon.name} onClick={() => toggleIcon(icon)} className={`p-2 border rounded-md cursor-pointer flex items-center justify-center ${selectedIcons.some(i => i.name === icon.name) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                           <svg viewBox="0 0 24 24" width="24" height="24" className="text-gray-700" dangerouslySetInnerHTML={{ __html: icon.svg }} />
                        </div>
                      ))}
                    </div>
                    {selectedIcons.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">Size: <span className="font-normal text-gray-600">{iconSize}cm</span></label>
                          <input type="range" min="0.2" max="1.5" step="0.1" value={iconSize} onChange={(e) => setIconSize(parseFloat(e.target.value))} className="w-full"/>
                        </div>
                        <div>
                           <label className="block text-xs font-medium mb-1">Opacity: <span className="font-normal text-gray-600">{iconOpacity}</span></label>
                           <input type="range" min="0.05" max="1" step="0.05" value={iconOpacity} onChange={(e) => setIconOpacity(parseFloat(e.target.value))} className="w-full"/>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Color</label>
                          <input type="color" value={iconColor} onChange={(e) => setIconColor(e.target.value)} className="w-full h-8 p-0 border-none rounded"/>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Document Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Content</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                </div>
              </div>

              <button onClick={handleDownload} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Download size={20} /> <span>Download Standalone HTML</span>
              </button>
            </div>
            
            {/* --- PREVIEW PANEL --- */}
            <div className="lg:w-2/3 p-6 flex flex-col bg-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700"><Eye className="mr-2" size={20} />Preview</h2>
              <div className="flex-grow bg-gray-200 rounded-lg flex items-center justify-center p-4 overflow-hidden">
                  <div className="shadow-2xl" style={{ width: '21cm', height: '29.7cm', transform: 'scale(0.8)', transformOrigin: 'center' }}>
                    <div className="bg-white w-full h-full relative" style={borderStyleObject}>
                      {renderedIcons}
                      <div className="overflow-hidden p-[1.5cm]" style={{ height: '100%', boxSizing: 'border-box' }}>
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
