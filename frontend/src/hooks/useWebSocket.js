import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useWebSocket = (userId, onNotification) => {
  const clientRef = useRef(null);

  const connect = useCallback(() => {
    if (!userId) return;

    const client = new Client({
      // Connect to notification service WebSocket
      webSocketFactory: () =>
        new SockJS('http://localhost:8084/ws'),

      // Reconnect every 5 seconds if disconnected
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('WebSocket connected');

        // Subscribe to user-specific notification channel
        client.subscribe(
          `/user/${userId}/queue/notifications`,
          (message) => {
            try {
              const notification = JSON.parse(message.body);
              console.log('New notification:', notification);
              onNotification(notification);
            } catch (e) {
              console.error('Failed to parse notification:', e);
            }
          }
        );
      },

      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },

      onStompError: (frame) => {
        console.error('WebSocket error:', frame);
      },
    });

    client.activate();
    clientRef.current = client;
  }, [userId, onNotification]);

  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [connect]);

  return clientRef;
};

export default useWebSocket;