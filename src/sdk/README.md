# Video Ad Player SDK

A lightweight, customizable video ad player SDK for React applications. Display video ads anywhere on your website with full control over positioning, styling, and behavior.

## Features

- Multiple video source support (YouTube, direct URLs, HLS streams)
- Flexible positioning (corners, center, custom)
- Customizable sizes and styles
- Built-in controls with play/pause, volume, progress bar
- Closeable with smooth animations
- TypeScript support
- Fully responsive
- Zero dependencies (except React)
- Production-ready

## Installation

```bash
npm install video-ad-player-sdk
```

## Quick Start

```typescript
import { createVideoAdPlayer } from 'video-ad-player-sdk';

// Initialize with YouTube video
const player = createVideoAdPlayer({
  videoId: 'dQw4w9WgXcQ',
  position: 'bottom-right',
  size: 'medium',
  closeable: true,
  autoplay: true,
  muted: true
});

// Control the player
player.play();
player.pause();
player.close();
```

## Configuration Options

### VideoAdPlayerConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `videoId` | `string` | - | YouTube video ID |
| `playbackId` | `string` | - | Mux playback ID for HLS streams |
| `videoUrl` | `string` | - | Direct video URL (MP4, WebM, etc.) |
| `position` | `PlayerPosition` | `'bottom-right'` | Player position on screen |
| `size` | `PlayerSize` | `'medium'` | Predefined size |
| `width` | `number` | - | Custom width (for size='custom') |
| `height` | `number` | - | Custom height (for size='custom') |
| `autoplay` | `boolean` | `true` | Auto-play video on load |
| `muted` | `boolean` | `true` | Start muted |
| `closeable` | `boolean` | `true` | Show close button |
| `showControls` | `boolean` | `true` | Show video controls |
| `onClose` | `() => void` | - | Callback when player closes |
| `onComplete` | `() => void` | - | Callback when video ends |
| `onError` | `(error: Error) => void` | - | Error callback |
| `customStyles` | `CSSProperties` | `{}` | Custom inline styles |
| `zIndex` | `number` | `9999` | Z-index of player |

### Position Options

- `'bottom-right'` - Bottom right corner
- `'bottom-left'` - Bottom left corner
- `'top-right'` - Top right corner
- `'top-left'` - Top left corner
- `'center'` - Center of screen
- `'custom'` - Use customStyles for positioning

### Size Options

- `'small'` - 320x180px
- `'medium'` - 480x270px
- `'large'` - 640x360px
- `'custom'` - Use width/height props

## Usage Examples

### YouTube Video

```typescript
import { createVideoAdPlayer } from 'video-ad-player-sdk';

const player = createVideoAdPlayer({
  videoId: 'dQw4w9WgXcQ',
  position: 'bottom-right',
  size: 'medium'
});
```

### Direct Video URL

```typescript
const player = createVideoAdPlayer({
  videoUrl: 'https://example.com/video.mp4',
  position: 'center',
  size: 'large',
  autoplay: true,
  muted: false
});
```

### HLS Stream (Mux)

```typescript
const player = createVideoAdPlayer({
  playbackId: 'your-mux-playback-id',
  position: 'top-right',
  size: 'small'
});
```

### Custom Size and Position

```typescript
const player = createVideoAdPlayer({
  videoUrl: 'https://example.com/ad.mp4',
  position: 'custom',
  size: 'custom',
  width: 800,
  height: 450,
  customStyles: {
    top: '100px',
    left: '50%',
    transform: 'translateX(-50%)'
  }
});
```

### With Event Handlers

```typescript
const player = createVideoAdPlayer({
  videoId: 'abc123',
  position: 'bottom-left',
  onClose: () => {
    console.log('Player closed');
  },
  onComplete: () => {
    console.log('Video completed');
    // Show another ad or redirect
  },
  onError: (error) => {
    console.error('Playback error:', error);
  }
});
```

### Programmatic Control

```typescript
const player = createVideoAdPlayer({
  videoUrl: 'https://example.com/video.mp4',
  autoplay: false
});

// Control playback
setTimeout(() => player.play(), 2000);
setTimeout(() => player.pause(), 5000);
setTimeout(() => player.setVolume(0.5), 7000);
setTimeout(() => player.seek(30), 10000);
setTimeout(() => player.close(), 15000);
```

## API Methods

### VideoAdPlayerInstance

```typescript
interface VideoAdPlayerInstance {
  play(): void;           // Start playback
  pause(): void;          // Pause playback
  close(): void;          // Close and remove player
  setVolume(volume: number): void;  // Set volume (0-1)
  seek(time: number): void;         // Seek to time in seconds
  getElement(): HTMLDivElement | null;  // Get container element
}
```

## React Component Usage

You can also use the VideoAdPlayer as a React component:

```tsx
import { VideoAdPlayer } from 'video-ad-player-sdk';

function App() {
  return (
    <div>
      <VideoAdPlayer
        videoId="dQw4w9WgXcQ"
        position="bottom-right"
        size="medium"
        onClose={() => console.log('Closed')}
      />
    </div>
  );
}
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android

## TypeScript

This SDK is written in TypeScript and includes full type definitions.

```typescript
import {
  VideoAdPlayerConfig,
  VideoAdPlayerInstance,
  PlayerPosition,
  PlayerSize
} from 'video-ad-player-sdk';
```

## License

MIT
