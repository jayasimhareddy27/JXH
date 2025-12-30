'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAgent, clearAgent } from '@lib/redux/features/aiagent/slice';
import { displayToast } from '@lib/redux/features/toast/thunks'; // <-- 1. Import the toast action
import { Bot, RotateCcw, Settings, LogOut } from 'lucide-react';
import { testGeminiApiKey, testHuggingFaceApiKey, testOllamaConnection } from '@components/ai/useaitestconnections';
import Link from 'next/link';
import { shuffle } from '@lib/utils';

export default function AIConnectionFloating() {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  const dispatch = useDispatch();
  const { agent: aiAgent } = useSelector((state) => state.aiAgent);

  useEffect(() => {
    if (!aiAgent) {
      const storedAgent = localStorage.getItem('CurrentAiAgent');
      if (storedAgent) {
        try {
          dispatch(setAgent(JSON.parse(storedAgent)));
        } catch {}
      }
    }
  }, [dispatch, aiAgent]);
  
  const handleRandomConnect = async () => {
    setLoading(true);
    dispatch(clearAgent());

    const providers = [testGeminiApiKey, testHuggingFaceApiKey, testOllamaConnection];
    const shuffledProviders = shuffle([...providers]);

    let connectedAgent = null;
    for (const testFunc of shuffledProviders) {
      connectedAgent = await testFunc();
      if (connectedAgent) break;
    }

    if (connectedAgent) {
      // 2. Dispatch a success toast instead of an alert
      dispatch(displayToast({ 
        message: `Connected to ${connectedAgent.model}`, 
        type: 'success' 
      }));
      dispatch(setAgent(connectedAgent));
    } else {
      // 3. Dispatch an error toast if no connection is made
      dispatch(displayToast({
        message: 'Could not connect to any AI provider.',
        type: 'error'
      }));
    }
    setLoading(false);
  };

  const handleDisconnect = () => {
    dispatch(clearAgent());
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