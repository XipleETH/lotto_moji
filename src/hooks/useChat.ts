import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { supabase } from '../lib/supabase';
import { useWallet } from './useWallet';
import { validateEmojis } from '../utils/emojiValidation';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { address } = useWallet();

  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      if (data) {
        const validatedMessages = data.map(msg => ({
          ...msg,
          emojis: Array.isArray(msg.emojis) ? validateEmojis(msg.emojis) : []
        }));
        setMessages(validatedMessages);
      }
    };

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, {
            ...newMessage,
            emojis: validateEmojis(newMessage.emojis)
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = useCallback(async (emojis: string[]) => {
    if (!address || emojis.length === 0) return;

    const validatedEmojis = validateEmojis(emojis);
    if (validatedEmojis.length === 0) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          user_id: address,
          emojis: validatedEmojis
        }]);

      if (error) {
        console.error('Error sending message:', error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [address]);

  return { messages, sendMessage };
}