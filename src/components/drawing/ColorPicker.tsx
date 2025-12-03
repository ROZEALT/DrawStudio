import { useState, useCallback } from 'react';
import { Pipette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ff0000', '#ff6b00', '#ffeb00',
  '#00ff00', '#00ffff', '#0066ff', '#9900ff', '#ff00ff',
  '#8b4513', '#808080', '#c0c0c0', '#ff69b4', '#ffd700',
];

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const handleColorSelect = useCallback((newColor: string) => {
    onChange(newColor);
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== newColor);
      return [newColor, ...filtered].slice(0, 8);
    });
  }, [onChange]);

  return (
    <div className="panel p-3 w-56 fade-in">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-lg border-2 border-panel-border shadow-inner cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: color }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <div className="flex-1">
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorSelect(e.target.value)}
            className="w-full h-8 cursor-pointer rounded bg-transparent"
          />
          <input
            type="text"
            value={color.toUpperCase()}
            onChange={(e) => {
              const val = e.target.value;
              if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                handleColorSelect(val);
              }
            }}
            className="w-full mt-1 px-2 py-1 text-xs mono bg-muted rounded border-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-muted-foreground mb-2">Presets</div>
        <div className="grid grid-cols-5 gap-1.5">
          {PRESET_COLORS.map(c => (
            <Tooltip key={c}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleColorSelect(c)}
                  className={cn(
                    'w-8 h-8 rounded-md transition-all hover:scale-110',
                    color === c && 'ring-2 ring-primary ring-offset-1 ring-offset-background'
                  )}
                  style={{ backgroundColor: c, border: c === '#ffffff' ? '1px solid hsl(var(--border))' : 'none' }}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {c.toUpperCase()}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {recentColors.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-2">Recent</div>
          <div className="flex gap-1.5 flex-wrap">
            {recentColors.map((c, i) => (
              <button
                key={`${c}-${i}`}
                onClick={() => handleColorSelect(c)}
                className={cn(
                  'w-6 h-6 rounded transition-all hover:scale-110',
                  color === c && 'ring-2 ring-primary'
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
