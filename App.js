import React, { useState } from 'react';
import { Download, Palette, RotateCcw, Eye, Shuffle, Grid3X3 } from 'lucide-react';

const A4BorderDesigner = () => {
  const [borderWidth, setBorderWidth] = useState(0.8);
  const [borderStyle, setBorderStyle] = useState('gradient');
  const [colors, setColors] = useState(['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24']);
  const [gradientDirection, setGradientDirection] = useState('45deg');
  const [patternType, setPatternType] = useState('diagonal');
  const [content, setContent] = useState('Your document content goes here...\n\nThis is a sample A4 page with a customizable colorful border.\n\nYou can modify the border width, colors, and patterns using the controls on the left.');
  const [title, setTitle] = useState('Document Title');
  const [showIcons, setShowIcons] = useState(false);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [iconSpacing, setIconSpacing] = useState(3);
  const [iconSize, setIconSize] = useState(0.4);
  const [iconColor, setIconColor] = useState('#666666');
  const [iconOpacity, setIconOpacity] = useState(0.7);

  const availableIcons = [
    // Geometric Shapes
    { name: 'Circle', category: 'geometric', svg: '<circle cx="12" cy="12" r="10" fill="currentColor"/>' },
    { name: 'Triangle', category: 'geometric', svg: '<polygon points="12,2 22,20 2,20" fill="currentColor"/>' },
    { name: 'Square', category: 'geometric', svg: '<rect x="4" y="4" width="16" height="16" fill="currentColor"/>' },
    { name: 'Hexagon', category: 'geometric', svg: '<polygon points="12,2 20,7 20,17 12,22 4,17 4,7" fill="currentColor"/>' },
    { name: 'Diamond', category: 'geometric', svg: '<polygon points="12,2 22,12 12,22 2,12" fill="currentColor"/>' },
    { name: 'Pentagon', category: 'geometric', svg: '<polygon points="12,2 22,9 18,22 6,22 2,9" fill="currentColor"/>' },
    { name: 'Spiral', category: 'geometric', svg: '<path d="M12,2 Q22,12 12,22 Q2,12 12,2" fill="none" stroke="currentColor" stroke-width="2"/>' },
    
    // Science Icons
    { name: 'Atom', category: 'science', svg: '<circle cx="12" cy="12" r="3" fill="currentColor"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="12" cy="12" rx="4" ry="10" fill="none" stroke="currentColor" stroke-width="2"/>' },
    { name: 'DNA', category: 'science', svg: '<path d="M6,2 Q12,8 18,2 Q12,8 6,14 Q12,20 18,14 Q12,20 6,22" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="6" r="1" fill="currentColor"/><circle cx="16" cy="6" r="1" fill="currentColor"/><circle cx="8" cy="18" r="1" fill="currentColor"/><circle cx="16" cy="18" r="1" fill="currentColor"/>' },
    { name: 'Beaker', category: 'science', svg: '<path d="M8,2 h8 v6 l4,12 H4 l4,-12 V2 z" fill="currentColor"/><rect x="10" y="6" width="4" height="2" fill="white"/>' },
    { name: 'Microscope', category: 'science', svg: '<rect x="6" y="2" width="2" height="8" fill="currentColor"/><circle cx="7" cy="12" r="3" fill="currentColor"/><rect x="2" y="20" width="20" height="2" fill="currentColor"/><rect x="10" y="14" width="8" height="2" fill="currentColor"/>' },
    { name: 'Gear', category: 'science', svg: '<path d="M12,2 l2,2 h2 l2,-2 v2 l2,2 v2 l-2,2 v2 l2,2 v2 l-2,2 h-2 l-2,2 h-2 l-2,-2 h-2 l-2,2 v-2 l-2,-2 v-2 l2,-2 v-2 l-2,-2 v-2 l2,-2 h2 l2,-2 z" fill="currentColor"/><circle cx="12" cy="12" r="3" fill="white"/>' },
    { name: 'Molecule', category: 'science', svg: '<circle cx="6" cy="6" r="2" fill="currentColor"/><circle cx="18" cy="6" r="2" fill="currentColor"/><circle cx="12" cy="18" r="2" fill="currentColor"/><line x1="6" y1="6" x2="18" y2="6" stroke="currentColor" stroke-width="2"/><line x1="6" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="2"/><line x1="18" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="2"/>' },
    
    // History Icons
    { name: 'Scroll', category: 'history', svg: '<path d="M4,6 Q2,6 2,8 v8 Q2,18 4,18 h16 Q22,18 22,16 V8 Q22,6 20,6 z" fill="currentColor"/><path d="M2,8 Q4,8 4,10 v4 Q4,16 2,16" fill="white"/><path d="M22,8 Q20,8 20,10 v4 Q20,16 22,16" fill="white"/>' },
    { name: 'Hourglass', category: 'history', svg: '<path d="M6,2 h12 v6 l-6,6 l6,6 v6 H6 v-6 l6,-6 l-6,-6 z" fill="currentColor"/><rect x="8" y="4" width="8" height="2" fill="white"/>' },
    { name: 'Compass', category: 'history', svg: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="12,2 14,10 12,12 10,10" fill="currentColor"/><polygon points="12,22 10,14 12,12 14,14" fill="currentColor"/><polygon points="2,12 10,10 12,12 10,14" fill="currentColor"/><polygon points="22,12 14,14 12,12 14,10" fill="currentColor"/>' },
    { name: 'Column', category: 'history', svg: '<rect x="8" y="2" width="8" height="2" fill="currentColor"/><rect x="9" y="4" width="6" height="16" fill="currentColor"/><rect x="8" y="20" width="8" height="2" fill="currentColor"/>' },
    { name: 'Shield', category: 'history', svg: '<path d="M12,2 L20,6 v6 Q20,18 12,22 Q4,18 4,12 V6 z" fill="currentColor"/><path d="M12,4 L17,7 v5 Q17,16 12,19 Q7,16 7,12 V7 z" fill="white"/>' },
    { name: 'Quill', category: 'history', svg: '<path d="M2,20 L8,14 L20,2 Q22,2 22,4 L10,16 L4,22 Q2,22 2,20" fill="currentColor"/><path d="M8,14 L14,8" stroke="white" stroke-width="2"/>' },
    
    // Literature Icons
    { name: 'Book', category: 'literature', svg: '<rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor"/><path d="M12,4 v16" stroke="white" stroke-width="2"/><rect x="6" y="8" width="4" height="1" fill="white"/><rect x="14" y="8" width="4" height="1" fill="white"/>' },
    { name: 'Feather', category: 'literature', svg: '<path d="M2,20 Q8,14 14,8 Q18,4 20,2 Q22,2 22,4 Q20,8 16,12 Q10,18 4,22 Q2,22 2,20" fill="currentColor"/><path d="M6,16 Q12,10 16,6" stroke="white" stroke-width="1"/>' },
    { name: 'Inkwell', category: 'literature', svg: '<rect x="6" y="8" width="12" height="8" rx="2" fill="currentColor"/><rect x="8" y="10" width="8" height="4" fill="white"/><rect x="10" y="2" width="4" height="8" fill="currentColor"/>' },
    { name: 'Bookmark', category: 'literature', svg: '<path d="M8,2 h8 v20 l-4,-4 l-4,4 z" fill="currentColor"/><rect x="10" y="6" width="4" height="1" fill="white"/>' },
    { name: 'Laurel', category: 'literature', svg: '<path d="M4,12 Q6,8 8,6 Q10,4 12,4 Q14,4 16,6 Q18,8 20,12 Q18,16 16,18 Q14,20 12,20 Q10,20 8,18 Q6,16 4,12" fill="currentColor"/><path d="M7,10 Q9,8 11,8 Q13,8 15,10" fill="white"/><path d="M7,14 Q9,16 11,16 Q13,16 15,14" fill="white"/>' },
    { name: 'Typewriter', category: 'literature', svg: '<rect x="4" y="8" width="16" height="8" rx="1" fill="currentColor"/><rect x="6" y="10" width="2" height="2" fill="white"/><rect x="9" y="10" width="2" height="2" fill="white"/><rect x="12" y="10" width="2" height="2" fill="white"/><rect x="15" y="10" width="2" height="2" fill="white"/><rect x="8" y="18" width="8" height="2" fill="currentColor"/>' }
  ];

  const presetColorSchemes = [
    { name: 'Sunset', colors: ['#ff6b6b', '#ff8e53', '#ff6b9d', '#c44569'] },
    { name: 'Ocean', colors: ['#4ecdc4', '#45b7d1', '#96ceb4', '#54a0ff'] },
    { name: 'Forest', colors: ['#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'] },
    { name: 'Autumn', colors: ['#e17055', '#fdcb6e', '#e84393', '#fd79a8'] },
    { name: 'Neon', colors: ['#00ff88', '#00d4ff', '#ff0080', '#ffff00'] }
  ];

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
      case 'dashed':
        return {
          border: `${borderWidthCm} dashed ${colors[0]}`
        };
      case 'dotted':
        return {
          border: `${borderWidthCm} dotted ${colors[0]}`
        };
      case 'double':
        return {
          border: `${borderWidthCm} double ${colors[0]}`
        };
      case 'pattern':
        return {
          border: `${borderWidthCm} solid #f0f0f0`,
          backgroundImage: getPatternBackground(),
          backgroundSize: '0.4cm 0.4cm'
        };
      default:
        return {
          border: `${borderWidthCm} solid`,
          borderImage: `linear-gradient(${gradientDirection}, ${colors.join(', ')}) 1`
        };
    }
  };

  const getPatternBackground = () => {
    switch (patternType) {
      case 'diagonal':
        return `linear-gradient(45deg, ${colors[0]} 25%, transparent 25%), 
                linear-gradient(-45deg, ${colors[1]} 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, ${colors[2]} 75%), 
                linear-gradient(-45deg, transparent 75%, ${colors[3]} 75%)`;
      case 'checkerboard':
        return `linear-gradient(90deg, ${colors[0]} 50%, ${colors[1]} 50%), 
                linear-gradient(${colors[2]} 50%, ${colors[3]} 50%)`;
      case 'stripes':
        return `linear-gradient(90deg, ${colors[0]} 25%, ${colors[1]} 25%, ${colors[1]} 50%, ${colors[2]} 50%, ${colors[2]} 75%, ${colors[3]} 75%)`;
      default:
        return `linear-gradient(45deg, ${colors[0]} 25%, transparent 25%)`;
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

  const downloadHTML = () => {
    const iconsSvgCode = showIcons && selectedIcons.length > 0 ? `
        .border-icons {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        
        .border-icon {
            position: absolute;
            color: ${iconColor};
            opacity: ${iconOpacity};
        }
        
        .border-icon svg {
            width: 100%;
            height: 100%;
        }
    ` : '';

    const iconsHtmlCode = showIcons && selectedIcons.length > 0 ? `
        <div class="border-icons">
            ${generateStaticIcons()}
        </div>
    ` : '';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        
        .a4-page {
            width: 21cm;
            height: 29.7cm;
            margin: 0 auto;
            background: white;
            position: relative;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            ${Object.entries(getBorderStyle()).map(([key, value]) => `${key}: ${value};`).join('\n            ')}
        }
        
        .page-content {
            padding: 1cm;
            height: calc(100% - 2cm);
            overflow: hidden;
        }
        
        h1 {
            margin-bottom: 1cm;
            color: #333;
        }
        
        p {
            line-height: 1.6;
            color: #555;
            white-space: pre-wrap;
        }
        
        ${iconsSvgCode}
        
        @media print {
            body { 
                background: white; 
                padding: 0; 
            }
            .a4-page { 
                margin: 0; 
                box-shadow: none; 
                page-break-after: always; 
            }
        }
    </style>
</head>
<body>
    <div class="a4-page">
        ${iconsHtmlCode}
        <div class="page-content">
            <h1>${title}</h1>
            <p>${content}</p>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'a4-bordered-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateStaticIcons = () => {
    const icons = [];
    const pageWidth = 21; // cm
    const pageHeight = 29.7; // cm
    const spacing = iconSpacing; // cm
    const iconSizeCm = iconSize; // cm
    
    // Generate icons for each border
    ['top', 'bottom', 'left', 'right'].forEach(side => {
      const positions = [];
      
      if (side === 'top' || side === 'bottom') {
        for (let x = spacing; x < pageWidth - spacing; x += spacing) {
          positions.push(x);
        }
      } else {
        for (let y = spacing; y < pageHeight - spacing; y += spacing) {
          positions.push(y);
        }
      }
      
      positions.forEach((pos, index) => {
        const randomIcon = selectedIcons[index % selectedIcons.length];
        let style = '';
        
        switch (side) {
          case 'top':
            style = `left: ${pos}cm; top: ${borderWidth/2 - iconSizeCm/2}cm;`;
            break;
          case 'bottom':
            style = `left: ${pos}cm; bottom: ${borderWidth/2 - iconSizeCm/2}cm;`;
            break;
          case 'left':
            style = `left: ${borderWidth/2 - iconSizeCm/2}cm; top: ${pos}cm;`;
            break;
          case 'right':
            style = `right: ${borderWidth/2 - iconSizeCm/2}cm; top: ${pos}cm;`;
            break;
        }
        
        icons.push(`
            <div class="border-icon" style="${style} width: ${iconSizeCm}cm; height: ${iconSizeCm}cm;">
                <svg viewBox="0 0 24 24">${randomIcon.svg}</svg>
            </div>
        `);
      });
    });
    
    return icons.join('');
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
            {/* Controls Panel */}
            <div className="lg:w-1/3 p-6 bg-gray-50 border-r border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Palette className="mr-2" size={20} />
                Border Settings
              </h2>
              
              {/* Border Width */}
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
              
              {/* Border Style */}
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
                  <option value="double">Double</option>
                  <option value="pattern">Pattern</option>
                </select>
              </div>
              
              {/* Gradient Direction */}
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
                    <option value="135deg">Diagonal ↖</option>
                    <option value="180deg">Horizontal ←</option>
                    <option value="225deg">Diagonal ↙</option>
                    <option value="270deg">Vertical ↓</option>
                    <option value="315deg">Diagonal ↘</option>
                  </select>
                </div>
              )}
              
              {/* Pattern Type */}
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
                    <option value="stripes">Stripes</option>
                  </select>
                </div>
              )}
              
              {/* Colors */}
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
              
              {/* Preset Colors */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Preset Color Schemes</label>
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
              
              {/* Content */}
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
              
              {/* Download Button */}
              <button
                onClick={downloadHTML}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download size={20} />
                <span>Download HTML</span>
              </button>
            </div>
            
            {/* Preview Panel */}
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
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Adjust border width, style, and colors using the controls</li>
                  <li>• Try different preset color schemes</li>
                  <li>• Edit your document title and content</li>
                  <li>• Download the HTML file when you're satisfied</li>
                  <li>• Open the downloaded file in any browser to view or print</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default A4BorderDesigner;
