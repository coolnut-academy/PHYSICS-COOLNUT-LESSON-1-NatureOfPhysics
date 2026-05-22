# ⚛️ Physics Coolnut: SI Units & Conversions

![Educational Tech](https://img.shields.io/badge/EdTech-Physics-blue?style=flat-square)
![Target Audience](https://img.shields.io/badge/Audience-High_School-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)

**Physics Coolnut** เป็นสื่อการเรียนการสอนรูปแบบเว็บแอปพลิเคชัน (Interactive Web Application) ที่ถูกพัฒนาขึ้นเพื่อยกระดับการเรียนวิชาฟิสิกส์ เรื่อง **"หน่วยฐาน SI และการแปลงหน่วย"** โดยผสานแนวคิดแบบ Gamification เข้ากับเนื้อหาวิชาการ เพื่อให้นักเรียนเข้าใจพื้นฐานทางฟิสิกส์ได้อย่างสนุกและมีประสิทธิภาพสูงสุด

---

## 🛠️ Tech Stack

โปรเจกต์นี้พัฒนาด้วยเทคโนโลยีที่เน้นความรวดเร็วในการเข้าถึง (Lightweight) และรองรับการแสดงผลทุกขนาดหน้าจอ (Responsive):

- **Core:** HTML5, Vanilla JavaScript (ES6+), CSS3
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) ผ่าน Tailwind CLI สำหรับ production CSS, Glassmorphism และ Custom Animations
- **Icons:** [FontAwesome 6](https://fontawesome.com/) (via CDN)
- **Architecture:** ออกแบบโครงสร้างคล้าย Single Page Application (SPA) ผ่านการจัดการ DOM ด้วย Vanilla JS (`app.js`) พร้อมแยกระบบชุดข้อมูลข้อสอบและการสุ่มโจทย์แยกต่างหาก (`data.js`)

## 🎯 Core Features (ระบบการเรียนรู้)

ระบบถูกออกแบบตามหลักพฤติกรรมการเรียนรู้ แบ่งเป็น 4 โมดูลหลัก:

1. 📖 **Theory (เนื้อหา):** สรุปหน่วยฐาน SI ทั้ง 7, คำอุปสรรค (Prefixes) 12 ตัว พร้อมอธิบาย Use case ในชีวิตจริงที่จำเป็นต้องมีการแปลงหน่วย
2. 💡 **Examples (ตัวอย่าง):** แหล่งรวมรูปแบบการแปลงหน่วย 20 Pattern ที่พบบ่อยที่สุด พร้อมสูตรลัด
3. 🎮 **Practice (ลานฝึกซ้อม):** 
   - ระบบ **Procedural Generation** สุ่มข้อสอบใหม่ทุกครั้ง
   - แบ่งความยากเป็น 3 ด่าน (จับคู่หน่วย, จับคู่คำอุปสรรค, คำนวณแปลงหน่วย)
   - มี Immediate Feedback ตรวจคำตอบและรู้ผลได้ทันที
4. ⏱️ **Exam Mode (โหมดทดสอบจริง):** 
   - ระบบลงทะเบียนผู้สอบ (Session Tracking)
   - Dynamic Scoring: คำนวณคะแนนรวมจาก ความถูกต้อง (15 คะแนน) + โบนัสความเร็ว (5 คะแนน) กระตุ้นให้นักเรียนคิดไวและแม่นยำ

## 💡 Educational Value (คุณค่าทางการศึกษา)

- **Self-Paced Learning:** ออกแบบ UI/UX ที่สวยงามและทันสมัย ให้นักเรียนเรียนรู้ด้วยตนเองได้ง่าย
- **Mastery Learning:** การสุ่มโจทย์แบบไม่จำกัดช่วยให้นักเรียนฝึกฝนซ้ำๆ จนเกิดทักษะ (Skill Mastery) โดยไม่ต้องรอให้ครูตั้งโจทย์ใหม่
- **Gamification Engine:** ลดความน่าเบื่อของการทำแบบฝึกหัดบนกระดาษ ด้วยระบบนับถอยหลัง 5 นาที อินเทอร์เฟซเกม และผลลัพธ์แบบ Real-time
- **Teacher-Friendly:** ช่วยลดภาระการตรวจงานของครู สามารถใช้สอนแบบ On-site ขึ้นหน้าจอโปรเจคเตอร์ หรือสั่งเป็น Assignment ให้เรียนรู้จากที่บ้านได้อย่างอิสระ

## 📋 Student Integration (เอกสารประกอบการสอน)

สำหรับการนำเว็บแอปพลิเคชันนี้ไปใช้ในห้องเรียนอย่างเป็นระบบ สามารถใช้ร่วมกับ **ใบงาน (Tasksheet)** เพื่อให้นักเรียนมีเป้าหมาย (Learning Objectives) ที่ชัดเจนในการเข้าใช้งาน พร้อมเก็บเป็นหลักฐานการเรียนรู้

👉 **[เปิดดูใบงานสำหรับนักเรียน (tasksheet.md)](tasksheet.md)**

---

<div align="center">
  <b>👨‍💻 Developed by ครูสาธิต ศิริวัชน์</b><br>
  <i>โรงเรียนห้องสอนศึกษา ในพระอุปถัมภ์ฯ</i>
</div>
