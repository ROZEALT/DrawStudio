export type BrushType = 'pen' | 'pencil' | 'airbrush' | 'marker' | 'eraser';

export interface BrushSettings {
  type: BrushType;
  size: number;
  opacity: number;
  color: string;
  smoothing: number;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  locked: boolean;
  canvas: HTMLCanvasElement | null;
}

export interface Point {
  x: number;
  y: number;
  pressure: number;
  tiltX?: number;
  tiltY?: number;
}

export interface Stroke {
  points: Point[];
  brush: BrushSettings;
  layerId: string;
}

export interface HistoryState {
  layers: { id: string; imageData: ImageData }[];
  activeLayerId: string;
}

export interface CanvasState {
  width: number;
  height: number;
  layers: Layer[];
  activeLayerId: string;
  brush: BrushSettings;
  history: HistoryState[];
  historyIndex: number;
  zoom: number;
  panX: number;
  panY: number;
}
