import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import API, { API_URL } from '../lib/api';
import { useToast } from './ui/ToastProvider';
import Icon from './AppIcon';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [staffTyping, setStaffTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  // Get current user from localStorage/sessionStorage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error getting user:', error);
    }
    return null;
  };

  const user = getCurrentUser();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize socket connection ONCE
  useEffect(() => {
    if (!user) return;

    console.log('🔌 Initializing socket connection...');
    const base = (API_URL || API.defaults?.baseURL || 'http://localhost:4000');
    const newSocket = io(base, {
      auth: {
        token: localStorage.getItem('token') || sessionStorage.getItem('token')
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    newSocket.on('new_message', (messageData) => {
      console.log('📨 New message received:', messageData);
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(msg => msg._id === messageData._id)) {
          return prev;
        }
        return [...prev, messageData];
      });
    });

    newSocket.on('user_typing', (data) => {
      if (data.userId !== user?.id) {
        setStaffTyping(data.isTyping);
      }
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, [user?.id]); // Only recreate if user changes

  // Join conversation when chat opens and conversation exists
  useEffect(() => {
    if (socket && conversation?._id && isOpen) {
      console.log('🚪 Joining conversation:', conversation._id);
      socket.emit('join_conversation', conversation._id);

      return () => {
        console.log('🚪 Leaving conversation:', conversation._id);
        socket.emit('leave_conversation', conversation._id);
      };
    }
  }, [socket, conversation?._id, isOpen]);

  // Load conversation and messages when chat opens
  useEffect(() => {
    if (isOpen && user) {
      loadConversation();
    }
  }, [isOpen]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      console.log('Loading conversation...');
      
      const response = await API.get('/api/chat/conversation');
      console.log('Conversation response:', response.data);
      
      if (response.data?.success) {
        const conv = response.data.data;
        setConversation(conv);
        
        // Load messages for this conversation
        await loadMessages(conv._id);
        
        // Join socket room if socket is connected
        if (socket?.connected) {
          socket.emit('join_conversation', conv._id);
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể tải cuộc trò chuyện',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      console.log('Loading messages for conversation:', conversationId);
      const response = await API.get(`/api/chat/messages/${conversationId}`);
      console.log('Messages response:', response.data);
      
      if (response.data?.success) {
        setMessages(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    if (!conversation) {
      toast.push({
        title: 'Lỗi',
        message: 'Chưa có cuộc trò chuyện',
        type: 'error'
      });
      return;
    }

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately

    try {
      console.log('Sending message:', messageText);
      
      const response = await API.post('/api/chat/messages', {
        conversationId: conversation._id,
        message: messageText
      });

      console.log('Send message response:', response.data);

      if (response.data?.success) {
        // Don't add to local state - backend will broadcast via Socket.io
        // The 'new_message' event handler will add it automatically
        console.log('✅ Message sent successfully:', response.data.data._id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể gửi tin nhắn',
        type: 'error'
      });
      // Restore message if failed
      setNewMessage(messageText);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Don't show chat widget if:
  // 1. No user logged in
  // 2. User is admin/staff/manager (they use admin panel)
  if (!user) {
    return null;
  }

  if (['admin', 'manager', 'staff'].includes(user.role?.toLowerCase())) {
    return null;
  }

  return (
    <>
      {/* Chat Button - Fixed bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-accent hover:bg-accent/90 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
          title={isOpen ? 'Đóng chat' : 'Mở chat'}
        >
          {isOpen ? (
            <Icon name="X" className="w-6 h-6" />
          ) : (
            <>
              <Icon name="MessageCircle" className="w-7 h-7 group-hover:scale-110 transition-transform" />
              {/* Notification dot */}
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-border z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-accent to-primary text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="Headphones" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Hỗ trợ khách hàng</h3>
                <p className="text-xs text-white/80">
                  {conversation?.status === 'active' ? '🟢 Đang được hỗ trợ' :
                   conversation?.status === 'waiting' ? '🟡 Đang chờ hỗ trợ' :
                   'Chat với chúng tôi'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
            >
              <Icon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Đang tải...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Icon name="MessageCircle" className="w-10 h-10 text-accent" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Xin chào! 👋</h4>
                <p className="text-sm text-muted-foreground">
                  Chúng tôi có thể giúp gì cho bạn hôm nay?
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => {
                  const isCustomer = message.senderType === 'customer';
                  return (
                    <div
                      key={message._id || index}
                      className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm ${
                          isCustomer
                            ? 'bg-accent text-white rounded-br-none'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.message}
                        </p>
                        <p className={`text-[10px] mt-1 ${isCustomer ? 'text-white/70' : 'text-gray-500'}`}>
                          {formatTime(message.createdAt || message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {staffTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-border">
            {conversation?.status === 'closed' ? (
              <div className="text-center py-3">
                <p className="text-sm text-muted-foreground">
                  Cuộc trò chuyện đã kết thúc
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-3 border border-border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || loading}
                  className="px-5 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Icon name="Send" className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;