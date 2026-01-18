import React, { useState, useRef } from 'react';
import { SAMPLE_TEXT } from '../constants';
import { generateSpeech, base64ToAudioUrl } from '../services/geminiService';
import { VoiceSampleState } from '../types';

const VoiceSample: React.FC = () => {
  const [state, setState] = useState<VoiceSampleState>({
    isPlaying: false,
    isLoading: false,
    error: null,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cachedUrl, setCachedUrl] = useState<string | null>(null);

  const handlePlaySample = async () => {
    setState((prev) => ({ ...prev, error: null }));

    if (state.isPlaying && audioRef.current) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
      return;
    }

    if (cachedUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(cachedUrl);
        audioRef.current.onended = () => setState(prev => ({ ...prev, isPlaying: false }));
      }
      audioRef.current.play();
      setState((prev) => ({ ...prev, isPlaying: true }));
      return;
    }

    // Generate sample if not cached
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      // Using a generic "Friendly, standard Northern voice" for the sample
      const base64 = await generateSpeech(SAMPLE_TEXT, "Giọng nữ, miền Bắc, vui vẻ, thân thiện, chào mừng khách hàng.");
      const url = base64ToAudioUrl(base64);
      
      setCachedUrl(url);
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setState(prev => ({ ...prev, isPlaying: false }));
      audioRef.current.play();
      setState((prev) => ({ ...prev, isPlaying: true, isLoading: false }));
    } catch (err: any) {
      setState((prev) => ({ 
        ...prev, 
        isLoading: false, 
        error: "Không thể tải giọng mẫu. Vui lòng thử lại." 
      }));
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">GIỌNG ĐỌC MẪU</h3>
          <p className="text-gray-700 italic">"{SAMPLE_TEXT}"</p>
          <p className="text-sm text-gray-500 mt-2">Nghe thử để cảm nhận chất lượng âm thanh tự nhiên, chuẩn tiếng Việt.</p>
        </div>
        
        <button
          onClick={handlePlaySample}
          disabled={state.isLoading}
          className={`
            flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all shadow-md min-w-[160px]
            ${state.isLoading 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : state.isPlaying 
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'
            }
          `}
        >
          {state.isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tải...
            </>
          ) : state.isPlaying ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Dừng lại
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Nghe Thử
            </>
          )}
        </button>
      </div>
      {state.error && <p className="text-red-500 text-sm mt-2 text-center">{state.error}</p>}
    </div>
  );
};

export default VoiceSample;