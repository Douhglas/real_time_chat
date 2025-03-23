import React from 'react';
import Chat from './components/Chat.tsx';

const App: React.FC = () => {
  return (
    <div>
      <h1>Real-time chat app</h1>
      <Chat />
    </div>
  );
};

export default App;