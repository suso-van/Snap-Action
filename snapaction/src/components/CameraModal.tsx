import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Zap, Sparkles } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashActive, setFlashActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access denied or unavailable on this device. You can still upload any screenshot.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;

    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      stopCamera();
      onCapture(dataUrl);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-fadeIn">
      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-between py-2 text-white">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-light text-[#EDEDED] tracking-tight">Snap Screen or Document</span>
        </div>
        <button
          id="btn-close-camera"
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="p-2 rounded-full bg-[#111] border border-[#262626] hover:bg-[#1A1A1A] text-[#888] hover:text-[#EDEDED]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Viewfinder Area */}
      <div className="relative w-full max-w-md aspect-[3/4] bg-[#0A0A0A] rounded-3xl overflow-hidden border border-[#222] flex items-center justify-center shadow-2xl">
        {cameraError ? (
          <div className="p-6 text-center space-y-3">
            <Camera className="w-12 h-12 text-[#555] mx-auto" />
            <p className="text-xs text-rose-400">{cameraError}</p>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#262626] text-xs font-semibold text-[#EDEDED]"
            >
              Back to Gallery
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Flash Overlay Effect */}
            {flashActive && <div className="absolute inset-0 bg-white z-20 animate-fadeOut" />}

            {/* Viewfinder Target Framing Grids */}
            <div className="absolute inset-8 border border-white/10 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <div className="w-4 h-4 border-t-2 border-l-2 border-blue-500" />
                <div className="w-4 h-4 border-t-2 border-r-2 border-blue-500" />
              </div>
              <div className="text-center">
                <span className="text-[11px] font-medium bg-[#0A0A0A]/80 backdrop-blur-sm text-[#888] px-3 py-1 rounded-full border border-[#262626]">
                  Align screen or receipt
                </span>
              </div>
              <div className="flex justify-between">
                <div className="w-4 h-4 border-b-2 border-l-2 border-blue-500" />
                <div className="w-4 h-4 border-b-2 border-r-2 border-blue-500" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-md flex items-center justify-around py-6">
        <button
          id="btn-camera-flip"
          onClick={toggleFacingMode}
          className="p-3 rounded-full bg-[#111] border border-[#262626] hover:bg-[#1A1A1A] text-[#888] hover:text-[#EDEDED]"
          title="Flip camera"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        {/* Shutter Button */}
        <button
          id="btn-camera-shutter"
          onClick={handleCapture}
          disabled={!!cameraError}
          className="w-18 h-18 rounded-full bg-white p-1.5 shadow-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
        >
          <div className="w-full h-full rounded-full border-4 border-[#050505] bg-blue-600 flex items-center justify-center text-white">
            <Camera className="w-6 h-6 fill-white" />
          </div>
        </button>

        <div className="w-11" />
      </div>
    </div>
  );
};
