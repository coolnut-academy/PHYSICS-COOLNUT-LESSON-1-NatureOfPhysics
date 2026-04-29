import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Chunk 1: Replace theory-screen end and buttons
chunk1_target = """                                                  <div
                                                            class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                                            <h3
                                                                      class="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                                                                      <span
                                                                                class="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg mr-3">2</span>
                                                                      คำอุปสรรค (Prefixes) 12 ตัวที่ต้องรู้</h3>
                                                            <div id="prefixes-container"
                                                                      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
                                                            </div>
                                                  </div>
                                        </div>

                                        <div class="mt-8 text-center">
                                                  <button onclick="showScreen('examples-screen')"
                                                            class="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-8 rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1">
                                                            ดูตัวอย่าง 20 แบบ <i class="fas fa-arrow-right ml-2"></i>
                                                  </button>
                                        </div>"""

chunk1_repl = """                                                  <div
                                                            class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                                            <h3
                                                                      class="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                                                                      <span
                                                                                class="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg mr-3">2</span>
                                                                      คำอุปสรรค (Prefixes) 12 ตัวที่ต้องรู้</h3>
                                                            <div id="prefixes-container"
                                                                      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
                                                            </div>
                                                  </div>

                                                  <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                                            <h3 class="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                                                                      <span class="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg mr-3">3</span>
                                                                      ทำไมต้องแปลงหน่วย?
                                                            </h3>
                                                            
                                                            <div class="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border border-pink-100 shadow-sm mb-6 relative overflow-hidden">
                                                                      <i class="fas fa-quote-right absolute text-8xl text-pink-500/10 -bottom-4 -right-4 transform -rotate-12"></i>
                                                                      <p class="text-slate-700 text-lg leading-relaxed font-medium">
                                                                                การแปลงหน่วย คือการเปลี่ยนปริมาณจากหน่วยหนึ่งไปเป็นอีกหน่วยหนึ่ง โดยที่ <b class="text-pink-600">มูลค่าความเป็นจริงของปริมาณนั้นยังคงเท่าเดิม</b> เปรียบเสมือนการแปลภาษาให้คนละชาติเข้าใจตรงกันว่าของชิ้นนี้ยาวเท่าไหร่ หรือหนักแค่ไหน!
                                                                      </p>
                                                            </div>

                                                            <h4 class="text-xl font-black text-blue-700 mb-4 flex items-center">
                                                                      <i class="fas fa-globe-asia text-blue-500 mr-3"></i> ประโยชน์ในชีวิตจริง (พร้อมตัวอย่าง)
                                                            </h4>
                                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                      <div class="space-y-4">
                                                                                <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm">
                                                                                          <h4 class="font-bold text-blue-800 mb-2">1. ป้องกันความผิดพลาดร้ายแรง</h4>
                                                                                          <p class="text-sm text-slate-600">เช่น องค์การ NASA เคยสูญเสียดาวเทียมมูลค่ามหาศาลไป เพราะทีมวิศวกรใช้หน่วยคำนวณแรงขับไม่ตรงกัน (ปอนด์ กับ นิวตัน)!</p>
                                                                                </div>
                                                                                <div class="bg-purple-50 p-4 rounded-2xl border border-purple-100 shadow-sm">
                                                                                          <h4 class="font-bold text-purple-800 mb-2">2. ความสะดวกในการสื่อสาร</h4>
                                                                                          <p class="text-sm text-slate-600">เราไม่บอกระยะทางไปกรุงเทพฯ เป็น "เซนติเมตร" เพราะตัวเลขจะยาวเกินไป เราจึงแปลงเป็น "กิโลเมตร" เพื่อให้กะทัดรัดและเข้าใจง่าย</p>
                                                                                </div>
                                                                      </div>

                                                                      <div class="bg-slate-800 text-slate-200 p-6 rounded-2xl relative shadow-inner flex flex-col justify-center">
                                                                                <div class="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-md">ตัวอย่าง</div>
                                                                                <p class="text-sm text-slate-400 mb-2">หมอสั่งจ่ายยาให้คนไข้:</p>
                                                                                <p class="text-xl text-white font-medium mb-4 leading-relaxed">
                                                                                          "ให้พาราเซตามอล <span class="text-pink-400 font-bold border-b-2 border-pink-400 border-dashed pb-1">500 มิลลิกรัม (mg)</span>"
                                                                                </p>
                                                                                <p class="text-sm text-slate-300 leading-relaxed mb-4">
                                                                                          แต่ยาในคลังของโรงพยาบาลมีหน่วยเป็น <span class="text-emerald-400 font-bold">กรัม (g)</span> <br>
                                                                                          พยาบาลจึงต้องรู้ว่า <span class="text-pink-400 font-bold">500 mg</span> มีค่าเท่ากับ <span class="text-emerald-400 font-bold">0.5 g</span> จะได้หยิบยาให้คนไข้ได้ถูกต้องและปลอดภัย!
                                                                                </p>
                                                                                <div class="bg-slate-900 p-3 rounded-xl border border-slate-700 text-center font-mono text-emerald-400 text-sm font-bold shadow-inner">
                                                                                          500 &times; 10⁻³ g = 0.5 g
                                                                                </div>
                                                                      </div>
                                                            </div>
                                                  </div>
                                        </div>

                                        <div class="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                                                  <button onclick="showScreen('examples-screen')"
                                                            class="bg-indigo-500 hover:bg-indigo-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg transition-all hover:-translate-y-1">
                                                            <i class="fas fa-list-ol mr-2"></i> ดูตัวอย่าง 20 แบบ
                                                  </button>
                                                  <button onclick="initPracticeStage3()"
                                                            class="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl transition-all hover:-translate-y-1 group">
                                                            ลุยสนามซ้อมด่าน 3 <i class="fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                                                  </button>
                                        </div>"""

content = content.replace(chunk1_target, chunk1_repl)

# Chunk 2: Update the onclick function in the practice menu
chunk2_target = """<button onclick="showScreen('practice-stage3-intro-screen')"
                                                            class="bg-white p-8 rounded-3xl border-2 border-pink-100 hover:border-pink-400 hover:shadow-lg transition-all text-center group">"""
chunk2_repl = """<button onclick="initPracticeStage3()"
                                                            class="bg-white p-8 rounded-3xl border-2 border-pink-100 hover:border-pink-400 hover:shadow-lg transition-all text-center group">"""

content = content.replace(chunk2_target, chunk2_repl)

# Chunk 3: Remove the entire practice-stage3-intro-screen using regex
pattern = re.compile(r'<!-- PRACTICE STAGE 3 INTRO SCREEN -->\s*<div id="practice-stage3-intro-screen" class="hidden">.*?</div>\s*<!-- PRACTICE STAGE 3 SCREEN -->', re.DOTALL)
content = pattern.sub('<!-- PRACTICE STAGE 3 SCREEN -->', content)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Done updating index.html")
