const fs = require('fs');
const path = require('path');

// 1. Update index.html
const indexPath = path.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

const heroRegex = /<main id="main-content" class="flex-grow pt-24 pb-16">[\s\S]*?<!-- -{5,}\r?\n\s*SECTION 1: HERO SECTION[\s\S]*?<\/section>/;

if (!heroRegex.test(indexHtml)) {
  console.error("Could not find hero section regex match in index.html");
  process.exit(1);
}

const newHeroHtml = `<main id="main-content" class="flex-grow pb-16">
    
    <!-- ========================================================================
         SECTION 1: FULL-SCREEN HERO WITH FADED TEXT OVERLAY
         ======================================================================== -->
    <section class="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center overflow-hidden pt-28 pb-16 lg:py-24">
      
      <!-- Full-screen Background Image Layer -->
      <div class="absolute inset-0 w-full h-full pointer-events-none">
        <img 
          src="assets/images/hero-rehab.jpg" 
          alt="مركز التأهيل الطبي الحديث والرعاية عن بُعد - جسور للتأهيل" 
          class="w-full h-full object-cover object-center select-none"
        >
      </div>

      <!-- Directional Faded Gradient Overlay (smooth transition from text side across image) -->
      <div class="absolute inset-0 hero-faded-overlay-dir pointer-events-none"></div>

      <!-- Atmospheric Top & Bottom Blend -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#f8fafd]/80 via-transparent to-[#f8fafd] pointer-events-none"></div>

      <!-- Content Container with Frosted Faded Text Card -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="max-w-2xl bg-white/85 backdrop-blur-md p-8 sm:p-10 lg:p-12 rounded-3xl border border-white/90 shadow-card space-y-6 text-center lg:text-start">
          
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span data-i18n="hero.badge">المنصة المتخصصة في التأهيل والرعاية عن بُعد</span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface tracking-tight leading-[1.25]" data-i18n="hero.title">
            رحلة تأهيل متكاملة تبدأ من منزلك نحو الاستقلالية
          </h1>

          <p class="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0" data-i18n="hero.subtitle">
            نربط ذوي الاحتياجات التأهيلية وأسرهم بنخبة من الأخصائيين المعتمدين والمشرفين الحركيين لتنفيذ خطط علاجية موجهة ومتابعة دورية بكل أمان وسهولة.
          </p>

          <!-- Exactly Two Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button 
              type="button" 
              data-open-app-modal 
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-subtle hover:-translate-y-0.5 cursor-pointer"
            >
              <span data-i18n="hero.ctaStart">ابدأ رحلتك الآن</span>
              <span class="material-symbols-outlined text-lg">arrow_forward</span>
            </button>

            <a 
              href="services.html" 
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200 border border-slate-200 shadow-2xs hover:border-slate-300"
            >
              <span data-i18n="hero.ctaServices">استكشف خدماتنا</span>
            </a>
          </div>

          <!-- Subtle Trust Metrics -->
          <div class="pt-6 border-t border-slate-200/70 flex items-center justify-center lg:justify-start gap-8 text-xs text-slate-500">
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-secondary text-base">verified</span>
              <span class="font-medium text-slate-700" data-i18n="hero.statSupervision">كوادر سريرية معتمدة</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-primary text-base">home_health</span>
              <span class="font-medium text-slate-700" data-i18n="hero.statRehab">إشراف حركي منزلي</span>
            </div>
          </div>

        </div>
      </div>

    </section>`;

indexHtml = indexHtml.replace(heroRegex, newHeroHtml);
fs.writeFileSync(indexPath, indexHtml, 'utf-8');
console.log("Successfully replaced hero section in index.html");

// 2. Update i18n.js
const i18nPath = path.join(__dirname, '..', 'assets', 'js', 'i18n.js');
let i18nContent = fs.readFileSync(i18nPath, 'utf-8');

if (!i18nContent.includes('"hero.ctaStart": "ابدأ رحلتك الآن"')) {
  i18nContent = i18nContent.replace(
    '"hero.ctaServices": "اكتشف خدماتنا",',
    '"hero.ctaStart": "ابدأ رحلتك الآن",\n    "hero.ctaServices": "استكشف خدماتنا",'
  );
}

if (!i18nContent.includes('"hero.ctaStart": "Start Your Journey Now"')) {
  i18nContent = i18nContent.replace(
    '"hero.ctaServices": "Explore Services",',
    '"hero.ctaStart": "Start Your Journey Now",\n    "hero.ctaServices": "Explore Services",'
  );
}

fs.writeFileSync(i18nPath, i18nContent, 'utf-8');
console.log("Successfully updated i18n.js with hero keys");
