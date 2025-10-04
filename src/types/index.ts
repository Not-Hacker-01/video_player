export type VideoSource = {
  url: string;
  type?: string;
};

export type PlayerPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'center'
  | 'custom';

export type PlayerSize = 'small' | 'medium' | 'large' | 'custom';

export interface VideoAdPlayerConfig {
  videoId?: string;
  playbackId?: string;
  videoUrl?: string;
  position?: PlayerPosition;
  size?: PlayerSize;
  width?: number;
  height?: number;
  autoplay?: boolean;
  muted?: boolean;
  closeable?: boolean;
  showControls?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  customStyles?: React.CSSProperties;
  zIndex?: number;
}

export interface VideoAdPlayerInstance {
  play: () => void;
  pause: () => void;
  close: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  getElement: () => HTMLDivElement | null;
}
