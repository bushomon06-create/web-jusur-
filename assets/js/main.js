/**
 * جسر للتأهيل والرعاية عن بُعد - Jisr Tele-Rehabilitation Platform
 * Main Interactive Engine & Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initPortalsDrawer();
  initServicesModal();
  initPartnershipModal();
  initAppModal();
  initFaqAccordion();
  initContactForm();
  initAccessibility();
  initScrollAnimations();
});

/* ==========================================================================
   1. Header, Mobile Navigation & Scroll Detection
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  // Elevation on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-md', 'bg-white/95');
      header.classList.remove('bg-white/80');
    } else {
      header.classList.remove('shadow-md', 'bg-white/95');
      header.classList.add('bg-white/80');
    }
  });

  // Mobile drawer toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking any link inside it
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section indicator
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-primary', 'font-semibold');
            link.classList.remove('text-on-surface-variant');
          } else {
            link.classList.remove('text-primary', 'font-semibold');
            link.classList.add('text-on-surface-variant');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   2. User Portals Sliding Drawer (Side Drawer)
   ========================================================================== */
function initPortalsDrawer() {
  const drawer = document.getElementById('portals-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const panel = document.getElementById('drawer-panel');
  const closeBtn = document.getElementById('close-drawer-btn');
  const triggers = document.querySelectorAll('[data-open-portals]');

  if (!drawer || !panel) return;

  function openDrawer() {
    drawer.classList.remove('pointer-events-none');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.classList.remove('opacity-0');
    backdrop.classList.add('opacity-100');

    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    panel.style.transform = 'translateX(0)';

    // Trap focus
    if (closeBtn) closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');

    panel.style.transform = isRtl ? 'translateX(100%)' : 'translateX(-100%)';

    setTimeout(() => {
      drawer.classList.add('pointer-events-none');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }, 300);
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.getAttribute('aria-hidden') === 'false') {
      closeDrawer();
    }
  });

  // Export functions to global scope
  window.openPortalsDrawer = openDrawer;
  window.closePortalsDrawer = closeDrawer;
}

/* ==========================================================================
   3. Services Exploration Modal
   ========================================================================== */
const serviceData = {
  1: {
    titleAr: "التقييم المبدئي للمستفيد",
    titleEn: "Initial Functional Assessment",
    icon: "assignment",
    tagAr: "الخطوة الأولى",
    tagEn: "First Step",
    descAr: "استبيان رقمي منهجي لتحديد الصعوبات الوظيفية والاحتياجات الحركية لتوجيه الحالة نحو الأخصائي المناسب.",
    descEn: "A guided digital questionnaire identifying functional difficulties and mobility needs to direct the case accurately.",
    detailsAr: [
      "فحص شامل للقدرات الحركية (التوازن، المفاصل، المشي، الجلوس والوقوف).",
      "توجيه آلي ذكي نحو التخصص السريري الأكثر ملاءمة لحالة المستفيد.",
      "توفير وقت الأسر والعيادات عبر جمع البيانات الأولية مسبقاً وبدقة.",
      "إمكانية إرفاق التقارير الطبية السابقة بصيغة آمنة ومشفرة."
    ],
    detailsEn: [
      "Comprehensive screening of motor functions (balance, joints, gait, sit-to-stand).",
      "Intelligent routing towards the most suitable clinical specialty.",
      "Saves family and clinic time by systematically collecting preliminary records.",
      "Enables secure, encrypted upload of previous medical records."
    ],
    portalLink: "../تحديد مشكلة المستفيد/تحديد المشكلة.html",
    portalTextAr: "بدء التقييم الوظيفي المبدئي الآن",
    portalTextEn: "Start Initial Functional Assessment"
  },
  2: {
    titleAr: "خطط التأهيل الفردية",
    titleEn: "Personalized Rehabilitation Plans",
    icon: "health_and_safety",
    tagAr: "إشراف سريري",
    tagEn: "Clinical Oversight",
    descAr: "خطط علاجية مخصصة وموجهة يصممها الأخصائي المعالج بدقة وفق احتياجات وقدرات كل مستفيد.",
    descEn: "Customized therapeutic regimens formulated and approved by the treating clinician.",
    detailsAr: [
      "صياغة أهداف علاجية ذكية (قصيرة ومتوسطة وطويلة المدى).",
      "برمجة التمارين وتحديد درجات الشدة والتكرارات المناسبة للقدرة الوظيفية.",
      "مراجعة دورية وتعديل مستمر للخطة استناداً إلى سرعة الاستجابة الحركية.",
      "اعتماد رسمي وموثق من أخصائي مرخص في العلاج الطبيعي أو التأهيل."
    ],
    detailsEn: [
      "Formulation of SMART therapeutic goals (short, medium, and long-term).",
      "Exercise scheduling with tailored intensity, sets, and rest intervals.",
      "Periodic reviews and dynamic plan adjustments based on recovery pace.",
      "Certified and documented approval by a licensed physical therapist."
    ],
    portalLink: "../المختص/الرئيسية/index.html",
    portalTextAr: "استكشف خطط التأهيل في بوابة الأخصائي",
    portalTextEn: "Explore Plans in Specialist Portal"
  },
  3: {
    titleAr: "التمارين المنزلية الموجهة",
    titleEn: "Guided Home Exercises",
    icon: "fitness_center",
    tagAr: "محتوى تعليمي",
    tagEn: "Educational Media",
    descAr: "مكتبة وسائط تعليمية عالية الدقة توضح الطريقة السليمة لأداء التمارين وتفادي الحركات الخاطئة.",
    descEn: "High-definition educational media demonstrating accurate exercise techniques and preventing incorrect postures.",
    detailsAr: [
      "فيديوهات تصويرية عالية الدقة مع شروحات صوتية باللغة العربية البسيطة.",
      "توضيح زوايا الأداء السليم وتنبيهات الأمان لتفادي الإجهاد أو الإصابة.",
      "إمكانية تنزيل التمارين للمشاهدة بدون الحاجة لاتصال مستمر بالإنترنت.",
      "تصنيف التمارين حسب العضو المستهدف (الأطراف السفلية، التوازن، المرونة)."
    ],
    detailsEn: [
      "High-definition video demonstrations with concise vocal cues.",
      "Highlights safe movement posture and precautions to avoid strain.",
      "Offline access option for continuous home training.",
      "Categorized by target functional area (lower limbs, balance, flexibility)."
    ],
    portalLink: "../المستفيد/الصفحة الرئيسية/الرئيسية/code.html",
    portalTextAr: "عرض مكتبة التمارين في تطبيق المستفيد",
    portalTextEn: "View Exercise Library in App"
  },
  4: {
    titleAr: "المتابعة مع المختصين",
    titleEn: "Clinical Specialist Follow-Up",
    icon: "support_agent",
    tagAr: "تواصل مستمر",
    tagEn: "Ongoing Liaison",
    descAr: "قنوات اتصال منتظمة وموثوقة تربط الأسر بالأخصائي المعالج لمتابعة الاستجابة ومناقشة التطورات.",
    descEn: "Secure communication channels linking families to treating clinicians for ongoing evaluation.",
    detailsAr: [
      "مراسلة سريرية آمنة بين الأسرة والأخصائي المعتمد للحالة.",
      "إرسال مقاطع فيديو سريعة توثق أداء التمرين المنزلي لتلقي ملاحظات التصحيح.",
      "جلسات مراجعة مرئية دورية لتقييم التطور ومناقشة التحديات.",
      "سجل موثق لجميع التوجيهات والملاحظات الطبية لسهولة الرجوع إليها."
    ],
    detailsEn: [
      "Confidential clinical messaging between family and the assigned clinician.",
      "Video upload of exercise performance for posture validation.",
      "Periodic virtual review checkups to discuss milestone progress.",
      "Documented history of all clinical recommendations and notes."
    ],
    portalLink: "../المختص/الرئيسية/index.html",
    portalTextAr: "الدخول إلى قنوات التواصل السريري",
    portalTextEn: "Enter Clinical Communications"
  },
  5: {
    titleAr: "المساعد الذكي للتمارين",
    titleEn: "Smart Exercise Assistant",
    icon: "smart_toy",
    tagAr: "مساند تقني",
    tagEn: "Tech Companion",
    descAr: "مساعد تقني يدعم متابعة أداء التمرين وإرشاد المستفيد، ولا يحل محل المختص المعالج.",
    descEn: "An interactive digital companion supporting home routine execution (does not replace the clinician).",
    detailsAr: [
      "توجيه صوتي وبصري تفاعلي لحساب فترات الراحة والتكرارات أثناء الجلسة.",
      "تذكير ذكي بمواعيد التمارين اليومية وفق الجدول المعتمد.",
      "أداة مساعدة للإرشاد والتحفيز ولا تتدخل في القرارات العلاجية الطبية.",
      "تسجيل تلقائي لزمن التمرين ومعدل إكمال الحركات للمراجعة اللاحقة."
    ],
    detailsEn: [
      "Interactive audio-visual cues counting reps and rest timers.",
      "Smart routine scheduling notifications matching the approved regimen.",
      "Purely a supportive guidance companion—never a substitute for clinical judgment.",
      "Automated session duration logging for specialist review."
    ],
    portalLink: "../المستفيد/الصفحة الرئيسية/الرئيسية/code.html",
    portalTextAr: "تجربة المساعد الذكي عبر التطبيق",
    portalTextEn: "Experience Smart Assistant in App"
  },
  6: {
    titleAr: "متابعة التقدم والالتزام",
    titleEn: "Progress & Adherence Tracking",
    icon: "trending_up",
    tagAr: "قياس الأثر",
    tagEn: "Impact Metrics",
    descAr: "تسجيل الإنجازات ومتابعة الالتزام بخطة التأهيل عبر مؤشرات ورسوم بيانية سهلة القراءة.",
    descEn: "Interactive analytical charts logging daily completed routines, commitment rates, and motor milestones.",
    detailsAr: [
      "رسوم بيانية توضح معدل الالتزام الأسبوعي والشهري بالتمارين.",
      "توثيق نقاط التحسن في المدى الحركي والقدرة على الاعتماد على النفس.",
      "شاشات تحفيزية للطفل والمستفيد تبرز الإنجازات المتتالية وتمنحه الأمل.",
      "تقارير رقمية فورية تظهر للأخصائي لاكتشاف أي تراجع مبكراً ومعالجته."
    ],
    detailsEn: [
      "Intuitive weekly and monthly adherence rate analytics.",
      "Documenting functional range of motion and self-reliance milestones.",
      "Gamified progress feedback encouraging beneficiaries along the way.",
      "Instant clinical visibility enabling early detection of adherence gaps."
    ],
    portalLink: "../المختص/التقدم و التقارير/الرئيسية التقدم و الالتزام.html",
    portalTextAr: "عرض مؤشرات التقدم والالتزام",
    portalTextEn: "View Progress & Adherence Metrics"
  },
  7: {
    titleAr: "الاستشارات والمواعيد",
    titleEn: "Tele-Consultations & Appointments",
    icon: "calendar_month",
    tagAr: "جدولة مرنة",
    tagEn: "Flexible Scheduling",
    descAr: "الوصول إلى الاستشارات عن بُعد والمواعيد الحضورية وفق الخدمات المتاحة وتوصيات الأخصائي.",
    descEn: "Flexible scheduling for virtual consultations and coordinated in-person clinic visits when needed.",
    detailsAr: [
      "حجز استشارات الفيديو عن بُعد دون الحاجة لمغادرة المنزل.",
      "تنسيق مواعيد فحص سريري حضوري عند الحاجة بتوصية الأخصائي.",
      "إدارة متكاملة لقوائم الانتظار والتنبيهات المسبقة لتفادي تفويت المواعيد.",
      "إمكانية إعادة الجدولة أو الإلغاء بمرونة ووضوح."
    ],
    detailsEn: [
      "Booking virtual tele-rehabilitation consults from home.",
      "Coordinated referrals to physical clinics when hands-on exam is necessary.",
      "Waitlist and proactive reminders minimizing missed slots.",
      "Effortless scheduling and rescheduling controls."
    ],
    portalLink: "../المستفيد/الصفحة الرئيسية/المواعيد/index.html",
    portalTextAr: "إدارة المواعيد والاستشارات",
    portalTextEn: "Manage Appointments & Consults"
  },
  8: {
    titleAr: "مجتمعات الدعم الأسري",
    titleEn: "Family Support Communities",
    icon: "groups",
    tagAr: "تكافل وتشارك",
    tagEn: "Peer Support",
    descAr: "مجموعات تتيح للأسر والمستفيدين تبادل الخبرات والدعم النفسي والتأهيلي التشاركي.",
    descEn: "Safe, moderated spaces for families and beneficiaries to exchange peer support, tips, and experiences.",
    detailsAr: [
      "مجموعات موجهة حسب الحالة (تأهيل الأطفال، إصابات الحوادث، كبار السن).",
      "إشراف ومراقبة محتوى لضمان بيئة آمنة وداعمة ومحفزة للأسر.",
      "تبادل النصائح العملية للتغلب على التحديات اليومية داخل المنزل.",
      "جلسات نقاشية توعوية دورية يشارك فيها مختصون وخبراء."
    ],
    detailsEn: [
      "Condition-focused groups (pediatric rehab, post-trauma, elderly care).",
      "Professionally moderated spaces ensuring safety and encouragement.",
      "Sharing practical daily home adaptation techniques.",
      "Periodic awareness roundtables with invited clinical guests."
    ],
    portalLink: "../المستفيد/الصفحة الرئيسية/المجتمع/index.html",
    portalTextAr: "استكشف مجتمعات الدعم الأسري",
    portalTextEn: "Explore Support Communities"
  },
  9: {
    titleAr: "بنك الأجهزة المساعدة",
    titleEn: "Assistive Devices Bank",
    icon: "accessible",
    tagAr: "تكامل مجتمعي",
    tagEn: "Community Integration",
    descAr: "مساحة للتعرف على الأجهزة المساعدة المتاحة والتبرع بها أو طلبها عبر الجمعيات الشريكة.",
    descEn: "A collaborative exchange for discovering, requesting, or donating assistive equipment through certified charities.",
    detailsAr: [
      "دليل استرشادي للأجهزة التعويضية والمساعدة (كراسي، دعامات، مشايات).",
      "ربط طلبات الاحتياج بالجمعيات الخيرية الداعمة والممولة.",
      "منظومة موثوقة للتبرع بالأجهزة الفائضة وإعادة تهيئتها وصيانتها.",
      "إشراف الأخصائي للتأكد من ملاءمة الجهاز لحالة المستفيد السريرية."
    ],
    detailsEn: [
      "Comprehensive catalog of mobility and orthotic assistive equipment.",
      "Links patient requests with charitable funding partners.",
      "Reliable system for recycling and reconditioning surplus equipment.",
      "Clinical verification ensuring the device matches the patient's biomechanics."
    ],
    portalLink: "../الجمعيات/index.html",
    portalTextAr: "استعراض بنك الأجهزة في بوابة الجمعيات",
    portalTextEn: "Browse Device Bank in Associations Portal"
  },
  10: {
    titleAr: "التقارير والمتابعة السريرية",
    titleEn: "Clinical Reports & Data Sharing",
    icon: "description",
    tagAr: "توثيق رسمي",
    tagEn: "Certified Records",
    descAr: "تنظيم تقارير التأهيل والتقدم ومشاركتها مع الجهات الطبية والداعمة وفق الصلاحيات والموافقات.",
    descEn: "Structured clinical progress reports ready to share with authorized medical bodies under strict consent.",
    detailsAr: [
      "إصدار تقارير طبية وتأهيلية دورية معتمدة برقم تسلسلي موثق.",
      "تلخيص شامل لمعدلات التحسن الحركي والتزام المستفيد بالخطة.",
      "تسهيل مشاركة التقرير مع المستشفيات أو اللجان الطبية والضمانية.",
      "امتثال صارم لسياسات حماية السجلات والبيانات الصحية والخصوصية."
    ],
    detailsEn: [
      "Official serialized progress reports ready for clinical validation.",
      "Comprehensive summary of functional improvements and adherence levels.",
      "Frictionless sharing with medical boards and healthcare sponsors.",
      "Strict compliance with healthcare record confidentiality guidelines."
    ],
    portalLink: "../المختص/التقدم و التقارير/التقارير.html",
    portalTextAr: "عرض أرشيف التقارير والتوثيق",
    portalTextEn: "View Clinical Reports Archive"
  }
};

function initServicesModal() {
  const modal = document.getElementById('service-modal');
  const closeBtn = document.getElementById('close-service-modal');
  const modalContent = document.getElementById('service-modal-content');
  if (!modal) return;

  function openService(id) {
    const service = serviceData[id];
    if (!service) return;

    const isEn = document.documentElement.getAttribute('lang') === 'en';
    const title = isEn ? service.titleEn : service.titleAr;
    const tag = isEn ? service.tagEn : service.tagAr;
    const desc = isEn ? service.descEn : service.descAr;
    const details = isEn ? service.detailsEn : service.detailsAr;
    const btnText = isEn ? service.portalTextEn : service.portalTextAr;

    modalContent.innerHTML = `
      <div class="flex items-start gap-4 mb-6">
        <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
          <span class="material-symbols-outlined text-3xl">${service.icon}</span>
        </div>
        <div>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary mb-1.5">${tag}</span>
          <h3 class="text-2xl font-bold text-on-surface">${title}</h3>
        </div>
      </div>
      <p class="text-on-surface-variant text-base leading-relaxed mb-6">${desc}</p>
      
      <div class="bg-surface-container-low rounded-2xl p-5 mb-6 border border-outline-variant/60">
        <h4 class="font-bold text-on-surface text-sm mb-3 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-lg">check_circle</span>
          ${isEn ? 'Key Clinical & Operational Features:' : 'أبرز مميزات وضوابط تقديم الخدمة:'}
        </h4>
        <ul class="space-y-2.5 text-sm text-on-surface-variant">
          ${details.map(d => `<li class="flex items-start gap-2.5"><span class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span><span>${d}</span></li>`).join('')}
        </ul>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-outline-variant">
        <a href="${service.portalLink}" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition shadow-sm">
          <span>${btnText}</span>
          <span class="material-symbols-outlined text-base">arrow_forward</span>
        </a>
        <button type="button" class="w-full sm:w-auto px-5 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container font-medium text-sm transition" onclick="closeServiceModal()">
          ${isEn ? 'Close' : 'إغلاق'}
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  // Bind service buttons
  document.querySelectorAll('[data-service-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-service-id');
      openService(id);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.closeServiceModal = closeModal;
  window.openServiceModal = openService;
}

/* ==========================================================================
   4. Partnership Modal
   ========================================================================== */
function initPartnershipModal() {
  const modal = document.getElementById('partnership-modal');
  const openBtns = document.querySelectorAll('[data-open-partnership]');
  const closeBtn = document.getElementById('close-partnership-modal');
  const form = document.getElementById('partnership-form');

  if (!modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const isEn = document.documentElement.getAttribute('lang') === 'en';

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
        <span>${isEn ? 'Submitting...' : 'جاري التقديم...'}</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>${isEn ? 'Submit Partnership Request' : 'تقديم طلب الشراكة'}</span>`;
        closeModal();
        showToast(
          isEn ? 'Partnership Request Received' : 'تم استلام طلب الشراكة بنجاح',
          isEn ? 'Our governance team will review your application and contact you shortly.' : 'سيقوم فريق الحوكمة بمراجعة بيانات المنشأة والتواصل معكم في أقرب وقت.',
          'success'
        );
        form.reset();
      }, 900);
    });
  }

  window.openPartnershipModal = openModal;
  window.closePartnershipModal = closeModal;
}

/* ==========================================================================
   5. App Download & QR Modal
   ========================================================================== */
function initAppModal() {
  const modal = document.getElementById('app-qr-modal');
  const openBtns = document.querySelectorAll('[data-open-app-modal]');
  const closeBtn = document.getElementById('close-app-modal');

  if (!modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.openAppModal = openModal;
  window.closeAppModal = closeModal;
}

/* ==========================================================================
   6. FAQ Accordion & Live Filter
   ========================================================================== */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faq-search-input');
  const filterTabs = document.querySelectorAll('.faq-tab');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all items
        accordionItems.forEach(other => {
          other.classList.remove('active');
          const otherTrigger = other.querySelector('.faq-trigger');
          const otherContent = other.querySelector('.faq-content');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = null;
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        // If it was closed, open it
        if (!isOpen) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });

  // Filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('bg-primary', 'text-white'));
      tab.classList.add('bg-primary', 'text-white');

      const category = tab.getAttribute('data-category');
      accordionItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      accordionItems.forEach(item => {
        const questionText = item.querySelector('.faq-question')?.textContent.toLowerCase() || '';
        const answerText = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';
        if (!q || questionText.includes(q) || answerText.includes(q)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   7. Contact Form Validation & State
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertContainer = document.getElementById('contact-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#contact-name').value.trim();
    const contactInfo = form.querySelector('#contact-info').value.trim();
    const type = form.querySelector('#contact-type').value;
    const message = form.querySelector('#contact-message').value.trim();
    const submitBtn = form.querySelector('#contact-submit-btn');
    const isEn = document.documentElement.getAttribute('lang') === 'en';

    if (!name || !contactInfo || !type || !message) {
      showAlert(
        isEn ? 'Please fill in all required fields.' : 'يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح.',
        'error'
      );
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
      <span>${isEn ? 'Sending...' : 'جاري الإرسال...'}</span>
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>${isEn ? 'Send Message' : 'إرسال الرسالة'}</span>
        <span class="material-symbols-outlined text-base">send</span>
      `;
      form.reset();
      showAlert(
        isEn ? 'Your message has been sent successfully. Our team will review it and reply soon.' : 'تم استلام رسالتك بنجاح! سيقوم فريق إدارة المنصة بمراجعتها والتواصل معك قريباً.',
        'success'
      );
      showToast(
        isEn ? 'Message Sent' : 'تم إرسال الرسالة',
        isEn ? 'Thank you for reaching out to Jisr Platform.' : 'شكراً لتواصلك مع منصة جسر.',
        'success'
      );
    }, 850);
  });

  function showAlert(msg, type) {
    if (!alertContainer) return;
    const isSuccess = type === 'success';
    alertContainer.className = `p-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
      isSuccess ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'bg-red-50 text-red-700 border border-red-200'
    }`;
    alertContainer.innerHTML = `
      <span class="material-symbols-outlined text-xl">${isSuccess ? 'check_circle' : 'error'}</span>
      <span>${msg}</span>
    `;
    alertContainer.classList.remove('hidden');

    setTimeout(() => {
      alertContainer.classList.add('hidden');
    }, 6000);
  }
}

/* ==========================================================================
   8. Accessibility Controls
   ========================================================================== */
function initAccessibility() {
  const widget = document.getElementById('a11y-widget');
  const toggleBtn = document.getElementById('a11y-toggle-btn');
  const fontBiggerBtn = document.getElementById('a11y-font-bigger');
  const fontNormalBtn = document.getElementById('a11y-font-normal');
  const contrastBtn = document.getElementById('a11y-contrast');
  const motionBtn = document.getElementById('a11y-motion');
  const resetBtn = document.getElementById('a11y-reset');

  if (toggleBtn && widget) {
    toggleBtn.addEventListener('click', () => {
      widget.classList.toggle('hidden');
    });
  }

  if (fontBiggerBtn) {
    fontBiggerBtn.addEventListener('click', () => {
      document.body.classList.add('large-font');
      localStorage.setItem('jisr_a11y_large_font', 'true');
    });
  }

  if (fontNormalBtn) {
    fontNormalBtn.addEventListener('click', () => {
      document.body.classList.remove('large-font');
      localStorage.setItem('jisr_a11y_large_font', 'false');
    });
  }

  if (contrastBtn) {
    contrastBtn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isHc = document.body.classList.contains('high-contrast');
      localStorage.setItem('jisr_a11y_contrast', isHc ? 'true' : 'false');
    });
  }

  if (motionBtn) {
    motionBtn.addEventListener('click', () => {
      document.body.classList.toggle('reduced-motion');
      const isRm = document.body.classList.contains('reduced-motion');
      localStorage.setItem('jisr_a11y_motion', isRm ? 'true' : 'false');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.body.classList.remove('large-font', 'high-contrast', 'reduced-motion');
      localStorage.removeItem('jisr_a11y_large_font');
      localStorage.removeItem('jisr_a11y_contrast');
      localStorage.removeItem('jisr_a11y_motion');
      if (widget) widget.classList.add('hidden');
    });
  }

  // Restore preferences
  if (localStorage.getItem('jisr_a11y_large_font') === 'true') {
    document.body.classList.add('large-font');
  }
  if (localStorage.getItem('jisr_a11y_contrast') === 'true') {
    document.body.classList.add('high-contrast');
  }
  if (localStorage.getItem('jisr_a11y_motion') === 'true') {
    document.body.classList.add('reduced-motion');
  }
}

/* ==========================================================================
   9. Scroll Animations & Reveal
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-6');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-6');
    observer.observe(el);
  });
}

/* ==========================================================================
   10. Toast Notification System
   ========================================================================== */
function showToast(title, message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const isSuccess = type === 'success';
  const isError = type === 'error';

  let iconName = 'info';
  let borderClass = 'border-primary/20 bg-white text-on-surface';
  let iconClass = 'text-primary';

  if (isSuccess) {
    iconName = 'check_circle';
    borderClass = 'border-secondary/30 bg-white text-on-surface';
    iconClass = 'text-secondary';
  } else if (isError) {
    iconName = 'error';
    borderClass = 'border-red-300 bg-white text-on-surface';
    iconClass = 'text-red-600';
  }

  toast.className = `toast p-4 rounded-2xl border ${borderClass} flex items-start gap-3 shadow-lg`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-2xl ${iconClass} shrink-0">${iconName}</span>
    <div class="flex-1">
      <h5 class="text-sm font-bold leading-tight">${title}</h5>
      <p class="text-xs text-on-surface-variant mt-1 leading-snug">${message}</p>
    </div>
    <button type="button" class="text-on-surface-variant hover:text-on-surface" onclick="this.parentElement.remove()">
      <span class="material-symbols-outlined text-lg">close</span>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

window.showToast = showToast;
