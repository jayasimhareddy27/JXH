'use client';

import { useState, useEffect } from 'react';
import { Bot, RotateCcw, Settings, LogOut } from 'lucide-react';
import { testGeminiApiKey, testHuggingFaceApiKey, testOllamaConnection } from '@components/ai/useaitestconnections';
import Link from 'next/link';

export default function AIConnectionFloating() {
  const [aiAgent, setAiAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const storedAgent = localStorage.getItem('CurrentAiAgent');
    if (storedAgent) {
      try {
        const parsed = JSON.parse(storedAgent);
        setAiAgent(parsed.model || parsed.provider);
      } catch {
        setAiAgent(null);
      }
    }
  }, []);

  // Fisher-Yates shuffle
  const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    
    return array;
  };

  const handleRandomConnect = async () => {
    setLoading(true);
    setAiAgent(null);

    const providers = [testGeminiApiKey, testHuggingFaceApiKey, testOllamaConnection];
    const shuffledProviders = shuffle([...providers]);

    let connectedAgent = null;
    for (const testFunc of shuffledProviders) {
      connectedAgent = await testFunc();
      if (connectedAgent) break;
    }

    if (connectedAgent) {
      alert(`CONNECTED TO ${connectedAgent.model}`);
      localStorage.setItem('CurrentAiAgent', JSON.stringify(connectedAgent));
      setAiAgent(connectedAgent.model || connectedAgent.provider);
    } else {
      localStorage.removeItem('CurrentAiAgent');
      setAiAgent(null);
    }

    setLoading(false);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('CurrentAiAgent');
    setAiAgent(null);
    setExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center select-none">
      {expanded && (
        <div className="flex flex-col items-center gap-2 mb-2">
          <div
            className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 text-white cursor-pointer shadow-lg hover:scale-105 transition"
            onClick={handleRandomConnect}
            title="Random AI"
          >
            <RotateCcw size={24} />
          </div>
          <Link
            className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white cursor-pointer shadow-lg hover:scale-105 transition"
            href={'/settings'}
            title="More Settings"
          >
            <Settings size={24} />
          </Link>
          <div
            className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 text-white cursor-pointer shadow-lg hover:scale-105 transition"
            onClick={handleDisconnect}
            title="Disconnect"
          >
            <LogOut size={24} />
          </div>
        </div>
      )}

      <div
        onClick={() => setExpanded((prev) => !prev)}
        className={`w-15 h-15 flex items-center justify-center rounded-full shadow-lg cursor-pointer transition
          ${aiAgent ? 'bg-green-600' : 'bg-red-600'} text-white hover:scale-105`}
        style={{ width: 60, height: 60 }}
        title={aiAgent ? `Connected: ${aiAgent}` : 'Not Connected'}
      >
        {loading ? <span className="text-sm font-semibold">...</span> : <Bot size={28} />}
      </div>
    </div>
  );
}
