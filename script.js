let currentTab = 'welcome';
let demoMode = 'normal';
let isAtHome = true;
let rehabStep = 1;

let tasks = [
  { id: 1, title: '💊 รับประทานยาเช้าหลังอาหาร', done: true },
  { id: 2, title: '🩺 วัดความดันโลหิตรอบเช้า', done: true },
  { id: 3, title: '🖐 ฝึกกายภาพบริเวณมือ (10 นาที)', done: false },
  { id: 4, title: '🥛 ดื่มน้ำสะอาดให้ครบ 1 แก้วเต็ม', done: false },
];

// Initialize Lucide Icons
lucide.createIcons();

function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll('.page-content').forEach(el => el.classList.add('hidden'));
  const targetPage = document.getElementById(`page-${tabId}`);
  if (targetPage) targetPage.classList.remove('hidden');

  // Desktop Nav Highlight
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('bg-[#BDDAE6]/30', 'text-[#4E98B8]'));
  const activeNav = document.getElementById(`nav-${tabId}`);
  if (activeNav) activeNav.classList.add('bg-[#BDDAE6]/30', 'text-[#4E98B8]');

  // Mobile Bottom Nav Highlight
  document.querySelectorAll('.m-nav-btn').forEach(btn => btn.classList.remove('text-[#4E98B8]', 'font-extrabold'));
  const activeMNav = document.getElementById(`m-nav-${tabId}`);
  if (activeMNav && tabId !== 'emergency') activeMNav.classList.add('text-[#4E98B8]', 'font-extrabold');

  const sidebar = document.getElementById('main-sidebar');
  if (sidebar) {
    if (tabId === 'welcome' || tabId === 'role_select') {
      sidebar.classList.add('hidden');
    } else {
      sidebar.classList.remove('hidden');
    }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Modal Control Functions for Vitals
function openVitalsModal() {
  document.getElementById('vitals-modal').classList.remove('hidden');
}

function closeVitalsModal() {
  document.getElementById('vitals-modal').classList.add('hidden');
}

// Save Vitals Function
function saveCustomVitals(event) {
  event.preventDefault();
  
  const sys = parseInt(document.getElementById('input-sys').value) || 120;
  const dia = parseInt(document.getElementById('input-dia').value) || 80;
  const hr = parseInt(document.getElementById('input-hr').value) || 75;
  const spo2 = parseInt(document.getElementById('input-spo2').value) || 98;

  const bpString = `${sys}/${dia}`;

  // Update Display Elements
  document.querySelectorAll('.val-bp').forEach(el => el.textContent = bpString);
  document.querySelectorAll('.val-hr').forEach(el => el.textContent = hr);
  document.querySelectorAll('.val-spo2').forEach(el => el.textContent = spo2);

  // Evaluate Risk Levels
  let riskLabel = 'เสี่ยงต่ำ';
  let riskScore = 18;
  let bpStatusText = '✓ ปกติดี';
  let hrStatusText = '✓ ปกติดี';
  let factorBpText = '✓ อยู่ในเกณฑ์ดี';
  let factorHrText = '✓ อยู่ในเกณฑ์ดี';

  if (sys >= 160 || dia >= 100 || hr > 100 || spo2 < 92) {
    riskLabel = 'เสี่ยงสูง';
    riskScore = 88;
    bpStatusText = '⚠️ สูงมาก';
    hrStatusText = hr > 100 ? '⚠️ เร็วไป' : '✓ ปกติดี';
    factorBpText = '🔴 ต้องระวังพิเศษ';
    factorHrText = hr > 100 ? '⚠️ หัวใจเต้นเร็ว' : '✓ ปกติดี';
    switchTab('emergency');
  } else if (sys >= 135 || dia >= 88 || hr > 90) {
    riskLabel = 'ปานกลาง';
    riskScore = 54;
    bpStatusText = '⚡ ค่อนข้างสูง';
    hrStatusText = '✓ ปกติดี';
    factorBpText = '⚠️ เฝ้าระวังเล็กน้อย';
  }

  // Update Status Badges
  const bpBadge = document.getElementById('badge-bp-status');
  if (bpBadge) bpBadge.textContent = bpStatusText;

  const hrBadge = document.getElementById('badge-hr-status');
  if (hrBadge) hrBadge.textContent = hrStatusText;

  const riskLabelEl = document.getElementById('val-risk-label');
  if (riskLabelEl) riskLabelEl.textContent = riskLabel;

  const riskScoreEl = document.getElementById('val-risk-score');
  if (riskScoreEl) riskScoreEl.textContent = `คะแนน: ${riskScore}/100`;

  const circleScore = document.getElementById('ai-circle-score');
  if (circleScore) circleScore.textContent = riskScore;

  const circleLabel = document.getElementById('ai-circle-label');
  if (circleLabel) circleLabel.textContent = riskLabel;

  const factorBpEl = document.getElementById('factor-bp');
  if (factorBpEl) factorBpEl.textContent = factorBpText;

  const factorHrEl = document.getElementById('factor-hr');
  if (factorHrEl) factorHrEl.textContent = factorHrText;

  closeVitalsModal();
  alert('บันทึกค่าสุขภาพใหม่เรียบร้อยแล้วครับ! AI ได้ประเมินผลอัปเดตข้อมูลให้ทันที');
}

// Toggle Location Tracking
function toggleLocation(loc) {
  isAtHome = loc === 'home';
  
  const btnHome = document.getElementById('btn-loc-home');
  const btnAway = document.getElementById('btn-loc-away');

  if (isAtHome) {
    btnHome.className = "px-2.5 py-1 rounded-lg transition-all font-bold bg-emerald-600 text-white";
    btnAway.className = "px-2.5 py-1 rounded-lg transition-all font-medium text-slate-300";

    document.getElementById('loc-badge-status').className = "px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800";
    document.getElementById('loc-badge-status').textContent = "🏠 อยู่ในบ้าน";
    document.getElementById('loc-text-name').textContent = "บ้านพักอาศัย (ห้องนั่งเล่น)";
    document.getElementById('loc-text-sub').className = "text-xs text-emerald-600 font-bold";
    document.getElementById('loc-text-sub').textContent = "✓ อยู่ในรัศมีปลอดภัย (Safe Zone)";

    document.getElementById('staff-loc-badge').className = "px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full";
    document.getElementById('staff-loc-badge').textContent = "อยู่ในบ้าน";
    document.getElementById('staff-loc-detail').textContent = "ผู้ป่วยพักอาศัยอยู่ในบ้านพักปกติ (ไม่พบการออกนอกพื้นที่เสี่ยง)";
  } else {
    btnHome.className = "px-2.5 py-1 rounded-lg transition-all font-medium text-slate-300";
    btnAway.className = "px-2.5 py-1 rounded-lg transition-all font-bold bg-amber-500 text-white animate-pulse";

    document.getElementById('loc-badge-status').className = "px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800";
    document.getElementById('loc-badge-status').textContent = "🚗 ออกนอกบ้าน";
    document.getElementById('loc-text-name').textContent = "ถนนใหญ่ (ห่างจากบ้าน 1.2 กม.)";
    document.getElementById('loc-text-sub').className = "text-xs text-amber-600 font-bold";
    document.getElementById('loc-text-sub').textContent = "⚠️ ออกนอกเขตรัศมีปลอดภัย";

    document.getElementById('staff-loc-badge').className = "px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full";
    document.getElementById('staff-loc-badge').textContent = "อยู่นอกบ้าน";
    document.getElementById('staff-loc-detail').textContent = "⚠️ ตรวจพบการเคลื่อนที่ออกนอกเขตรัศมีบ้านพัก (1.2 กม.)";
  }
}

// Render Daily Tasks
function renderTasks() {
  const container = document.getElementById('task-list');
  if (!container) return;
  container.innerHTML = tasks.map(t => `
    <div onclick="toggleTask(${t.id})" class="flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all border-2 ${t.done ? 'bg-slate-100 border-slate-300 text-slate-400' : 'bg-[#BDDAE6]/20 border-[#ABCFD1] text-slate-900 hover:border-[#4E98B8]'}">
      <div class="flex items-center gap-3">
        <span class="w-7 h-7 rounded-lg border-2 flex items-center justify-center font-black text-sm shrink-0 ${t.done ? 'bg-[#17BCBC] border-[#17BCBC] text-white' : 'border-slate-400 bg-white'}">${t.done ? '✓' : ''}</span>
        <span class="${t.done ? 'line-through font-normal text-xs sm:text-base' : 'font-bold text-sm sm:text-base'}">${t.title}</span>
      </div>
      <span class="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold shrink-0 ${t.done ? 'bg-slate-200 text-slate-600' : 'bg-[#4E98B8] text-white'}">${t.done ? 'เรียบร้อย' : 'ยังไม่ทำ'}</span>
    </div>
  `).join('');
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  renderTasks();
}

// Set Demo Mode Controller
function setDemoMode(mode) {
  demoMode = mode;
  
  document.getElementById('btn-demo-normal').className = mode === 'normal' ? 'px-2.5 py-1 rounded-lg font-bold bg-[#4E98B8] text-white' : 'px-2.5 py-1 text-slate-300';
  document.getElementById('btn-demo-warning').className = mode === 'warning' ? 'px-2.5 py-1 rounded-lg font-bold bg-amber-500 text-white' : 'px-2.5 py-1 text-slate-300';
  document.getElementById('btn-demo-critical').className = mode === 'critical' ? 'px-2.5 py-1 rounded-lg font-bold bg-rose-600 text-white animate-pulse' : 'px-2.5 py-1 text-slate-300';

  let bp = '128/82', hr = '76', label = 'เสี่ยงต่ำ', score = '18', factorBp = '✓ อยู่ในเกณฑ์ดี';
  if (mode === 'warning') { bp = '142/92'; hr = '88'; label = 'ปานกลาง'; score = '54'; factorBp = '⚠️ เฝ้าระวังเล็กน้อย'; }
  if (mode === 'critical') { bp = '178/105'; hr = '104'; label = 'เสี่ยงสูง'; score = '88'; factorBp = '🔴 ต้องระวังพิเศษ'; }

  document.querySelectorAll('.val-bp').forEach(el => el.textContent = bp);
  document.querySelectorAll('.val-hr').forEach(el => el.textContent = hr);
  
  const riskLabel = document.getElementById('val-risk-label');
  if (riskLabel) riskLabel.textContent = label;
  
  const riskScore = document.getElementById('val-risk-score');
  if (riskScore) riskScore.textContent = `คะแนน: ${score}/100`;

  const circleScore = document.getElementById('ai-circle-score');
  if (circleScore) circleScore.textContent = score;

  const circleLabel = document.getElementById('ai-circle-label');
  if (circleLabel) circleLabel.textContent = label;

  const factorBpEl = document.getElementById('factor-bp');
  if (factorBpEl) factorBpEl.textContent = factorBp;

  const alertDot = document.getElementById('alert-dot');
  if (alertDot) alertDot.className = mode === 'critical' ? 'w-3 h-3 rounded-full bg-rose-600 animate-ping' : 'hidden';

  if (mode === 'critical' && currentTab !== 'emergency') {
    switchTab('emergency');
  }
}

// Modal Control Functions for Rehab
function openRehabModal() {
  rehabStep = 1;
  updateModalStep();
  document.getElementById('rehab-modal').classList.remove('hidden');
}

function closeRehabModal() {
  document.getElementById('rehab-modal').classList.add('hidden');
}

function nextRehabStep() {
  if (rehabStep < 4) {
    rehabStep++;
    updateModalStep();
  } else {
    document.getElementById('modal-step-content').innerHTML = `
      <div class="text-[#17BCBC] text-4xl font-black mb-2">🎉</div>
      <h4 class="text-lg font-bold text-slate-900">เก่งมากครับ ทำสำเร็จแล้ว!</h4>
      <p class="text-xs text-slate-500 mb-4">+10 คะแนนฟื้นฟูร่างกายวันนี้</p>
      <button onclick="closeRehabModal()" class="w-full py-3 bg-[#4E98B8] text-white font-bold rounded-xl shadow-sm">ตกลง</button>
    `;
  }
}

function updateModalStep() {
  const steps = [
    '1. ยื่นมือออกไปข้างหน้าช้าๆ',
    '2. กำมือแน่นๆ ค้างไว้ 3 วินาที',
    '3. คลายมือออก แบมือนิ้วเหยียดตรง',
    '4. ทำซ้ำ 10 ครั้ง ช้าๆ ไม่ต้องรีบร้อน'
  ];
  document.getElementById('modal-step-num').textContent = `${rehabStep} / 4`;
  document.getElementById('modal-step-text').textContent = steps[rehabStep - 1];
}

// App Initialization
renderTasks();
switchTab('welcome');