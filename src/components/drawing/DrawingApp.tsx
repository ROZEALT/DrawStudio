import { useState, useCallback, useEffect } from 'react';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { ColorPicker } from './ColorPicker';
import { BrushSettings } from './BrushSettings';
import { LayersPanel } from './LayersPanel';
import { ZoomControl } from './ZoomControl';
import { PresetsPanel } from './PresetsPanel';
import { useDrawingCanvas } from '@/hooks/useDrawingCanvas';
import { BrushType, BrushSettings as BrushSettingsType } from '@/types/drawing';
import { toast } from 'sonner';

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

export function DrawingApp() {
  const [zoom, setZoom] = useState(0.6);
  const [brush, setBrush] = useState<BrushSettingsType>({
    type: 'pen',
    size: 8,
    opacity: 1,
    color: '#000000',
    smoothing: 50,
  });

  const {
    layers,
    activeLayerId,
    setActiveLayerId,
    canUndo,
    canRedo,
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
  } = useDrawingCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  const handleApplyPreset = useCallback((type: 'male' | 'female') => {
    stampPreset(type);
    toast.success(`${type === 'male' ? 'Male' : 'Female'} mannequin added to layer`);
  }, [stampPreset]);

  const handleBrushChange = useCallback((type: BrushType) => {
    setBrush(prev => ({ ...prev, type }));
  }, []);

  const handleBrushSettingsChange = useCallback((updates: Partial<BrushSettingsType>) => {
    setBrush(prev => ({ ...prev, ...updates }));
  }, []);

  const handleExport = useCallback(() => {
    exportCanvas('png');
    toast.success('Image exported successfully!');
  }, [exportCanvas]);

  const handleClear = useCallback(() => {
    clearLayer(activeLayerId);
    toast.info('Layer cleared');
  }, [clearLayer, activeLayerId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      const key = e.key.toLowerCase();
      const cmd = e.metaKey || e.ctrlKey;

      if (cmd && key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (cmd && key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (cmd && key === 'e') {
        e.preventDefault();
        handleExport();
      } else if (key === 'p') {
        handleBrushChange('pen');
      } else if (key === 'b') {
        handleBrushChange('pencil');
      } else if (key === 'a') {
        handleBrushChange('airbrush');
      } else if (key === 'm') {
        handleBrushChange('marker');
      } else if (key === 'e' && !cmd) {
        handleBrushChange('eraser');
      } else if (key === '[') {
        setBrush(prev => ({ ...prev, size: Math.max(1, prev.size - 5) }));
      } else if (key === ']') {
        setBrush(prev => ({ ...prev, size: Math.min(100, prev.size + 5) }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, handleExport, handleBrushChange]);

  return (
    <div className="h-screen w-screen bg-background flex overflow-hidden no-select">
      {/* Left toolbar */}
      <div className="flex flex-col gap-3 p-3">
        <Toolbar
          activeBrush={brush.type}
          onBrushChange={handleBrushChange}
          onUndo={undo}
          onRedo={redo}
          onExport={handleExport}
          onClear={handleClear}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>

      {/* Main canvas area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-panel-border">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold tracking-tight">
              <span className="text-primary">Draw</span>
              <span className="text-muted-foreground">Studio</span>
            </h1>
            <span className="text-xs text-muted-foreground mono">
              {CANVAS_WIDTH} × {CANVAS_HEIGHT}
            </span>
          </div>
          <ZoomControl zoom={zoom} onZoomChange={setZoom} />
        </div>

        {/* Canvas container */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-background/50">
          <Canvas
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            layers={layers}
            activeLayerId={activeLayerId}
            brush={brush}
            zoom={zoom}
            onStartStroke={startStroke}
            onContinueStroke={continueStroke}
            onEndStroke={endStroke}
          />
        </div>

        {/* Bottom status bar */}
        <div className="h-8 flex items-center justify-between px-4 border-t border-panel-border text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="capitalize">{brush.type}</span>
            <span>{brush.size}px</span>
            <span>{Math.round(brush.opacity * 100)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border border-panel-border"
              style={{ backgroundColor: brush.color }}
            />
            <span className="mono">{brush.color.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Right panels */}
      <div className="flex flex-col gap-3 p-3 w-72">
        <ColorPicker
          color={brush.color}
          onChange={(color) => setBrush(prev => ({ ...prev, color }))}
        />
        <BrushSettings
          settings={brush}
          onChange={handleBrushSettingsChange}
        />
        <PresetsPanel onApplyPreset={handleApplyPreset} />
        <LayersPanel
          layers={layers}
          activeLayerId={activeLayerId}
          onSelectLayer={setActiveLayerId}
          onAddLayer={addLayer}
          onDeleteLayer={deleteLayer}
          onUpdateLayer={updateLayer}
          onReorderLayers={reorderLayers}
        />
      </div>
    </div>
  );
}
