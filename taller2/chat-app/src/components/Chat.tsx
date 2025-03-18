import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

interface ChatMessage {
  user: string;
  message: string;
  timestamp: string;
  formattedTime?: string;
}

const socket = io('http://localhost:3000');

const Chat: React.FC = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socket.on('chat message', (msg: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const setReadOnlyUserName = () => {
    if (usernameInputRef.current) {
      usernameInputRef.current.readOnly = true;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username && message) {
      const newMessage: ChatMessage = {
        user: username,
        message: message,
        timestamp: new Date().toISOString()
      };
      socket.emit('chat message', newMessage);
      setMessage('');
      setReadOnlyUserName();
    }
  };

  return (
    <> 
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          ref={usernameInputRef}
          required
        />
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            [{msg.formattedTime || new Date(msg.timestamp).toLocaleTimeString()}] {msg.user}: {msg.message}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Chat;