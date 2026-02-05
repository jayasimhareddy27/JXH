"use client";
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoverLetterById, saveCoverLetterById } from '@lib/redux/features/coverletter/coverlettereditor/thunks';
import { selectContainer, updateContainerStyle } from '@lib/redux/features/coverletter/coverlettereditor/slice';

export default function CoverLetterEditor() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { formDataMap } = useSelector((state) => state.coverletterEditor);
  const { designConfig } = formDataMap;

  useEffect(() => {
    if (id) dispatch(fetchCoverLetterById(id));
  }, [id, dispatch]);

  const handleSave = () => {
    dispatch(saveCoverLetterById({ id }));
  };

  const changeHeaderColor = (color) => {
    dispatch(updateContainerStyle({ id: 'header', style: { color } }));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Styling Controls */}
      <aside className="w-64 border-r p-4 bg-gray-50 overflow-y-auto">
        <h2 className="font-bold mb-4">Design Editor</h2>
        
        <button 
          onClick={handleSave}
          className="w-full bg-green-600 text-white py-2 rounded mb-6"
        >
          Save Changes
        </button>

        <div className="space-y-4">
          <p className="text-sm font-medium">Header Text Color</p>
          <div className="flex gap-2">
            <button onClick={() => changeHeaderColor('#ff0000')} className="w-6 h-6 bg-red-500 rounded-full"></button>
            <button onClick={() => changeHeaderColor('#0000ff')} className="w-6 h-6 bg-blue-500 rounded-full"></button>
            <button onClick={() => changeHeaderColor('#000000')} className="w-6 h-6 bg-black rounded-full"></button>
          </div>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 bg-gray-200 p-12 overflow-y-auto">
        <div 
          className="bg-white mx-auto shadow-2xl p-12 min-h-[1056px] w-[816px]" // A4 Aspect Ratio
          style={{ layout: designConfig.layout }}
        >
          <header style={designConfig.containers?.header?.style}>
            <h1 className="text-3xl font-bold uppercase tracking-widest">
              Cover Letter Preview
            </h1>
          </header>
          
          <div className="mt-8 text-gray-700">
            <p>Letter content goes here...</p>
            <p className="mt-4 italic">Note: Only designConfig is currently synced in this editor slice.</p>
          </div>
        </div>
      </main>
    </div>
  );
}