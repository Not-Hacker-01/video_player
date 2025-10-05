export const resolveVideoUrl = (config: {
  videoId?: string;
  playbackId?: string;
  videoUrl?: string;
}): string => {
  if (config.videoUrl) {
    return config.videoUrl;
  }

  if (config.playbackId) {
    return `https://stream.mux.com/${config.playbackId}.m3u8`;
  }

  if (config.videoId) {
    return `https://www.youtube.com/embed/${config.videoId}?autoplay=1&mute=1&loop=1&playlist=${config.videoId}&enablejsapi=1&controls=1&rel=0&modestbranding=1&fs=1&cc_load_policy=0&iv_load_policy=3`;
  }

  throw new Error('No video source provided. Please provide videoId, playbackId, or videoUrl');
};

export const getVideoType = (url: string): 'youtube' | 'direct' | 'hls' => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('.m3u8')) {
    return 'hls';
  }
  return 'direct';
};
