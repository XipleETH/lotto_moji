import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatAddress = (address: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No messages yet. Be the first to chat!
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className="bg-gray-50 rounded-lg p-2"
          >
            <div className="text-xs text-gray-500 mb-1 flex justify-between items-center">
              <span className="font-medium">
                {formatAddress(message.user_id)}
              </span>
              <span className="text-gray-400">
                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {message.emojis?.map((emoji, index) => (
                <span 
                  key={`${message.id}-${index}`}
                  className="text-2xl select-none"
                  role="img"
                  aria-label={`emoji-${index}`}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};