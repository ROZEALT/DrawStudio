import { useRef, useCallback, useState, useEffect } from 'react';
import { BrushSettings, Layer, Point, HistoryState } from '@/types/drawing';

const MAX_HISTORY = 50;

export function useDrawingCanvas(width: number, height: number) {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string>('');
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const currentStroke = useRef<Point[]>([]);
  const lastPoint = useRef<Point | null>(null);

  // Initialize with default layer
  useEffect(() => {
    if (layers.length === 0) {
      const id = crypto.randomUUID();
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }
      
      setLayers([{
        id,
        name: 'Background',
        visible: true,
        opacity: 1,
        locked: false,
        canvas,
      }]);
      setActiveLayerId(id);
    }
  }, [width, height, layers.length]);

  const getActiveLayer = useCallback(() => {
    return layers.find(l => l.id === activeLayerId);
  }, [layers, activeLayerId]);

  const saveToHistory = useCallback(() => {
    const newHistory: HistoryState = {
      layers: layers.map(layer => ({
        id: layer.id,
        imageData: layer.canvas?.getContext('2d')?.getImageData(0, 0, width, height) as ImageData,
      })),
      activeLayerId,
    };

    setHistory(prev => {
      const newHistoryArray = prev.slice(0, historyIndex + 1);
      newHistoryArray.push(newHistory);
      if (newHistoryArray.length > MAX_HISTORY) {
        newHistoryArray.shift();
        return newHistoryArray;
      }
      return newHistoryArray;
    });
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [layers, activeLayerId, historyIndex, width, height]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    
    const prevState = history[historyIndex - 1];
    if (!prevState) return;

    setLayers(currentLayers => 
      currentLayers.map(layer => {
        const savedLayer = prevState.layers.find(l => l.id === layer.id);
        if (savedLayer && layer.canvas) {
          const ctx = layer.canvas.getContext('2d');
          ctx?.putImageData(savedLayer.imageData, 0, 0);
        }
        return layer;
      })
    );
    setHistoryIndex(prev => prev - 1);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    
    const nextState = history[historyIndex + 1];
    if (!nextState) return;

    setLayers(currentLayers => 
      currentLayers.map(layer => {
        const savedLayer = nextState.layers.find(l => l.id === layer.id);
        if (savedLayer && layer.canvas) {
          const ctx = layer.canvas.getContext('2d');
          ctx?.putImageData(savedLayer.imageData, 0, 0);
        }
        return layer;
      })
    );
    setHistoryIndex(prev => prev + 1);
  }, [history, historyIndex]);

  const addLayer = useCallback(() => {
    const id = crypto.randomUUID();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const newLayer: Layer = {
      id,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      opacity: 1,
      locked: false,
      canvas,
    };

    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(id);
    saveToHistory();
  }, [width, height, layers.length, saveToHistory]);

  const deleteLayer = useCallback((id: string) => {
    if (layers.length <= 1) return;
    
    setLayers(prev => {
      const newLayers = prev.filter(l => l.id !== id);
      if (activeLayerId === id && newLayers.length > 0) {
        setActiveLayerId(newLayers[newLayers.length - 1].id);
      }
      return newLayers;
    });
    saveToHistory();
  }, [layers.length, activeLayerId, saveToHistory]);

  const updateLayer = useCallback((id: string, updates: Partial<Layer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    setLayers(prev => {
      const newLayers = [...prev];
      const [removed] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, removed);
      return newLayers;
    });
  }, []);

  const drawStroke = useCallback((
    ctx: CanvasRenderingContext2D,
    points: Point[],
    brush: BrushSettings
  ) => {
    if (points.length < 2) return;

    ctx.save();
    ctx.globalAlpha = brush.opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (brush.type === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brush.color;
    }

    // Apply brush-specific settings
    switch (brush.type) {
      case 'pen':
        ctx.shadowBlur = 0;
        break;
      case 'pencil':
        ctx.shadowBlur = 1;
        ctx.shadowColor = brush.color;
        break;
      case 'airbrush':
        ctx.shadowBlur = brush.size * 0.5;
        ctx.shadowColor = brush.color;
        ctx.globalAlpha = brush.opacity * 0.3;
        break;
      case 'marker':
        ctx.globalAlpha = brush.opacity * 0.7;
        break;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      
      // Pressure-based line width
      const pressure = p1.pressure || 0.5;
      const baseSize = brush.type === 'eraser' ? brush.size * 2 : brush.size;
      ctx.lineWidth = baseSize * (0.5 + pressure * 0.5);

      // Smooth curve using quadratic bezier
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
    }

    const lastP = points[points.length - 1];
    ctx.lineTo(lastP.x, lastP.y);
    ctx.stroke();

    ctx.restore();
  }, []);

  const startStroke = useCallback((point: Point, brush: BrushSettings) => {
    const layer = getActiveLayer();
    if (!layer || layer.locked || !layer.canvas) return;

    setIsDrawing(true);
    currentStroke.current = [point];
    lastPoint.current = point;
    saveToHistory();
  }, [getActiveLayer, saveToHistory]);

  const continueStroke = useCallback((point: Point, brush: BrushSettings) => {
    if (!isDrawing) return;
    
    const layer = getActiveLayer();
    if (!layer || !layer.canvas) return;

    const ctx = layer.canvas.getContext('2d');
    if (!ctx) return;

    currentStroke.current.push(point);
    
    // Draw incremental segment
    if (lastPoint.current) {
      drawStroke(ctx, [lastPoint.current, point], brush);
    }
    lastPoint.current = point;
  }, [isDrawing, getActiveLayer, drawStroke]);

  const endStroke = useCallback(() => {
    setIsDrawing(false);
    currentStroke.current = [];
    lastPoint.current = null;
  }, []);

  const clearLayer = useCallback((id: string) => {
    const layer = layers.find(l => l.id === id);
    if (!layer?.canvas) return;

    const ctx = layer.canvas.getContext('2d');
    if (ctx) {
      saveToHistory();
      ctx.clearRect(0, 0, width, height);
    }
  }, [layers, width, height, saveToHistory]);

  const stampPreset = useCallback((type: 'male' | 'female') => {
    const layer = getActiveLayer();
    if (!layer || layer.locked || !layer.canvas) return;

    const ctx = layer.canvas.getContext('2d');
    if (!ctx) return;

    saveToHistory();

    // Center the mannequin on canvas
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) * 0.4;

    ctx.save();
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw mannequin based on type
    const drawMannequin = (isMale: boolean) => {
      const headRadius = scale * 0.07;
      const shoulderWidth = isMale ? scale * 0.3 : scale * 0.22;
      const hipWidth = isMale ? scale * 0.2 : scale * 0.25;
      const torsoLength = scale * 0.29;
      const armLength = scale * 0.25;
      const legLength = scale * 0.35;
      const lowerLegLength = scale * 0.2;

      // Head
      ctx.beginPath();
      ctx.arc(centerX, centerY - scale * 0.4, headRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Neck to torso
      const neckY = centerY - scale * 0.4 + headRadius;
      const shoulderY = neckY + scale * 0.065;
      const torsoEndY = shoulderY + torsoLength;

      // Spine
      ctx.beginPath();
      ctx.moveTo(centerX, neckY);
      ctx.lineTo(centerX, torsoEndY);
      ctx.stroke();

      // Shoulders
      ctx.beginPath();
      ctx.moveTo(centerX - shoulderWidth, shoulderY);
      ctx.lineTo(centerX + shoulderWidth, shoulderY);
      ctx.stroke();

      // Arms
      ctx.beginPath();
      ctx.moveTo(centerX - shoulderWidth, shoulderY);
      ctx.lineTo(centerX - shoulderWidth - armLength * 0.3, shoulderY + armLength);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + shoulderWidth, shoulderY);
      ctx.lineTo(centerX + shoulderWidth + armLength * 0.3, shoulderY + armLength);
      ctx.stroke();

      // Hips
      ctx.beginPath();
      ctx.moveTo(centerX - hipWidth, torsoEndY);
      ctx.lineTo(centerX + hipWidth, torsoEndY);
      ctx.stroke();

      // Hip curve for female
      if (!isMale) {
        ctx.beginPath();
        ctx.moveTo(centerX - hipWidth * 0.8, torsoEndY - scale * 0.05);
        ctx.quadraticCurveTo(centerX, torsoEndY + scale * 0.05, centerX + hipWidth * 0.8, torsoEndY - scale * 0.05);
        ctx.stroke();
      }

      // Legs
      const kneeY = torsoEndY + legLength;
      const footY = kneeY + lowerLegLength;

      // Left leg
      ctx.beginPath();
      ctx.moveTo(centerX - hipWidth, torsoEndY);
      ctx.lineTo(centerX - hipWidth * 0.8, kneeY);
      ctx.lineTo(centerX - hipWidth * 0.75, footY);
      ctx.stroke();

      // Right leg
      ctx.beginPath();
      ctx.moveTo(centerX + hipWidth, torsoEndY);
      ctx.lineTo(centerX + hipWidth * 0.8, kneeY);
      ctx.lineTo(centerX + hipWidth * 0.75, footY);
      ctx.stroke();
    };

    drawMannequin(type === 'male');
    ctx.restore();
  }, [getActiveLayer, width, height, saveToHistory]);

  const exportCanvas = useCallback((format: 'png' | 'jpeg' = 'png') => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width;
    exportCanvas.height = height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Composite all visible layers
    layers.forEach(layer => {
      if (layer.visible && layer.canvas) {
        ctx.globalAlpha = layer.opacity;
        ctx.drawImage(layer.canvas, 0, 0);
      }
    });

    const dataUrl = exportCanvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.95 : undefined);
    const link = document.createElement('a');
    link.download = `drawing.${format}`;
    link.href = dataUrl;
    link.click();
  }, [layers, width, height]);

  return {
    layers,
    activeLayerId,
    setActiveLayerId,
    isDrawing,
    historyIndex,
    historyLength: history.length,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    addLayer,
    deleteLayer,
    updateLayer,
    reorderLayers,
    startStroke,
    continueStroke,
    endStroke,
    clearLayer,
    exportCanvas,
    stampPreset,
    undo,
    redo,
  };
}
