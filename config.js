

// config.js - 全站集中設定檔

const CONFIG = {
  // 1. 主月曆 & 習慣頁面 (原本的 Sheet)
  MAIN_SHEET_ID: '1q3NLPoGG8qr33knDt6REdLM8-GVrarzSercPLrjKSbo',

  // 2. 獨立的 Daily Log 專用 Sheet
  DAILY_SHEET_ID: '1KAVUnTWYN0BhrZsUWwCI8AP9aDHfNYAe_TQ7Ab1Ulmk', 

  GIDS: {
    DAILY_LOG: '1885435306',        // 獨立 Sheet 的第一個分頁 GID 通常為 0
    HABITS: '837132755',
    HABIT_LOGS: '1991677412'
  },

  API_URLS: {
    DAILY: 'https://script.google.com/macros/s/AKfycbwC8QF6mvz-gSi_aZ3viB2u4z3PeyNGiB4P9dmhuik-GXmw2ardbJSWS_WJGIPqQIdf6g/exec',
    HABIT: 'https://script.google.com/macros/s/AKfycbz72-QL780wO-NVLsszPusQN3WGqCCeb-vn0yZEI8I6dgGwFaawpJtbUATozrE631rE/exec'
  }
};