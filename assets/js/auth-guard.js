/**
 * منصة جسور للتأهيل والرعاية عن بُعد - Jusoor Tele-Rehabilitation Platform
 * File: assets/js/auth-guard.js
 * Comprehensive Route Guard & Role Verification for Internal Dashboards
 */

(function () {
  'use strict';

  function resolveLoginUrl() {
    // تحديد المسار النسبي الصحيح لصفحة login.html
    const pathname = decodeURIComponent(window.location.pathname);
    if (pathname.includes('/المنصة/')) {
      return 'login.html';
    }
    // إذا كان في أحد المجلدات الفرعية الرئيسية (الجمعيات، المختص، المستفيد، الخ)
    if (
      pathname.includes('/الجمعيات/') ||
      pathname.includes('/المختص/') ||
      pathname.includes('/المشرف الحركي/') ||
      pathname.includes('/المستشفيات و المراكز/') ||
      pathname.includes('/المستفيد/') ||
      pathname.includes('/تحديد مشكلة المستفيد/')
    ) {
      // حساب عمق المجلد الحالي للرجوع للمنصة
      const parts = pathname.split('/').filter(Boolean);
      const rootIndex = parts.findIndex(p => p.includes('جسور') || p.includes('لتأهيل') || p === 'المنصة');
      
      // مسار نسبي ذكي
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
    // 1. من خلال سمة script المحددة يدوياً إن وجدت
    const guardScript = document.querySelector('script[data-required-role]');
    if (guardScript && guardScript.dataset.requiredRole) {
      return guardScript.dataset.requiredRole;
    }

    // 2. من خلال اسم المجلد في مسار الصفحة
    const path = decodeURIComponent(window.location.pathname);
    if (path.includes('/الجمعيات/')) return 'charity_admin';
    if (path.includes('/المختص/')) return 'specialist';
    if (path.includes('/المشرف الحركي/')) return 'motor_supervisor';
    if (path.includes('/المستشفيات و المراكز/')) return 'hospital_admin';
    if (path.includes('/المستفيد/') || path.includes('/تحديد مشكلة المستفيد/')) return 'beneficiary';

    return null;
  }

  async function enforceAuth() {
    // تجاهل الفحص إذا كانت الصفحة هي صفحة تسجيل الدخول أو صفحات الموقع العام التعريفية
    const currentPath = decodeURIComponent(window.location.pathname);
    if (
      currentPath.endsWith('login.html') ||
      currentPath.endsWith('index.html') && currentPath.includes('/المنصة/') ||
      currentPath.endsWith('about.html') ||
      currentPath.endsWith('services.html') ||
      currentPath.endsWith('partners.html') ||
      currentPath.endsWith('faq.html') ||
      currentPath.endsWith('contact.html') ||
      currentPath.endsWith('privacy.html') ||
      currentPath.endsWith('terms.html')
    ) {
      return;
    }

    // استرجاع جلسة المستخدم الحالية
    let user = null;
    try {
      const stored = sessionStorage.getItem('jisr_auth_user') || localStorage.getItem('jisr_auth_user');
      user = stored ? JSON.parse(stored) : null;
    } catch (e) {
      user = null;
    }

    const loginUrl = resolveLoginUrl();

    // 1. غير مسجل دخول نهائياً -> طرد فوري لصفحة تسجيل الدخول
    if (!user || !user.role) {
      console.warn('Jisr Auth Guard: Unauthorized access attempt. Redirecting to login.');
      sessionStorage.setItem('jisr_redirect_reason', 'unauthenticated');
      window.location.replace(loginUrl);
      return;
    }

    // 2. التحقق من حالة اعتماد الحساب (approval_status)
    if (user.approval_status === 'pending' || user.approval_status === 'rejected') {
      console.warn('Jisr Auth Guard: Account approval status is not approved.');
      sessionStorage.removeItem('jisr_auth_user');
      localStorage.removeItem('jisr_auth_user');
      sessionStorage.setItem('jisr_redirect_reason', 'not_approved');
      window.location.replace(loginUrl);
      return;
    }

    // 3. التحقق من مطابقة الدور المطلوب (Role Match)
    const requiredRole = getRequiredRole();
    if (requiredRole && user.role !== requiredRole && user.role !== 'admin' && user.role !== 'owner') {
      console.warn(`Jisr Auth Guard: Role mismatch. Required: ${requiredRole}, Current: ${user.role}`);
      sessionStorage.setItem('jisr_redirect_reason', 'role_mismatch');
      window.location.replace(loginUrl);
      return;
    }

    // 4. فحص خاص لبوابة الجمعيات (Subscription Gate)
    if (currentPath.includes('/الجمعيات/الواجهة الاساسية.html')) {
      if (window.jisrDB && typeof window.jisrDB.getCharityActiveSubscription === 'function') {
        try {
          const subInfo = await window.jisrDB.getCharityActiveSubscription(user.id);
          if (!subInfo.hasActiveSub || subInfo.remaining_days <= 0) {
            console.warn('Jisr Auth Guard: Charity subscription is not active or expired. Redirecting to packages.');
            alert('تنبيه: يلزم وجود اشتراك نشط وساري المفعول للوصول إلى الواجهة الأساسية وإدارة المستفيدين.');
            window.location.replace('index.html');
            return;
          }
        } catch (e) {
          console.warn('Failed to verify charity subscription:', e);
        }
      }
    }

    // إضافة زر تسجيل الخروج السريع في الواجهة إن وجد هيدر
    injectUserStatusBadge(user);
  }

  function injectUserStatusBadge(user) {
    window.jisrLogout = async function () {
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
