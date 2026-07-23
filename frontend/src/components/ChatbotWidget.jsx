import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Card, Avatar, List, Badge, Tooltip } from 'antd';
import { MessageOutlined, CloseOutlined, SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import api from '@/config/api';

const suggestions = [
  "Tư vấn chọn size",
  "Tìm áo sơ mi trắng",
  "Mã giảm giá hôm nay",
  "Chính sách đổi trả"
];

const renderFormattedText = (text) => {
  if (!text) return null;
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
    const cleanLine = isBullet ? line.replace(/^\s*[-*]\s+/, '') : line;

    const boldRegex = /\*\*(.*?)\*\*/g;
    const lineParts = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(cleanLine)) !== null) {
      if (match.index > lastIndex) {
        lineParts.push({
          bold: false,
          text: cleanLine.substring(lastIndex, match.index)
        });
      }
      lineParts.push({
        bold: true,
        text: match[1]
      });
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < cleanLine.length) {
      lineParts.push({
        bold: false,
        text: cleanLine.substring(lastIndex)
      });
    }

    const inlineContent = lineParts.length === 0 ? cleanLine : (
      <>
        {lineParts.map((p, idx) => p.bold ? <strong key={idx}>{p.text}</strong> : p.text)}
      </>
    );

    if (isBullet) {
      return (
        <li key={lineIdx} style={{ marginLeft: '16px', marginBottom: '4px' }}>
          {inlineContent}
        </li>
      );
    }

    return (
      <div key={lineIdx} style={{ minHeight: '1.2em', marginBottom: '4px' }}>
        {inlineContent}
      </div>
    );
  });
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: 'Xin chào! Mình là Stylist ảo của TrendWearShop. 🌸 Mình có thể giúp gì cho bạn hôm nay? \n\nBạn có thể nhờ mình:\n- Tư vấn chọn size quần áo (ví dụ: "Mình cao 1m70 nặng 65kg mặc size gì?")\n- Tìm kiếm sản phẩm (ví dụ: "Tìm giúp mình áo sơ mi nam dưới 300k")\n- Xem mã giảm giá hiện có (ví dụ: "Cửa hàng có chương trình khuyến mãi nào không?")'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = { role: 'user', content: inputValue };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInputValue('');
    setLoading(true);

    try {
      // Gọi API đến Spring Boot backend
      const response = await api.post('/chatbot/chat', {
        messages: updatedMessages
      }, {
        timeout: 90000 // Tăng timeout lên 90s cho cuộc gọi chatbot AI
      });

      if (response.data && response.data.success) {
        setMessages([
          ...updatedMessages,
          { role: 'model', content: response.data.data }
        ]);
      } else {
        setMessages([
          ...updatedMessages,
          { role: 'model', content: 'Xin lỗi, hệ thống đang bận phản hồi. Bạn thử lại sau nhé!' }
        ]);
      }
    } catch (error) {
      console.error('Error chatting with bot:', error);
      setMessages([
        ...updatedMessages,
        { role: 'model', content: 'Có lỗi xảy ra khi kết nối tới máy chủ. Vui lòng kiểm tra lại kết nối mạng của bạn.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleSuggestClick = async (text) => {
    if (loading) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await api.post('/chatbot/chat', {
        messages: updatedMessages
      }, {
        timeout: 90000
      });

      if (response.data && response.data.success) {
        setMessages([
          ...updatedMessages,
          { role: 'model', content: response.data.data }
        ]);
      } else {
        setMessages([
          ...updatedMessages,
          { role: 'model', content: 'Xin lỗi, hệ thống đang bận phản hồi. Bạn thử lại sau nhé!' }
        ]);
      }
    } catch (error) {
      console.error('Error chatting with bot:', error);
      setMessages([
        ...updatedMessages,
        { role: 'model', content: 'Có lỗi xảy ra khi kết nối tới máy chủ. Vui lòng kiểm tra lại kết nối mạng của bạn.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển đổi Markdown hoặc cấu trúc sản phẩm đặc biệt thành Card giao diện
  const renderMessageContent = (content) => {
    // Regex tìm cấu trúc [PRODUCT_CARD:id=X|name=Y|price=Z|image=W]
    const regex = /\[PRODUCT_CARD:id=(\d+)\|name=([^|]+)\|price=([\d.]+)\|image=([^\]]*)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          val: content.substring(lastIndex, match.index)
        });
      }

      parts.push({
        type: 'card',
        id: match[1],
        name: match[2],
        price: parseFloat(match[3]),
        image: match[4]
      });

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        val: content.substring(lastIndex)
      });
    }

    if (parts.length === 0) {
      // Trả về text thường nếu không có Card sản phẩm (được định dạng markdown)
      return <div>{renderFormattedText(content)}</div>;
    }

    return (
      <div>
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <div key={index} style={{ marginBottom: '8px' }}>
                {renderFormattedText(part.val)}
              </div>
            );
          } else {
            return (
              <Card
                key={index}
                hoverable
                style={{
                  width: '100%',
                  marginBottom: '12px',
                  borderRadius: '12px',
                  border: '1px solid #f0f0f0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
                bodyStyle={{ padding: '12px' }}
                cover={
                  part.image ? (
                    <img
                      alt={part.name}
                      src={part.image}
                      style={{ height: '140px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x140?text=TrendWearShop';
                      }}
                    />
                  ) : null
                }
                onClick={() => window.open(`/products/${part.id}`, '_blank')}
              >
                <Card.Meta
                  title={<span style={{ fontSize: '13px', fontWeight: 600 }}>{part.name}</span>}
                  description={
                    <div>
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '13px' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(part.price)}
                      </span>
                      <div style={{ marginTop: '8px', textAlign: 'right' }}>
                        <Button type="primary" size="small" style={{ borderRadius: '6px', fontSize: '11px', height: '24px' }}>
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  }
                />
              </Card>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Cửa sổ chat */}
      {isOpen && (
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<RobotOutlined />} />
                <div>
                  <span style={{ fontWeight: 600, fontSize: '14px', display: 'block', lineHeight: 1.2 }}>AI Stylist Advisor</span>
                  <span style={{ fontSize: '11px', color: '#52c41a', fontWeight: 'normal' }}>🟢 Trực tuyến</span>
                </div>
              </div>
              <Button
                type="text"
                shape="circle"
                icon={<CloseOutlined style={{ fontSize: '14px' }} />}
                onClick={() => setIsOpen(false)}
              />
            </div>
          }
          style={{
            width: '360px',
            height: '500px',
            bottom: '80px',
            position: 'absolute',
            right: 0,
            borderRadius: '16px',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #f0f0f0'
          }}
          bodyStyle={{
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100% - 56px)',
            backgroundColor: '#f9f9f9'
          }}
        >
          {/* Danh sách tin nhắn */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <List
              dataSource={messages}
              renderItem={(msg) => {
                const isModel = msg.role === 'model';
                return (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: isModel ? 'row' : 'row-reverse',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                      gap: '8px'
                    }}
                  >
                    <Avatar
                      style={{
                        backgroundColor: isModel ? '#1890ff' : '#87d068',
                        flexShrink: 0
                      }}
                      icon={isModel ? <RobotOutlined /> : <UserOutlined />}
                      size="small"
                    />
                    <div
                      style={{
                        maxWidth: '75%',
                        padding: '10px 14px',
                        borderRadius: isModel ? '0px 12px 12px 12px' : '12px 0px 12px 12px',
                        backgroundColor: isModel ? '#ffffff' : '#1890ff',
                        color: isModel ? '#333333' : '#ffffff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        fontSize: '13px'
                      }}
                    >
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>
                );
              }}
            />
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<RobotOutlined />} size="small" />
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '0px 12px 12px 12px',
                    backgroundColor: '#ffffff',
                    color: '#8c8c8c',
                    fontSize: '12px',
                    fontStyle: 'italic',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  Stylist đang suy nghĩ...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Gợi ý câu hỏi nhanh */}
          <div
            style={{
              padding: '8px 12px',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #f0f0f0',
              scrollbarWidth: 'none', // Ẩn thanh cuộn trên Firefox
              msOverflowStyle: 'none', // Ẩn thanh cuộn trên IE
              whiteSpace: 'nowrap'
            }}
            className="chat-suggestions"
          >
            {suggestions.map((item, idx) => (
              <Button
                key={idx}
                size="small"
                shape="round"
                disabled={loading}
                style={{
                  fontSize: '11px',
                  color: '#1890ff',
                  borderColor: '#91d5ff',
                  backgroundColor: '#e6f7ff',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                onClick={() => handleSuggestClick(item)}
              >
                {item}
              </Button>
            ))}
          </div>

          {/* Ô nhập tin nhắn */}
          <div
            style={{
              padding: '12px',
              borderTop: '1px solid #f0f0f0',
              backgroundColor: '#ffffff',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <Input
              placeholder="Nhập câu hỏi tại đây..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{ borderRadius: '20px', paddingLeft: '12px' }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={loading || !inputValue.trim()}
            />
          </div>
        </Card>
      )}

      {/* Nút bật/tắt bong bóng chat nổi */}
      <Badge dot={!isOpen}>
        <Tooltip title="Nhờ AI Stylist tư vấn" placement="left">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
            style={{
              width: '56px',
              height: '56px',
              fontSize: '22px',
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setIsOpen(!isOpen)}
          />
        </Tooltip>
      </Badge>
    </div>
  );
};

export default ChatbotWidget;
