import { Minus, Plus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ZoomControlProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];

export function ZoomControl({ zoom, onZoomChange }: ZoomControlProps) {
  const zoomIn = () => {
    const nextZoom = ZOOM_LEVELS.find(z => z > zoom) || zoom;
    onZoomChange(nextZoom);
  };

  const zoomOut = () => {
    const nextZoom = [...ZOOM_LEVELS].reverse().find(z => z < zoom) || zoom;
    onZoomChange(nextZoom);
  };

  const resetZoom = () => onZoomChange(1);

  return (
    <div className="panel px-2 py-1.5 flex items-center gap-1 slide-up">
      <button
        onClick={zoomOut}
        disabled={zoom <= ZOOM_LEVELS[0]}
        className={cn(
          'p-1.5 rounded hover:bg-muted transition-colors',
          zoom <= ZOOM_LEVELS[0] && 'opacity-40 cursor-not-allowed'
        )}
      >
        <Minus className="w-4 h-4" />
      </button>

      <button
        onClick={resetZoom}
        className="px-2 py-1 text-xs mono hover:bg-muted rounded transition-colors min-w-[60px]"
      >
        {Math.round(zoom * 100)}%
      </button>

      <button
        onClick={zoomIn}
        disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
        className={cn(
          'p-1.5 rounded hover:bg-muted transition-colors',
          zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1] && 'opacity-40 cursor-not-allowed'
        )}
      >
        <Plus className="w-4 h-4" />
      </button>

      <button
        onClick={resetZoom}
        className="p-1.5 rounded hover:bg-muted transition-colors ml-1"
        title="Fit to screen"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  );
}
