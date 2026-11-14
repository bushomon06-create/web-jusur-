/**
 * جسر للتأهيل والرعاية عن بُعد - Jisr Tele-Rehabilitation Platform
 * Internationalization (i18n) Engine & Translations
 */

const translations = {
  ar: {
    // Navigation & Header
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.services": "خدماتنا",
    "nav.howItWorks": "كيف تعمل المنصة؟",
    "nav.forWhom": "لمن صُممت جسر؟",
    "nav.partners": "شركاؤنا",
    "nav.stories": "قصص وتجارب",
    "nav.faq": "الأسئلة الشائعة",
    "nav.contact": "تواصل معنا",
    "nav.downloadApp": "تحميل التطبيق",
    "nav.enterPlatform": "دخول المنصة",
    "nav.userPortals": "بوابات المستخدمين",
    "nav.langSwitch": "English",
    "skipLink": "التخطي إلى المحتوى الرئيسي",

    // Hero Section
    "hero.badge": "منصة وطنية متخصصة في الرعاية التأهيلية عن بُعد",
    "hero.title": "جسر يربطك برحلة تأهيل أكثر سهولة وأمانًا من منزلك",
    "hero.subtitle": "منصة رقمية متخصصة تُمكّن الأشخاص ذوي الاحتياجات التأهيلية وأسرهم من الحصول على خطط تأهيلية متكاملة ومتابعة مستمرة بإشراف نخبة من الأخصائيين المعتمدين والمشرفين الحركيين والمؤسسات الصحية.",
    "hero.ctaServices": "اكتشف خدماتنا",
    "hero.ctaDownload": "تحميل التطبيق",
    "hero.ctaAssessment": "بدء التقييم المبدئي",
    "hero.statRehab": "تأهيل منزلي منظم",
    "hero.statRehabSub": "تمارين وخطط علاجية يومية",
    "hero.statSupervision": "إشراف سريري معتمد",
    "hero.statSupervisionSub": "ربط مباشر بالأخصائيين",
    "hero.statFamily": "رعاية متكاملة للأسرة",
    "hero.statFamilySub": "تقليل تكاليف وتحديات التنقل",
    "hero.diagramTitle": "منظومة جسر المتكاملة للرعاية التشاركية",
    "hero.nodeBeneficiary": "المستفيد والأسرة",
    "hero.nodeSpecialist": "الأخصائي المعالج",
    "hero.nodeSupervisor": "المشرف الحركي",
    "hero.nodeHospital": "المستشفيات والجمعيات",

    // About Section
    "about.tag": "من نحن",
    "about.title": "تمكين ورعاية متصلة بروح إنسانية وتقنية متطورة",
    "about.intro": "منصة «جسر للتأهيل والرعاية عن بُعد» هي مبادرة تقنية متخصصة تهدف إلى إعادة صياغة تجربة التأهيل الطبي والرعاية الصحية المنزلية، من خلال تذليل العقبات الجغرافية والمالية التي تواجه الأسر والأشخاص ذوي الإعاقة.",
    "about.foundingIdea": "فكرة التأسيس",
    "about.foundingIdeaDesc": "انطلقت فكرة جسر استجابةً لحاجة إنسانية ملحة: معاناة الأسر في الوصول المستمر إلى مراكز التأهيل، وصعوبة التنقل المتكرر، وتفاوت المتابعة المنزلية بين الجلسات السريرية، ما دفعنا لابتكار بيئة رقمية آمنة تربط جميع أطراف الرعاية.",
    "about.problem": "المشكلة التي نعالجها",
    "about.problemDesc": "قلة توفر مراكز التأهيل المتخصصة في بعض المناطق، وارتفاع تكاليف التنقل، وطول فترات الانتظار، والضغط المتزايد على المستشفيات، وضعف استمرارية التمارين التأهيلية في بيئة المنزل.",
    "about.importance": "أهمية التأهيل المنزلي",
    "about.importanceDesc": "تشير الممارسات السريرية الحديثة إلى أن استمرارية التأهيل المنزلي اليومي تضاعف من معدلات تحسن الوظائف الحركية، وتمنح المستفيد استقلالية أكبر وتقلل من الانتكاسات الوظيفية.",
    "about.visionTitle": "رؤية المشروع",
    "about.visionDesc": "أن نكون المنظومة الرقمية الرائدة في التأهيل والرعاية الصحية المنزلية عن بُعد على مستوى المنطقة، موفرين رعاية شاملة لكل بيت بجودة سريرية موثوقة.",
    "about.missionTitle": "رسالة المشروع",
    "about.missionDesc": "تمكين الأشخاص ذوي الاحتياجات التأهيلية وأسرهم عبر تقنيات سهلة الوصول تربطهم بالكوادر الطبية والمشرفين الحركيين والمؤسسات الداعمة، لتقديم رعاية منزلية مستمرة تحفظ الكرامة وتيسر الحياة.",
    "about.objectivesTitle": "الأهداف الرئيسية",
    "about.obj1": "تسهيل وصول المستفيدين لخدمات التأهيل السريري في أي وقت ومن أي مكان.",
    "about.obj2": "تخفيف الأعباء المادية والجسدية الناتجة عن التنقلات المتكررة على عاتق الأسر.",
    "about.obj3": "المساهمة في تخفيف الضغط والازدحام على المستشفيات ومراكز التأهيل المتخصصة.",
    "about.obj4": "رفع نسبة الالتزام بالتمارين اليومية بفضل التوجيه المرئي والمتابعة اللحظية.",
    "about.obj5": "بناء شراكات مستدامة مع القطاعين الصحي وغير الربحي لتوفير الأجهزة والدعم الشامل.",
    "about.valuesTitle": "قيمنا الأساسية",
    "about.valHumanity": "الإنسانية والكرامة",
    "about.valHumanityDesc": "نضع كرامة وراحة المستفيد وأسرته في قلب كل قرار وكل ميزة برمجية نطورها.",
    "about.valEmpowerment": "التمكين والاستقلالية",
    "about.valEmpowermentDesc": "تمكين المستفيد وأسرته بالمعرفة والمهارات لتنفيذ التمارين المنزلية بثقة.",
    "about.valPrivacy": "الأمان والخصوصية الصحية",
    "about.valPrivacyDesc": "التزام بأعلى معايير تشفير وحماية السجلات الطبية والبيانات الشخصية.",
    "about.valIntegration": "التكامل السريري التشاركي",
    "about.valIntegrationDesc": "ربط منظومة الرعاية بالكامل في حلقة تواصل مهنية واحدة بين جميع المعنيين.",

    // Services Section
    "services.tag": "خدمات جسر",
    "services.title": "منظومة خدمات تأهيلية متكاملة صُممت لراحتكم",
    "services.subtitle": "حلول مدروسة تغطي جميع مراحل رحلة التأهيل من التقييم الأولي وحتى التعافي والاستقلالية التامة.",
    "services.btnExplore": "تفاصيل الخدمة",
    "services.modalClose": "إغلاق",
    "services.modalPortals": "بوابات الاستخدام ذات العلاقة:",
    
    // 10 Services
    "svc.1.title": "التقييم المبدئي للمستفيد",
    "svc.1.desc": "استبيان رقمي منهجي لتحديد الصعوبات الوظيفية والاحتياجات الحركية لتوجيه الحالة نحو الأخصائي المناسب.",
    "svc.1.detail": "تتيح هذه الخدمة للمستفيد أو ولي أمره تعبئة تقييم وظيفي ذكي يغطي القدرات الحركية، صعوبات الجلوس، التوازن، والتنقل. يتم تحليل البيانات أولياً وتوجيه المستفيد نحو العيادة أو الأخصائي الأنسب لمباشرة التقييم السريري الدقيق دون هدر للوقت أو الموارد.",

    "svc.2.title": "خطط التأهيل الفردية",
    "svc.2.desc": "خطط علاجية مخصصة وموجهة يصممها الأخصائي المعالج بدقة وفق احتياجات وقدرات كل مستفيد.",
    "svc.2.detail": "يقوم الأخصائي السريري بدراسة التقييم، وتحديد الأهداف العلاجية قصيرة وطويلة المدى، وصياغة برنامج متسلسل يشمل التمارين التأهيلية، فترات الراحة، ودرجات الشدة، مع إمكانية تعديل الخطة دورياً بناءً على استجابة المريض.",

    "svc.3.title": "التمارين المنزلية الموجهة",
    "svc.3.desc": "مكتبة وسائط تعليمية عالية الدقة توضح الطريقة السليمة لأداء التمارين وتفادي الحركات الخاطئة.",
    "svc.3.detail": "يتضمن التطبيق مكتبة تمارين فيديو مشروحة باللغة العربية البسيطة بإشراف مشرفين حركيين معتمدين. تتضمن التمارين زوايا تصوير واضحة، تعليمات تنفس وتكرار، وملاحظات تحذيرية لضمان أداء الحركات بأمان داخل المنزل.",

    "svc.4.title": "المتابعة السريرية مع المختصين",
    "svc.4.desc": "قنوات اتصال منتظمة وموثوقة تربط الأسر بالأخصائي المعالج لمتابعة الاستجابة ومناقشة التطورات.",
    "svc.4.detail": "توفر المنصة بيئة تواصل آمنة (رسائل نصية، استشارات صوتية ومرئية) تمكّن الأسرة من إرسال مقاطع لأداء التمارين، وتلقي ملاحظات الأخصائي التعديلية، والإجابة على أي استفسارات تخص تطور الخطة التأهيلية.",

    "svc.5.title": "المساعد الذكي للتمارين",
    "svc.5.desc": "مساعد تقني تفاعلي يدعم المستفيد أثناء أداء التمارين المنزلية ويذكره بالمواعيد (لا يحل محل الأخصائي).",
    "svc.5.detail": "أداة تقنية مساعدة ترشد المستفيد صوتياً وبصرياً أثناء جلسة التمرين المنزلية، وتحسب التكرارات وأوقات الراحة، وتوفر تنبيهات تشجيعية منتظمة. نؤكد أن هذا المساعد أداة داعمة للإرشاد ولا يعتبر بديلاً عن التقييم أو القرار الطبي السريري.",

    "svc.6.title": "متابعة التقدم والالتزام",
    "svc.6.desc": "لوحات بيانية تفاعلية تسجل إنجازات التمارين اليومية ومعدلات الالتزام ونقاط التحسن الحركي.",
    "svc.6.detail": "تسجيل مؤتمت لكل تمرين يتم إنجازه، مع مؤشرات واضحة للأسرة والأخصائي توضح نسبة الالتزام الأسبوعية والتحسن في المدى الحركي والقدرة على التحمل، مما يحفز المستفيد ويمنح الفريق الطبي مؤشرات واقعية.",

    "svc.7.title": "الاستشارات والمواعيد",
    "svc.7.desc": "جدولة مرنة للاستشارات الافتراضية عن بُعد والتنسيق للمواعيد السريرية الحضورية عند الحاجة.",
    "svc.7.detail": "نظام تقويم متكامل يسمح بحجز استشارات الفيديو عن بُعد لمراجعة التمارين، أو طلب تحويل لموعد حضوري في المستشفيات والمراكز الشريكة في حال استدعت الحالة تدخلاً طبياً أو فحصاً سريرياً مباشراً.",

    "svc.8.title": "مجتمعات الدعم الأسري",
    "svc.8.desc": "مجموعات آمنة وموجهة تتيح للأسر والمستفيدين تبادل التجارب والنصائح والدعم النفسي التشاركي.",
    "svc.8.detail": "مساحات تفاعلية مغلقة تخضع لإشراف ومراجعة محتوى، تجمع أولياء الأمور الذين يتشاركون ظروفاً تأهيلية متقاربة، لتبادل التجارب الإيجابية وقصص الصمود والنصائح العملية للتأقلم المنزلي.",

    "svc.9.title": "بنك الأجهزة المساعدة",
    "svc.9.desc": "منظومة تعاونية للتعرف على الأجهزة التعويضية والمساعدة وطلبها أو التبرع بها عبر الجمعيات المعتمدة.",
    "svc.9.detail": "دليل رقمي يربط المستفيدين المحتاجين للأجهزة المساعدة (كراسي متحركة، دعامات، مشايات) بالجمعيات الخيرية ومتاجر الأجهزة الطبية الشريكة، لتيسير توفير الأجهزة المناسبة أو إعادة تدوير الأجهزة الفائضة وصيانتها.",

    "svc.10.title": "التقارير الطبية والمشاركة",
    "svc.10.desc": "تقارير سريرية منتظمة وموثقة توضح مسار التحسن وتشارك مع الجهات المختصة وفق الصلاحيات المعتمدة.",
    "svc.10.detail": "إصدار تقارير تأهيلية دورية بصيغ رسمية معتمدة تلخص التقييمات، والالتزام، ومستوى الاستجابة الحركية، لتسهيل مشاركتها مع أطباء المستشفيات أو اللجان الطبية والجمعيات الداعمة بضوابط خصوصية صارمة.",

    // How it works Section
    "how.tag": "رحلة المستفيد",
    "how.title": "كيف تعمل منصة جسر؟",
    "how.subtitle": "خطوات بسيطة وواضحة ترتب رحلتك من التقييم الأولي وحتى تحقيق الاستقلالية الحركية",
    "step1.num": "01",
    "step1.title": "إنشاء الحساب وإضافة بيانات المستفيد",
    "step1.desc": "تسجيل سريع لولي الأمر أو المستفيد، وتوثيق البيانات الأساسية والحالة الصحية الأولية بسهولة وأمان.",
    "step2.num": "02",
    "step2.title": "إجراء التقييم المبدئي",
    "step2.desc": "الإجابة عن أسئلة التقييم الوظيفي الميسر لتحديد نوع الصعوبات الحركية والمستوى الوظيفي الحالي.",
    "step3.num": "03",
    "step3.title": "مراجعة الحالة من الأخصائي المعالج",
    "step3.desc": "يتولى أخصائي سريري معتمد دراسة نتائج التقييم والتاريخ المرضي، وتحديد الاحتياجات التأهيلية الدقيقة.",
    "step4.num": "04",
    "step4.title": "إعداد خطة التأهيل واعتمادها",
    "step4.desc": "صياغة خطة تمارين منزلية فردية مخصصة ومجدولة زمنياً، وإرسالها للمستفيد بعد اعتمادها من الأخصائي.",
    "step5.num": "05",
    "step5.title": "تنفيذ التمارين بإرشاد المشرف الحركي",
    "step5.desc": "متابعة الفيديوهات الإرشادية والتوجيهات الحركية بدقة في المنزل مع المساعد التقني المساند.",
    "step6.num": "06",
    "step6.title": "متابعة الإنجاز والتقدم المستمر",
    "step6.desc": "تسجيل استكمال التمارين اليومية، ورصد مؤشرات التطور وتوثيق الملاحظات في سجل التقدم.",
    "step7.num": "07",
    "step7.title": "التواصل الدوري ومراجعة التقارير",
    "step7.desc": "عقد استشارات مراجعة مع الأخصائي، ومشاركة التقارير الدورية مع المؤسسات الصحية المتابعة.",

    // Who it is for Section
    "forWhom.tag": "الفئات المستفيدة",
    "forWhom.title": "لمن صُممت منصة جسر؟",
    "forWhom.subtitle": "حلول متخصصة ومصممة خصيصاً لكل فاعل في منظومة الرعاية والتأهيل",
    
    "target.1.title": "المستفيدون وأولياء الأمور",
    "target.1.role": "رعاية منزلية آمنة",
    "target.1.desc": "تأهيل منزلي مريح يغني عن مشاق السفر والتنقل المتكرر، مع إرشادات مبسطة ومتابعة مباشرة تمنح الأسرة راحة البال والثقة في مسار التعافي.",
    "target.1.btn": "بوابة المستفيد",

    "target.2.title": "الأخصائيون المعالجون",
    "target.2.role": "إشراف سريري متقدم",
    "target.2.desc": "إدارة مرنة للمرضى، تصميم خطط علاجية فردية، مراجعة مقاطع أداء التمارين، وتوثيق التقارير الطبية دون أعباء إدارية مرهقة.",
    "target.2.btn": "بوابة الأخصائي",

    "target.3.title": "المشرفون الحركيون",
    "target.3.role": "إرشاد وتدريب ميداني",
    "target.3.desc": "متابعة دقيقة لأداء التمارين والجلسات، تقديم الدعم الحركي للمستفيدين، تدوين الملاحظات الحركية ورفعها السريع للأخصائي السريري.",
    "target.3.btn": "بوابة المشرف الحركي",

    "target.4.title": "المستشفيات ومراكز التأهيل",
    "target.4.role": "تكامل مؤسسي صحي",
    "target.4.desc": "تنظيم المواعيد، متابعة المرضى بعد الخروج من المستشفى، تقليل فترات الانتظار، وربط الكوادر الطبية والمستفيدين في شبكة موحدة.",
    "target.4.btn": "بوابة المؤسسات الصحية",

    "target.5.title": "الجمعيات والمؤسسات غير الربحية",
    "target.5.role": "تمكين مجتمعي وتكافل",
    "target.5.desc": "التعاون الفعال في كفالة برامج التأهيل، والمساهمة في توفير الأجهزة المساعدة، ومتابعة الأثر المجتمعي للمستفيدين المدعومين.",
    "target.5.btn": "بوابة الجمعيات",

    // User Portals Drawer
    "drawer.title": "اختر بوابتك للوصول إلى جسر",
    "drawer.subtitle": "بوابات رقمية مستقلة مخصصة لكل شريك في رحلة التأهيل",
    "drawer.close": "إغلاق القائمة",
    "drawer.assessmentPill": "هل تحتاج لتقييم حالتك أولاً؟ اضغط هنا لبدء الفحص الوظيفي المبدئي",
    
    "portal.1.title": "المستفيد أو ولي الأمر",
    "portal.1.desc": "تابع خطة التأهيل والتمارين والمواعيد، وتواصل مع المختصين واحصل على الدعم المنزلي.",
    "portal.1.action": "الدخول إلى حساب المستفيد",
    "portal.1.subaction": "إنشاء حساب جديد للمستفيد",

    "portal.2.title": "الأخصائي المعالج",
    "portal.2.desc": "إدارة المستفيدين والتقييمات السريرية، واعتماد خطط التأهيل، ومتابعة الحالات دورياً.",
    "portal.2.action": "الدخول إلى بوابة الأخصائي",

    "portal.3.title": "المشرف الحركي",
    "portal.3.desc": "متابعة تنفيذ التمارين والجلسات الحركية، وإدارة المحتوى، وتسجيل الملاحظات الميدانية.",
    "portal.3.action": "الدخول إلى بوابة المشرف الحركي",

    "portal.4.title": "المستشفى أو المركز التأهيلي",
    "portal.4.desc": "إدارة خدمات المؤسسة والعيادات، وتنسيق الأخصائيين والمستفيدين، وإدارة المواعيد.",
    "portal.4.action": "الدخول إلى بوابة المؤسسات الصحية",

    "portal.5.title": "الجمعيات والمؤسسات غير الربحية",
    "portal.5.desc": "التعاون في دعم وتغطية المستفيدين، وتنسيق بنك الأجهزة المساعدة والمبادرات المجتمعية.",
    "portal.5.action": "الدخول إلى بوابة الجمعيات",

    // Partners Section
    "partners.tag": "شركاؤنا في الرعاية",
    "partners.title": "منظومة تعاون متكاملة لخدمة المجتمع",
    "partners.subtitle": "نتعاون مع أرقى الصروح الطبية والجمعيات الخيرية ومزودي الأجهزة المساعدة لتقديم تجربة تأهيلية شاملة.",
    "partners.catHospitals": "المستشفيات والمجمعات الطبية",
    "partners.catRehab": "مراكز التأهيل والعلاج الطبيعي",
    "partners.catCharity": "الجمعيات والمؤسسات غير الربحية",
    "partners.catSpecialists": "الأخصائيون والكوادر السريرية",
    "partners.catPharmacies": "الصيدليات ومراكز الدواء",
    "partners.catDevices": "متاجر الأجهزة الطبية والمساعدة",
    "partners.cta": "كن شريكًا مع جسر",
    "partners.note": "جميع الشراكات تخضع لاتفاقيات حوكمة طبية معتمدة ومعايير امتثال موحدة.",

    // Stories Section
    "stories.tag": "أثر ورعاية",
    "stories.title": "قصص وتجارب من رحلة التأهيل",
    "stories.subtitle": "نماذج واقعية تعكس التزام جسر بمساعدة الأسر على تخطي التحديات بروح من الأمل والعزيمة",
    "stories.privacyNote": "تُعرض التجارب وفق موافقات صريحة، مع احترام تام للخصوصية والمعايير الأخلاقية والطبية.",
    "story.1.title": "استعادة الاستقلالية في بيئة المنزل",
    "story.1.user": "أسرة مستفيد - تأهيل حركي بعد جراحة",
    "story.1.text": "«كانت صعوبة الانتقال بالسيارة إلى المركز مرتين أسبوعياً تشكل هاجساً حقيقياً. منصة جسر مكّنتنا من متابعة الخطة اليومية بدقة وبتوجيه مستمر من الأخصائي، مما زاد من ثقتنا وتطور الحركة بشكل ملحوظ.»",
    "story.1.service": "الخدمة: خطة التأهيل الفردية والمتابعة السريرية",

    "story.2.title": "تخفيف القلق ومتابعة منتظمة",
    "story.2.user": "والدة طفل من ذوي الإعاقة الحركية",
    "story.2.text": "«التمارين المصورة والواضحة باللغة العربية جعلتني أفهم تماماً كيف أساعد طفلي دون خوف من ارتكاب حركات خاطئة. والمشرف الحركي يراجع مقاطعنا بانتظام ويبدي ملاحظاته التعديلية بكل مودة.»",
    "story.2.service": "الخدمة: التمارين المنزلية الموجهة والمشرف الحركي",

    "story.3.title": "الحصول على جهاز مساعد بتنسيق جمعية شريكة",
    "story.3.user": "مستفيد بالغ - إصابة رياضية وتأهيل وظيفي",
    "story.3.text": "«عبر بنك الأجهزة المساعدة في المنصة وبالتنسيق مع إحدى الجمعيات الشريكة، تم تأمين دعامة المشي المناسبة في وقت قياسي ومتابعة قياساتها المناسبة مع الأخصائي.»",
    "story.3.service": "الخدمة: بنك الأجهزة المساعدة ومجتمعات الدعم",

    // FAQ Section
    "faq.tag": "الأسئلة الشائعة",
    "faq.title": "إجابات واضحة لكل ما تود معرفته عن جسر",
    "faq.subtitle": "جمعنا لك أهم التساؤلات المتعلقة بآلية العمل والخصوصية والاستفادة من الخدمات",
    "faq.searchPlaceholder": "ابحث في الأسئلة الشائعة...",
    "faq.tabAll": "الكل",
    "faq.tabGeneral": "عن المنصة",
    "faq.tabRehab": "التأهيل والتمارين",
    "faq.tabAccounts": "الحساب والمواعيد",
    "faq.tabPartners": "الشراكات والخصوصية",

    // 13 Questions & Answers
    "faq.q1": "ما هي منصة جسر للتأهيل والرعاية عن بُعد؟",
    "faq.a1": "جسر هي منصة وطنية متخصصة تهدف إلى تسهيل وصول الأشخاص ذوي الاحتياجات التأهيلية وأسرهم إلى برامج التأهيل والمتابعة السريرية المنزلية، عبر ربطهم بأخصائيين معتمدين ومشرفين حركيين ومؤسسات صحية وجمعيات داعمة.",

    "faq.q2": "من يستطيع استخدام منصة جسر؟",
    "faq.a2": "تخدم المنصة خمس فئات رئيسية: المستفيدون وأولياء أمورهم، الأخصائيون السريريون المعالجون، المشرفون الحركيون، المستشفيات ومراكز التأهيل، والجمعيات والمؤسسات غير الربحية.",

    "faq.q3": "كيف أقوم بتسجيل مستفيد جديد في المنصة؟",
    "faq.a3": "يمكن التسجيل بسهولة عبر بوابة المستفيد باختيار 'إنشاء حساب جديد'، وإدخال البيانات الأساسية للمستفيد وولي أمره وتأكيد رقم الهاتف، ثم الانتقال المباشر لاستكمال التقييم الوظيفي المبدئي.",

    "faq.q4": "كيف يتم تقييم حالة المستفيد؟",
    "faq.a4": "يبدأ التقييم بنموذج رقمي استرشادي للإجابة على استبيان حركي ميسر (فحص التوازن، المشي، المفاصل)، يلي ذلك مراجعة سريرية متخصصة من قِبل الأخصائي المعالج عبر المنصة، أو التنسيق لموعد حضوري إذا تطلبت الحالة.",

    "faq.q5": "من الذي يضع خطة التأهيل للمستفيد؟",
    "faq.a5": "يضع خطة التأهيل حصرياً الأخصائي السريري المعالج المرخص، بناءً على التقييم السريري الدقيق وقدرات المستفيد الفردية. لا تعتمد الخطط على نماذج عشوائية أو ذكاء اصطناعي دون اعتماد الأخصائي.",

    "faq.q6": "كيف تُنفذ التمارين التأهيلية من المنزل؟",
    "faq.a6": "يصل المستفيد إلى جدول تمارينه عبر التطبيق، حيث يعرض كل تمرين بمقطع فيديو عالي الجودة مشروح باللغة العربية مع عدد التكرارات والتعليمات الوقائية، وبإشراف المشرف الحركي والمساعد التقني المساند.",

    "faq.q7": "كيف أتواصل مع الأخصائي المعالج المتابع للحالة؟",
    "faq.a7": "توفر المنصة رسائل نصية وصوتية سريرية آمنة، بالإضافة إلى إمكانية رفع مقاطع فيديو توثق أداء التمرين لتلقي التغذية الراجعة، وحجز استشارات مراجعة مرئية دورية.",

    "faq.q8": "كيف أحجز استشارة تأهيلية عن بُعد؟",
    "faq.a8": "من خلال قائمة 'المواعيد والاستشارات' في حساب المستفيد، يمكنك اختيار الأخصائي المعالج والاطلاع على المواعيد المتاحة وحجز الجلسة المرئية مباشرة والتذكير بها قبل موعدها.",

    "faq.q9": "كيف أحصل على موعد حضوري في مركز أو مستشفى؟",
    "faq.a9": "إذا أوصى الأخصائي بضرورة التدخل السريري الحضوري، يمكن تنسيق موعد مباشر من خلال المنصة لدى أحد المستشفيات أو المراكز التأهيلية الشريكة المسجلة في شبكة جسر.",

    "faq.q10": "هل يمكن الوصول إلى التمارين واستخدامها دون اتصال بالإنترنت؟",
    "faq.a10": "نعم، يتيح تطبيق المستفيد ميزة 'تحميل التمارين للمشاهدة بدون إنترنت'، مما يضمن استمرارية أداء الخطة اليومية حتى في ظروف انقطاع أو ضعف التغطية الشبكية.",

    "faq.q11": "كيف تنضم المستشفيات ومراكز التأهيل إلى منظومة جسر؟",
    "faq.a11": "يمكن للمؤسسات الصحية تقديم طلب انضمام عبر بوابة 'المستشفيات والمراكز' أو زر 'طلب شراكة'، حيث يقوم فريق الحوكمة بمراجعة التراخيص الطبية واعتماد حساب المنشأة وتدريب كوادرها.",

    "faq.q12": "كيف تتعاون الجمعيات والمؤسسات غير الربحية مع المنصة؟",
    "faq.a12": "تتعاون الجمعيات من خلال دعم كفالة برامج التأهيل للأسر الأشد حاجة، وتغذية بنك الأجهزة المساعدة، واستقبال طلبات الدعم المحولة عبر المنصة بما يحقق التكافل الاجتماعي والتوزيع العادل للخدمات.",

    "faq.q13": "كيف تضمن منصة جسر حماية بيانات المستفيدين وسجلاتهم الطبية؟",
    "faq.a13": "تطبق المنصة أعلى معايير التشفير (End-to-End Encryption)، وتخضع لسياسات خصوصية البيانات الصحية الصارمة، بحيث لا يُسمح بالاطلاع على السجلات إلا للأخصائي المصرح له ولأولياء الأمور المعتمدين.",

    // App Download Section
    "app.tag": "تطبيق جسر للهواتف الذكية",
    "app.title": "رحلة التأهيل الكاملة بين يديك في أي وقت",
    "app.subtitle": "حمّل تطبيق المستفيد والأسرة لمتابعة التمارين اليومية، والتواصل مع المختصين، وتتبع مؤشرات التحسن لحظة بلحظة.",
    "app.feature1": "مكتبة تمارين فيديو عالية الجودة مع إرشادات حركية صوتية",
    "app.feature2": "مساعد تقني ذكي لتنظيم الجلسات واحتساب التكرارات وفترات الراحة",
    "app.feature3": "إشعارات يومية مجدولة وتذكير بالمواعيد والاستشارات",
    "app.feature4": "إمكانية العمل دون اتصال بالإنترنت وحفظ البيانات بأمان",
    "app.btnGooglePlay": "تحميل من Google Play",
    "app.btnAppStore": "تحميل من App Store",
    "app.btnScanQR": "مسح رمز QR للتحميل المباشر",
    "app.qrTitle": "امسح الرمز بكاميرا هاتفك",
    "app.qrDesc": "يوجهك الرمز مباشرة إلى صفحة التنزيل وتثبيت التطبيق على جهازك الذكي.",
    "app.webAppPill": "أو يمكنك استخدام نسخة الويب للمتصفح مباشرة",
    "app.webAppLink": "فتح نسخة الويب للمستفيد",

    // Contact Section
    "contact.tag": "تواصل معنا",
    "contact.title": "يسعدنا الاستماع إليكم والإجابة عن استفساراتكم",
    "contact.subtitle": "فريق جسر مستعد للإجابة عن أسئلة الأسر، واستقبال طلبات الشراكة من المستشفيات والجمعيات، وتقديم الدعم الفني.",
    "contact.formTitle": "أرسل رسالتك لإدارة المنصة",
    "contact.nameLabel": "الاسم الكامل *",
    "contact.namePlaceholder": "أدخل اسمك الكريم",
    "contact.contactLabel": "البريد الإلكتروني أو رقم الجوال *",
    "contact.contactPlaceholder": "example@domain.com أو 05xxxxxxxx",
    "contact.typeLabel": "نوع الطلب أو الاستفسار *",
    "contact.typeGeneral": "استفسار عام عن المنصة والخدمات",
    "contact.typeHospital": "طلب شراكة واعتماد (مستشفى أو مركز تأهيلي)",
    "contact.typeCharity": "طلب تعاون ودعم (جمعية أو مؤسسة خيرية)",
    "contact.typeSpecialist": "انضمام ككوادر سريرية أو إشراف حركي",
    "contact.typeTech": "الدعم الفني والاستفسارات التقنية",
    "contact.messageLabel": "الرسالة أو تفاصيل الطلب *",
    "contact.messagePlaceholder": "اكتب رسالتك هنا بوضوح...",
    "contact.disclaimer": "ملاحظة هامة: هذا النموذج مخصص للاستفسارات العامة والشراكات المؤسسية، ولا يُستخدم لإرسال تقارير طبية طارئة أو بيانات صحية حساسة.",
    "contact.submitBtn": "إرسال الرسالة",
    "contact.sending": "جاري الإرسال...",
    "contact.successTitle": "تم إرسال رسالتكم بنجاح!",
    "contact.successDesc": "شكراً لتواصلكم مع منصة جسر. سيقوم الفريق المختص بمراجعة رسالتكم والرد عليكم في أقرب وقت ممكن.",
    "contact.errorEmpty": "يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح.",
    
    // Official Channels
    "contact.channelsTitle": "قنوات التواصل المعتمدة",
    "contact.emailTitle": "البريد الإلكتروني الرسمي",
    "contact.emailVal": "info@jisr-care.org",
    "contact.phoneTitle": "مركز العناية بالمستفيدين",
    "contact.phoneVal": "920000000 (الأحد - الخميس: 8ص - 5م)",
    "contact.locationTitle": "المقر الرئيسي للمنظومة",
    "contact.locationVal": "المملكة العربية السعودية — الرياض",
    "contact.supportDeskTitle": "بوابة الدعم الفني المباشر",
    "contact.supportDeskVal": "متاحة على مدار الساعة عبر المنصة",

    // Partnership Modal
    "partnerModal.title": "طلب شراكة وتعاون مؤسسي مع جسر",
    "partnerModal.desc": "نرحب بالتعاون مع المنشآت الصحية ومراكز التأهيل والجمعيات وموردي الأجهزة لتقديم خدمات متكاملة للمستفيدين.",
    "partnerModal.orgName": "اسم المنشأة أو المؤسسة *",
    "partnerModal.orgType": "تصنيف المنشأة *",
    "partnerModal.orgTypeHospital": "مستشفى أو مجمع طبي متخصص",
    "partnerModal.orgTypeRehab": "مركز تأهيل أو علاج طبيعي",
    "partnerModal.orgTypeCharity": "جمعية خيرية أو مؤسسة مانحة",
    "partnerModal.orgTypeDevices": "شركة أو متجر أجهزة طبية ومساعدة",
    "partnerModal.repName": "اسم ممثل المنشأة والصفة *",
    "partnerModal.repPhone": "رقم هاتف التواصل المعتمد *",
    "partnerModal.repEmail": "البريد الإلكتروني الرسمي للمنشأة *",
    "partnerModal.city": "المدينة / المنطقة *",
    "partnerModal.notes": "نبذة عن سبل التعاون المقترحة *",
    "partnerModal.submit": "تقديم طلب الشراكة",

    // Accessibility Modal / Toolbar
    "a11y.title": "أدوات تيسير الوصول وسهولة الاستخدام",
    "a11y.fontBigger": "تكبير الخط",
    "a11y.fontNormal": "الحجم الافتراضي",
    "a11y.contrastToggle": "وضع التباين العالي",
    "a11y.motionToggle": "إيقاف الحركة والأنيميشن",
    "a11y.reset": "استعادة الإعدادات الأصلية",

    // Footer
    "footer.desc": "جسر هي المنصة المتخصصة في التأهيل والرعاية عن بُعد، تهدف إلى مساعدة الأشخاص ذوي الإعاقة والاحتياجات التأهيلية وأسرهم للوصول إلى رعاية منزلية موثوقة بإشراف سريري متكامل.",
    "footer.quickLinks": "روابط سريعة",
    "footer.userPortals": "بوابات المنصة",
    "footer.legal": "السياسات والحوكمة",
    "footer.privacyPolicy": "سياسة الخصوصية وحماية البيانات",
    "footer.terms": "الشروط والأحكام",
    "footer.accessibility": "بيان إمكانية الوصول الرقمي",
    "footer.clinicalEthics": "ميثاق الأخلاقيات السريرية",
    "footer.rights": "جميع الحقوق محفوظة لمنصة جسر للتأهيل والرعاية عن بُعد © 2026",
    "footer.badge": "مشروع رقمي إنساني للتأهيل والرعاية عن بُعد"
  },

  en: {
    // Navigation & Header
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.services": "Services",
    "nav.howItWorks": "How It Works",
    "nav.forWhom": "Who It's For",
    "nav.partners": "Our Partners",
    "nav.stories": "Stories",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.downloadApp": "Download App",
    "nav.enterPlatform": "Enter Platform",
    "nav.userPortals": "User Portals",
    "nav.langSwitch": "العربية",
    "skipLink": "Skip to main content",

    // Hero Section
    "hero.badge": "Dedicated Platform for Tele-Rehabilitation & Home Care",
    "hero.title": "A Bridge Connecting You to a Smoother Rehabilitation Journey",
    "hero.subtitle": "A specialized digital platform empowering individuals with rehabilitation needs and their families to receive comprehensive care and consistent home follow-up under the supervision of certified specialists, motor supervisors, and healthcare entities.",
    "hero.ctaServices": "Explore Services",
    "hero.ctaDownload": "Download App",
    "hero.ctaAssessment": "Start Initial Assessment",
    "hero.statRehab": "Structured Home Rehab",
    "hero.statRehabSub": "Daily personalized exercise plans",
    "hero.statSupervision": "Certified Clinical Oversight",
    "hero.statSupervisionSub": "Direct specialist connection",
    "hero.statFamily": "Comprehensive Family Care",
    "hero.statFamilySub": "Lowering commute stress and costs",
    "hero.diagramTitle": "Jisr Collaborative Care Ecosystem",
    "hero.nodeBeneficiary": "Beneficiary & Family",
    "hero.nodeSpecialist": "Treating Specialist",
    "hero.nodeSupervisor": "Motor Supervisor",
    "hero.nodeHospital": "Hospitals & Associations",

    // About Section
    "about.tag": "About Us",
    "about.title": "Empowerment and Connected Care with a Human Heart",
    "about.intro": "Jisr Tele-Rehabilitation & Care Platform is a dedicated technological initiative designed to transform medical rehabilitation and home healthcare by breaking down geographical and financial barriers facing families and individuals with physical disabilities.",
    "about.foundingIdea": "Our Founding Idea",
    "about.foundingIdeaDesc": "Jisr was conceived from a pressing human reality: the hardship families face in traveling repeatedly to rehabilitation centers, and the gap in consistent daily exercise between clinical sessions.",
    "about.problem": "The Challenge We Address",
    "about.problemDesc": "Scarcity of specialized centers in certain regions, heavy commute burdens, long waiting lists, overcrowded hospitals, and low compliance with home exercise routines.",
    "about.importance": "The Importance of Home Rehabilitation",
    "about.importanceDesc": "Clinical evidence proves that structured, daily home rehabilitation accelerates motor recovery, builds patient autonomy, and prevents functional relapses.",
    "about.visionTitle": "Our Vision",
    "about.visionDesc": "To be the leading digital ecosystem in tele-rehabilitation and home healthcare across the region, delivering trusted clinical quality to every household.",
    "about.missionTitle": "Our Mission",
    "about.missionDesc": "Empowering individuals with rehabilitation needs and their families through accessible technology that connects them with clinical professionals, kinesiology supervisors, and supporting institutions.",
    "about.objectivesTitle": "Strategic Objectives",
    "about.obj1": "Facilitate accessible clinical rehabilitation services anytime and anywhere.",
    "about.obj2": "Reduce physical and financial travel burdens carried by families.",
    "about.obj3": "Alleviate pressure and wait times on hospitals and specialized rehabilitation centers.",
    "about.obj4": "Enhance daily exercise compliance with video guidance and continuous oversight.",
    "about.obj5": "Establish sustainable partnerships with health and non-profit sectors for assistive devices and care.",
    "about.valuesTitle": "Core Values",
    "about.valHumanity": "Human Dignity & Compassion",
    "about.valHumanityDesc": "Prioritizing the dignity and comfort of beneficiaries and their families in every feature.",
    "about.valEmpowerment": "Empowerment & Independence",
    "about.valEmpowermentDesc": "Equipping beneficiaries and caregivers with the knowledge and tools for confident home care.",
    "about.valPrivacy": "Health Privacy & Security",
    "about.valPrivacyDesc": "Strict adherence to health data encryption and privacy regulations.",
    "about.valIntegration": "Collaborative Care Integration",
    "about.valIntegrationDesc": "Connecting all care stakeholders into a cohesive, synchronized loop.",

    // Services Section
    "services.tag": "Jisr Services",
    "services.title": "A Complete Rehabilitation Suite Built for Your Comfort",
    "services.subtitle": "Carefully engineered services covering every phase of your journey from initial assessment to functional independence.",
    "services.btnExplore": "Service Details",
    "services.modalClose": "Close",
    "services.modalPortals": "Associated Gateways:",

    // 10 Services
    "svc.1.title": "Initial Functional Assessment",
    "svc.1.desc": "A guided digital questionnaire identifying functional difficulties and mobility needs to direct the case accurately.",
    "svc.1.detail": "Allows the beneficiary or caregiver to complete an intelligent functional assessment measuring balance, gait, sitting, and joint mobility. The data is analyzed to channel the patient to the right specialist without lost time.",

    "svc.2.title": "Personalized Rehabilitation Plans",
    "svc.2.desc": "Customized therapeutic regimens formulated and approved by the treating clinician.",
    "svc.2.detail": "The clinical specialist reviews assessments, sets short and long-term targets, and builds a progressive plan including exercises, resting intervals, and intensity levels, adaptable over time.",

    "svc.3.title": "Guided Home Exercises",
    "svc.3.desc": "High-definition educational media demonstrating accurate exercise techniques and preventing incorrect postures.",
    "svc.3.detail": "An organized library of clear video tutorials with concise Arabic and English guidance under certified supervisor oversight, highlighting safe movement angles and precautions.",

    "svc.4.title": "Clinical Specialist Follow-Up",
    "svc.4.desc": "Secure communication channels linking families to treating clinicians for ongoing evaluation.",
    "svc.4.detail": "Enables messaging, video review of exercise execution, and timely clinician feedback to ensure treatment integrity throughout the home rehabilitation cycle.",

    "svc.5.title": "Smart Exercise Assistant",
    "svc.5.desc": "An interactive digital companion supporting home routine execution (does not replace the clinician).",
    "svc.5.detail": "A supportive tool providing audio and visual cues during workout sessions, tracking repetition counts, and providing encouraging prompts without substituting medical decisions.",

    "svc.6.title": "Progress & Adherence Tracking",
    "svc.6.desc": "Interactive analytical charts logging daily completed routines, commitment rates, and motor milestones.",
    "svc.6.detail": "Automated logging of every completed session, offering motivating metrics for families and clear objective trends for the clinical team.",

    "svc.7.title": "Tele-Consultations & Appointments",
    "svc.7.desc": "Flexible scheduling for virtual consultations and coordinated in-person clinic visits when needed.",
    "svc.7.detail": "Integrated calendar system for booking virtual video checkups or referral to in-person evaluations across partner medical centers.",

    "svc.8.title": "Family Support Communities",
    "svc.8.desc": "Safe, moderated spaces for families and beneficiaries to exchange peer support, tips, and experiences.",
    "svc.8.detail": "Moderated peer discussion spaces bringing together caregivers sharing similar rehabilitation journeys for mutual encouragement and practical home adaptation insights.",

    "svc.9.title": "Assistive Devices Bank",
    "svc.9.desc": "A collaborative exchange for discovering, requesting, or donating assistive equipment through certified charities.",
    "svc.9.detail": "A transparent hub connecting beneficiaries in need of wheelchairs, walkers, or orthotics with partner charities and medical equipment vendors.",

    "svc.10.title": "Clinical Reports & Data Sharing",
    "svc.10.desc": "Structured clinical progress reports ready to share with authorized medical bodies under strict consent.",
    "svc.10.detail": "Generates formal progress summaries detailing functional improvements, adherence rates, and clinical notes, shareable securely with medical boards or hospitals.",

    // How It Works
    "how.tag": "Beneficiary Journey",
    "how.title": "How Jisr Platform Works",
    "how.subtitle": "Seven systematic steps guiding your recovery journey from intake to independence",
    "step1.num": "01",
    "step1.title": "Account Creation & Profile Setup",
    "step1.desc": "Quick onboarding for the beneficiary or caregiver, securely documenting primary records.",
    "step2.num": "02",
    "step2.title": "Initial Functional Assessment",
    "step2.desc": "Complete an accessible questionnaire outlining functional challenges and current mobility.",
    "step3.num": "03",
    "step3.title": "Review by Treating Specialist",
    "step3.desc": "A licensed clinician analyzes assessment outcomes and clinical history to diagnose therapeutic needs.",
    "step4.num": "04",
    "step4.title": "Plan Formulation & Approval",
    "step4.desc": "Creation of an individualized, scheduled exercise regimen endorsed by the specialist.",
    "step5.num": "05",
    "step5.title": "Executing Home Exercises",
    "step5.desc": "Perform daily exercises following video tutorials under motor supervisor direction.",
    "step6.num": "06",
    "step6.title": "Progress & Adherence Tracking",
    "step6.desc": "Log completed sessions, record milestones, and track functional indicators over time.",
    "step7.num": "07",
    "step7.title": "Periodic Review & Reports",
    "step7.desc": "Participate in follow-up consultations and review formal clinical progress documentation.",

    // Who it is for Section
    "forWhom.tag": "Target Audiences",
    "forWhom.title": "Who Is Jisr Designed For?",
    "forWhom.subtitle": "Tailored solutions for every vital stakeholder in the rehabilitation ecosystem",

    "target.1.title": "Beneficiaries & Families",
    "target.1.role": "Safe Home Rehabilitation",
    "target.1.desc": "Comfortable home rehabilitation eliminating travel hardships, with clear instructions and direct follow-up that bring peace of mind.",
    "target.1.btn": "Beneficiary Portal",

    "target.2.title": "Clinical Specialists",
    "target.2.role": "Advanced Clinical Oversight",
    "target.2.desc": "Streamlined patient management, customized regimen drafting, video performance review, and structured medical reporting.",
    "target.2.btn": "Specialist Portal",

    "target.3.title": "Motor Supervisors",
    "target.3.role": "Kinesiology Guidance & Coaching",
    "target.3.desc": "Dedicated exercise monitoring, content management, feedback logging, and direct liaison with treating clinicians.",
    "target.3.btn": "Supervisor Portal",

    "target.4.title": "Hospitals & Rehab Centers",
    "target.4.role": "Institutional Healthcare Integration",
    "target.4.desc": "Appointment orchestration, post-discharge patient tracking, reduced waiting lists, and unified medical coordination.",
    "target.4.btn": "Hospitals Portal",

    "target.5.title": "Charities & Non-Profits",
    "target.5.role": "Community Empowerment & Relief",
    "target.5.desc": "Sponsoring rehabilitation cases, contributing assistive equipment, and monitoring humanitarian impact.",
    "target.5.btn": "Associations Portal",

    // User Portals Drawer
    "drawer.title": "Choose Your Gateway to Jisr",
    "drawer.subtitle": "Dedicated portals tailored for every role in the care continuum",
    "drawer.close": "Close Menu",
    "drawer.assessmentPill": "Need an initial evaluation first? Click here to start your functional assessment",

    "portal.1.title": "Beneficiary or Guardian",
    "portal.1.desc": "Follow your daily plan, access video exercises, check schedules, and consult clinicians.",
    "portal.1.action": "Enter Beneficiary Account",
    "portal.1.subaction": "Create New Beneficiary Account",

    "portal.2.title": "Treating Specialist",
    "portal.2.desc": "Manage patient cases, clinical evaluations, rehabilitation plans, and medical progress.",
    "portal.2.action": "Enter Specialist Gateway",

    "portal.3.title": "Motor Supervisor",
    "portal.3.desc": "Supervise exercise execution, manage instructional media, and log motor notes.",
    "portal.3.action": "Enter Motor Supervisor Gateway",

    "portal.4.title": "Hospital or Rehabilitation Center",
    "portal.4.desc": "Coordinate institutional clinical services, manage appointments, and connect clinical teams.",
    "portal.4.action": "Enter Healthcare Institutions Gateway",

    "portal.5.title": "Charitable Associations & Non-Profits",
    "portal.5.desc": "Support sponsored beneficiaries, facilitate assistive device allocations, and track community impact.",
    "portal.5.action": "Enter Associations Gateway",

    // Partners Section
    "partners.tag": "Our Partners in Care",
    "partners.title": "A Collaborative Healthcare Alliance",
    "partners.subtitle": "Uniting hospitals, specialized clinics, charities, and medical suppliers for comprehensive care delivery.",
    "partners.catHospitals": "Hospitals & Medical Complexes",
    "partners.catRehab": "Rehabilitation & Physical Therapy Centers",
    "partners.catCharity": "Charities & Non-Profit Foundations",
    "partners.catSpecialists": "Licensed Specialists & Clinicians",
    "partners.catPharmacies": "Pharmacies & Medical Suppliers",
    "partners.catDevices": "Assistive Devices & Mobility Stores",
    "partners.cta": "Become a Jisr Partner",
    "partners.note": "All institutional collaborations operate under rigorous governance and compliance standards.",

    // Stories Section
    "stories.tag": "Impact & Care",
    "stories.title": "Stories from the Rehabilitation Journey",
    "stories.subtitle": "Real reflections illustrating Jisr's commitment to empowering families with dignity and hope.",
    "stories.privacyNote": "Experiences shared with explicit informed consent, adhering to medical confidentiality ethics.",
    "story.1.title": "Restoring Independence at Home",
    "story.1.user": "Family of a Beneficiary - Post-Surgery Mobility Rehab",
    "story.1.text": "\"Traveling to the clinic twice weekly was exhausting for our family. Jisr enabled us to execute daily routines with continuous clinician oversight, dramatically boosting mobility and confidence.\"",
    "story.1.service": "Service: Individualized Plan & Clinical Follow-up",

    "story.2.title": "Relieving Anxiety with Consistent Guidance",
    "story.2.user": "Mother of a Child with Motor Difficulties",
    "story.2.text": "\"Clear, guided video routines helped me assist my child correctly without worrying about wrong movements. The supervisor regularly reviews our session clips with kindness.\"",
    "story.2.service": "Service: Guided Home Exercises & Motor Supervisor",

    "story.3.title": "Obtaining an Assistive Device via Partner Charity",
    "story.3.user": "Adult Beneficiary - Sports Injury & Functional Recovery",
    "story.3.text": "\"Through the Assistive Devices Bank and a partner association, a customized walking orthotic was promptly arranged, and the specialist verified fitting through the platform.\"",
    "story.3.service": "Service: Assistive Devices Bank & Support Community",

    // FAQ Section
    "faq.tag": "Frequently Asked Questions",
    "faq.title": "Clear Answers to Everything About Jisr",
    "faq.subtitle": "Key information regarding procedures, medical oversight, and platform access",
    "faq.searchPlaceholder": "Search questions...",
    "faq.tabAll": "All",
    "faq.tabGeneral": "General",
    "faq.tabRehab": "Rehab & Exercises",
    "faq.tabAccounts": "Accounts & Visits",
    "faq.tabPartners": "Partnerships & Privacy",

    // 13 Questions & Answers
    "faq.q1": "What is Jisr Platform for Rehabilitation and Tele-Care?",
    "faq.a1": "Jisr is a dedicated platform designed to help individuals with rehabilitation needs and their families access home rehabilitation and tele-care services, connecting them with certified specialists, kinesiology supervisors, hospitals, and charities.",

    "faq.q2": "Who can use the Jisr platform?",
    "faq.a2": "The platform serves five core groups: beneficiaries and guardians, clinical specialists, motor supervisors, hospitals and rehabilitation centers, and charitable non-profits.",

    "faq.q3": "How do I register a new beneficiary?",
    "faq.a3": "Registration is seamless via the Beneficiary Portal by clicking 'Create Account', entering essential contact data, and proceeding to the initial functional assessment.",

    "faq.q4": "How is a beneficiary's case evaluated?",
    "faq.a4": "Evaluation starts with an accessible digital functional questionnaire (evaluating mobility, balance, joints), followed by a clinical review from a licensed specialist, or referral to an in-person clinic if needed.",

    "faq.q5": "Who creates the rehabilitation plan?",
    "faq.a5": "Only licensed clinical specialists design and approve personalized rehabilitation plans tailored to the beneficiary's functional capabilities. No plans are generated automatically without clinical validation.",

    "faq.q6": "How are rehabilitation exercises carried out at home?",
    "faq.a6": "The beneficiary accesses their daily schedule on the app, featuring high-quality video demonstrations with repetition targets, audio cues, and supervisor guidance.",

    "faq.q7": "How do I communicate with the treating specialist?",
    "faq.a7": "Through secure clinical messaging, video clip uploads of exercises for feedback, and scheduled virtual review consultations.",

    "faq.q8": "How do I book a tele-consultation?",
    "faq.a8": "Via the 'Appointments' section in the beneficiary dashboard, you can view the specialist's available calendar slots and schedule a video consultation directly.",

    "faq.q9": "How do I get an in-person appointment at a hospital or center?",
    "faq.a9": "If the specialist determines that an on-site clinical intervention is necessary, an appointment can be coordinated at a partner healthcare facility.",

    "faq.q10": "Can exercises be accessed offline?",
    "faq.a10": "Yes, the beneficiary mobile application supports downloading exercises for offline access, ensuring routine continuity even without stable internet.",

    "faq.q11": "How do hospitals and rehabilitation centers join Jisr?",
    "faq.a11": "Healthcare organizations can submit an onboarding request via the 'Hospitals & Centers' gateway or partnership form. Our governance team verifies credentials and activates the organization account.",

    "faq.q12": "How do charitable associations collaborate with Jisr?",
    "faq.a12": "Associations collaborate by sponsoring rehabilitation programs for eligible families, stocking the Assistive Devices Bank, and reviewing humanitarian requests.",

    "faq.q13": "How is beneficiary data and medical privacy protected?",
    "faq.a13": "Jisr employs end-to-end data encryption and adheres to health data security regulations. Medical records are accessible strictly to authorized clinicians and verified guardians.",

    // App Section
    "app.tag": "Jisr Mobile Application",
    "app.title": "Your Entire Rehabilitation Journey in Your Hands",
    "app.subtitle": "Download the mobile app to carry out daily exercises, stay in touch with specialists, and track milestones effortlessly.",
    "app.feature1": "High-definition video exercise tutorials with audio cues",
    "app.feature2": "Smart technical assistant organizing rounds, reps, and breaks",
    "app.feature3": "Daily schedule alerts and appointment reminders",
    "app.feature4": "Offline exercise playback and secure data synchronization",
    "app.btnGooglePlay": "Get it on Google Play",
    "app.btnAppStore": "Download on App Store",
    "app.btnScanQR": "Scan QR Code for Direct Download",
    "app.qrTitle": "Scan with Your Phone Camera",
    "app.qrDesc": "Points directly to the installation package for your mobile device.",
    "app.webAppPill": "Or use the web browser version directly",
    "app.webAppLink": "Open Beneficiary Web Portal",

    // Contact Section
    "contact.tag": "Contact Us",
    "contact.title": "We Are Here to Listen and Guide You",
    "contact.subtitle": "Our team is ready to answer questions, handle institutional partnership requests, and provide technical support.",
    "contact.formTitle": "Send a Message to Administration",
    "contact.nameLabel": "Full Name *",
    "contact.namePlaceholder": "Enter your full name",
    "contact.contactLabel": "Email or Phone Number *",
    "contact.contactPlaceholder": "example@domain.com or phone number",
    "contact.typeLabel": "Inquiry Type *",
    "contact.typeGeneral": "General Inquiry about Services",
    "contact.typeHospital": "Partnership Request (Hospital / Center)",
    "contact.typeCharity": "Collaboration Request (Charity / Association)",
    "contact.typeSpecialist": "Clinical or Motor Supervisor Joining",
    "contact.typeTech": "Technical Support",
    "contact.messageLabel": "Message Details *",
    "contact.messagePlaceholder": "Write your inquiry clearly...",
    "contact.disclaimer": "Important note: This form is intended for general inquiries and partnerships, not for emergency medical advice or sensitive clinical records.",
    "contact.submitBtn": "Send Message",
    "contact.sending": "Sending...",
    "contact.successTitle": "Message Sent Successfully!",
    "contact.successDesc": "Thank you for reaching out to Jisr. Our team will review your inquiry and respond promptly.",
    "contact.errorEmpty": "Please fill in all required fields properly.",

    // Official Channels
    "contact.channelsTitle": "Official Channels",
    "contact.emailTitle": "Official Email",
    "contact.emailVal": "info@jisr-care.org",
    "contact.phoneTitle": "Beneficiary Care Center",
    "contact.phoneVal": "920000000 (Sun - Thu: 8am - 5pm)",
    "contact.locationTitle": "Headquarters",
    "contact.locationVal": "Kingdom of Saudi Arabia — Riyadh",
    "contact.supportDeskTitle": "Direct Support Desk",
    "contact.supportDeskVal": "Available 24/7 via the platform",

    // Partnership Modal
    "partnerModal.title": "Institutional Partnership Request",
    "partnerModal.desc": "We welcome collaborations with healthcare institutions, rehab clinics, charities, and equipment vendors.",
    "partnerModal.orgName": "Organization Name *",
    "partnerModal.orgType": "Entity Classification *",
    "partnerModal.orgTypeHospital": "Hospital or Specialized Medical Complex",
    "partnerModal.orgTypeRehab": "Rehabilitation or Physical Therapy Center",
    "partnerModal.orgTypeCharity": "Charitable Foundation or Grantmaker",
    "partnerModal.orgTypeDevices": "Medical & Assistive Equipment Company",
    "partnerModal.repName": "Representative Name & Title *",
    "partnerModal.repPhone": "Contact Phone *",
    "partnerModal.repEmail": "Official Email *",
    "partnerModal.city": "City / Region *",
    "partnerModal.notes": "Proposed Collaboration Scope *",
    "partnerModal.submit": "Submit Partnership Request",

    // Accessibility
    "a11y.title": "Accessibility & Usability Tools",
    "a11y.fontBigger": "Larger Font",
    "a11y.fontNormal": "Default Size",
    "a11y.contrastToggle": "High Contrast Mode",
    "a11y.motionToggle": "Disable Motion & Animations",
    "a11y.reset": "Reset to Default",

    // Footer
    "footer.desc": "Jisr is a dedicated tele-rehabilitation platform empowering individuals with rehabilitation needs and their families with trusted home care under comprehensive clinical oversight.",
    "footer.quickLinks": "Quick Links",
    "footer.userPortals": "User Portals",
    "footer.legal": "Policies & Governance",
    "footer.privacyPolicy": "Privacy & Data Protection Policy",
    "footer.terms": "Terms & Conditions",
    "footer.accessibility": "Accessibility Statement",
    "footer.clinicalEthics": "Clinical Ethics Charter",
    "footer.rights": "All rights reserved to Jisr Platform for Tele-Rehabilitation © 2026",
    "footer.badge": "A Humanitarian & Digital Health Initiative"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('jisr_lang') || 'ar';
    this.init();
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.bindEvents();
  }

  bindEvents() {
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
        this.setLanguage(newLang);
      });
    });
  }

  setLanguage(lang) {
    if (!translations[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('jisr_lang', lang);
    this.applyLanguage(lang);
  }

  applyLanguage(lang) {
    const isRtl = lang === 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.body.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translations[lang][key];
        } else {
          el.textContent = translations[lang][key];
        }
      }
    });

    // Update all elements with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });

    // Update document title if key exists
    if (translations[lang]['hero.title']) {
      const baseTitle = lang === 'ar' 
        ? 'جسر للتأهيل والرعاية عن بُعد — المنصة الرسمية' 
        : 'Jisr Tele-Rehabilitation & Care — Official Platform';
      document.title = baseTitle;
    }

    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang, isRtl } }));
  }

  t(key) {
    return (translations[this.currentLang] && translations[this.currentLang][key]) 
      || (translations['ar'] && translations['ar'][key]) 
      || key;
  }
}

// Global instance
window.jisrI18n = new I18nManager();
