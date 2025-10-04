import { useState, useRef } from 'react';
import { Play, Info, Code, CheckCircle2, Video } from 'lucide-react';
import { createVideoAdPlayer } from './sdk';
import { VideoAdPlayerInstance } from './types';

function App() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const playerRef = useRef<VideoAdPlayerInstance | null>(null);

  const demos = [
    {
      id: 'youtube-bottom-right',
      title: 'YouTube Video - Bottom Right',
      description: 'Standard YouTube ad in bottom right corner',
      code: `createVideoAdPlayer({
  videoId: 'dQw4w9WgXcQ',
  position: 'bottom-right',
  size: 'medium',
  closeable: true
});`,
      action: () => {
        playerRef.current = createVideoAdPlayer({
          videoId: 'dQw4w9WgXcQ',
          position: 'bottom-right',
          size: 'medium',
          closeable: true,
          onClose: () => setActiveDemo(null),
        });
      },
    },
    {
      id: 'video-bottom-left',
      title: 'Direct Video - Bottom Left',
      description: 'MP4 video in bottom left corner',
      code: `createVideoAdPlayer({
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  position: 'bottom-left',
  size: 'small',
  closeable: true
});`,
      action: () => {
        playerRef.current = createVideoAdPlayer({
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          position: 'bottom-left',
          size: 'small',
          closeable: true,
          muted: true,
          onClose: () => setActiveDemo(null),
        });
      },
    },
    {
      id: 'video-center',
      title: 'Center Position - Large',
      description: 'Large video ad in center of screen',
      code: `createVideoAdPlayer({
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  position: 'center',
  size: 'large',
  closeable: true
});`,
      action: () => {
        playerRef.current = createVideoAdPlayer({
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          position: 'center',
          size: 'large',
          closeable: true,
          muted: true,
          onClose: () => setActiveDemo(null),
        });
      },
    },
    {
      id: 'video-top-right',
      title: 'Top Right Corner',
      description: 'Video ad in top right with custom styling',
      code: `createVideoAdPlayer({
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  position: 'top-right',
  size: 'medium',
  closeable: true,
  customStyles: {
    borderRadius: '16px'
  }
});`,
      action: () => {
        playerRef.current = createVideoAdPlayer({
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          position: 'top-right',
          size: 'medium',
          closeable: true,
          muted: true,
          customStyles: {
            borderRadius: '16px',
          },
          onClose: () => setActiveDemo(null),
        });
      },
    },
    {
      id: 'video-custom',
      title: 'Custom Size & Position',
      description: 'Fully customized player dimensions and placement',
      code: `createVideoAdPlayer({
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  position: 'custom',
  size: 'custom',
  width: 700,
  height: 400,
  customStyles: {
    top: '80px',
    left: '50%',
    transform: 'translateX(-50%)'
  }
});`,
      action: () => {
        playerRef.current = createVideoAdPlayer({
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          position: 'custom',
          size: 'custom',
          width: 700,
          height: 400,
          closeable: true,
          muted: true,
          customStyles: {
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
          },
          onClose: () => setActiveDemo(null),
        });
      },
    },
  ];

  const handleDemoClick = (demo: typeof demos[0]) => {
    if (activeDemo === demo.id) {
      if (playerRef.current) {
        playerRef.current.close();
      }
      setActiveDemo(null);
    } else {
      if (playerRef.current) {
        playerRef.current.close();
      }
      setActiveDemo(demo.id);
      demo.action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Video className="text-blue-400" size={48} />
            <h1 className="text-5xl font-bold text-white">Video Ad Player SDK</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A powerful, customizable video ad player for any website. Easy integration, full control, production-ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <CheckCircle2 className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Easy Integration</h3>
                <p className="text-slate-300">
                  Install via npm and start displaying video ads in minutes. Simple API with full TypeScript support.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="bg-green-500/10 p-3 rounded-lg">
                <Code className="text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Fully Customizable</h3>
                <p className="text-slate-300">
                  Control position, size, styling, and behavior. Place ads anywhere with pixel-perfect precision.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <Play className="text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Multiple Sources</h3>
                <p className="text-slate-300">
                  Support for YouTube, direct video URLs, HLS streams. Works with all major video formats.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="bg-orange-500/10 p-3 rounded-lg">
                <Info className="text-orange-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Production Ready</h3>
                <p className="text-slate-300">
                  Battle-tested, optimized, and ready for production. Zero dependencies, lightweight bundle.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Quick Start</h2>
          <p className="text-slate-400 text-center mb-8">Install and use in your project</p>

          <div className="bg-slate-950 rounded-xl p-6 border border-slate-700 max-w-3xl mx-auto">
            <div className="space-y-4">
              <div>
                <div className="text-slate-400 text-sm mb-2">Install via npm</div>
                <code className="text-green-400">npm install video-ad-player-sdk</code>
              </div>
              <div>
                <div className="text-slate-400 text-sm mb-2">Import and use</div>
                <pre className="text-blue-400 text-sm">
{`import { createVideoAdPlayer } from 'video-ad-player-sdk';

const player = createVideoAdPlayer({
  videoId: 'dQw4w9WgXcQ',
  position: 'bottom-right',
  size: 'medium'
});`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Interactive Demos</h2>
          <p className="text-slate-400 text-center mb-8">Click any demo to see it in action</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.map((demo) => (
              <div
                key={demo.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 cursor-pointer hover:scale-105 ${
                  activeDemo === demo.id
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => handleDemoClick(demo)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{demo.title}</h3>
                  {activeDemo === demo.id ? (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Active</div>
                  ) : (
                    <Play className="text-blue-400" size={20} />
                  )}
                </div>
                <p className="text-slate-400 text-sm mb-4">{demo.description}</p>
                <div className="bg-slate-950 rounded-lg p-3 border border-slate-700">
                  <pre className="text-xs text-slate-300 overflow-x-auto">{demo.code}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
            <p className="text-slate-300 mb-6">
              Check out the documentation and start integrating video ads into your website today.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="#"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                View Documentation
              </a>
              <a
                href="#"
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                GitHub Repository
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
