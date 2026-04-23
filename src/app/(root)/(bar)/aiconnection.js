'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { setAgent, clearAgent } from '@lib/redux/features/aiagent/slice';
import { displayToast } from '@lib/redux/features/toast/thunks';
import { Bot, RotateCcw, Settings, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { connectAiAgent } from '@lib/redux/features/aiagent/thunks';

export default function AIConnectionFloating() {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  
  // Use shallowEqual for better performance on state changes
  const { agent: aiAgent, loading } = useSelector((state) => state.aiAgent, shallowEqual);

  // Sync with localStorage on mount if Redux is empty
  useEffect(() => {
    if (!aiAgent) {
      const stored = localStorage.getItem('CurrentAiAgent');
      if (stored) {
        try {
          dispatch(setAgent(JSON.parse(stored)));
        } catch (e) {
          console.error("Failed to restore AI session", e);
          localStorage.removeItem('CurrentAiAgent');
        }
      }
    }
  }, [dispatch, aiAgent]);
  
  const isBusy = loading === 'loading';

  const handleChromeAIConnect = async () => {
    const config = { provider: 'ChromeAI', model: 'Gemini Nano', ApiKey: null };
    const resultAction = await dispatch(connectAiAgent(config));

    if (connectAiAgent.fulfilled.match(resultAction)) {
      dispatch(displayToast({ message: 'Connected to Chrome AI', type: 'success' }));
    } else {
      dispatch(displayToast({ 
        message: resultAction.payload || 'Failed to connect', 
        type: 'error' 
      }));
    }
    setExpanded(false);
  };

  const handleDisconnect = () => {
    // 1. Clear Redux State
    dispatch(clearAgent());
    
    // 2. Clear Persistence
    localStorage.removeItem('CurrentAiAgent');
    
    // 3. UI Feedback
    dispatch(displayToast({ message: 'AI Agent Disconnected', type: 'info' }));
    
    setExpanded(false);
  };

  return (
    <footer className=" fixed bottom-6 right-6 z-50 flex flex-col items-center select-none">
      {expanded && (
        <div className="flex flex-col items-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Chrome AI Quick Connect */}
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 text-white cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all"
            onClick={handleChromeAIConnect}
            title="Connect Chrome AI"
            disabled={isBusy}
          >
            <RotateCcw size={22} />
          </button>

          {/* Settings Link */}
          <Link
            className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all"
            href="/settings"
            title="AI Settings"
            onClick={() => setExpanded(false)}
          >
            <Settings size={22} />
          </Link>

          {/* Disconnect Button (Only show if connected) */}
          {aiAgent && (
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 text-white cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all"
              onClick={handleDisconnect}
              title="Disconnect"
            >
              <LogOut size={22} />
            </button>
          )}
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => !isBusy && setExpanded((prev) => !prev)}
        className={`w-15 h-15 flex items-center justify-center rounded-full shadow-2xl cursor-pointer transition-all duration-300
          ${aiAgent ? 'bg-green-600 ring-4 ring-green-600/20' : 'bg-red-600 ring-4 ring-red-600/20'} 
          text-white hover:scale-105 active:scale-90`}
        style={{ width: 60, height: 60 }}
        title={aiAgent ? `Connected: ${aiAgent}` : 'Not Connected'}
      >
        {isBusy ? (
          <Loader2 className="animate-spin" size={28} />
        ) : (
          <Bot size={30} className={aiAgent ? 'animate-pulse' : ''} />
        )}
      </button>
    </footer>
  );
}