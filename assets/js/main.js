/**
 * منصة جسور للتأهيل والرعاية عن بُعد - Jusoor Tele-Rehabilitation Platform
 * Main Interactive Engine & Application Controller - Minimalist SaaS Edition
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initHeader();
  initPortalsDrawer();
  initServicesModal();
  initPartnershipModal();
  initPartnerPageForm();
  initAppModal();
  initFaqAccordion();
  initContactForm();
  initAccessibility();
  initScrollAnimations();
  initCounters();
  initInteractiveEcosystem();
  initLivePhoneSimulator();
  initRehabMatcher();
  initServicesFilter();
  initScrollTopButton();
  initPortalLinksCopy();
  initRehabAnimationStages();
});

/* ==========================================================================
   1. Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) : 0;
    progressBar.style.transform = `scaleX(${scrolled})`;
  });
}

/* ==========================================================================
   2. Header, Mobile Navigation & Scroll Detection
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

  // Active page indicator
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('text-primary', 'font-bold');
      link.classList.remove('text-slate-600', 'text-on-surface-variant');
    }
  });

  // Active section indicator for in-page anchors if present
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('text-primary', 'font-semibold');
              link.classList.remove('text-slate-600', 'text-on-surface-variant');
            }
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(sec => observer.observe(sec));
  }
}

/* ==========================================================================
   3. User Portals Sliding Drawer (Side Drawer)
   ========================================================================== */
function initPortalsDrawer() {
  const drawer = document.getElementById('portals-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const panel = document.getElementById('drawer-panel');
  const closeBtn = document.getElementById('close-drawer-btn');
  const triggers = document.querySelectorAll('[data-open-portals]');
  const portalSearch = document.getElementById('drawer-portal-search');

  if (!drawer || !panel) return;

  function openDrawer() {
    drawer.classList.remove('pointer-events-none');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.classList.remove('opacity-0');
    backdrop.classList.add('opacity-100');

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

  // Portal live search in drawer
  if (portalSearch) {
    portalSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('#drawer-panel [data-portal-card]').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = (!q || text.includes(q)) ? '' : 'none';
      });
    });
  }

  window.openPortalsDrawer = openDrawer;
  window.closePortalsDrawer = closeDrawer;
}

/* ==========================================================================
   4. Services Exploration Modal
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
   5. Partnership Modal
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
   6. App Download & QR Modal
   ========================================================================== */
function initAppModal() {
  if (typeof initAppModalDelegation === 'function') {
    initAppModalDelegation();
  }
  window.openAppModal = window.openAppDownloadModal;
  window.closeAppModal = window.closeAppDownloadModal;
}

/* ==========================================================================
   7. FAQ Accordion & Live Filter
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
   5.1. Partner Application Page Form (partners.html)
   Direct Supabase Integration with partner_applications table
   ========================================================================== */
function initPartnerPageForm() {
  const form = document.getElementById('partner-page-form');
  const alertContainer = document.getElementById('partner-alert');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = form.querySelector('#partner-name');
    const roleInput = form.querySelector('#partner-role');
    const licenseInput = form.querySelector('#partner-license');
    const phoneInput = form.querySelector('#partner-phone');
    const emailInput = form.querySelector('#partner-email');
    const cityInput = form.querySelector('#partner-city');
    const notesInput = form.querySelector('#partner-notes');
    const submitBtn = form.querySelector('#partner-submit-btn') || form.querySelector('button[type="submit"]');
    const isEn = document.documentElement.getAttribute('lang') === 'en';

    const payload = {
      applicant_name: nameInput ? nameInput.value.trim() : '',
      requested_role: roleInput ? roleInput.value : 'specialist',
      license_number: licenseInput ? licenseInput.value.trim() : '',
      phone: phoneInput ? phoneInput.value.trim() : '',
      email: emailInput ? emailInput.value.trim() : '',
      city: cityInput ? cityInput.value.trim() : 'صنعاء',
      notes: notesInput ? notesInput.value.trim() : ''
    };

    if (!payload.applicant_name || !payload.phone) {
      showPartnerAlert(
        isEn ? 'Please provide the applicant name and phone number.' : 'يرجى إدخال اسم الجهة/المتقدم ورقم الجوال للتواصل.',
        'error'
      );
      return;
    }

    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
      <span>${isEn ? 'Submitting Application...' : 'جاري إرسال الطلب واعتماده...'}</span>
    `;

    try {
      if (window.jisrDB && window.jisrDB.submitPartnerApplication) {
        await window.jisrDB.submitPartnerApplication(payload);
      }
    } catch (err) {
      console.warn('Partner application submission notice:', err);
    }

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      form.reset();
      showPartnerAlert(
        isEn
          ? 'Your partnership application has been received successfully and is currently under clinical review and accreditation.'
          : 'تم استلام طلبكم بنجاح وهو الآن قيد المراجعة والاعتماد من قِبل إدارة المنصة واللجنة السريرية.',
        'success'
      );
      showToast(
        isEn ? 'Application Submitted' : 'تم استلام الطلب بنجاح',
        isEn ? 'Your application is under clinical review and accreditation.' : 'طلبك قيد المراجعة والاعتماد من قِبل إدارة منصة جسور للتأهيل.',
        'success'
      );
    }, 600);
  });

  function showPartnerAlert(msg, type) {
    if (!alertContainer) return;
    const isSuccess = type === 'success';
    alertContainer.className = `p-4 sm:p-5 rounded-2xl text-xs sm:text-sm font-semibold flex items-start gap-3 transition-all ${isSuccess
        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        : 'bg-red-50 text-red-700 border border-red-200'
      }`;
    alertContainer.innerHTML = `
      <span class="material-symbols-outlined text-xl shrink-0 mt-0.5">${isSuccess ? 'verified' : 'error'}</span>
      <div class="space-y-1">
        <p class="font-bold text-sm">${isSuccess ? (document.documentElement.getAttribute('lang') === 'en' ? 'Application Under Review' : 'الطلب قيد المراجعة والاعتماد') : 'تنبيه'}</p>
        <p class="font-normal leading-relaxed">${msg}</p>
      </div>
    `;
    alertContainer.classList.remove('hidden');
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ==========================================================================
   8. Contact Form Validation & State (Direct Supabase Integration)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertContainer = document.getElementById('contact-alert');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = form.querySelector('#contact-name');
    const contactInfoInput = form.querySelector('#contact-info');
    const typeInput = form.querySelector('#contact-type');
    const messageInput = form.querySelector('#contact-message');
    const submitBtn = form.querySelector('#contact-submit-btn') || form.querySelector('button[type="submit"]');
    const isEn = document.documentElement.getAttribute('lang') === 'en';

    const name = nameInput ? nameInput.value.trim() : '';
    const contactInfo = contactInfoInput ? contactInfoInput.value.trim() : '';
    const type = typeInput ? typeInput.value : 'general';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !contactInfo || !message) {
      showAlert(
        isEn ? 'Please fill in all required fields.' : 'يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح.',
        'error'
      );
      return;
    }

    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
      <span>${isEn ? 'Sending...' : 'جاري الإرسال...'}</span>
    `;

    try {
      if (window.jisrDB && window.jisrDB.submitContactMessage) {
        await window.jisrDB.submitContactMessage({
          full_name: name,
          contact_info: contactInfo,
          inquiry_type: type,
          message: message
        });
      }
    } catch (err) {
      console.warn('Contact message submission notice:', err);
    }

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      form.reset();
      showAlert(
        isEn ? 'Your message has been sent successfully. Our team will review it and reply soon.' : 'تم استلام رسالتك بنجاح! سيقوم فريق إدارة المنصة بمراجعتها والتواصل معك قريباً.',
        'success'
      );
      showToast(
        isEn ? 'Message Sent' : 'تم إرسال الرسالة',
        isEn ? 'Thank you for reaching out to Jusoor Rehab Platform.' : 'شكراً لتواصلك مع منصة جسور للتأهيل.',
        'success'
      );
    }, 600);
  });

  function showAlert(msg, type) {
    if (!alertContainer) return;
    const isSuccess = type === 'success';
    alertContainer.className = `p-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${isSuccess ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'bg-red-50 text-red-700 border border-red-200'
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
   9. Accessibility Controls
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
   10. Scroll Animations & Reveal
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
   11. Live Animated Number Counters
   ========================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter-target'), 10);
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const duration = 1600; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeOut * target);
          el.textContent = currentVal + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   12. Hero Interactive Ecosystem Simulator
   ========================================================================== */
function initInteractiveEcosystem() {
  const nodes = document.querySelectorAll('[data-ecosystem-node]');
  const infoTitle = document.getElementById('ecosystem-info-title');
  const infoDesc = document.getElementById('ecosystem-info-desc');
  const infoAction = document.getElementById('ecosystem-info-action');

  if (!nodes.length || !infoTitle || !infoDesc) return;

  const ecosystemData = {
    beneficiary: {
      titleAr: "المستفيد والأسرة في قلب المنظومة",
      titleEn: "Beneficiary & Family at the Heart of Care",
      descAr: "يتلقى المستفيد خطة علاجية يومية مخصصة، وينفذ التمارين المنزلية الموجهة بمساعدة الأسرة، ويرصد مؤشرات تقدمه مع المساعد التقني.",
      descEn: "Receives an individualized daily regimen, executes video exercises with family support, and logs functional progress effortlessly.",
      actionTextAr: "الدخول إلى حساب المستفيد",
      actionTextEn: "Enter Beneficiary Portal",
      link: "../المستفيد/التسجيل/تسجيل الدخول.html"
    },
    specialist: {
      titleAr: "الأخصائي المعالج السريري",
      titleEn: "Treating Clinical Specialist",
      descAr: "يقيّم الحالة وظيفياً، ويصمم الخطة التأهيلية، ويراجع تسجيلات الأداء الحركي، ويعدل درجات الشدة وفترات الراحة دورياً.",
      descEn: "Evaluates functional mobility, formulates rehabilitation plans, reviews exercise clips, and adjusts therapeutic targets.",
      actionTextAr: "الانتقال لبوابة الأخصائي",
      actionTextEn: "Go to Specialist Portal",
      link: "../المختص/الرئيسية/index.html"
    },
    supervisor: {
      titleAr: "المشرف الحركي الميداني",
      titleEn: "Motor & Kinesiology Supervisor",
      descAr: "يرافق المستفيد في تطبيق الحركات الصحيحة، ويشرف على سلامة وضعيات الجسم، ويوثق الملاحظات السريرية الميدانية.",
      descEn: "Guides correct motion biomechanics, monitors safe execution, and reports field observations directly to the clinician.",
      actionTextAr: "الانتقال لبوابة المشرف الحركي",
      actionTextEn: "Go to Supervisor Portal",
      link: "../المشرف الحركي/الرئيسية.html"
    },
    hospital: {
      titleAr: "المستشفيات والجمعيات الشريكة",
      titleEn: "Partner Hospitals & Charitable Foundations",
      descAr: "تنسيق التحويلات السريرية، كفالة الحالات المستحقة، وإدارة بنك الأجهزة المساعدة لدعم المستفيدين بكراسي ودعامات مناسبة.",
      descEn: "Coordinating clinical referrals, sponsoring deserving cases, and managing assistive equipment delivery seamlessly.",
      actionTextAr: "الانتقال لبوابة الشركاء",
      actionTextEn: "Go to Partners Portal",
      link: "../المستشفيات و المراكز/index.html"
    }
  };

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('ring-2', 'ring-primary', 'bg-primary/10'));
      node.classList.add('ring-2', 'ring-primary', 'bg-primary/10');

      const key = node.getAttribute('data-ecosystem-node');
      const data = ecosystemData[key];
      if (!data) return;

      const isEn = document.documentElement.getAttribute('lang') === 'en';
      infoTitle.textContent = isEn ? data.titleEn : data.titleAr;
      infoDesc.textContent = isEn ? data.descEn : data.descAr;
      if (infoAction) {
        infoAction.textContent = isEn ? data.actionTextEn : data.actionTextAr;
        infoAction.setAttribute('href', data.link);
      }
    });
  });
}

/* ==========================================================================
   13. Live Interactive Phone Simulator (App Mockup)
   ========================================================================== */
function initLivePhoneSimulator() {
  const tabs = document.querySelectorAll('[data-phone-tab]');
  const screens = document.querySelectorAll('[data-phone-screen]');
  const exerciseStartBtn = document.getElementById('phone-start-exercise-btn');
  const repCountEl = document.getElementById('phone-rep-counter');
  const statusMsgEl = document.getElementById('phone-status-msg');

  if (!tabs.length || !screens.length) return;

  // Tab switching inside phone mockup
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetScreen = tab.getAttribute('data-phone-tab');

      tabs.forEach(t => {
        t.classList.remove('text-primary', 'font-bold');
        t.classList.add('text-on-surface-variant');
      });
      tab.classList.add('text-primary', 'font-bold');
      tab.classList.remove('text-on-surface-variant');

      screens.forEach(s => {
        if (s.getAttribute('data-phone-screen') === targetScreen) {
          s.classList.remove('hidden');
          s.classList.add('flex');
        } else {
          s.classList.add('hidden');
          s.classList.remove('flex');
        }
      });
    });
  });

  // Interactive Live Exercise Session inside Phone Screen
  let isExerciseRunning = false;
  let currentReps = 0;
  let exerciseTimer = null;

  if (exerciseStartBtn && repCountEl && statusMsgEl) {
    exerciseStartBtn.addEventListener('click', () => {
      if (isExerciseRunning) {
        // Stop session
        clearInterval(exerciseTimer);
        isExerciseRunning = false;
        exerciseStartBtn.textContent = 'بدء التمرين الآن';
        exerciseStartBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
        exerciseStartBtn.classList.add('bg-primary', 'hover:bg-primary-dark');
        statusMsgEl.textContent = 'الجلسة متوقفة مؤقتاً';
        return;
      }

      // Start session
      isExerciseRunning = true;
      currentReps = 0;
      repCountEl.textContent = '0 / 10';
      exerciseStartBtn.textContent = 'إيقاف الجلسة';
      exerciseStartBtn.classList.remove('bg-primary', 'hover:bg-primary-dark');
      exerciseStartBtn.classList.add('bg-red-600', 'hover:bg-red-700');
      statusMsgEl.textContent = 'المساعد الذكي: جاهز للعد... تنفس بعمق';

      const encouragements = [
        'تكرار 1: حركة متوازنة وممتازة!',
        'تكرار 2: حافظ على استقامة الظهر',
        'تكرار 3: رائع! استمر بالمد التدريجي',
        'تكرار 4: أداء متزن، تنفس بهدوء',
        'تكرار 5: منتصف الجولة، ممتاز!',
        'تكرار 6: ثبات عضلي ملحوظ',
        'تكرار 7: اقتربت من الهدف اليومي',
        'تكرار 8: إتقان عالٍ للحركة',
        'تكرار 9: تكرار إضافي رائع!',
        'تكرار 10: اكتمل التمرين بنجاح تام! 🎉'
      ];

      exerciseTimer = setInterval(() => {
        if (currentReps < 10) {
          currentReps++;
          repCountEl.textContent = `${currentReps} / 10`;
          statusMsgEl.textContent = encouragements[currentReps - 1] || 'استمر في الأداء';
        } else {
          clearInterval(exerciseTimer);
          isExerciseRunning = false;
          exerciseStartBtn.textContent = 'إعادة التمرين';
          exerciseStartBtn.classList.remove('bg-red-600');
          exerciseStartBtn.classList.add('bg-secondary');
          statusMsgEl.textContent = 'تم تسجيل إنجاز الجلسة في سجلك الطبي بنجاح!';
          showToast('إنجاز تمرين تفاعلي', 'تم إكمال جلسة التمرين التجريبية بنجاح 10/10.', 'success');
        }
      }, 1400);
    });
  }
}

/* ==========================================================================
   14. Quick Interactive Rehabilitation Matcher (Wizard)
   ========================================================================== */
function initRehabMatcher() {
  const matcher = document.getElementById('rehab-matcher-card');
  if (!matcher) return;

  const step1 = document.getElementById('matcher-step-1');
  const step2 = document.getElementById('matcher-step-2');
  const step3 = document.getElementById('matcher-step-3');
  const stepResult = document.getElementById('matcher-step-result');

  const resultTitle = document.getElementById('matcher-result-title');
  const resultDesc = document.getElementById('matcher-result-desc');
  const resultPathLink = document.getElementById('matcher-result-link');
  const resetBtn = document.getElementById('matcher-reset-btn');

  let selectedCondition = '';
  let selectedMobility = '';
  let selectedGoal = '';

  // Step 1 Click
  document.querySelectorAll('[data-matcher-condition]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCondition = btn.getAttribute('data-matcher-condition');
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    });
  });

  // Step 2 Click
  document.querySelectorAll('[data-matcher-mobility]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedMobility = btn.getAttribute('data-matcher-mobility');
      step2.classList.add('hidden');
      step3.classList.remove('hidden');
    });
  });

  // Step 3 Click (Generate Result)
  document.querySelectorAll('[data-matcher-goal]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedGoal = btn.getAttribute('data-matcher-goal');
      step3.classList.add('hidden');
      stepResult.classList.remove('hidden');

      // Generate customized guidance
      let conditionLabel = "التأهيل الوظيفي والحركي";
      if (selectedCondition === 'pediatric') conditionLabel = "تأهيل الأطفال والنمو الحركي";
      if (selectedCondition === 'post_surgery') conditionLabel = "التأهيل الحركي بعد العمليات الجراحية";
      if (selectedCondition === 'elderly') conditionLabel = "تأهيل التوازن ورعاية كبار السن";
      if (selectedCondition === 'sports') conditionLabel = "تأهيل الإصابات الرياضية والعضلية";

      resultTitle.textContent = `المسار الموصى به: برنامج ${conditionLabel}`;
      resultDesc.textContent = `بناءً على اختيارك، ننصحك بالبدء بإجراء التقييم المبدئي المخصص لـ (${conditionLabel})، حيث سيتم ربط حالتك مباشرة بأخصائي علاج طبيعي معتمد لتصميم خطة التمارين المنزلية الموجهة.`;

      if (resultPathLink) {
        resultPathLink.setAttribute('href', '../تحديد مشكلة المستفيد/تحديد المشكلة.html');
      }
    });
  });

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      stepResult.classList.add('hidden');
      step2.classList.add('hidden');
      step3.classList.add('hidden');
      step1.classList.remove('hidden');
    });
  }
}

/* ==========================================================================
   15. Services Category Filter
   ========================================================================== */
function initServicesFilter() {
  const pills = document.querySelectorAll('.service-filter-pill');
  const serviceCards = document.querySelectorAll('[data-service-category]');

  if (!pills.length || !serviceCards.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => {
        p.classList.remove('bg-primary', 'text-white', 'shadow-sm');
        p.classList.add('bg-white', 'text-on-surface-variant');
      });
      pill.classList.add('bg-primary', 'text-white', 'shadow-sm');
      pill.classList.remove('bg-white', 'text-on-surface-variant');

      const cat = pill.getAttribute('data-category');
      serviceCards.forEach(card => {
        const cardCats = card.getAttribute('data-service-category') || '';
        if (cat === 'all' || cardCats.includes(cat)) {
          card.style.display = '';
          card.classList.add('animate-fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   16. Scroll to Top Floating Button
   ========================================================================== */
function initScrollTopButton() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.remove('hidden', 'opacity-0');
      btn.classList.add('flex', 'opacity-100');
    } else {
      btn.classList.add('opacity-0');
      setTimeout(() => {
        if (window.scrollY <= 400) btn.classList.add('hidden');
      }, 200);
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   17. Portal Links Quick Copy
   ========================================================================== */
function initPortalLinksCopy() {
  document.querySelectorAll('[data-copy-portal-link]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const relativeLink = btn.getAttribute('data-copy-portal-link');
      const fullUrl = new URL(relativeLink, window.location.href).href;

      navigator.clipboard.writeText(fullUrl).then(() => {
        const isEn = document.documentElement.getAttribute('lang') === 'en';
        showToast(
          isEn ? 'Portal Link Copied' : 'تم نسخ رابط البوابة',
          isEn ? 'Direct link copied to clipboard successfully.' : 'تم نسخ الرابط المباشر للبوابة بنجاح.',
          'success'
        );
      }).catch(() => {
        showToast('تنبيه', 'تعذر النسخ التلقائي للرابط', 'info');
      });
    });
  });
}

/* ==========================================================================
   18. Toast Notification System
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

/* ==========================================================================
   Interactive Rehabilitation Journey Animation (4 Stages Controller)
   ========================================================================== */
function initRehabAnimationStages() {
  const card = document.getElementById('rehab-animation-card');
  const stageNav = document.getElementById('rehab-stages-nav');
  const modeBadge = document.getElementById('rehab-mode-badge');
  const stageDesc = document.getElementById('rehab-stage-desc');
  const autoplayBtn = document.getElementById('rehab-autoplay-btn');

  if (!card || !stageNav) return;

  const stageDescriptions = {
    '1': 'المرحلة 1: الجلوس على كرسي متحرك ومحاولة النهوض بمساعدة الكادر التأهيلي',
    '2': 'المرحلة 2: المشي بين قضبان حديدية متوازية (Parallel Bars) لدعم التوازن واستقامة القوام',
    '3': 'المرحلة 3: تلاشي القضبان المساندة تدريجياً مع زيادة ثبات المريض وتوازنه الذاتي',
    '4': 'المرحلة 4: المشي الحر المستقل بكل ثقة واستقلالية تامة نحو التعافي الكامل'
  };

  const stagePills = stageNav.querySelectorAll('.rehab-stage-pill');

  function setStage(stageNum) {
    card.setAttribute('data-stage-override', stageNum);
    if (modeBadge) modeBadge.textContent = `معاينة المرحلة ${stageNum} (موقّفة)`;
    if (stageDesc && stageDescriptions[stageNum]) {
      stageDesc.textContent = stageDescriptions[stageNum];
    }
  }

  function resetToAutoplay() {
    card.removeAttribute('data-stage-override');
    if (modeBadge) modeBadge.textContent = 'تكرار انسيابي مستمر';
    if (stageDesc) stageDesc.textContent = 'المحاكاة: مسار استعادة المشي والتعافي التلقائي المستمر';
  }

  stagePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const stage = pill.getAttribute('data-stage');
      const currentOverride = card.getAttribute('data-stage-override');
      if (currentOverride === stage) {
        resetToAutoplay();
      } else {
        setStage(stage);
      }
    });
  });

  if (autoplayBtn) {
    autoplayBtn.addEventListener('click', () => {
      resetToAutoplay();
    });
  }
}


// ======================================================================
// رابط التحميل المركزي الموحد لتطبيق جسور للتأهيل (Flutter App)
// نافذة تحميل التطبيق والمزامنة اللغوية والـ Event Delegation الموحد
// ======================================================================
window.JUSOOR_APP_DOWNLOAD_URL = window.JUSOOR_APP_DOWNLOAD_URL || "https://jusoor-rehab.vercel.app/download-app";

window.openAppDownloadModal = function() {
  let modal = document.getElementById('app-download-modal') || document.getElementById('app-qr-modal');
  
  // If modal doesn't exist in DOM, create and mount it dynamically immediately
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'app-download-modal';
    modal.className = 'fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'app-modal-title');
    modal.innerHTML = `
      <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 text-center relative animate-in fade-in zoom-in-95 duration-200">
        <button type="button" id="app-modal-close-btn" data-close-app-modal class="absolute top-5 end-5 text-slate-400 hover:text-slate-600 transition" aria-label="إغلاق النافذة">
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>
        <div class="space-y-3">
          <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-2xs">
            <span class="material-symbols-outlined text-3xl">phone_iphone</span>
          </div>
          <div class="space-y-1.5">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
              <span class="material-symbols-outlined text-xs">verified</span>
              <span data-i18n="appModal.badge">تطبيق الهواتف الذكية (Android & iOS)</span>
            </div>
            <h2 id="app-modal-title" data-i18n="appModal.title" class="text-xl font-bold text-on-surface">تطبيق جسور للتأهيل المنزلي</h2>
            <p id="app-modal-desc" data-i18n="appModal.desc" class="text-xs text-slate-600 leading-relaxed px-2">
              تطبيق «جسور للتأهيل» متاح الآن للأجهزة الذكية لتقديم خدمات الرعاية والحجز والتأهيل المتكاملة ومتابعة الخطط العلاجية المنزلية مع نخبة الأخصائيين المعتمدين.
            </p>
          </div>
        </div>
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 inline-block mx-auto">
          <img 
            id="app-modal-qr" 
            src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(window.JUSOOR_APP_DOWNLOAD_URL)}" 
            alt="QR Code لتحميل تطبيق جسور للتأهيل" 
            class="w-40 h-40 rounded-xl border border-slate-200 p-2 bg-white mx-auto shadow-2xs"
          >
          <p class="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-sm text-primary">qr_code_scanner</span>
            <span data-i18n="appModal.scanHint">امسح الرمز بكاميرا هاتفك للتحميل المباشر</span>
          </p>
        </div>
        <div class="space-y-2.5 pt-1">
          <a 
            id="app-modal-primary-btn" 
            href="${window.JUSOOR_APP_DOWNLOAD_URL}" 
            target="_blank" 
            rel="noopener" 
            class="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold shadow-sm transition flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-lg">download</span>
            <span data-i18n="appModal.downloadBtn">تحميل تطبيق جسور للتأهيل</span>
          </a>
          <a 
            id="app-modal-portal-btn"
            href="../المستفيد/الصفحة الرئيسية/الرئيسية/code.html" 
            class="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-base">visibility</span>
            <span data-i18n="appModal.portalBtn">الانتقال إلى بوابة المستفيدين (نسخة العرض)</span>
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Determine active language (ar vs en) and direction
  const currentLang = (window.jisrI18n && window.jisrI18n.currentLang) 
    || document.documentElement.getAttribute('lang') 
    || localStorage.getItem('jusoor_lang')
    || localStorage.getItem('jisr_lang') 
    || 'ar';
  const isEn = currentLang === 'en';

  // Modal localized strings
  const strings = {
    badge: isEn ? 'Mobile Application (Android & iOS)' : 'تطبيق الهواتف الذكية (Android & iOS)',
    title: isEn ? 'Jusoor Home Rehabilitation App' : 'تطبيق جسور للتأهيل المنزلي',
    desc: isEn 
      ? 'The Jusoor Rehab app is now available on mobile devices to provide integrated tele-rehabilitation, booking, and home therapy plan tracking with certified specialists.' 
      : 'تطبيق «جسور للتأهيل» متاح الآن للأجهزة الذكية لتقديم خدمات الرعاية والحجز والتأهيل المتكاملة ومتابعة الخطط العلاجية المنزلية مع نخبة الأخصائيين المعتمدين.',
    scanHint: isEn ? 'Scan the QR code with your phone camera for direct download' : 'امسح الرمز بكاميرا هاتفك للتحميل المباشر',
    downloadBtn: isEn ? 'Download Jusoor Rehabilitation App' : 'تحميل تطبيق جسور للتأهيل',
    portalBtn: isEn ? 'Go Directly to Beneficiary Portal' : 'الانتقال لبوابة المستفيد مباشرة',
    closeAria: isEn ? 'Close window' : 'إغلاق النافذة',
    qrAlt: isEn ? 'QR Code to download Jusoor Rehabilitation App' : 'رمز الاستجابة السريعة QR لتحميل تطبيق جسور للتأهيل'
  };

  // Sync localized text inside the modal dialog
  const badgeEl = modal.querySelector('[data-i18n="appModal.badge"]');
  if (badgeEl) badgeEl.textContent = strings.badge;

  const titleEl = modal.querySelector('#app-modal-title') || modal.querySelector('[data-i18n="appModal.title"]');
  if (titleEl) titleEl.textContent = strings.title;

  const descEl = modal.querySelector('#app-modal-desc') || modal.querySelector('[data-i18n="appModal.desc"]');
  if (descEl) descEl.textContent = strings.desc;

  const scanHintEl = modal.querySelector('[data-i18n="appModal.scanHint"]');
  if (scanHintEl) scanHintEl.textContent = strings.scanHint;

  const downloadBtn = modal.querySelector('#app-modal-primary-btn');
  if (downloadBtn) {
    const downloadSpan = downloadBtn.querySelector('[data-i18n="appModal.downloadBtn"]') || downloadBtn.querySelector('span:not(.material-symbols-outlined)');
    if (downloadSpan) downloadSpan.textContent = strings.downloadBtn;
  }

  const portalBtn = modal.querySelector('#app-modal-portal-btn') || modal.querySelector('a[href*="المستفيد"]');
  if (portalBtn) {
    const portalSpan = portalBtn.querySelector('[data-i18n="appModal.portalBtn"]') || portalBtn.querySelector('span:not(.material-symbols-outlined)');
    if (portalSpan) portalSpan.textContent = strings.portalBtn;
  }

  const closeBtn = modal.querySelector('[data-close-app-modal], #app-modal-close-btn, #close-app-modal');
  if (closeBtn) {
    closeBtn.setAttribute('aria-label', strings.closeAria);
  }

  // Central Download URL and QR Code generation
  const downloadUrl = window.JUSOOR_APP_DOWNLOAD_URL || "https://jusoor-rehab.vercel.app/download-app";
  window.JUSOOR_APP_DOWNLOAD_URL = downloadUrl;
  if (downloadBtn) downloadBtn.href = downloadUrl;

  const qrImg = modal.querySelector('#app-modal-qr');
  if (qrImg) {
    qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=' + encodeURIComponent(downloadUrl);
    qrImg.alt = strings.qrAlt;
    qrImg.style.imageRendering = 'pixelated';
  }

  // Sync modal content direction (LTR for en, RTL for ar)
  const dialogBox = modal.querySelector('.bg-white');
  if (dialogBox) {
    dialogBox.setAttribute('dir', isEn ? 'ltr' : 'rtl');
  }

  // Bring to absolute front and display
  modal.style.zIndex = '99999';
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  console.log('✅ [Jusoor Modal] تم فتح نافذة تحميل التطبيق وتوليد رمز الـ QR بنجاح');
};

window.closeAppDownloadModal = function() {
  const modal = document.getElementById('app-download-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    modal.style.display = 'none';
  }
  const qrModal = document.getElementById('app-qr-modal');
  if (qrModal) {
    qrModal.classList.add('hidden');
    qrModal.classList.remove('flex');
    qrModal.style.display = 'none';
  }
  document.body.style.overflow = '';
};

// Aliases for unified invocation
window.openAppModal = window.openAppDownloadModal;
window.closeAppModal = window.closeAppDownloadModal;
window.showAppQrModal = window.openAppDownloadModal;

// Unified Event Delegation on `document` with Click Intercept Logger
function initAppModalDelegation() {
  if (window._appModalDelegationInitialized) return;
  window._appModalDelegationInitialized = true;

  document.addEventListener('click', function(e) {
    // 1. Direct or closest matching trigger for Start Journey / App Download Modal
    const triggerStart = e.target.closest(
      '[data-action="start-journey"], [data-open-app-modal], [data-open-app-download-modal], #hero-cta-start, .hero-cta-start-btn'
    );
    let matchedStart = triggerStart;

    // Fallback check for any button or link whose text or data-i18n matches "ابدأ رحلتك" / "Start Your Journey"
    if (!matchedStart) {
      const candidateBtn = e.target.closest('button, a');
      if (candidateBtn) {
        const hasI18n = candidateBtn.matches('[data-i18n="hero.ctaStart"]') ||
                        candidateBtn.querySelector('[data-i18n="hero.ctaStart"]');
        const text = (candidateBtn.textContent || '').trim();
        const hasTextMatch = text.includes('ابدأ رحلتك') || text.includes('Start Your Journey');
        if (hasI18n || hasTextMatch) {
          matchedStart = candidateBtn;
        }
      }
    }

    if (matchedStart) {
      e.preventDefault();
      console.log('✅ [Jusoor Click] نقرة على زر «ابدأ رحلتك الآن»');
      if (typeof window.openAppDownloadModal === 'function') {
        window.openAppDownloadModal();
      }
      return;
    }

    // 2. Direct or closest matching trigger for Services button / link
    const triggerServices = e.target.closest(
      '#hero-cta-services, .hero-cta-services-btn, [data-action="explore-services"]'
    );
    let matchedServices = triggerServices;
    if (!matchedServices) {
      const candidateBtn = e.target.closest('button, a');
      if (candidateBtn) {
        const hasI18n = candidateBtn.matches('[data-i18n="hero.ctaServices"]') ||
                        candidateBtn.querySelector('[data-i18n="hero.ctaServices"]');
        const text = (candidateBtn.textContent || '').trim();
        const hasTextMatch = text.includes('استكشف خدماتنا') || text.includes('Explore Services');
        if (hasI18n || hasTextMatch) {
          matchedServices = candidateBtn;
        }
      }
    }

    if (matchedServices) {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        e.preventDefault();
        console.log('✅ [Jusoor Services] الانتقال السلس إلى قسم #services');
        servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.log('✅ [Jusoor Services] الانتقال إلى صفحة services.html');
        // Let natural link navigation happen, or enforce if needed
      }
      return;
    }

    // 3. Intercept Detection: Check if click was inside the hero CTA button bounds but intercepted by an overlay
    const ctaGroup = document.getElementById('hero-cta-group');
    const startBtn = document.getElementById('hero-cta-start');
    const servicesBtn = document.getElementById('hero-cta-services');

    if (ctaGroup && e.clientX && e.clientY) {
      const startRect = startBtn ? startBtn.getBoundingClientRect() : null;
      const servicesRect = servicesBtn ? servicesBtn.getBoundingClientRect() : null;

      // Check Start button bounding area
      if (startRect && e.clientX >= startRect.left && e.clientX <= startRect.right && e.clientY >= startRect.top && e.clientY <= startRect.bottom) {
        console.warn('⚠️ [Jusoor Click Intercepted] نقرة فوق زر «ابدأ رحلتك الآن» التقطها عنصر آخر:', {
          interceptingElement: e.target,
          tagName: e.target.tagName,
          id: e.target.id || '(no-id)',
          className: e.target.className || '(no-class)',
          zIndex: window.getComputedStyle(e.target).zIndex,
          pointerEvents: window.getComputedStyle(e.target).pointerEvents
        });
        e.preventDefault();
        window.openAppDownloadModal();
        return;
      }

      // Check Services button bounding area
      if (servicesRect && e.clientX >= servicesRect.left && e.clientX <= servicesRect.right && e.clientY >= servicesRect.top && e.clientY <= servicesRect.bottom) {
        console.warn('⚠️ [Jusoor Click Intercepted] نقرة فوق زر «استكشف خدماتنا» التقطها عنصر آخر:', {
          interceptingElement: e.target,
          tagName: e.target.tagName,
          id: e.target.id || '(no-id)',
          className: e.target.className || '(no-class)',
          zIndex: window.getComputedStyle(e.target).zIndex,
          pointerEvents: window.getComputedStyle(e.target).pointerEvents
        });
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
          e.preventDefault();
          servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.href = 'services.html';
        }
        return;
      }
    }

    // 4. Modal close button delegation
    const closeBtn = e.target.closest(
      '[data-close-app-modal], #app-modal-close-btn, #close-app-modal, #app-modal-close'
    );
    if (closeBtn) {
      e.preventDefault();
      if (typeof window.closeAppDownloadModal === 'function') {
        window.closeAppDownloadModal();
      }
      return;
    }

    // 5. Modal backdrop click delegation
    if (e.target && (e.target.id === 'app-download-modal' || e.target.id === 'app-qr-modal')) {
      if (typeof window.closeAppDownloadModal === 'function') {
        window.closeAppDownloadModal();
      }
    }
  });

  // Re-sync modal text dynamically if active language changes while open
  window.addEventListener('languageChanged', function() {
    const modal = document.getElementById('app-download-modal') || document.getElementById('app-qr-modal');
    if (modal && (!modal.classList.contains('hidden') || modal.style.display === 'flex')) {
      window.openAppDownloadModal();
    }
  });
}

// Global escape key listener
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (typeof window.closeAppDownloadModal === 'function') window.closeAppDownloadModal();
  }
});


// ==========================================================================
// HOMEPAGE SAAS BIDIRECTIONAL SCROLL & MICRO-INTERACTIONS
// ==========================================================================

/**
 * Modern Bidirectional Scroll Animation Engine (Enter & Exit on Scroll)
 * Elements animate into view when entering, and gracefully fade out when leaving,
 * re-triggering smoothly whenever the user scrolls up or down.
 */
function initBidirectionalScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-reveal, [data-animate]');
  if (!animatedElements.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback if browser doesn't support IntersectionObserver
    animatedElements.forEach(el => el.classList.add('is-in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
      } else {
        // Bidirectional exit: remove class so it can re-animate smoothly on revisit
        entry.target.classList.remove('is-in-view');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

/**
 * Smooth Scroll for Hero Mouse Indicator
 */
function initHeroScrollIndicator() {
  const indicator = document.getElementById('hero-scroll-indicator');
  if (!indicator) return;

  indicator.addEventListener('click', function(e) {
    e.preventDefault();
    const targetSection = document.getElementById('section-features') || document.querySelector('main > section:nth-of-type(2)');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/**
 * Click Ripple Micro-interaction for SaaS Buttons
 */
function initButtonRippleEffect() {
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-ripple, button.bg-primary, a.bg-primary, button.bg-secondary, a.bg-secondary');
    if (!btn) return;

    // Do not attach duplicate ripples rapidly
    const existing = btn.querySelector('.ripple-wave');
    if (existing) existing.remove();

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-wave';
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    btn.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initBidirectionalScrollAnimations();
    initHeroScrollIndicator();
    initButtonRippleEffect();
  });
} else {
  initBidirectionalScrollAnimations();
  initHeroScrollIndicator();
  initButtonRippleEffect();
}


// ==========================================================================
// ABOUT & SERVICES MODERN INTERACTIVE SUITE (HOVER-EXPAND, SLIDING PILL, STAGGER FILTER)
// ==========================================================================

/**
 * 1. Zero-Flicker Central Card Preview Overlay
 * Clones card content into a perfectly centered modal attached directly to document.body.
 * Desktop: Hover with 130ms open debounce, 140ms close debounce.
 * Mobile/Touch: Tap to open, click backdrop or close button to dismiss.
 */
function initCentralCardPreview() {
  const cards = document.querySelectorAll('.expandable-card');
  if (!cards.length) return;

  // Ensure overlay is attached directly to document.body
  let overlay = document.getElementById('central-card-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'central-card-overlay';
    overlay.className = 'central-card-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<div class="central-card-container" id="central-card-container" role="dialog" aria-modal="true"><button type="button" class="central-card-close-btn" id="central-card-close-btn" aria-label="إغلاق العرض"><span class="material-symbols-outlined text-lg">close</span></button><div id="central-card-body" class="space-y-4 pt-1"></div></div>';
    document.body.appendChild(overlay);
  }

  const container = document.getElementById('central-card-container');
  const cardBody = document.getElementById('central-card-body');
  const closeBtn = document.getElementById('central-card-close-btn');

  let openTimer = null;
  let closeTimer = null;
  let isMouseOverCard = false;
  let isMouseOverModal = false;
  let isTouchActive = false;

  function showPreview(card) {
    if (!card) return;
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    const iconEl = card.querySelector('.material-symbols-outlined');
    const titleEl = card.querySelector('h2, h3, h4');
    const descEl = card.querySelector('p');
    const listEl = card.querySelector('ul');
    const badgeEl = card.querySelector('.border-t, .bg-primary\\/10, .bg-secondary\\/10, .bg-teal-50, .bg-amber-50');

    let iconHtml = '';
    if (iconEl) {
      const iconName = iconEl.textContent.trim();
      iconHtml = '<div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-2xs shrink-0"><span class="material-symbols-outlined text-3xl">' + iconName + '</span></div>';
    }

    let titleText = titleEl ? titleEl.textContent.trim() : '';
    let descHtml = '';
    if (descEl) {
      descHtml = '<p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">' + descEl.innerHTML + '</p>';
    }
    if (listEl) {
      descHtml += '<ul class="text-xs sm:text-sm text-slate-700 dark:text-slate-200 space-y-2 list-disc list-inside leading-relaxed mt-2">' + listEl.innerHTML + '</ul>';
    }

    let footerHtml = '';
    if (badgeEl) {
      footerHtml = '<div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-primary">' + badgeEl.innerHTML + '</div>';
    }

    cardBody.innerHTML = '<div class="flex items-start gap-4">' + iconHtml + '<div class="flex-1"><h3 class="text-xl font-bold text-on-surface dark:text-white leading-tight mb-2">' + titleText + '</h3>' + descHtml + '</div></div>' + footerHtml;

    overlay.classList.remove('is-closing');
    overlay.classList.add('is-active');
  }

  function hidePreview(immediate = false) {
    if (openTimer) {
      clearTimeout(openTimer);
      openTimer = null;
    }
    if (immediate) {
      overlay.classList.remove('is-active', 'touch-active', 'is-closing');
      isTouchActive = false;
      return;
    }
    overlay.classList.add('is-closing');
    setTimeout(() => {
      overlay.classList.remove('is-active', 'touch-active', 'is-closing');
      isTouchActive = false;
    }, 280);
  }

  function scheduleClose() {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if (!isMouseOverCard && !isMouseOverModal && !isTouchActive) {
        hidePreview();
      }
    }, 140);
  }

  container.addEventListener('mouseenter', () => {
    isMouseOverModal = true;
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  });

  container.addEventListener('mouseleave', () => {
    isMouseOverModal = false;
    scheduleClose();
  });

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      isMouseOverCard = true;
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      openTimer = setTimeout(() => {
        if (isMouseOverCard) {
          showPreview(card);
        }
      }, 130);
    });

    card.addEventListener('mouseleave', () => {
      isMouseOverCard = false;
      if (openTimer) {
        clearTimeout(openTimer);
        openTimer = null;
      }
      scheduleClose();
    });

    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      isTouchActive = true;
      overlay.classList.add('touch-active');
      showPreview(card);
    });
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hidePreview(true);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      hidePreview(true);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
      hidePreview(true);
    }
  });
}

// Backward compatibility alias
function initExpandableCards() {
  initCentralCardPreview();
}

/**
 * 2. Directional Scroll Reveal (Right to Left on Scroll)
 * Elements slide in from right (+80px) and exit towards left (-80px) on scrolling past.
 */
function initDirectionalScrollObserver() {
  const elements = document.querySelectorAll('.directional-reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-in-view'));
    return;
  }

  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let scrollDirection = 'down';

  window.addEventListener('scroll', () => {
    const currentY = window.pageYOffset || document.documentElement.scrollTop;
    scrollDirection = currentY > lastScrollY ? 'down' : 'up';
    lastScrollY = currentY <= 0 ? 0 : currentY;
  }, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('is-in-view');
        el.classList.remove('exited-left', 'exited-right');
      } else {
        el.classList.remove('is-in-view');
        if (scrollDirection === 'down') {
          el.classList.add('exited-left');
          el.classList.remove('exited-right');
        } else {
          el.classList.add('exited-right');
          el.classList.remove('exited-left');
        }
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/**
 * 3. Services Sliding Active Pill & Sequential Cards Filter
 * Sliding indicator glides behind the active category tab.
 * Old cards exit left (-60px, 250ms), then new cards slide in from right (60px, stagger 80ms).
 */
function initServicesCategorySlidingFilter() {
  const tabsTrack = document.querySelector('.services-tabs-track');
  const pills = document.querySelectorAll('.service-filter-pill');
  const serviceCards = Array.from(document.querySelectorAll('[data-service-category]'));

  if (!pills.length || !serviceCards.length) return;

  // Add card-item styling to all cards
  serviceCards.forEach(c => c.classList.add('service-card-item'));

  // Ensure sliding indicator element exists in track
  let slidingIndicator = tabsTrack ? tabsTrack.querySelector('.sliding-category-indicator') : null;
  if (tabsTrack && !slidingIndicator) {
    slidingIndicator = document.createElement('div');
    slidingIndicator.className = 'sliding-category-indicator';
    tabsTrack.insertBefore(slidingIndicator, tabsTrack.firstChild);
  }

  function moveIndicatorTo(activePill) {
    if (!slidingIndicator || !tabsTrack || !activePill) return;
    const pillRect = activePill.getBoundingClientRect();
    const trackRect = tabsTrack.getBoundingClientRect();
    const left = pillRect.left - trackRect.left;
    const top = pillRect.top - trackRect.top;

    slidingIndicator.style.left = left + 'px';
    slidingIndicator.style.top = top + 'px';
    slidingIndicator.style.width = pillRect.width + 'px';
    slidingIndicator.style.height = pillRect.height + 'px';
  }

  // Set initial position on active pill
  const initialActive = document.querySelector('.service-filter-pill.is-active') || pills[0];
  if (initialActive) {
    initialActive.classList.add('is-active', 'text-white');
    // Delay slightly to ensure layout is measured
    setTimeout(() => moveIndicatorTo(initialActive), 60);
    window.addEventListener('resize', () => moveIndicatorTo(document.querySelector('.service-filter-pill.is-active') || pills[0]));
  }

  let isTransitioning = false;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (isTransitioning && pill.classList.contains('is-active')) return;
      isTransitioning = true;

      // Update pills active styling
      pills.forEach(p => {
        p.classList.remove('is-active', 'text-white', 'bg-primary');
        p.classList.add('text-slate-600');
      });
      pill.classList.add('is-active', 'text-white');
      pill.classList.remove('text-slate-600');

      moveIndicatorTo(pill);

      const cat = pill.getAttribute('data-category');

      // 1. Current cards exit towards the left
      const currentlyVisible = serviceCards.filter(c => c.style.display !== 'none');
      currentlyVisible.forEach((card, idx) => {
        card.style.transition = 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1)';
        card.style.transitionDelay = (idx * 25) + 'ms';
        card.classList.add('service-card-exit');
        card.classList.remove('service-card-enter-active');
      });

      // 2. After exit, switch visibility and animate in from right
      setTimeout(() => {
        const nextVisible = [];
        serviceCards.forEach(card => {
          const cardCats = card.getAttribute('data-service-category') || '';
          const matches = cat === 'all' || cardCats.includes(cat);
          if (matches) {
            card.style.display = '';
            card.classList.remove('service-card-exit');
            card.classList.add('service-card-enter-start');
            card.classList.remove('service-card-enter-active');
            nextVisible.push(card);
          } else {
            card.style.display = 'none';
            card.classList.remove('service-card-exit', 'service-card-enter-start', 'service-card-enter-active');
          }
        });

        // Trigger reflow
        void document.body.offsetHeight;

        // 3. Staggered entrance from right to place
        nextVisible.forEach((card, i) => {
          card.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
          card.style.transitionDelay = (i * 80) + 'ms';
          card.classList.remove('service-card-enter-start');
          card.classList.add('service-card-enter-active');
        });

        setTimeout(() => {
          isTransitioning = false;
        }, nextVisible.length * 80 + 350);

      }, 250);
    });
  });
}

// Auto-initialize suite
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initExpandableCards();
    initDirectionalScrollObserver();
    initServicesCategorySlidingFilter();
  });
} else {
  initExpandableCards();
  initDirectionalScrollObserver();
  initServicesCategorySlidingFilter();
}
