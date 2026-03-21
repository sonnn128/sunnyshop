import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import API, { API_URL } from '../../../lib/api';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';
import { useSelector } from 'react-redux';

const ChatDetail = ({ conversation, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();
  
  // Get user from Redux or localStorage
  const reduxUser = useSelector(state => state.auth?.user);
  const getCurrentUser = () => {
    if (reduxUser) return reduxUser;
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) return JSON.parse(userStr);
    } catch (error) {
      console.error('Error getting user:', error);
    }
    return null;
  };
  const user = getCurrentUser();

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Initialize socket connection ONCE
  useEffect(() => {
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
      console.log('⌨️ User typing:', data);
      setIsTyping(data.isTyping);
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, []); // Empty deps - only run once!

  // Join conversation room when conversation changes
  useEffect(() => {
    if (socket && conversation?._id) {
      console.log('🚪 Joining conversation:', conversation._id);
      socket.emit('join_conversation', conversation._id);

      return () => {
        console.log('🚪 Leaving conversation:', conversation._id);
        socket.emit('leave_conversation', conversation._id);
      };
    }
  }, [socket, conversation?._id]);

  // Load messages when conversation changes
  useEffect(() => {
    if (conversation) {
      loadMessages();
      markAsRead();
    }
  }, [conversation?._id]);

  // Scroll to bottom when messages change
  // Auto scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const loadMessages = async () => {
    if (!conversation) return;
    
    try {
      setLoading(true);
      const response = await API.get(`/api/chat/messages/${conversation._id}`);
      if (response.data?.success) {
        setMessages(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể tải tin nhắn',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    if (!conversation) return;
    
    try {
      await API.patch(`/api/chat/messages/${conversation._id}/read`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear immediately for better UX

    try {
      const response = await API.post('/api/chat/messages', {
        conversationId: conversation._id,
        message: messageText
      });

      if (response.data?.success) {
        // Don't add to local state - backend will broadcast via Socket.io
        // The 'new_message' event handler will add it automatically
        console.log('✅ Message sent successfully:', response.data.data._id);
        
        setIsTyping(false);
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

  const handleCloseConversation = async () => {
    if (!conversation) return;
    
    if (!confirm('Bạn có chắc muốn đóng cuộc trò chuyện này?')) {
      return;
    }

    try {
      const response = await API.patch(`/api/chat/conversations/${conversation._id}/close`);
      if (response.data?.success) {
        toast.push({
          title: 'Thành công',
          message: 'Đã đóng cuộc trò chuyện',
          type: 'success'
        });
        // Update local conversation status
        conversation.status = 'closed';
        onBack();
      }
    } catch (error) {
      console.error('Error closing conversation:', error);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể đóng cuộc trò chuyện',
        type: 'error'
      });
    }
  };

  const handleReopenConversation = async () => {
    if (!conversation) return;
    
    if (!confirm('Bạn có chắc muốn mở lại cuộc trò chuyện này?')) {
      return;
    }

    try {
      const response = await API.patch(`/api/chat/conversations/${conversation._id}/reopen`);
      if (response.data?.success) {
        toast.push({
          title: 'Thành công',
          message: 'Đã mở lại cuộc trò chuyện',
          type: 'success'
        });
        // Update local conversation status
        conversation.status = 'active';
        // Reload messages to refresh UI
        await loadMessages();
      }
    } catch (error) {
      console.error('Error reopening conversation:', error);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể mở lại cuộc trò chuyện',
        type: 'error'
      });
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      waiting: { label: 'Đang chờ', color: 'bg-yellow-100 text-yellow-700' },
      active: { label: 'Đang xử lý', color: 'bg-green-100 text-green-700' },
      closed: { label: 'Đã đóng', color: 'bg-gray-100 text-gray-700' }
    };
    return badges[status] || badges.waiting;
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <Icon name="MessageCircle" className="w-16 h-16 mb-4 opacity-20 mx-auto" />
          <p>Chọn một cuộc trò chuyện để bắt đầu</p>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(conversation.status);

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header - Fixed */}
      <div className="p-4 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <Icon name="ArrowLeft" className="w-4 h-4" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="User" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {conversation.customerName || 'Khách hàng'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {conversation.customerEmail}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
            {conversation.status === 'closed' ? (
              <Button variant="outline" size="sm" onClick={handleReopenConversation}>
                <Icon name="RotateCcw" className="w-4 h-4 mr-2" />
                Mở lại
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleCloseConversation}>
                <Icon name="X" className="w-4 h-4 mr-2" />
                Đóng hội thoại
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages - Scrollable independently */}
      <div 
        className="flex-1 p-4 overflow-y-auto overflow-x-hidden bg-muted/30"
        style={{ scrollBehavior: 'smooth' }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Đang tải tin nhắn...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Chưa có tin nhắn nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isStaff = message.senderType !== 'customer';
              return (
                <div
                  key={index}
                  className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg ${
                      isStaff
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-card-foreground border border-border'
                    }`}
                  >
                    {!isStaff && message.senderId?.name && (
                      <p className="text-xs font-semibold mb-1">
                        {message.senderId.name}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    <p className={`text-xs mt-1 ${isStaff ? 'opacity-80' : 'text-muted-foreground'}`}>
                      {formatTime(message.createdAt || message.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card border border-border px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input - Fixed at bottom */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            disabled={conversation.status === 'closed'}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || conversation.status === 'closed'}
          >
            <Icon name="Send" className="w-4 h-4 mr-2" />
            Gửi
          </Button>
        </div>
        {conversation.status === 'closed' && (
          <p className="text-xs text-muted-foreground mt-2">
            Cuộc trò chuyện đã kết thúc
          </p>
        )}
      </form>
    </div>
  );
};

export default ChatDetail;
