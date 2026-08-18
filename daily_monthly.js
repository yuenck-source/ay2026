let allLogs = [];
let activeTagFilter = null;
let activeTypeFilter = 'ALL';
let activeStatusFilter = 'ALL';

let API_URL = '';
let GID = '';
let SHEET_ID = '';

// 1. Google 登入 SDK 初始化
// 強化版 Google 登入初始化 (含錯誤提示)
function initGoogleSignIn() {
  const container = document.getElementById("googleSignInContainer");
  const errContainer = document.getElementById("loginErr");

  // 1. 檢查是否以 file:// 協定開啟
  if (window.location.protocol === 'file:') {
    if (errContainer) errContainer.innerText = "⚠️ 請勿直接開啟 HTML 檔案！\nGoogle 登入需在 http://localhost 或 https:// 環境下執行。";
    return;
  }

  // 2. 檢查 CONFIG 與 Client ID
  if (typeof CONFIG === 'undefined' || !CONFIG.GOOGLE_CLIENT_ID) {
    if (errContainer) errContainer.innerText = "⚠️ 請先在 config.js 設定 GOOGLE_CLIENT_ID";
    return;
  }

  // 3. 渲染 Google 登入按鈕
  if (window.google && google.accounts && google.accounts.id) {
    google.accounts.id.initialize({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      container,
      { theme: "outline", size: "large", type: "standard", shape: "rectangular" }
    );
  }
}

// 確保頁面載入完成後雙重檢查初始化
window.onload = () => {
  loadNavbar();
  if (typeof CONFIG !== 'undefined') {
    SHEET_ID = CONFIG.MONTHLY_SHEET_ID || CONFIG.FT_SHEET_ID || '';
    GID = (CONFIG.GIDS && CONFIG.GIDS.MONTHLY) ? CONFIG.GIDS.MONTHLY : ((CONFIG.GIDS && CONFIG.GIDS.FT) ? CONFIG.GIDS.FT : '782306667');
    API_URL = CONFIG.API_URLS?.MONTHLY || CONFIG.API_URLS?.FT || CONFIG.GAS_URL || '';
  }
  
  // 嘗試初始化登入按鈕
  initGoogleSignIn();
  checkLoginStatus();
};

// 2. 頁面載入：檢查已存在的 Session
window.onload = () => {
  loadNavbar();
  if (typeof CONFIG !== 'undefined') {
    SHEET_ID = CONFIG.DAILY_SHEET_ID || '';
    GID = (CONFIG.GIDS && CONFIG.GIDS.DAILY_LOG) ? CONFIG.GIDS.DAILY_LOG : '1885435306';
    API_URL = CONFIG.API_URLS?.DAILY || '';
  }
  checkLoginStatus();
};

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
  } catch(e) { return null; }
}

function handleCredentialResponse(response) {
  const payload = parseJwt(response.credential);
  if (!payload || !payload.email) return;
  const userEmail = payload.email.toLowerCase().trim();
  if (typeof ALLOWED_EMAILS !== 'undefined' && Array.isArray(ALLOWED_EMAILS)) {
    if (!ALLOWED_EMAILS.map(e => e.toLowerCase().trim()).includes(userEmail)) {
      document.getElementById('loginErr').innerText = `⚠️ 存取被拒：未獲授權。`;
      return;
    }
  }
  // 寫入 sessionStorage 共享給其他分頁
  sessionStorage.setItem('google_user', JSON.stringify({ name: payload.name, email: userEmail, picture: payload.picture }));
  sessionStorage.setItem('google_token', response.credential);
  checkLoginStatus();
}

// 🔑 直接使用現有的 Session，毋須重複登入
function checkLoginStatus() {
  const userStr = sessionStorage.getItem('google_user');
  if (userStr) {
    if (window.google?.accounts?.id) window.google.accounts.id.cancel();
    const user = JSON.parse(userStr);
    document.getElementById('userInfo').textContent = `👤 ${user.name || user.email}`;
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'block';
    loadData();
  } else {
    document.getElementById('authOverlay').style.display = 'flex';
    document.getElementById('mainContainer').style.display = 'none';
  }
}

function logout() {
  sessionStorage.removeItem('google_user');
  sessionStorage.removeItem('google_token');
  location.reload();
}

function loadNavbar() {
  fetch('nav.html')
    .then(res => res.text())
    .then(data => {
      const navContainer = document.getElementById('navbar');
      if (navContainer) {
        navContainer.innerHTML = data;
        const currentPath = window.location.pathname.split('/').pop() || 'daily-monthly.html';
        navContainer.querySelectorAll('.nav-btn').forEach(link => {
          if (link.getAttribute('href') === currentPath) link.classList.add('active');
        });
      }
    }).catch(e => console.log('Navbar 未發現或載入跳過'));
}

// 3. 從 Daily Google Sheet 讀取 CSV
function loadData() {
  if (!SHEET_ID) {
    document.getElementById('loading').textContent = '❌ config.js 中缺少 DAILY_SHEET_ID 設定';
    return;
  }
  const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}&t=${new Date().getTime()}`;

  Papa.parse(csvUrl, {
    download: true, header: true, skipEmptyLines: true,
    complete: (results) => {
      allLogs = results.data.map((item, index) => {
        const v = Object.values(item);
        return {
          id: item.ID || item.id || v[0] || `L_${Date.now()}_${index}`,
          date: item.Date || item.date || v[1] || '',
          type: item.Type || item.type || v[2] || 'Task',
          content: item.Content || item.content || v[3] || '',
          status: item.Status || item.status || v[4] || 'Pending',
          remarks: item.Remarks || item.remarks || v[5] || ''
        };
      });
      
      const loadingEl = document.getElementById('loading');
      if (loadingEl) loadingEl.style.display = 'none';
      
      renderMonthBoards();
    },
    error: (err) => {
      document.getElementById('loading').textContent = '❌ 載入 Daily 資料失敗，請確認 GID 或公開權限。';
      console.error(err);
    }
  });
}

function formatTextWithTags(text) {
  if (!text) return '';
  const tagRegex = /(#[^\s#]+)/g;
  return text.replace(tagRegex, (tag) => `<span class="hashtag-pill" onclick="event.stopPropagation(); filterByTag('${tag}')">${tag}</span>`);
}

function filterByTag(tag) {
  activeTagFilter = tag;
  document.getElementById('activeTagText').textContent = tag;
  document.getElementById('tagFilterIndicator').style.display = 'inline';
  renderMonthBoards();
}

function clearFilter() {
  activeTagFilter = null;
  activeTypeFilter = 'ALL';
  activeStatusFilter = 'ALL';
  
  document.getElementById('typeFilter').value = 'ALL';
  document.getElementById('statusFilter').value = 'ALL';
  document.getElementById('tagFilterIndicator').style.display = 'none';
  renderMonthBoards();
}

function onTypeFilterChange(val) {
  activeTypeFilter = val;
  renderMonthBoards();
}

function onStatusFilterChange(val) {
  activeStatusFilter = val;
  renderMonthBoards();
}

function isDoneStatus(status) {
  return status === '完成' || status === 'Done' || status === '已完成';
}

// 4. 渲染 12 個月看板 + Backlog (無日期)
function renderMonthBoards() {
  const container = document.getElementById('monthBoardContainer');
  if (!container) return;
  container.innerHTML = '';

  let filteredLogs = allLogs;

  if (activeTagFilter) {
    filteredLogs = filteredLogs.filter(r => (r.content && r.content.includes(activeTagFilter)) || (r.remarks && r.remarks.includes(activeTagFilter)));
  }

  if (activeTypeFilter !== 'ALL') {
    filteredLogs = filteredLogs.filter(r => r.type === activeTypeFilter);
  }

  if (activeStatusFilter !== 'ALL') {
    if (activeStatusFilter === 'TODO') {
      filteredLogs = filteredLogs.filter(r => !isDoneStatus(r.status));
    } else if (activeStatusFilter === 'DONE') {
      filteredLogs = filteredLogs.filter(r => isDoneStatus(r.status));
    }
  }

  // 4.1 建立 Backlog (無日期) 板塊
  const backlogItems = filteredLogs.filter(r => !r.date || r.date.trim() === '');
  createBoardElement('📥 Backlog (備忘庫 / 無日期)', backlogItems, false, container);

  // 4.2 動態產生 12 個月看板
  const now = new Date();
  let startYear = now.getFullYear();
  let startMonth = now.getMonth() - 1; // 上個月開始

  const realCurrentYear = now.getFullYear();
  const realCurrentMonth = now.getMonth() + 1; 

  for (let i = 0; i < 12; i++) {
    const d = new Date(startYear, startMonth + i, 1);
    const y = d.getFullYear();
    const monthNumber = d.getMonth() + 1;
    const m = String(monthNumber).padStart(2, '0');
    
    const monthKey = `${y}-${m}`;
    const monthLabel = `${y}年 ${monthNumber}月`;
    const isCurrentMonth = (y === realCurrentYear && monthNumber === realCurrentMonth);

    const monthItems = filteredLogs
      .filter(r => r.date && r.date.startsWith(monthKey))
      .sort((a, b) => a.date.localeCompare(b.date));

    createBoardElement(`${isCurrentMonth ? '⭐' : '🗓️'} ${monthLabel} ${isCurrentMonth ? '(本月)' : ''}`, monthItems, isCurrentMonth, container);
  }
}

function createBoardElement(title, items, isCurrentMonth, container) {
  const board = document.createElement('div');
  board.className = `month-board ${isCurrentMonth ? 'current-month' : ''}`;
  
  let headerHtml = `
    <div class="month-header">
      <span>${title}</span>
      <span class="item-count">${items.length} 項</span>
    </div>
  `;

  let bodyHtml = `<div class="month-body">`;
  
  if (items.length === 0) {
    bodyHtml += `<div style="text-align:center; color:#94a3b8; font-size:0.85rem; margin-top:20px;">無事項記錄</div>`;
  } else {
    items.forEach(item => {
      const isDone = isDoneStatus(item.status);
      const safeId = String(item.id).replace(/'/g, "\\'");
      const displayDate = item.date ? item.date : '📌 無日期';

      bodyHtml += `
        <div class="mini-log-card ${isDone ? 'done' : ''}" onclick="openPreviewModal('${safeId}')">
          <div style="font-size:0.75rem; color:#64748b; display:flex; justify-content:space-between; margin-bottom:6px;">
            <span>${displayDate}</span>
            <span class="type-badge ${item.type}">${item.type}</span>
          </div>
          <div style="font-size:0.88rem; font-weight:bold; margin-bottom:8px; line-height:1.4;">
            ${formatTextWithTags(item.content)}
          </div>
          <div style="display:flex; justify-content:flex-end; border-top: 1px dashed var(--border-color); padding-top:6px;">
            <button class="status-btn ${isDone ? 'done' : 'todo'}" onclick="event.stopPropagation(); toggleStatus('${safeId}')">
              ${isDone ? '✅ 已完成' : '⏳ 待辦'}
            </button>
          </div>
        </div>
      `;
    });
  }
  bodyHtml += `</div>`;
  
  board.innerHTML = headerHtml + bodyHtml;
  container.appendChild(board);
}

// 5. Modal 檢視與 CRUD 處理 (對接 DAILY API)
function openPreviewModal(id) {
  const item = allLogs.find(r => String(r.id) === String(id));
  if (!item) return;

  document.getElementById('previewRowId').value = item.id;
  document.getElementById('previewDate').textContent = item.date || '無日期 (Backlog)';
  document.getElementById('previewType').textContent = item.type;
  document.getElementById('previewContent').innerHTML = formatTextWithTags(item.content);
  document.getElementById('previewRemarks').innerHTML = item.remarks ? formatTextWithTags(item.remarks.replace(/\n/g, '<br>')) : '<span style="color:#94a3b8">無備註</span>';
  
  document.getElementById('previewModal').style.display = 'flex';
}

function closePreviewModal() { 
  document.getElementById('previewModal').style.display = 'none'; 
}

function deleteItem() {
  const itemId = document.getElementById('previewRowId').value;
  const target = allLogs.find(r => String(r.id) === String(itemId));
  if (!target || !confirm("確定要刪除這筆事項嗎？")) return;

  allLogs = allLogs.filter(r => String(r.id) !== String(itemId));
  renderMonthBoards();
  closePreviewModal();

  if (API_URL) {
    const secret = CONFIG.SECRET_KEY || '';
    const params = new URLSearchParams({
      action: 'deleteLog',
      key: secret,
      id: itemId,
      content: target.content
    });
    fetch(`${API_URL}?${params.toString()}`, { mode: 'no-cors' });
  }
}

function openEditMode() {
  const itemId = document.getElementById('previewRowId').value;
  const item = allLogs.find(r => String(r.id) === String(itemId));
  if (!item) return;

  closePreviewModal();

  document.getElementById('modalTitle').innerHTML = '✏️ 修改 Daily 事項';
  document.getElementById('editRowId').value = item.id;
  document.getElementById('newDate').value = item.date || '';
  document.getElementById('newType').value = item.type;
  document.getElementById('newContent').value = item.content;
  document.getElementById('newRemarks').value = item.remarks || '';

  document.getElementById('modal').style.display = 'flex';
}

function toggleStatus(id) {
  const target = allLogs.find(r => String(r.id) === String(id));
  if (!target) return;

  const isDone = isDoneStatus(target.status);
  const newStatus = isDone ? 'Pending' : '完成';
  target.status = newStatus;
  
  renderMonthBoards();

  if (API_URL) {
    const params = new URLSearchParams({
      action: 'toggleLog',
      key: CONFIG.SECRET_KEY || '',
      id: target.id,
      content: target.content,
      status: newStatus
    });
    fetch(`${API_URL}?${params.toString()}`, { mode: 'no-cors' });
  }
}

function openModal() {
  document.getElementById('modalTitle').innerHTML = '📝 新增 Daily 事項';
  document.getElementById('editRowId').value = '';
  document.getElementById('addForm').reset();
  document.getElementById('modal').style.display = 'flex';
}

function closeModal() { 
  document.getElementById('modal').style.display = 'none'; 
}

function handleSubmit(e) {
  e.preventDefault();
  
  const existingId = document.getElementById('editRowId').value;
  const isEdit = (existingId !== '');
  const itemId = isEdit ? existingId : `L_${Date.now()}`;

  const dateVal = document.getElementById('newDate').value;
  const typeVal = document.getElementById('newType').value;
  const contentVal = document.getElementById('newContent').value.trim();
  const remarksVal = document.getElementById('newRemarks').value.trim();

  if (!contentVal) return;

  if (isEdit) {
    const target = allLogs.find(r => String(r.id) === String(itemId));
    if (target) {
      target.date = dateVal;
      target.type = typeVal;
      target.content = contentVal;
      target.remarks = remarksVal;
    }
  } else {
    allLogs.push({
      id: itemId,
      date: dateVal,
      type: typeVal,
      content: contentVal,
      remarks: remarksVal,
      status: 'Pending'
    });
  }
  
  renderMonthBoards();
  closeModal();

  if (API_URL) {
    const params = new URLSearchParams({
      action: isEdit ? 'editLog' : 'addLog',
      key: CONFIG.SECRET_KEY || '',
      id: itemId,
      date: dateVal,
      type: typeVal,
      content: contentVal,
      remarks: remarksVal,
      status: 'Pending'
    });
    fetch(`${API_URL}?${params.toString()}`, { mode: 'no-cors' });
  }
}