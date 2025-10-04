import { createRoot, Root } from 'react-dom/client';
import React from 'react';
import VideoAdPlayer from '../components/VideoAdPlayer';
import { VideoAdPlayerConfig, VideoAdPlayerInstance } from '../types';

class VideoAdSDK {
  private container: HTMLDivElement | null = null;
  private root: Root | null = null;
  private playerRef: React.RefObject<VideoAdPlayerInstance>;

  constructor() {
    this.playerRef = React.createRef<VideoAdPlayerInstance>();
  }

  init(config: VideoAdPlayerConfig): VideoAdPlayerInstance {
    if (this.container) {
      console.warn('VideoAdSDK: Player already initialized. Call destroy() first.');
      return this.getPlayerInstance();
    }

    this.container = document.createElement('div');
    this.container.id = 'video-ad-player-container';
    document.body.appendChild(this.container);

    const handleClose = () => {
      if (config.onClose) {
        config.onClose();
      }
      this.destroy();
    };

    this.root = createRoot(this.container);
    this.root.render(
      React.createElement(VideoAdPlayer, {
        ...config,
        ref: this.playerRef,
        onClose: handleClose,
      })
    );

    return this.getPlayerInstance();
  }

  private getPlayerInstance(): VideoAdPlayerInstance {
    return {
      play: () => {
        this.playerRef.current?.play();
      },
      pause: () => {
        this.playerRef.current?.pause();
      },
      close: () => {
        this.playerRef.current?.close();
      },
      setVolume: (volume: number) => {
        this.playerRef.current?.setVolume(volume);
      },
      seek: (time: number) => {
        this.playerRef.current?.seek(time);
      },
      getElement: () => {
        return this.playerRef.current?.getElement() || null;
      },
    };
  }

  destroy(): void {
    if (this.root) {
      setTimeout(() => {
        if (this.root) {
          this.root.unmount();
          this.root = null;
        }
        if (this.container && this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
          this.container = null;
        }
      }, 350);
    }
  }

  isActive(): boolean {
    return this.container !== null && this.container.parentNode !== null;
  }
}

export const createVideoAdPlayer = (config: VideoAdPlayerConfig): VideoAdPlayerInstance => {
  const sdk = new VideoAdSDK();
  return sdk.init(config);
};

export { VideoAdSDK, VideoAdPlayer };
export * from '../types';
export default VideoAdSDK;
