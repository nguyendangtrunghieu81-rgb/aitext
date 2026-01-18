import React, { useState } from 'react';
import { User, TtsState } from '../types';
import { APP_TITLE, MAX_WORD_COUNT } from '../constants';
import { generateSpeech, base64ToAudioUrl, countWords } from '../services/geminiService';
import VoiceSample from './VoiceSample';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [textInput, setTextInput] = useState('');
  const [voiceDescription, setVoiceDescription] = useState('Giọng nữ miền Bắc, nhẹ nhàng, truyền cảm, đọc truyện.');
  const [ttsState, setTtsState] = useState<TtsState>({
    isLoading: false,
    error: null,
    audioUrl: null,
  });

  const wordCount = countWords(textInput);
  const isOverLimit = wordCount > MAX_WORD_COUNT;

  const handleGenerate = async () => {
    if (!textInput.trim()) return;
    if (isOverLimit) {
      setTtsState(prev => ({ ...prev, error: `Văn bản vượt quá ${MAX_WORD_COUNT} từ.` }));
      return;
    }

    setTtsState({ isLoading: true, error: null, audioUrl: null });

    try {
      const base64Audio = await generateSpeech(textInput, voiceDescription);
      const url = base64ToAudioUrl(base64Audio);
      setTtsState({ isLoading: false, error: null, audioUrl: url });
    } catch (err: any) {
      setTtsState({ isLoading: false, error: err.message, audioUrl: null });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">H</div>
            <h1 className="text-xl font-bold text-gray-800">{APP_TITLE}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">Xin chào, <strong>{user.fullName}</strong></span>
            <button
              onClick={onLogout}
              className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        <VoiceSample />

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Input Section */}
            <div>
              <label htmlFor="text-input" className="block text-sm font-semibold text-gray-700 mb-2">
                Văn bản cần chuyển đổi ({wordCount}/{MAX_WORD_COUNT} từ)
              </label>
              <textarea
                id="text-input"
                rows={6}
                className={`w-full p-4 rounded-xl border ${isOverLimit ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-500'} focus:ring-4 transition-all resize-none text-gray-800 placeholder-gray-400`}
                placeholder="Nhập nội dung tiếng Việt bạn muốn chuyển thành giọng nói..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              {isOverLimit && <p className="text-red-600 text-sm mt-1">Văn bản quá dài. Vui lòng cắt ngắn xuống dưới {MAX_WORD_COUNT} từ.</p>}
            </div>

            {/* Config Section */}
            <div>
              <label htmlFor="voice-desc" className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả giọng đọc mong muốn
              </label>
              <div className="relative">
                <textarea
                  id="voice-desc"
                  rows={2}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all text-gray-800 placeholder-gray-400"
                  placeholder="Ví dụ: Giọng nam trung niên, người Hà Nội, giọng trầm ấm, đọc chậm rãi kiểu kể chuyện..."
                  value={voiceDescription}
                  onChange={(e) => setVoiceDescription(e.target.value)}
                />
                <div className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-help group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="absolute right-0 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    Hệ thống AI sẽ phân tích mô tả của bạn để chọn giới tính, vùng miền (Bắc/Trung/Nam), độ tuổi và cảm xúc phù hợp nhất.
                  </div>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {ttsState.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-sm">{ttsState.error}</p>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={ttsState.isLoading || !textInput.trim() || isOverLimit}
              className={`
                w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all active:scale-[0.98]
                ${ttsState.isLoading || !textInput.trim() || isOverLimit
                  ? 'bg-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 hover:shadow-indigo-500/30'
                }
              `}
            >
              {ttsState.isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý (AI)...
                </div>
              ) : (
                "CHUYỂN ĐỔI NGAY"
              )}
            </button>
          </div>

          {/* Result Section */}
          {ttsState.audioUrl && (
            <div className="bg-gray-50 border-t border-gray-100 p-6 sm:p-8 animate-fade-in">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Kết quả chuyển đổi thành công
              </h3>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <audio controls className="w-full h-12 mb-4" src={ttsState.audioUrl}>
                  Trình duyệt của bạn không hỗ trợ thẻ audio.
                </audio>
                
                <div className="flex justify-end">
                  <a
                    href={ttsState.audioUrl}
                    download={`thay-hieu-tts-${Date.now()}.wav`}
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Tải xuống (.wav)
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          Hệ thống sử dụng AI tiên tiến nhất để tái tạo giọng nói tiếng Việt tự nhiên. 
          <br />Mọi quyền được bảo lưu bởi Thầy Hiếu.
        </p>
      </main>
    </div>
  );
};

export default Dashboard;