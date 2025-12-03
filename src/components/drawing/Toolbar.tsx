import { 
  Pen, 
  Pencil, 
  Airplay, 
  Highlighter,
  Eraser,
  Undo2,
  Redo2,
  Download,
  Trash2
} from 'lucide-react';
import { ToolButton } from './ToolButton';
import { BrushType } from '@/types/drawing';
import { Separator } from '@/components/ui/separator';

interface ToolbarProps {
  activeBrush: BrushType;
  onBrushChange: (brush: BrushType) => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function Toolbar({
  activeBrush,
  onBrushChange,
  onUndo,
  onRedo,
  onExport,
  onClear,
  canUndo,
  canRedo,
}: ToolbarProps) {
  const brushes: { type: BrushType; icon: React.ReactNode; label: string; shortcut: string }[] = [
    { type: 'pen', icon: <Pen className="w-5 h-5" />, label: 'Pen', shortcut: 'P' },
    { type: 'pencil', icon: <Pencil className="w-5 h-5" />, label: 'Pencil', shortcut: 'B' },
    { type: 'airbrush', icon: <Airplay className="w-5 h-5" />, label: 'Airbrush', shortcut: 'A' },
    { type: 'marker', icon: <Highlighter className="w-5 h-5" />, label: 'Marker', shortcut: 'M' },
    { type: 'eraser', icon: <Eraser className="w-5 h-5" />, label: 'Eraser', shortcut: 'E' },
  ];

  return (
    <div className="panel p-2 flex flex-col gap-1 fade-in">
      {brushes.map(brush => (
        <ToolButton
          key={brush.type}
          icon={brush.icon}
          label={brush.label}
          shortcut={brush.shortcut}
          active={activeBrush === brush.type}
          onClick={() => onBrushChange(brush.type)}
        />
      ))}

      <Separator className="my-2 bg-panel-border" />

      <ToolButton
        icon={<Undo2 className="w-5 h-5" />}
        label="Undo"
        shortcut="⌘Z"
        disabled={!canUndo}
        onClick={onUndo}
      />
      <ToolButton
        icon={<Redo2 className="w-5 h-5" />}
        label="Redo"
        shortcut="⌘⇧Z"
        disabled={!canRedo}
        onClick={onRedo}
      />

      <Separator className="my-2 bg-panel-border" />

      <ToolButton
        icon={<Download className="w-5 h-5" />}
        label="Export PNG"
        shortcut="⌘E"
        onClick={onExport}
      />
      <ToolButton
        icon={<Trash2 className="w-5 h-5" />}
        label="Clear Layer"
        onClick={onClear}
      />
    </div>
  );
}
