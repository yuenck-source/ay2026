const CONFIG = {
  // 🔑 必須保留這兩個，否則 Google 登入會失效[cite: 1]
  GOOGLE_CLIENT_ID: "972558989435-armd41776e7ueo4d57ud3i4i9p27hdb7.apps.googleusercontent.com",
  GAS_URL: "https://script.google.com/macros/s/AKfycbxkwB3tjRWDQV0ZBV87e2ExqBduxpSEibkbfkX01WASG-JOY3ycBB6vKUt9Mvm6NTQ/exec",

  // 📊 您額外新增的 Sheet 與 GIDs 設定
  MAIN_SHEET_ID: '1q3NLPoGG8qr33knDt6REdLM8-GVrarzSercPLrjKSbo',
  DAILY_SHEET_ID: '1KAVUnTWYN0BhrZsUWwCI8AP9aDHfNYAe_TQ7Ab1Ulmk',
  SECRET_KEY: "wfjlps.edu.hk_0716",
  IDEAS_SHEET_ID: '1Zgyq8EG-sbkVbQmi-YKYB0q2xOhfsEqL6MNtlqZ8f-0',  

  GIDS: {
    DAILY_LOG: '1885435306',
    IDEAS: '0',                    
    HABITS: '837132755',
    HABIT_LOGS: '1991677412'
  },

  API_URLS: {
    DAILY: 'https://script.google.com/macros/s/AKfycbxQ3pvI0K5q4pUeZ458FufaKj6QsPbUKYmGY7GNUJKjTP5khGAlBjAzj6eQtTKT0Bl7lA/exec',
    IDEAS: 'https://script.google.com/macros/s/AKfycbzQcRU-AsQb8oY5Wb5n8XOtZGIWkp8FXxCJLd_NrUqrBNqQmHl8ZdPvd2ABVa9KaJmk/exec',
    HABIT: 'https://script.google.com/macros/s/AKfycbz72-QL780wO-NVLsszPusQN3WGqCCeb-vn0yZEI8I6dgGwFaawpJtbUATozrE631rE/exec'
  }
};