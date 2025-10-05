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
      this.videoSrc = `https://www.youtube.com/embed/${this.config.videoId}?autoplay=1&mute=1&loop=1&playlist=${this.config.videoId}&enablejsapi=1&controls=1&rel=0&modestbranding=1&fs=1&cc_load_policy=0&iv_load_policy=3`;
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
      this.video.play().catch((err) => {
        console.warn('Video autoplay failed:', err);
      });
    });

    this.video.addEventListener('ended', () => {
      this.video.currentTime = 0;
      this.video.play().catch((err) => {
        console.warn('Video replay failed:', err);
      });
    });

    this.video.addEventListener('error', (event) => {
      const error = new Error('Video playback error');
      console.error('Video error:', error, event);
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

// Web Component for HTML tag usage
class VideoAdPlayerSDK extends HTMLElement {
  constructor() {
    super();
    this.player = null;
    this.observer = null;
  }

  static get observedAttributes() {
    return [
      'videoid', 'playbackid', 'videourl', 'position', 'size', 
      'width', 'height', 'muted', 'closeable', 'zindex'
    ];
  }

  connectedCallback() {
    this.initPlayer();
    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    if (this.player) {
      this.player.close();
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.player) {
      // Reinitialize player if key attributes change
      this.player.close();
      this.initPlayer();
    }
  }

  getConfig() {
    const config = {};
    
    // Parse videoId (YouTube)
    if (this.getAttribute('videoid')) {
      config.videoId = this.getAttribute('videoid');
    }
    
    // Parse playbackId (Mux/HLS)
    if (this.getAttribute('playbackid')) {
      config.playbackId = this.getAttribute('playbackid');
    }
    
    // Parse videoUrl (Direct URL)
    if (this.getAttribute('videourl')) {
      config.videoUrl = this.getAttribute('videourl');
    }
    
    // Parse position
    if (this.getAttribute('position')) {
      config.position = this.parsePosition(this.getAttribute('position'));
    }
    
    // Parse size
    if (this.getAttribute('size')) {
      config.size = this.getAttribute('size');
    }
    
    // Parse dimensions
    if (this.getAttribute('width')) {
      config.width = parseInt(this.getAttribute('width'));
    }
    
    if (this.getAttribute('height')) {
      config.height = parseInt(this.getAttribute('height'));
    }
    
    // Parse boolean attributes
    if (this.hasAttribute('muted')) {
      config.muted = this.getAttribute('muted') !== 'false';
    }
    
    if (this.hasAttribute('closeable')) {
      config.closeable = this.getAttribute('closeable') !== 'false';
    }
    
    // Parse zIndex
    if (this.getAttribute('zindex')) {
      config.zIndex = parseInt(this.getAttribute('zindex'));
    }

    // Add event handlers
    config.onClose = () => {
      this.dispatchEvent(new CustomEvent('close'));
    };
    
    config.onError = (error) => {
      this.dispatchEvent(new CustomEvent('error', { detail: error }));
    };

    return config;
  }

  parsePosition(position) {
    // Convert user-friendly position to internal format
    const positionMap = {
      'top left': 'top-left',
      'top right': 'top-right', 
      'bottom left': 'bottom-left',
      'bottom right': 'bottom-right',
      'right bottom': 'bottom-right',
      'left bottom': 'bottom-left',
      'right top': 'top-right',
      'left top': 'top-left',
      'center': 'center'
    };
    
    return positionMap[position.toLowerCase()] || position;
  }

  initPlayer() {
    const config = this.getConfig();
    
    // Validate that at least one video source is provided
    if (!config.videoId && !config.playbackId && !config.videoUrl) {
      console.error('VideoAdPlayerSDK: No video source provided. Please add videoid, playbackid, or videourl attribute.');
      return;
    }

    try {
      this.player = new VideoAdPlayerVanilla(config);
      
      // Dispatch ready event
      this.dispatchEvent(new CustomEvent('ready', { 
        detail: { player: this.player } 
      }));
      
    } catch (error) {
      console.error('VideoAdPlayerSDK initialization error:', error);
      this.dispatchEvent(new CustomEvent('error', { detail: error }));
    }
  }

  setupIntersectionObserver() {
    // Optional: Only show player when element is in viewport
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && this.player) {
            this.player.play();
          } else if (this.player) {
            this.player.pause();
          }
        });
      }, { threshold: 0.1 });
      
      this.observer.observe(this);
    }
  }

  // Public API methods
  play() {
    if (this.player) {
      this.player.play();
    }
  }

  pause() {
    if (this.player) {
      this.player.pause();
    }
  }

  close() {
    if (this.player) {
      this.player.close();
    }
  }

  setVolume(volume) {
    if (this.player) {
      this.player.setVolume(volume);
    }
  }

  seek(time) {
    if (this.player) {
      this.player.seek(time);
    }
  }

  getPlayer() {
    return this.player;
  }
}

// Register the custom element
if (!customElements.get('video-ad-player-sdk')) {
  customElements.define('video-ad-player-sdk', VideoAdPlayerSDK);
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
  exports.VideoAdPlayerSDK = VideoAdPlayerSDK;
}
