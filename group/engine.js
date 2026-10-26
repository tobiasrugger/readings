/* =====================================================================
   group/engine.js — Group Practice: Claude leads a small group, one slide
   per question. Directions in English + six languages (each box can switch
   language). Students write on paper or whiteboards; after Check the group
   taps 👍 when their paper matches. Multiple-choice slides follow the
   ELD 101 miss rule (wrong answer fades, a quip, a hint; never revealed).

   A DECK is data: window.GP_DECKS[slug] = {title, short, course, slides:[…],
   pics:[…], art:{…}, store:{…}}. Decks live in group/decks/<slug>.js or in
   the group_decks table (made with group/maker.html). Several decks mix:
   /readings/group/?deck=a,b plays them one after another as one practice.

   Slide kinds: intro · word · sent · cap · letters · pic · ask · mc ·
   circle · aloud · end. See group/decks/README.md for every field.
   ===================================================================== */
(function(){
/* ---------- languages: code, label in its own script, name for the proxy, voice, header colour, rtl ---------- */
var LANGS=[
 ['zh-CN','中文','Chinese (Simplified)','zh-CN','#c62828'],
 ['es','Español','Spanish','es-ES','#d9661a'],
 ['th','ไทย','Thai','th-TH','#7d3c98'],
 ['vi','Tiếng Việt','Vietnamese','vi-VN','#0e8a7a'],
 ['ne','नेपाली','Nepali','ne-NP','#2457a6'],
 ['ar','العربية','Arabic','ar-SA','#8a6a10',1],
 ['yue','廣東話','Cantonese','zh-HK','#a3324a'],
 ['ary','الدارجة','Moroccan Arabic (Darija)','ar-MA','#6d5a1a',1],
 ['ru','Русский','Russian','ru-RU','#3b5b7a'],
 ['ur','اردو','Urdu','ur-PK','#2f6b4f',1],
 ['tl','Tagalog','Tagalog','fil-PH','#a0522d'],
 ['fr','Français','French','fr-FR','#34495e'],
 ['ko','한국어','Korean','ko-KR','#5b4fa0'],
 ['hi','हिन्दी','Hindi','hi-IN','#b5651d'],
 ['so','Soomaali','Somali','so-SO','#1f7a8c']
];
var LBY={};LANGS.forEach(function(l){LBY[l[0]]=l;});
var DEFAULT_SLOTS=['zh-CN','es','th','vi','ne','ar'];
var GATE_ORDER=['zh-CN','es','ar','vi','th','ne','yue','ary','ru','ur','tl','fr','ko','hi','so'];

/* ---------- directions (hand-written for the six; others come from the translation proxy) ---------- */
var DIR={
 intro:{en:'We are going to practice listening and understanding. You are going to spell words and sentences that I say. If you need me to repeat a word, say to me, “Can you repeat that, please?”',
  'zh-CN':'我们要练习听和理解。你们要拼写我说的单词和句子。如果你需要我再说一遍，就对我说：“Can you repeat that, please?”（你能再说一遍吗？）',
  es:'Vamos a practicar escuchar y entender. Vas a escribir las palabras y las oraciones que yo digo. Si necesitas que repita una palabra, dime: “Can you repeat that, please?” (¿Puedes repetir eso, por favor?)',
  th:'เราจะฝึกฟังและทำความเข้าใจ คุณจะสะกดคำและประโยคที่ฉันพูด ถ้าคุณต้องการให้ฉันพูดคำนั้นอีกครั้ง ให้พูดกับฉันว่า “Can you repeat that, please?” (ช่วยพูดอีกครั้งได้ไหม)',
  vi:'Chúng ta sẽ luyện nghe và hiểu. Các em sẽ viết chính tả những từ và câu mà tôi nói. Nếu em cần tôi nhắc lại một từ, hãy nói với tôi: “Can you repeat that, please?” (Bạn có thể nhắc lại được không?)',
  ne:'हामी सुन्ने र बुझ्ने अभ्यास गर्दैछौं। तपाईंले मैले भनेका शब्द र वाक्यहरूको हिज्जे लेख्नुहुनेछ। यदि मैले कुनै शब्द फेरि भन्नुपर्छ भने, मलाई भन्नुहोस्: “Can you repeat that, please?” (कृपया फेरि भन्न सक्नुहुन्छ?)',
  ar:'سنتدرّب على الاستماع والفهم. ستكتب الكلمات والجمل التي أقولها. إذا أردت أن أكرّر كلمة، قل لي: “Can you repeat that, please?” (هل يمكنك أن تكرّر ذلك من فضلك؟)'},
 word:{en:'Write the word: “______” Do you need me to repeat that?',
  'zh-CN':'写出这个单词：“______” 需要我再说一遍吗？',
  es:'Escribe la palabra: “______” ¿Necesitas que lo repita?',
  th:'เขียนคำนี้: “______” ต้องการให้ฉันพูดอีกครั้งไหม',
  vi:'Viết từ này: “______” Em có cần tôi nhắc lại không?',
  ne:'यो शब्द लेख्नुहोस्: “______” के म फेरि भनूँ?',
  ar:'اكتب الكلمة: “______” هل تريدني أن أكرّرها؟'},
 sent:{en:'Write the sentence: “______” Use a capital letter and a period. Do you need me to repeat that?',
  'zh-CN':'写出这个句子：“______” 用大写字母开头，句末加句号。需要我再说一遍吗？',
  es:'Escribe la oración: “______” Usa letra mayúscula y punto. ¿Necesitas que la repita?',
  th:'เขียนประโยคนี้: “______” ใช้ตัวพิมพ์ใหญ่และจุด (.) ต้องการให้ฉันพูดอีกครั้งไหม',
  vi:'Viết câu này: “______” Dùng chữ in hoa và dấu chấm. Em có cần tôi nhắc lại không?',
  ne:'यो वाक्य लेख्नुहोस्: “______” ठूलो अक्षर (capital) र पूर्णविराम (.) प्रयोग गर्नुहोस्। के म फेरि भनूँ?',
  ar:'اكتب الجملة: “______” استخدم حرفًا كبيرًا ونقطة. هل تريدني أن أكرّرها؟'},
 p2:{en:'Now we will do something different. You will describe a picture.',
  'zh-CN':'现在我们做点不一样的。你们要描述一张图片。',
  es:'Ahora vamos a hacer algo diferente. Vas a describir un dibujo.',
  th:'ตอนนี้เราจะทำอะไรที่ต่างออกไป คุณจะบรรยายรูปภาพ',
  vi:'Bây giờ chúng ta sẽ làm một việc khác. Các em sẽ miêu tả một bức tranh.',
  ne:'अब हामी केही फरक गर्नेछौं। तपाईंले एउटा चित्रको वर्णन गर्नुहुनेछ।',
  ar:'الآن سنفعل شيئًا مختلفًا. ستصف صورة.'},
 pic:{en:'Describe Picture {n}. Write one sentence. Use a capital letter and a period.',
  'zh-CN':'描述图片{n}。写一个句子。用大写字母开头，句末加句号。',
  es:'Describe el dibujo {n}. Escribe una oración. Usa letra mayúscula y punto.',
  th:'บรรยายรูปที่ {n} เขียนหนึ่งประโยค ใช้ตัวพิมพ์ใหญ่และจุด (.)',
  vi:'Miêu tả bức tranh {n}. Viết một câu. Dùng chữ in hoa và dấu chấm.',
  ne:'चित्र {n} को वर्णन गर्नुहोस्। एउटा वाक्य लेख्नुहोस्। ठूलो अक्षर र पूर्णविराम प्रयोग गर्नुहोस्।',
  ar:'صِف الصورة {n}. اكتب جملة واحدة. استخدم حرفًا كبيرًا ونقطة.'},
 p3:{en:'Now you will practice writing letters of the alphabet and capital letters.',
  'zh-CN':'现在你们要练习写字母和大写字母。',
  es:'Ahora vas a practicar cómo escribir las letras del alfabeto y las letras mayúsculas.',
  th:'ตอนนี้คุณจะฝึกเขียนตัวอักษรและตัวพิมพ์ใหญ่',
  vi:'Bây giờ các em sẽ luyện viết các chữ cái và chữ in hoa.',
  ne:'अब तपाईंले वर्णमालाका अक्षर र ठूला अक्षर (capital letters) लेख्ने अभ्यास गर्नुहुनेछ।',
  ar:'الآن ستتدرّب على كتابة حروف الأبجدية والحروف الكبيرة.'},
 cap:{en:'Write the capital letter: “__”',
  'zh-CN':'写出这个大写字母：“__”',
  es:'Escribe la letra mayúscula: “__”',
  th:'เขียนตัวพิมพ์ใหญ่: “__”',
  vi:'Viết chữ cái in hoa: “__”',
  ne:'यो ठूलो अक्षर लेख्नुहोस्: “__”',
  ar:'اكتب الحرف الكبير: “__”'},
 letters:{en:'Write these letters. Listen: I will spell a word, one letter at a time.',
  'zh-CN':'写下这些字母。听好：我会一个字母一个字母地拼一个单词。',
  es:'Escribe estas letras. Escucha: voy a deletrear una palabra, letra por letra.',
  th:'เขียนตัวอักษรเหล่านี้ ฟังนะ ฉันจะสะกดคำทีละตัวอักษร',
  vi:'Viết những chữ cái này. Nghe nhé: tôi sẽ đánh vần một từ, từng chữ một.',
  ne:'यी अक्षरहरू लेख्नुहोस्। सुन्नुहोस्: म एउटा शब्दको हिज्जे एक-एक अक्षर गरेर भन्छु।',
  ar:'اكتب هذه الحروف. استمع: سأتهجّى كلمة حرفًا حرفًا.'},
 circP:{en:'Draw a circle around the period.',
  'zh-CN':'在句号（.）外面画一个圈。',
  es:'Dibuja un círculo alrededor del punto.',
  th:'วาดวงกลมรอบจุด (.)',
  vi:'Vẽ một vòng tròn quanh dấu chấm.',
  ne:'पूर्णविराम (.) को वरिपरि गोलो घेरा बनाउनुहोस्।',
  ar:'ارسم دائرة حول النقطة.'},
 circC:{en:'Draw a circle around the capital letter.',
  'zh-CN':'在大写字母外面画一个圈。',
  es:'Dibuja un círculo alrededor de la letra mayúscula.',
  th:'วาดวงกลมรอบตัวพิมพ์ใหญ่',
  vi:'Vẽ một vòng tròn quanh chữ cái in hoa.',
  ne:'ठूलो अक्षरको वरिपरि गोलो घेरा बनाउनुहोस्।',
  ar:'ارسم دائرة حول الحرف الكبير.'},
 aloud:{en:'Take turns. Choose a word. Spell it out loud, letter by letter. Everyone spells at least one word.',
  'zh-CN':'轮流来。选一个单词，大声地一个字母一个字母拼出来。每个人至少拼一个单词。',
  es:'Túrnense. Elige una palabra. Deletréala en voz alta, letra por letra. Cada persona deletrea por lo menos una palabra.',
  th:'ผลัดกันทำ เลือกหนึ่งคำ แล้วสะกดออกเสียงดัง ๆ ทีละตัวอักษร ทุกคนต้องสะกดอย่างน้อยหนึ่งคำ',
  vi:'Lần lượt từng người. Chọn một từ. Đánh vần to từng chữ cái. Mỗi người đánh vần ít nhất một từ.',
  ne:'पालैपालो गर्नुहोस्। एउटा शब्द छान्नुहोस्। ठूलो स्वरमा एक-एक अक्षर हिज्जे गर्नुहोस्। सबैले कम्तीमा एउटा शब्दको हिज्जे गर्नुपर्छ।',
  ar:'تناوبوا. اختر كلمة. تهجَّها بصوت عالٍ، حرفًا حرفًا. كل شخص يتهجّى كلمة واحدة على الأقل.'},
 end:{en:'Great work! Your group is ready for the quiz tomorrow.',
  'zh-CN':'做得好！你们小组已经准备好明天的小测验了。',
  es:'¡Muy bien! Tu grupo está listo para el examen de mañana.',
  th:'เก่งมาก! กลุ่มของคุณพร้อมสำหรับแบบทดสอบพรุ่งนี้แล้ว',
  vi:'Làm tốt lắm! Nhóm của em đã sẵn sàng cho bài kiểm tra ngày mai.',
  ne:'धेरै राम्रो! तपाईंको समूह भोलिको क्विजको लागि तयार छ।',
  ar:'عمل رائع! مجموعتك جاهزة لاختبار الغد.'},
 same:{en:'Look at your paper. Is it the same?',
  'zh-CN':'看看你的纸。一样吗？',es:'Mira tu papel. ¿Es igual?',th:'ดูกระดาษของคุณ เหมือนกันไหม',
  vi:'Nhìn vào giấy của em. Có giống không?',ne:'आफ्नो कागज हेर्नुहोस्। उस्तै छ?',ar:'انظر إلى ورقتك. هل هي نفسها؟'},
 picsame:{en:'Many answers are OK. Did you write a sentence with a capital letter and a period?',
  'zh-CN':'很多答案都可以。你写的句子有大写字母和句号吗？',es:'Hay muchas respuestas correctas. ¿Escribiste una oración con mayúscula y punto?',
  th:'ตอบได้หลายแบบ คุณเขียนประโยคที่มีตัวพิมพ์ใหญ่และจุดหรือยัง',
  vi:'Có nhiều câu trả lời đúng. Em đã viết một câu có chữ in hoa và dấu chấm chưa?',
  ne:'धेरै उत्तर ठीक हुन्छन्। के तपाईंले ठूलो अक्षर र पूर्णविराम भएको वाक्य लेख्नुभयो?',
  ar:'إجابات كثيرة صحيحة. هل كتبت جملة بحرف كبير ونقطة؟'},
 fix:{en:'Erase it. Look at the green letters. Write it again.',
  'zh-CN':'擦掉，看着绿色的字母，再写一遍。',es:'Bórralo. Mira las letras verdes. Escríbelo otra vez.',
  th:'ลบออก ดูตัวอักษรสีเขียว แล้วเขียนใหม่อีกครั้ง',vi:'Xóa đi. Nhìn các chữ màu xanh. Viết lại lần nữa.',
  ne:'मेटाउनुहोस्। हरियो अक्षरहरू हेर्नुहोस्। फेरि लेख्नुहोस्।',ar:'امسحها. انظر إلى الحروف الخضراء. اكتبها مرة أخرى.'},
 said:{en:'Did they say the letters right?',
  'zh-CN':'他们说的字母对吗？',es:'¿Dijeron bien las letras?',th:'เขาพูดตัวอักษรถูกไหม',
  vi:'Bạn ấy nói đúng các chữ cái chưa?',ne:'के उनले अक्षरहरू ठीक भने?',ar:'هل قالوا الحروف بشكل صحيح؟'}
};


/* ---------- drawings (layered flat SVG; 200×160 unless noted) ---------- */
var ART={};
ART.lion='<svg viewBox="0 0 120 120" aria-hidden="true"><g class="waves" fill="none" stroke="#1e8c45" stroke-width="4" stroke-linecap="round"><path d="M100 46q8 14 0 28"/><path d="M108 38q13 22 0 44"/></g>'+
 '<g transform="translate(4 6)"><path d="M48 6l7 8 9-6 3 10 10-2-1 10 10 2-5 9 8 6-8 6 5 9-10 2 1 10-10-2-3 10-9-6-7 8-7-8-9 6-3-10-10 2 1-10-10-2 5-9-8-6 8-6-5-9 10-2-1-10 10 2 3-10 9 6z" fill="#b8661e" stroke="#6b3a10" stroke-width="2"/>'+
 '<circle cx="48" cy="54" r="27" fill="#f2c27a" stroke="#6b3a10" stroke-width="2"/><circle cx="27" cy="33" r="7" fill="#f2c27a" stroke="#6b3a10" stroke-width="2"/><circle cx="69" cy="33" r="7" fill="#f2c27a" stroke="#6b3a10" stroke-width="2"/><circle cx="27" cy="33" r="3" fill="#d98e6b"/><circle cx="69" cy="33" r="3" fill="#d98e6b"/>'+
 '<ellipse cx="38" cy="50" rx="4" ry="5" fill="#2a1a0a"/><ellipse cx="58" cy="50" rx="4" ry="5" fill="#2a1a0a"/><circle cx="39.5" cy="48.5" r="1.4" fill="#fff"/><circle cx="59.5" cy="48.5" r="1.4" fill="#fff"/>'+
 '<path d="M43 60h10l-5 6z" fill="#6b3a10"/><path d="M48 66q-4 6-10 4M48 66q4 6 10 4" fill="none" stroke="#6b3a10" stroke-width="2" stroke-linecap="round"/><ellipse cx="48" cy="72" rx="6" ry="3" fill="#d95f5f"/>'+
 '<path d="M20 48q0-26 28-26t28 26" fill="none" stroke="#1b2a2f" stroke-width="4"/><rect x="14" y="44" width="10" height="16" rx="4" fill="#1b2a2f"/><rect x="72" y="44" width="10" height="16" rx="4" fill="#1b2a2f"/><path d="M77 58q2 14-14 16" fill="none" stroke="#1b2a2f" stroke-width="3"/><circle cx="61" cy="74" r="3.5" fill="#1b2a2f"/>'+
 '<rect x="28" y="82" width="40" height="28" rx="3" fill="#fff" stroke="#1b2a2f" stroke-width="2"/><rect x="40" y="79" width="16" height="6" rx="2" fill="#8a9a9f"/><path d="M33 91h30M33 97h30M33 103h20" stroke="#8fa3aa" stroke-width="2"/><path d="M34 90l3 3 5-6" stroke="#1e8c45" stroke-width="2.5" fill="none"/></g></svg>';

ART.group='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#eef6fb"/><rect y="118" width="200" height="42" fill="#c9d6c2"/>'+
 '<rect x="10" y="10" width="78" height="44" rx="3" fill="#2f4f3a" stroke="#5a3a1f" stroke-width="4"/><path d="M18 24h30M18 34h50M18 44h22" stroke="#e8f0e4" stroke-width="2.4" stroke-linecap="round"/><text x="60" y="26" font-size="9" fill="#e8f0e4" font-family="Nunito" font-weight="800">A b c</text>'+
 '<rect x="128" y="14" width="22" height="30" rx="2" fill="#fff" stroke="#1b2a2f" stroke-width="2"/><circle cx="139" cy="29" r="9" fill="none" stroke="#1b2a2f" stroke-width="2"/><path d="M139 29v-6M139 29l4 3" stroke="#1b2a2f" stroke-width="2"/>'+
 /* table */
 '<ellipse cx="100" cy="112" rx="80" ry="22" fill="#a36a3c" stroke="#5a3a1f" stroke-width="2"/><ellipse cx="100" cy="108" rx="80" ry="22" fill="#c48a52" stroke="#5a3a1f" stroke-width="2"/><path d="M40 104q60 10 120 0" stroke="#d9a671" stroke-width="2" fill="none"/>'+
 /* students */
 '<g><circle cx="38" cy="70" r="11" fill="#c98b5a"/><path d="M27 66q11-14 22 0" fill="#2a1a0a"/><path d="M24 98q14-24 28 0z" fill="#d9661a"/><circle cx="35" cy="70" r="1.4" fill="#2a1a0a"/><circle cx="41" cy="70" r="1.4" fill="#2a1a0a"/><path d="M35 75q3 2 6 0" stroke="#2a1a0a" fill="none"/></g>'+
 '<g><circle cx="78" cy="62" r="11" fill="#f0c9a0"/><path d="M67 60q2-14 22-2v8q-2-8-22-6z" fill="#3a2a1a"/><path d="M64 92q14-24 28 0z" fill="#2457a6"/><circle cx="75" cy="63" r="1.4" fill="#2a1a0a"/><circle cx="81" cy="63" r="1.4" fill="#2a1a0a"/><path d="M75 68q3 2 6 0" stroke="#2a1a0a" fill="none"/></g>'+
 '<g><circle cx="122" cy="62" r="11" fill="#8d5a3b"/><path d="M110 60q12-16 24 0v14q-12-6-24 0z" fill="#3d6b5a"/><circle cx="122" cy="63" r="9" fill="#8d5a3b"/><path d="M108 92q14-24 28 0z" fill="#7d3c98"/><circle cx="119" cy="63" r="1.4" fill="#2a1a0a"/><circle cx="125" cy="63" r="1.4" fill="#2a1a0a"/><path d="M119 68q3 2 6 0" stroke="#2a1a0a" fill="none"/></g>'+
 '<g><circle cx="162" cy="70" r="11" fill="#e8b98a"/><path d="M151 68q0-14 22-6l-2 6z" fill="#111"/><path d="M148 98q14-24 28 0z" fill="#0e8a7a"/><circle cx="159" cy="71" r="1.4" fill="#2a1a0a"/><circle cx="165" cy="71" r="1.4" fill="#2a1a0a"/><path d="M159 76q3 2 6 0" stroke="#2a1a0a" fill="none"/></g>'+
 /* whiteboards */
 '<g transform="rotate(-8 50 108)"><rect x="34" y="98" width="34" height="22" rx="2" fill="#fff" stroke="#1b2a2f" stroke-width="2"/><text x="38" y="113" font-size="10" font-family="Nunito" font-weight="800" fill="#1b2a2f">good</text></g>'+
 '<g transform="rotate(5 100 110)"><rect x="84" y="100" width="34" height="22" rx="2" fill="#fff" stroke="#1b2a2f" stroke-width="2"/><path d="M89 112q6-6 12 0t12 0" stroke="#2457a6" stroke-width="2" fill="none"/></g>'+
 '<g transform="rotate(-4 150 108)"><rect x="132" y="98" width="34" height="22" rx="2" fill="#fff" stroke="#1b2a2f" stroke-width="2"/><text x="136" y="113" font-size="10" font-family="Nunito" font-weight="800" fill="#1b2a2f">old</text></g>'+
 '<rect x="70" y="118" width="22" height="4" rx="2" fill="#1e8c45" transform="rotate(20 80 120)"/><rect x="116" y="118" width="22" height="4" rx="2" fill="#c62828" transform="rotate(-15 126 120)"/>'+
 /* tablet with play */
 '<rect x="92" y="88" width="20" height="14" rx="2" fill="#1b2a2f"/><circle cx="102" cy="95" r="5" fill="#1e8c45"/><path d="M100.5 92.5v5l4-2.5z" fill="#fff"/></svg>';

ART.good='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#eef6fb"/><rect x="18" y="16" width="104" height="130" rx="4" fill="#fff" stroke="#1b2a2f" stroke-width="2.5"/><path d="M18 34h104" stroke="#e57373" stroke-width="1.5"/>'+
 '<path d="M28 50h84M28 66h84M28 82h84M28 98h84M28 114h84M28 130h84" stroke="#b9d4e8" stroke-width="1.5"/><path d="M30 60q8-10 16 0t16 0" stroke="#1b2a2f" stroke-width="2" fill="none"/><path d="M30 92q6-8 12 0t12 0t12 0" stroke="#1b2a2f" stroke-width="2" fill="none"/>'+
 '<path d="M74 104l12 14 26-34" stroke="#1e8c45" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+
 '<path d="M100 22l5 10 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1z" fill="#f2b632" stroke="#9a6b00" stroke-width="1.5"/>'+
 '<g transform="translate(128 60)"><path d="M14 40h30q8 0 8-8l-2-26q-1-6-8-6H30l2-14q1-10-8-10-4 0-5 5l-6 22q-2 6-9 7v30z" fill="#e8b98a" stroke="#7a4f2c" stroke-width="2.5"/><rect x="-4" y="12" width="16" height="34" rx="3" fill="#2457a6" stroke="#12305e" stroke-width="2"/><path d="M30 12h14M30 22h16M30 32h14" stroke="#7a4f2c" stroke-width="2"/></g></svg>';

ART.woman='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#eef6fb"/><rect y="132" width="200" height="28" fill="#cdd9c4"/><path d="M0 132h200" stroke="#9fb09a" stroke-width="2"/>'+
 '<path d="M150 40h36v92h-36z" fill="#dce7ef" stroke="#8fa3aa" stroke-width="2"/><path d="M150 70h36M168 40v92" stroke="#8fa3aa" stroke-width="2"/>'+
 '<path d="M76 30q24-18 48 0l4 52q-28 8-56 0z" fill="#3a2414"/>'+
 '<rect x="92" y="62" width="16" height="14" fill="#c98b5a"/><ellipse cx="100" cy="46" rx="19" ry="22" fill="#d9a06e" stroke="#7a4f2c" stroke-width="1.5"/><path d="M80 44q4-26 22-22 16 2 18 22-10-12-40 0z" fill="#3a2414"/>'+
 '<ellipse cx="93" cy="47" rx="2.4" ry="3" fill="#2a1a0a"/><ellipse cx="107" cy="47" rx="2.4" ry="3" fill="#2a1a0a"/><path d="M89 41q4-3 8 0M103 41q4-3 8 0" stroke="#3a2414" stroke-width="1.6" fill="none"/><path d="M100 50v6l-2 1" stroke="#7a4f2c" fill="none"/><path d="M94 60q6 4 12 0" stroke="#a33" stroke-width="2" fill="none"/><circle cx="82" cy="52" r="2.5" fill="#f2b632"/><circle cx="118" cy="52" r="2.5" fill="#f2b632"/>'+
 '<path d="M74 132l4-46q2-12 22-12t22 12l4 46z" fill="#2457a6" stroke="#12305e" stroke-width="2"/><path d="M90 74l10 12 10-12" fill="#fff" stroke="#12305e" stroke-width="1.5"/><path d="M84 96v34M116 96v34" stroke="#12305e" stroke-width="1.2" opacity=".5"/>'+
 '<path d="M74 84l-10 34q-1 6 5 6" stroke="#d9a06e" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M126 84l8 30" stroke="#d9a06e" stroke-width="9" fill="none" stroke-linecap="round"/>'+
 '<path d="M124 106h22l4 26h-30z" fill="#c62828" stroke="#7d1717" stroke-width="2"/><path d="M128 106q7-14 14 0" stroke="#7d1717" stroke-width="2.5" fill="none"/><rect x="132" y="114" width="8" height="5" rx="1" fill="#f2b632"/>'+
 '<path d="M88 132v8h-8M112 132v8h8" stroke="#1b2a2f" stroke-width="5" stroke-linecap="round"/></svg>';

ART.old='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#f4efe6"/><rect y="132" width="200" height="28" fill="#c9b79a"/><path d="M0 132h200" stroke="#9a8462" stroke-width="2"/>'+
 '<rect x="10" y="18" width="52" height="64" fill="#cfe3ef" stroke="#6d4c2e" stroke-width="4"/><path d="M36 18v64M10 50h52" stroke="#6d4c2e" stroke-width="3"/><path d="M14 22q10 30 0 56" stroke="#e7d2b0" stroke-width="5" fill="none"/>'+
 '<g transform="translate(14 0)"><path d="M92 132l-2-50q0-14 18-16 18 2 18 16l4 50z" fill="#7d3c98" stroke="#4a1f5e" stroke-width="2"/><path d="M96 92q12 6 26 0M95 104q14 6 28 0M95 116q14 6 30 0" stroke="#a569bd" stroke-width="2" fill="none"/>'+
 '<path d="M98 66q12 8 22 0l-2 6q-10 6-18 0z" fill="#efe7dc" stroke="#8a7a62"/>'+
 '<ellipse cx="108" cy="46" rx="16" ry="18" fill="#e9c7a4" stroke="#8a6a4a" stroke-width="1.5"/><circle cx="108" cy="24" r="9" fill="#d8d8d8" stroke="#9a9a9a" stroke-width="1.5"/><path d="M92 44q2-18 16-18t16 18q-6-10-16-10t-16 10z" fill="#d8d8d8" stroke="#9a9a9a" stroke-width="1.5"/>'+
 '<circle cx="101" cy="47" r="5" fill="none" stroke="#3b3b3b" stroke-width="1.8"/><circle cx="115" cy="47" r="5" fill="none" stroke="#3b3b3b" stroke-width="1.8"/><path d="M106 47h4" stroke="#3b3b3b" stroke-width="1.8"/><circle cx="101" cy="47" r="1.5" fill="#2a1a0a"/><circle cx="115" cy="47" r="1.5" fill="#2a1a0a"/>'+
 '<path d="M95 40q3-2 5 0M116 40q3-2 5 0M97 55q2 2 4 1M116 56q2-1 4-1M104 59q4 3 8 0" stroke="#8a6a4a" stroke-width="1.3" fill="none"/><path d="M93 50q-1 4 1 6M123 50q1 4-1 6" stroke="#8a6a4a" fill="none"/>'+
 '<path d="M124 82q14 10 16 28" stroke="#e9c7a4" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M140 104v28" stroke="#5a3a1f" stroke-width="5" stroke-linecap="round"/><path d="M134 104q6-8 12 0" stroke="#5a3a1f" stroke-width="5" fill="none" stroke-linecap="round"/>'+
 '<path d="M98 132v6h-8M118 132v6h8" stroke="#3b3b3b" stroke-width="5" stroke-linecap="round"/></g>'+
 '<path d="M16 120q8-16 18-2" stroke="#4a8f3c" stroke-width="3" fill="none"/><rect x="12" y="118" width="26" height="14" rx="2" fill="#b5651d"/></svg>';

ART.bury='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="70" fill="#e9f3f8"/><circle cx="170" cy="22" r="12" fill="#f2b632"/>'+
 '<path d="M0 70q50-8 100 0t100 0v90H0z" fill="#7a4f2c"/><path d="M0 92h200M0 120h200" stroke="#6a4224" stroke-width="2" stroke-dasharray="6 8"/>'+
 '<circle cx="30" cy="104" r="3" fill="#5a3a1f"/><circle cx="160" cy="132" r="4" fill="#5a3a1f"/><circle cx="140" cy="100" r="2.5" fill="#9a7a5a"/><circle cx="54" cy="140" r="3" fill="#9a7a5a"/>'+
 /* hole cross section with bean */
 '<path d="M76 72q24 50 48 0" fill="#4a2f17" stroke="#3a2210" stroke-width="2"/><ellipse cx="100" cy="104" rx="10" ry="6" fill="#f0e6c8" stroke="#a0855a" stroke-width="1.5"/><path d="M96 104q4-3 8 0" stroke="#a0855a" fill="none"/>'+
 '<path d="M80 74q20 22 40 0" fill="#8a5c34" opacity=".85"/>'+
 /* hand pushing soil */
 '<path d="M118 52q20-6 34 6l6 10-30 6q-10 2-14-4z" fill="#d9a06e" stroke="#7a4f2c" stroke-width="2"/><path d="M128 64q8 2 14 0M130 58q8 0 14-2" stroke="#7a4f2c" fill="none"/><path d="M150 54l24-8 6 14-22 10z" fill="#2457a6" stroke="#12305e" stroke-width="2"/>'+
 '<circle cx="114" cy="68" r="5" fill="#8a5c34"/><circle cx="106" cy="66" r="4" fill="#8a5c34"/><circle cx="110" cy="60" r="3" fill="#8a5c34"/>'+
 '<path d="M60 40q14-4 22 10" stroke="#1b2a2f" stroke-width="3" fill="none" stroke-dasharray="4 4"/><path d="M82 50l-8-2 4-6z" fill="#1b2a2f"/><ellipse cx="54" cy="38" rx="8" ry="5" fill="#f0e6c8" stroke="#a0855a" stroke-width="1.5"/></svg>';

ART.dig='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="80" fill="#e9f3f8"/><path d="M0 80h200v80H0z" fill="#8a5c34"/><path d="M0 80q40-6 80 0t120 0" fill="#6a8f3a"/>'+
 '<path d="M60 96q40 30 80 0" fill="#4a2f17" stroke="#3a2210" stroke-width="2"/><path d="M58 92q42 -6 84 0l-6 6q-36-4-72 0z" fill="#a8774a"/>'+
 '<path d="M150 70q22-4 34 14l-4 8q-18-10-34-6z" fill="#7a4f2c"/><circle cx="160" cy="62" r="4" fill="#7a4f2c"/><circle cx="174" cy="56" r="3" fill="#7a4f2c"/><circle cx="150" cy="52" r="3" fill="#7a4f2c"/>'+
 /* shovel */
 '<g transform="rotate(32 110 60)"><rect x="106" y="0" width="8" height="70" rx="3" fill="#b5651d" stroke="#6b3a10" stroke-width="1.5"/><path d="M100 0h20v6h-20z" fill="#1b2a2f"/><path d="M98 70h24l-2 22q-10 10-20 0z" fill="#b8c4cc" stroke="#55636a" stroke-width="2"/><path d="M104 76v12" stroke="#fff" stroke-width="2" opacity=".7"/></g>'+
 '<path d="M30 70l6-14 6 14M36 70v10" stroke="#3d7a2e" stroke-width="3" fill="none"/><path d="M180 120l4-4M30 130l5 2M90 140l4-2" stroke="#6a4224" stroke-width="3"/>'+
 '<path d="M140 30q12-8 22 0" stroke="#1b2a2f" stroke-width="2" fill="none"/><path d="M146 22q8-6 14 0" stroke="#1b2a2f" stroke-width="2" fill="none"/></svg>';

ART.kimdig='<svg viewBox="0 0 200 160" aria-hidden="true"><defs><linearGradient id="sun1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7c873"/><stop offset="1" stop-color="#f6e7c8"/></linearGradient></defs><rect width="200" height="96" fill="url(#sun1)"/><circle cx="160" cy="90" r="18" fill="#f2a33a"/>'+
 '<rect x="4" y="30" width="34" height="66" fill="#8c6b5a"/><rect x="40" y="46" width="30" height="50" fill="#a07e6a"/><rect x="150" y="38" width="44" height="58" fill="#7b6355"/><g fill="#f5d98a"><rect x="10" y="38" width="6" height="7"/><rect x="24" y="38" width="6" height="7"/><rect x="10" y="54" width="6" height="7"/><rect x="46" y="54" width="6" height="7"/><rect x="158" y="46" width="6" height="7"/><rect x="176" y="46" width="6" height="7"/></g>'+
 '<rect y="96" width="200" height="64" fill="#9b7a55"/><path d="M0 96h200" stroke="#6a5038" stroke-width="2"/>'+
 '<circle cx="30" cy="128" r="12" fill="none" stroke="#2b2b2b" stroke-width="6"/><rect x="150" y="116" width="8" height="18" rx="2" fill="#5e9e6e" transform="rotate(70 154 125)"/><path d="M170 140q8-12 16 0" stroke="#4a8f3c" stroke-width="3" fill="none"/><path d="M58 146l8-10 8 10" stroke="#4a8f3c" stroke-width="3" fill="none"/>'+
 /* Kim kneeling with spoon */
 '<path d="M86 150q30 6 50 0" fill="#3a2210"/><ellipse cx="112" cy="146" rx="16" ry="5" fill="#3a2210"/>'+
 '<path d="M118 140l-24 2q-6-12 0-26l10-12h14l6 18z" fill="#c62828" stroke="#7d1717" stroke-width="2"/><path d="M96 142h-16q-6 0-4-6l4-4" stroke="#1b2a2f" stroke-width="7" fill="none" stroke-linecap="round"/>'+
 '<circle cx="110" cy="90" r="12" fill="#f0c9a0" stroke="#8a6a4a"/><path d="M98 90q0-18 14-16 12 2 10 22-4-12-12-12t-12 6z" fill="#111"/><path d="M98 88q-6 14 2 22" stroke="#111" stroke-width="5" fill="none"/><circle cx="114" cy="91" r="1.5" fill="#111"/><path d="M114 97q3 1 5-1" stroke="#7a4f2c" fill="none"/>'+
 '<path d="M118 118q12 8 6 24" stroke="#f0c9a0" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M124 140l-6 8" stroke="#9aa6ad" stroke-width="3"/><ellipse cx="117" cy="149" rx="4" ry="2.5" fill="#c7d0d5"/></svg>';

ART.analook='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#b8a48c"/><g stroke="#8f7a62" stroke-width="1.2"><path d="M0 20h200M0 40h200M0 60h200M0 80h200M0 100h200M0 120h200M0 140h200"/></g>'+
 '<rect x="20" y="14" width="160" height="104" fill="#6d4c2e"/><rect x="28" y="22" width="144" height="88" fill="#cfe7f2"/>'+
 /* view outside: lot and Kim tiny */
 '<rect x="28" y="70" width="144" height="40" fill="#9b7a55"/><rect x="28" y="40" width="30" height="30" fill="#a07e6a"/><rect x="140" y="30" width="32" height="40" fill="#8c6b5a"/>'+
 '<circle cx="142" cy="88" r="4" fill="#f0c9a0"/><path d="M138 86q4-6 8 0" fill="#111"/><path d="M136 102l2-10h8l2 10z" fill="#c62828"/><circle cx="60" cy="98" r="6" fill="none" stroke="#2b2b2b" stroke-width="3"/>'+
 '<path d="M100 22v88M28 66h144" stroke="#6d4c2e" stroke-width="4"/>'+
 /* Ana at window with binoculars, back to us */
 '<path d="M54 160q2-46 34-46t34 46z" fill="#7d3c98" stroke="#4a1f5e" stroke-width="2"/><ellipse cx="88" cy="96" rx="17" ry="19" fill="#d8d8d8" stroke="#9a9a9a" stroke-width="1.5"/><circle cx="88" cy="78" r="8" fill="#cfcfcf" stroke="#9a9a9a"/>'+
 '<path d="M70 120q-6-14 4-24" stroke="#e9c7a4" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M106 120q8-14 0-24" stroke="#e9c7a4" stroke-width="8" fill="none" stroke-linecap="round"/>'+
 '<g fill="#1b2a2f"><rect x="72" y="86" width="12" height="16" rx="4"/><rect x="92" y="86" width="12" height="16" rx="4"/><rect x="82" y="90" width="12" height="6"/></g><circle cx="78" cy="86" r="4" fill="#5b7bb0"/><circle cx="98" cy="86" r="4" fill="#5b7bb0"/>'+
 '<path d="M150 150q10-26 20-30v30z" fill="#4a8f3c"/><rect x="146" y="140" width="28" height="20" fill="#b5651d"/></svg>';

ART.easel='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#eef6fb"/><rect y="138" width="200" height="22" fill="#cdd9c4"/>'+
 '<path d="M60 150l30-130M140 150l-30-130M100 20v130" stroke="#8a5a2a" stroke-width="6" stroke-linecap="round"/>'+
 '<rect x="42" y="30" width="116" height="84" fill="#fff" stroke="#1b2a2f" stroke-width="3"/><rect x="50" y="38" width="100" height="68" fill="#f7f7f2" stroke="#1b2a2f" stroke-width="1.5"/>'+
 '<path d="M54 100l20-26 14 16 12-10 22 20z" fill="#cfd8cf" stroke="#1b2a2f" stroke-width="1.5"/><circle cx="130" cy="54" r="8" fill="none" stroke="#1b2a2f" stroke-width="1.5"/><circle cx="80" cy="58" r="6" fill="#fff" stroke="#1b2a2f" stroke-width="1.5"/><path d="M80 64v14M74 70h12M80 78l-5 8M80 78l5 8" stroke="#1b2a2f" stroke-width="1.5"/>'+
 '<path d="M90 50q10-8 22-4l-6 8q-8-2-16-4z" fill="#fff" stroke="#1b2a2f" stroke-width="1.2"/>'+
 '<rect x="40" y="112" width="120" height="6" fill="#8a5a2a"/>'+
 '<g transform="translate(150 96) rotate(-35)"><rect x="0" y="0" width="38" height="7" rx="1" fill="#f2b632" stroke="#9a6b00"/><path d="M38 0l9 3.5-9 3.5z" fill="#e9c7a4"/><path d="M44 2.5l3 1-3 1z" fill="#1b2a2f"/><rect x="-6" y="0" width="7" height="7" fill="#e57373"/></g></svg>';

ART.blocks='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#eef6fb"/><rect y="128" width="200" height="32" fill="#c48a52"/><path d="M0 128h200" stroke="#5a3a1f" stroke-width="2"/>'+
 '<g font-family="Nunito" font-weight="900" text-anchor="middle">'+
 '<g transform="translate(20 84)"><rect width="44" height="44" fill="#c62828" stroke="#1b2a2f" stroke-width="2.5"/><path d="M0 0l8-8h44l-8 8zM44 0l8-8v44l-8 8z" fill="#8e1c1c" stroke="#1b2a2f" stroke-width="2"/><text x="22" y="34" font-size="30" fill="#fff">K</text></g>'+
 '<g transform="translate(72 84)"><rect width="44" height="44" fill="#2457a6" stroke="#1b2a2f" stroke-width="2.5"/><path d="M0 0l8-8h44l-8 8zM44 0l8-8v44l-8 8z" fill="#183d75" stroke="#1b2a2f" stroke-width="2"/><text x="22" y="34" font-size="30" fill="#fff">I</text></g>'+
 '<g transform="translate(46 32)"><rect width="44" height="44" fill="#1e8c45" stroke="#1b2a2f" stroke-width="2.5"/><path d="M0 0l8-8h44l-8 8zM44 0l8-8v44l-8 8z" fill="#136030" stroke="#1b2a2f" stroke-width="2"/><text x="22" y="34" font-size="30" fill="#fff">M</text></g>'+
 '<g transform="translate(134 96)"><rect width="32" height="32" fill="#f2b632" stroke="#1b2a2f" stroke-width="2.5"/><text x="16" y="24" font-size="22" fill="#1b2a2f">a</text></g></g>'+
 /* hidden lion */
 '<g class="lion" id="lionEgg" transform="translate(172 100)"><circle r="11" fill="#b8661e"/><circle r="7" fill="#f2c27a"/><circle cx="-2.5" cy="-1" r="1.2" fill="#2a1a0a"/><circle cx="2.5" cy="-1" r="1.2" fill="#2a1a0a"/><path d="M-2 3q2 2 4 0" stroke="#6b3a10" fill="none"/></g>'+
 '<g transform="translate(118 30) rotate(30)"><rect width="56" height="9" rx="1" fill="#f2b632" stroke="#9a6b00"/><path d="M56 0l12 4.5-12 4.5z" fill="#e9c7a4"/><path d="M64 3l4 1.5-4 1.5z" fill="#1b2a2f"/><rect x="-8" width="9" height="9" fill="#e57373"/></g></svg>';

ART.seedfolks='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#eaf4e4"/><rect y="118" width="200" height="42" fill="#7a4f2c"/><path d="M0 118q50-6 100 0t100 0" fill="#6a8f3a"/>'+
 '<g transform="translate(18 18) rotate(-6)"><rect width="64" height="90" rx="4" fill="#fff8e6" stroke="#1b2a2f" stroke-width="2.5"/><rect x="6" y="6" width="52" height="46" rx="3" fill="#bfe3c6"/><ellipse cx="22" cy="40" rx="7" ry="4" fill="#f0e6c8" stroke="#a0855a"/><ellipse cx="38" cy="34" rx="7" ry="4" fill="#f0e6c8" stroke="#a0855a"/><path d="M30 20q4 8 0 16M30 24q8-6 14-2q-6 6-14 2" stroke="#2f7d3a" stroke-width="2" fill="#5fb06a"/><rect x="10" y="60" width="44" height="6" rx="2" fill="#1b2a2f"/><rect x="10" y="72" width="30" height="4" rx="2" fill="#8fa3aa"/></g>'+
 /* sprouts like little people */
 '<g><path d="M110 118v-26" stroke="#2f7d3a" stroke-width="3"/><circle cx="110" cy="86" r="7" fill="#f0c9a0"/><path d="M110 98q-10-6-12-14q10 2 12 14zM110 98q10-6 12-14q-10 2-12 14z" fill="#5fb06a"/></g>'+
 '<g><path d="M140 118v-34" stroke="#2f7d3a" stroke-width="3"/><circle cx="140" cy="78" r="7" fill="#8d5a3b"/><path d="M140 92q-12-6-14-16q12 2 14 16zM140 92q12-6 14-16q-12 2-14 16z" fill="#5fb06a"/></g>'+
 '<g><path d="M170 118v-22" stroke="#2f7d3a" stroke-width="3"/><circle cx="170" cy="90" r="7" fill="#e8b98a"/><path d="M170 104q-10-5-11-12q9 2 11 12zM170 104q10-5 11-12q-9 2-11 12z" fill="#5fb06a"/></g>'+
 '<path d="M104 80q6-6 12 0M134 72q6-6 12 0M164 84q6-6 12 0" fill="#111"/></svg>';

ART.garden='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="90" fill="#dff0fa"/><circle cx="30" cy="24" r="12" fill="#f2b632"/><rect y="90" width="200" height="70" fill="#7aa64a"/>'+
 '<g stroke="#8a5a2a" stroke-width="3"><path d="M8 104v-26M24 104v-26M40 104v-26M56 104v-26M144 104v-26M160 104v-26M176 104v-26M192 104v-26"/><path d="M0 84h64M136 84h64M0 96h64M136 96h64"/></g>'+
 '<rect x="20" y="112" width="70" height="26" fill="#6b3a1a" stroke="#4a2810" stroke-width="2"/><rect x="110" y="112" width="70" height="26" fill="#6b3a1a" stroke="#4a2810" stroke-width="2"/>'+
 '<g stroke="#8a5a2a" stroke-width="2.5"><path d="M34 112l12-60 12 60"/><path d="M124 112l12-60 12 60"/></g>'+
 '<g fill="#3d8f3c"><path d="M40 70q-10-2-12-10q10 0 12 10zM50 84q10-2 12-10q-10 0-12 10zM42 98q-10-2-12-10q10 0 12 10z"/><path d="M130 70q-10-2-12-10q10 0 12 10zM140 84q10-2 12-10q-10 0-12 10zM132 98q-10-2-12-10q10 0 12 10z"/></g>'+
 '<g stroke="#2f7d3a" stroke-width="3" fill="none"><path d="M46 104q2-8-2-14M136 104q2-8-2-14"/></g><path d="M47 80l1 10M137 80l1 10" stroke="#5a8f2a" stroke-width="3"/>'+
 '<g><path d="M100 112v-58" stroke="#2f7d3a" stroke-width="4"/><circle cx="100" cy="48" r="14" fill="#f2b632"/><circle cx="100" cy="48" r="7" fill="#6b3a10"/><path d="M100 84q-14-4-16-14q14 2 16 14z" fill="#3d8f3c"/></g>'+
 '<g fill="#c62828"><circle cx="60" cy="124" r="5"/><circle cx="74" cy="126" r="5"/></g><g fill="#3d8f3c"><path d="M60 119l-2-6 4 2zM74 121l2-6-4 2z"/></g>'+
 '<g fill="#e67e22"><path d="M126 120l4 16 4-16z"/><path d="M146 120l4 16 4-16z"/></g><g fill="#3d8f3c"><path d="M127 120l3-8 3 8zM147 120l3-8 3 8z"/></g></svg>';

ART.emptylot='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="90" fill="#cfd9df"/><rect x="0" y="30" width="44" height="60" fill="#8c7b6e"/><rect x="156" y="20" width="44" height="70" fill="#7b6a5e"/><g fill="#5b4d43"><rect x="8" y="40" width="8" height="10"/><rect x="26" y="40" width="8" height="10"/><rect x="8" y="60" width="8" height="10"/><rect x="164" y="30" width="8" height="10"/><rect x="182" y="30" width="8" height="10"/><rect x="164" y="52" width="8" height="10"/></g>'+
 '<rect y="90" width="200" height="70" fill="#a38a6a"/>'+
 '<g stroke="#6b6b6b" stroke-width="1.5" opacity=".9"><path d="M0 80h200M0 92h200"/><path d="M10 80l12 12M22 80l-12 12M34 80l12 12M46 80l-12 12M58 80l12 12M70 80l-12 12M82 80l12 12M94 80l-12 12M106 80l12 12M118 80l-12 12M130 80l12 12M142 80l-12 12M154 80l12 12M166 80l-12 12M178 80l12 12M190 80l-12 12"/></g><path d="M0 76v20M60 76v20M120 76v20M180 76v20" stroke="#4a4a4a" stroke-width="3"/>'+
 '<circle cx="40" cy="128" r="14" fill="none" stroke="#2b2b2b" stroke-width="7"/><circle cx="40" cy="128" r="5" fill="#555"/>'+
 '<path d="M78 112l60-6 6 20-60 6z" fill="#d9cfbf" stroke="#8a7a62" stroke-width="2"/><path d="M90 114l2 14M110 112l2 14M126 110l2 14" stroke="#b8a88f" stroke-width="2"/>'+
 '<rect x="152" y="120" width="8" height="20" rx="2" fill="#5e9e6e" transform="rotate(75 156 130)"/><path d="M164 112l14-4 2 10-14 4z" fill="#e0e0e0" stroke="#8a8a8a"/>'+
 '<g stroke="#4a8f3c" stroke-width="2.5" fill="none"><path d="M18 150q4-10 8 0M100 150q4-14 8 0M176 148q4-10 8 0M64 112q4-10 8 0"/></g><path d="M120 146l10-4 4 6-10 4z" fill="#c62828"/></svg>';

ART.cleveland='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="100" fill="#dceef8"/><rect y="100" width="200" height="60" fill="#5b8fb0"/><path d="M0 110q20-4 40 0t40 0t40 0t40 0t40 0" stroke="#8fc0dc" stroke-width="2" fill="none"/>'+
 '<g fill="#6d7f8c" stroke="#45545e" stroke-width="1.5"><rect x="20" y="60" width="24" height="40"/><rect x="48" y="40" width="20" height="60"/><rect x="72" y="70" width="18" height="30"/><rect x="132" y="56" width="22" height="44"/><rect x="158" y="66" width="26" height="34"/></g>'+
 '<path d="M96 100V36l8-14 8 14v64z" fill="#9aa9b3" stroke="#45545e" stroke-width="1.5"/><path d="M104 22v-10" stroke="#45545e" stroke-width="2"/>'+
 '<g fill="#f5e7a8"><rect x="52" y="48" width="4" height="5"/><rect x="60" y="48" width="4" height="5"/><rect x="52" y="60" width="4" height="5"/><rect x="100" y="44" width="4" height="5"/><rect x="100" y="56" width="4" height="5"/><rect x="136" y="64" width="4" height="5"/><rect x="146" y="64" width="4" height="5"/></g>'+
 '<path d="M30 132h40l-6 8H36z" fill="#fff" stroke="#1b2a2f" stroke-width="1.5"/><path d="M50 132v-14l12 12z" fill="#fff" stroke="#1b2a2f"/></svg>';

ART.beans='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#f3efe3"/><ellipse cx="100" cy="128" rx="80" ry="16" fill="#d6cdb8"/>'+
 '<g transform="rotate(-18 70 80)"><path d="M20 80q50-30 100 0q-50 20-100 0z" fill="#5fb06a" stroke="#2f7d3a" stroke-width="2.5"/><circle cx="46" cy="78" r="7" fill="#8fd09a"/><circle cx="66" cy="76" r="7" fill="#8fd09a"/><circle cx="86" cy="76" r="7" fill="#8fd09a"/><path d="M120 80q8-2 12-8" stroke="#2f7d3a" stroke-width="2.5" fill="none"/></g>'+
 '<g stroke="#a0855a" stroke-width="1.5"><ellipse cx="120" cy="118" rx="11" ry="7" fill="#f0e6c8"/><ellipse cx="146" cy="122" rx="11" ry="7" fill="#c75b5b"/><ellipse cx="96" cy="126" rx="11" ry="7" fill="#f0e6c8"/><ellipse cx="166" cy="112" rx="11" ry="7" fill="#3b2a2a"/></g>'+
 '<path d="M116 117q4-3 8 0M92 125q4-3 8 0" stroke="#a0855a" fill="none"/></svg>';

ART.binoculars='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#eef6fb"/>'+
 '<g stroke="#0f1a1e" stroke-width="2.5"><rect x="40" y="40" width="46" height="74" rx="14" fill="#1b2a2f"/><rect x="114" y="40" width="46" height="74" rx="14" fill="#1b2a2f"/><rect x="82" y="56" width="36" height="26" rx="6" fill="#2d3e45"/></g>'+
 '<circle cx="63" cy="112" r="20" fill="#5b7bb0" stroke="#0f1a1e" stroke-width="3"/><circle cx="137" cy="112" r="20" fill="#5b7bb0" stroke="#0f1a1e" stroke-width="3"/><path d="M52 104q8-8 18-4M126 104q8-8 18-4" stroke="#cfe2f5" stroke-width="3" fill="none"/>'+
 '<rect x="46" y="28" width="34" height="14" rx="5" fill="#45545e"/><rect x="120" y="28" width="34" height="14" rx="5" fill="#45545e"/><circle cx="100" cy="52" r="6" fill="#8a9a9f" stroke="#0f1a1e" stroke-width="2"/>'+
 '<path d="M40 60q-20 20-6 60M160 60q20 20 6 60" stroke="#7a4f2c" stroke-width="3" fill="none"/></svg>';

ART.trophy='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#eef6fb"/><g fill="#f2b632" stroke="#9a6b00" stroke-width="2.5"><path d="M70 30h60v30q0 30-30 34-30-4-30-34z"/><path d="M70 40H52q0 26 22 30M130 40h18q0 26-22 30" fill="none"/></g>'+
 '<rect x="92" y="94" width="16" height="18" fill="#d9a028" stroke="#9a6b00" stroke-width="2"/><rect x="70" y="112" width="60" height="16" rx="3" fill="#7a4f2c" stroke="#4a2f17" stroke-width="2"/>'+
 '<path d="M100 42l5 10 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1z" fill="#fff6d0"/>'+
 '<g fill="#c62828"><circle cx="30" cy="30" r="4"/><circle cx="170" cy="40" r="4"/></g><g fill="#2457a6"><circle cx="40" cy="80" r="3"/><circle cx="160" cy="90" r="4"/></g><g fill="#1e8c45"><circle cx="24" cy="120" r="4"/><circle cx="178" cy="124" r="3"/></g></svg>';

ART.paper='<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#eef6fb"/><rect x="26" y="18" width="130" height="126" rx="3" fill="#fff" stroke="#1b2a2f" stroke-width="2.5"/><path d="M26 36h130" stroke="#e57373" stroke-width="1.5"/><path d="M36 54h110M36 72h110M36 90h110M36 108h110M36 126h110" stroke="#b9d4e8" stroke-width="1.5"/>'+
 '<path d="M40 66q6-8 12 0t12 0t12 0t12 0t12 0" stroke="#1b2a2f" stroke-width="2" fill="none"/>'+
 '<g transform="translate(150 60) rotate(40)"><rect width="70" height="10" rx="1" fill="#f2b632" stroke="#9a6b00"/><path d="M70 0l14 5-14 5z" fill="#e9c7a4"/><path d="M80 3.5l4 1.5-4 1.5z" fill="#1b2a2f"/><rect x="-10" width="10" height="10" fill="#e57373"/></g></svg>';

/* capital vs small: a contrast pair, small one crossed out */
function capArt(L){
  return '<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#eef6fb"/>'+
   '<rect x="12" y="20" width="84" height="110" rx="10" fill="#e3f4e6" stroke="#1e8c45" stroke-width="3"/><text x="54" y="104" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="78" fill="#1e8c45">'+L+'</text>'+
   '<circle cx="84" cy="32" r="10" fill="#1e8c45"/><path d="M79 32l4 4 7-8" stroke="#fff" stroke-width="3" fill="none"/>'+
   '<rect x="108" y="20" width="80" height="110" rx="10" fill="#fff" stroke="#8fa3aa" stroke-width="3"/><text x="148" y="104" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="64" fill="#8fa3aa">'+L.toLowerCase()+'</text>'+
   '<path d="M118 32l60 88M178 32l-60 88" stroke="#d64545" stroke-width="5" stroke-linecap="round" opacity=".85"/>'+
   '<text x="54" y="148" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="13" fill="#1b2a2f">capital</text><text x="148" y="148" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="13" fill="#4c5f66">small</text></svg>';
}

/* ======================================================================
   SPEECH
   ====================================================================== */
var VOICE=null;
function pickVoice(){
  try{
    var vs=speechSynthesis.getVoices()||[];
    var pref=['Google US English','Samantha','Microsoft Aria','Microsoft Jenny','Alex'];
    for(var i=0;i<pref.length;i++){for(var j=0;j<vs.length;j++){if(vs[j].name.indexOf(pref[i])===0){VOICE=vs[j];return;}}}
    for(var k=0;k<vs.length;k++){if(/^en[-_]US/i.test(vs[k].lang)){VOICE=vs[k];return;}}
    for(var m=0;m<vs.length;m++){if(/^en/i.test(vs[m].lang)){VOICE=vs[m];return;}}
  }catch(e){}
}
if(window.speechSynthesis){pickVoice();speechSynthesis.onvoiceschanged=pickVoice;}
var LN={a:'ay',b:'bee',c:'see',d:'dee',e:'E',f:'eff',g:'gee',h:'aitch',i:'eye',j:'jay',k:'kay',l:'el',m:'em',n:'en',o:'oh',p:'pee',q:'cue',r:'ar',s:'ess',t:'tee',u:'you',v:'vee',w:'double you',x:'ex',y:'why',z:'zee'};
function letterSay(ch){
  var lo=ch.toLowerCase(); if(!LN[lo]) return ch;
  return (ch!==lo?'capital ':'')+LN[lo];
}
/* text for the ear: blanks are "blank", a lone I is "eye" */
function forEar(t){
  return String(t).replace(/[“”"]?_{2,}[“”"]?/g,' blank ').replace(/\bI\b(?=[\s.,!?]|$)/g,'eye').replace(/\s+/g,' ').trim();
}
var speakToken=0;
function stopTalk(){speakToken++;try{speechSynthesis.cancel();}catch(e){}setTalking(false);}
/* parts: array of {t:text, gap:ms after, rate, lang} */
function speakSeq(parts,done){
  stopTalk(); var my=++speakToken; var i=0;
  if(!window.speechSynthesis){if(done)done();return;}
  setTalking(true);
  function next(){
    if(my!==speakToken) return;
    if(i>=parts.length){setTalking(false);if(done)done();return;}
    var p=parts[i++]; var u=new SpeechSynthesisUtterance(p.t);
    if(p.lang&&!/^en/.test(p.lang)){u.lang=p.lang;}else{if(VOICE)u.voice=VOICE;u.lang='en-US';}
    u.rate=p.rate||0.85;
    var fired=false;
    function after(){if(fired)return;fired=true;setTimeout(next,p.gap||0);}
    u.onend=after;u.onerror=after;
    /* Chrome can drop onend; fall back on a length-based timer */
    setTimeout(after,Math.max(1600,p.t.length*140/(u.rate||1))+(p.gap||0));
    try{speechSynthesis.speak(u);}catch(e){after();}
  }
  next();
}
function say(t,rate,lang){speakSeq([{t:forEar(t),rate:rate||0.85,lang:lang}]);}
function spellParts(word,slow){
  var out=[],gap=slow?1100:650,r=slow?0.6:0.8;
  for(var i=0;i<word.length;i++){
    var c=word[i];
    if(c===' '){out.push({t:'new word',rate:r,gap:gap});continue;}
    out.push({t:letterSay(c),rate:r,gap:gap});
  }
  return out;
}
var TALKING=false;
function setTalking(on){
  TALKING=on;
  var p=document.querySelector('.play'); if(p)p.classList.toggle('talk',on);
  var l=document.querySelector('.db.lead'); if(l)l.classList.toggle('talk',on);
}


var GP_CSS="\n:root{\n  --ink:#1b2a2f; --page:#dfe8ee; --paper:#ffffff; --bean:#1e8c45; --bean2:#27a356; --leaf:#e3f4e6;\n  --soil:#7a4f2c; --gold:#f2b632; --sky:#eef6fb; --muted:#4c5f66;\n}\n*{box-sizing:border-box}\nhtml,body{margin:0}\nbody{font-family:'Nunito',system-ui,-apple-system,Segoe UI,sans-serif;background:var(--page);color:var(--ink);font-size:17px;line-height:1.45;padding-bottom:96px}\nbutton,select,input{font-family:inherit}\nbutton{cursor:pointer}\n:focus-visible{outline:3px solid var(--gold);outline-offset:2px}\n\n/* ---------- sign-in ---------- */\n#gate{position:fixed;inset:0;z-index:200;background:#1b2a2f;display:flex;align-items:center;justify-content:center;padding:18px;overflow:auto}\n#gate .box{background:#fff;border:3px solid #000;border-radius:16px;box-shadow:6px 6px 0 rgba(0,0,0,.35);padding:24px 22px;max-width:420px;width:100%}\n#gate h2{margin:0 0 4px;font-size:1.5rem;font-weight:900}\n#gate p.sub{margin:0 0 10px;color:var(--muted);font-size:.95rem}\n#gate label{display:block;font-weight:800;font-size:.85rem;margin:10px 0 4px}\n#gate input,#gate select{width:100%;font-size:1rem;padding:10px 12px;border:2px solid var(--ink);border-radius:10px;background:#fff;color:var(--ink)}\n#gate .row2{display:flex;gap:10px}#gate .row2>div{flex:1}\n#gate .go{width:100%;margin-top:16px;padding:13px;border:2px solid #000;border-radius:12px;background:var(--bean);color:#fff;font-weight:900;font-size:1.1rem}\n#gate .err{color:#b3261e;font-weight:800;font-size:.9rem;margin-top:8px;min-height:1.2em}\n#gate .gart{float:right;width:96px;margin:0 0 6px 10px}\n\n/* ---------- top bar ---------- */\n#bar{position:sticky;top:0;z-index:60;background:var(--ink);color:#fff;display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 14px;border-bottom:3px solid #000}\n#bar .ttl{font-weight:900;font-size:1.05rem;margin-right:6px}\n#bar .parts{display:flex;gap:6px;flex-wrap:wrap}\n#bar .pt{border:2px solid #fff;background:transparent;color:#fff;border-radius:999px;padding:4px 12px;font-weight:800;font-size:.85rem}\n#bar .pt.on{background:#fff;color:var(--ink)}\n#bar .sp{margin-left:auto;display:flex;align-items:center;gap:8px;flex-wrap:wrap}\n#bar label{font-size:.8rem;font-weight:800}\n#bar select{border:2px solid #fff;border-radius:8px;background:#fff;color:var(--ink);font-weight:800;padding:4px 6px}\n#dot{width:12px;height:12px;border-radius:50%;background:#8a9a9f;display:inline-block}\n#dot.ok{background:#6ee59a}#dot.saving{background:var(--gold)}#dot.err{background:#ff8a7a}\n#savetxt,#who{font-size:.8rem;font-weight:700;opacity:.9}\n#neterr{display:none;background:#b3261e;color:#fff;font-weight:800;text-align:center;padding:8px;border-bottom:2px solid #000}\n#trwarn{display:none;background:#fff3c4;color:#5a4300;font-weight:800;text-align:center;padding:6px;border-bottom:2px solid #000}\n\n/* ---------- slide ---------- */\n#deck{max-width:1320px;margin:0 auto;padding:14px 14px 0}\n.slide.anim{animation:slideIn .28s ease-out}\n@keyframes slideIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}\n@media (prefers-reduced-motion:reduce){.slide{animation:none}}\n.counter{font-weight:900;font-size:.9rem;color:var(--muted);margin:0 0 8px}\n\n.dirgrid{display:grid;grid-template-columns:1.35fr 1fr 1fr 1fr;gap:10px;margin-bottom:12px}\n.db{position:relative;background:#fff;border:2px solid var(--ink);border-radius:12px;box-shadow:3px 3px 0 rgba(27,42,47,.22);padding:0 0 10px;min-height:96px;display:flex;flex-direction:column;overflow:hidden}\n.db .hd{display:flex;align-items:center;gap:6px;padding:4px 6px 4px 6px;color:#fff;font-weight:800;font-size:.82rem;min-height:30px}\n.db.en .hd{padding-left:12px}\n.db.long .tx{font-size:.93rem}\n.db.en.long .tx{font-size:clamp(1.02rem,1.35vw,1.22rem)}\n.db .tx bdi{unicode-bidi:isolate}\n.db .hd select{font-weight:800;font-size:.78rem;border:1.5px solid #fff;border-radius:7px;background:rgba(255,255,255,.95);color:var(--ink);padding:1px 3px;max-width:118px}\n.db .tx{padding:8px 12px 2px;font-size:1rem;font-weight:600}\n.db .tx[dir=rtl]{text-align:right;font-size:1.08rem}\n.db .ear{margin-left:auto;border:1.5px solid #fff;background:#fff;border-radius:7px;font-size:.9rem;padding:0 6px;line-height:1.5}\n.db.mine{outline:4px solid var(--gold);outline-offset:-1px}\n.db.mine .hd select{outline:3px solid var(--gold)}\n.db.mine .hd::after{content:'\u2605 mine';order:2;font-size:.72rem;background:var(--gold);color:#000;border-radius:6px;padding:0 5px;margin-left:4px}\n.db.en{border:4px solid #000;box-shadow:5px 5px 0 rgba(0,0,0,.3)}\n.db.en .hd{background:#000}\n.db.en .tx{font-size:clamp(1.12rem,1.55vw,1.42rem);font-weight:900;line-height:1.35}\n.db.lead{background:var(--sky);border-style:solid;align-items:center;justify-content:center;flex-direction:row;padding:6px 8px;gap:6px}\n.lead svg{width:96px;height:96px;flex:0 0 auto}\n.bubble{position:relative;background:#fff;border:2px solid var(--ink);border-radius:14px;padding:6px 10px;font-weight:800;font-size:.95rem;max-width:180px}\n.bubble::before{content:'';position:absolute;left:-10px;top:50%;margin-top:-8px;border:8px solid transparent;border-right-color:var(--ink);border-left:0}\n.lead .waves{opacity:0;transition:opacity .2s}\n.lead.talk .waves{opacity:1;animation:wv .6s infinite alternate}\n@keyframes wv{from{transform:translateX(0)}to{transform:translateX(3px)}}\n.miniplay{margin:8px 0 0 10px;background:var(--bean);color:#fff;border:2px solid #000;border-radius:999px;padding:6px 16px;font-weight:900;font-size:1.05rem;box-shadow:0 3px 0 #0d4f25}\n.typing{color:var(--muted);font-style:italic;font-weight:600}\n\n/* ---------- stage ---------- */\n.stage{background:#fff;border:3px solid #000;border-radius:16px;box-shadow:6px 6px 0 rgba(0,0,0,.25);padding:16px;display:flex;flex-wrap:wrap;gap:18px;align-items:flex-start}\n.stage::after{content:'';display:block;clear:both}\n.playcol{flex:0 0 150px;display:flex;flex-direction:column;align-items:center;gap:10px}\n.play{width:132px;height:132px;border-radius:50%;background:var(--bean);border:4px solid #000;box-shadow:0 6px 0 #0d4f25;display:flex;align-items:center;justify-content:center;position:relative;transition:transform .1s}\n.play:active{transform:translateY(4px);box-shadow:0 2px 0 #0d4f25}\n.play svg{width:60px;height:60px;margin-left:8px}\n.play.talk::after{content:'';position:absolute;inset:-12px;border-radius:50%;border:4px solid var(--bean2);animation:ring 1s infinite}\n@keyframes ring{from{opacity:1;transform:scale(.92)}to{opacity:0;transform:scale(1.18)}}\n.playlbl{font-weight:900;font-size:1.15rem}\n.rep{border:2px solid var(--ink);background:#fff;border-radius:12px;padding:7px 10px;font-weight:800;font-size:.9rem;text-align:center;line-height:1.25}\n.rep small{display:block;font-weight:600;color:var(--muted)}\n.anscol{flex:1 1 360px;min-width:260px}\n.instr{font-size:1.35rem;font-weight:900;margin:2px 0 10px}\n.line{min-height:110px;display:flex;align-items:center;justify-content:center;border:3px dashed #8fa3aa;border-radius:14px;background:#fbfdfc;padding:10px;text-align:center}\n.line .blank{font-size:3.2rem;font-weight:900;color:#9fb0b6;letter-spacing:.08em}\n.line .ans{font-size:clamp(2.4rem,6vw,4.6rem);font-weight:900;color:var(--bean);line-height:1.1;animation:pop .35s ease-out;letter-spacing:.01em}\n.line .ans.sent{font-size:clamp(1.9rem,4.4vw,3.3rem)}\n.line.shown{border-style:solid;border-color:var(--bean);background:var(--leaf)}\n@keyframes pop{from{transform:scale(.6);opacity:0}to{transform:none;opacity:1}}\n.cap1{text-decoration:underline;text-decoration-thickness:6px;text-decoration-color:#2457a6;text-underline-offset:8px}\n.note{font-weight:800;color:var(--muted);margin:8px 0 0;font-size:1rem}\n.btnrow{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px;align-items:center}\n.check{background:#2457a6;color:#fff;border:3px solid #000;border-radius:14px;padding:10px 26px;font-size:1.25rem;font-weight:900;box-shadow:0 5px 0 #12305e}\n.check:active{transform:translateY(3px);box-shadow:0 2px 0 #12305e}\n.check[disabled]{opacity:.45;cursor:default}\n.ear2{border:2px solid var(--ink);background:#fff;border-radius:10px;font-size:1.1rem;padding:3px 9px;font-weight:800}\n.self{margin-top:12px;border:2px solid var(--ink);border-radius:12px;background:#fffbea;padding:10px 12px}\n.self .q{font-weight:900;font-size:1.05rem}\n.self .q2{font-weight:700;color:var(--muted);margin:2px 0 8px}\n.yes{background:var(--bean);color:#fff;border:2px solid #000;border-radius:12px;padding:8px 16px;font-weight:900;font-size:1.05rem}\n.notyet{background:#fff;color:var(--ink);border:2px solid #000;border-radius:12px;padding:8px 16px;font-weight:900;font-size:1.05rem}\n.okmark{display:inline-flex;align-items:center;gap:6px;font-weight:900;color:var(--bean);font-size:1.15rem}\n.fixmsg{margin-top:8px;font-weight:800;color:#5b3a00}\n.artcol{flex:0 0 240px}\n.art{border:2px solid var(--ink);border-radius:12px;background:#fff;box-shadow:3px 3px 0 rgba(0,0,0,.18);padding:4px;display:block}\n.art svg{width:100%;height:auto;display:block}\n.artcol .cap{font-weight:800;text-align:center;margin-top:4px;font-size:.95rem}\n.hidden{display:none !important}\n.aloudline{min-height:70px;padding:4px 10px}\n.aloudline .ans{font-size:clamp(2rem,5vw,3.4rem)}\n/* lift the sitewide tap hint above the slide buttons */\n.gal-listen-hint{bottom:92px !important}\n\n/* picture slides */\n.picbox{flex:1 1 380px;max-width:470px;border:3px solid #000;border-radius:12px;background:#fff;padding:6px;box-shadow:4px 4px 0 rgba(0,0,0,.22)}\n.picbox img{width:100%;height:auto;display:block;border-radius:6px}\n.picbox .lbl{font-weight:900;font-size:1.3rem;margin:4px 4px 0}\n.picbox .credit{font-size:.78rem;color:var(--muted);margin:0 4px}\n.models{list-style:none;padding:0;margin:8px 0 0}\n.models li{border:2px solid var(--bean);background:var(--leaf);border-radius:10px;padding:6px 10px;margin:6px 0;font-size:1.3rem;font-weight:900;color:#145e30;display:flex;gap:8px;align-items:center;animation:pop .35s ease-out}\n\n/* circle slides */\n.circ{position:relative;display:inline-block}\n.circ svg.ring{position:absolute;left:50%;top:50%;width:1.6em;height:1.6em;transform:translate(-50%,-50%);overflow:visible;pointer-events:none}\n.circ svg.ring ellipse{fill:none;stroke:#d64545;stroke-width:5;stroke-dasharray:200;stroke-dashoffset:200;animation:draw .8s .2s ease-out forwards}\n@keyframes draw{to{stroke-dashoffset:0}}\n\n/* spell aloud */\n.chips{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 10px}\n.chip{border:2px solid var(--ink);background:#fff;border-radius:999px;padding:6px 14px;font-weight:900;font-size:1.05rem}\n.chip.on{background:var(--ink);color:#fff}\n.chip.done::after{content:' \u2713';color:var(--bean2)}\n.own{display:flex;gap:6px;align-items:center}\n.own input{border:2px solid var(--ink);border-radius:10px;padding:6px 10px;font-size:1rem;width:170px}\n.letters{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}\n.letters span{display:inline-flex;align-items:center;justify-content:center;min-width:52px;height:64px;border:3px solid var(--bean);background:#fff;border-radius:10px;font-size:2.4rem;font-weight:900;color:var(--bean);animation:pop .3s ease-out both}\n.letters span.gap{border:0;background:none;min-width:22px}\n\n/* intro + end */\n.introgrid{display:flex;flex-wrap:wrap;gap:18px;align-items:center;width:100%}\n.introart{flex:1 1 320px;max-width:460px}\n.bigq{font-size:1.4rem;font-weight:900}\n.endlist{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}\n.endlist button{border:2px solid var(--ink);background:#fff;border-radius:10px;padding:5px 10px;font-weight:800}\n.turnin{background:var(--bean);color:#fff;border:3px solid #000;border-radius:14px;padding:12px 30px;font-size:1.3rem;font-weight:900;box-shadow:0 5px 0 #0d4f25}\n.members{border:2px solid var(--ink);border-radius:10px;padding:8px 10px;font-size:1rem;width:100%;max-width:520px}\n\n/* bottom nav */\n#nav{position:fixed;left:0;right:0;bottom:0;z-index:70;background:#fff;border-top:3px solid #000;display:flex;align-items:center;gap:12px;padding:10px 14px}\n#nav .nb{border:3px solid #000;border-radius:14px;padding:10px 22px;font-size:1.2rem;font-weight:900;background:#fff;color:var(--ink)}\n#nav .nb.next{background:var(--ink);color:#fff;margin-left:auto}\n#nav .nb.next.pulse{animation:pls 1.4s infinite}\n@keyframes pls{0%,100%{box-shadow:0 0 0 0 rgba(242,182,50,.9)}50%{box-shadow:0 0 0 9px rgba(242,182,50,0)}}\n#nav .nb[disabled]{opacity:.35;cursor:default}\n#prog{flex:1;display:flex;gap:4px;flex-wrap:wrap;justify-content:center}\n#prog i{display:block;width:13px;height:13px;border-radius:50%;border:2px solid var(--ink);background:#fff;cursor:pointer}\n#prog i.ok{background:var(--bean2)}#prog i.cur{background:var(--gold);transform:scale(1.25)}\n\n/* lion + fireworks */\n.lion{cursor:pointer}\n.fw{position:fixed;width:10px;height:10px;border-radius:50%;pointer-events:none;z-index:300}\n\n@media (max-width:980px){\n  .dirgrid{grid-template-columns:1fr 1fr}\n  .db.en{grid-column:1 / -1}\n  .playcol{flex-basis:100%;flex-direction:row;justify-content:center}\n  .artcol{flex:1 1 100%;max-width:300px;margin:0 auto}\n}\n@media (max-width:520px){\n  .dirgrid{grid-template-columns:1fr}\n  #nav .nb{padding:8px 12px;font-size:1rem}\n  .play{width:104px;height:104px}\n}\n\n.qbig{font-size:1.5rem;font-weight:900;line-height:1.3}\n.instr .q2{font-size:1.1rem;font-weight:700;color:var(--muted)}\n.choices{display:flex;flex-direction:column;gap:8px;margin-top:6px}\n.chrow{display:flex;gap:8px;align-items:center}\n.ch{flex:1;text-align:left;border:3px solid var(--ink);background:#fff;border-radius:14px;padding:6px 12px;font-size:1.12rem;font-weight:800;color:var(--ink);box-shadow:0 4px 0 rgba(27,42,47,.3);display:flex;align-items:center;gap:10px;transition:opacity .4s}\n.ch:hover:not([disabled]){background:#f3f8fb}\n.ch .lt{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:var(--ink);color:#fff;font-size:1rem;flex:0 0 auto}\n.ch.gone{opacity:.28;box-shadow:none}\n.ch.cross{opacity:.28;text-decoration:line-through;box-shadow:none}\n.ch.right{background:var(--leaf);border-color:var(--bean);color:#145e30}\n.ch.right .lt{background:var(--bean)}\n.ch .tick{margin-left:auto;font-size:1.5rem;color:var(--bean)}\n.ear2.sm{font-size:.95rem;padding:2px 7px}\n.why{margin:4px 0 8px;border:2px solid var(--bean);background:var(--leaf);border-radius:12px;padding:10px 12px}\n.hint{margin:4px 0 8px;border:2px solid #b07d00;background:#fff6d6;border-radius:12px;padding:10px 12px}\n.pick{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px;margin-top:10px}\n.pk{display:block;border:3px solid #000;border-radius:14px;background:#fff;box-shadow:4px 4px 0 rgba(0,0,0,.22);padding:10px;color:var(--ink);text-decoration:none}\n.pk:hover{background:#f3f8fb}\n.pk b{display:block;font-size:1.15rem;margin-top:6px}\n.pkart{display:block;border:2px solid var(--ink);border-radius:10px;overflow:hidden}\n.pkart svg{width:100%;height:auto;display:block}\n.art img,.introart img{width:100%;height:auto;display:block;border-radius:8px}\n\n.gal-listen-hint{bottom:92px !important}\n";
/* ======================================================================
   CORE — decks, state, render, events
   ====================================================================== */
var SUPA_URL='https://lhmwtfyceilgndpygivj.supabase.co';
var SUPA_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
var PROXY='https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function hdr(pref){var h={apikey:SUPA_KEY,Authorization:'Bearer '+SUPA_KEY,'Content-Type':'application/json'};if(pref)h.Prefer=pref;return h;}

/* extra built-in directions (the T-106 set is above) */
DIR.ask={en:'Listen to the question. Write your answer.',
  'zh-CN':'听问题，写下你的答案。',es:'Escucha la pregunta. Escribe tu respuesta.',th:'ฟังคำถาม แล้วเขียนคำตอบของคุณ',
  vi:'Nghe câu hỏi. Viết câu trả lời của em.',ne:'प्रश्न सुन्नुहोस्। आफ्नो उत्तर लेख्नुहोस्।',ar:'استمع إلى السؤال. اكتب إجابتك.'};
DIR.mc={en:'Listen to the question. Talk with your group. Choose the answer.',
  'zh-CN':'听问题。和小组讨论。选出答案。',es:'Escucha la pregunta. Habla con tu grupo. Elige la respuesta.',th:'ฟังคำถาม คุยกับกลุ่มของคุณ แล้วเลือกคำตอบ',
  vi:'Nghe câu hỏi. Nói chuyện với nhóm. Chọn câu trả lời.',ne:'प्रश्न सुन्नुहोस्। आफ्नो समूहसँग कुरा गर्नुहोस्। उत्तर छान्नुहोस्।',ar:'استمع إلى السؤال. تحدّث مع مجموعتك. اختر الإجابة.'};
DIR.qintro={en:'Now we will answer questions. Talk with your group first.',
  'zh-CN':'现在我们来回答问题。先和小组讨论。',es:'Ahora vamos a contestar preguntas. Primero habla con tu grupo.',th:'ตอนนี้เราจะตอบคำถาม คุยกับกลุ่มของคุณก่อน',
  vi:'Bây giờ chúng ta sẽ trả lời câu hỏi. Hãy nói chuyện với nhóm trước.',ne:'अब हामी प्रश्नहरूको उत्तर दिनेछौं। पहिले आफ्नो समूहसँग कुरा गर्नुहोस्।',ar:'الآن سنجيب عن أسئلة. تحدّث مع مجموعتك أولًا.'};
DIR.mcno={en:'Not this one. Listen again and look for a clue.',
  'zh-CN':'不是这个。再听一遍，找一找线索。',es:'Esta no. Escucha otra vez y busca una pista.',th:'ไม่ใช่ข้อนี้ ฟังอีกครั้งและหาคำใบ้',
  vi:'Không phải câu này. Nghe lại và tìm gợi ý.',ne:'यो होइन। फेरि सुन्नुहोस् र संकेत खोज्नुहोस्।',ar:'ليست هذه. استمع مرة أخرى وابحث عن دليل.'};

DIR.done={en:'Great work! Your group finished. Now turn it in.',
  'zh-CN':'做得好！你们小组完成了。现在请提交。',es:'¡Muy bien! Tu grupo terminó. Ahora entrégalo.',th:'เก่งมาก! กลุ่มของคุณทำเสร็จแล้ว ส่งงานได้เลย',
  vi:'Làm tốt lắm! Nhóm của em đã xong. Bây giờ hãy nộp bài.',ne:'धेरै राम्रो! तपाईंको समूहले सक्यो। अब बुझाउनुहोस्।',ar:'عمل رائع! أنهت مجموعتك. سلّمها الآن.'};
window.GP_DECKS=window.GP_DECKS||{};
var DECKS=[], KEY='', TITLE='', SLIDES=[], STORE=null, GRADED=[], PARTNAMES=[];
var W={v:2,cur:0,slides:{},aloud:{},order:{},slots:DEFAULT_SLOTS.slice(),mine:'',members:'',lion:false,turned:false};
var ME=null, LOADED=false, DIRTY=false, saveTimer=null, LASTID=null;

/* ---------- loading decks: file first (group/decks/<slug>.js), then the group_decks table ---------- */
function loadScript(src){return new Promise(function(res){var s=document.createElement('script');s.src=src;s.onload=function(){res(true);};s.onerror=function(){res(false);};document.head.appendChild(s);});}
function getDeck(slug){
  if(GP_DECKS[slug])return Promise.resolve(GP_DECKS[slug]);
  return loadScript('/readings/group/decks/'+encodeURIComponent(slug)+'.js').then(function(){
    if(GP_DECKS[slug])return GP_DECKS[slug];
    return fetch(SUPA_URL+'/rest/v1/group_decks?select=slug,title,data&slug=eq.'+encodeURIComponent(slug),{headers:hdr()})
      .then(function(r){return r.ok?r.json():[];}).then(function(rows){
        if(rows&&rows[0]&&rows[0].data){var d=rows[0].data;d.title=d.title||rows[0].title;GP_DECKS[slug]=d;return d;}
        return null;}).catch(function(){return null;});
  });
}
function resolveArt(deck,key){
  if(!key)return '';
  if(deck.art&&deck.art[key])return deck.art[key];
  if(ART[key])return ART[key];
  return '';
}
function resolveImg(deck,v){
  if(v==null||v==='')return '';
  if(typeof v==='number')return (deck.pics||[])[v]||'';
  return String(v);
}
function compose(list){
  DECKS=list; var multi=list.length>1; SLIDES=[]; PARTNAMES=[];
  KEY=list.map(function(d){return d.slug;}).join('+');
  TITLE=multi?list.map(function(d){return d.short||d.title;}).join(' + '):list[0].title;
  list.forEach(function(d){
    (d.slides||[]).forEach(function(s,i){
      if(s.kind==='end'&&multi)return;
      var c=JSON.parse(JSON.stringify(s));
      c.id=(multi?d.slug+':':'')+(s.id||(s.kind+i));
      c._deck=d;
      var p=s.part||'Practice'; c._part=(multi?(d.short||d.title)+' · ':'')+p;
      if(PARTNAMES.indexOf(c._part)<0)PARTNAMES.push(c._part);
      c._art=s.kind==='cap'?capArt(s.ans):resolveArt(d,s.art);
      c._img=resolveImg(d,s.img);
      SLIDES.push(c);
    });
  });
  if(!SLIDES.length||SLIDES[SLIDES.length-1].kind!=='end'){
    SLIDES.push({id:'end',kind:'end',dir:'done',_part:PARTNAMES[PARTNAMES.length-1]||'Practice',_art:ART.trophy,_deck:list[0]});
  } else SLIDES[SLIDES.length-1]._art=SLIDES[SLIDES.length-1]._art||ART.trophy;
  GRADED=SLIDES.filter(function(s){return s.kind!=='intro'&&s.kind!=='end';});
  STORE=(!multi&&list[0].store)?list[0].store:{table:'group_work',match:{deck:KEY},conflict:'email,deck',extra:true};
  document.title=TITLE+' · Group Practice · Mr. Toby';
  $('ttl').textContent=TITLE;
  setScore();
}

/* ---------- text helpers: a slide's own words may carry their own translations ---------- */
function T(v,code){ /* v = string or {en, es, ...} */
  if(v==null)return '';
  if(typeof v==='string')return code&&code!=='en'?null:v;
  if(!code||code==='en')return v.en||'';
  return v[code]||null;
}
function dirOf(s){var d=s.dir;if(!d)d=s.kind==='mc'?'mc':s.kind==='ask'?'ask':s.kind;return typeof d==='string'?(DIR[d]||{en:d}):d;}
function dirText(s,code){var d=dirOf(s);var x=d[code];return x?String(x).replace('{n}',s.n||''):null;}
function dirEn(s){return String(dirOf(s).en||'').replace('{n}',s.n||'');}

/* ======================================================================
   STATE + SAVE (load before save)
   ====================================================================== */
function S(id){if(!W.slides[id])W.slides[id]={plays:0,checked:false,ok:false,misses:0};return W.slides[id];}
function setScore(){var got=0;GRADED.forEach(function(s){if(W.slides[s.id]&&W.slides[s.id].ok)got++;});window.GAL_SCORE=got;window.GAL_MAX=GRADED.length;}
function dot(c,t){$('dot').className=c||'';$('savetxt').textContent=t||'';}
function touch(){DIRTY=true;setScore();if(!LOADED)return;dot('saving','Saving…');clearTimeout(saveTimer);saveTimer=setTimeout(save,2500);}
function rowOut(){
  var r={email:ME.email,student_name:ME.name,period:ME.period,answers:W,turned_in:!!W.turned,updated_at:new Date().toISOString()};
  Object.keys(STORE.match).forEach(function(k){r[k]=STORE.match[k];});
  if(STORE.extra){r.lang=W.mine||null;r.score=window.GAL_SCORE;r.max_score=window.GAL_MAX;}
  return r;
}
function save(){
  if(!ME||!LOADED)return;
  return fetch(SUPA_URL+'/rest/v1/'+STORE.table+'?on_conflict='+STORE.conflict,{method:'POST',headers:hdr('resolution=merge-duplicates,return=minimal'),body:JSON.stringify([rowOut()])})
   .then(function(r){if(r.ok){DIRTY=false;dot('ok','Saved');$('neterr').style.display='none';}else{dot('err','Not saved');$('neterr').style.display='block';}})
   .catch(function(){dot('err','Offline');$('neterr').style.display='block';});
}
setInterval(function(){if(DIRTY)save();},20000);
window.addEventListener('beforeunload',function(){if(DIRTY)save();});
function mergeIn(o){
  if(!o||typeof o!=='object')return;
  Object.keys(o.slides||{}).forEach(function(k){var a=o.slides[k],b=W.slides[k];
    if(!b){W.slides[k]=a;return;}
    b.plays=Math.max(b.plays||0,a.plays||0);b.misses=Math.max(b.misses||0,a.misses||0);b.repeats=Math.max(b.repeats||0,a.repeats||0);
    b.checked=b.checked||a.checked;b.ok=b.ok||a.ok;if(a.tries&&(!b.tries||a.tries.length>b.tries.length))b.tries=a.tries;});
  Object.keys(o.aloud||{}).forEach(function(k){var a=o.aloud[k],b=W.aloud[k];if(!b){W.aloud[k]=a;return;}b.ok=b.ok||a.ok;b.checked=b.checked||a.checked;b.misses=Math.max(b.misses||0,a.misses||0);});
  Object.keys(o.order||{}).forEach(function(k){if(!W.order[k])W.order[k]=o.order[k];});
  if(Array.isArray(o.slots)&&o.slots.length===6)W.slots=o.slots;
  if(o.members&&!W.members)W.members=o.members;
  if(typeof o.cur==='number')W.cur=Math.max(0,Math.min(SLIDES.length-1,o.cur));
  W.lion=W.lion||o.lion;W.turned=W.turned||o.turned;
}
function load(cb){
  dot('saving','Loading…');
  var q='?select=answers,turned_in&email=eq.'+encodeURIComponent(ME.email);
  Object.keys(STORE.match).forEach(function(k){q+='&'+k+'=eq.'+encodeURIComponent(STORE.match[k]);});
  fetch(SUPA_URL+'/rest/v1/'+STORE.table+q,{headers:hdr()})
   .then(function(r){if(!r.ok)throw new Error(r.status);return r.json();})
   .then(function(rows){
     if(rows&&rows[0]){mergeIn(rows[0].answers);if(rows[0].turned_in)W.turned=true;}
     LOADED=true;$('neterr').style.display='none';dot('ok','Saved');setScore();if(DIRTY)save();cb&&cb();})
   .catch(function(){$('neterr').style.display='block';dot('err','Not saved');cb&&cb();setTimeout(function(){if(!LOADED)load();},15000);});
}

/* ---------- translation for anything without its own (proxy, 10 s, 3 tries; std.js caches in song_tr) ---------- */
var TCACHE={};
function proxyTr(text,code,cb){
  var L=LBY[code];var key=code+'|'+text;if(TCACHE[key]){cb(TCACHE[key]);return;}
  var tries=0;
  (function attempt(){tries++;
    var ctl=window.AbortController?new AbortController():null;var t=setTimeout(function(){if(ctl)ctl.abort();},10000);
    fetch(PROXY+'?action=translate&mode='+(String(text).split(/\s+/).length<=3?'word':'sentence')+'&idiom='+encodeURIComponent(text)+'&meaning=&lang='+encodeURIComponent(L?L[2]:code),ctl?{signal:ctl.signal}:{})
     .then(function(r){return r.json();})
     .then(function(d){clearTimeout(t);var tr=d&&d.ok&&d.translation;var out=tr&&(tr.equiv||tr.meaning);
       if(out){TCACHE[key]=out;cb(out);}else if(tries<3)attempt();else cb(null);})
     .catch(function(){clearTimeout(t);if(tries<3)attempt();else cb(null);});
  })();
}
function bidi(txt,rtl){var e=esc(txt);return rtl?e.replace(/“([^”]*)”/g,'<bdi dir="ltr">“$1”</bdi>'):e;}

/* ======================================================================
   RENDER
   ====================================================================== */
var PLAYSVG='<svg viewBox="0 0 40 40"><path d="M8 4l28 16-28 16z" fill="#fff"/></svg>';
function playBtn(lbl){return '<button class="play" type="button" data-play="1" aria-label="Play">'+PLAYSVG+'</button>'+(lbl?'<div class="playlbl">'+lbl+'</div>':'');}
function repBtn(){return '<button class="rep" type="button" data-repeat="1">🔁 Can you repeat that, please?<small>slower</small></button>';}
function langOptions(sel){return LANGS.map(function(l){return '<option value="'+l[0]+'"'+(l[0]===sel?' selected':'')+'>'+esc(l[1])+'</option>';}).join('');}
function bubbleFor(s){
  var st=W.slides[s.id]||{};
  if(s.kind==='intro')return s.lead||'Press ▶ to listen. Then press Next.';
  if(s.kind==='end')return 'You did it! 🎉';
  if(s.kind==='aloud')return 'Pick a word. Spell it out loud!';
  if(s.kind==='mc')return st.ok?'Yes! Press Next.':'Talk first. Then tap one answer.';
  if(st.ok)return 'Great! Press Next.';
  if(st.checked)return 'Look! Is it the same?';
  if(st.plays)return 'Write it on your paper. Then press Check.';
  return 'Press ▶ to listen.';
}
function dirGrid(s){
  var en=dirEn(s);
  var h='<div class="dirgrid">';
  h+='<div class="db en'+(en.length>120?' long':'')+'" translate="yes"><div class="hd">English<button class="ear" type="button" data-say-en="1" aria-label="Listen">🔊</button></div><div class="tx">'+esc(en)+'</div></div>';
  for(var i=0;i<6;i++){
    var code=W.slots[i],L=LBY[code]||LANGS[i],txt=dirText(s,code);
    h+='<div class="db'+(code===W.mine?' mine':'')+((txt||'').length>120?' long':'')+'" data-slot="'+i+'" translate="no"><div class="hd" style="background:'+L[4]+'">'+
       '<select data-slotsel="'+i+'" aria-label="Change language">'+langOptions(code)+'</select>'+
       '<button class="ear" type="button" data-say-slot="'+i+'" aria-label="Listen">🔊</button></div>'+
       '<div class="tx"'+(L[5]?' dir="rtl"':'')+' lang="'+code+'">'+(txt?bidi(txt,L[5]):'<span class="typing">Translating…</span>')+'</div></div>';
  }
  h+='<div class="db lead" translate="no">'+ART.lion+'<div><div class="bubble" id="bub">'+esc(bubbleFor(s))+'</div>'+(s.kind==='intro'||s.kind==='end'?'<button class="miniplay" type="button" data-play="1">▶ Play</button>':'')+'</div></div>';
  return h+'</div>';
}
function fillProxySlots(s){
  for(var i=0;i<6;i++){(function(i){
    var code=W.slots[i];if(dirText(s,code))return;var en=dirEn(s);
    proxyTr(en,code,function(out){var box=document.querySelector('.db[data-slot="'+i+'"] .tx');if(!box||W.slots[i]!==code)return;
      box.innerHTML=out?bidi(out,LBY[code]&&LBY[code][5]):esc(en);if(!out)box.style.color='#8a9a9f';});
  })(i);}
}
/* a line in English + the student's language (own translation, built-in, or proxy) */
function line2(v,cls){
  var en=typeof v==='string'&&DIR[v]?DIR[v].en:T(v,'en');
  var code=W.mine&&W.mine!=='en'?W.mine:'';
  var tr=code?(typeof v==='string'&&DIR[v]?DIR[v][code]:T(v,code)):null;
  var L=LBY[code];
  return '<div class="'+(cls||'q')+'">'+esc(en)+'</div>'+(code?'<div class="q2" translate="no" lang="'+code+'"'+(L&&L[5]?' dir="rtl"':'')+' data-tr2="'+esc(en)+'">'+(tr?esc(tr):'')+'</div>':'');
}
function fillLine2(){
  var code=W.mine;if(!code)return;
  Array.prototype.forEach.call(document.querySelectorAll('[data-tr2]'),function(el){
    if(el.textContent)return;proxyTr(el.getAttribute('data-tr2'),code,function(out){if(out)el.textContent=out;});});
}
function selfBlock(s,key){
  var st=S(s.id);
  if(st.ok)return '<div class="self"><span class="okmark">✓ Yes — good work!</span></div>';
  return '<div class="self" id="self">'+line2(key)+
    '<div class="btnrow"><button class="yes" type="button" data-yes="1">👍 Yes, it is the same</button>'+
    '<button class="notyet" type="button" data-notyet="1">✏️ Not yet</button></div><div class="fixmsg" id="fixmsg"></div></div>';
}
function answerHTML(s){
  if(s.kind==='sent'){var a=s.ans;return '<span class="ans sent"><span class="cap1">'+esc(a[0])+'</span>'+esc(a.slice(1))+'</span>';}
  return '<span class="ans">'+esc(s.ans)+'</span>';
}
function blankHTML(s){
  if(s.kind==='letters'){var n=(s.spell||s.ans).length,b='';for(var i=0;i<n;i++)b+='_ ';return '<span class="blank">'+b.trim()+'</span>';}
  if(s.kind==='cap')return '<span class="blank">“ __ ”</span>';
  return shapeBlank(s.ans,s.kind==='sent');
}
/* one blank per letter, so the line shows the word's shape: backpack = 8, can't = 3 + ' + 1, find = 4.
   Apostrophes and hyphens stay (they are part of the word); other punctuation is hidden so the
   period and capital are still the student's job. Words in a sentence wrap as whole words. */
function shapeBlank(t,isSent){
  var words=String(t||'').split(/\s+/).filter(Boolean),longest=0;
  var sent=isSent||words.length>1,cw=sent?1.35:1.9;
  var cell='display:inline-block;width:'+cw+'rem;height:'+(cw*1.25)+'rem;margin:0 '+(cw*0.17)+'rem;border-bottom:'+(sent?3:4)+'px solid #3d5560;vertical-align:bottom';
  var mark='display:inline-block;width:'+(cw*0.45)+'rem;text-align:center;font-weight:900;font-size:'+(cw*1.1)+'rem;line-height:1;color:var(--ink);vertical-align:bottom';
  var h=words.map(function(w){
    var cells=w.split('').filter(function(c){return /[A-Za-z0-9\u00C0-\u024F'\u2019-]/.test(c);});
    if(cells.length>longest)longest=cells.length;
    return '<span style="white-space:nowrap;display:inline-block;margin:.25rem '+(cw*0.55)+'rem">'+cells.map(function(c){
      return /['\u2019-]/.test(c)?'<span style="'+mark+'">'+esc(c)+'</span>':'<span style="'+cell+'"></span>';}).join('')+'</span>';
  }).join('');
  return '<span class="blank" aria-label="'+words.length+' word(s)" style="font-size:1rem;letter-spacing:0;line-height:1;display:inline-block;padding:.3rem 0">'+h+'</span>';
}
function ringSVG(){return '<svg class="ring" viewBox="-30 -30 60 60"><ellipse cx="0" cy="0" rx="24" ry="22"/></svg>';}
function circled(sent,target){
  var i,len;
  if(target==='period'){i=sent.search(/[.?!]\s*$/);len=1;}
  else if(target==='cap'){i=sent.search(/[A-Z]/);len=1;}
  else {i=sent.indexOf(target);len=String(target).length;}
  if(i<0)return esc(sent);
  return esc(sent.slice(0,i))+'<span class="circ">'+esc(sent.substr(i,len))+ringSVG()+'</span>'+esc(sent.slice(i+len));
}
function lettersHTML(w){return '<div class="letters" style="margin-top:10px">'+w.split('').map(function(c,i){return c===' '?'<span class="gap"></span>':'<span style="animation-delay:'+(i*0.12)+'s">'+esc(c)+'</span>';}).join('')+'</div>';}
function artCol(s){var a=s._img?'<img src="'+esc(s._img)+'" alt="">':s._art;return a?'<div class="artcol"><div class="art">'+a+'</div></div>':'';}

/* multiple choice: per-student order, stored; the right answer never sits in the same slot more than 3 times running */
function mcOrder(s){
  if(W.order[s.id])return W.order[s.id];
  var n=s.choices.length, prev=[];
  SLIDES.forEach(function(x){if(x.kind==='mc'&&x!==s&&W.order[x.id])prev.push(W.order[x.id].indexOf(0));});
  var o,tries=0;
  do{o=[];for(var i=0;i<n;i++)o.push(i);for(var j=n-1;j>0;j--){var k=Math.floor(Math.random()*(j+1));var t=o[j];o[j]=o[k];o[k]=t;}tries++;}
  while(tries<30&&prev.length>=3&&prev.slice(-3).every(function(p){return p===o.indexOf(0);}));
  W.order[s.id]=o;DIRTY=true;return o;
}
function qText(s){return T(s.q,'en');}

function render(){
  stopTalk();
  var s=SLIDES[W.cur],st=S(s.id),h='';
  h+='<div class="slide'+(s.id!==LASTID?' anim':'')+'" data-id="'+esc(s.id)+'"><p class="counter">'+esc(s._part)+' · slide '+(W.cur+1)+' of '+SLIDES.length+'</p>';
  h+=dirGrid(s);
  h+='<section class="stage" translate="no">';
  if(s.kind==='intro'){
    var body=s.body?line2(s.body,'bigq'):'';
    h+='<div class="introgrid"><div class="playcol">'+playBtn('Play')+'</div><div class="anscol">'+body+
       (s.repeatTip?'<p class="note">When you need it, press <b>🔁 Can you repeat that, please?</b> — and say it out loud too!</p>':'')+'</div>'+
       (s._img||s._art?'<div class="introart art">'+(s._img?'<img src="'+esc(s._img)+'" alt="" style="width:100%">':s._art)+'</div>':'')+'</div>';
  } else if(s.kind==='word'||s.kind==='sent'||s.kind==='cap'||s.kind==='letters'){
    var instr=dirEn(s).replace(/\s*Do you need me to repeat that\?/,'').replace(/\s*Use a capital letter and a period\./,'').replace(/\s*“_+”/,'').replace(/\s*Listen:.*$/,'');
    h+='<div class="playcol">'+playBtn('Play')+repBtn()+'</div>';
    h+='<div class="anscol"><div class="instr">'+esc(instr)+'</div><div class="line'+(st.checked?' shown':'')+'" id="line">'+(st.checked?answerHTML(s):blankHTML(s))+'</div>';
    if(st.checked&&s.note)h+='<p class="note">'+esc(s.note)+'</p>';
    if(st.checked&&s.kind==='sent')h+='<p class="note">✓ Capital letter at the start &nbsp; ✓ Period at the end</p>';
    h+='<div class="btnrow"><button class="check" type="button" data-check="1"'+(st.checked?' disabled':'')+'>✔ Check</button>'+(st.checked?'<button class="ear2" type="button" data-hear-ans="1">🔊 Hear it</button>':'')+'</div>';
    if(st.checked)h+=selfBlock(s,'same');
    h+='</div>';
    if(st.checked)h+=artCol(s);
  } else if(s.kind==='pic'||s.kind==='ask'){
    if(s.kind==='pic')h+='<div class="picbox">'+(s._img?'<img src="'+esc(s._img)+'" alt="Picture '+esc(s.n)+'">':s._art)+'<div class="lbl">Picture '+esc(s.n)+'</div>'+(s.credit?'<div class="credit">'+esc(s.credit)+'</div>':'')+'</div>';
    h+='<div class="anscol"><div class="playcol" style="flex-direction:row;justify-content:flex-start;flex-basis:auto">'+playBtn('')+repBtn()+'</div>';
    h+='<div class="instr" style="margin-top:12px">'+(s.kind==='pic'?esc('Describe Picture '+s.n+'. Write one sentence.'):line2(s.q,'qbig'))+'</div>';
    h+='<div class="btnrow"><button class="check" type="button" data-check="1"'+(st.checked?' disabled':'')+'>✔ Check</button></div>';
    if(st.checked){
      h+='<ul class="models">'+(s.models||[]).map(function(m,i){return '<li><button class="ear2" type="button" data-hear-model="'+i+'">🔊</button>'+esc(m)+'</li>';}).join('')+'</ul>';
      h+=selfBlock(s,'picsame');
    }
    h+='</div>';
    if(s.kind==='ask'&&(s._art||s._img))h+=artCol(s);
  } else if(s.kind==='mc'){
    var o=mcOrder(s),tries=st.tries||[],wrong=tries.filter(function(x){return x!==0;});
    var cross=wrong.length>=2?crossOne(s,o,wrong):-1;
    h+='<div class="playcol">'+playBtn('Play')+repBtn()+'</div>';
    var fb='';if(st.ok&&s.why)fb='<div class="why">✓ '+line2(s.why,'q')+'</div>';else if(wrong.length)fb='<div class="hint">💡 '+line2(s.hint||'mcno','q')+'</div>';
    h+='<div class="anscol"><div class="instr">'+line2(s.q,'qbig')+'</div>'+fb+'<div class="choices">'+o.map(function(ci,pos){
        var gone=tries.indexOf(ci)>=0&&ci!==0, right=st.ok&&ci===0;
        return '<div class="chrow"><button class="ch'+(gone?' gone':'')+(right?' right':'')+(ci===cross?' cross':'')+'" type="button" data-choice="'+ci+'"'+(gone||st.ok||ci===cross?' disabled':'')+'>'+
          '<span class="lt">'+'ABCDEF'[pos]+'</span>'+esc(s.choices[ci])+(right?' <span class="tick">✓</span>':'')+'</button><button class="ear2 sm" type="button" data-hear-choice="'+ci+'" aria-label="Listen">🔊</button></div>';}).join('')+'</div>';
    h+='</div>'+artCol(s);
  } else if(s.kind==='circle'){
    var sent=s.sentence||'Ana is an old woman.';
    h+='<div class="playcol">'+playBtn('Play')+repBtn()+'</div>';
    h+='<div class="anscol"><div class="instr">'+esc(dirEn(s))+'</div><p class="note">Look at your sentence on your paper.</p>';
    if(st.checked)h+='<div class="line shown"><span class="ans sent">'+circled(sent,s.target)+'</span></div>';
    else h+='<div class="line"><span class="blank" style="font-size:2rem">'+esc(sent)+'</span></div>';
    h+='<div class="btnrow"><button class="check" type="button" data-check="1"'+(st.checked?' disabled':'')+'>✔ Check</button></div>';
    if(st.checked)h+=selfBlock(s,'same');
    h+='</div><div class="artcol"><div class="art">'+ART.paper+'</div></div>';
  } else if(s.kind==='aloud'){
    var cur=W.aloudCur&&s.words.concat(Object.keys(W.aloud)).indexOf(W.aloudCur)>=0?W.aloudCur:s.words[0];W.aloudCur=cur;
    var ast=W.aloud[cur]||{};
    h+='<div class="anscol" style="flex-basis:100%"><div class="chips" id="chips">'+s.words.concat(Object.keys(W.aloud).filter(function(k){return s.words.indexOf(k)<0;})).map(function(w){
         return '<button class="chip'+(w===cur?' on':'')+((W.aloud[w]||{}).ok?' done':'')+'" type="button" data-word="'+esc(w)+'">'+esc(w)+'</button>';}).join('')+
       '<span class="own"><input id="ownw" placeholder="Your own word" maxlength="24"><button class="chip" type="button" data-addown="1">+ Add</button></span></div></div>';
    h+='<div class="playcol">'+playBtn('Hear the word')+'</div>';
    h+='<div class="anscol"><div class="line aloudline"><span class="ans" style="color:var(--ink)">'+esc(cur)+'</span></div>'+
       '<div class="btnrow" style="margin-top:8px"><button class="check" type="button" data-check-aloud="1">✔ Check the letters</button><span class="note" style="margin:0">One person spells it out loud. Then press Check.</span></div>'+
       '<div id="lettersOut">'+(ast.checked?lettersHTML(cur):'')+'</div>';
    if(ast.checked&&!ast.ok)h+='<div class="self" id="self">'+line2('said')+'<div class="btnrow"><button class="yes" type="button" data-yes-aloud="1">👍 Yes</button><button class="notyet" type="button" data-notyet-aloud="1">🔁 Not yet — try again</button></div><div class="fixmsg" id="fixmsg"></div></div>';
    else if(ast.ok)h+='<div class="self"><span class="okmark">✓ Spelled! Pick another word for the next person.</span></div>';
    var nOk=Object.keys(W.aloud).filter(function(k){return W.aloud[k].ok;}).length;
    h+='<p class="note">Words spelled: <b>'+nOk+'</b> — try for at least '+(s.need||3)+'.</p></div>';
    var wa=(s.wordArt&&s.wordArt[cur])?resolveArt(s._deck,s.wordArt[cur]):'';if(wa)h+='<div class="artcol"><div class="art">'+wa+'</div></div>';
  } else if(s.kind==='end'){
    var got=0,missing=[];GRADED.forEach(function(g){if(W.slides[g.id]&&W.slides[g.id].ok)got++;else missing.push(g);});
    h+='<div class="introgrid"><div class="anscol"><p class="bigq">'+esc(dirEn(s))+'</p><p class="note">Slides finished: <b>'+got+' of '+GRADED.length+'</b></p>'+
       (missing.length?'<p class="note">Go back and finish these:</p><div class="endlist">'+missing.map(function(g){return '<button type="button" data-goto="'+SLIDES.indexOf(g)+'">'+(SLIDES.indexOf(g)+1)+'. '+esc(shortName(g))+'</button>';}).join('')+'</div>':'')+
       '<label class="note" for="members">Who is in your group?</label><br><input class="members" id="members" value="'+esc(W.members)+'" placeholder="Names of the other students"><br><br>'+
       (W.turned?'<p class="okmark">✓ Turned in. Thank you!</p>':'<button class="turnin" type="button" data-turnin="1">Turn in</button>')+'</div>'+
       '<div class="introart art">'+(s._art||ART.trophy)+'</div></div>';
  }
  h+='</section></div>';
  $('deck').innerHTML=h;LASTID=s.id;
  fillProxySlots(s);fillLine2();drawProg();drawParts();
  $('back').disabled=W.cur===0;$('next').disabled=W.cur===SLIDES.length-1;
  $('next').classList.toggle('pulse',!!(st.ok||s.kind==='intro'));
  var egg=document.getElementById('lionEgg');if(egg)egg.addEventListener('click',fireworks);
  window.scrollTo(0,0);
}
function crossOne(s,o,wrong){for(var i=0;i<o.length;i++){var ci=o[i];if(ci!==0&&wrong.indexOf(ci)<0)return ci;}return -1;}
function shortName(g){
  if(g.kind==='pic')return 'Picture '+g.n;
  if(g.kind==='circle')return g.target==='cap'?'Circle the capital':g.target==='period'?'Circle the period':'Circle “'+g.target+'”';
  if(g.kind==='aloud')return 'Spell out loud';
  if(g.kind==='mc'||g.kind==='ask'){var q=qText(g);return q.length>34?q.slice(0,32)+'…':q;}
  return g.ans||'';
}
function drawProg(){$('prog').innerHTML=SLIDES.map(function(s,i){var st=W.slides[s.id];return '<i class="'+(i===W.cur?'cur':(st&&st.ok?'ok':''))+'" data-goto="'+i+'" title="'+(i+1)+'"></i>';}).join('');}
function drawParts(){
  var cur=SLIDES[W.cur]._part;
  $('parts').innerHTML=PARTNAMES.map(function(p){var first=0;for(var i=0;i<SLIDES.length;i++){if(SLIDES[i]._part===p){first=i;break;}}
    return '<button class="pt'+(p===cur?' on':'')+'" type="button" data-goto="'+first+'">'+esc(p)+'</button>';}).join('');
}
function bub(t){var b=$('bub');if(b)b.textContent=t;}

/* ---------- what Play says ---------- */
function playFor(s,slow){
  var r=slow?0.6:0.85;
  if(s.kind==='intro'){var parts=[{t:forEar(dirEn(s)),rate:slow?0.7:0.9,gap:500}];if(s.body)parts.push({t:forEar(T(s.body,'en')),rate:slow?0.7:0.9});speakSeq(parts);return;}
  if(s.kind==='word'){speakSeq([{t:s.say||s.ans,rate:r}]);return;}
  if(s.kind==='sent'){speakSeq([{t:forEar(s.say||s.ans),rate:slow?0.55:0.8}]);return;}
  if(s.kind==='cap'){speakSeq([{t:'capital '+LN[s.ans.toLowerCase()],rate:r}]);return;}
  if(s.kind==='letters'){speakSeq(spellParts(s.spell||s.ans,slow));return;}
  if(s.kind==='pic'){speakSeq([{t:'Describe picture '+(['zero','one','two','three','four','five','six','seven','eight','nine','ten'][s.n]||s.n)+'.',rate:r}]);return;}
  if(s.kind==='ask'){speakSeq([{t:forEar(qText(s)),rate:r}]);return;}
  if(s.kind==='mc'){var o=mcOrder(s),p=[{t:forEar(qText(s)),rate:r,gap:600}];o.forEach(function(ci,pos){p.push({t:'ABCDEF'[pos]+'. '+forEar(s.choices[ci]),rate:r,gap:350});});speakSeq(p);return;}
  if(s.kind==='circle'){speakSeq([{t:dirEn(s),rate:r}]);return;}
  if(s.kind==='aloud'){speakSeq([{t:'Spell the word: '+(W.aloudCur||s.words[0])+'.',rate:r}]);return;}
  if(s.kind==='end'){speakSeq([{t:dirEn(s),rate:r}]);return;}
}

/* ---------- events ---------- */
var QUIPS=['Almost! Erase it and try one more time.','No problem — everybody fixes things. Try again.','Look closely, letter by letter. You can do it.','Ask your group: “Can you help me, please?”'];
var MCQUIPS=['Hmm, not that one. Talk it over again!','Close! Look back at the story.','Ask your group: “Why do you think so?”','Good try — one more time.'];
document.addEventListener('click',function(e){
  var t=e.target.closest('button,i[data-goto]');if(!t||!t.closest('#deck,#nav,#bar'))return;
  var s=SLIDES[W.cur];if(!s)return;var st=S(s.id);
  if(t.hasAttribute('data-goto')){go(+t.getAttribute('data-goto'));return;}
  if(t.hasAttribute('data-play')){st.plays=(st.plays||0)+1;playFor(s,false);bub(bubbleFor(s));touch();return;}
  if(t.hasAttribute('data-repeat')){st.plays=(st.plays||0)+1;st.repeats=(st.repeats||0)+1;playFor(s,true);touch();return;}
  if(t.hasAttribute('data-say-en')){say(dirEn(s),0.9);return;}
  if(t.hasAttribute('data-say-slot')){var i=+t.getAttribute('data-say-slot'),code=W.slots[i],L=LBY[code];var tx=t.closest('.db').querySelector('.tx').textContent;speakSeq([{t:tx.replace(/_{2,}/g,' '),rate:0.9,lang:L?L[3]:code}]);return;}
  if(t.hasAttribute('data-check')){st.checked=true;touch();render();
    if(s.kind==='word'||s.kind==='sent'||s.kind==='cap')setTimeout(function(){playFor(s,false);},350);
    if(s.kind==='letters')setTimeout(function(){say(s.ans,0.85);},350);return;}
  if(t.hasAttribute('data-hear-ans')){if(s.kind==='letters')speakSeq(spellParts(s.ans,false));else playFor(s,false);return;}
  if(t.hasAttribute('data-hear-model')){say(s.models[+t.getAttribute('data-hear-model')],0.85);return;}
  if(t.hasAttribute('data-hear-choice')){say(s.choices[+t.getAttribute('data-hear-choice')],0.85);return;}
  if(t.hasAttribute('data-choice')){var ci=+t.getAttribute('data-choice');st.tries=st.tries||[];st.tries.push(ci);st.checked=true;
    if(ci===0){st.ok=true;st.at=new Date().toISOString();touch();render();cheer();if(s.why)setTimeout(function(){say(T(s.why,'en'),0.85);},300);}
    else{st.misses=(st.misses||0)+1;touch();render();bub(MCQUIPS[(st.misses-1)%MCQUIPS.length]);}
    return;}
  if(t.hasAttribute('data-yes')){st.ok=true;st.at=new Date().toISOString();touch();render();cheer();return;}
  if(t.hasAttribute('data-notyet')){st.misses=(st.misses||0)+1;touch();
    var m=$('fixmsg');if(m){if(s.kind==='pic'||s.kind==='ask')m.textContent='Fix your sentence: a capital letter at the start, a period at the end. Then tap 👍.';
      else m.innerHTML=esc(DIR.fix.en)+(W.mine&&DIR.fix[W.mine]?'<br><span translate="no" lang="'+W.mine+'">'+esc(DIR.fix[W.mine])+'</span>':'');}
    bub(QUIPS[(st.misses-1)%QUIPS.length]);return;}
  if(t.hasAttribute('data-word')){W.aloudCur=t.getAttribute('data-word');render();say(W.aloudCur,0.85);return;}
  if(t.hasAttribute('data-addown')){var v=($('ownw').value||'').trim().replace(/[^A-Za-z \-']/g,'').slice(0,24);if(v){if(!W.aloud[v])W.aloud[v]={checked:false,ok:false,misses:0};W.aloudCur=v;touch();render();say(v,0.85);}return;}
  if(t.hasAttribute('data-check-aloud')){var w=W.aloudCur||s.words[0];if(!W.aloud[w])W.aloud[w]={checked:false,ok:false,misses:0};W.aloud[w].checked=true;touch();render();speakSeq(spellParts(w,false));return;}
  if(t.hasAttribute('data-yes-aloud')){var w2=W.aloudCur||s.words[0];W.aloud[w2].ok=true;aloudScore(s);touch();render();cheer();return;}
  if(t.hasAttribute('data-notyet-aloud')){var w3=W.aloudCur||s.words[0];W.aloud[w3].misses=(W.aloud[w3].misses||0)+1;touch();var m2=$('fixmsg');if(m2)m2.textContent='Look at the green letters. Say them again, one at a time.';bub(QUIPS[(W.aloud[w3].misses-1)%QUIPS.length]);return;}
  if(t.hasAttribute('data-turnin')){W.members=($('members')&&$('members').value)||W.members;W.turned=true;touch();save();render();cheer();return;}
});
document.addEventListener('change',function(e){
  var t=e.target;
  if(t.hasAttribute&&t.hasAttribute('data-slotsel')){var i=+t.getAttribute('data-slotsel');W.slots[i]=t.value;touch();render();return;}
});
document.addEventListener('input',function(e){if(e.target.id==='members'){W.members=e.target.value;touch();}});
function aloudScore(s){var n=Object.keys(W.aloud).filter(function(k){return W.aloud[k].ok;}).length;var st=S(s.id);st.checked=n>0;if(n>=(s.need||3))st.ok=true;}
function go(i){i=Math.max(0,Math.min(SLIDES.length-1,i));if(i===W.cur)return;W.cur=i;touch();render();}
document.addEventListener('keydown',function(e){
  if(!SLIDES.length||$('gate').style.display!=='none')return;
  if(/INPUT|SELECT|TEXTAREA/.test((e.target.tagName||'')))return;
  if(e.key==='ArrowRight')go(W.cur+1);else if(e.key==='ArrowLeft')go(W.cur-1);
});
function cheer(){burst(window.innerWidth/2,window.innerHeight*0.45,18);}
function fireworks(){W.lion=true;touch();for(var k=0;k<4;k++)(function(k){setTimeout(function(){burst(80+Math.random()*(window.innerWidth-160),80+Math.random()*(window.innerHeight*0.5),28);},k*260);})(k);bub('You found the Galileo lion! 🦁');}
function burst(x,y,n){
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var cols=['#f2b632','#1e8c45','#c62828','#2457a6','#7d3c98'];
  for(var i=0;i<n;i++){var d=document.createElement('div');d.className='fw';d.style.left=x+'px';d.style.top=y+'px';d.style.background=cols[i%cols.length];document.body.appendChild(d);
    var a=Math.random()*Math.PI*2,r=60+Math.random()*120;
    if(d.animate)d.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+Math.cos(a)*r+'px,'+Math.sin(a)*r+'px) scale(.3)',opacity:0}],{duration:900+Math.random()*400,easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=(function(d){return function(){d.remove();};})(d);
    else setTimeout((function(d){return function(){d.remove();};})(d),900);}
}
function applyMine(code){
  W.mine=code||'';try{localStorage.setItem('vocab_lang',code);}catch(e){}
  if(code&&W.slots.indexOf(code)<0){var drop=W.slots.slice().sort(function(x,y){return GATE_ORDER.indexOf(y)-GATE_ORDER.indexOf(x);})[0];W.slots=[code].concat(W.slots.filter(function(c){return c!==drop;}));}
  if($('lang').value!==code)$('lang').value=code;
}

/* ======================================================================
   SHELL + SIGN-IN + BOOT
   ====================================================================== */
var SHELL=
'<div id="gate"><div class="box" translate="no"><span class="gart" id="gateArt"></span><h2 id="gttl">Group Practice</h2><p class="sub">Group practice. I am your group leader today.</p>'+
'<div class="row2"><div><label for="gfirst">First name</label><input id="gfirst" autocomplete="given-name"></div><div><label for="glast">Last name</label><input id="glast" autocomplete="family-name"></div></div>'+
'<label for="gmail">School email</label><input id="gmail" type="email" placeholder="name@s.sfusd.edu" autocomplete="email">'+
'<div class="row2"><div><label for="gper">Period</label><select id="gper"><option value="">—</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option></select></div>'+
'<div><label for="glang">Your language</label><select id="glang"></select></div></div>'+
'<label for="gmembers">Who is in your group? (optional)</label><input id="gmembers" placeholder="Names of the other students">'+
'<button class="go" id="gbtn" type="button">Start</button><div class="err" id="gerr"></div></div></div>'+
'<div id="neterr">⚠ Can’t reach the server — your work is not saved yet. Keep going; it will try again.</div>'+
'<div id="trwarn">Please turn off the browser’s page translation — this page already shows your language.</div>'+
'<div id="bar"><span class="ttl" id="ttl">Group Practice</span><div class="parts" id="parts"></div><div class="sp"><label for="lang">My language</label><select id="lang"></select><span id="dot"></span><span id="savetxt"></span><span id="who"></span></div></div>'+
'<main id="deck"></main>'+
'<nav id="nav"><button class="nb" id="back" type="button">← Back</button><div id="prog" aria-label="Slides"></div><button class="nb next" id="next" type="button">Next →</button></nav>'+
'<span id="canary" style="position:absolute;left:-9999px;top:0" aria-hidden="true">Hello friend</span>';

function canon(raw){return String(raw||'').trim().toLowerCase().replace(/@s\.sfusd\.edu$/,'@sfusd.edu');}
function validMail(m){return /^[^@\s]+@(s\.)?sfusd\.edu$/.test(String(m||'').trim().toLowerCase());}
function wireShell(){
  $('glang').innerHTML='<option value="">Choose…</option>'+GATE_ORDER.map(function(c){return '<option value="'+c+'">'+esc(LBY[c][1])+' — '+esc(LBY[c][2].replace(/ \(.*\)/,''))+'</option>';}).join('');
  $('lang').innerHTML=GATE_ORDER.map(function(c){return '<option value="'+c+'">'+esc(LBY[c][1])+'</option>';}).join('');
  $('gateArt').innerHTML=ART.lion;
  try{var v=localStorage.getItem('vocab_lang');if(v&&LBY[v])$('glang').value=v;var g=localStorage.getItem('gal_student_email');if(g)$('gmail').value=g;}catch(e){}
  $('lang').addEventListener('change',function(){applyMine(this.value);touch();render();});
  $('next').addEventListener('click',function(){go(W.cur+1);});
  $('back').addEventListener('click',function(){go(W.cur-1);});
  $('gmail').addEventListener('keydown',function(e){if(e.key==='Enter')$('gbtn').click();});
  $('gbtn').addEventListener('click',function(){
    var f=$('gfirst').value.trim(),l=$('glast').value.trim(),raw=$('gmail').value.trim().toLowerCase(),p=$('gper').value,lg=$('glang').value,err=$('gerr');
    if(!f||!l){err.textContent='Please write your first and last name.';return;}
    if(!validMail(raw)){err.textContent='Please use your school email — it ends with @s.sfusd.edu';return;}
    if(!p){err.textContent='Please choose your period.';return;}
    if(!lg){err.textContent='Please choose your language.';return;}
    if(!SLIDES.length){err.textContent='Still loading the slides…';return;}
    var email=canon(raw);ME={name:f+' '+l,email:email,period:p};
    if(raw!==email)fetch(SUPA_URL+'/rest/v1/student_aliases?on_conflict=alias_email',{method:'POST',headers:hdr('resolution=merge-duplicates,return=minimal'),body:JSON.stringify([{alias_email:raw,email:email}])}).catch(function(){});
    fetch(SUPA_URL+'/rest/v1/students?on_conflict=email',{method:'POST',headers:hdr('resolution=ignore-duplicates,return=minimal'),body:JSON.stringify([{email:email,name:ME.name,period:p}])}).catch(function(){});
    try{localStorage.setItem('gal_student_email',email);}catch(e){}
    $('gate').style.display='none';$('who').textContent=ME.name+' · P'+p;
    load(function(){applyMine(lg);if($('gmembers').value.trim())W.members=$('gmembers').value.trim();render();touch();});
  });
  setTimeout(function(){var c=$('canary');if((c&&c.textContent!=='Hello friend')||document.documentElement.className.indexOf('translated')>-1)$('trwarn').style.display='block';},4000);
}
function injectCSS(){var st=document.createElement('style');st.id='gp-css';st.textContent=GP_CSS;document.head.appendChild(st);}

/* picker: /readings/group/ with no ?deck= */
function picker(){
  $('gate').style.display='none';$('nav').style.display='none';$('bar').querySelector('.sp').style.display='none';
  var list=(window.GP_DECK_LIST||[]).slice();
  function draw(){
    $('deck').innerHTML='<section class="stage" style="display:block"><h2 style="margin:0 0 6px">Choose your group practice</h2><p class="note">Your teacher will tell you which one.</p><div class="pick">'+
      list.map(function(d){return '<a class="pk" href="?deck='+encodeURIComponent(d.slug)+'"><span class="pkart">'+(d.art&&ART[d.art]?ART[d.art]:ART.group)+'</span><b>'+esc(d.title)+'</b><span class="note">'+esc(d.note||'')+'</span></a>';}).join('')+'</div></section>';
  }
  draw();
  fetch(SUPA_URL+'/rest/v1/group_decks?select=slug,title,course,listed&order=updated_at.desc',{headers:hdr()}).then(function(r){return r.ok?r.json():[];}).then(function(rows){
    (rows||[]).forEach(function(r){if(r.listed===false)return;if(!list.some(function(x){return x.slug===r.slug;}))list.push({slug:r.slug,title:r.title,note:'ELD '+(r.course||'101')});});draw();}).catch(function(){});
}

window.GP_ART=ART;
window.GP={
  boot:function(opts){
    injectCSS();
    var root=document.createElement('div');root.id='gp';root.innerHTML=SHELL;document.body.insertBefore(root,document.body.firstChild);
    wireShell();
    var slugs=(opts&&opts.decks)||[];
    if(!slugs.length){var q=new URLSearchParams(location.search).get('deck');slugs=(q||'').split(/[,+ ]/).filter(Boolean);}
    if(!slugs.length){picker();return;}
    Promise.all(slugs.map(getDeck)).then(function(ds){
      var miss=[];ds.forEach(function(d,i){if(!d)miss.push(slugs[i]);else d.slug=d.slug||slugs[i];});
      if(miss.length){$('gate').style.display='none';$('deck').innerHTML='<section class="stage" style="display:block"><h2>Can’t find: '+esc(miss.join(', '))+'</h2><p class="note">Check the link with your teacher.</p></section>';return;}
      compose(ds);$('gttl').textContent=TITLE;
    });
  },
  get W(){return W;}, get SLIDES(){return SLIDES;}, go:function(i){go(i);}, compose:compose, render:function(){render();}
};

})();
