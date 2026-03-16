import { useEffect, useRef, useState, useCallback } from 'react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function useWebSocket(options) {
  const {
    url,
    autoConnect = true,
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
    onOpen,
    onClose,
    onError
  } = options;
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [status, setStatus] = useState('disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }
    setStatus('connecting');
    try {
      wsRef.current = new WebSocket(url);
      wsRef.current.onopen = () => {
        setStatus('connected');
        setReconnectAttempts(0);
        onOpen?.();
      };
      wsRef.current.onclose = () => {
        setStatus('disconnected');
        onClose?.();

        // Attempt reconnection
        if (reconnect && reconnectAttempts < maxReconnectAttempts) {
          reconnectTimeoutRef.current = window.setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, reconnectInterval);
        }
      };
      wsRef.current.onerror = event => {
        setStatus('error');
        onError?.(event);
      };
      wsRef.current.onmessage = event => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
        } catch {
          console.error('Failed to parse WebSocket message:', event.data);
        }
      };
    } catch (error) {
      setStatus('error');
      console.error('WebSocket connection error:', error);
    }
  }, [url, reconnect, reconnectInterval, maxReconnectAttempts, reconnectAttempts, onOpen, onClose, onError]);
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
  }, []);
  const sendMessage = useCallback((type, payload) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type,
        payload,
        timestamp: Date.now()
      };
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);
  return {
    status,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
    reconnectAttempts
  };
}

// Specialized hooks for different real-time features

// Booking updates

export function useBookingUpdates(venueId) {
  const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/bookings?venue=${venueId}`;
  return useWebSocket({
    url: wsUrl,
    autoConnect: true,
    reconnect: true
  });
}

// Court status updates

export function useCourtStatusUpdates(venueId) {
  const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/courts?venue=${venueId}`;
  return useWebSocket({
    url: wsUrl,
    autoConnect: true,
    reconnect: true
  });
}

// Dashboard stats updates

export function useDashboardUpdates(venueId) {
  const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/dashboard?venue=${venueId}`;
  return useWebSocket({
    url: wsUrl,
    autoConnect: true,
    reconnect: true
  });
}

// Notification updates

export function useNotificationUpdates(userId) {
  const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/notifications?user=${userId}`;
  return useWebSocket({
    url: wsUrl,
    autoConnect: true,
    reconnect: true
  });
}

// Connection status indicator component
export function WebSocketStatusIndicator({
  status
}) {
  const statusConfig = {
    connecting: {
      color: 'bg-yellow-500',
      label: 'Đang kết nối...'
    },
    connected: {
      color: 'bg-green-500',
      label: 'Đã kết nối'
    },
    disconnected: {
      color: 'bg-gray-500',
      label: 'Mất kết nối'
    },
    error: {
      color: 'bg-red-500',
      label: 'Lỗi kết nối'
    }
  };
  const config = statusConfig[status];
  return /*#__PURE__*/_jsxs("div", {
    className: "flex items-center gap-2 text-xs",
    children: [/*#__PURE__*/_jsx("span", {
      className: `w-2 h-2 rounded-full ${config.color} ${status === 'connected' ? 'animate-pulse' : ''}`
    }), /*#__PURE__*/_jsxs("span", {
      className: "text-foreground-muted",
      children: [" ", config.label, " "]
    })]
  });
}