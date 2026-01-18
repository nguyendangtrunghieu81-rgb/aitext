// Credentials as specified in the requirements
export const ADMIN_USERNAME = "Hieuadmin";
export const ADMIN_PASSWORD = "Hieuadmin@";

export const APP_TITLE = "THẦY HIẾU - TEXT TO SPEECH";

export const MAX_WORD_COUNT = 1000;

export const SAMPLE_TEXT = "Chào mừng bạn đến với công cụ AI Thầy Hiếu, chuyển văn bản thành giọng đọc.";

export const MODEL_NAME = "gemini-2.5-flash-preview-tts";

// Generic error messages
export const ERR_LOGIN_FAILED = "Tên đăng nhập hoặc mật khẩu không đúng.";
export const ERR_NOT_LOGGED_IN = "Vui lòng đăng nhập bằng tài khoản được cấp để sử dụng hệ thống.";
export const ERR_WORD_LIMIT = `Văn bản vượt quá giới hạn ${MAX_WORD_COUNT} từ cho mỗi lượt chuyển đổi.`;
export const ERR_API_KEY_MISSING = "Chưa cấu hình API Key. Vui lòng kiểm tra thiết lập môi trường.";