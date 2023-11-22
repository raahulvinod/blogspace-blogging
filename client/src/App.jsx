import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full h-screen text-blue-600 flex justify-center items-center text-4xl">
      Hello world
    </div>
  );
}

export default App;
