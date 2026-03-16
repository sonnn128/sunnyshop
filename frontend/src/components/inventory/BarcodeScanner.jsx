import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, X, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function BarcodeScanner({
  onScan,
  onClose,
  isOpen,
  acceptedFormats = ['all']
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const startCamera = useCallback(async () => {
    try {
      setError(null);

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: {
            ideal: 1280
          },
          height: {
            ideal: 720
          }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setHasPermission(true);
        setScanning(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setHasPermission(false);
      setError('Không thể truy cập camera. Vui lòng cấp quyền.');
    }
  }, [facingMode]);
  const stopCamera = useCallback(() => {
    setScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Simulated barcode detection (in production, use a library like @nicolo-ribaudo/barcode-detector)
  useEffect(() => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId;
    let lastDetectionTime = 0;
    const detectionCooldown = 1000; // 1 second between detections

    const detectBarcode = () => {
      if (!scanning) return;
      const now = Date.now();
      if (now - lastDetectionTime < detectionCooldown) {
        animationId = requestAnimationFrame(detectBarcode);
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // In production, use BarcodeDetector API or a library
      // This is a placeholder that simulates detection
      if ('BarcodeDetector' in window) {
        // @ts-expect-error BarcodeDetector is not in TypeScript types yet
        const detector = new window.BarcodeDetector({
          formats: acceptedFormats.includes('all') ? ['ean_13', 'ean_8', 'code_128', 'qr_code', 'code_39', 'upc_a'] : acceptedFormats.map(f => {
            const formatMap = {
              ean: 'ean_13',
              code128: 'code_128',
              qr: 'qr_code'
            };
            return formatMap[f] || f;
          })
        });
        detector.detect(canvas).then(barcodes => {
          if (barcodes.length > 0) {
            const barcode = barcodes[0].rawValue;
            lastDetectionTime = now;
            setLastScanned(barcode);

            // Vibrate feedback on mobile
            if (navigator.vibrate) {
              navigator.vibrate(100);
            }
            onScan(barcode);
          }
        }).catch(console.error);
      }
      animationId = requestAnimationFrame(detectBarcode);
    };
    animationId = requestAnimationFrame(detectBarcode);
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [scanning, onScan, acceptedFormats]);
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);
  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };
  if (!isOpen) return null;
  return /*#__PURE__*/_jsxs("div", {
    className: "fixed inset-0 z-50 bg-black",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent",
      children: [/*#__PURE__*/_jsx(Button, {
        variant: "ghost",
        size: "icon",
        onClick: onClose,
        className: "text-white",
        children: /*#__PURE__*/_jsx(X, {
          className: "w-6 h-6"
        })
      }), /*#__PURE__*/_jsx("span", {
        className: "text-white font-medium",
        children: "Qu\xE9t m\xE3 v\u1EA1ch"
      }), /*#__PURE__*/_jsx("div", {
        className: "flex gap-2",
        children: /*#__PURE__*/_jsx(Button, {
          variant: "ghost",
          size: "icon",
          onClick: toggleCamera,
          className: "text-white",
          children: /*#__PURE__*/_jsx(RotateCcw, {
            className: "w-6 h-6"
          })
        })
      })]
    }), hasPermission === false ? /*#__PURE__*/_jsx("div", {
      className: "h-full flex items-center justify-center p-8",
      children: /*#__PURE__*/_jsxs("div", {
        className: "text-center",
        children: [/*#__PURE__*/_jsx(AlertCircle, {
          className: "w-16 h-16 text-red-500 mx-auto mb-4"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-white text-lg mb-2",
          children: error
        }), /*#__PURE__*/_jsxs(Button, {
          onClick: startCamera,
          className: "mt-4",
          children: [/*#__PURE__*/_jsx(Camera, {
            className: "w-4 h-4 mr-2"
          }), "Th\u1EED l\u1EA1i"]
        })]
      })
    }) : /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx("video", {
        ref: videoRef,
        className: "h-full w-full object-cover",
        playsInline: true,
        muted: true
      }), /*#__PURE__*/_jsx("canvas", {
        ref: canvasRef,
        className: "hidden"
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 flex items-center justify-center pointer-events-none",
        children: /*#__PURE__*/_jsxs("div", {
          className: "relative w-64 h-64",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-lg"
          }), /*#__PURE__*/_jsx("div", {
            className: "absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-lg"
          }), /*#__PURE__*/_jsx("div", {
            className: "absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-lg"
          }), /*#__PURE__*/_jsx("div", {
            className: "absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-lg"
          }), scanning && /*#__PURE__*/_jsx("div", {
            className: "absolute left-4 right-4 h-0.5 bg-primary-500 animate-scan"
          })]
        })
      }), lastScanned && /*#__PURE__*/_jsx("div", {
        className: "absolute bottom-24 left-4 right-4",
        children: /*#__PURE__*/_jsxs("div", {
          className: "bg-green-500/90 text-white p-4 rounded-xl flex items-center gap-3",
          children: [/*#__PURE__*/_jsx(Check, {
            className: "w-6 h-6"
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-sm opacity-80",
              children: "\u0110\xE3 qu\xE9t"
            }), /*#__PURE__*/_jsx("p", {
              className: "font-mono font-bold",
              children: lastScanned
            })]
          })]
        })
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent",
      children: /*#__PURE__*/_jsx("p", {
        className: "text-white/80 text-center text-sm",
        children: "\u0110\u01B0a m\xE3 v\u1EA1ch v\xE0o khung h\xECnh \u0111\u1EC3 qu\xE9t"
      })
    }), /*#__PURE__*/_jsx("style", {
      children: `
                @keyframes scan {
                    0%, 100% { top: 10%; }
                    50% { top: 90%; }
                }
                .animate-scan {
                    animation: scan 2s ease-in-out infinite;
                }
            `
    })]
  });
}

// Manual barcode input fallback

export function ManualBarcodeInput({
  onSubmit,
  placeholder = 'Nhập mã vạch...'
}) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const handleSubmit = e => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  // Auto-submit on Enter or when barcode scanner sends data quickly
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    let buffer = '';
    let lastKeyTime = 0;
    const handleKeyDown = e => {
      const now = Date.now();

      // If keys are pressed rapidly (< 50ms apart), likely from scanner
      if (now - lastKeyTime < 50) {
        buffer += e.key;
      } else {
        buffer = e.key;
      }
      lastKeyTime = now;

      // Submit on Enter if buffer has content
      if (e.key === 'Enter' && buffer.length > 1) {
        const barcode = buffer.slice(0, -1); // Remove Enter key
        onSubmit(barcode);
        setValue('');
        buffer = '';
      }
    };
    input.addEventListener('keydown', handleKeyDown);
    return () => input.removeEventListener('keydown', handleKeyDown);
  }, [onSubmit]);
  return /*#__PURE__*/_jsxs("form", {
    onSubmit: handleSubmit,
    className: "flex gap-2",
    children: [/*#__PURE__*/_jsx("input", {
      ref: inputRef,
      type: "text",
      value: value,
      onChange: e => setValue(e.target.value),
      placeholder: placeholder,
      className: "flex-1 px-4 py-2 bg-background-tertiary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
    }), /*#__PURE__*/_jsx(Button, {
      type: "submit",
      disabled: !value.trim(),
      children: /*#__PURE__*/_jsx(Check, {
        className: "w-4 h-4"
      })
    })]
  });
}