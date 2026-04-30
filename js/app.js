// State Management
const student = { name: '', surname: '', classroom: '', rollno: 0 };
const scores = { s1: 0, s2: 0, s3: 0 };
let startTime = 0;
let timerInterval = null;
let currentPairColor = 0;
let userPairs = [];
let currentLeft = null;
let currentRight = null;
let isExamMode = false;
let practiceMatchesDone = 0;

let s3Q1Ans = 0;
let s3Q2Ans = 0;
let pracCurrentAns = 0;

// Initialize dynamic content on load
document.addEventListener('DOMContentLoaded', () => {
    renderTheory();
    renderExamples();
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
        let ans = (val * q.fromP) / q.toP;
        
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
    showScreen('practice-stage3-screen');
}

function generatePracticeQuestion() {
    let q = generateQuestionData();
    pracCurrentAns = q.ans;
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
    let userAns = parseFloat(inputVal);
    let diff = Math.abs(userAns - pracCurrentAns);
    let isCorrect = diff < 1e-8 || (diff / Math.abs(pracCurrentAns)) <= 1e-3;
    
    let feedbackEl = document.getElementById('prac-feedback');
    feedbackEl.classList.remove('hidden');
    
    let displayAns = Number(pracCurrentAns.toPrecision(10));
    
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

// Exam Timer
function startTimer() {
    document.getElementById('exam-timer').classList.remove('hidden');
    timerInterval = setInterval(() => {
        let elapsed = Math.floor((Date.now() - startTime) / 1000);
        let mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
        let secs = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('timer-display').innerText = `${mins}:${secs}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    document.getElementById('exam-timer').classList.add('hidden');
    return Math.floor((Date.now() - startTime) / 1000);
}

function calcTimeScore(seconds) {
    if (seconds <= 120) return 2.5;
    if (seconds <= 180) return 2;
    if (seconds <= 240) return 1.5;
    if (seconds <= 300) return 1;
    return 0.5;
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
    startTimer();
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
                if (practiceMatchesDone === 5) {
                    setTimeout(() => showModal('เก่งมาก!', 'จับคู่ถูกต้องครบถ้วน! กดปุ่ม "สุ่มโจทย์ใหม่" เพื่อซ้อมต่อได้เลย', 'success'), 800);
                }
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
        }
    }
}

function calculateMatchScore(correctData, maxScore) {
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
    let shuffledSI = shuffle([...siUnits]).slice(0, 5);
    let currentS1Data = [];
    let currentS1Answers = [];
    
    shuffledSI.forEach((item, index) => {
        let idLeft = 'l' + index;
        let idRight = 'r' + index;
        currentS1Data.push({ id: idLeft, text: item.name, matchId: idRight });
        currentS1Answers.push({ id: idRight, text: item.unit });
    });
    return { dataLeft: currentS1Data, dataRight: currentS1Answers };
}

function initStage1() { 
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
    showScreen('stage-1-screen');
}

function submitStage1() {
    if (userPairs.length < s1ActiveData.length) return showModal('แจ้งเตือน', 'จับคู่ให้ครบก่อนส่งคำตอบ', 'error');
    scores.s1 = calculateMatchScore(s1ActiveData, 2.5);
    showModal('เยี่ยมมาก!', `ไปต่อด่านที่ 2 กันเลย`, 'success');
    initStage2();
    showScreen('stage-2-screen');
}

// Stage 2
let s2ActiveData = [];

function generateStage2Data() {
    let shuffledPrefixes = shuffle([...prefixes]).slice(0, 5);
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
    showScreen('stage-2-screen');
}

function submitStage2() {
    if (userPairs.length < s2ActiveData.length) return showModal('แจ้งเตือน', 'จับคู่ให้ครบก่อนส่งคำตอบ', 'error');
    scores.s2 = calculateMatchScore(s2ActiveData, 2.5);
    showModal('เก่งมาก!', `เตรียมพบกับด่านสุดท้าย`, 'success');
    initStage3();
    showScreen('stage-3-screen');
}

// Stage 3
function initStage3() {
    let q1 = generateQuestionData();
    s3Q1Ans = q1.ans;
    document.getElementById('q1-text').innerHTML = q1.text;
    document.getElementById('q1-unit').innerText = q1.unitStr;
    document.getElementById('q1-ans').value = '';

    let q2 = generateQuestionData();
    while(q2.text === q1.text) { q2 = generateQuestionData(); }
    s3Q2Ans = q2.ans;
    document.getElementById('q2-text').innerHTML = q2.text;
    document.getElementById('q2-unit').innerText = q2.unitStr;
    document.getElementById('q2-ans').value = '';
}

function submitStage3() {
    let userQ1 = document.getElementById('q1-ans').value;
    let userQ2 = document.getElementById('q2-ans').value;

    if (userQ1 === '' || userQ2 === '') return showModal('แจ้งเตือน', 'เติมตัวเลขคำตอบให้ครบ 2 ข้อ', 'error');

    scores.s3 = 0;
    let diffQ1 = Math.abs(parseFloat(userQ1) - s3Q1Ans);
    let diffQ2 = Math.abs(parseFloat(userQ2) - s3Q2Ans);
    if (diffQ1 < 1e-8 || (diffQ1 / Math.abs(s3Q1Ans)) <= 1e-3) scores.s3 += 1.25;
    if (diffQ2 < 1e-8 || (diffQ2 / Math.abs(s3Q2Ans)) <= 1e-3) scores.s3 += 1.25;

    showFinalResult();
}

function showFinalResult() {
    let elapsedSecs = stopTimer();
    let rawTimeScore = calcTimeScore(elapsedSecs);
    
    let contentScore = scores.s1 + scores.s2 + scores.s3;
    let accuracy = contentScore / 7.5; // Max score from content is 7.5
    let finalTimeScore = rawTimeScore * accuracy; // Scale time score by accuracy
    
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

    let total = contentScore + finalTimeScore;
    document.getElementById('res-total').innerText = Number(total.toFixed(2)).toString();

    showScreen('result-screen');
}

function resetGame() {
    document.getElementById('student-form').reset();
    scores.s1 = 0; scores.s2 = 0; scores.s3 = 0;
    showScreen('menu-screen');
}
