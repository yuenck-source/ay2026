// config.js - 全站集中設定檔

const CONFIG = {
  MAIN_SHEET_ID: '1q3NLPoGG8qr33knDt6REdLM8-GVrarzSercPLrjKSbo',
  DAILY_SHEET_ID: '1KAVUnTWYN0BhrZsUWwCI8AP9aDHfNYAe_TQ7Ab1Ulmk',

  // 請確認這一行已存在且正確填入 Sheet ID
  IDEAS_SHEET_ID: '1Zgyq8EG-sbkVbQmi-YKYB0q2xOhfsEqL6MNtlqZ8f-0', 

  GIDS: {
    DAILY_LOG: '1885435306',
    IDEAS: '0',                     // 獨立 Sheet 的第一個分頁 GID 通常為 0
    HABITS: '837132755',
    HABIT_LOGS: '1991677412'
  },

  API_URLS: {
    DAILY: 'https://script.google.com/macros/s/AKfycby7--etiRb80LznLs1boPcx8pjEVjmiZbLMIM0UC3JGgP8FCpLNc7tkhrCbCciFWDgnqQ/exec',
    IDEAS: 'https://script.google.com/macros/s/AKfycbzQcRU-AsQb8oY5Wb5n8XOtZGIWkp8FXxCJLd_NrUqrBNqQmHl8ZdPvd2ABVa9KaJmk/exec',
    HABIT: 'https://script.google.com/macros/s/AKfycbz72-QL780wO-NVLsszPusQN3WGqCCeb-vn0yZEI8I6dgGwFaawpJtbUATozrE631rE/exec'
  }
};