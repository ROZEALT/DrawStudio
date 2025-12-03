import { useRef, useEffect, useCallback } from 'react';
import { Layer, BrushSettings, Point } from '@/types/drawing';

interface CanvasProps {
  width: number;
  height: number;
  layers: Layer[];
  activeLayerId: string;
  brush: BrushSettings;
  zoom: number;
  onStartStroke: (point: Point, brush: BrushSettings) => void;
  onContinueStroke: (point: Point, brush: BrushSettings) => void;
  onEndStroke: () => void;
}

export function Canvas({
  width,
  height,
  layers,
  activeLayerId,
  brush,
  zoom,
  onStartStroke,
  onContinueStroke,
  onEndStroke,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // Composite all layers to display canvas
  const compositeCanvas = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    if (!displayCanvas) return;

    const ctx = displayCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    layers.forEach(layer => {
      if (layer.visible && layer.canvas) {
        ctx.globalAlpha = layer.opacity;
        ctx.drawImage(layer.canvas, 0, 0);
      }
    });

    ctx.globalAlpha = 1;
  }, [layers, width, height]);

  // Continuous compositing for smooth updates
  useEffect(() => {
    const animate = () => {
      compositeCanvas();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [compositeCanvas]);

  const getPointerPosition = useCallback((e: React.PointerEvent): Point => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 0.5 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      pressure: e.pressure || 0.5,
      tiltX: e.tiltX,
      tiltY: e.tiltY,
    };
  }, [width, height]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const canvas = displayCanvasRef.current;
    if (canvas) {
      canvas.setPointerCapture(e.pointerId);
    }
    const point = getPointerPosition(e);
    onStartStroke(point, brush);
  }, [getPointerPosition, brush, onStartStroke]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons === 0) return;
    e.preventDefault();
    const point = getPointerPosition(e);
    onContinueStroke(point, brush);
  }, [getPointerPosition, brush, onContinueStroke]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const canvas = displayCanvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }
    onEndStroke();
  }, [onEndStroke]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg shadow-2xl"
      style={{
        width: width * zoom,
        height: height * zoom,
      }}
    >
      {/* Checkerboard background */}
      <div 
        className="absolute inset-0 canvas-checkerboard"
        style={{
          width: width * zoom,
          height: height * zoom,
        }}
      />

      {/* Display canvas */}
      <canvas
        ref={displayCanvasRef}
        width={width}
        height={height}
        className="absolute inset-0 cursor-crosshair no-select"
        style={{
          width: width * zoom,
          height: height * zoom,
          touchAction: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
