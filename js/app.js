// State Management
const student = { name: '', surname: '', classroom: '', rollno: 0 };
const scores = { s1: 0, s2: 0, s3: 0 };
const EXAM_DURATION_SECS = 5 * 60;
let startTime = 0;
let timerInterval = null;
let currentElapsedSecs = 0;
let currentRemainingSecs = EXAM_DURATION_SECS;
let currentPairColor = 0;
let userPairs = [];
let currentLeft = null;
let currentRight = null;
let isExamMode = false;
let isResultShown = false;
let practiceMatchesDone = 0;

let pracCurrentAns = 0;
let pracCurrentAnsText = '0';
let s3Questions = [];
let stageMaxScores = { s1: 2.5, s2: 2.5, s3: 2.5 };

// Initialize dynamic content on load
document.addEventListener('DOMContentLoaded', () => {
    renderTheory();
    renderExamples();
    setLiveScoreVisibility(false);
    resetLiveScorePanel();
    updateLiveScore();
});

// Utility
function showScreen(screenId) {
    document.querySelectorAll('#app > div > div[id$="-screen"]').forEach(el => el.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function formatPlainNumber(value) {
    if (!Number.isFinite(value)) return '';
    if (value === 0) return '0';

    const cleaned = Number(value.toPrecision(14));
    const formattedFromPrecision = cleaned.toPrecision(14).replace(/\.?0+$/, '');
    let formatted = formattedFromPrecision.includes('e')
        ? cleaned.toLocaleString('en-US', {
            useGrouping: false,
            maximumFractionDigits: 20
        })
        : formattedFromPrecision;

    if (formatted.includes('.')) {
        formatted = formatted.replace(/\.?0+$/, '');
    }

    return formatted === '-0' ? '0' : formatted;
}

function isPlainDecimalInput(value) {
    return /^[+-]?(?:\d+(\.\d+)?|\.\d+)$/.test(value.trim());
}

function isAnswerCorrect(userInput, correctAnswer) {
    const trimmed = userInput.trim();
    if (!isPlainDecimalInput(trimmed)) return false;

    const userAns = Number(trimmed);
    if (!Number.isFinite(userAns)) return false;

    const diff = Math.abs(userAns - correctAnswer);
    const tolerance = Math.max(1e-10, Math.abs(correctAnswer) * 1e-3);
    return diff <= tolerance;
}

// Modals
function showModal(title, msg, type = "info") {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    const icon = document.getElementById('modal-icon');
    const titleEl = document.getElementById('modal-title');
    
    titleEl.innerText = title;
    document.getElementById('modal-msg').innerHTML = msg;
    
    if (type === 'error') {
        titleEl.className = "text-2xl font-black mb-3 text-rose-600";
        icon.innerHTML = '<i class="fas fa-exclamation-circle text-rose-500"></i>';
    } else if (type === 'success') {
        titleEl.className = "text-2xl font-black mb-3 text-emerald-600";
        icon.innerHTML = '<i class="fas fa-check-circle text-emerald-500"></i>';
    } else {
        titleEl.className = "text-2xl font-black mb-3 text-indigo-600";
        icon.innerHTML = '<i class="fas fa-info-circle text-indigo-500"></i>';
    }
    
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    content.classList.remove('scale-95', 'opacity-0');
    content.classList.add('scale-100', 'opacity-100');
}

function closeModal() {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}

// Render Theory and Examples
function renderTheory() {
    const siContainer = document.getElementById('si-units-container');
    siContainer.innerHTML = '';
    siUnits.forEach(item => {
        siContainer.innerHTML += `<div class="bg-blue-50 p-4 rounded-2xl flex justify-between items-center border border-blue-100">
            <span>${item.name}</span>
            <span class="font-bold text-blue-700 bg-white px-3 py-1 rounded-lg shadow-sm">${item.unit}</span>
        </div>`;
    });

    const prefixContainer = document.getElementById('prefixes-container');
    prefixContainer.innerHTML = '';
    prefixes.forEach(item => {
        prefixContainer.innerHTML += `<div class="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex flex-col justify-center items-center">
            <div class="text-slate-600 mb-1 font-medium">${item.name}</div>
            <div class="text-xl font-bold text-purple-700">${item.value}</div>
        </div>`;
    });
}

function renderExamples() {
    const container = document.getElementById('examples-container');
    container.innerHTML = '';
    conversionTypes.forEach((q, i) => {
        let val = (['kg', 'km', 'm', 'MW', 'GW'].includes(q.from)) ? 5 : 50;
        let ans = formatPlainNumber((val * q.fromP) / q.toP);
        
        let fromPStr = formatPower(q.fromP);
        let toPStr = formatPower(q.toP);
        
        container.innerHTML += `
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
            <h4 class="font-bold text-lg text-slate-800 mb-4 flex items-center">
                <span class="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">${i+1}</span>
                แปลง ${val} ${q.from} เป็น ${q.to}
            </h4>
            <ul class="space-y-3 text-slate-600 font-medium">
                <li class="flex justify-between border-b border-slate-200 pb-2"><span>ค่าเดิม</span> <span class="text-slate-800 font-bold">${val}</span></li>
                <li class="flex justify-between border-b border-slate-200 pb-2"><span>อุปสรรคเดิม (${q.from})</span> <span class="text-slate-800">${fromPStr}</span></li>
                <li class="flex justify-between border-b border-slate-200 pb-2"><span>อุปสรรคใหม่ (${q.to})</span> <span class="text-slate-800">${toPStr}</span></li>
                <li class="pt-2 text-lg bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <span class="text-sm text-slate-500 block mb-1">วิธีทำ: (${val} &times; ${fromPStr}) &divide; ${toPStr}</span>
                    <span class="font-bold text-emerald-600">คำตอบ = ${ans} ${q.to}</span>
                </li>
            </ul>
        </div>`;
    });
}

// Practice Mode
function initPracticeStage3() {
    isExamMode = false;
    generatePracticeQuestion();
    updateLiveScore();
    showScreen('practice-stage3-screen');
}

function generatePracticeQuestion() {
    let q = generateQuestionData();
    pracCurrentAns = q.ans;
    pracCurrentAnsText = q.ansText || formatPlainNumber(q.ans);
    document.getElementById('prac-q-text').innerHTML = q.text;
    document.getElementById('prac-ans-input').value = '';
    document.getElementById('prac-feedback').classList.add('hidden');
    document.getElementById('prac-ans-input').focus();
}

function checkPracticeAnswer() {
    let inputVal = document.getElementById('prac-ans-input').value;
    if (inputVal === '') {
        showModal('แจ้งเตือน', 'กรุณาเติมตัวเลขคำตอบ', 'error');
        return;
    }
    const trimmed = inputVal.trim();
    if (!isPlainDecimalInput(trimmed)) {
        showModal('รูปแบบคำตอบไม่ถูกต้อง', 'ให้พิมพ์เป็นเลขปกติล้วนๆ เช่น 0.000001 หรือ 1000000 (ห้ามใช้ e, ×10^, หน่วย, ลูกน้ำ)', 'error');
        return;
    }
    let isCorrect = isAnswerCorrect(trimmed, pracCurrentAns);
    
    let feedbackEl = document.getElementById('prac-feedback');
    feedbackEl.classList.remove('hidden');
    
    let displayAns = pracCurrentAnsText;
    
    if (isCorrect) {
        feedbackEl.className = 'mt-6 p-6 rounded-2xl text-xl animate-[fadeIn_0.3s_ease-out] bg-emerald-50 text-emerald-800 font-bold border-2 border-emerald-200';
        feedbackEl.innerHTML = `<i class="fas fa-check-circle mr-3 text-2xl text-emerald-500"></i> ถูกต้อง! ยอดเยี่ยมมาก คำตอบคือ ${displayAns}`;
        playCuteEffect();
    } else {
        feedbackEl.className = 'mt-6 p-6 rounded-2xl text-xl animate-[fadeIn_0.3s_ease-out] bg-rose-50 text-rose-800 font-bold border-2 border-rose-200';
        feedbackEl.innerHTML = `<i class="fas fa-times-circle mr-3 text-2xl text-rose-500"></i> ยังไม่ถูกนะ คำตอบที่ถูกคือ <span class="text-rose-600">${displayAns}</span>`;
    }
}

// Visual Effects
function playCuteEffect() {
    const emojis = ['🎉', '✨', '🌟', '💖', '👍', '🎊', '🎈'];
    for(let i=0; i<15; i++) {
        let el = document.createElement('div');
        el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.position = 'fixed';
        el.style.left = (Math.random() * 100) + 'vw';
        el.style.top = '100vh';
        el.style.fontSize = (Math.random() * 20 + 20) + 'px';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '9999';
        el.style.transition = 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
        document.body.appendChild(el);
        
        setTimeout(() => {
            el.style.top = (Math.random() * 60) + 'vh';
            el.style.opacity = '0';
            let rotation = (Math.random() - 0.5) * 360;
            el.style.transform = `rotate(${rotation}deg) scale(1.5)`;
        }, 50);
        
        setTimeout(() => { el.remove(); }, 1500);
    }
}

// Exam Countdown Timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    currentElapsedSecs = 0;
    currentRemainingSecs = EXAM_DURATION_SECS;
    document.getElementById('exam-timer').classList.remove('hidden');
    const tick = () => {
        currentElapsedSecs = Math.min(Math.floor((Date.now() - startTime) / 1000), EXAM_DURATION_SECS);
        currentRemainingSecs = Math.max(EXAM_DURATION_SECS - currentElapsedSecs, 0);
        let mins = Math.floor(currentRemainingSecs / 60).toString().padStart(2, '0');
        let secs = (currentRemainingSecs % 60).toString().padStart(2, '0');
        document.getElementById('timer-display').innerText = `${mins}:${secs}`;
        updateLiveScore();

        if (currentRemainingSecs <= 0) {
            handleExamTimeout();
        }
    };
    tick();
    timerInterval = setInterval(tick, 250);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById('exam-timer').classList.add('hidden');
    currentElapsedSecs = Math.min(Math.floor((Date.now() - startTime) / 1000), EXAM_DURATION_SECS);
    currentRemainingSecs = Math.max(EXAM_DURATION_SECS - currentElapsedSecs, 0);
    updateLiveScore();
    return currentElapsedSecs;
}

function calcTimeScore(seconds) {
    return seconds <= EXAM_DURATION_SECS ? 2.5 : 0;
}

function handleExamTimeout() {
    if (!isExamMode || isResultShown) return;
    showFinalResult();
}

// Exam Logic
function startExam(e) {
    e.preventDefault();
    isExamMode = true;
    student.name = document.getElementById('fname').value;
    student.surname = document.getElementById('lname').value;
    student.classroom = document.getElementById('classroom').value;
    student.rollno = parseInt(document.getElementById('rollno').value);

    startTime = Date.now();
    scores.s1 = 0; scores.s2 = 0; scores.s3 = 0;
    isResultShown = false;
    resetLiveScorePanel();
    setLiveScoreVisibility(true);
    startTimer();
    updateLiveScore();
    initStage1();
    showScreen('stage-1-screen');
}

// Matching Logic (Reusable)
function createMatchingUI(leftId, rightId, leftData, rightData, stageNum) {
    const leftContainer = document.getElementById(leftId);
    const rightContainer = document.getElementById(rightId);
    leftContainer.innerHTML = '';
    rightContainer.innerHTML = '';
    userPairs = [];
    currentLeft = null;
    currentRight = null;
    currentPairColor = 0;

    const createBtn = (item, side) => {
        let btn = document.createElement('button');
        btn.className = 'match-btn w-full bg-white border-2 border-slate-200 text-slate-700 py-4 px-5 rounded-2xl hover:bg-slate-50 text-lg font-bold shadow-sm transition-all hover:border-blue-300 ' + (side === 'left' ? 'text-left' : 'text-center');
        btn.innerHTML = item.text;
        btn.dataset.id = item.id;
        btn.dataset.side = side;
        btn.onclick = () => handleMatchClick(btn, stageNum);
        return btn;
    };

    let shuffledLeft = shuffle([...leftData]);
    let shuffledRight = shuffle([...rightData]);
    shuffledLeft.forEach(item => leftContainer.appendChild(createBtn(item, 'left')));
    shuffledRight.forEach(item => rightContainer.appendChild(createBtn(item, 'right')));
}

function handleMatchClick(btn, stageNum) {
    if (btn.classList.contains('matched') || btn.disabled) {
        if (isExamMode) {
            let pairId = btn.dataset.pairId;
            document.querySelectorAll(`.matched[data-pair-id="${pairId}"]`).forEach(el => {
                el.className = 'match-btn w-full bg-white border-2 border-slate-200 text-slate-700 py-4 px-5 rounded-2xl hover:bg-slate-50 text-lg font-bold shadow-sm transition-all hover:border-blue-300 ' + (el.dataset.side === 'left' ? 'text-left' : 'text-center');
                el.removeAttribute('data-pair-id');
            });
            userPairs = userPairs.filter(p => p.id !== pairId);
        }
        return;
    }

    const side = btn.dataset.side;
    if (side === 'left') {
        if (currentLeft) currentLeft.classList.remove('selected', 'border-blue-500', 'bg-blue-50');
        currentLeft = btn;
        btn.classList.add('selected', 'border-blue-500', 'bg-blue-50');
    } else {
        if (currentRight) currentRight.classList.remove('selected', 'border-blue-500', 'bg-blue-50');
        currentRight = btn;
        btn.classList.add('selected', 'border-blue-500', 'bg-blue-50');
    }

    if (currentLeft && currentRight) {
        if (!isExamMode) {
            let activeData = stageNum === 1 ? s1ActiveData : s2ActiveData;
            let leftItem = activeData.find(item => item.id === currentLeft.dataset.id);
            if (leftItem && leftItem.matchId === currentRight.dataset.id) {
                currentLeft.className = 'match-btn w-full bg-emerald-500 text-white border-2 border-emerald-600 py-4 px-5 rounded-2xl text-lg font-bold shadow-md';
                currentRight.className = 'match-btn w-full bg-emerald-500 text-white border-2 border-emerald-600 py-4 px-5 rounded-2xl text-lg font-bold shadow-md';
                currentLeft.disabled = true;
                currentRight.disabled = true;
                playCuteEffect();
                currentLeft = null;
                currentRight = null;
                practiceMatchesDone++;
                if (practiceMatchesDone === activeData.length) {
                    setTimeout(() => showModal('เก่งมาก!', 'จับคู่ถูกต้องครบถ้วน! กดปุ่ม "สุ่มโจทย์ใหม่" เพื่อซ้อมต่อได้เลย', 'success'), 800);
                }
                updateLiveScore();
            } else {
                currentLeft.classList.add('bg-rose-500', 'text-white', 'border-rose-600');
                currentRight.classList.add('bg-rose-500', 'text-white', 'border-rose-600');
                currentLeft.style.transform = 'translateX(-10px)';
                currentRight.style.transform = 'translateX(10px)';
                
                let lBtn = currentLeft;
                let rBtn = currentRight;
                setTimeout(() => {
                    lBtn.style.transform = '';
                    rBtn.style.transform = '';
                    lBtn.classList.remove('bg-rose-500', 'text-white', 'border-rose-600', 'selected', 'border-blue-500', 'bg-blue-50');
                    rBtn.classList.remove('bg-rose-500', 'text-white', 'border-rose-600', 'selected', 'border-blue-500', 'bg-blue-50');
                }, 400);
                
                currentLeft = null;
                currentRight = null;
            }
        } else {
            let pairId = 'pair_' + Date.now();
            let colorClass = 'pair-' + (currentPairColor % 5);
            currentPairColor++;

            currentLeft.classList.remove('selected', 'border-blue-500', 'bg-blue-50', 'bg-white', 'text-slate-700', 'border-slate-200');
            currentRight.classList.remove('selected', 'border-blue-500', 'bg-blue-50', 'bg-white', 'text-slate-700', 'border-slate-200');
            currentLeft.classList.add('matched', colorClass);
            currentRight.classList.add('matched', colorClass);
            currentLeft.dataset.pairId = pairId;
            currentRight.dataset.pairId = pairId;

            userPairs.push({ id: pairId, leftId: currentLeft.dataset.id, rightId: currentRight.dataset.id });
            currentLeft = null;
            currentRight = null;
            updateLiveScore();
        }
    }
}

function calculateMatchScore(correctData, maxScore) {
    if (!correctData || !correctData.length) return 0;
    let correctCount = 0;
    userPairs.forEach(pair => {
        let leftItem = correctData.find(item => item.id === pair.leftId);
        if (leftItem && leftItem.matchId === pair.rightId) correctCount++;
    });
    return correctCount * (maxScore / correctData.length);
}

// Stage 1
let s1ActiveData = [];

function generateStage1Data() {
    let shuffledSI = shuffle([...siUnits]);
    let currentS1Data = [];
    let currentS1Answers = [];
    const distractorUnits = [
        'นิวตัน (N)', 'จูล (J)', 'วัตต์ (W)', 'โวลต์ (V)',
        'เฮิรตซ์ (Hz)', 'ปาสกาล (Pa)'
    ];
    
    shuffledSI.forEach((item, index) => {
        let idLeft = 'l' + index;
        let idRight = 'r' + index;
        currentS1Data.push({ id: idLeft, text: item.name, matchId: idRight });
        currentS1Answers.push({ id: idRight, text: item.unit });
    });
    shuffle(distractorUnits).slice(0, 3).forEach((unit, idx) => {
        currentS1Answers.push({ id: 'd' + idx, text: unit });
    });
    return { dataLeft: currentS1Data, dataRight: currentS1Answers };
}

function initStage1() { 
    document.getElementById('s1-title').innerText = "ด่านที่ 1: จับคู่หน่วยฐาน SI";
    document.getElementById('s1-desc').innerHTML = 'คลิกเลือก "ปริมาณ" และ "หน่วย" ให้ถูกต้องตรงกัน';
    document.getElementById('s1-score-badge').classList.remove('hidden');
    document.getElementById('s1-submit-btn').classList.remove('hidden');
    document.getElementById('s1-back-btn').classList.add('hidden');
    document.getElementById('s1-random-btn').classList.add('hidden');
    let generated = generateStage1Data();
    s1ActiveData = generated.dataLeft;
    createMatchingUI('s1-left', 's1-right', generated.dataLeft, generated.dataRight, 1); 
}

function initPracticeStage1() {
    isExamMode = false;
    practiceMatchesDone = 0;
    document.getElementById('s1-title').innerText = "สนามซ้อม: จับคู่หน่วยฐาน SI";
    document.getElementById('s1-desc').innerHTML = "จับคู่ให้ถูกต้อง (<b>มีเฉลยทันที</b> ตอบผิดจะเด้งกลับ ตอบถูกจะมีเอฟเฟกต์)";
    document.getElementById('s1-score-badge').classList.add('hidden');
    document.getElementById('s1-submit-btn').classList.add('hidden');
    document.getElementById('s1-back-btn').classList.remove('hidden');
    document.getElementById('s1-random-btn').classList.remove('hidden');
    
    let generated = generateStage1Data();
    s1ActiveData = generated.dataLeft;
    createMatchingUI('s1-left', 's1-right', generated.dataLeft, generated.dataRight, 1);
    updateLiveScore();
    showScreen('stage-1-screen');
}

function submitStage1() {
    if (isResultShown) return;
    if (userPairs.length < s1ActiveData.length) return showModal('แจ้งเตือน', 'จับคู่ให้ครบก่อนส่งคำตอบ', 'error');
    scores.s1 = calculateMatchScore(s1ActiveData, stageMaxScores.s1);
    updateLiveScore();
    showModal('เยี่ยมมาก!', `ไปต่อด่านที่ 2 กันเลย`, 'success');
    initStage2();
    showScreen('stage-2-screen');
}

// Stage 2
let s2ActiveData = [];

function generateStage2Data() {
    let shuffledPrefixes = shuffle([...prefixes]);
    let currentS2Data = [];
    let currentS2Answers = [];
    
    shuffledPrefixes.forEach((item, index) => {
        let idLeft = 'p' + index;
        let idRight = 'a' + index;
        currentS2Data.push({ id: idLeft, text: item.name, matchId: idRight });
        currentS2Answers.push({ id: idRight, text: item.value });
    });
    return { dataLeft: currentS2Data, dataRight: currentS2Answers };
}

function initStage2() { 
    document.getElementById('s2-title').innerText = "ด่านที่ 2: จับคู่คำอุปสรรค";
    document.getElementById('s2-desc').innerHTML = "จับคู่ชื่อคำอุปสรรค กับ ตัวเลขพหุคูณให้ถูกต้อง";
    document.getElementById('s2-score-badge').classList.remove('hidden');
    document.getElementById('s2-submit-btn').classList.remove('hidden');
    document.getElementById('s2-back-btn').classList.add('hidden');
    document.getElementById('s2-random-btn').classList.add('hidden');
    let generated = generateStage2Data();
    s2ActiveData = generated.dataLeft;
    createMatchingUI('s2-left', 's2-right', generated.dataLeft, generated.dataRight, 2); 
}

function initPracticeStage2() {
    isExamMode = false;
    practiceMatchesDone = 0;
    document.getElementById('s2-title').innerText = "สนามซ้อม: จับคู่คำอุปสรรค";
    document.getElementById('s2-desc').innerHTML = "จับคู่ให้ถูกต้อง (<b>มีเฉลยทันที</b> ตอบผิดจะเด้งกลับ ตอบถูกจะมีเอฟเฟกต์)";
    document.getElementById('s2-score-badge').classList.add('hidden');
    document.getElementById('s2-submit-btn').classList.add('hidden');
    document.getElementById('s2-back-btn').classList.remove('hidden');
    document.getElementById('s2-random-btn').classList.remove('hidden');
    
    let generated = generateStage2Data();
    s2ActiveData = generated.dataLeft;
    createMatchingUI('s2-left', 's2-right', generated.dataLeft, generated.dataRight, 2);
    updateLiveScore();
    showScreen('stage-2-screen');
}

function submitStage2() {
    if (isResultShown) return;
    if (userPairs.length < s2ActiveData.length) return showModal('แจ้งเตือน', 'จับคู่ให้ครบก่อนส่งคำตอบ', 'error');
    scores.s2 = calculateMatchScore(s2ActiveData, stageMaxScores.s2);
    updateLiveScore();
    showModal('เก่งมาก!', `เตรียมพบกับด่านสุดท้าย`, 'success');
    initStage3();
    showScreen('stage-3-screen');
}

// Stage 3
function initStage3() {
    const wrap = document.getElementById('stage3-questions');
    wrap.innerHTML = '';
    s3Questions = [];
    const qCount = 4;
    const selectedTypes = shuffle([...conversionTypes]).slice(0, qCount);
    s3Questions = selectedTypes.map((qType, idx) => generateQuestionDataWithRoll(student.rollno, idx + 1, qType));

    s3Questions.forEach((q, idx) => {
        const qNo = idx + 1;
        wrap.innerHTML += `
        <div class="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-100 shadow-md">
            <div class="flex items-start">
                <div class="bg-slate-100 text-slate-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4 shrink-0">${qNo}</div>
                <div class="w-full">
                    <p class="text-xl sm:text-2xl font-medium text-slate-800 mb-6">${q.text}</p>
                    <div class="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                        <span class="font-bold text-slate-500">ตอบ:</span>
                        <input type="text" inputmode="decimal" autocomplete="off" id="q${qNo}-ans" oninput="updateLiveScore()"
                            class="w-full sm:w-64 px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:outline-none focus:border-pink-500 text-center font-bold text-pink-700 transition-all"
                            placeholder="เช่น 0.000001 หรือ 1000000">
                        <span class="font-bold text-slate-600 text-xl w-12">${q.unitStr}</span>
                    </div>
                </div>
            </div>
        </div>`;
    });
    updateLiveScore();
}

function submitStage3() {
    if (isResultShown) return;
    const inputs = s3Questions.map((_, idx) => document.getElementById(`q${idx + 1}-ans`).value);
    if (inputs.some(v => v === '')) return showModal('แจ้งเตือน', `เติมตัวเลขคำตอบให้ครบ ${s3Questions.length} ข้อ`, 'error');
    const invalid = inputs.some(v => !isPlainDecimalInput(v));
    if (invalid) {
        return showModal('รูปแบบคำตอบไม่ถูกต้อง', 'ด่าน 3 ต้องพิมพ์เลขปกติล้วนๆ เช่น 0.000001 หรือ 1000000 (ห้ามใช้ e, ×10^, หน่วย, ลูกน้ำ)', 'error');
    }
    scores.s3 = 0;
    const eachScore = stageMaxScores.s3 / s3Questions.length;
    s3Questions.forEach((q, idx) => {
        if (isAnswerCorrect(inputs[idx], q.ans)) scores.s3 += eachScore;
    });
    updateLiveScore();

    showFinalResult();
}

function calculateStage3Score(allowPartial = false) {
    if (!s3Questions.length) return 0;
    const inputs = s3Questions.map((_, idx) => document.getElementById(`q${idx + 1}-ans`)?.value || '');
    const eachScore = stageMaxScores.s3 / s3Questions.length;
    let total = 0;

    s3Questions.forEach((q, idx) => {
        const raw = inputs[idx].trim();
        if (raw === '') return;
        if (allowPartial && !isPlainDecimalInput(raw)) return;
        if (isAnswerCorrect(raw, q.ans)) total += eachScore;
    });

    return total;
}

function finalizeCurrentScores() {
    if (s1ActiveData.length && scores.s1 === 0) {
        scores.s1 = calculateMatchScore(s1ActiveData, stageMaxScores.s1);
    }

    if (s2ActiveData.length && scores.s2 === 0) {
        scores.s2 = calculateMatchScore(s2ActiveData, stageMaxScores.s2);
    }

    scores.s3 = calculateStage3Score(true);
}

function showFinalResult() {
    if (isResultShown) return;
    isResultShown = true;
    finalizeCurrentScores();
    let elapsedSecs = stopTimer();
    let rawTimeScore = calcTimeScore(elapsedSecs);
    
    let contentScore = scores.s1 + scores.s2 + scores.s3;
    let accuracy = contentScore / 7.5; // Max score from content is 7.5
    // Anti-random rule: if content is zero, time score must be zero.
    let finalTimeScore = contentScore > 0 ? (rawTimeScore * accuracy) : 0;
    
    document.getElementById('res-name').innerText = `${student.name} ${student.surname}`;
    document.getElementById('res-class').innerText = student.classroom;
    document.getElementById('res-roll').innerText = student.rollno;
    document.getElementById('res-s1').innerText = scores.s1.toString();
    document.getElementById('res-s2').innerText = scores.s2.toString();
    document.getElementById('res-s3').innerText = scores.s3.toString();

    let mins = Math.floor(elapsedSecs / 60);
    let secs = elapsedSecs % 60;
    document.getElementById('res-time-text').innerText = `${mins}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('res-time').innerText = Number(finalTimeScore.toFixed(2)).toString();

    let total = contentScore > 0 ? (contentScore + finalTimeScore) : 0;
    document.getElementById('res-total').innerText = Number(total.toFixed(2)).toString();

    document.getElementById('modal')?.classList.add('hidden');
    isExamMode = false;
    setLiveScoreVisibility(false);
    resetLiveScorePanel();
    showScreen('result-screen');
}

function resetGame() {
    document.getElementById('student-form').reset();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    currentElapsedSecs = 0;
    currentRemainingSecs = EXAM_DURATION_SECS;
    document.getElementById('exam-timer').classList.add('hidden');
    document.getElementById('timer-display').innerText = '05:00';
    scores.s1 = 0; scores.s2 = 0; scores.s3 = 0;
    isExamMode = false;
    isResultShown = false;
    setLiveScoreVisibility(false);
    resetLiveScorePanel();
    updateLiveScore();
    showScreen('menu-screen');
}

function setLiveScoreVisibility(show) {
    const panel = document.getElementById('live-score-panel');
    if (!panel) return;
    panel.classList.toggle('hidden', !show);
}

function resetLiveScorePanel() {
    const liveContent = document.getElementById('live-content-score');
    const liveTime = document.getElementById('live-time-score');
    const liveTotal = document.getElementById('live-total-score');
    if (liveContent) liveContent.innerText = '0.00';
    if (liveTime) liveTime.innerText = '0.00';
    if (liveTotal) liveTotal.innerText = '0.00';
}

function calculateLiveStage3Score() {
    if (!s3Questions.length) return 0;
    let live = 0;
    const eachScore = stageMaxScores.s3 / s3Questions.length;
    s3Questions.forEach((q, idx) => {
        const input = document.getElementById(`q${idx + 1}-ans`);
        if (!input || input.value === '') return;
        if (!isPlainDecimalInput(input.value)) return;
        if (isAnswerCorrect(input.value, q.ans)) live += eachScore;
    });
    return live;
}

function updateLiveScore() {
    const liveS1 = calculateMatchScore(s1ActiveData, stageMaxScores.s1);
    const liveS2 = calculateMatchScore(s2ActiveData, stageMaxScores.s2);
    const liveS3 = calculateLiveStage3Score();
    const content = Math.min(stageMaxScores.s1, scores.s1 > 0 ? scores.s1 : liveS1)
        + Math.min(stageMaxScores.s2, scores.s2 > 0 ? scores.s2 : liveS2)
        + Math.min(stageMaxScores.s3, scores.s3 > 0 ? scores.s3 : liveS3);
    const tScoreRaw = isExamMode ? calcTimeScore(currentElapsedSecs) : 0;
    const accuracy = content / 7.5;
    const timeScaled = (isExamMode && content > 0) ? (tScoreRaw * accuracy) : 0;
    const total = content > 0 ? (content + timeScaled) : 0;

    const liveContent = document.getElementById('live-content-score');
    const liveTime = document.getElementById('live-time-score');
    const liveTotal = document.getElementById('live-total-score');
    if (liveContent) liveContent.innerText = content.toFixed(2);
    if (liveTime) liveTime.innerText = timeScaled.toFixed(2);
    if (liveTotal) liveTotal.innerText = total.toFixed(2);
}
