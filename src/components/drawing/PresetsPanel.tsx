import { User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PresetsPanelProps {
  onApplyPreset: (type: 'male' | 'female') => void;
}

export function PresetsPanel({ onApplyPreset }: PresetsPanelProps) {
  return (
    <div className="panel p-3 fade-in">
      <h3 className="text-sm font-medium text-panel-text mb-3">Body Presets</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="flex flex-col gap-2 h-auto py-4 border-panel-border bg-panel-bg hover:bg-panel-hover"
          onClick={() => onApplyPreset('male')}
        >
          <svg
            viewBox="0 0 100 200"
            className="w-8 h-16 stroke-panel-text"
            fill="none"
            strokeWidth="2"
          >
            {/* Male mannequin - broader shoulders */}
            <circle cx="50" cy="18" r="14" />
            <line x1="50" y1="32" x2="50" y2="90" />
            <line x1="50" y1="45" x2="20" y2="75" />
            <line x1="50" y1="45" x2="80" y2="75" />
            <line x1="50" y1="90" x2="30" y2="150" />
            <line x1="50" y1="90" x2="70" y2="150" />
            <line x1="30" y1="150" x2="25" y2="190" />
            <line x1="70" y1="150" x2="75" y2="190" />
          </svg>
          <span className="text-xs">Male</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col gap-2 h-auto py-4 border-panel-border bg-panel-bg hover:bg-panel-hover"
          onClick={() => onApplyPreset('female')}
        >
          <svg
            viewBox="0 0 100 200"
            className="w-8 h-16 stroke-panel-text"
            fill="none"
            strokeWidth="2"
          >
            {/* Female mannequin - narrower shoulders, wider hips */}
            <circle cx="50" cy="18" r="14" />
            <line x1="50" y1="32" x2="50" y2="90" />
            <line x1="50" y1="42" x2="28" y2="68" />
            <line x1="50" y1="42" x2="72" y2="68" />
            <line x1="50" y1="90" x2="25" y2="150" />
            <line x1="50" y1="90" x2="75" y2="150" />
            <line x1="25" y1="150" x2="22" y2="190" />
            <line x1="75" y1="150" x2="78" y2="190" />
            {/* Hip curve */}
            <path d="M 40 75 Q 50 95 60 75" />
          </svg>
          <span className="text-xs">Female</span>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Click to stamp onto current layer
      </p>
    </div>
  );
}
