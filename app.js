/* ============================================
   Daily Disciplines — App Logic
   ============================================ */

(function () {
  'use strict';

  // ── Storage Layer ──────────────────────────

  var STORAGE_KEYS = {
    disciplines: 'dd_disciplines',
    records: 'dd_records',
    rewards: 'dd_rewards',
    exchange: 'dd_exchange',
  };

  function loadDisciplines() {
    var raw = localStorage.getItem(STORAGE_KEYS.disciplines);
    if (!raw) return [];
    var list = JSON.parse(raw);
    list.forEach(function (d) {
      if (d.active === undefined) d.active = true;
      if (d.points === undefined) d.points = 5;
    });
    return list;
  }

  function saveDisciplines(list) {
    localStorage.setItem(STORAGE_KEYS.disciplines, JSON.stringify(list));
  }

  function loadRecords() {
    var raw = localStorage.getItem(STORAGE_KEYS.records);
    return raw ? JSON.parse(raw) : {};
  }

  function saveRecords(recs) {
    localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(recs));
  }

  function loadRewards() {
    var raw = localStorage.getItem(STORAGE_KEYS.rewards);
    return raw ? JSON.parse(raw) : [];
  }

  function saveRewards(list) {
    localStorage.setItem(STORAGE_KEYS.rewards, JSON.stringify(list));
  }

  function loadExchange() {
    var raw = localStorage.getItem(STORAGE_KEYS.exchange);
    if (!raw) return { rate: 100, value: 1, unit: 'dollar' };
    return JSON.parse(raw);
  }

  function saveExchange(settings) {
    localStorage.setItem(STORAGE_KEYS.exchange, JSON.stringify(settings));
  }

  function getTodayKey() {
    var d = new Date();
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function getActiveDisciplines() {
    return disciplines.filter(function (d) { return d.active; });
  }

  // ── State ──────────────────────────────────

  var disciplines = loadDisciplines();
  var records = loadRecords();
  var rewards = loadRewards();
  var exchange = loadExchange();
  var currentRange = 7;
  var pendingImageData = null;

  // ── DOM References ─────────────────────────

  var $todayDate = document.getElementById('todayDate');
  var $checklist = document.getElementById('checklist');
  var $addForm = document.getElementById('addForm');
  var $addInput = document.getElementById('addInput');
  var $addPoints = document.getElementById('addPoints');
  var $progressDone = document.getElementById('progressDone');
  var $progressTotal = document.getElementById('progressTotal');
  var $progressCircle = document.getElementById('progressCircle');
  var $manageList = document.getElementById('manageList');

  var $pointsBalance = document.getElementById('pointsBalance');
  var $pointsConverted = document.getElementById('pointsConverted');
  var $pointsEarned = document.getElementById('pointsEarned');
  var $pointsSpent = document.getElementById('pointsSpent');
  var $exchangeRate = document.getElementById('exchangeRate');
  var $exchangeValue = document.getElementById('exchangeValue');
  var $exchangeUnit = document.getElementById('exchangeUnit');
  var $pointsChart = document.getElementById('pointsChart');
  var $chartEmpty = document.getElementById('chartEmpty');
  var $rewardForm = document.getElementById('rewardForm');
  var $rewardPoints = document.getElementById('rewardPoints');
  var $rewardDesc = document.getElementById('rewardDesc');
  var $rewardImage = document.getElementById('rewardImage');
  var $imageUploadArea = document.getElementById('imageUploadArea');
  var $imagePreviewContainer = document.getElementById('imagePreviewContainer');
  var $imagePreview = document.getElementById('imagePreview');
  var $imageRemoveBtn = document.getElementById('imageRemoveBtn');
  var $rewardsJournal = document.getElementById('rewardsJournal');
  var $journalEmpty = document.getElementById('journalEmpty');

  var $statStreak = document.getElementById('statStreak');
  var $statAvg = document.getElementById('statAvg');
  var $statPerfect = document.getElementById('statPerfect');
  var $disciplineRates = document.getElementById('disciplineRates');
  var $ratesEmpty = document.getElementById('ratesEmpty');
  var $heatmap = document.getElementById('heatmap');

  // ── Tab Navigation ─────────────────────────

  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function (c) { c.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');

      if (btn.dataset.tab === 'today') renderToday();
      if (btn.dataset.tab === 'manage') renderManage();
      if (btn.dataset.tab === 'points') renderPoints();
      if (btn.dataset.tab === 'analysis') renderAnalysis();
    });
  });

  // ── Range Filter ───────────────────────────

  document.querySelectorAll('.range-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.range-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentRange = btn.dataset.range === 'all' ? 'all' : parseInt(btn.dataset.range);
      renderAnalysis();
    });
  });

  // ── Display Today's Date ───────────────────

  function formatDisplayDate(dateKey) {
    var parts = dateKey.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  $todayDate.textContent = formatDisplayDate(getTodayKey());

  // ── Render Today Tab ───────────────────────

  function renderToday() {
    var today = getTodayKey();
    if (!records[today]) records[today] = {};
    var active = getActiveDisciplines();

    $checklist.innerHTML = '';

    if (active.length === 0) {
      $checklist.innerHTML =
        '<div class="empty-checklist"><span>🌱</span>No active disciplines yet.<br>Go to the <strong>Manage</strong> tab to add some!</div>';
    }

    active.forEach(function (disc) {
      var isChecked = !!records[today][disc.id];
      var card = document.createElement('div');
      card.className = 'discipline-card' + (isChecked ? ' checked' : '');
      card.innerHTML =
        '<label class="checkbox">' +
          '<input type="checkbox"' + (isChecked ? ' checked' : '') + ' data-id="' + disc.id + '">' +
          '<div class="checkmark"></div>' +
        '</label>' +
        '<span class="discipline-name">' + escapeHtml(disc.name) + '</span>' +
        '<span class="points-badge">★ ' + disc.points + '</span>';
      $checklist.appendChild(card);
    });

    updateProgress();
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ── Sound Engine (Web Audio API) ────────────

  var audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, duration, type, volume, delay) {
    try {
      var ctx = getAudioCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume || 0.3, ctx.currentTime + (delay || 0));
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (delay || 0) + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + (delay || 0));
      osc.stop(ctx.currentTime + (delay || 0) + duration);
    } catch (e) {
      // Audio not supported — silently skip
    }
  }

  function soundCheck() {
    playTone(523, 0.15, 'sine', 0.35, 0);
    playTone(659, 0.18, 'sine', 0.3, 0.1);
  }

  function soundUncheck() {
    playTone(440, 0.12, 'sine', 0.15, 0);
    playTone(370, 0.14, 'sine', 0.1, 0.08);
  }

  function soundVictory() {
    playTone(523, 0.18, 'sine', 0.3, 0);
    playTone(659, 0.18, 'sine', 0.3, 0.14);
    playTone(784, 0.18, 'sine', 0.3, 0.28);
    playTone(1047, 0.35, 'triangle', 0.25, 0.42);
  }

  // ── Visual Effects ─────────────────────────

  function spawnSparkles(card) {
    var checkbox = card.querySelector('.checkmark');
    var rect = checkbox.getBoundingClientRect();
    var cardRect = card.getBoundingClientRect();
    var cx = rect.left + rect.width / 2 - cardRect.left;
    var cy = rect.top + rect.height / 2 - cardRect.top;
    var colors = ['#81B29A', '#F2CC8F', '#E07A5F', '#F4B8A8', '#C5DED3'];

    for (var i = 0; i < 8; i++) {
      var spark = document.createElement('div');
      spark.className = 'sparkle';
      var angle = (Math.PI * 2 / 8) * i + (Math.random() - 0.5) * 0.5;
      var dist = 18 + Math.random() * 14;
      spark.style.left = cx + 'px';
      spark.style.top = cy + 'px';
      spark.style.background = colors[Math.floor(Math.random() * colors.length)];
      spark.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
      spark.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
      card.style.position = 'relative';
      card.appendChild(spark);
      (function (el) {
        setTimeout(function () { el.remove(); }, 650);
      })(spark);
    }
  }

  function spawnFloatingPoints(card, pts) {
    var el = document.createElement('div');
    el.className = 'float-points';
    el.textContent = '+' + pts + ' ★';
    card.style.position = 'relative';
    card.appendChild(el);
    setTimeout(function () { el.remove(); }, 950);
  }

  function launchConfetti() {
    var container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    var colors = ['#E07A5F', '#F2CC8F', '#81B29A', '#F4B8A8', '#C5DED3', '#FFD700', '#FF6B6B'];
    for (var i = 0; i < 50; i++) {
      var piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty('--fall-distance', (window.innerHeight + 40) + 'px');
      piece.style.setProperty('--fall-duration', (1.5 + Math.random() * 1.5) + 's');
      piece.style.setProperty('--spin', (360 + Math.random() * 720) + 'deg');
      piece.style.animationDelay = (Math.random() * 0.6) + 's';
      piece.style.width = (6 + Math.random() * 6) + 'px';
      piece.style.height = (10 + Math.random() * 8) + 'px';
      container.appendChild(piece);
    }

    setTimeout(function () { container.remove(); }, 3500);
  }

  // ── Checkbox Toggle ────────────────────────

  $checklist.addEventListener('change', function (e) {
    if (e.target.type !== 'checkbox') return;
    var id = e.target.dataset.id;
    var today = getTodayKey();

    if (!records[today]) records[today] = {};
    records[today][id] = e.target.checked;
    saveRecords(records);

    var card = e.target.closest('.discipline-card');
    if (e.target.checked) {
      card.classList.add('checked');

      soundCheck();
      spawnSparkles(card);

      var disc = disciplines.find(function (d) { return d.id === id; });
      if (disc) spawnFloatingPoints(card, disc.points);

      card.classList.add('just-checked');
      setTimeout(function () { card.classList.remove('just-checked'); }, 500);
    } else {
      card.classList.remove('checked');
      soundUncheck();
    }

    updateProgress();

    if (e.target.checked) {
      var active = getActiveDisciplines();
      var todayRec = records[today] || {};
      var allDone = active.length > 0 && active.every(function (d) { return !!todayRec[d.id]; });
      if (allDone) {
        setTimeout(function () {
          soundVictory();
          launchConfetti();
        }, 350);
      }
    }
  });

  // ── Render Manage Tab ──────────────────────

  function renderManage() {
    $manageList.innerHTML = '';

    if (disciplines.length === 0) {
      $manageList.innerHTML =
        '<div class="empty-manage">No disciplines yet. Add one above!</div>';
      return;
    }

    disciplines.forEach(function (disc) {
      var card = document.createElement('div');
      card.className = 'manage-card' + (disc.active ? '' : ' inactive');
      card.innerHTML =
        '<label class="toggle">' +
          '<input type="checkbox"' + (disc.active ? ' checked' : '') + ' data-id="' + disc.id + '" data-action="toggle">' +
          '<div class="toggle-track"></div>' +
        '</label>' +
        '<span class="manage-card-name">' + escapeHtml(disc.name) + '</span>' +
        '<div class="manage-points">' +
          '<span class="points-star">★</span>' +
          '<input type="number" class="manage-points-input" value="' + disc.points + '" min="1" max="50" data-id="' + disc.id + '" data-action="points">' +
        '</div>' +
        '<button class="manage-delete-btn" data-id="' + disc.id + '" title="Delete permanently">✕</button>';
      $manageList.appendChild(card);
    });
  }

  // ── Manage: Toggle Active ──────────────────

  $manageList.addEventListener('change', function (e) {
    if (e.target.dataset.action === 'toggle') {
      var id = e.target.dataset.id;
      var disc = disciplines.find(function (d) { return d.id === id; });
      if (!disc) return;
      disc.active = e.target.checked;
      saveDisciplines(disciplines);
      var card = e.target.closest('.manage-card');
      if (disc.active) {
        card.classList.remove('inactive');
      } else {
        card.classList.add('inactive');
      }
    }

    if (e.target.dataset.action === 'points') {
      var ptId = e.target.dataset.id;
      var ptDisc = disciplines.find(function (d) { return d.id === ptId; });
      if (!ptDisc) return;
      var val = parseInt(e.target.value) || 1;
      if (val < 1) val = 1;
      if (val > 50) val = 50;
      e.target.value = val;
      ptDisc.points = val;
      saveDisciplines(disciplines);
    }
  });

  // ── Manage: Delete Discipline ──────────────

  $manageList.addEventListener('click', function (e) {
    var btn = e.target.closest('.manage-delete-btn');
    if (!btn) return;

    var id = btn.dataset.id;
    var disc = disciplines.find(function (d) { return d.id === id; });
    if (!disc) return;

    if (!confirm('Permanently delete "' + disc.name + '"?\nThis will also remove its history.')) return;

    disciplines = disciplines.filter(function (d) { return d.id !== id; });
    saveDisciplines(disciplines);

    Object.keys(records).forEach(function (dateKey) {
      delete records[dateKey][id];
    });
    saveRecords(records);

    renderManage();
  });

  // ── Add Discipline Modal ────────────────────

  var $addModal = document.getElementById('addModal');
  var $addTriggerBtn = document.getElementById('addTriggerBtn');
  var $modalClose = document.getElementById('modalClose');

  $addTriggerBtn.addEventListener('click', function () {
    $addInput.value = '';
    $addPoints.value = 5;
    document.querySelectorAll('.pts-preset').forEach(function (b) {
      b.classList.toggle('selected', b.dataset.pts === '5');
    });
    $addModal.classList.add('open');
    setTimeout(function () { $addInput.focus(); }, 100);
  });

  $modalClose.addEventListener('click', function () {
    $addModal.classList.remove('open');
  });

  $addModal.addEventListener('click', function (e) {
    if (e.target === $addModal) $addModal.classList.remove('open');
  });

  document.querySelectorAll('.pts-preset').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.pts-preset').forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      $addPoints.value = btn.dataset.pts;
    });
  });

  $addPoints.addEventListener('input', function () {
    document.querySelectorAll('.pts-preset').forEach(function (b) {
      b.classList.toggle('selected', b.dataset.pts === $addPoints.value);
    });
  });

  $addForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $addInput.value.trim();
    if (!name) {
      $addInput.focus();
      $addInput.style.borderColor = '#E07A5F';
      setTimeout(function () { $addInput.style.borderColor = ''; }, 1000);
      return;
    }

    var pts = parseInt($addPoints.value) || 5;
    if (pts < 1) pts = 1;
    if (pts > 50) pts = 50;

    disciplines.push({
      id: generateId(),
      name: name,
      points: pts,
      active: true,
      createdAt: getTodayKey(),
    });
    saveDisciplines(disciplines);

    $addModal.classList.remove('open');
    renderManage();
  });

  // ── Progress Ring ──────────────────────────

  var CIRCUMFERENCE = 2 * Math.PI * 52;

  function updateProgress() {
    var today = getTodayKey();
    var todayRecord = records[today] || {};
    var active = getActiveDisciplines();
    var total = active.length;
    var done = 0;

    active.forEach(function (d) {
      if (todayRecord[d.id]) done++;
    });

    $progressDone.textContent = done;
    $progressTotal.textContent = total;

    var pct = total === 0 ? 0 : done / total;
    var offset = CIRCUMFERENCE * (1 - pct);
    $progressCircle.style.strokeDashoffset = offset;
  }

  // ═══════════════════════════════════════════
  //  POINTS TAB
  // ═══════════════════════════════════════════

  function convertPoints(pts) {
    if (exchange.rate <= 0) return 0;
    return (pts / exchange.rate) * exchange.value;
  }

  function formatConverted(pts) {
    var converted = convertPoints(pts);
    var unit = exchange.unit || 'unit';
    var plural = converted !== 1 ? pluralize(unit) : unit;
    var display = converted % 1 === 0 ? String(converted) : converted.toFixed(2);
    return '= ' + display + ' ' + plural + ' to treat yourself';
  }

  function pluralize(word) {
    if (!word) return word;
    var lower = word.toLowerCase();
    if (lower.endsWith('s') || lower.endsWith('x') || lower.endsWith('sh') || lower.endsWith('ch')) return word + 'es';
    if (lower.endsWith('y') && !'aeiou'.includes(lower[lower.length - 2])) return word.slice(0, -1) + 'ies';
    return word + 's';
  }

  function calcTotalEarned() {
    var total = 0;
    var discMap = {};
    disciplines.forEach(function (d) { discMap[d.id] = d.points; });

    Object.keys(records).forEach(function (dateKey) {
      var dayRecord = records[dateKey];
      Object.keys(dayRecord).forEach(function (discId) {
        if (dayRecord[discId] && discMap[discId] !== undefined) {
          total += discMap[discId];
        }
      });
    });
    return total;
  }

  function calcTotalSpent() {
    var total = 0;
    rewards.forEach(function (r) { total += r.pointsSpent; });
    return total;
  }

  function calcDailyPointsForChart() {
    var discMap = {};
    disciplines.forEach(function (d) { discMap[d.id] = d.points; });

    var sortedDates = Object.keys(records).sort();
    if (sortedDates.length === 0) return [];

    var data = [];
    var cumulative = 0;
    sortedDates.forEach(function (dateKey) {
      var dayRecord = records[dateKey];
      var dayPts = 0;
      Object.keys(dayRecord).forEach(function (discId) {
        if (dayRecord[discId] && discMap[discId] !== undefined) {
          dayPts += discMap[discId];
        }
      });
      cumulative += dayPts;
      if (dayPts > 0 || data.length > 0) {
        data.push({ date: dateKey, cumulative: cumulative, daily: dayPts });
      }
    });
    return data;
  }

  // ── Render Points Tab ──────────────────────

  function renderPoints() {
    var earned = calcTotalEarned();
    var spent = calcTotalSpent();
    var balance = earned - spent;

    $pointsBalance.textContent = balance;
    $pointsConverted.textContent = formatConverted(balance);
    $pointsEarned.textContent = earned;
    $pointsSpent.textContent = spent;

    $exchangeRate.value = exchange.rate;
    $exchangeValue.value = exchange.value;
    $exchangeUnit.value = exchange.unit;

    renderChart();
    renderJournal();
  }

  // ── Canvas Line Chart ──────────────────────

  function renderChart() {
    var data = calcDailyPointsForChart();
    var ctx = $pointsChart.getContext('2d');
    var W = $pointsChart.width;
    var H = $pointsChart.height;

    ctx.clearRect(0, 0, W, H);

    if (data.length === 0) {
      $chartEmpty.style.display = 'block';
      return;
    }
    $chartEmpty.style.display = 'none';

    var padLeft = 44;
    var padRight = 16;
    var padTop = 16;
    var padBottom = 28;
    var chartW = W - padLeft - padRight;
    var chartH = H - padTop - padBottom;

    var maxVal = Math.max.apply(null, data.map(function (d) { return d.cumulative; }));
    if (maxVal === 0) maxVal = 10;
    var niceMax = Math.ceil(maxVal / 10) * 10;

    function xPos(i) { return padLeft + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW); }
    function yPos(v) { return padTop + chartH - (v / niceMax) * chartH; }

    // Grid lines
    ctx.strokeStyle = 'rgba(140,123,107,0.1)';
    ctx.lineWidth = 1;
    var gridSteps = 4;
    for (var g = 0; g <= gridSteps; g++) {
      var gy = padTop + (g / gridSteps) * chartH;
      ctx.beginPath();
      ctx.moveTo(padLeft, gy);
      ctx.lineTo(W - padRight, gy);
      ctx.stroke();

      var gridVal = Math.round(niceMax - (g / gridSteps) * niceMax);
      ctx.fillStyle = '#8C7B6B';
      ctx.font = '600 10px Nunito, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(gridVal, padLeft - 8, gy + 3);
    }

    // Filled area
    ctx.beginPath();
    ctx.moveTo(xPos(0), yPos(0));
    data.forEach(function (d, i) { ctx.lineTo(xPos(i), yPos(d.cumulative)); });
    ctx.lineTo(xPos(data.length - 1), yPos(0));
    ctx.closePath();

    var grad = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    grad.addColorStop(0, 'rgba(224,122,95,0.25)');
    grad.addColorStop(1, 'rgba(224,122,95,0.02)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach(function (d, i) {
      if (i === 0) ctx.moveTo(xPos(i), yPos(d.cumulative));
      else ctx.lineTo(xPos(i), yPos(d.cumulative));
    });
    ctx.strokeStyle = '#E07A5F';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Dots
    data.forEach(function (d, i) {
      ctx.beginPath();
      ctx.arc(xPos(i), yPos(d.cumulative), 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#E07A5F';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // X-axis labels (show a few evenly spaced)
    ctx.fillStyle = '#8C7B6B';
    ctx.font = '600 9px Nunito, sans-serif';
    ctx.textAlign = 'center';
    var labelCount = Math.min(data.length, 6);
    for (var li = 0; li < labelCount; li++) {
      var idx = labelCount === 1 ? 0 : Math.round(li / (labelCount - 1) * (data.length - 1));
      var lbl = formatShortDate(data[idx].date);
      ctx.fillText(lbl, xPos(idx), H - 6);
    }
  }

  // ── Image Upload ───────────────────────────

  $rewardImage.addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;
    resizeImage(file, 400, 0.6, function (dataUrl) {
      pendingImageData = dataUrl;
      $imagePreview.src = dataUrl;
      $imageUploadArea.style.display = 'none';
      $imagePreviewContainer.style.display = 'block';
      $rewardImage.style.display = 'none';
    });
  });

  $imageRemoveBtn.addEventListener('click', function () {
    clearImageUpload();
  });

  function clearImageUpload() {
    pendingImageData = null;
    $rewardImage.value = '';
    $imagePreview.src = '';
    $imageUploadArea.style.display = 'flex';
    $imagePreviewContainer.style.display = 'none';
    $rewardImage.style.display = '';
  }

  function resizeImage(file, maxWidth, quality, callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var w = img.width;
        var h = img.height;
        if (w > maxWidth) {
          h = Math.round(h * (maxWidth / w));
          w = maxWidth;
        }
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ── Reward Form Submit ─────────────────────

  $rewardForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var pts = parseInt($rewardPoints.value);
    var desc = $rewardDesc.value.trim();
    if (!pts || pts < 1) {
      alert('Please enter how many points to spend.');
      return;
    }
    if (!desc) {
      alert('Please describe your treat!');
      return;
    }

    var balance = calcTotalEarned() - calcTotalSpent();
    if (pts > balance) {
      alert('You only have ' + balance + ' points available. Keep going — you\'re almost there!');
      return;
    }

    rewards.push({
      id: generateId(),
      date: getTodayKey(),
      pointsSpent: pts,
      description: desc,
      image: pendingImageData || null,
    });
    saveRewards(rewards);

    $rewardPoints.value = '';
    $rewardDesc.value = '';
    clearImageUpload();

    renderPoints();
  });

  // ── Render Journal ─────────────────────────

  function renderJournal() {
    $rewardsJournal.innerHTML = '';

    if (rewards.length === 0) {
      $journalEmpty.style.display = 'block';
      return;
    }
    $journalEmpty.style.display = 'none';

    var sorted = rewards.slice().reverse();
    sorted.forEach(function (reward) {
      var entry = document.createElement('div');
      entry.className = 'reward-entry';

      var imageHtml = '';
      if (reward.image) {
        imageHtml = '<div class="reward-entry-image"><img src="' + reward.image + '" alt="Memory"></div>';
      }

      entry.innerHTML =
        '<div class="reward-entry-icon">🎁</div>' +
        '<div class="reward-entry-body">' +
          '<div class="reward-entry-header">' +
            '<span class="reward-entry-desc">' + escapeHtml(reward.description) + '</span>' +
            '<span class="reward-entry-pts">-' + reward.pointsSpent + ' ★</span>' +
          '</div>' +
          '<span class="reward-entry-date">' + formatDisplayDate(reward.date) + '</span>' +
          imageHtml +
        '</div>' +
        '<div class="reward-entry-actions">' +
          '<button class="reward-delete-btn" data-id="' + reward.id + '" title="Remove entry">✕</button>' +
        '</div>';

      $rewardsJournal.appendChild(entry);
    });
  }

  // ── Exchange Rate Settings ──────────────────

  function onExchangeChange() {
    var rate = parseInt($exchangeRate.value) || 100;
    var value = parseFloat($exchangeValue.value) || 1;
    var unit = $exchangeUnit.value.trim() || 'dollar';

    if (rate < 1) rate = 1;
    if (value < 0.01) value = 0.01;

    exchange = { rate: rate, value: value, unit: unit };
    saveExchange(exchange);

    var balance = calcTotalEarned() - calcTotalSpent();
    $pointsConverted.textContent = formatConverted(balance);
  }

  $exchangeRate.addEventListener('change', onExchangeChange);
  $exchangeValue.addEventListener('change', onExchangeChange);
  $exchangeUnit.addEventListener('input', onExchangeChange);

  // ── Delete Reward Entry ────────────────────

  $rewardsJournal.addEventListener('click', function (e) {
    var btn = e.target.closest('.reward-delete-btn');
    if (!btn) return;

    var id = btn.dataset.id;
    if (!confirm('Remove this journal entry? The points will be refunded.')) return;

    rewards = rewards.filter(function (r) { return r.id !== id; });
    saveRewards(rewards);
    renderPoints();
  });

  // ═══════════════════════════════════════════
  //  ANALYSIS TAB
  // ═══════════════════════════════════════════

  function getDateRange(range) {
    var dates = [];
    if (range === 'all') {
      var allDates = Object.keys(records).sort();
      if (allDates.length === 0) return [];
      var start = allDates[0];
      var current = start;
      while (current <= getTodayKey()) {
        dates.push(current);
        current = nextDay(current);
      }
      return dates;
    }
    var today = new Date();
    for (var i = range - 1; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(formatDateKey(d));
    }
    return dates;
  }

  function formatDateKey(d) {
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  }

  function nextDay(dateKey) {
    var parts = dateKey.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() + 1);
    return formatDateKey(d);
  }

  function renderAnalysis() {
    var dates = getDateRange(currentRange);
    var active = getActiveDisciplines();
    renderStats(dates, active);
    renderDisciplineRates(dates, active);
    renderHeatmap(dates, active);
  }

  function renderStats(dates, active) {
    if (active.length === 0 || dates.length === 0) {
      $statStreak.textContent = '0';
      $statAvg.textContent = '0%';
      $statPerfect.textContent = '0';
      return;
    }

    var streak = 0;
    var today = getTodayKey();
    var checkDate = today;
    while (true) {
      var dayRecord = records[checkDate] || {};
      var allDone = active.every(function (d) { return !!dayRecord[d.id]; });
      if (!allDone) break;
      streak++;
      checkDate = prevDay(checkDate);
    }

    var totalPct = 0;
    var countedDays = 0;
    var perfectDays = 0;

    dates.forEach(function (dateKey) {
      var dayRec = records[dateKey] || {};
      var done = 0;
      active.forEach(function (d) { if (dayRec[d.id]) done++; });
      var pct = done / active.length;
      totalPct += pct;
      countedDays++;
      if (pct === 1) perfectDays++;
    });

    var avg = countedDays > 0 ? Math.round((totalPct / countedDays) * 100) : 0;
    $statStreak.textContent = streak;
    $statAvg.textContent = avg + '%';
    $statPerfect.textContent = perfectDays;
  }

  function prevDay(dateKey) {
    var parts = dateKey.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() - 1);
    return formatDateKey(d);
  }

  function renderDisciplineRates(dates, active) {
    $disciplineRates.innerHTML = '';
    if (active.length === 0 || dates.length === 0) {
      $ratesEmpty.style.display = 'block';
      return;
    }
    $ratesEmpty.style.display = 'none';

    active.forEach(function (disc) {
      var done = 0;
      dates.forEach(function (dateKey) {
        var dayRec = records[dateKey] || {};
        if (dayRec[disc.id]) done++;
      });
      var pct = Math.round((done / dates.length) * 100);
      var row = document.createElement('div');
      row.className = 'rate-row';
      row.innerHTML =
        '<div class="rate-header">' +
          '<span class="rate-name">' + escapeHtml(disc.name) + '</span>' +
          '<span class="rate-pct">' + pct + '%</span>' +
        '</div>' +
        '<div class="rate-bar-bg">' +
          '<div class="rate-bar-fill" style="width:' + pct + '%"></div>' +
        '</div>';
      $disciplineRates.appendChild(row);
    });
  }

  function renderHeatmap(dates, active) {
    $heatmap.innerHTML = '';
    if (active.length === 0 || dates.length === 0) return;

    dates.forEach(function (dateKey) {
      var dayRec = records[dateKey] || {};
      var done = 0;
      active.forEach(function (d) { if (dayRec[d.id]) done++; });
      var pct = done / active.length;
      var opacity = pct === 0 ? 0.08 : 0.15 + pct * 0.85;

      var cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      cell.style.opacity = opacity;

      var shortDate = formatShortDate(dateKey);
      cell.innerHTML = '<span class="tooltip">' + shortDate + ': ' + Math.round(pct * 100) + '%</span>';
      $heatmap.appendChild(cell);
    });
  }

  function formatShortDate(dateKey) {
    var parts = dateKey.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // ── Initialize ─────────────────────────────

  renderToday();

})();
