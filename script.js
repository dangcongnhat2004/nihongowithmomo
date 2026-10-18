(() => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#nav-links");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      toggle.setAttribute("aria-label", open ? "Mở menu" : "Đóng menu");
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Mở menu");
    }));
  }

  document.querySelector("#year").textContent = new Date().getFullYear();

  // Set this to the actual public demo URL before publishing.
  const DEMO_URL = "";
  const demoLinks = [document.querySelector("#demo-link"), document.querySelector(".nav-cta"), ...document.querySelectorAll('a[href="#try"]')].filter(Boolean);
  demoLinks.forEach(link => {
    if (DEMO_URL) {
      link.href = DEMO_URL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else if (link.id === "demo-link") {
      link.addEventListener("click", event => {
        event.preventDefault();
        alert("Hãy điền URL website demo vào biến DEMO_URL trong script.js trước khi xuất bản landing page.");
      });
    }
  });

  // Subtle 3D parallax for Momo. Disabled on touch-first devices and reduced-motion preference.
  const scene = document.querySelector("#momo-scene");
  const momo = document.querySelector("#momo-tilt");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (scene && momo && !reducedMotion && finePointer) {
    scene.addEventListener("pointermove", event => {
      const rect = scene.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      momo.style.animationPlayState = "paused";
      momo.style.transform = `translate3d(${x * 14}px, ${y * 10}px, 0) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    });
    scene.addEventListener("pointerleave", () => {
      momo.style.transform = "";
      momo.style.animationPlayState = "";
    });
  }


  // Listening demo: show/hide reading aid and use the browser's Japanese speech voice if available.
  const furiganaToggle = document.querySelector("#furigana-toggle");
  const furiganaLine = document.querySelector("#furigana-line");
  if (furiganaToggle && furiganaLine) {
    furiganaToggle.addEventListener("click", () => {
      const hidden = furiganaLine.classList.toggle("is-hidden");
      furiganaToggle.textContent = hidden ? "Hiện Furigana" : "Ẩn Furigana";
    });
  }
  const speakButton = document.querySelector("#speak-japanese");
  const audioNote = document.querySelector("#audio-note");
  if (speakButton) {
    speakButton.addEventListener("click", () => {
      if (!("speechSynthesis" in window)) {
        if (audioNote) audioNote.textContent = "Trình duyệt này chưa hỗ trợ đọc văn bản. Bạn có thể thử Chrome hoặc Edge.";
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("いらっしゃいませ。お弁当、温めますか？");
      utterance.lang = "ja-JP";
      utterance.rate = 0.88;
      const voices = window.speechSynthesis.getVoices();
      const japaneseVoice = voices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith("ja"));
      if (japaneseVoice) utterance.voice = japaneseVoice;
      utterance.onstart = () => { if (audioNote) audioNote.textContent = "Đang phát giọng đọc tiếng Nhật của trình duyệt."; };
      utterance.onend = () => { if (audioNote) audioNote.textContent = "Đã phát xong. Giọng đọc phụ thuộc vào voice được cài trên thiết bị."; };
      utterance.onerror = () => { if (audioNote) audioNote.textContent = "Không thể phát âm thanh trên thiết bị này."; };
      window.speechSynthesis.speak(utterance);
    });
  }

  // One-question N5 quiz with local score only; no account or backend needed.
  let quizAnswered = false;
  const quizOptions = [...document.querySelectorAll(".quiz-option")];
  const quizFeedback = document.querySelector("#quiz-feedback");
  const expCount = document.querySelector("#exp-count");
  const resetQuiz = document.querySelector("#quiz-reset");
  quizOptions.forEach(option => option.addEventListener("click", () => {
    if (quizAnswered) return;
    quizAnswered = true;
    const correct = option.dataset.correct === "true";
    option.classList.add(correct ? "correct" : "incorrect");
    quizOptions.forEach(item => {
      item.disabled = true;
      if (item.dataset.correct === "true") item.classList.add("correct");
    });
    if (correct) {
      if (quizFeedback) { quizFeedback.textContent = "Chính xác! おはようございます là lời chào buổi sáng lịch sự. +10 EXP"; quizFeedback.className = "quiz-feedback good"; }
      if (expCount) expCount.textContent = "10";
    } else {
      if (quizFeedback) { quizFeedback.textContent = "Chưa đúng rồi! Đáp án đúng là おはようございます (Ohayou gozaimasu)."; quizFeedback.className = "quiz-feedback bad"; }
    }
  }));
  if (resetQuiz) resetQuiz.addEventListener("click", () => {
    quizAnswered = false;
    quizOptions.forEach(item => { item.disabled = false; item.classList.remove("correct", "incorrect"); });
    if (quizFeedback) { quizFeedback.textContent = "Chọn một đáp án để kiểm tra nhé!"; quizFeedback.className = "quiz-feedback"; }
    if (expCount) expCount.textContent = "0";
  });

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }
})();

  // Lightweight client-side localization for the standalone landing page.
  // The language dropdown is intentionally dependency-free and works from file://.
  const languageSelect = document.querySelector('#language-select');
  const localizedText = {
    'Giới thiệu': ['About', '紹介', 'អំពីយើង', 'Tentang', 'Pengenalan', 'เกี่ยวกับเรา', 'Acerca de', 'Über uns'],
    'Tính năng': ['Features', '機能', 'មុខងារ', 'Fitur', 'Ciri-ciri', 'คุณสมบัติ', 'Funciones', 'Funktionen'],
    'Cách hoạt động': ['How it works', '使い方', 'របៀបប្រើប្រាស់', 'Cara kerja', 'Cara berfungsi', 'วิธีใช้งาน', 'Cómo funciona', 'So funktioniert es'],
    'Bảng giá': ['Pricing', '料金', 'តម្លៃ', 'Harga', 'Harga', 'ราคา', 'Precios', 'Preise'],
    'Trải nghiệm ngay': ['Try it now', '今すぐ体験', 'សាកល្បងឥឡូវនេះ', 'Coba sekarang', 'Cuba sekarang', 'ทดลองใช้เลย', 'Pruébalo ahora', 'Jetzt ausprobieren'],
    'Học tiếng Nhật dễ hơn mỗi ngày': ['Make Japanese easier every day', '毎日もっと楽しく日本語を学ぼう', 'រៀនភាសាជប៉ុនកាន់តែងាយស្រួលរាល់ថ្ងៃ', 'Belajar bahasa Jepang lebih mudah setiap hari', 'Belajar bahasa Jepun dengan lebih mudah setiap hari', 'เรียนภาษาญี่ปุ่นง่ายขึ้นทุกวัน', 'Aprende japonés más fácilmente cada día', 'Lerne jeden Tag leichter Japanisch'],
    'Học tiếng Nhật cùng Momo': ['Learn Japanese with Momo', 'Momoと一緒に日本語を学ぼう', 'រៀនភាសាជប៉ុនជាមួយ Momo', 'Belajar bahasa Jepang bersama Momo', 'Belajar bahasa Jepun bersama Momo', 'เรียนภาษาญี่ปุ่นกับ Momo', 'Aprende japonés con Momo', 'Lerne Japanisch mit Momo'],
    'Ứng dụng hỗ trợ bạn phát triển toàn diện 4 kỹ năng tiếng Nhật với AI, video thực tế và lộ trình học cá nhân hóa.': ['An app that helps you develop all four Japanese skills with AI, real-life videos, and a personalized learning path.', 'AI、実際の動画、個別学習プランで日本語の4技能を総合的に伸ばすアプリです。', 'កម្មវិធីជួយអភិវឌ្ឍជំនាញភាសាជប៉ុនទាំង ៤ ដោយប្រើ AI វីដេអូជាក់ស្តែង និងផែនការរៀនផ្ទាល់ខ្លួន។', 'Aplikasi untuk mengembangkan empat keterampilan bahasa Jepang dengan AI, video nyata, dan jalur belajar yang dipersonalisasi.', 'Aplikasi untuk mengembangkan empat kemahiran bahasa Jepun dengan AI, video sebenar dan laluan pembelajaran peribadi.', 'แอปช่วยพัฒนาทักษะภาษาญี่ปุ่นทั้ง 4 ด้านด้วย AI วิดีโอจริง และแผนการเรียนเฉพาะบุคคล', 'Una app para desarrollar las cuatro habilidades del japonés con IA, vídeos reales y una ruta de aprendizaje personalizada.', 'Eine App, mit der du alle vier Japanisch-Fertigkeiten mit KI, realen Videos und einem personalisierten Lernpfad entwickelst.'],
    'Tìm hiểu thêm': ['Learn more', '詳しく見る', 'ស្វែងយល់បន្ថែម', 'Pelajari lebih lanjut', 'Ketahui lebih lanjut', 'ดูเพิ่มเติม', 'Más información', 'Mehr erfahren'],
    'Học với video thực tế': ['Learn with real-life videos', '実際の動画で学ぶ', 'រៀនតាមវីដេអូជាក់ស្តែង', 'Belajar dengan video nyata', 'Belajar melalui video sebenar', 'เรียนผ่านวิดีโอจริง', 'Aprende con vídeos reales', 'Lernen mit realen Videos'],
    'AI hỗ trợ cá nhân hóa': ['AI-powered personalization', 'AIによる個別最適化', 'AI ជួយកំណត់ការរៀនផ្ទាល់ខ្លួន', 'Personalisasi dengan AI', 'Pemperibadian dengan AI', 'AI ช่วยปรับการเรียนให้เหมาะกับคุณ', 'Personalización con IA', 'Personalisierung durch KI'],
    'Học mọi lúc, mọi nơi': ['Learn anytime, anywhere', 'いつでもどこでも学習', 'រៀនគ្រប់ពេល គ្រប់ទីកន្លែង', 'Belajar kapan saja, di mana saja', 'Belajar bila-bila masa, di mana sahaja', 'เรียนได้ทุกที่ทุกเวลา', 'Aprende en cualquier momento y lugar', 'Lerne jederzeit und überall'],
    'Ứng dụng di động': ['Mobile app', 'モバイルアプリ', 'កម្មវិធីទូរស័ព្ទ', 'Aplikasi seluler', 'Aplikasi mudah alih', 'แอปมือถือ', 'Aplicación móvil', 'Mobile App'],
    'Sắp ra mắt': ['Coming soon', '近日公開', 'នឹងមកដល់ឆាប់ៗនេះ', 'Segera hadir', 'Akan datang', 'เร็ว ๆ นี้', 'Próximamente', 'Demnächst verfügbar'],
    'người học đang trải nghiệm': ['learners exploring the app', '人の学習者が利用中', 'អ្នកកំពុងសាកល្បងរៀន', 'pelajar sedang mencoba', 'pelajar sedang mencuba', 'ผู้เรียนกำลังทดลองใช้', 'estudiantes probando la app', 'Lernende testen die App'],
    'đánh giá trung bình': ['average rating', '平均評価', 'ការវាយតម្លៃជាមធ្យម', 'peringkat rata-rata', 'penilaian purata', 'คะแนนเฉลี่ย', 'valoración media', 'Durchschnittsbewertung'],
    'Học hiệu quả hơn': ['Learn more effectively', 'もっと効果的に学習', 'រៀនប្រកបដោយប្រសិទ្ធភាព', 'Belajar lebih efektif', 'Belajar dengan lebih berkesan', 'เรียนอย่างมีประสิทธิภาพยิ่งขึ้น', 'Aprende con más eficacia', 'Effektiver lernen'],
    'với AI cá nhân hóa': ['with personalized AI', '個別最適化AIで', 'ជាមួយ AI ផ្ទាល់ខ្លួន', 'dengan AI personal', 'dengan AI peribadi', 'ด้วย AI ที่ปรับตามคุณ', 'con IA personalizada', 'mit personalisierter KI'],
    'Phù hợp cho mọi trình độ': ['For every level', 'あらゆるレベルに対応', 'សមស្របសម្រាប់គ្រប់កម្រិត', 'Cocok untuk semua level', 'Sesuai untuk semua tahap', 'เหมาะกับทุกระดับ', 'Para todos los niveles', 'Für alle Niveaus geeignet'],
    'từ N5 đến N1': ['from N5 to N1', 'N5からN1まで', 'ពី N5 ដល់ N1', 'dari N5 hingga N1', 'dari N5 hingga N1', 'ตั้งแต่ N5 ถึง N1', 'de N5 a N1', 'von N5 bis N1'],
    'BẠN CÓ TỪNG...': ['HAVE YOU EVER…', 'こんな経験はありませんか？', 'តើអ្នកធ្លាប់…', 'PERNAHKAH KAMU…', 'PERNAHKAH ANDA…', 'คุณเคย…ไหม', '¿ALGUNA VEZ…?', 'KENNST DU DAS…'],
    'Những khó khăn thường gặp': ['Common challenges', 'よくある悩み', 'បញ្ហាដែលជួបញឹកញាប់', 'Tantangan umum', 'Cabaran biasa', 'ปัญหาที่พบบ่อย', 'Dificultades comunes', 'Häufige Herausforderungen'],
    'khi học tiếng Nhật': ['when learning Japanese', '日本語学習で', 'នៅពេលរៀនភាសាជប៉ុន', 'saat belajar bahasa Jepang', 'ketika belajar bahasa Jepun', 'เมื่อเรียนภาษาญี่ปุ่น', 'al aprender japonés', 'beim Japanischlernen'],
    'Khó ghi nhớ': ['Hard to remember', '覚えにくい', 'ពិបាកចងចាំ', 'Sulit diingat', 'Sukar diingati', 'จำได้ยาก', 'Difícil de recordar', 'Schwer zu merken'],
    'từ vựng và ngữ pháp': ['vocabulary and grammar', '語彙と文法', 'វាក្យសព្ទ និងវេយ្យាករណ៍', 'kosakata dan tata bahasa', 'kosa kata dan tatabahasa', 'คำศัพท์และไวยากรณ์', 'vocabulario y gramática', 'Wortschatz und Grammatik'],
    'Thiếu môi trường': ['Lack of practice', '練習する環境がない', 'ខ្វះបរិយាកាសអនុវត្ត', 'Kurang lingkungan latihan', 'Kurang persekitaran latihan', 'ขาดสภาพแวดล้อมในการฝึก', 'Falta de práctica', 'Zu wenig Übungsmöglichkeiten'],
    'luyện tập': ['practice', '練習', 'ការអនុវត្ត', 'latihan', 'latihan', 'ฝึกฝน', 'práctica', 'Übung'],
    'Khó duy trì động lực': ['Hard to stay motivated', 'モチベーションが続かない', 'ពិបាករក្សាកម្លាំងចិត្ត', 'Sulit menjaga motivasi', 'Sukar mengekalkan motivasi', 'รักษาแรงจูงใจได้ยาก', 'Cuesta mantener la motivación', 'Schwer, motiviert zu bleiben'],
    'học tiếng Nhật dễ dàng hơn': ['learn Japanese more easily', 'もっと簡単に日本語を学ぶ', 'រៀនភាសាជប៉ុនកាន់តែងាយស្រួល', 'belajar bahasa Jepang dengan lebih mudah', 'belajar bahasa Jepun dengan lebih mudah', 'เรียนภาษาญี่ปุ่นได้ง่ายขึ้น', 'aprender japonés más fácilmente', 'leichter Japanisch lernen'],
    '4 kỹ năng — 1 hành trình hoàn chỉnh': ['4 skills — one complete journey', '4技能をひとつの学習体験に', 'ជំនាញ ៤ — ដំណើររៀនតែមួយ', '4 keterampilan — satu perjalanan lengkap', '4 kemahiran — satu perjalanan lengkap', '4 ทักษะ — เส้นทางเดียวที่ครบถ้วน', '4 habilidades — un recorrido completo', '4 Fähigkeiten — ein kompletter Lernweg'],
    'Nghe': ['Listening', '聞く', 'ស្តាប់', 'Menyimak', 'Mendengar', 'การฟัง', 'Escuchar', 'Hören'],
    'Nói': ['Speaking', '話す', 'និយាយ', 'Berbicara', 'Bertutur', 'การพูด', 'Hablar', 'Sprechen'],
    'Đọc': ['Reading', '読む', 'អាន', 'Membaca', 'Membaca', 'การอ่าน', 'Leer', 'Lesen'],
    'Viết': ['Writing', '書く', 'សរសេរ', 'Menulis', 'Menulis', 'การเขียน', 'Escribir', 'Schreiben'],
    'Mỗi ngày một chút.': ['A little every day.', '毎日少しずつ。', 'បន្តិចម្តងៗរាល់ថ្ងៃ។', 'Sedikit setiap hari.', 'Sedikit setiap hari.', 'วันละนิด', 'Un poco cada día.', 'Jeden Tag ein bisschen.'],
    'Tiến bộ từng bước.': ['Progress step by step.', '一歩ずつ上達。', 'រីកចម្រើនម្តងមួយជំហាន។', 'Maju selangkah demi selangkah.', 'Maju selangkah demi selangkah.', 'พัฒนาไปทีละขั้น', 'Progresa paso a paso.', 'Schritt für Schritt Fortschritte machen.'],
    'Khám phá cách học': ['Explore the learning experience', '学習方法を見る', 'ស្វែងយល់ពីវិធីរៀន', 'Jelajahi cara belajar', 'Terokai cara belajar', 'ดูวิธีการเรียน', 'Descubre cómo aprender', 'Lernmöglichkeiten entdecken'],
    'HỌC TRONG NGỮ CẢNH THỰC TẾ': ['LEARN IN REAL-LIFE CONTEXT', '実際の場面で学ぶ', 'រៀនក្នុងបរិបទជាក់ស្តែង', 'BELAJAR DALAM KONTEKS NYATA', 'BELAJAR DALAM KONTEKS SEBENAR', 'เรียนรู้จากสถานการณ์จริง', 'APRENDE EN CONTEXTOS REALES', 'LERNEN IN REALEN KONTEXTEN'],
    'LUYỆN TẬP KỸ NĂNG NGHE': ['LISTENING PRACTICE', 'リスニング練習', 'ការហាត់ស្តាប់', 'LATIHAN MENYIMAK', 'LATIHAN MENDENGAR', 'ฝึกทักษะการฟัง', 'PRÁCTICA DE COMPRENSIÓN AUDITIVA', 'HÖRVERSTEHEN ÜBEN'],
    'Ẩn Furigana': ['Hide Furigana', 'ふりがなを隠す', 'លាក់ Furigana', 'Sembunyikan Furigana', 'Sembunyikan Furigana', 'ซ่อนฟุริงานะ', 'Ocultar furigana', 'Furigana ausblenden'],
    'Hiện Furigana': ['Show Furigana', 'ふりがなを表示', 'បង្ហាញ Furigana', 'Tampilkan Furigana', 'Tunjukkan Furigana', 'แสดงฟุริงานะ', 'Mostrar furigana', 'Furigana anzeigen'],
    'Nghe câu tiếng Nhật': ['Listen to Japanese', '日本語を聞く', 'ស្តាប់ភាសាជប៉ុន', 'Dengarkan bahasa Jepang', 'Dengar bahasa Jepun', 'ฟังภาษาญี่ปุ่น', 'Escuchar japonés', 'Japanisch anhören'],
    'TRẢI NGHIỆM TRỰC TIẾP': ['TRY IT YOURSELF', '実際に体験', 'សាកល្បងដោយផ្ទាល់', 'COBA LANGSUNG', 'CUBA SENDIRI', 'ทดลองใช้งานจริง', 'PRUÉBALO', 'JETZT AUSPROBIEREN'],
    'Thử sức 1 phút cùng bạn Cáo Momo': ['Take a 1-minute challenge with Momo', 'Momoと1分間チャレンジ', 'សាកល្បង ១ នាទីជាមួយ Momo', 'Coba tantangan 1 menit bersama Momo', 'Cuba cabaran 1 minit bersama Momo', 'ลองท้าทาย 1 นาทีกับ Momo', 'Acepta un reto de 1 minuto con Momo', 'Mach eine 1-Minuten-Challenge mit Momo'],
    'Chọn một đáp án để kiểm tra nhé!': ['Choose an answer to check!', '答えを選んで確認しましょう！', 'ជ្រើសរើសចម្លើយដើម្បីពិនិត្យ!', 'Pilih jawaban untuk memeriksa!', 'Pilih jawapan untuk menyemak!', 'เลือกคำตอบเพื่อตรวจสอบ!', '¡Elige una respuesta para comprobar!', 'Wähle eine Antwort zur Überprüfung!'],
    'Làm lại câu hỏi ↻': ['Try again ↻', 'もう一度 ↻', 'សាកល្បងម្តងទៀត ↻', 'Coba lagi ↻', 'Cuba lagi ↻', 'ลองอีกครั้ง ↻', 'Intentar de nuevo ↻', 'Erneut versuchen ↻'],
    'ĐÁNH GIÁ TỪ CỘNG ĐỒNG': ['COMMUNITY REVIEWS', '学習者の声', 'មតិយោបល់ពីសហគមន៍', 'ULASAN KOMUNITAS', 'ULASAN KOMUNITI', 'รีวิวจากผู้เรียน', 'OPINIONES DE LA COMUNIDAD', 'STIMMEN AUS DER COMMUNITY'],
    'Hơn 10,000+ học viên tin chọn NihonGO': ['Over 10,000 learners choose NihonGO', '10,000人以上がNihonGOを選択', 'អ្នកសិក្សាជាង 10,000 នាក់ជឿទុកចិត្ត NihonGO', 'Lebih dari 10.000 pelajar memilih NihonGO', 'Lebih 10,000 pelajar memilih NihonGO', 'ผู้เรียนกว่า 10,000 คนเลือก NihonGO', 'Más de 10.000 estudiantes eligen NihonGO', 'Über 10.000 Lernende entscheiden sich für NihonGO'],
    'Lắng nghe những câu chuyện học tiếng Nhật cùng Momo.': ['Hear stories of learning Japanese with Momo.', 'Momoと日本語を学ぶ人たちの声を聞いてみましょう。', 'ស្តាប់រឿងរ៉ាវនៃការរៀនភាសាជប៉ុនជាមួយ Momo។', 'Dengarkan kisah belajar bahasa Jepang bersama Momo.', 'Dengar kisah belajar bahasa Jepun bersama Momo.', 'ฟังเรื่องราวการเรียนภาษาญี่ปุ่นกับ Momo', 'Escucha historias de aprendizaje de japonés con Momo.', 'Höre Geschichten über das Japanischlernen mit Momo.'],
    'ĐẦU TƯ THÔNG MINH': ['SMART INVESTMENT', '賢い学習投資', 'ការវិនិយោគដ៏ឆ្លាតវៃ', 'INVESTASI CERDAS', 'PELABURAN BIJAK', 'ลงทุนอย่างชาญฉลาด', 'INVERSIÓN INTELIGENTE', 'CLEVER INVESTIEREN'],
    'Lựa chọn gói học phù hợp với bạn': ['Choose the plan that suits you', '自分に合った学習プランを選ぼう', 'ជ្រើសរើសកញ្ចប់រៀនដែលសមនឹងអ្នក', 'Pilih paket belajar yang cocok untukmu', 'Pilih pelan pembelajaran yang sesuai', 'เลือกแพ็กเกจการเรียนที่เหมาะกับคุณ', 'Elige el plan que mejor se adapte a ti', 'Wähle den passenden Lernplan'],
    'Học thử miễn phí ngay hôm nay. Chọn gói phù hợp với hành trình của bạn.': ['Start learning for free today. Choose a plan for your journey.', '今日から無料で学習を始め、自分に合うプランを選びましょう。', 'ចាប់ផ្តើមរៀនដោយឥតគិតថ្លៃថ្ងៃនេះ ហើយជ្រើសរើសកញ្ចប់ដែលសមនឹងអ្នក។', 'Mulai belajar gratis hari ini dan pilih paket yang sesuai.', 'Mula belajar secara percuma hari ini dan pilih pelan yang sesuai.', 'เริ่มเรียนฟรีวันนี้ แล้วเลือกแพ็กเกจที่เหมาะกับคุณ', 'Empieza gratis hoy y elige el plan adecuado para tu camino.', 'Starte heute kostenlos und wähle den passenden Lernplan.'],
    'Câu hỏi thường gặp về NihonGO': ['Frequently asked questions about NihonGO', 'NihonGOについてよくある質問', 'សំណួរដែលសួរញឹកញាប់អំពី NihonGO', 'Pertanyaan umum tentang NihonGO', 'Soalan lazim tentang NihonGO', 'คำถามที่พบบ่อยเกี่ยวกับ NihonGO', 'Preguntas frecuentes sobre NihonGO', 'Häufig gestellte Fragen zu NihonGO'],
    'Bắt đầu hành trình tiếng Nhật': ['Start your Japanese journey', '日本語学習の旅を始めよう', 'ចាប់ផ្តើមដំណើររៀនភាសាជប៉ុន', 'Mulai perjalanan bahasa Jepangmu', 'Mulakan perjalanan bahasa Jepun anda', 'เริ่มต้นเส้นทางภาษาญี่ปุ่นของคุณ', 'Comienza tu camino en japonés', 'Beginne deine Japanisch-Reise'],
    'cùng Momo ngay hôm nay!': ['with Momo today!', '今日からMomoと一緒に！', 'ជាមួយ Momo ចាប់ពីថ្ងៃនេះ!', 'bersama Momo hari ini!', 'bersama Momo hari ini!', 'กับ Momo ได้เลยวันนี้!', '¡con Momo hoy mismo!', 'heute mit Momo!'],
    'Học thử trên Web': ['Try on the web', 'Webで体験', 'សាកល្បងលើគេហទំព័រ', 'Coba di web', 'Cuba di web', 'ทดลองบนเว็บ', 'Probar en la web', 'Im Web ausprobieren'],
    'Khám phá tính năng': ['Explore features', '機能を見る', 'ស្វែងយល់ពីមុខងារ', 'Jelajahi fitur', 'Terokai ciri-ciri', 'สำรวจคุณสมบัติ', 'Explorar funciones', 'Funktionen entdecken'],
    'Khám phá': ['Explore', '探す', 'ស្វែងយល់', 'Jelajahi', 'Terokai', 'สำรวจ', 'Explorar', 'Entdecken'],
    'Tài nguyên': ['Resources', 'リソース', 'ធនធាន', 'Sumber daya', 'Sumber', 'แหล่งข้อมูล', 'Recursos', 'Ressourcen'],
    'Chính sách & hỗ trợ': ['Policies & support', 'ポリシーとサポート', 'គោលការណ៍ និងជំនួយ', 'Kebijakan & dukungan', 'Dasar & sokongan', 'นโยบายและการสนับสนุน', 'Políticas y soporte', 'Richtlinien & Support'],
    'Điều khoản sử dụng': ['Terms of use', '利用規約', 'លក្ខខណ្ឌប្រើប្រាស់', 'Ketentuan penggunaan', 'Terma penggunaan', 'ข้อกำหนดการใช้งาน', 'Términos de uso', 'Nutzungsbedingungen'],
    'Chính sách bảo mật': ['Privacy policy', 'プライバシーポリシー', 'គោលការណ៍ឯកជនភាព', 'Kebijakan privasi', 'Dasar privasi', 'นโยบายความเป็นส่วนตัว', 'Política de privacidad', 'Datenschutzerklärung'],
    'Chính sách hoàn tiền': ['Refund policy', '返金ポリシー', 'គោលការណ៍សងប្រាក់', 'Kebijakan pengembalian dana', 'Dasar bayaran balik', 'นโยบายคืนเงิน', 'Política de reembolso', 'Rückerstattungsrichtlinie']
  };
  Object.assign(localizedText, {
    'MEET YOUR LEARNING PARTNER': ['MEET YOUR LEARNING PARTNER', '学習パートナーの紹介', 'ជួបដៃគូសិក្សារបស់អ្នក', 'KENALI TEMAN BELAJARMU', 'KENALI RAKAN PEMBELAJARAN ANDA', 'พบกับเพื่อนร่วมเรียนรู้ของคุณ', 'CONOCE A TU COMPAÑERO DE APRENDIZAJE', 'LERNE DEINEN LERNPARTNER KENNEN'],
    'LEARN EVERY DAY': ['LEARN EVERY DAY', '毎日学ぼう', 'រៀនរាល់ថ្ងៃ', 'BELAJAR SETIAP HARI', 'BELAJAR SETIAP HARI', 'เรียนรู้ทุกวัน', 'APRENDE CADA DÍA', 'LERNEN JEDEN TAG'],
    'HOW IT WORKS': ['HOW IT WORKS', '使い方', 'របៀបដំណើរការ', 'CARA KERJA', 'CARA BERFUNGSI', 'วิธีการทำงาน', 'CÓMO FUNCIONA', 'SO FUNKTIONIERT ES'],
    'Luyện diễn đạt và tự tin giao tiếp hơn.': ['Practice expressing yourself and communicate with more confidence.', '表現力を磨き、自信を持って会話しましょう。', 'ហាត់បញ្ចេញមតិ និងទំនាក់ទំនងដោយទំនុកចិត្ត។', 'Berlatih mengungkapkan diri dan berkomunikasi lebih percaya diri.', 'Berlatih menyampaikan idea dan berkomunikasi dengan lebih yakin.', 'ฝึกการสื่อสารและพูดได้อย่างมั่นใจมากขึ้น', 'Practica la expresión y comunícate con más confianza.', 'Übe, dich auszudrücken und selbstbewusster zu kommunizieren.'],
    'Làm quen với âm thanh và cách diễn đạt tự nhiên.': ['Get familiar with natural sounds and expressions.', '自然な音や表現に慣れましょう。', 'ស្គាល់សំឡេង និងការបញ្ចេញមតិធម្មជាតិ។', 'Biasakan diri dengan bunyi dan ungkapan alami.', 'Biasakan diri dengan bunyi dan ungkapan semula jadi.', 'คุ้นเคยกับเสียงและสำนวนที่เป็นธรรมชาติ', 'Familiarízate con los sonidos y expresiones naturales.', 'Lerne natürliche Klänge und Ausdrücke kennen.'],
    'Hiểu ý nghĩa, từ vựng và cấu trúc câu.': ['Understand meanings, vocabulary, and sentence structures.', '意味・語彙・文型を理解しましょう。', 'យល់អត្ថន័យ វាក្យសព្ទ និងរចនាសម្ព័ន្ធប្រយោគ។', 'Pahami makna, kosakata, dan struktur kalimat.', 'Fahami makna, kosa kata dan struktur ayat.', 'เข้าใจความหมาย คำศัพท์ และโครงสร้างประโยค', 'Comprende significados, vocabulario y estructuras de frases.', 'Verstehe Bedeutungen, Wortschatz und Satzstrukturen.'],
    'Thực hành tạo câu và sử dụng kiến thức chủ động.': ['Practice forming sentences and actively using what you learn.', '文を作り、学んだ知識を積極的に使いましょう。', 'ហាត់បង្កើតប្រយោគ និងប្រើចំណេះដឹងយ៉ាងសកម្ម។', 'Berlatih membuat kalimat dan menggunakan pengetahuan secara aktif.', 'Berlatih membina ayat dan menggunakan pengetahuan secara aktif.', 'ฝึกสร้างประโยคและนำความรู้ไปใช้', 'Practica crear frases y usar activamente lo aprendido.', 'Übe, Sätze zu bilden und dein Wissen aktiv anzuwenden.'],
    'Một trải nghiệm học tập được thiết kế để giúp bạn chuyển từ tiếp thu kiến thức sang chủ động sử dụng tiếng Nhật.': ['A learning experience designed to help you move from absorbing knowledge to actively using Japanese.', '知識を身につけるだけでなく、日本語を実際に使えるように設計された学習体験です。', 'បទពិសោធន៍រៀនដែលជួយឱ្យអ្នកផ្លាស់ពីការទទួលចំណេះដឹងទៅការប្រើភាសាជប៉ុនយ៉ាងសកម្ម។', 'Pengalaman belajar yang dirancang untuk membantu kamu beralih dari memahami materi ke menggunakan bahasa Jepang secara aktif.', 'Pengalaman pembelajaran yang membantu anda beralih daripada menerima ilmu kepada menggunakan bahasa Jepun secara aktif.', 'ประสบการณ์การเรียนที่ออกแบบให้คุณเปลี่ยนจากการรับความรู้ไปสู่การใช้ภาษาญี่ปุ่นจริง', 'Una experiencia diseñada para pasar de adquirir conocimientos a usar el japonés activamente.', 'Ein Lernerlebnis, das dich vom Aufnehmen von Wissen zur aktiven Anwendung des Japanischen führt.'],
    'Khám phá bản demo': ['Explore the demo', 'デモを体験', 'ស្វែងយល់ពីសាកល្បង', 'Jelajahi demo', 'Terokai demo', 'ดูเดโม', 'Explorar la demo', 'Demo entdecken'],
    'Khám phá': ['Explore', '探す', 'ស្វែងយល់', 'Jelajahi', 'Terokai', 'สำรวจ', 'Explorar', 'Entdecken'],
    'Chọn nội dung và kỹ năng bạn muốn luyện tập.': ['Choose the content and skill you want to practice.', '練習したい内容とスキルを選びましょう。', 'ជ្រើសរើសមាតិកា និងជំនាញដែលអ្នកចង់ហាត់។', 'Pilih materi dan keterampilan yang ingin kamu latih.', 'Pilih kandungan dan kemahiran yang ingin anda latih.', 'เลือกเนื้อหาและทักษะที่ต้องการฝึก', 'Elige el contenido y la habilidad que quieres practicar.', 'Wähle Inhalte und Fähigkeiten, die du üben möchtest.'],
    'Học trong ngữ cảnh': ['Learn in context', '文脈の中で学ぶ', 'រៀនតាមបរិបទ', 'Belajar dalam konteks', 'Belajar mengikut konteks', 'เรียนรู้ตามบริบท', 'Aprende en contexto', 'Im Kontext lernen'],
    'Kết nối từ vựng, ngữ pháp với ví dụ thực tế.': ['Connect vocabulary and grammar with real examples.', '語彙や文法を実例と結びつけましょう。', 'ភ្ជាប់វាក្យសព្ទ និងវេយ្យាករណ៍ជាមួយឧទាហរណ៍ពិត។', 'Hubungkan kosakata dan tata bahasa dengan contoh nyata.', 'Hubungkan kosa kata dan tatabahasa dengan contoh sebenar.', 'เชื่อมโยงคำศัพท์และไวยากรณ์กับตัวอย่างจริง', 'Relaciona vocabulario y gramática con ejemplos reales.', 'Verbinde Wortschatz und Grammatik mit echten Beispielen.'],
    'Thực hành cùng AI': ['Practice with AI', 'AIと練習', 'ហាត់ជាមួយ AI', 'Berlatih dengan AI', 'Berlatih dengan AI', 'ฝึกกับ AI', 'Practica con IA', 'Mit KI üben'],
    'Luyện tập và nhận hỗ trợ trong quá trình học.': ['Practice and get support as you learn.', '練習しながら学習サポートを受けましょう。', 'ហាត់ និងទទួលបានជំនួយក្នុងពេលរៀន។', 'Berlatih dan dapatkan bantuan selama belajar.', 'Berlatih dan dapatkan sokongan semasa belajar.', 'ฝึกฝนและรับความช่วยเหลือระหว่างเรียน', 'Practica y recibe apoyo durante el aprendizaje.', 'Übe und erhalte Unterstützung beim Lernen.'],
    'Ôn tập và duy trì': ['Review and stay consistent', '復習して継続', 'រំលឹកឡើងវិញ និងបន្តជាប្រចាំ', 'Ulangi dan tetap konsisten', 'Ulang kaji dan kekal konsisten', 'ทบทวนและเรียนอย่างสม่ำเสมอ', 'Repasa y mantén la constancia', 'Wiederholen und dranbleiben'],
    'Giữ nhịp học đều đặn và quay lại kiến thức đã học.': ['Keep a steady learning rhythm and revisit what you have learned.', '学習のペースを保ち、学んだ内容を復習しましょう。', 'រក្សាចង្វាក់រៀនទៀងទាត់ និងត្រឡប់ទៅមេរៀនចាស់។', 'Jaga ritme belajar dan tinjau kembali materi yang sudah dipelajari.', 'Kekalkan rentak pembelajaran dan ulang kaji perkara yang telah dipelajari.', 'รักษาจังหวะการเรียนและกลับมาทบทวนสิ่งที่เรียนแล้ว', 'Mantén el ritmo y repasa lo aprendido.', 'Behalte einen regelmäßigen Lernrhythmus bei und wiederhole Gelerntes.'],
    'Kỹ năng: Nghe': ['Skill: Listening', 'スキル：聞く', 'ជំនាញ៖ ស្តាប់', 'Keterampilan: Menyimak', 'Kemahiran: Mendengar', 'ทักษะ: การฟัง', 'Habilidad: Escuchar', 'Fähigkeit: Hören'],
    'Luyện nghe phản xạ với hội thoại đời sống, video và nội dung tiếng Nhật gần gũi.': ['Build listening reflexes with everyday conversations, videos, and practical Japanese content.', '日常会話や動画を使って、実践的な日本語の聞き取りを練習しましょう。', 'ហាត់ស្តាប់ឆ្លើយតបតាមរយៈការសន្ទនាប្រចាំថ្ងៃ វីដេអូ និងមាតិកាជប៉ុនជាក់ស្តែង។', 'Latih respons mendengarkan melalui percakapan sehari-hari, video, dan konten Jepang yang relevan.', 'Latih tindak balas mendengar melalui perbualan harian, video dan kandungan Jepun yang praktikal.', 'ฝึกฟังและตอบสนองจากบทสนทนาในชีวิตประจำวัน วิดีโอ และเนื้อหาญี่ปุ่นจริง', 'Mejora tu comprensión auditiva con conversaciones cotidianas, vídeos y contenido japonés práctico.', 'Trainiere dein Hörverständnis mit Alltagsgesprächen, Videos und praktischem Japanisch.'],
    'Tùy chỉnh tốc độ 0.75x–1.5x': ['Adjust speed 0.75x–1.5x', '速度を0.75倍〜1.5倍に調整', 'កែសម្រួលល្បឿន 0.75x–1.5x', 'Atur kecepatan 0,75x–1,5x', 'Laraskan kelajuan 0.75x–1.5x', 'ปรับความเร็ว 0.75x–1.5x', 'Ajusta la velocidad de 0,75x a 1,5x', 'Geschwindigkeit von 0,75x bis 1,5x einstellen'],
    'Phụ đề và Furigana': ['Subtitles and Furigana', '字幕とふりがな', 'ចំណងជើងរង និង Furigana', 'Subtitle dan Furigana', 'Sari kata dan Furigana', 'คำบรรยายและฟุริงานะ', 'Subtítulos y furigana', 'Untertitel und Furigana'],
    'Nghe lặp lại / Shadowing': ['Repeat listening / Shadowing', 'リピート再生・シャドーイング', 'ស្តាប់ម្តងហើយម្តងទៀត / Shadowing', 'Dengarkan ulang / Shadowing', 'Dengar berulang / Shadowing', 'ฟังซ้ำ / Shadowing', 'Escucha repetida / Shadowing', 'Wiederholen / Shadowing'],
    'Gợi ý nội dung': ['Suggested content', 'おすすめコンテンツ', 'មាតិកាណែនាំ', 'Rekomendasi konten', 'Kandungan yang disyorkan', 'เนื้อหาแนะนำ', 'Contenido recomendado', 'Inhalte empfehlen'],
    'Hội thoại tại cửa hàng tiện lợi (Combini), tin tức dễ hiểu và các tình huống giao tiếp hằng ngày.': ['Convenience-store conversations, easy news, and everyday communication scenarios.', 'コンビニでの会話、やさしいニュース、日常のコミュニケーション場面。', 'ការសន្ទនានៅហាង convenience store ព័ត៌មានងាយយល់ និងស្ថានការណ៍ប្រចាំថ្ងៃ។', 'Percakapan di minimarket, berita sederhana, dan situasi komunikasi sehari-hari.', 'Perbualan di kedai serbaneka, berita mudah dan situasi komunikasi harian.', 'บทสนทนาในร้านสะดวกซื้อ ข่าวที่เข้าใจง่าย และสถานการณ์ในชีวิตประจำวัน', 'Conversaciones en tiendas, noticias fáciles y situaciones cotidianas.', 'Gespräche im Convenience-Store, leicht verständliche Nachrichten und Alltagssituationen.'],
    'Cơ bản': ['Basic', 'ベーシック', 'មូលដ្ឋាន', 'Dasar', 'Asas', 'พื้นฐาน', 'Básico', 'Basis'],
    'Bắt đầu miễn phí': ['Start for free', '無料で始める', 'ចាប់ផ្តើមឥតគិតថ្លៃ', 'Mulai gratis', 'Mula secara percuma', 'เริ่มฟรี', 'Empieza gratis', 'Kostenlos starten'],
    'Trải nghiệm Pro': ['Try Pro', 'Proを体験', 'សាកល្បង Pro', 'Coba Pro', 'Cuba Pro', 'ทดลองใช้ Pro', 'Probar Pro', 'Pro testen'],
    'Tìm hiểu gói trọn đời': ['Explore Lifetime plan', 'Lifetimeプランを見る', 'ស្វែងយល់ពីកញ្ចប់ Lifetime', 'Lihat paket Lifetime', 'Lihat pelan Lifetime', 'ดูแพ็กเกจ Lifetime', 'Ver el plan de por vida', 'Lifetime-Tarif entdecken'],
    'Giới thiệu NihonGO': ['About NihonGO', 'NihonGOについて', 'អំពី NihonGO', 'Tentang NihonGO', 'Tentang NihonGO', 'เกี่ยวกับ NihonGO', 'Acerca de NihonGO', 'Über NihonGO'],
    '4 kỹ năng toàn diện': ['All four skills', '4技能を総合的に', 'ជំនាញទាំង ៤', 'Empat keterampilan', 'Empat kemahiran', 'ครบทั้ง 4 ทักษะ', 'Las cuatro habilidades', 'Alle vier Fähigkeiten'],
    'Lộ trình học cá nhân hóa': ['Personalized learning path', '個別学習プラン', 'ផែនការរៀនផ្ទាល់ខ្លួន', 'Jalur belajar personal', 'Laluan pembelajaran peribadi', 'แผนการเรียนเฉพาะบุคคล', 'Ruta de aprendizaje personalizada', 'Personalisierter Lernpfad'],
    'Trải nghiệm bài tập': ['Try exercises', '練習問題を体験', 'សាកល្បងលំហាត់', 'Coba latihan', 'Cuba latihan', 'ลองทำแบบฝึกหัด', 'Probar ejercicios', 'Übungen ausprobieren'],
    'Cảm nhận học viên': ['Learner reviews', '学習者の声', 'មតិអ្នកសិក្សា', 'Ulasan pelajar', 'Ulasan pelajar', 'รีวิวจากผู้เรียน', 'Opiniones de estudiantes', 'Erfahrungsberichte'],
    'Bảng giá gói học': ['Learning plans and pricing', '学習プランと料金', 'កញ្ចប់សិក្សា និងតម្លៃ', 'Paket dan harga', 'Pelan dan harga', 'แพ็กเกจและราคา', 'Planes y precios', 'Lernpläne und Preise'],
    'Câu hỏi thường gặp': ['FAQ', 'よくある質問', 'សំណួរញឹកញាប់', 'Pertanyaan umum', 'Soalan lazim', 'คำถามที่พบบ่อย', 'Preguntas frecuentes', 'Häufige Fragen'],
    'Luyện nghe mẫu': ['Listening demo', 'リスニング体験', 'សាកល្បងស្តាប់', 'Demo menyimak', 'Demo mendengar', 'ตัวอย่างฝึกฟัง', 'Demo de escucha', 'Hörbeispiel'],
    'Câu hỏi N5': ['N5 question', 'N5の問題', 'សំណួរ N5', 'Soal N5', 'Soalan N5', 'คำถาม N5', 'Pregunta N5', 'N5-Frage'],
    'Từ điển Kanji N5–N1 (sắp có)': ['Kanji dictionary N5–N1 (coming soon)', '漢字辞典 N5〜N1（近日公開）', 'វចនានុក្រម Kanji N5–N1 (នឹងមកដល់)', 'Kamus Kanji N5–N1 (segera hadir)', 'Kamus Kanji N5–N1 (akan datang)', 'พจนานุกรมคันจิ N5–N1 (เร็ว ๆ นี้)', 'Diccionario de kanji N5–N1 (próximamente)', 'Kanji-Wörterbuch N5–N1 (demnächst)']
  });

  Object.assign(localizedText, {
    'Thực tập sinh tại Tokyo, Nhật Bản': ['Intern in Tokyo, Japan', '日本・東京でインターン', 'អ្នកហាត់ការនៅតូក្យូ ប្រទេសជប៉ុន', 'Magang di Tokyo, Jepang', 'Pelatih industri di Tokyo, Jepun', 'นักศึกษาฝึกงานในโตเกียว ประเทศญี่ปุ่น', 'Practicante en Tokio, Japón', 'Praktikant in Tokio, Japan'],
    'Kỹ sư cầu nối (BrSE)': ['Bridge System Engineer (BrSE)', 'ブリッジシステムエンジニア（BrSE）', 'វិស្វករភ្ជាប់ទំនាក់ទំនង (BrSE)', 'Bridge System Engineer (BrSE)', 'Jurutera Sistem Penghubung (BrSE)', 'วิศวกรประสานงานระบบ (BrSE)', 'Ingeniero puente (BrSE)', 'Bridge-Systemingenieur (BrSE)'],
    'Trước đây mình rất sợ phần Nghe và Nói vì không có người luyện tập cùng. Từ ngày học với NihonGO, linh vật Momo dễ thương luôn đồng hành nhắc nhở.': ['I used to be afraid of listening and speaking because I had no one to practice with. Since studying with NihonGO, the lovely Momo mascot has been there to encourage me.', '以前は一緒に練習する人がいなくて、聞くことと話すことが苦手でした。NihonGOで学び始めてから、かわいいMomoがいつも励ましてくれます。', 'ពីមុនខ្ញុំខ្លាចការស្តាប់ និងការនិយាយ ព្រោះគ្មានអ្នកហាត់ជាមួយ។ ចាប់តាំងពីរៀនជាមួយ NihonGO មក Momo ដ៏គួរឱ្យស្រឡាញ់តែងតែលើកទឹកចិត្តខ្ញុំ។', 'Dulu saya takut latihan menyimak dan berbicara karena tidak punya teman berlatih. Sejak belajar dengan NihonGO, maskot Momo selalu menemani dan menyemangati saya.', 'Dahulu saya takut berlatih mendengar dan bertutur kerana tiada rakan latihan. Sejak belajar dengan NihonGO, maskot Momo sentiasa menemani dan memberi semangat.', 'เมื่อก่อนฉันกลัวการฟังและการพูดเพราะไม่มีคนฝึกด้วย ตั้งแต่เรียนกับ NihonGO มาสคอต Momo ก็คอยอยู่เคียงข้างและให้กำลังใจเสมอ', 'Antes me daba miedo escuchar y hablar porque no tenía con quién practicar. Desde que estudio con NihonGO, la adorable mascota Momo me acompaña y anima.', 'Früher hatte ich Angst vor Hör- und Sprechübungen, weil ich niemanden zum Üben hatte. Seit ich mit NihonGO lerne, begleitet mich das süße Maskottchen Momo und motiviert mich.'],
    'Video ngữ cảnh thực tế của NihonGO khác biệt hoàn toàn với các app sách vở truyền thống. Bạn học được những câu người Nhật thường nói ở văn phòng và đời sống.': ['NihonGO’s real-life contextual videos are very different from traditional textbook apps. You learn phrases Japanese people actually use at work and in daily life.', 'NihonGOの実際の場面を使った動画は、従来の教科書型アプリとは大きく違います。職場や日常生活で日本人がよく使う表現を学べます。', 'វីដេអូតាមបរិបទជាក់ស្តែងរបស់ NihonGO ខុសពីកម្មវិធីសៀវភៅបែបប្រពៃណី។ អ្នករៀនឃ្លាដែលជនជាតិជប៉ុនប្រើនៅការិយាល័យ និងជីវិតប្រចាំថ្ងៃ។', 'Video kontekst nyata NihonGO berbeda dari aplikasi buku teks tradisional. Kamu belajar ungkapan yang benar-benar digunakan orang Jepang di kantor dan kehidupan sehari-hari.', 'Video berasaskan situasi sebenar NihonGO berbeza daripada aplikasi buku teks tradisional. Anda belajar ungkapan yang biasa digunakan orang Jepun di pejabat dan kehidupan harian.', 'วิดีโอสถานการณ์จริงของ NihonGO แตกต่างจากแอปตำราแบบเดิม คุณจะได้เรียนรู้ประโยคที่คนญี่ปุ่นใช้จริงในที่ทำงานและชีวิตประจำวัน', 'Los vídeos contextualizados de NihonGO son muy distintos de las apps tradicionales de libros. Aprendes expresiones que los japoneses usan en la oficina y en la vida diaria.', 'Die Videos mit realen Situationen von NihonGO unterscheiden sich deutlich von klassischen Lehrbuch-Apps. Du lernst Ausdrücke, die Japaner im Büro und Alltag tatsächlich verwenden.'],
    'Giao diện ứng dụng trực quan! Mỗi ngày chỉ cần 15 phút rảnh rỗi trên xe bus là mình đã học xong mục tiêu mà không cảm thấy áp lực.': ['The app interface is intuitive! Just 15 spare minutes on the bus each day is enough to finish my learning goal without feeling pressured.', 'アプリの画面は直感的で使いやすいです。毎日バスで空いた15分だけで、プレッシャーを感じずに学習目標を達成できます。', 'ចំណុចប្រទាក់កម្មវិធីងាយស្រួលប្រើ! ចំណាយពេលទំនេរ ១៥ នាទីលើឡានក្រុងរាល់ថ្ងៃ ក៏អាចបញ្ចប់គោលដៅរៀនដោយមិនមានសម្ពាធ។', 'Antarmuka aplikasinya mudah dipahami! Cukup 15 menit waktu luang di bus setiap hari untuk menyelesaikan target belajar tanpa merasa tertekan.', 'Antara muka aplikasinya mudah digunakan! Hanya 15 minit masa lapang di bas setiap hari sudah cukup untuk mencapai sasaran belajar tanpa tekanan.', 'หน้าตาแอปใช้งานง่าย! ใช้เวลาว่างบนรถบัสวันละ 15 นาที ก็ทำเป้าหมายการเรียนได้โดยไม่รู้สึกกดดัน', '¡La interfaz es intuitiva! Con solo 15 minutos libres en el autobús cada día completo mi objetivo de estudio sin sentir presión.', 'Die App ist intuitiv! Mit nur 15 freien Minuten im Bus schaffe ich mein Lernziel jeden Tag, ohne mich unter Druck zu fühlen.'],
    'Đỗ JLPT N2 sau 8 tháng học cùng Momo': ['Passed JLPT N2 after 8 months learning with Momo', 'Momoと8か月学習してJLPT N2に合格', 'ប្រឡងជាប់ JLPT N2 បន្ទាប់ពីរៀនជាមួយ Momo ៨ ខែ', 'Lulus JLPT N2 setelah 8 bulan belajar bersama Momo', 'Lulus JLPT N2 selepas 8 bulan belajar bersama Momo', 'สอบผ่าน JLPT N2 หลังเรียนกับ Momo 8 เดือน', 'Aprobé el JLPT N2 tras 8 meses aprendiendo con Momo', 'JLPT N2 nach 8 Monaten Lernen mit Momo bestanden'],
    'Giao tiếp công sở tự nhiên, đỗ N1': ['Natural workplace communication; passed N1', '自然な職場会話、N1合格', 'ទំនាក់ទំនងនៅកន្លែងធ្វើការធម្មជាតិ និងប្រឡងជាប់ N1', 'Komunikasi kantor alami, lulus N1', 'Komunikasi pejabat yang semula jadi, lulus N1', 'สื่อสารในที่ทำงานได้เป็นธรรมชาติ สอบผ่าน N1', 'Comunicación natural en la oficina; aprobó el N1', 'Natürliche Kommunikation im Büro; N1 bestanden'],
    'Đạt chuỗi streak 120 ngày liên tục': ['Reached a 120-day learning streak', '120日連続学習を達成', 'សម្រេចបានការរៀនជាប់គ្នា ១២០ ថ្ងៃ', 'Mencapai streak belajar 120 hari berturut-turut', 'Mencapai rentetan belajar 120 hari berturut-turut', 'เรียนต่อเนื่องครบ 120 วัน', 'Logró una racha de aprendizaje de 120 días', '120 Tage Lernserie erreicht']
  });

  const langCodes = ['en', 'ja', 'km', 'id', 'ms', 'th', 'es', 'de'];
  const defaultText = new Map();
  const translatableAttrs = ['aria-label', 'title', 'placeholder', 'alt'];
  function applyLanguage(lang) {
    const index = langCodes.indexOf(lang);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!defaultText.has(node)) defaultText.set(node, node.nodeValue);
      const original = defaultText.get(node);
      const trimmed = original.trim();
      if (lang === 'vi') { node.nodeValue = original; continue; }
      const entry = localizedText[trimmed];
      if (entry && index >= 0 && entry[index]) {
        const start = original.match(/^\s*/)?.[0] || '';
        const end = original.match(/\s*$/)?.[0] || '';
        node.nodeValue = start + entry[index] + end;
      }
    }
    document.documentElement.lang = lang;
    const titleMap = {
      vi: 'NihonGO — Học tiếng Nhật cùng Momo', en: 'NihonGO — Learn Japanese with Momo', ja: 'NihonGO — Momoと日本語を学ぼう', km: 'NihonGO — រៀនភាសាជប៉ុនជាមួយ Momo', id: 'NihonGO — Belajar bahasa Jepang bersama Momo', ms: 'NihonGO — Belajar bahasa Jepun bersama Momo', th: 'NihonGO — เรียนภาษาญี่ปุ่นกับ Momo', es: 'NihonGO — Aprende japonés con Momo', de: 'NihonGO — Japanisch lernen mit Momo'
    };
    document.title = titleMap[lang] || titleMap.vi;
    document.querySelectorAll(translatableAttrs.map(a => `[${a}]`).join(',')).forEach(el => {
      translatableAttrs.forEach(attr => {
        if (!el.hasAttribute(attr)) return;
        if (!el.dataset[`original${attr.replace(/[^a-z]/gi, '')}`]) el.dataset[`original${attr.replace(/[^a-z]/gi, '')}`] = el.getAttribute(attr);
        const key = el.dataset[`original${attr.replace(/[^a-z]/gi, '')}`].trim();
        if (lang === 'vi') el.setAttribute(attr, el.dataset[`original${attr.replace(/[^a-z]/gi, '')}`]);
        else if (localizedText[key] && index >= 0 && localizedText[key][index]) el.setAttribute(attr, localizedText[key][index]);
      });
    });
    const furiganaBtn = document.querySelector('#furigana-toggle');
    if (furiganaBtn) furiganaBtn.dataset.currentLanguage = lang;
  }
  if (languageSelect) {
    languageSelect.addEventListener('change', () => applyLanguage(languageSelect.value));
    // Vietnamese is the default language on every fresh visit.
    languageSelect.value = 'vi';
  }
  // Accessible custom language menu. Keep the native select as the single source of truth.
  const languagePicker = document.querySelector('#language-picker');
  const languageTrigger = document.querySelector('#language-trigger');
  const languageMenu = document.querySelector('#language-menu');
  const languageCurrent = document.querySelector('#language-current');
  const languageNames = {vi:'Vietnamese',en:'English',ja:'Japanese',km:'Khmer',id:'Indonesian',ms:'Malay',th:'Thai',es:'Spanish',de:'German'};
  function closeLanguageMenu() {
    if (!languagePicker || !languageTrigger || !languageMenu) return;
    languagePicker.classList.remove('is-open');
    languageMenu.hidden = true;
    languageTrigger.setAttribute('aria-expanded','false');
  }
  function syncLanguagePicker(lang) {
    if (!languagePicker || !languageCurrent) return;
    languageCurrent.textContent = languageNames[lang] || 'Vietnamese';
    languagePicker.querySelectorAll('.language-option').forEach(option => {
      const selected = option.dataset.lang === lang;
      option.classList.toggle('is-selected', selected);
      option.setAttribute('aria-selected', String(selected));
    });
  }
  if (languagePicker && languageTrigger && languageMenu && languageSelect) {
    languageTrigger.addEventListener('click', () => {
      const opening = languageMenu.hidden;
      languageMenu.hidden = !opening;
      languagePicker.classList.toggle('is-open', opening);
      languageTrigger.setAttribute('aria-expanded', String(opening));
    });
    languagePicker.querySelectorAll('.language-option').forEach(option => {
      option.addEventListener('click', () => {
        languageSelect.value = option.dataset.lang;
        languageSelect.dispatchEvent(new Event('change', {bubbles:true}));
        syncLanguagePicker(option.dataset.lang);
        closeLanguageMenu();
        languageTrigger.focus();
      });
    });
    document.addEventListener('click', event => {
      if (!languagePicker.contains(event.target)) closeLanguageMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !languageMenu.hidden) {
        closeLanguageMenu();
        languageTrigger.focus();
      }
    });
    languageSelect.addEventListener('change', () => syncLanguagePicker(languageSelect.value));
    syncLanguagePicker('vi');
  }
