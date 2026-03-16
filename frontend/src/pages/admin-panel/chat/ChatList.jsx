import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import API from '../../../lib/api';
import { useToast } from '../../../components/ui/ToastProvider';

const ChatList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, waiting, active, closed
  const toast = useToast();

  useEffect(() => {
    loadConversations();
    // Refresh every 10 seconds
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  const loadConversations = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await API.get('/api/chat/conversations', { params });
      if (response.data?.success) {
        setConversations(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể tải danh sách hội thoại',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const messageDate = new Date(date);
    const diff = now - messageDate;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return 'Vừa xong';
  };

  const getStatusBadge = (status) => {
    const badges = {
      waiting: { label: 'Đang chờ', color: 'bg-yellow-100 text-yellow-700' },
      active: { label: 'Đang xử lý', color: 'bg-green-100 text-green-700' },
      closed: { label: 'Đã đóng', color: 'bg-gray-100 text-gray-700' }
    };
    return badges[status] || badges.waiting;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header with filters */}
      <div className="p-4 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Tin nhắn khách hàng</h2>
          <Button size="sm" onClick={loadConversations}>
            <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'waiting', label: 'Chờ xử lý' },
            { id: 'active', label: 'Đang xử lý' },
            { id: 'closed', label: 'Đã đóng' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations list - Scrollable independently */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden"
           style={{ scrollBehavior: 'smooth' }}
      >
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Icon name="MessageCircle" className="w-16 h-16 mb-4 opacity-20" />
            <p>Chưa có tin nhắn nào</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {conversations.map((conversation) => {
              const badge = getStatusBadge(conversation.status);
              return (
                <button
                  key={conversation._id}
                  onClick={() => onSelectConversation(conversation)}
                  className="w-full p-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="User" className="w-6 h-6 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {conversation.customerName || 'Khách hàng'}
                        </h3>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {formatTime(conversation.lastMessageAt)}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {conversation.customerEmail}
                      </p>

                      <p className="text-sm text-foreground truncate mb-2">
                        {conversation.lastMessage || 'Chưa có tin nhắn'}
                      </p>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>
                          {badge.label}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                            {conversation.unreadCount} mới
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
