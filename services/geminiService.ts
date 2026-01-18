import { GoogleGenAI, Modality } from "@google/genai";
import { MODEL_NAME, MAX_WORD_COUNT, ERR_WORD_LIMIT, ERR_API_KEY_MISSING } from "../constants";

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).length;
};

const SAMPLE_RATE = 24000;

/**
 * Adds a WAV header to raw PCM data
 */
const pcmToWav = (pcmData: Uint8Array, sampleRate: number = SAMPLE_RATE, numChannels: number = 1): ArrayBuffer => {
  const headerLength = 44;
  const dataLength = pcmData.length;
  const buffer = new ArrayBuffer(headerLength + dataLength);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length
  view.setUint32(4, 36 + dataLength, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 = PCM)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sampleRate * blockAlign)
  view.setUint32(28, sampleRate * numChannels * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, dataLength, true);

  // Write PCM data
  const bytes = new Uint8Array(buffer);
  bytes.set(pcmData, headerLength);

  return buffer;
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

export const generateSpeech = async (
  text: string, 
  voiceDescription: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error(ERR_API_KEY_MISSING);
  }

  const wordCount = countWords(text);
  if (wordCount > MAX_WORD_COUNT) {
    throw new Error(ERR_WORD_LIMIT);
  }

  const ai = new GoogleGenAI({ apiKey });

  const promptText = `
    Bạn là một hệ thống chuyển văn bản thành giọng nói tiếng Việt chuyên nghiệp.
    
    NHIỆM VỤ: Đọc văn bản dưới đây thành âm thanh.

    YÊU CẦU VỀ GIỌNG ĐỌC (Phân tích và thực hiện):
    "${voiceDescription}"
    (Hãy phân tích mô tả trên để xác định: Giới tính, Độ tuổi, Vùng miền (Bắc/Trung/Nam), Cảm xúc, Tốc độ và Cao độ phù hợp nhất).

    QUY TẮC ĐỌC TUYỆT ĐỐI:
    1. Phát âm chuẩn tiếng Việt, đúng dấu thanh.
    2. Đọc số đúng ngữ cảnh (VD: 2025 -> hai nghìn không trăm hai mươi lăm).
    3. Đọc ngày tháng, tiền tệ chính xác (VNĐ, USD).
    4. Ngắt nghỉ đúng dấu câu, ngữ điệu tự nhiên như người thật.

    VĂN BẢN CẦN ĐỌC:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("Không nhận được dữ liệu âm thanh từ hệ thống.");
    }

    return base64Audio;
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    throw new Error(error.message || "Đã xảy ra lỗi khi tạo giọng nói.");
  }
};

/**
 * Decodes base64 string to an Audio Blob URL with WAV header
 */
export const base64ToAudioUrl = (base64: string): string => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Convert raw PCM to WAV
  const wavBuffer = pcmToWav(bytes);
  
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
};