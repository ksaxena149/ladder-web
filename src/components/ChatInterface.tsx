'use client';

import { useState, useRef, useEffect } from 'react';
import { Bill, ChatMessage } from '@/types';
import { queryChatModel } from '@/utils/api';

interface ChatInterfaceProps {
  selectedBill: Bill | null;
}

export default function ChatInterface({ selectedBill }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Clear chat when a new bill is selected
  useEffect(() => {
    setMessages([]);
  }, [selectedBill?.id]);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  async function handleSendMessage() {
    if (!inputValue.trim() || !selectedBill) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      isUser: true,
      content: inputValue,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await queryChatModel({
        bill_id: selectedBill.id,
        query: userMessage.content,
      });
      
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      console.error('Error querying model:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }
  
  if (!selectedBill) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800 rounded-lg">
        <p className="text-gray-400">Select a bill to start chatting</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg">
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-white font-medium">Chat about this bill</h3>
        <p className="text-sm text-gray-400">Ask questions or request summaries</p>
      </div>
      
      {/* Messages container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet</p>
            <p className="text-sm mt-2">Try asking "Summarize this bill" or "What is the purpose of this bill?"</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-primary ml-auto text-white'
                  : 'bg-gray-700 mr-auto'
              }`}
            >
              <p className="break-words">{message.content}</p>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="max-w-[80%] p-3 rounded-lg bg-gray-700 mr-auto">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-3 border-t border-gray-700">
        <div className="flex rounded-lg overflow-hidden bg-gray-700">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-grow bg-gray-700 text-white p-2 border-none focus:ring-0 focus:outline-none resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 bg-primary text-white disabled:opacity-50"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 