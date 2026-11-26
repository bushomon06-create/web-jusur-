/**
 * منصة جسور للتأهيل والرعاية عن بُعد - Jusoor Tele-Rehabilitation Platform
 * File: assets/js/auth-guard.js
 * Comprehensive Route Guard & Role Verification for Internal Dashboards
 */

(function () {
  'use strict';

  function resolveLoginUrl() {
    const pathname = decodeURIComponent(window.location.pathname);
    if (pathname.includes('/admin/') || pathname.endsWith('/admin')) {
      return '../login.html';
    }
    if (pathname.includes('/المنصة/')) {
      return 'login.html';
    }
    if (
      pathname.includes('/الجمعيات/') ||
      pathname.includes('/المختص/') ||
      pathname.includes('/المشرف الحركي/') ||
      pathname.includes('/المستشفيات و المراكز/') ||
      pathname.includes('/المستفيد/') ||
      pathname.includes('/تحديد مشكلة المستفيد/')
    ) {
      const parts = pathname.split('/').filter(Boolean);
      let relativePrefix = '../';
      if (pathname.split('/').length > 5) {
        relativePrefix = '../../';
      }
      if (pathname.split('/').length > 6) {
        relativePrefix = '../../../';
      }
      return relativePrefix + 'المنصة/login.html';
    }
    return '../المنصة/login.html';
  }

  function getRequiredRole() {
    const guardScript = document.querySelector('script[data-required-role]');
    if (guardScript && guardScript.dataset.requiredRole) {
      return guardScript.dataset.requiredRole;
    }

    const path = decodeURIComponent(window.location.pathname);
    if (path.includes('/admin/') || path.endsWith('/admin')) return 'owner_admin';
    if (path.includes('/الجمعيات/')) return 'charity_admin';
    if (path.includes('/المختص/')) return 'specialist';
    if (path.includes('/المشرف الحركي/')) return 'motor_supervisor';
    if (path.includes('/المستشفيات و المراكز/')) return 'hospital_admin';
    if (path.includes('/المستفيد/') || path.includes('/تحديد مشكلة المستفيد/')) return 'beneficiary';

    return null;
  }

  async function enforceAuth() {
    const currentPath = decodeURIComponent(window.location.pathname);
    const isAdmin = currentPath.includes('/admin/') || currentPath.endsWith('/admin');
    const loginUrl = resolveLoginUrl();

    // تجاهل الفحص في الصفحات العامة
    if (!isAdmin) {
      if (
        currentPath.endsWith('login.html') ||
        (currentPath.endsWith('index.html') && !currentPath.includes('/admin/')) ||
        currentPath.endsWith('about.html') ||
        currentPath.endsWith('services.html') ||
        currentPath.endsWith('booking.html') ||
        currentPath.endsWith('devices.html') ||
        currentPath.endsWith('partners.html') ||
        currentPath.endsWith('faq.html') ||
        currentPath.endsWith('contact.html') ||
        currentPath.endsWith('privacy.html') ||
        currentPath.endsWith('terms.html')
      ) {
        return;
      }
    }

    const supabase = window.jisrSupabase || (window.jisrDB && window.jisrDB.getClient ? window.jisrDB.getClient() : null) || window.supabaseClient || window.supabase;

    let authUser = null;
    let profile = null;

    // 4. انتظر await supabase.auth.getSession() واقرأ السجل من جدول profiles بنفس استعلام .or(`auth_user_id.eq.${authUser.id},id.eq.${authUser.id},email.eq.${authUser.email}`)
    if (supabase && supabase.auth && typeof supabase.auth.getSession === 'function') {
      try {
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) {
          console.error('Jusoor Auth Guard: getSession error:', sessionErr);
        }
        authUser = sessionData?.session?.user;
        if (authUser && typeof supabase.from === 'function') {
          const { data: profData, error: profErr } = await supabase
            .from('profiles')
            .select('*')
            .or(`auth_user_id.eq.${authUser.id},id.eq.${authUser.id},email.eq.${authUser.email}`)
            .limit(1)
            .maybeSingle();

          if (profErr) {
            console.error('Jusoor Auth Guard: profiles query error:', profErr);
          } else if (profData) {
            profile = profData;
          }
        }
      } catch (err) {
        console.error('Jusoor Auth Guard: Exception during Supabase session verification:', err);
      }
    }

    // إذا لم يتوفر profile من Supabase الحي، تحقق من الجلسة المخزنة محلياً
    if (!profile) {
      try {
        const stored = sessionStorage.getItem('jisr_auth_user') || localStorage.getItem('jisr_auth_user');
        if (stored) {
          profile = JSON.parse(stored);
        }
      } catch (e) {
        profile = null;
      }
    }

    // التحقق المخصص لمدير المنصة (لوحة التحكم /admin/):
    // اسمح بفتح لوحة التحكم فوراً متى كان profile?.role === 'owner_admin'
    if (isAdmin) {
      if (profile && (profile.role === 'owner_admin' || profile.role === 'owner' || profile.role === 'admin')) {
        console.info('Jusoor Auth Guard: Access granted for owner_admin.');
        const sessionUser = {
          id: profile.id || authUser?.id,
          auth_user_id: profile.auth_user_id || authUser?.id || profile.id,
          email: profile.email || authUser?.email,
          full_name: profile.full_name || 'مدير المنصة',
          role: 'owner_admin',
          approval_status: profile.approval_status || 'approved',
          is_active: profile.is_active !== false
        };
        if (window.jisrDB && typeof window.jisrDB.setCurrentUser === 'function') {
          window.jisrDB.setCurrentUser(sessionUser);
        } else {
          sessionStorage.setItem('jisr_auth_user', JSON.stringify(sessionUser));
          localStorage.setItem('jisr_auth_user', JSON.stringify(sessionUser));
        }
        injectUserStatusBadge(sessionUser);
        applyPersonalizedGreeting(sessionUser);
        return; // اسمح بفتح لوحة التحكم فوراً!
      } else {
        console.warn('Jusoor Auth Guard: Admin access denied. Required role owner_admin, found:', profile?.role);
        sessionStorage.setItem('jisr_redirect_reason', 'role_mismatch');
        window.location.replace(loginUrl);
        return;
      }
    }

    // إذا لم يتوفر مستخدم نهائياً للمسارات المحمية الأخرى -> تحويل لصفحة تسجيل الدخول
    if (!profile) {
      console.warn('Jusoor Auth Guard: Unauthorized access attempt. Redirecting to login.');
      sessionStorage.setItem('jisr_redirect_reason', 'unauthenticated');
      window.location.replace(loginUrl);
      return;
    }

    // فحص تفعيل الحساب
    if (profile.is_active === false) {
      console.warn('Jusoor Auth Guard: Account is inactive.');
      sessionStorage.removeItem('jisr_auth_user');
      localStorage.removeItem('jisr_auth_user');
      sessionStorage.setItem('jisr_redirect_reason', 'account_inactive');
      window.location.replace(loginUrl);
      return;
    }

    // فحص اعتماد الحساب
    if (profile.approval_status === 'pending' || profile.approval_status === 'rejected') {
      console.warn('Jusoor Auth Guard: Account approval status is not approved.');
      sessionStorage.removeItem('jisr_auth_user');
      localStorage.removeItem('jisr_auth_user');
      sessionStorage.setItem('jisr_redirect_reason', 'not_approved');
      window.location.replace(loginUrl);
      return;
    }

    // التحقق من مطابقة الدور المطلوب لبقية البوابات
    const requiredRole = getRequiredRole();
    if (requiredRole && profile.role !== requiredRole && profile.role !== 'owner_admin' && profile.role !== 'admin' && profile.role !== 'owner') {
      console.warn(`Jusoor Auth Guard: Role mismatch. Required: ${requiredRole}, Current: ${profile.role}`);
      sessionStorage.setItem('jisr_redirect_reason', 'role_mismatch');
      window.location.replace(loginUrl);
      return;
    }

    // فحص بوابة الاشتراك المشروطة للجمعيات
    if (currentPath.includes('/الجمعيات/الواجهة الاساسية.html')) {
      if (window.jisrDB && typeof window.jisrDB.getCharityActiveSubscription === 'function') {
        try {
          const subInfo = await window.jisrDB.getCharityActiveSubscription(profile.id);
          if (!subInfo.hasActiveSub || subInfo.remaining_days <= 0) {
            console.warn('Jusoor Auth Guard: Charity subscription is not active or expired. Redirecting to packages.');
            alert('تنبيه: يلزم وجود اشتراك نشط وساري المفعول للوصول إلى الواجهة الأساسية وإدارة المستفيدين.');
            window.location.replace('index.html');
            return;
          }
        } catch (e) {
          console.warn('Failed to verify charity subscription:', e);
        }
      }
    }

    injectUserStatusBadge(profile);
    applyPersonalizedGreeting(profile);
  }

  
  // ========================================================================
  // AUTOMATIC PERSONALIZED GREETING ENGINE ACROSS ALL PORTALS
  // Ensures greetings display the personal name: "أهلاً بك، [الاسم الكامل]"
  // ========================================================================
  function applyPersonalizedGreeting(profile) {
    if (!profile) return;
    const fullName = profile.full_name || (profile.user_metadata && profile.user_metadata.full_name) || 'مستخدم جسور';
    const entityName = profile.entity_name || '';

    function performUpdate() {
      // 1. Update any explicit targets
      const greetingElements = document.querySelectorAll(
        '#welcome-title, .welcome-heading, #header-user-name, #welcome-user-name, [data-user-greeting], .user-fullname, #admin-user-name, #specialist-welcome, #supervisor-welcome, #beneficiary-welcome, #hospital-welcome'
      );
      greetingElements.forEach(el => {
        el.innerHTML = 'أهلاً بك، <span class="font-bold">' + fullName + '</span>';
      });

      // 2. Scan and replace generic welcomes in headings
      const headings = document.querySelectorAll('h1, h2, h3, span.font-headline-lg-mobile, span.font-headline-sm');
      headings.forEach(h => {
        const txt = h.textContent.trim();
        if (
          txt.includes('أهلاً بك الجمعية') ||
          txt.includes('أهلاً بك المستشفيات') ||
          txt.includes('أهلاً بكم في بوابة') ||
          txt.includes('مرحباً بك في إدارة') ||
          txt.includes('مرحباً بعودتك، د. سارة') ||
          txt.includes('مرحباً بك مجدداً، كابتن طارق') ||
          txt.includes('مرحبًا، أحمد') ||
          txt.includes('مرحباً، أحمد') ||
          txt.startsWith('أهلاً بك في بوابة')
        ) {
          h.innerHTML = 'أهلاً بك، <span class="text-primary font-bold">' + fullName + '</span>';
          if (entityName && h.parentElement && !h.parentElement.querySelector('.entity-sub-label')) {
            const sub = document.createElement('div');
            sub.className = 'text-xs text-slate-500 font-medium entity-sub-label mt-1';
            sub.textContent = entityName;
            h.parentElement.insertBefore(sub, h.nextSibling);
          }
        }
      });

      // 3. Update user name display in headers, drawers, avatars
      const nameSpans = document.querySelectorAll('.user-name-display, #profile-name, #drawer-user-name, .header-user-name');
      nameSpans.forEach(s => {
        s.textContent = fullName;
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', performUpdate);
    } else {
      performUpdate();
    }
    // Also run after a short delay to catch dynamically rendered components
    setTimeout(performUpdate, 300);
    setTimeout(performUpdate, 800);
  }

  function injectUserStatusBadge(user) {
    applyPersonalizedGreeting(user);
    window.jisrLogout = async function () {
      const supabase = window.jisrSupabase || (window.jisrDB && window.jisrDB.getClient ? window.jisrDB.getClient() : null) || window.supabaseClient || window.supabase;
      if (supabase && supabase.auth && typeof supabase.auth.signOut === 'function') {
        try {
          await supabase.auth.signOut();
        } catch (e) {}
      }
      if (window.jisrDB && typeof window.jisrDB.signOut === 'function') {
        await window.jisrDB.signOut();
      } else {
        sessionStorage.removeItem('jisr_auth_user');
        localStorage.removeItem('jisr_auth_user');
      }
      window.location.replace(resolveLoginUrl());
    };
  }

  // تنفيذ الفحص فور تحميل الوثيقة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforceAuth);
  } else {
    enforceAuth();
  }
})();
