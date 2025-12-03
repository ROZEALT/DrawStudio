import { Eye, EyeOff, Lock, Unlock, Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { Layer } from '@/types/drawing';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface LayersPanelProps {
  layers: Layer[];
  activeLayerId: string;
  onSelectLayer: (id: string) => void;
  onAddLayer: () => void;
  onDeleteLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<Layer>) => void;
  onReorderLayers: (fromIndex: number, toIndex: number) => void;
}

export function LayersPanel({
  layers,
  activeLayerId,
  onSelectLayer,
  onAddLayer,
  onDeleteLayer,
  onUpdateLayer,
  onReorderLayers,
}: LayersPanelProps) {
  const reversedLayers = [...layers].reverse();

  const moveLayer = (index: number, direction: 'up' | 'down') => {
    const actualIndex = layers.length - 1 - index;
    const newIndex = direction === 'up' ? actualIndex + 1 : actualIndex - 1;
    if (newIndex >= 0 && newIndex < layers.length) {
      onReorderLayers(actualIndex, newIndex);
    }
  };

  return (
    <div className="panel p-3 w-64 fade-in">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium">Layers</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onAddLayer}
              className="tool-button p-1.5"
            >
              <Plus className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Add Layer</TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-1 max-h-80 overflow-y-auto">
        {reversedLayers.map((layer, displayIndex) => {
          const isActive = layer.id === activeLayerId;
          const actualIndex = layers.length - 1 - displayIndex;

          return (
            <div
              key={layer.id}
              className={cn(
                'group p-2 rounded-lg cursor-pointer transition-all',
                isActive ? 'bg-tool-active/20 border border-tool-active/30' : 'hover:bg-muted',
              )}
              onClick={() => onSelectLayer(layer.id)}
            >
              <div className="flex items-center gap-2">
                {/* Layer thumbnail */}
                <div className="w-10 h-10 rounded bg-muted border border-panel-border overflow-hidden flex-shrink-0">
                  {layer.canvas && (
                    <canvas
                      ref={(el) => {
                        if (el && layer.canvas) {
                          const ctx = el.getContext('2d');
                          if (ctx) {
                            el.width = 40;
                            el.height = 40;
                            ctx.drawImage(layer.canvas, 0, 0, 40, 40);
                          }
                        }
                      }}
                      className="w-full h-full"
                    />
                  )}
                </div>

                {/* Layer name */}
                <input
                  type="text"
                  value={layer.name}
                  onChange={(e) => onUpdateLayer(layer.id, { name: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-transparent text-sm focus:outline-none focus:bg-muted px-1 rounded min-w-0"
                />

                {/* Quick actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayer(displayIndex, 'up');
                    }}
                    disabled={displayIndex === 0}
                    className="p-1 hover:bg-muted rounded disabled:opacity-30"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayer(displayIndex, 'down');
                    }}
                    disabled={displayIndex === reversedLayers.length - 1}
                    className="p-1 hover:bg-muted rounded disabled:opacity-30"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Layer controls */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLayer(layer.id, { visible: !layer.visible });
                  }}
                  className="p-1 hover:bg-muted rounded"
                >
                  {layer.visible ? (
                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-muted-foreground/50" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLayer(layer.id, { locked: !layer.locked });
                  }}
                  className="p-1 hover:bg-muted rounded"
                >
                  {layer.locked ? (
                    <Lock className="w-3.5 h-3.5 text-destructive/70" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>

                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">α</span>
                  <Slider
                    value={[layer.opacity * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([opacity]) => {
                      onUpdateLayer(layer.id, { opacity: opacity / 100 });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1"
                  />
                </div>

                {layers.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLayer(layer.id);
                    }}
                    className="p-1 hover:bg-destructive/20 rounded text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
