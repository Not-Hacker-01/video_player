import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { VideoAdPlayerConfig, VideoAdPlayerInstance } from '../types';
import { resolveVideoUrl, getVideoType } from '../utils/videoResolver';
import { getSizeValues, getPositionStyles } from '../utils/positionCalculator';

const VideoAdPlayer = forwardRef<VideoAdPlayerInstance, VideoAdPlayerConfig>((props, ref) => {
  const {
    videoId,
    playbackId,
    videoUrl,
    position = 'bottom-right',
    size = 'medium',
    width,
    height,
    autoplay = true,
    muted = true,
    closeable = true,
    showControls = true,
    onClose,
    onComplete,
    onError,
    customStyles = {},
    zIndex = 9999,
  } = props;

  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [videoType, setVideoType] = useState<'youtube' | 'direct' | 'hls'>('direct');
  const [isHovered, setIsHovered] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const url = resolveVideoUrl({ videoId, playbackId, videoUrl });
      setVideoSrc(url);
      setVideoType(getVideoType(url));
    } catch (error) {
      console.error('Video resolution error:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  }, [videoId, playbackId, videoUrl, onError]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) {
        onComplete();
      }
    };

    const handleError = () => {
      const error = new Error('Video playback error');
      console.error(error);
      if (onError) {
        onError(error);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onComplete, onError]);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    },
    close: handleClose,
    setVolume: (volume: number) => {
      if (videoRef.current) {
        videoRef.current.volume = Math.max(0, Math.min(1, volume));
      }
    },
    seek: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    getElement: () => containerRef.current,
  }));

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  const sizeValues = getSizeValues(size, width, height);
  const positionStyles = getPositionStyles(position);

  const containerStyles: React.CSSProperties = {
    ...positionStyles,
    width: `${sizeValues.width}px`,
    height: `${sizeValues.height}px`,
    zIndex,
    ...customStyles,
  };

  if (videoType === 'youtube') {
    return (
      <div
        ref={containerRef}
        style={containerStyles}
        className={`rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="relative w-full h-full bg-black">
          {closeable && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-50 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 transition-all duration-200 hover:scale-110"
              aria-label="Close video"
            >
              <X size={18} />
            </button>
          )}
          <iframe
            src={videoSrc}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video Ad"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={containerStyles}
      className={`rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
        isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full bg-black group">
        {closeable && (
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 z-30 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 transition-all duration-200 hover:scale-110"
            aria-label="Close video"
          >
            <X size={18} />
          </button>
        )}

        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay={autoplay}
          muted={muted}
          loop={false}
          playsInline
          className="w-full h-full object-cover"
          onClick={togglePlay}
        />

        {showControls && (
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              ref={progressRef}
              className="w-full h-1 bg-white/30 cursor-pointer hover:h-1.5 transition-all"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-blue-400 transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <button
                  onClick={toggleMute}
                  className="text-white hover:text-blue-400 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <span className="text-white text-xs font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <button
                onClick={handleFullscreen}
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="Fullscreen"
              >
                <Maximize2 size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

VideoAdPlayer.displayName = 'VideoAdPlayer';

export default VideoAdPlayer;
