import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { X } from 'lucide-react';
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
    muted = true,
    closeable = true,
    onClose,
    onError,
    customStyles = {},
    zIndex = 9999,
  } = props;

  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [videoType, setVideoType] = useState<'youtube' | 'direct' | 'hls'>('direct');

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

    // Auto-play and loop for reels-like behavior
    const handleLoadedData = () => {
      video.play().catch(console.error);
    };

    const handleEnded = () => {
      // Loop the video for continuous playback like reels
      video.currentTime = 0;
      video.play().catch(console.error);
    };

    const handleError = () => {
      const error = new Error('Video playback error');
      console.error(error);
      if (onError) {
        onError(error);
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onError]);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
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
        className={`rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="relative w-full h-full bg-black">
          {closeable && (
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-50 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
              aria-label="Close video"
            >
              <X size={16} />
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
      className={`rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative w-full h-full bg-black">
        {closeable && (
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            aria-label="Close video"
          >
            <X size={16} />
          </button>
        )}

        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay={true}
          muted={muted}
          loop={true}
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
});

VideoAdPlayer.displayName = 'VideoAdPlayer';

export default VideoAdPlayer;
