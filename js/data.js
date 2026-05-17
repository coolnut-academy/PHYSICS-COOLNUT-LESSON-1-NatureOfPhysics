const siUnits = [
    { name: 'ความยาว (Length)', unit: 'เมตร (m)' },
    { name: 'มวล (Mass)', unit: 'กิโลกรัม (kg)' },
    { name: 'เวลา (Time)', unit: 'วินาที (s)' },
    { name: 'กระแสไฟฟ้า (Electric Current)', unit: 'แอมแปร์ (A)' },
    { name: 'อุณหภูมิอุณหพลวัติ (Thermodynamic Temp.)', unit: 'เคลวิน (K)' },
    { name: 'ปริมาณสาร (Amount of substance)', unit: 'โมล (mol)' },
    { name: 'ความเข้มของการส่องสว่าง (Luminous intensity)', unit: 'แคนเดลา (cd)' }
];

const prefixes = [
    { name: 'เทระ (Tera, T)', value: '10<sup>12</sup>' },
    { name: 'จิกะ (Giga, G)', value: '10<sup>9</sup>' },
    { name: 'เมกะ (Mega, M)', value: '10<sup>6</sup>' },
    { name: 'กิโล (kilo, k)', value: '10<sup>3</sup>' },
    { name: 'เฮกโต (hecto, h)', value: '10<sup>2</sup>' },
    { name: 'เดคา (deka, da)', value: '10<sup>1</sup>' },
    { name: 'เดซิ (deci, d)', value: '10<sup>-1</sup>' },
    { name: 'เซนติ (centi, c)', value: '10<sup>-2</sup>' },
    { name: 'มิลลิ (milli, m)', value: '10<sup>-3</sup>' },
    { name: 'ไมโคร (micro, &mu;)', value: '10<sup>-6</sup>' },
    { name: 'นาโน (nano, n)', value: '10<sup>-9</sup>' },
    { name: 'พิโก (pico, p)', value: '10<sup>-12</sup>' }
];

const conversionTypes = [
    { id: 1, type: 'length', from: 'km', to: 'm', fromP: 1e3, toP: 1, text: "แปลงจาก กิโลเมตร (km) เป็น เมตร (m)" },
    { id: 2, type: 'length', from: 'm', to: 'km', fromP: 1, toP: 1e3, text: "แปลงจาก เมตร (m) เป็น กิโลเมตร (km)" },
    { id: 3, type: 'length', from: 'cm', to: 'm', fromP: 1e-2, toP: 1, text: "แปลงจาก เซนติเมตร (cm) เป็น เมตร (m)" },
    { id: 4, type: 'length', from: 'm', to: 'cm', fromP: 1, toP: 1e-2, text: "แปลงจาก เมตร (m) เป็น เซนติเมตร (cm)" },
    { id: 5, type: 'length', from: 'mm', to: 'm', fromP: 1e-3, toP: 1, text: "แปลงจาก มิลลิเมตร (mm) เป็น เมตร (m)" },
    { id: 6, type: 'length', from: 'm', to: 'mm', fromP: 1, toP: 1e-3, text: "แปลงจาก เมตร (m) เป็น มิลลิเมตร (mm)" },
    { id: 7, type: 'length', from: '&mu;m', to: 'm', fromP: 1e-6, toP: 1, text: "แปลงจาก ไมโครเมตร (&mu;m) เป็น เมตร (m)" },
    { id: 8, type: 'length', from: 'nm', to: 'm', fromP: 1e-9, toP: 1, text: "แปลงจาก นาโนเมตร (nm) เป็น เมตร (m)" },
    { id: 9, type: 'length', from: 'pm', to: 'm', fromP: 1e-12, toP: 1, text: "แปลงจาก พิโกเมตร (pm) เป็น เมตร (m)" },
    { id: 10, type: 'mass', from: 'kg', to: 'g', fromP: 1e3, toP: 1, text: "แปลงจาก กิโลกรัม (kg) เป็น กรัม (g)" },
    { id: 11, type: 'mass', from: 'g', to: 'kg', fromP: 1, toP: 1e3, text: "แปลงจาก กรัม (g) เป็น กิโลกรัม (kg)" },
    { id: 12, type: 'mass', from: 'mg', to: 'g', fromP: 1e-3, toP: 1, text: "แปลงจาก มิลลิกรัม (mg) เป็น กรัม (g)" },
    { id: 13, type: 'mass', from: 'kg', to: 'mg', fromP: 1e3, toP: 1e-3, text: "แปลงจาก กิโลกรัม (kg) เป็น มิลลิกรัม (mg)" },
    { id: 14, type: 'mass', from: 'g', to: 'mg', fromP: 1, toP: 1e-3, text: "แปลงจาก กรัม (g) เป็น มิลลิกรัม (mg)" },
    { id: 15, type: 'time', from: 'ms', to: 's', fromP: 1e-3, toP: 1, text: "แปลงจาก มิลลิวินาที (ms) เป็น วินาที (s)" },
    { id: 16, type: 'time', from: '&mu;s', to: 's', fromP: 1e-6, toP: 1, text: "แปลงจาก ไมโครวินาที (&mu;s) เป็น วินาที (s)" },
    { id: 17, type: 'time', from: 'ns', to: 's', fromP: 1e-9, toP: 1, text: "แปลงจาก นาโนวินาที (ns) เป็น วินาที (s)" },
    { id: 18, type: 'current', from: 'mA', to: 'A', fromP: 1e-3, toP: 1, text: "แปลงจาก มิลลิแอมแปร์ (mA) เป็น แอมแปร์ (A)" },
    { id: 19, type: 'power', from: 'MW', to: 'W', fromP: 1e6, toP: 1, text: "แปลงจาก เมกะวัตต์ (MW) เป็น วัตต์ (W)" },
    { id: 20, type: 'power', from: 'GW', to: 'W', fromP: 1e9, toP: 1, text: "แปลงจาก จิกะวัตต์ (GW) เป็น วัตต์ (W)" }
];

function formatPower(p) {
    if(p === 1) return '1';
    return `10<sup>${Math.log10(p)}</sup>`;
}

function generateQuestionData() {
    let qType = conversionTypes[Math.floor(Math.random() * conversionTypes.length)];
    let val;
    if(['kg', 'km', 'm', 'g', 'MW', 'GW'].includes(qType.from)) {
        val = parseFloat((Math.random() * 8 + 1).toFixed(1)); // 1.0 to 9.0
    } else {
        val = Math.floor(Math.random() * 90) * 10 + 100; // 100 to 990
    }
    let ans = (val * qType.fromP) / qType.toP;
    return {
        text: `จง${qType.text} เมื่อค่าเริ่มต้นคือ <b>${val}</b> ${qType.from}`,
        val: val,
        unitStr: qType.to,
        ans: ans,
        qType: qType
    };
}

function generateQuestionDataWithRoll(rollno = 0, questionIndex = 0) {
    const q = generateQuestionData();
    const safeRoll = Number.isFinite(rollno) ? Math.max(0, Math.floor(rollno)) : 0;
    const factor = 1 + ((safeRoll + questionIndex) % 7);
    const adjustedVal = q.val * factor;
    const adjustedAns = (adjustedVal * q.qType.fromP) / q.qType.toP;

    return {
        text: `จง${q.qType.text} เมื่อค่าเริ่มต้นคือ <b>${adjustedVal}</b> ${q.qType.from} <span class="text-xs text-slate-500">(สุ่มจากเลขที่ ${safeRoll})</span>`,
        val: adjustedVal,
        unitStr: q.qType.to,
        ans: adjustedAns,
        qType: q.qType
    };
}
