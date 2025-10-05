/**
 * Video Ad Player SDK - Vanilla JavaScript Version
 * For use in plain HTML without React
 */

class VideoAdPlayerVanilla {
  constructor(config) {
    this.config = {
      videoId: config.videoId,
      playbackId: config.playbackId,
      videoUrl: config.videoUrl,
      position: config.position || 'bottom-right',
      size: config.size || 'medium',
      width: config.width,
      height: config.height,
      muted: config.muted !== false,
      closeable: config.closeable !== false,
      onClose: config.onClose,
      onError: config.onError,
      customStyles: config.customStyles || {},
      zIndex: config.zIndex || 9999,
    };

    this.container = null;
    this.video = null;
    this.isVisible = true;
    this.isClosing = false;
    this.videoSrc = '';
    this.videoType = 'direct';

    this.init();
  }

  init() {
    this.resolveVideoUrl();
    this.createContainer();
    this.setupEventListeners();
  }

  resolveVideoUrl() {
    if (this.config.videoUrl) {
      this.videoSrc = this.config.videoUrl;
      this.videoType = 'direct';
    } else if (this.config.playbackId) {
      this.videoSrc = `https://stream.mux.com/${this.config.playbackId}.m3u8`;
      this.videoType = 'hls';
    } else if (this.config.videoId) {
      this.videoSrc = `https://www.youtube.com/embed/${this.config.videoId}?autoplay=1&mute=1&loop=1&playlist=${this.config.videoId}`;
      this.videoType = 'youtube';
    } else {
      throw new Error('No video source provided. Please provide videoId, playbackId, or videoUrl');
    }
  }

  getSizeValues() {
    if (this.config.size === 'custom' && this.config.width && this.config.height) {
      return { width: this.config.width, height: this.config.height };
    }

    const sizes = {
      small: { width: 200, height: 360 },
      medium: { width: 280, height: 500 },
      large: { width: 360, height: 640 },
    };

    return sizes[this.config.size] || sizes.medium;
  }

  getPositionStyles() {
    const baseStyles = {
      position: 'fixed',
      zIndex: this.config.zIndex,
    };

    const positions = {
      'bottom-right': { ...baseStyles, bottom: '20px', right: '20px' },
      'bottom-left': { ...baseStyles, bottom: '20px', left: '20px' },
      'top-right': { ...baseStyles, top: '20px', right: '20px' },
      'top-left': { ...baseStyles, top: '20px', left: '20px' },
      'center': { ...baseStyles, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      'custom': baseStyles,
    };

    return positions[this.config.position] || positions['bottom-right'];
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'video-ad-player-container';
    
    const sizeValues = this.getSizeValues();
    const positionStyles = this.getPositionStyles();
    
    // Apply styles
    Object.assign(this.container.style, {
      ...positionStyles,
      width: `${sizeValues.width}px`,
      height: `${sizeValues.height}px`,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transition: 'all 0.3s ease',
      ...this.config.customStyles,
    });

    this.container.innerHTML = this.getPlayerHTML();
    document.body.appendChild(this.container);

    this.video = this.container.querySelector('video');
    this.setupVideoEvents();
  }

  getPlayerHTML() {
    if (this.videoType === 'youtube') {
      return `
        <div style="position: relative; width: 100%; height: 100%; background: black;">
          ${this.config.closeable ? this.getCloseButtonHTML() : ''}
          <iframe
            src="${this.videoSrc}"
            style="width: 100%; height: 100%; border: none;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            title="Video Ad"
          ></iframe>
        </div>
      `;
    }

    return `
      <div style="position: relative; width: 100%; height: 100%; background: black;">
        ${this.config.closeable ? this.getCloseButtonHTML() : ''}
        <video
          src="${this.videoSrc}"
          autoplay
          ${this.config.muted ? 'muted' : ''}
          loop
          playsinline
          style="width: 100%; height: 100%; object-fit: cover;"
        ></video>
      </div>
    `;
  }

  getCloseButtonHTML() {
    return `
      <button
        id="close-btn"
        style="
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 30;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        "
        onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'"
        onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'"
        onclick="this.closest('#video-ad-player-container').remove()"
        aria-label="Close video"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;
  }

  setupVideoEvents() {
    if (!this.video) return;

    this.video.addEventListener('loadeddata', () => {
      this.video.play().catch(console.error);
    });

    this.video.addEventListener('ended', () => {
      this.video.currentTime = 0;
      this.video.play().catch(console.error);
    });

    this.video.addEventListener('error', () => {
      const error = new Error('Video playback error');
      console.error(error);
      if (this.config.onError) {
        this.config.onError(error);
      }
    });
  }

  setupEventListeners() {
    if (this.config.closeable) {
      const closeBtn = this.container.querySelector('#close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.close();
        });
      }
    }
  }

  // Public API methods
  play() {
    if (this.video) {
      this.video.play();
    }
  }

  pause() {
    if (this.video) {
      this.video.pause();
    }
  }

  close() {
    this.isClosing = true;
    this.container.style.opacity = '0';
    this.container.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
      if (this.config.onClose) {
        this.config.onClose();
      }
    }, 300);
  }

  setVolume(volume) {
    if (this.video) {
      this.video.volume = Math.max(0, Math.min(1, volume));
    }
  }

  seek(time) {
    if (this.video) {
      this.video.currentTime = time;
    }
  }

  getElement() {
    return this.container;
  }
}

// Global function for easy HTML usage
window.createVideoAdPlayer = function(config) {
  return new VideoAdPlayerVanilla(config);
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VideoAdPlayerVanilla;
}

if (typeof exports !== 'undefined') {
  exports.VideoAdPlayerVanilla = VideoAdPlayerVanilla;
  exports.createVideoAdPlayer = window.createVideoAdPlayer;
}
