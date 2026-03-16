import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatDetail from './ChatDetail';

const ChatManagement = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="h-[calc(100vh-12rem)] bg-background rounded-lg border border-border flex">
      {/* Conversations List - Fixed width with its own scroll */}
      <div 
        className={`${
          selectedConversation ? 'w-96' : 'flex-1'
        } border-r border-border flex-shrink-0 transition-all duration-300`}
      >
        <ChatList onSelectConversation={setSelectedConversation} />
      </div>

      {/* Chat Detail - Takes remaining space with its own scroll */}
      {selectedConversation && (
        <div className="flex-1 min-w-0">
          <ChatDetail
            conversation={selectedConversation}
            onBack={() => setSelectedConversation(null)}
          />
        </div>
      )}
    </div>
  );
};

export default ChatManagement;
