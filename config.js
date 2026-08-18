const CONFIG = {
  // 🔑 必須保留這兩個，否則 Google 登入會失效[cite: 1]
  GOOGLE_CLIENT_ID: "972558989435-armd41776e7ueo4d57ud3i4i9p27hdb7.apps.googleusercontent.com",
  GAS_URL: "https://script.google.com/macros/s/AKfycbxkwB3tjRWDQV0ZBV87e2ExqBduxpSEibkbfkX01WASG-JOY3ycBB6vKUt9Mvm6NTQ/exec",

  // 📊 各分頁的 Sheet ID 設定
  MAIN_SHEET_ID: '1q3NLPoGG8qr33knDt6REdLM8-GVrarzSercPLrjKSbo',
  DAILY_SHEET_ID: '1KAVUnTWYN0BhrZsUWwCI8AP9aDHfNYAe_TQ7Ab1Ulmk',
  SECRET_KEY: "wfjlps.edu.hk_0716",
  IDEAS_SHEET_ID: '1Zgyq8EG-sbkVbQmi-YKYB0q2xOhfsEqL6MNtlqZ8f-0', 
  FT_SHEET_ID: "1ultOcsf8s4bFj7CrqyD_DlN4hOZ8ekK7ip4czQQl5Ms",
  MONTHLY_SHEET_ID: "1ultOcsf8s4bFj7CrqyD_DlN4hOZ8ekK7ip4czQQl5Ms",
  PROJECTS_SHEET_ID: "1ultOcsf8s4bFj7CrqyD_DlN4hOZ8ekK7ip4czQQl5Ms", // 若與其他表同一張可填相同 ID

  // 各分頁的 GID
  GIDS: {
    DAILY_LOG: '1885435306',
    IDEAS: '0',                    
    HABITS: '837132755',
    HABIT_LOGS: '1991677412',
    FT: "1351247680",
    MONTHLY: "782306667",
    PROJECTS: "1071938293" // 👈 這裡已填入你指定的 Projects GID
  },

  API_URLS: {
    DAILY: 'https://script.google.com/macros/s/AKfycbxQ3pvI0K5q4pUeZ458FufaKj6QsPbUKYmGY7GNUJKjTP5khGAlBjAzj6eQtTKT0Bl7lA/exec',
    IDEAS: 'https://script.google.com/macros/s/AKfycby2i-JNjupBPLaWuASqnUmezJRwUdQNBT2Gzsi27r1TW9kcdb-DaMwnsrYZqdv2VBhU/exec',
    HABIT: 'https://script.google.com/macros/s/AKfycbz72-QL780wO-NVLsszPusQN3WGqCCeb-vn0yZEI8I6dgGwFaawpJtbUATozrE631rE/exec',
    FT: 'https://script.google.com/macros/s/AKfycbwnpWBweDBZoEvHukGHitf0yq3ycBLfF_YpYTCsPhgz-H5snw9rfgEdgGIv7sbMETyVYA/exec',
    PROJECTS: 'https://script.google.com/macros/s/AKfycby2i-JNjupBPLaWuASqnUmezJRwUdQNBT2Gzsi27r1TW9kcdb-DaMwnsrYZqdv2VBhU/exec', // 👈 這裡已填入你指定的 Projects API 網址
    MONTHLY: 'https://script.google.com/macros/s/AKfycbwpECsIDE1xbuMPmw9kcc0Z3n761biNvqyS5SnmsInXZWO0Jxy42MbBJheHz4QnbTY8OQ/exec'
  }
};