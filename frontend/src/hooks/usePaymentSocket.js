import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import API, { API_URL } from '../lib/api';

const usePaymentSocket = (userId) => {
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    // determine base URL
    const base = (API_URL || API.defaults?.baseURL || 'http://localhost:4000');
    
    console.log('[usePaymentSocket] Connecting to socket at', base);
    
    const newSocket = io(base, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('[usePaymentSocket] Connected:', newSocket.id);
      // Join user room to receive private notifications
      newSocket.emit('join_user_room', userId);
    });

    newSocket.on('PAYMENT_SUCCESS', (data) => {
      console.log('[usePaymentSocket] Payment Success:', data);
      setPaymentSuccessData(data);
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      console.log('[usePaymentSocket] Disconnecting');
      newSocket.disconnect();
    };
  }, [userId]);

  return { paymentSuccessData };
};

export default usePaymentSocket;
