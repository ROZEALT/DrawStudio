import { Slider } from '@/components/ui/slider';
import { BrushSettings as BrushSettingsType } from '@/types/drawing';

interface BrushSettingsProps {
  settings: BrushSettingsType;
  onChange: (settings: Partial<BrushSettingsType>) => void;
}

export function BrushSettings({ settings, onChange }: BrushSettingsProps) {
  return (
    <div className="panel p-4 w-56 fade-in">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">Size</span>
          <span className="mono text-xs">{settings.size}px</span>
        </div>
        <Slider
          value={[settings.size]}
          min={1}
          max={100}
          step={1}
          onValueChange={([size]) => onChange({ size })}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">Opacity</span>
          <span className="mono text-xs">{Math.round(settings.opacity * 100)}%</span>
        </div>
        <Slider
          value={[settings.opacity * 100]}
          min={1}
          max={100}
          step={1}
          onValueChange={([opacity]) => onChange({ opacity: opacity / 100 })}
          className="w-full"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">Smoothing</span>
          <span className="mono text-xs">{settings.smoothing}%</span>
        </div>
        <Slider
          value={[settings.smoothing]}
          min={0}
          max={100}
          step={5}
          onValueChange={([smoothing]) => onChange({ smoothing })}
          className="w-full"
        />
      </div>

      {/* Brush preview */}
      <div className="mt-4 pt-4 border-t border-panel-border">
        <div className="text-xs text-muted-foreground mb-2">Preview</div>
        <div className="h-12 bg-muted rounded flex items-center justify-center">
          <div
            className="rounded-full transition-all"
            style={{
              width: Math.min(settings.size, 40),
              height: Math.min(settings.size, 40),
              backgroundColor: settings.type === 'eraser' ? '#ffffff' : settings.color,
              opacity: settings.opacity,
              boxShadow: settings.type === 'airbrush' 
                ? `0 0 ${settings.size * 0.3}px ${settings.color}` 
                : 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
