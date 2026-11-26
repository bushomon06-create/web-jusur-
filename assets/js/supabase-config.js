// ======================================================================
// رابط التحميل المركزي الموحد لتطبيق جسور للتأهيل (Flutter App)
// يكفي تعديل هذا الرابط هنا فقط بعد رفع التطبيق ليتم تحديث زر التحميل ورمز الاستجابة السريعة (QR) تلقائياً في كافة صفحات المنصة
// ======================================================================
window.JUSOOR_APP_DOWNLOAD_URL = "https://jusoor-rehab.vercel.app/download-app";

/**
 * منصة جسور للتأهيل والرعاية عن بُعد - Jusoor Tele-Rehabilitation Platform
 * File: assets/js/supabase-config.js
 * Centralized Supabase Configuration & Unified Data Handler
 */

(function () {
  'use strict';

  // بيانات الاتصال الموحدة لـ Supabase (مشروع جسور للتأهيل)
  const SUPABASE_PROJECT_URL =
    (window.JISR_SUPABASE_URL ||
    localStorage.getItem('JISR_SUPABASE_URL') ||
    'https://thmnjhycypbmqlljxdmw.supabase.co').trim();

  const rawAnonKey =
    window.JISR_SUPABASE_ANON_KEY ||
    localStorage.getItem('JISR_SUPABASE_ANON_KEY') ||
    'sb_publishable_1M5zYP2aGE5UiaT8JVHxPw_RMek-M8i';

  // تنظيف المفتاح وإزالة أي أقواس معقوفة إضافية
  const SUPABASE_ANON_KEY = String(rawAnonKey).replace(/^\[|\]$/g, '').trim();

  let client = null;
  const isConfigured =
    Boolean(window.supabase) &&
    SUPABASE_PROJECT_URL &&
    !SUPABASE_PROJECT_URL.includes('الصقي') &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.includes('الصقي') &&
    SUPABASE_ANON_KEY.length > 20;

  if (isConfigured) {
    try {
      client = window.supabase.createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY);
      console.info('Jusoor: Supabase client initialized successfully.');
    } catch (err) {
      console.warn('Jusoor: Supabase initialization warning:', err.message);
    }
  } else {
    console.info('Jusoor: Running in client demo mode with unified local simulation.');
  }

  window.jisrSupabase = client;
  window.supabaseClient = client;
  if (client && window.supabase) {
    try {
      if (!window.supabase.auth) window.supabase.auth = client.auth;
      if (!window.supabase.from) window.supabase.from = client.from.bind(client);
      if (!window.supabase.rpc) window.supabase.rpc = client.rpc.bind(client);
    } catch (e) {}
  }

  // دوال الربط الموحدة لكافة نماذج وجداول المنصة
  window.jisrDB = {
    isLive: function () {
      return client !== null;
    },

    getClient: function () {
      return client;
    },

    getCurrentUser: function () {
      try {
        const stored =
          sessionStorage.getItem('jisr_auth_user') ||
          localStorage.getItem('jisr_auth_user');
        return stored
          ? typeof stored === 'string'
            ? JSON.parse(stored)
            : stored
          : null;
      } catch (e) {
        return null;
      }
    },

    setCurrentUser: function (userObj) {
      try {
        const dataStr = JSON.stringify(userObj);
        sessionStorage.setItem('jisr_auth_user', dataStr);
        localStorage.setItem('jisr_auth_user', dataStr);
      } catch (e) {
        console.warn('Failed to save session:', e);
      }
    },

    signOut: async function () {
      try {
        if (client) {
          await client.auth.signOut();
        }
      } catch (e) {
        console.warn('SignOut error:', e);
      }
      sessionStorage.removeItem('jisr_auth_user');
      localStorage.removeItem('jisr_auth_user');
    },

    // 1. تسجيل الدخول والتحقق من الدور وحالة الاعتماد
    login: async function (email, password) {
      email = (email || '').trim().toLowerCase();

      // تجربة الدخول عبر Supabase Auth الحي
      if (client) {
        try {
          const { data: authData, error: authErr } = await client.auth.signInWithPassword({
            email: email,
            password: password
          });

          if (authErr) {
            return { user: null, profile: null, error: authErr };
          }

          if (authData && authData.user) {
            // جلب ملف المستخدم من جدول profiles بالاستعلام الموحد الدقيق
            let { data: profile, error: profErr } = await client
              .from('profiles')
              .select('*')
              .or(`auth_user_id.eq.${authData.user.id},id.eq.${authData.user.id},email.eq.${email}`)
              .limit(1)
              .maybeSingle();

            if (profErr) {
              console.error('Jusoor login profErr:', profErr);
              return { user: authData.user, profile: null, error: profErr };
            }

            if (!profile) {
              console.error('No matching profile in profiles table for user:', authData.user);
              return {
                user: authData.user,
                profile: null,
                error: {
                  code: 'PROFILE_NOT_FOUND',
                  message: 'لم يتم العثور على سجل في جدول profiles لتحديد صلاحيات الحساب.'
                }
              };
            }

            // التحقق من حالة الاعتماد
            if (profile.approval_status === 'pending') {
              await client.auth.signOut();
              return {
                user: null,
                profile: null,
                error: {
                  code: 'ACCOUNT_PENDING',
                  message: 'حسابك قيد المراجعة والتدقيق من قِبل إدارة منصة جسور للتأهيل. سيصلك إشعار بالاعتماد فور اكتمال الإجراءات.'
                }
              };
            }

            if (profile.approval_status === 'rejected') {
              await client.auth.signOut();
              return {
                user: null,
                profile: null,
                error: {
                  code: 'ACCOUNT_REJECTED',
                  message: 'نعتذر، لم يتم اعتماد هذا الحساب. يرجى مراجعة إدارة منصة جسور للتأهيل أو التواصل مع الدعم الفني.'
                }
              };
            }

            const verifiedRole = (profile.role === 'owner_admin' || profile.role === 'owner' || profile.role === 'admin') ? 'owner_admin' : (profile.role || 'beneficiary');

            const sessionUser = {
              id: profile.id,
              auth_user_id: authData.user.id,
              email: email,
              full_name: profile.full_name || 'مستخدم منصة جسور',
              role: verifiedRole,
              approval_status: profile.approval_status || 'approved'
            };

            window.jisrDB.setCurrentUser(sessionUser);
            return { user: authData.user, profile: sessionUser, error: null };
          }
        } catch (err) {
          console.warn('Live Supabase Auth encountered error:', err);
        }
      }

      // الوضع التجريبي الذكي (Demo Mode) في حال عدم توفر اتصال حي
      // الحسابات التجريبية القياسية للاختبار الفوري
      const demoAccounts = {
        'admin@jusoor.ye': { full_name: 'أ. عبد الله المدير (إدارة المنصة)', role: 'owner_admin', approval_status: 'approved', is_active: true },
        'owner@jusoor.ye': { full_name: 'أ. عبد الله المدير (إدارة المنصة)', role: 'owner_admin', approval_status: 'approved', is_active: true },
        'admin@jisr.sa': { full_name: 'أ. عبد الله المدير (إدارة المنصة)', role: 'owner_admin', approval_status: 'approved', is_active: true },
        'beneficiary@jisr.sa': { full_name: 'أحمد الهاشمي (مستفيد)', role: 'beneficiary', approval_status: 'approved', is_active: true },
        'specialist@jisr.sa': { full_name: 'د. خالد المعالج (أخصائي)', role: 'specialist', approval_status: 'approved', is_active: true },
        'supervisor@jisr.sa': { full_name: 'فيصل السبيعي (مشرف حركي)', role: 'motor_supervisor', approval_status: 'approved', is_active: true },
        'hospital@jisr.sa': { full_name: 'مستشفى التأهيل المتقدم', role: 'hospital_admin', approval_status: 'approved', is_active: true },
        'charity@jisr.sa': { full_name: 'جمعية رعاية وتأهيل ذوي الإعاقة', role: 'charity_admin', approval_status: 'approved', is_active: true },
        'pending@jisr.sa': { full_name: 'أخصائي تحت المراجعة', role: 'specialist', approval_status: 'pending', is_active: true },
        'rejected@jisr.sa': { full_name: 'طلب غير معتمد', role: 'specialist', approval_status: 'rejected', is_active: true }
      };

      const matched = demoAccounts[email];
      if (matched) {
        if (matched.approval_status === 'pending') {
          return {
            user: null,
            profile: null,
            error: {
              code: 'ACCOUNT_PENDING',
              message: 'حسابك قيد المراجعة والتدقيق من قِبل إدارة منصة جسور للتأهيل. سيصلك إشعار بالاعتماد فور اكتمال الإجراءات.'
            }
          };
        }
        if (matched.approval_status === 'rejected') {
          return {
            user: null,
            profile: null,
            error: {
              code: 'ACCOUNT_REJECTED',
              message: 'نعتذر، لم يتم اعتماد هذا الحساب. يرجى مراجعة إدارة المنصة أو التواصل مع الدعم الفني.'
            }
          };
        }

        const sessionUser = {
          id: 'demo-' + matched.role,
          auth_user_id: 'demo-' + matched.role,
          email: email,
          full_name: matched.full_name,
          role: matched.role,
          approval_status: matched.approval_status,
          is_active: matched.is_active !== false
        };

        window.jisrDB.setCurrentUser(sessionUser);
        return { user: { id: sessionUser.id, email }, profile: sessionUser, error: null };
      }

      // إذا أدخل المستخدم أي بريد عام في الوضع التجريبي
      if (password && password.length >= 4) {
        // افتراضياً مستفيد معتمد
        let autoRole = 'beneficiary';
        if (email.includes('admin') || email.includes('owner')) autoRole = 'owner_admin';
        else if (email.includes('specialist') || email.includes('doctor')) autoRole = 'specialist';
        else if (email.includes('supervisor')) autoRole = 'motor_supervisor';
        else if (email.includes('hospital')) autoRole = 'hospital_admin';
        else if (email.includes('charity')) autoRole = 'charity_admin';

        const sessionUser = {
          id: 'demo-user-' + Date.now(),
          auth_user_id: 'demo-user-' + Date.now(),
          email: email,
          full_name: email.split('@')[0],
          role: autoRole,
          approval_status: 'approved'
        };

        window.jisrDB.setCurrentUser(sessionUser);
        return { user: { id: sessionUser.id, email }, profile: sessionUser, error: null };
      }

      return {
        user: null,
        profile: null,
        error: { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' }
      };
    },

    // 2. فحص اشتراك الجمعية النشط وحساب الأيام المتبقية
    getCharityActiveSubscription: async function (charityId) {
      if (client) {
        try {
          // فحص عبر دالة SQL أولاً
          const { data: rpcData, error: rpcErr } = await client.rpc('get_charity_active_subscription', {
            p_charity_id: charityId || '00000000-0000-0000-0000-000000000000'
          });

          if (!rpcErr && rpcData && rpcData.length > 0) {
            const sub = rpcData[0];
            return {
              hasActiveSub: sub.remaining_days > 0 && sub.status === 'active',
              subscription: sub,
              remaining_days: Math.max(0, parseInt(sub.remaining_days, 10) || 0),
              max_beneficiaries: sub.max_beneficiaries || 10,
              used_beneficiaries: sub.used_beneficiaries || 0
            };
          }

          // فحص مباشر من جدول charity_subscriptions
          const { data: subs, error: subErr } = await client
            .from('charity_subscriptions')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1);

          if (!subErr && subs && subs.length > 0) {
            const s = subs[0];
            const now = new Date();
            const end = new Date(s.end_date);
            const diffDays = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));

            if (diffDays <= 0) {
              await client
                .from('charity_subscriptions')
                .update({ status: 'expired' })
                .eq('id', s.id);

              return {
                hasActiveSub: false,
                subscription: { ...s, status: 'expired' },
                remaining_days: 0,
                max_beneficiaries: s.max_beneficiaries || 10,
                used_beneficiaries: 0
              };
            }

            // حساب المستفيدين المسجلين
            const { count } = await client
              .from('beneficiary_details')
              .select('*', { count: 'exact', head: true })
              .eq('charity_subscription_id', s.id);

            return {
              hasActiveSub: true,
              subscription: s,
              remaining_days: diffDays,
              max_beneficiaries: s.max_beneficiaries || 10,
              used_beneficiaries: count || 0
            };
          }
        } catch (err) {
          console.warn('Error fetching charity subscription from Supabase:', err);
        }
      }

      // المحاكاة المحلية المخزنة في localStorage
      try {
        const localSubStr = localStorage.getItem('jisr_charity_sub');
        if (localSubStr) {
          const s = JSON.parse(localSubStr);
          const now = new Date();
          const end = new Date(s.end_date);
          const diffDays = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));

          const stagedCount = parseInt(localStorage.getItem('jisr_staged_beneficiaries_count') || '0', 10);

          if (diffDays <= 0 || s.status === 'expired') {
            return {
              hasActiveSub: false,
              subscription: { ...s, status: 'expired' },
              remaining_days: 0,
              max_beneficiaries: s.max_beneficiaries || 10,
              used_beneficiaries: stagedCount
            };
          }

          return {
            hasActiveSub: true,
            subscription: s,
            remaining_days: diffDays,
            max_beneficiaries: s.max_beneficiaries || 10,
            used_beneficiaries: stagedCount
          };
        }
      } catch (e) { }

      return {
        hasActiveSub: false,
        subscription: null,
        remaining_days: 0,
        max_beneficiaries: 10,
        used_beneficiaries: 0
      };
    },

    // 3. إنشاء اشتراك جمعية جديد وتسجيل الدفع
    createCharitySubscription: async function ({
      charity_id,
      package_id,
      max_beneficiaries,
      duration_months,
      amount_sar,
      payment_method
    }) {
      const now = new Date();
      const end = new Date(now);
      end.setMonth(end.getMonth() + parseInt(duration_months, 10));

      const invoiceNum = 'INV-CHARITY-' + Date.now().toString().slice(-6);

      const subPayload = {
        charity_id: charity_id || null,
        package_id: package_id || null,
        max_beneficiaries: parseInt(max_beneficiaries, 10) || 10,
        duration_months: parseInt(duration_months, 10) || 1,
        status: 'active',
        start_date: now.toISOString(),
        end_date: end.toISOString()
      };

      if (client) {
        try {
          // تسجيل الاشتراك
          const { data: subData, error: subErr } = await client
            .from('charity_subscriptions')
            .insert([subPayload])
            .select();

          if (subErr) {
            console.error('Error inserting charity_subscriptions:', subErr);
          }

          const createdSub = subData && subData[0] ? subData[0] : null;

          // تسجيل عملية الدفع
          await client.from('payments').insert([
            {
              payer_profile_id: charity_id || null,
              target_type: 'charity_package',
              reference_id: createdSub ? createdSub.id : null,
              amount_sar: amount_sar || 0,
              payment_method: payment_method || 'mada',
              invoice_number: invoiceNum,
              status: 'completed',
              paid_at: now.toISOString()
            }
          ]);

          // حفظ محلي أيضاً لضمان الاتساق
          localStorage.setItem('jisr_charity_sub', JSON.stringify({ ...subPayload, id: createdSub ? createdSub.id : 'sub-live' }));
          return { data: createdSub || subPayload, error: null };
        } catch (err) {
          console.warn('Network error in createCharitySubscription:', err);
        }
      }

      // محاكاة محلية
      const localSub = {
        id: 'sub-' + Date.now(),
        ...subPayload,
        created_at: now.toISOString()
      };
      localStorage.setItem('jisr_charity_sub', JSON.stringify(localSub));
      localStorage.setItem('jisr_staged_beneficiaries_count', '0');

      return { data: localSub, error: null };
    },

    // 4. التحقق من كود تفعيل الجمعية وتطبيقه للمستفيد
    validateAndApplyActivationCode: async function (codeStr, beneficiaryId) {
      codeStr = (codeStr || '').trim().toUpperCase();

      if (client) {
        try {
          // جلب الكود من جدول activation_codes
          const { data: codeRec, error: codeErr } = await client
            .from('activation_codes')
            .select('*')
            .eq('code', codeStr)
            .eq('is_used', false)
            .maybeSingle();

          if (codeErr || !codeRec) {
            return {
              success: false,
              message: 'رمز التفعيل غير صالح، أو قد تم استخدامه مسبقاً.'
            };
          }

          const now = new Date().toISOString();

          // تحديث الكود ليصبح مستخدماً
          await client
            .from('activation_codes')
            .update({
              is_used: true,
              used_by_beneficiary_id: beneficiaryId || null,
              used_at: now
            })
            .eq('id', codeRec.id);

          // ربط المستفيد باشتراك الجمعية
          if (codeRec.charity_subscription_id && beneficiaryId) {
            await client
              .from('beneficiary_details')
              .update({ charity_subscription_id: codeRec.charity_subscription_id })
              .eq('profile_id', beneficiaryId);
          }

          // تفعيل خطة التأهيل للمستفيد
          if (beneficiaryId) {
            await client
              .from('rehab_plans')
              .update({ status: 'active', updated_at: now })
              .eq('beneficiary_id', beneficiaryId);
          }

          // تسجيل اشتراك المستفيد
          await client.from('beneficiary_subscriptions').insert([
            {
              beneficiary_id: beneficiaryId || null,
              status: 'active',
              amount_sar: 0,
              activation_code_id: codeRec.id,
              start_date: now
            }
          ]);

          localStorage.setItem('jisr_plan_unlocked_' + (beneficiaryId || 'current'), 'true');

          return {
            success: true,
            message: 'تم تفعيل خطتك التأهيلية بنجاح عبر كود الرعاية المجتمعية!'
          };
        } catch (err) {
          console.warn('Error in validateAndApplyActivationCode:', err);
        }
      }

      // محاكاة محلية ذكية للأكواد التجريبية (مثل JISR2026 أو SANAD-10 أو CHARITY-VIP)
      const validDemoCodes = ['JISR2026', 'SANAD-10', 'CHARITY-VIP', 'TAMKEEN-2026', 'GIFT-CARE'];
      const usedCodes = JSON.parse(localStorage.getItem('jisr_used_codes') || '[]');

      if (usedCodes.includes(codeStr)) {
        return {
          success: false,
          message: 'رمز التفعيل هذا تم استخدامه مسبقاً.'
        };
      }

      if (validDemoCodes.includes(codeStr) || codeStr.startsWith('SANAD-') || codeStr.startsWith('JISR-')) {
        usedCodes.push(codeStr);
        localStorage.setItem('jisr_used_codes', JSON.stringify(usedCodes));
        localStorage.setItem('jisr_plan_unlocked_' + (beneficiaryId || 'current'), 'true');
        return {
          success: true,
          message: 'تم تفعيل خطتك التأهيلية بنجاح عبر كود الرعاية المجتمعية!'
        };
      }

      return {
        success: false,
        message: 'رمز التفعيل غير صالح، يرجى التأكد من كتابة الرمز بدقة.'
      };
    },

    // 5. دفع المستفيد للخطة التأهيلية إلكترونياً
    payBeneficiaryPlan: async function ({ beneficiaryId, planId, amount_sar, payment_method }) {
      const now = new Date();
      const end = new Date(now);
      end.setMonth(end.getMonth() + 1);

      const invoiceNum = 'INV-BENEFICIARY-' + Date.now().toString().slice(-6);

      if (client) {
        try {
          // تسجيل الدفع
          await client.from('payments').insert([
            {
              payer_profile_id: beneficiaryId || null,
              target_type: 'beneficiary_plan',
              reference_id: planId || null,
              amount_sar: amount_sar || 150,
              payment_method: payment_method || 'mada',
              invoice_number: invoiceNum,
              status: 'completed',
              paid_at: now.toISOString()
            }
          ]);

          // تسجيل اشتراك المستفيد
          await client.from('beneficiary_subscriptions').insert([
            {
              beneficiary_id: beneficiaryId || null,
              plan_id: planId || null,
              status: 'active',
              amount_sar: amount_sar || 150,
              start_date: now.toISOString(),
              end_date: end.toISOString()
            }
          ]);

          // تحديث حالة الخطة إلى active
          if (beneficiaryId) {
            await client
              .from('rehab_plans')
              .update({ status: 'active', updated_at: now.toISOString() })
              .eq('beneficiary_id', beneficiaryId);
          }

          localStorage.setItem('jisr_plan_unlocked_' + (beneficiaryId || 'current'), 'true');
          return { success: true, invoice_number: invoiceNum };
        } catch (err) {
          console.warn('Error in payBeneficiaryPlan:', err);
        }
      }

      // محاكاة محلية
      localStorage.setItem('jisr_plan_unlocked_' + (beneficiaryId || 'current'), 'true');
      return { success: true, invoice_number: invoiceNum };
    },

    // 6. فحص حالة قفل خطة المستفيد (Paywall Check)
    getBeneficiaryPlanStatus: async function (beneficiaryId) {
      // فحص الفتح المحلي السريع
      if (localStorage.getItem('jisr_plan_unlocked_' + (beneficiaryId || 'current')) === 'true') {
        return { status: 'active', is_locked: false };
      }

      if (client && beneficiaryId) {
        try {
          const { data, error } = await client
            .from('rehab_plans')
            .select('status')
            .eq('beneficiary_id', beneficiaryId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!error && data) {
            const isLocked = data.status === 'awaiting_payment' || data.status === 'pending_payment';
            return { status: data.status, is_locked: isLocked };
          }
        } catch (e) {
          console.warn(e);
        }
      }

      // في الوضع الافتراضي الجديد: بعد إعداد الملخص تكون الخطة awaiting_payment
      const simulatedStatus = localStorage.getItem('jisr_simulated_plan_status') || 'awaiting_payment';
      return {
        status: simulatedStatus,
        is_locked: simulatedStatus === 'awaiting_payment'
      };
    },

    // 7. تقديم طلب انضمام واعتماد شريك (partner_applications)
    submitPartnerApplication: async function (appData) {
      let reqRole = (appData.requested_role || 'specialist').toLowerCase().trim();
      if (reqRole === 'charity' || reqRole === 'charities') reqRole = 'charity_admin';
      if (reqRole === 'hospital' || reqRole === 'hospitals') reqRole = 'hospital_admin';
      if (reqRole === 'pharmacy' || reqRole === 'pharmacies') reqRole = 'pharmacy_partner';
      if (reqRole === 'device_center' || reqRole === 'device_centers') reqRole = 'device_center_partner';
      if (reqRole === 'supervisor' || reqRole === 'supervisors') reqRole = 'motor_supervisor';

      const payload = {
        applicant_name: appData.applicant_name,
        requested_role: reqRole,
        license_number: appData.license_number || null,
        phone: appData.phone,
        email: appData.email || null,
        city: appData.city || 'صنعاء',
        notes: appData.notes || '',
        documents_url: appData.documents_url || null,
        status: 'pending'
      };

      if (client) {
        try {
          const { data, error } = await client
            .from('partner_applications')
            .insert([payload])
            .select();
          if (error) {
            console.error('Supabase partner_applications error:', error);
            return { data: null, error };
          }
          return { data, error: null };
        } catch (err) {
          console.warn('Network error during partner application submission:', err);
          return { data: [payload], error: null };
        }
      }

      try {
        const localApps = JSON.parse(localStorage.getItem('jisr_partner_applications') || '[]');
        localApps.push({ ...payload, id: 'demo-' + Date.now(), created_at: new Date().toISOString() });
        localStorage.setItem('jisr_partner_applications', JSON.stringify(localApps));
      } catch (e) { }

      return { data: [payload], error: null };
    },

    // 8. إرسال رسالة تواصل واستفسار (contact_messages)
    submitContactMessage: async function (msgData) {
      const payload = {
        full_name: msgData.full_name,
        contact_info: msgData.contact_info,
        inquiry_type: msgData.inquiry_type || 'general',
        message: msgData.message,
        status: 'new'
      };

      if (client) {
        try {
          const { data, error } = await client
            .from('contact_messages')
            .insert([payload])
            .select();
          if (error) {
            console.error('Supabase contact_messages error:', error);
            return { data: null, error };
          }
          return { data, error: null };
        } catch (err) {
          console.warn('Network error during contact message submission:', err);
          return { data: [payload], error: null };
        }
      }

      try {
        const localMsgs = JSON.parse(localStorage.getItem('jisr_contact_messages') || '[]');
        localMsgs.push({ ...payload, id: 'demo-' + Date.now(), created_at: new Date().toISOString() });
        localStorage.setItem('jisr_contact_messages', JSON.stringify(localMsgs));
      } catch (e) { }

      return { data: [payload], error: null };
    },

    // 9. حفظ بيانات الملف الشخصي (profiles)
    saveUserProfile: async function (profileData) {
      if (client) {
        try {
          const { data, error } = await client
            .from('profiles')
            .upsert([profileData])
            .select();
          if (error) console.error('Supabase profile error:', error);
          return { data, error };
        } catch (e) {
          console.warn(e);
        }
      }
      return { data: profileData, error: null };
    },

    // 10. حجز المواعيد (appointments)
    bookAppointment: async function (appointmentData) {
      if (client) {
        try {
          const { data, error } = await client
            .from('appointments')
            .insert([appointmentData])
            .select();
          if (error) console.error('Supabase appointment error:', error);
          return { data, error };
        } catch (e) {
          console.warn(e);
        }
      }
      return { data: appointmentData, error: null };
    },

    // 11. حفظ التقييم الوظيفي (assessments)
    saveAssessment: async function (assessmentData) {
      if (client) {
        try {
          const { data, error } = await client
            .from('assessments')
            .insert([assessmentData])
            .select();
          if (error) console.error('Supabase assessment error:', error);
          return { data, error };
        } catch (e) {
          console.warn(e);
        }
      }
      return { data: assessmentData, error: null };
    },

    // 12. جلب باقات الاشتراكات (subscription_packages)
    getSubscriptionPackages: async function () {
      if (client) {
        try {
          const { data, error } = await client
            .from('subscription_packages')
            .select('*')
            .eq('is_active', true)
            .order('price_sar', { ascending: true });
          if (!error && data && data.length) return data;
        } catch (e) {
          console.warn(e);
        }
      }
      return [
        { id: '1', name: 'باقة 10 مستفيدين (شهر واحد)', max_beneficiaries: 10, duration_months: 1, price_sar: 1000 },
        { id: '2', name: 'باقة 20 مستفيد (3 أشهر)', max_beneficiaries: 20, duration_months: 3, price_sar: 5000 },
        { id: '3', name: 'باقة 30 مستفيد (6 أشهر)', max_beneficiaries: 30, duration_months: 6, price_sar: 12000 }
      ];
    },

    // =========================================================================
    // 14. الإعدادات الإقليمية لليمن، الدولار الأمريكي ($)، وسوق الأجهزة والشركاء
    // =========================================================================

    defaultRegion: {
      country: 'اليمن',
      currency: 'USD',
      currencySymbol: '$',
      phoneCode: '+967',
      cities: ['صنعاء', 'عدن', 'المكلا', 'تعز', 'إب', 'الحديدة', 'سيئون', 'مأرب']
    },

    // 1. الصيدليات الشريكة (مستلزمات وجبائر طبية بخصومات حصرية للمشتركين)
    _getInitialPharmacies: function () {
      return [
        {
          id: 'pharma-1',
          name: 'صيدلية الشفاء التخصصية',
          city: 'صنعاء',
          address: 'شارع التحرير، أمام مجمع العيادات التخصصية، صنعاء',
          phone: '+967 771234567',
          bio: 'صيدلية معتمدة توفر كافة أصناف الأدوية التأهيلية، الجبائر الطبية المعتمدة، مستلزمات رعاية طريحي الفراش، والأربطة الضاغطة بأعلى معايير الجودة والتخزين الطبي.',
          discount_percentage: 15,
          discount_summary: 'خصم 15% على الجبائر والمستلزمات الطبية',
          discount_code: 'JUSOOR-PHARMA-15',
          is_subscribed: true
        },
        {
          id: 'pharma-2',
          name: 'صيدلية البرج الحديثة',
          city: 'عدن',
          address: 'شارع أروى، بجوار مستشفى الشعب، كريتر، عدن',
          phone: '+967 733456789',
          bio: 'توفر مستلزمات التأهيل الحركي، الضمادات العلاجية المتقدمة، مساند الرقبة والظهر، مع خدمة التوصيل السريع لجميع مديريات عدن.',
          discount_percentage: 15,
          discount_summary: 'خصم 15% على مستلزمات التأهيل والأربطة',
          discount_code: 'JUSOOR-ADEN-15',
          is_subscribed: true
        },
        {
          id: 'pharma-3',
          name: 'صيدلية السلام الطبية الكبرى',
          city: 'المكلا',
          address: 'الشارع العام، حي الشرج، المكلا، حضرموت',
          phone: '+967 711987654',
          bio: 'مركز دوائي متكامل يوفر أحدث المستلزمات الطبية التعويضية وأجهزة قياس الضغط والسكري وأدوية الأعصاب والتأهيل مع استشارات صيدلانية متخصصة.',
          discount_percentage: 20,
          discount_summary: 'خصم 20% على الأدوية والمستلزمات التأهيلية',
          discount_code: 'JUSOOR-MUKALLA-20',
          is_subscribed: true
        }
      ];
    },

    // 2. مراكز وشركات بيع وصيانة الأجهزة الطبية والمساعدة
    _getInitialDeviceCenters: function () {
      return [
        {
          id: 'devcenter-1',
          name: 'مركز اليمن للأجهزة التعويضية والأطراف والمشايات',
          city: 'صنعاء',
          address: 'شارع الزبيري، تقاطع حدة، صنعاء',
          phone: '+967 775551122',
          bio: 'مركز رائد متخصص في تصنيع واستيراد وصيانة الكراسي المتحركة الكهربائية واليدوية، المشايات الهيدروليكية، والجبائر التقويمية الذكية مع ورشة صيانة متطورة.',
          discount_percentage: 20,
          discount_summary: 'خصم 20% على الكراسي المتحركة والأجهزة التعويضية',
          discount_code: 'JUSOOR-DEV-20',
          is_subscribed: true
        },
        {
          id: 'devcenter-2',
          name: 'شركة المستقبل للمستلزمات والأجهزة الطبية',
          city: 'عدن',
          address: 'الشارع الرئيسي، المنصورة، عدن',
          phone: '+967 735002233',
          bio: 'وكلاء كبرى الشركات العالمية للأجهزة المساعدة، أسرة التأهيل الطبي الكهربائية، وأجهزة تحفيز المشي والعلاج الفيزيائي مع ضمان شامل وخدمة ما بعد البيع.',
          discount_percentage: 18,
          discount_summary: 'خصم 18% على أسرة وتجهيزات التأهيل المنزلي',
          discount_code: 'JUSOOR-MED-18',
          is_subscribed: true
        },
        {
          id: 'devcenter-3',
          name: 'مركز الساحل للأطراف الصناعية والأجهزة التقويمية',
          city: 'المكلا',
          address: 'منطقة فوه، قرب المستشفى الجامعي، المكلا',
          phone: '+967 712334455',
          bio: 'متخصصون في الأطراف الصناعية الذكية، مساند الحركة للأطفال وكبار السن، وتوفير قطع الغيار الأصلية وصيانة أجهزة المشي المنزلية.',
          discount_percentage: 25,
          discount_summary: 'خصم 25% مع خدمات الصيانة الدورية المجانية',
          discount_code: 'JUSOOR-COAST-25',
          is_subscribed: true
        }
      ];
    },

    // 3. عروض سوق وبنك الأجهزة المساعدة الافتراضية
    _getInitialDevices: function () {
      return [
        {
          id: 'dev-101',
          title: 'كرسي متحرك كهربائي ألماني فائق الخفة قابل للطي',
          category: 'mobility',
          category_label: 'كراسي متحركة',
          listing_type: 'for_sale',
          listing_label: 'بيع لتحقيق ربح',
          condition: 'new',
          condition_label: 'جديد بالكرتون',
          price_usd: 320.00,
          currency: 'USD',
          city: 'صنعاء',
          seller_name: 'مركز اليمن للأجهزة التعويضية',
          seller_type: 'device_center',
          contact_phone: '+967 775551122',
          image_url: 'assets/images/devices/wheelchair-electric.svg',
          description: 'محرك مزدوج قوي ببطارية ليثيوم تدوم حتى 25 كم، هيكل ألومنيوم مقاوم للصدمات، خفيف الوزن وسهل الحمل في صندوق السيارة، مع وحدة تحكم ذكية 360 درجة.',
          status: 'available'
        },
        {
          id: 'dev-102',
          title: 'مشاية هيدروليكية ذات 4 عجلات ومكابح يد ومقعد استراحة',
          category: 'walking_aids',
          category_label: 'عكازات ومشايات',
          listing_type: 'for_sale',
          listing_label: 'بيع لتحقيق ربح',
          condition: 'new',
          condition_label: 'جديد بالكرتون',
          price_usd: 85.00,
          currency: 'USD',
          city: 'عدن',
          seller_name: 'شركة المستقبل للمستلزمات الطبية',
          seller_type: 'device_center',
          contact_phone: '+967 735002233',
          image_url: 'assets/images/devices/walker-rollator.svg',
          description: 'مشاية متطورة لكبار السن ومصابي الحوادث، مزودة بمقابض مبطنة مريحة، سلة تخزين للمتعلقات الشخصية، ومقعد استراحة متين يدعم حتى وزن 130 كجم.',
          status: 'available'
        },
        {
          id: 'dev-103',
          title: 'كرسي متحرك يدوي خفيف الوزن قابل للطي',
          category: 'mobility',
          category_label: 'كراسي متحركة',
          listing_type: 'refurbished',
          listing_label: 'مجدد بحالة ممتازة',
          condition: 'refurbished',
          condition_label: 'مجدد سريرياً',
          price_usd: 110.00,
          currency: 'USD',
          city: 'المكلا',
          seller_name: 'جمعية حضرموت للتأهيل الحركي',
          seller_type: 'charity',
          contact_phone: '+967 711987654',
          image_url: 'assets/images/devices/wheelchair-manual.svg',
          description: 'تم تجديده بالكامل وفحص العجلات والفرامل والمحاور من قِبل فنيين مختصين، بحالة شبه جديدة ومناسب للاستخدام المنزلي والخارجي.',
          status: 'available'
        },
        {
          id: 'dev-104',
          title: 'عكازات كوع طبية كندية ألومنيوم (زوج متكامل)',
          category: 'walking_aids',
          category_label: 'عكازات ومشايات',
          listing_type: 'donation',
          listing_label: 'تبرع مجاني',
          condition: 'used_good',
          condition_label: 'مستعمل بحالة ممتازة',
          price_usd: 0.00,
          currency: 'USD',
          city: 'تعز',
          seller_name: 'فاعل خير ومستفيد متعافٍ',
          seller_type: 'subscriber',
          contact_phone: '+967 773344556',
          image_url: 'assets/images/devices/crutches.svg',
          description: 'مقدمة كإهداء وتبرع مجاني لوجه الله للمحتاجين وذوي الدخل المحدود في مدينة تعز، قابلة لتعديل الطول بدقة وثابتة جداً.',
          status: 'available'
        },
        {
          id: 'dev-105',
          title: 'جهاز تحفيز عضلي كهربائي ومساج نبضي TENS/EMS',
          category: 'rehabilitation',
          category_label: 'أجهزة تنفس وتأهيل',
          listing_type: 'for_sale',
          listing_label: 'بيع لتحقيق ربح',
          condition: 'new',
          condition_label: 'جديد بالكرتون',
          price_usd: 65.00,
          currency: 'USD',
          city: 'صنعاء',
          seller_name: 'صيدلية الشفاء التخصصية',
          seller_type: 'pharmacy',
          contact_phone: '+967 771234567',
          image_url: 'assets/images/devices/tens-stimulator.svg',
          description: 'جهاز رقمي بـ 16 برنامج علاجي لتنشيط العضلات المتيبسة وتخفيف آلام الظهر والمفاصل بعد العمليات الجراحية والجلطات.',
          status: 'available'
        },
        {
          id: 'dev-106',
          title: 'وسادة مقعد هوائية متطورة لمنع تقرحات الجلوس الطويل',
          category: 'accessories',
          category_label: 'مستلزمات وجبائر',
          listing_type: 'for_sale',
          listing_label: 'بيع لتحقيق ربح',
          condition: 'new',
          condition_label: 'جديد بالكرتون',
          price_usd: 35.00,
          currency: 'USD',
          city: 'إب',
          seller_name: 'أحمد الحبيشي (مشترك بالمنصة)',
          seller_type: 'subscriber',
          contact_phone: '+967 778899001',
          image_url: 'assets/images/devices/air-cushion.svg',
          description: 'خلايا هوائية مترابطة توزع ضغط الجسم بنعومة للوقاية التامة من قرح الفراش، مزودة بمضخة يدوية سريعة وغطاء قماشي قابل للغسيل.',
          status: 'available'
        }
      ];
    },

    // 4. استدعاء دليل الشركاء العام (الأقسام الستة المنفصلة)
    getPublicPartnersDirectory: async function () {
      const result = {
        hospitals: [],
        specialists: [],
        supervisors: [],
        charities: [],
        pharmacies: [],
        device_centers: []
      };

      if (!client) {
        return result;
      }

      try {
        // 1. Fetch approved partner applications from Supabase
        let approvedApps = [];
        try {
          const { data: apps } = await client
            .from('partner_applications')
            .select('*')
            .eq('status', 'approved');
          if (Array.isArray(apps)) approvedApps = apps;
        } catch (e) {}

        // 2. Hospitals: from hospitals_centers (verified/subscribed) + approved hospital applications
        try {
          const { data: hosps } = await client
            .from('hospitals_centers')
            .select('*')
            .or('is_verified.eq.true,is_subscribed.eq.true')
            .order('name');
          const hospList = Array.isArray(hosps) ? [...hosps] : [];

          approvedApps.forEach(a => {
            const role = (a.requested_role || '').toLowerCase();
            if (role === 'hospital_admin' || role === 'hospital' || role === 'hospitals') {
              if (!hospList.some(h => (h.name && a.applicant_name && h.name.trim().toLowerCase() === a.applicant_name.trim().toLowerCase()) || (a.license_number && h.license_number === a.license_number))) {
                hospList.push({
                  id: a.id,
                  name: a.applicant_name,
                  city: a.city || 'صنعاء',
                  address: a.notes || a.city || 'المركز الرئيسي للمنشأة',
                  phone: a.phone,
                  rating: 5.0,
                  is_verified: true,
                  is_subscribed: true
                });
              }
            }
          });
          result.hospitals = hospList;
        } catch (e) {}

        // 3. Charities: from charities (is_active = true) + approved charity applications
        try {
          const { data: chars } = await client
            .from('charities')
            .select('*')
            .eq('is_active', true)
            .order('name');
          const charList = Array.isArray(chars) ? [...chars] : [];

          approvedApps.forEach(a => {
            const role = (a.requested_role || '').toLowerCase();
            if (role === 'charity_admin' || role === 'charity' || role === 'charities') {
              if (!charList.some(c => (c.name && a.applicant_name && c.name.trim().toLowerCase() === a.applicant_name.trim().toLowerCase()) || (a.license_number && c.license_number === a.license_number))) {
                charList.push({
                  id: a.id,
                  name: a.applicant_name,
                  contact_person: a.applicant_name,
                  city: a.city || 'صنعاء',
                  phone: a.phone,
                  license_number: a.license_number || 'معتمد رسمياً',
                  is_active: true
                });
              }
            }
          });
          result.charities = charList;
        } catch (e) {}

        // 4. Pharmacies: from partner_pharmacies (verified/subscribed) + approved pharmacy applications
        try {
          const { data: pharms } = await client
            .from('partner_pharmacies')
            .select('*')
            .or('is_verified.eq.true,is_subscribed.eq.true')
            .order('name');
          const pharmList = Array.isArray(pharms) ? [...pharms] : [];

          approvedApps.forEach(a => {
            const role = (a.requested_role || '').toLowerCase();
            if (role === 'pharmacy_partner' || role === 'pharmacy' || role === 'pharmacies') {
              if (!pharmList.some(p => p.name && a.applicant_name && p.name.trim().toLowerCase() === a.applicant_name.trim().toLowerCase())) {
                pharmList.push({
                  id: a.id,
                  name: a.applicant_name,
                  city: a.city || 'صنعاء',
                  address: a.notes || a.city || 'شارع رئيسي',
                  phone: a.phone,
                  discount_percentage: 15,
                  discount_summary: 'خصم 15% على الجبائر والمستلزمات الطبية',
                  is_verified: true,
                  is_subscribed: true
                });
              }
            }
          });
          result.pharmacies = pharmList;
        } catch (e) {}

        // 5. Device Centers: from partner_device_centers (verified/subscribed) + approved applications
        try {
          const { data: devs } = await client
            .from('partner_device_centers')
            .select('*')
            .or('is_verified.eq.true,is_subscribed.eq.true')
            .order('name');
          const devList = Array.isArray(devs) ? [...devs] : [];

          approvedApps.forEach(a => {
            const role = (a.requested_role || '').toLowerCase();
            if (role === 'device_center_partner' || role === 'device_center' || role === 'device_centers') {
              if (!devList.some(d => d.name && a.applicant_name && d.name.trim().toLowerCase() === a.applicant_name.trim().toLowerCase())) {
                devList.push({
                  id: a.id,
                  name: a.applicant_name,
                  city: a.city || 'صنعاء',
                  address: a.notes || a.city || 'شارع رئيسي',
                  phone: a.phone,
                  discount_percentage: 20,
                  discount_summary: 'خصم 20% على كراسي الحركة ومستلزمات التأهيل',
                  is_verified: true,
                  is_subscribed: true
                });
              }
            }
          });
          result.device_centers = devList;
        } catch (e) {}

        // 6. Specialists: from profiles (role='specialist', active/approved) + approved applications
        try {
          const { data: specs } = await client
            .from('profiles')
            .select('id, full_name, city, bio, phone, is_active, approval_status')
            .eq('role', 'specialist')
            .or('approval_status.eq.approved,is_active.eq.true');
          const specList = (specs || []).map(p => ({
            id: p.id,
            name: p.full_name,
            specialty: 'أخصائي علاج طبيعي وتأهيل',
            city: p.city || 'صنعاء',
            experience_years: 5,
            bio: p.bio || 'أخصائي معتمد لدى شبكة جسور للتأهيل'
          }));

          approvedApps.forEach(a => {
            const role = (a.requested_role || '').toLowerCase();
            if (role === 'specialist' || role === 'specialists') {
              if (!specList.some(s => s.name && a.applicant_name && s.name.trim().toLowerCase() === a.applicant_name.trim().toLowerCase())) {
                specList.push({
                  id: a.id,
                  name: a.applicant_name,
                  specialty: 'أخصائي علاج طبيعي وتأهيل',
                  city: a.city || 'صنعاء',
                  experience_years: 5,
                  bio: a.notes || 'أخصائي معتمد تم التحقق من ترخيصه المهني'
                });
              }
            }
          });
          result.specialists = specList;
        } catch (e) {}

        // 7. Supervisors: from profiles (role='motor_supervisor') + approved applications
        try {
          const { data: sups } = await client
            .from('profiles')
            .select('id, full_name, city, bio, phone, is_active, approval_status')
            .eq('role', 'motor_supervisor')
            .or('approval_status.eq.approved,is_active.eq.true');
          const supList = (sups || []).map(p => ({
            id: p.id,
            name: p.full_name,
            role: 'مشرف حركي ميداني',
            city: p.city || 'صنعاء',
            phone: p.phone,
            bio: p.bio || 'متابعة ميدانية وزيارات منزلية دورية للمستفيدين'
          }));

          approvedApps.forEach(a => {
            const role = (a.requested_role || '').toLowerCase();
            if (role === 'motor_supervisor' || role === 'supervisor' || role === 'supervisors') {
              if (!supList.some(s => s.name && a.applicant_name && s.name.trim().toLowerCase() === a.applicant_name.trim().toLowerCase())) {
                supList.push({
                  id: a.id,
                  name: a.applicant_name,
                  role: 'مشرف حركي ميداني معتمد',
                  city: a.city || 'صنعاء',
                  phone: a.phone,
                  bio: a.notes || 'مشرف حركي معتمد للمتابعة الميدانية والمنزلية'
                });
              }
            }
          });
          result.supervisors = supList;
        } catch (e) {}

        return result;
      } catch (err) {
        console.warn('getPublicPartnersDirectory error:', err);
        return result;
      }
    },

    // 5. جلب عروض سوق الأجهزة المساعدة
    fetchAssistiveDevices: async function (filters) {
      filters = filters || {};
      let devices = [];
      try {
        const stored = localStorage.getItem('jisr_assistive_devices');
        if (stored && !stored.includes('unsplash.com')) {
          devices = JSON.parse(stored);
        } else {
          devices = this._getInitialDevices();
          localStorage.setItem('jisr_assistive_devices', JSON.stringify(devices));
        }
      } catch (e) {
        devices = this._getInitialDevices();
      }

      let result = [...devices];

      if (filters.category && filters.category !== 'all') {
        result = result.filter(d => d.category === filters.category);
      }

      if (filters.listing_type && filters.listing_type !== 'all') {
        result = result.filter(d => d.listing_type === filters.listing_type);
      }

      if (filters.city && filters.city !== 'all') {
        result = result.filter(d => d.city === filters.city);
      }

      if (filters.query) {
        const q = filters.query.toLowerCase();
        result = result.filter(d => 
          (d.title && d.title.toLowerCase().includes(q)) ||
          (d.description && d.description.toLowerCase().includes(q)) ||
          (d.city && d.city.toLowerCase().includes(q))
        );
      }

      return result.filter(d => d.status === 'available');
    },

    // 6. شراء / طلب جهاز مساعد (متاح للجميع: زوار ومشتركون)
    submitDevicePurchaseOrder: async function (orderPayload) {
      const year = new Date().getFullYear();
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const orderRef = 'DEV-ORD-' + year + '-' + randNum;

      const orderRecord = {
        id: 'ord-' + Date.now(),
        order_reference: orderRef,
        device_id: orderPayload.device_id,
        device_title: orderPayload.device_title,
        buyer_name: orderPayload.buyer_name,
        buyer_phone: orderPayload.buyer_phone,
        buyer_email: orderPayload.buyer_email || '',
        buyer_city: orderPayload.buyer_city || 'صنعاء',
        buyer_address: orderPayload.buyer_address,
        notes: orderPayload.notes || '',
        total_price_usd: Number(orderPayload.total_price_usd) || 0.00,
        currency: 'USD',
        payment_method: orderPayload.payment_method || 'cash_on_delivery',
        status: 'pending',
        created_at: new Date().toISOString()
      };

      try {
        const stored = JSON.parse(localStorage.getItem('jisr_device_orders') || '[]');
        stored.unshift(orderRecord);
        localStorage.setItem('jisr_device_orders', JSON.stringify(stored));
      } catch (e) {}

      if (client) {
        try {
          await client.from('device_purchase_orders').insert([orderRecord]);
        } catch (e) {}
      }

      return { success: true, order: orderRecord };
    },

    // 7. التحقق من صلاحية رفع الأجهزة (حصري للمشتركين فقط وممنوع للزوار)
    canUserUploadDevice: async function () {
      const user = this.getCurrentUser();
      if (!user) return false;

      if (client) {
        try {
          const { data, error } = await client.rpc('can_user_upload_device', { p_user_id: user.id });
          if (!error && typeof data === 'boolean') return data;
        } catch (e) {}
      }

      // تحقق محلي من الجلسة
      if (user && user.role && ['beneficiary', 'hospital_admin', 'charity_admin', 'specialist'].includes(user.role)) {
        return true;
      }
      return false;
    },

    // 8. رفع وعرض جهاز جديد للبيع أو الربح أو التبرع (للمشتركين فقط)
    submitDeviceListing: async function (deviceData) {
      const canUpload = await this.canUserUploadDevice();
      if (!canUpload) {
        return { success: false, error: 'عذراً، رفع الأجهزة مقتصر على المشتركين والمؤسسات الشريكة في المنصة.' };
      }

      const user = this.getCurrentUser() || {};
      const newListing = {
        id: 'dev-' + Date.now(),
        title: deviceData.title,
        category: deviceData.category || 'mobility',
        category_label: deviceData.category_label || 'أجهزة مساعدة',
        listing_type: deviceData.listing_type || 'for_sale',
        listing_label: deviceData.listing_type === 'donation' ? 'تبرع مجاني' : deviceData.listing_type === 'refurbished' ? 'مجدد' : 'بيع لتحقيق ربح',
        condition: deviceData.condition || 'new',
        condition_label: deviceData.condition === 'new' ? 'جديد بالكرتون' : 'مستعمل بحالة ممتازة',
        price_usd: deviceData.listing_type === 'donation' ? 0.00 : (Number(deviceData.price_usd) || 0.00),
        currency: 'USD',
        city: deviceData.city || 'صنعاء',
        seller_name: user.full_name || deviceData.seller_name || 'مشترك معتمد',
        seller_type: user.role || 'subscriber',
        contact_phone: deviceData.contact_phone || user.phone || '+967 770000000',
        image_url: deviceData.image_url || 'assets/images/devices/wheelchair-electric.svg',
        description: deviceData.description || '',
        status: 'available',
        created_at: new Date().toISOString()
      };

      try {
        let devices = JSON.parse(localStorage.getItem('jisr_assistive_devices') || '[]');
        if (devices.length === 0) devices = this._getInitialDevices();
        devices.unshift(newListing);
        localStorage.setItem('jisr_assistive_devices', JSON.stringify(devices));
        window.dispatchEvent(new CustomEvent('jisr:devices_updated', { detail: devices }));
      } catch (e) {}

      if (client) {
        try {
          await client.from('assistive_devices_listings').insert([newListing]);
        } catch (e) {}
      }

      return { success: true, listing: newListing };
    },

    // 9. جلب باقات الخصم الحصرية للمستفيد المشترك فقط
    getMySubscriberDiscounts: async function () {
      const user = this.getCurrentUser();
      const isSubscribed = Boolean(user && user.role === 'beneficiary');

      const discounts = [
        {
          type: 'pharmacy',
          title: 'صيدلية الشفاء التخصصية (صنعاء)',
          discount_summary: 'خصم 15% على الجبائر والمستلزمات الطبية',
          discount_code: 'JUSOOR-PHARMA-15',
          percentage: 15,
          city: 'صنعاء - شارع التحرير',
          details: 'يشمل الجبائر المعتمدة، الأربطة الضاغطة، ومستلزمات رعاية طريحي الفراش.'
        },
        {
          type: 'pharmacy',
          title: 'صيدلية البرج الحديثة (عدن)',
          discount_summary: 'خصم 15% على مستلزمات التأهيل والأربطة',
          discount_code: 'JUSOOR-ADEN-15',
          percentage: 15,
          city: 'عدن - كريتر، شارع أروى',
          details: 'خصم فوري عند إبراز الكود لموظف الصيدلية لمستفيدي جسور للتأهيل.'
        },
        {
          type: 'device_center',
          title: 'مركز اليمن للأجهزة التعويضية (صنعاء)',
          discount_summary: 'خصم 20% على الكراسي المتحركة والأطراف',
          discount_code: 'JUSOOR-DEV-20',
          percentage: 20,
          city: 'صنعاء - شارع الزبيري',
          details: 'خصم حصري على الكراسي الكهربائية، المشايات، وقطع الغيار والصيانة.'
        },
        {
          type: 'device_center',
          title: 'شركة المستقبل للمستلزمات الطبية (عدن)',
          discount_summary: 'خصم 18% على أسرة التأهيل الطبي',
          discount_code: 'JUSOOR-MED-18',
          percentage: 18,
          city: 'عدن - المنصورة',
          details: 'تخفيض خاص لمشتركي المنصة على التجهيزات والمعدات المنزلية.'
        }
      ];

      return {
        eligible: isSubscribed,
        discounts: discounts
      };
    },

    // =========================================================================
    // SECTION 30: OWNER ADMIN DASHBOARD METHODS & MOCK STORE
    // =========================================================================

    _getInitialPartnerApplications: function () {
      return [
        {
          id: 'app-001',
          applicant_name: 'مستشفى السلام التخصصي للتأهيل',
          requested_role: 'hospital_admin',
          requested_role_label: 'مستشفى أو مركز تأهيلي',
          license_number: 'YEM-HOSP-2024-89',
          city: 'صنعاء',
          phone: '+967 771234501',
          email: 'salam.hospital@gmail.com',
          bio: 'مستشفى خاص مجهز بأقسام علاج طبيعي، أجهزة روبوتية لإعادة التأهيل الحركي، وكادر استشاري مرخص.',
          status: 'pending',
          created_at: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: 'app-002',
          applicant_name: 'د. ياسمين نبيل الشيباني',
          requested_role: 'specialist',
          requested_role_label: 'أخصائي علاج طبيعي / وظيفي',
          license_number: 'YEM-SPEC-1092',
          city: 'عدن',
          phone: '+967 733445566',
          email: 'dr.yasmeen@outlook.com',
          bio: 'ماجستير تأهيل عصبي وإصابات الحبل الشوكي، خبرة 7 سنوات بمستشفيات عدن التعليمية، ترخيص وزارة الصحة.',
          status: 'pending',
          created_at: new Date(Date.now() - 3600000 * 12).toISOString()
        },
        {
          id: 'app-003',
          applicant_name: 'صيدلية المستقبل الدولية',
          requested_role: 'pharmacy_partner',
          requested_role_label: 'صيدلية شريكة (مستلزمات وجبائر)',
          license_number: 'YEM-PHARM-4402',
          city: 'المكلا',
          phone: '+967 778899001',
          email: 'mustaqbal.pharma@gmail.com',
          bio: 'صيدلية متكاملة توفر الجبائر، المستلزمات الطبية، والأربطة الضاغطة مع تقديم خصم 15% لمشتركي جسور.',
          status: 'pending',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: 'app-004',
          applicant_name: 'مؤسسة حضرموت للأطراف والأجهزة التعويضية',
          requested_role: 'device_center_partner',
          requested_role_label: 'مركز أجهزة طبية ومساعدة',
          license_number: 'YEM-DEV-771',
          city: 'المكلا',
          phone: '+967 775511223',
          email: 'hadramout.limbs@gmail.com',
          bio: 'مركز متخصص بتصنيع وصيانة الكراسي المتحركة، الأطراف الصناعية، والمشايات مع ورشة فحص معتمدة.',
          status: 'pending',
          created_at: new Date(Date.now() - 3600000 * 36).toISOString()
        },
        {
          id: 'app-005',
          applicant_name: 'كابتن عبد الرحمن باوزير',
          requested_role: 'motor_supervisor',
          requested_role_label: 'مشرف حركي ميداني',
          license_number: 'YEM-SUP-552',
          city: 'سيئون',
          phone: '+967 776655443',
          email: 'bawazir.sup@gmail.com',
          bio: 'بكالوريوس علوم الحركة والتأهيل الرياضي، خبرة 4 سنوات في الزيارات الميدانية المنزلية للمستفيدين.',
          status: 'pending',
          created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        },
        {
          id: 'app-006',
          applicant_name: 'جمعية إب الخيرية لرعاية المعاقين',
          requested_role: 'charity_admin',
          requested_role_label: 'جمعية خيرية ومؤسسة مانحة',
          license_number: 'YEM-NGO-109',
          city: 'إب',
          phone: '+967 711223344',
          email: 'ibb.disabled@gmail.com',
          bio: 'جمعية مرخصة من وزارة الشؤون الاجتماعية لكفالة 100 أسرة من ذوي الاحتياجات التأهيلية.',
          status: 'approved',
          created_at: new Date(Date.now() - 3600000 * 120).toISOString()
        }
      ];
    },

    _getInitialAdminAppointments: function () {
      return [
        {
          id: 'apt-001',
          booking_reference: 'JSR-APT-2601',
          patient_name: 'طارق عبد الجليل السعدي',
          patient_phone: '+967 775432109',
          hospital_name: 'مركز التأهيل التخصصي المتطور',
          specialist_name: 'د. خالد المعالج',
          appointment_date: '2026-11-23',
          start_time: '10:00',
          end_time: '11:00',
          fee_usd: 180.00,
          status: 'confirmed',
          city: 'صنعاء',
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'apt-002',
          booking_reference: 'JSR-APT-2602',
          patient_name: 'فاطمة محمد العولقي',
          patient_phone: '+967 733887766',
          hospital_name: 'مستشفى الأمل التخصصي للتأهيل الطبي',
          specialist_name: 'د. ريم النهاري',
          appointment_date: '2026-11-24',
          start_time: '16:00',
          end_time: '17:00',
          fee_usd: 160.00,
          status: 'confirmed',
          city: 'عدن',
          created_at: new Date(Date.now() - 3600000 * 8).toISOString()
        },
        {
          id: 'apt-003',
          booking_reference: 'JSR-APT-2603',
          patient_name: 'سالم عمر باحطاب',
          patient_phone: '+967 770112233',
          hospital_name: 'مجمع حضرموت الطبي التشخيصي',
          specialist_name: 'د. منير القدسي',
          appointment_date: '2026-11-25',
          start_time: '11:30',
          end_time: '12:30',
          fee_usd: 200.00,
          status: 'confirmed',
          city: 'المكلا',
          created_at: new Date(Date.now() - 3600000 * 14).toISOString()
        },
        {
          id: 'apt-004',
          booking_reference: 'JSR-APT-2604',
          patient_name: 'هشام عبد السلام الأهدل',
          patient_phone: '+967 774567890',
          hospital_name: 'مركز التأهيل التخصصي المتطور',
          specialist_name: 'د. عادل المخلافي',
          appointment_date: '2026-11-20',
          start_time: '09:00',
          end_time: '10:00',
          fee_usd: 180.00,
          status: 'completed',
          city: 'صنعاء',
          created_at: new Date(Date.now() - 3600000 * 30).toISOString()
        }
      ];
    },

    _getInitialAdminPayments: function () {
      return [
        {
          id: 'pay-001',
          invoice_number: 'INV-2026-101',
          payer_name: 'جمعية رعاية وتأهيل ذوي الإعاقة',
          purpose: 'اشتراك باقة الجمعيات (كفالة 50 مستفيد)',
          amount_usd: 2400.00,
          payment_method: 'تحويل بنكي',
          status: 'completed',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: 'pay-002',
          invoice_number: 'INV-2026-102',
          payer_name: 'طارق عبد الجليل السعدي',
          purpose: 'رسوم حجز موعد كشف حضوري (JSR-APT-2601)',
          amount_usd: 180.00,
          payment_method: 'بطاقة ائتمانية',
          status: 'completed',
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'pay-003',
          invoice_number: 'INV-2026-103',
          payer_name: 'فاطمة محمد العولقي',
          purpose: 'رسوم حجز موعد كشف حضوري (JSR-APT-2602)',
          amount_usd: 160.00,
          payment_method: 'بطاقة ائتمانية',
          status: 'completed',
          created_at: new Date(Date.now() - 3600000 * 8).toISOString()
        },
        {
          id: 'pay-004',
          invoice_number: 'INV-2026-104',
          payer_name: 'منير علي اليماني',
          purpose: 'شراء كرسي متحرك كهربائي (JSR-ORD-101)',
          amount_usd: 320.00,
          payment_method: 'دفع عند الاستلام',
          status: 'completed',
          created_at: new Date(Date.now() - 3600000 * 18).toISOString()
        },
        {
          id: 'pay-005',
          invoice_number: 'INV-2026-105',
          payer_name: 'مؤسسة الأمل التنموية',
          purpose: 'كفالة حزمة أجهزة تعويضية للأسر',
          amount_usd: 1850.00,
          payment_method: 'شيك مصرفي',
          status: 'completed',
          created_at: new Date(Date.now() - 3600000 * 72).toISOString()
        }
      ];
    },

    _getInitialAdminActivationCodes: function () {
      return [
        {
          id: 'act-001',
          code: 'JUSOOR-KAFALA-8812',
          package_name: 'باقة الكفالة الشاملة',
          duration_days: 30,
          status: 'active',
          used_by_beneficiary: null,
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: 'act-002',
          code: 'JUSOOR-KAFALA-8813',
          package_name: 'باقة الكفالة الشاملة',
          duration_days: 30,
          status: 'active',
          used_by_beneficiary: null,
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: 'act-003',
          code: 'CHARITY-IBB-4401',
          package_name: 'باقة التأهيل الحركي المتقدم',
          duration_days: 90,
          status: 'used',
          used_by_beneficiary: 'أحمد الهاشمي (المستفيد)',
          created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        },
        {
          id: 'act-004',
          code: 'YEMEN-DEV-9921',
          package_name: 'باقة رعاية كبار السن',
          duration_days: 30,
          status: 'active',
          used_by_beneficiary: null,
          created_at: new Date(Date.now() - 3600000 * 12).toISOString()
        }
      ];
    },

    _getInitialProfiles: function () {
      return [
        {
          id: 'prof-001',
          full_name: 'أ. عبد الله المدير',
          email: 'admin@jusoor.ye',
          phone: '+967 770000001',
          role: 'owner_admin',
          city: 'صنعاء',
          approval_status: 'approved',
          is_active: true,
          created_at: '2026-01-01'
        },
        {
          id: 'prof-002',
          full_name: 'أحمد عبد العزيز الهاشمي',
          email: 'ahmed.hashemi@gmail.com',
          phone: '+967 775012345',
          role: 'beneficiary',
          city: 'صنعاء',
          approval_status: 'approved',
          is_active: true,
          created_at: '2026-02-15'
        },
        {
          id: 'prof-003',
          full_name: 'د. خالد المعالج',
          email: 'specialist@jisr.sa',
          phone: '+967 771122334',
          role: 'specialist',
          city: 'صنعاء',
          approval_status: 'approved',
          is_active: true,
          created_at: '2026-01-20'
        },
        {
          id: 'prof-004',
          full_name: 'فيصل السبيعي',
          email: 'supervisor@jisr.sa',
          phone: '+967 733556677',
          role: 'motor_supervisor',
          city: 'عدن',
          approval_status: 'approved',
          is_active: true,
          created_at: '2026-02-01'
        },
        {
          id: 'prof-005',
          full_name: 'إدارة مركز التأهيل التخصصي',
          email: 'hospital@jisr.sa',
          phone: '+967 772233445',
          role: 'hospital_admin',
          city: 'صنعاء',
          approval_status: 'approved',
          is_active: true,
          created_at: '2026-01-10'
        },
        {
          id: 'prof-006',
          full_name: 'جمعية رعاية وتأهيل ذوي الإعاقة',
          email: 'charity@jisr.sa',
          phone: '+967 711889900',
          role: 'charity_admin',
          city: 'صنعاء',
          approval_status: 'approved',
          is_active: true,
          created_at: '2026-01-12'
        }
      ];
    },

    _getInitialContactMessages: function () {
      return [
        {
          id: 'msg-001',
          sender_name: 'م. مروان الكبسي',
          email: 'marwan.kebsi@gmail.com',
          phone: '+967 771998877',
          subject: 'استفسار عن تغطية الجلسات المنزلية في تعز',
          message_text: 'السلام عليكم، هل تتوفر لديكم زيارات إشراف حركي منزلي في محافظة تعز - الحوبان؟ والدتي تحتاج تأهيل بعد جلطة دماغية.',
          status: 'unread',
          created_at: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          id: 'msg-002',
          sender_name: 'أروى فضل اليافعي',
          email: 'arwa.yafei@yahoo.com',
          phone: '+967 733112244',
          subject: 'طلب تبرع بكرسي متحرك مجدد',
          message_text: 'لدينا كرسي متحرك كهربائي بحالة ممتازة نود التبرع به لصالح أسرة محتاجة عبر بنك الأجهزة الخاص بكم.',
          status: 'unread',
          created_at: new Date(Date.now() - 3600000 * 9).toISOString()
        },
        {
          id: 'msg-003',
          sender_name: 'د. سامي العريقي',
          email: 'dr.sami.oraiqi@med.ye',
          phone: '+967 777665544',
          subject: 'طلب انضمام استشاري طب طبيعي',
          message_text: 'أود تقديم استشارات سريرية عن بُعد على منصتكم الموقرة والتنسيق لبرامج متابعة المشرفين الحركيين.',
          status: 'replied',
          created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ];
    },

    _getInitialDiscountsList: function () {
      return [
        {
          id: 'disc-001',
          vendor_id: 'pharma-101',
          vendor_type: 'pharmacy',
          vendor_name: 'صيدلية الشفاء التخصصية',
          title: 'خصم الجبائر والمستلزمات الطبية',
          discount_percentage: 15,
          discount_code: 'JUSOOR-PHARMA-15',
          conditions: 'يشمل الجبائر المعتمدة والأربطة الضاغطة ومستلزمات رعاية طريحي الفراش.',
          expiry_date: '2026-12-31',
          is_active: true
        },
        {
          id: 'disc-002',
          vendor_id: 'pharma-102',
          vendor_type: 'pharmacy',
          vendor_name: 'صيدلية البرج الحديثة',
          title: 'خصم أدوية ومستلزمات التأهيل',
          discount_percentage: 15,
          discount_code: 'JUSOOR-ADEN-15',
          conditions: 'خصم فوري عند إبراز الكود لموظف الصيدلية لمستفيدي جسور.',
          expiry_date: '2026-12-31',
          is_active: true
        },
        {
          id: 'disc-003',
          vendor_id: 'dev-201',
          vendor_type: 'device_center',
          vendor_name: 'مركز اليمن للأجهزة التعويضية',
          title: 'خصم الكراسي المتحركة والأطراف',
          discount_percentage: 20,
          discount_code: 'JUSOOR-DEV-20',
          conditions: 'خصم حصري على الكراسي الكهربائية، المشايات، وقطع الغيار والصيانة.',
          expiry_date: '2026-12-31',
          is_active: true
        },
        {
          id: 'disc-004',
          vendor_id: 'dev-202',
          vendor_type: 'device_center',
          vendor_name: 'شركة المستقبل للمستلزمات الطبية',
          title: 'خصم أسرة وتجهيزات التأهيل',
          discount_percentage: 18,
          discount_code: 'JUSOOR-MED-18',
          conditions: 'تخفيض خاص لمشتركي المنصة على التجهيزات المنزلية والأسرة الطبية.',
          expiry_date: '2026-12-31',
          is_active: true
        }
      ];
    },

    // 1. نظرة عامة ومؤشرات الأداء للوحة الإدارة
    getAdminDashboardOverview: async function () {
      if (client) {
        try {
          const { data, error } = await client.rpc('get_admin_dashboard_overview');
          if (!error && data) return data;
        } catch (e) {
          console.warn('Live RPC get_admin_dashboard_overview failed, using fallback:', e);
        }
      }

      // حسابات ديناميكية من المجموعات المخزنة
      const apps = await this.fetchPartnerApplications();
      const pendingApps = apps.filter(a => a.status === 'pending');
      const orders = await this.fetchAdminDeviceOrders();
      const newOrders = orders.filter(o => o.order_status === 'pending');
      const msgs = await this.fetchAdminContactMessages();
      const unreadMsgs = msgs.filter(m => m.status === 'unread');
      const payments = await this.fetchAdminPayments();
      const totalRev = payments.reduce((acc, p) => acc + (Number(p.amount_usd) || 0), 0);
      const hospitals = await this.fetchAdminHospitals();
      const charities = await this.fetchAdminCharities();
      const pharms = await this.fetchAdminVendors('pharmacy');
      const devCenters = await this.fetchAdminVendors('device_center');
      const appointments = await this.fetchAdminAppointments();

      return {
        total_revenue_usd: totalRev,
        active_beneficiaries: 148,
        approved_specialists: 18,
        approved_supervisors: 12,
        subscribed_hospitals: hospitals.filter(h => h.is_subscribed).length,
        subscribed_charities: charities.filter(c => c.is_active).length,
        subscribed_pharmacies: pharms.filter(p => p.is_subscribed).length,
        subscribed_device_centers: devCenters.filter(d => d.is_subscribed).length,
        alerts: {
          pending_applications: pendingApps.length,
          new_device_orders: newOrders.length,
          unread_messages: unreadMsgs.length
        },
        recent_applications: pendingApps.slice(0, 5),
        recent_appointments: appointments.slice(0, 5)
      };
    },

    // 2. مركز اعتماد الشركاء
    fetchPartnerApplications: async function (statusFilter, categoryFilter) {
      if (client) {
        try {
          let q = client.from('partner_applications').select('*').order('created_at', { ascending: false });
          if (statusFilter && statusFilter !== 'all') q = q.eq('status', statusFilter);
          if (categoryFilter && categoryFilter !== 'all') q = q.eq('requested_role', categoryFilter);
          const { data, error } = await q;
          if (!error && data) return data;
        } catch (e) {
          console.warn('Error fetching live applications:', e);
        }
      }

      let stored = localStorage.getItem('jisr_partner_applications');
      let list = stored ? JSON.parse(stored) : this._getInitialPartnerApplications();
      if (!stored) {
        localStorage.setItem('jisr_partner_applications', JSON.stringify(list));
      }

      if (statusFilter && statusFilter !== 'all') {
        list = list.filter(a => a.status === statusFilter);
      }
      if (categoryFilter && categoryFilter !== 'all') {
        list = list.filter(a => a.requested_role === categoryFilter);
      }
      return list;
    },

    reviewPartnerApplication: async function (applicationId, newStatus, reviewNotes) {
      if (client) {
        try {
          const { data, error } = await client.rpc('review_partner_application', {
            p_application_id: applicationId,
            p_status: newStatus,
            p_review_notes: reviewNotes || null
          });
          if (!error && data && data.success) return data;
        } catch (e) {
          console.warn('Live review_partner_application RPC error, using local fallback:', e);
        }
      }

      let list = await this.fetchPartnerApplications();
      const idx = list.findIndex(a => String(a.id) === String(applicationId));
      if (idx !== -1) {
        list[idx].status = newStatus;
        list[idx].review_notes = reviewNotes || 'تم تحديث الحالة من قِبل إدارة المنصة';
        list[idx].reviewed_at = new Date().toISOString();
        localStorage.setItem('jisr_partner_applications', JSON.stringify(list));
        return { success: true, application_id: applicationId, status: newStatus };
      }
      return { success: false, message: 'الطلب غير موجود' };
    },

    // 3. إدارة المستشفيات والجمعيات المشتركة
    fetchAdminHospitals: async function () {
      if (client) {
        try {
          const { data, error } = await client.from('hospitals_centers').select('*').order('name');
          if (!error && data && data.length > 0) return data;
        } catch (e) {
          console.warn(e);
        }
      }

      let stored = localStorage.getItem('jisr_admin_hospitals');
      if (stored) return JSON.parse(stored);

      const baseList = [
        {
          id: 'hosp-001',
          name: 'مركز التأهيل التخصصي المتطور',
          license_number: 'YEM-HOSP-101',
          city: 'صنعاء',
          address: 'شارع الستين، حي الأصبحي',
          phone: '+967 772233445',
          is_subscribed: true,
          subscription_end_date: '2027-06-30'
        },
        {
          id: 'hosp-002',
          name: 'مستشفى الأمل التخصصي للتأهيل الطبي',
          license_number: 'YEM-HOSP-102',
          city: 'عدن',
          address: 'خور مكسر، بالقرب من ساحة العروض',
          phone: '+967 733887711',
          is_subscribed: true,
          subscription_end_date: '2027-05-15'
        },
        {
          id: 'hosp-003',
          name: 'مجمع حضرموت الطبي التشخيصي والتأهيلي',
          license_number: 'YEM-HOSP-103',
          city: 'المكلا',
          address: 'فوه، المساكن، الشارع العام',
          phone: '+967 770112244',
          is_subscribed: true,
          subscription_end_date: '2026-12-31'
        },
        {
          id: 'hosp-004',
          name: 'مركز تعز الدولي للعلاج الطبيعي',
          license_number: 'YEM-HOSP-104',
          city: 'تعز',
          address: 'شارع جمال، مبنى الأمل الطبي',
          phone: '+967 773344551',
          is_subscribed: false,
          subscription_end_date: '2026-10-01'
        }
      ];

      localStorage.setItem('jisr_admin_hospitals', JSON.stringify(baseList));
      return baseList;
    },

    toggleHospitalSubscription: async function (hospitalId, isSubscribed, extendMonths = 0) {
      let list = await this.fetchAdminHospitals();
      const idx = list.findIndex(h => String(h.id) === String(hospitalId));
      if (idx !== -1) {
        list[idx].is_subscribed = Boolean(isSubscribed);
        if (extendMonths > 0) {
          const currentEnd = new Date(list[idx].subscription_end_date || Date.now());
          currentEnd.setMonth(currentEnd.getMonth() + extendMonths);
          list[idx].subscription_end_date = currentEnd.toISOString().split('T')[0];
        }
        localStorage.setItem('jisr_admin_hospitals', JSON.stringify(list));
        return { success: true, hospital: list[idx] };
      }
      return { success: false };
    },

    fetchAdminCharities: async function () {
      let stored = localStorage.getItem('jisr_admin_charities');
      if (stored) return JSON.parse(stored);

      const baseList = [
        {
          id: 'char-001',
          name: 'جمعية رعاية وتأهيل ذوي الإعاقة (صنعاء)',
          license_number: 'YEM-NGO-201',
          city: 'صنعاء',
          active_package: 'باقة الكفالة الذهبية',
          max_beneficiaries: 100,
          current_beneficiaries: 78,
          end_date: '2027-04-15',
          is_active: true
        },
        {
          id: 'char-002',
          name: 'مؤسسة عدن التنموية لرعاية الأيتام والمعاقين',
          license_number: 'YEM-NGO-202',
          city: 'عدن',
          active_package: 'باقة الشراكة الفضية',
          max_beneficiaries: 50,
          current_beneficiaries: 42,
          end_date: '2027-02-28',
          is_active: true
        },
        {
          id: 'char-003',
          name: 'جمعية الأمل لرعاية الصم والتأهيل الحركي',
          license_number: 'YEM-NGO-203',
          city: 'المكلا',
          active_package: 'باقة الكفالة الأساسية',
          max_beneficiaries: 30,
          current_beneficiaries: 29,
          end_date: '2026-12-10',
          is_active: true
        }
      ];

      localStorage.setItem('jisr_admin_charities', JSON.stringify(baseList));
      return baseList;
    },

    extendCharitySubscription: async function (charityId, extendDays = 30) {
      let list = await this.fetchAdminCharities();
      const idx = list.findIndex(c => String(c.id) === String(charityId));
      if (idx !== -1) {
        const curDate = new Date(list[idx].end_date || Date.now());
        curDate.setDate(curDate.getDate() + extendDays);
        list[idx].end_date = curDate.toISOString().split('T')[0];
        list[idx].is_active = true;
        localStorage.setItem('jisr_admin_charities', JSON.stringify(list));
        return { success: true, charity: list[idx] };
      }
      return { success: false };
    },

    // 4. إدارة الصيدليات ومراكز الأجهزة والخصومات
    fetchAdminVendors: async function (vendorType) {
      if (vendorType === 'pharmacy') {
        let stored = localStorage.getItem('jisr_partner_pharmacies');
        return stored ? JSON.parse(stored) : this._getInitialPharmacies();
      } else {
        let stored = localStorage.getItem('jisr_partner_device_centers');
        return stored ? JSON.parse(stored) : this._getInitialDeviceCenters();
      }
    },

    toggleVendorSubscription: async function (vendorId, vendorType, isSubscribed) {
      const storageKey = vendorType === 'pharmacy' ? 'jisr_partner_pharmacies' : 'jisr_partner_device_centers';
      let list = await this.fetchAdminVendors(vendorType);
      const idx = list.findIndex(v => String(v.id) === String(vendorId));
      if (idx !== -1) {
        list[idx].is_subscribed = Boolean(isSubscribed);
        localStorage.setItem(storageKey, JSON.stringify(list));
        return { success: true, vendor: list[idx] };
      }
      return { success: false };
    },

    saveVendor: async function (vendorData) {
      const vendorType = vendorData.vendor_type === 'pharmacy' ? 'pharmacy' : 'device_center';
      const storageKey = vendorType === 'pharmacy' ? 'jisr_partner_pharmacies' : 'jisr_partner_device_centers';
      let list = await this.fetchAdminVendors(vendorType);

      if (vendorData.id) {
        const idx = list.findIndex(v => String(v.id) === String(vendorData.id));
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...vendorData };
        }
      } else {
        vendorData.id = 'vnd-' + Date.now();
        vendorData.is_subscribed = true;
        list.unshift(vendorData);
      }

      localStorage.setItem(storageKey, JSON.stringify(list));
      return { success: true, vendor: vendorData };
    },

    fetchAdminDiscounts: async function () {
      let stored = localStorage.getItem('jisr_partner_discounts');
      if (stored) return JSON.parse(stored);
      const initial = this._getInitialDiscountsList();
      localStorage.setItem('jisr_partner_discounts', JSON.stringify(initial));
      return initial;
    },

    toggleDiscountStatus: async function (discountId, isActive) {
      let list = await this.fetchAdminDiscounts();
      const idx = list.findIndex(d => String(d.id) === String(discountId));
      if (idx !== -1) {
        list[idx].is_active = Boolean(isActive);
        localStorage.setItem('jisr_partner_discounts', JSON.stringify(list));
        return { success: true, discount: list[idx] };
      }
      return { success: false };
    },

    saveDiscount: async function (discountData) {
      let list = await this.fetchAdminDiscounts();
      if (discountData.id) {
        const idx = list.findIndex(d => String(d.id) === String(discountData.id));
        if (idx !== -1) list[idx] = { ...list[idx], ...discountData };
      } else {
        discountData.id = 'disc-' + Date.now();
        discountData.is_active = true;
        list.unshift(discountData);
      }
      localStorage.setItem('jisr_partner_discounts', JSON.stringify(list));
      return { success: true, discount: discountData };
    },

    // 5. إدارة سوق/بنك الأجهزة وطلبات الشراء
    fetchAdminDevices: async function () {
      return this.fetchAssistiveDevices();
    },

    updateDeviceStatus: async function (deviceId, newStatus) {
      let devices = await this.fetchAssistiveDevices();
      const idx = devices.findIndex(d => String(d.id) === String(deviceId));
      if (idx !== -1) {
        devices[idx].status = newStatus;
        localStorage.setItem('jisr_assistive_devices', JSON.stringify(devices));
        return { success: true, device: devices[idx] };
      }
      return { success: false };
    },

    fetchAdminDeviceOrders: async function () {
      let stored = localStorage.getItem('jisr_device_orders');
      if (stored) return JSON.parse(stored);

      const baseOrders = [
        {
          id: 'ord-001',
          order_reference: 'JSR-ORD-10101',
          buyer_name: 'منير علي اليماني',
          buyer_phone: '+967 775551122',
          city: 'صنعاء',
          delivery_address: 'شارع الزبيري، خلف بنك اليمن الدولي',
          notes: 'يرجى الاتصال قبل التوصيل بنصف ساعة للتنسيق.',
          device_title: 'كرسي متحرك كهربائي ألماني فائق الخفة قابل للطي',
          total_price_usd: 320,
          listing_type: 'for_sale',
          order_status: 'pending',
          created_at: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: 'ord-002',
          order_reference: 'JSR-ORD-10102',
          buyer_name: 'أمل سعيد باسويد',
          buyer_phone: '+967 733998877',
          city: 'عدن',
          delivery_address: 'المعلا، الشارع الرئيسي، عمارة الأمل',
          notes: 'طلب استلام جهاز تبرع مجاني لطفل يعاني من شلل دماغي.',
          device_title: 'جهاز تحفيز حركي وعضلي TENS ثنائي القناة',
          total_price_usd: 0,
          listing_type: 'donation',
          order_status: 'confirmed',
          created_at: new Date(Date.now() - 3600000 * 20).toISOString()
        }
      ];

      localStorage.setItem('jisr_device_orders', JSON.stringify(baseOrders));
      return baseOrders;
    },

    updateDeviceOrderStatus: async function (orderId, newStatus) {
      let orders = await this.fetchAdminDeviceOrders();
      const idx = orders.findIndex(o => String(o.id) === String(orderId));
      if (idx !== -1) {
        orders[idx].order_status = newStatus;
        localStorage.setItem('jisr_device_orders', JSON.stringify(orders));
        return { success: true, order: orders[idx] };
      }
      return { success: false };
    },

    // 6. الحجوزات والمدفوعات وأكواد التفعيل
    fetchAdminAppointments: async function () {
      let stored = localStorage.getItem('jisr_admin_appointments');
      if (stored) return JSON.parse(stored);
      const list = this._getInitialAdminAppointments();
      localStorage.setItem('jisr_admin_appointments', JSON.stringify(list));
      return list;
    },

    updateAppointmentStatus: async function (appointmentId, newStatus) {
      let list = await this.fetchAdminAppointments();
      const idx = list.findIndex(a => String(a.id) === String(appointmentId));
      if (idx !== -1) {
        list[idx].status = newStatus;
        localStorage.setItem('jisr_admin_appointments', JSON.stringify(list));
        return { success: true, appointment: list[idx] };
      }
      return { success: false };
    },

    fetchAdminPayments: async function () {
      let stored = localStorage.getItem('jisr_admin_payments');
      if (stored) return JSON.parse(stored);
      const list = this._getInitialAdminPayments();
      localStorage.setItem('jisr_admin_payments', JSON.stringify(list));
      return list;
    },

    fetchAdminActivationCodes: async function () {
      let stored = localStorage.getItem('jisr_admin_activation_codes');
      if (stored) return JSON.parse(stored);
      const list = this._getInitialAdminActivationCodes();
      localStorage.setItem('jisr_admin_activation_codes', JSON.stringify(list));
      return list;
    },

    generateActivationCodes: async function (count = 5, prefix = 'JSR-', packageName = 'باقة الكفالة الشاملة', durationDays = 30) {
      if (client) {
        try {
          const { data, error } = await client.rpc('admin_generate_activation_codes', {
            p_count: count,
            p_prefix: prefix,
            p_package_name: packageName,
            p_duration_days: durationDays
          });
          if (!error && data && data.success) return data;
        } catch (e) {
          console.warn('Live admin_generate_activation_codes error:', e);
        }
      }

      let codesList = await this.fetchAdminActivationCodes();
      const generated = [];

      for (let i = 0; i < count; i++) {
        const rand = Math.floor(100000 + Math.random() * 900000);
        const code = (prefix || 'JSR-').toUpperCase() + rand;
        const newCodeObj = {
          id: 'act-' + Date.now() + '-' + i,
          code: code,
          package_name: packageName,
          duration_days: durationDays,
          status: 'active',
          used_by_beneficiary: null,
          created_at: new Date().toISOString()
        };
        codesList.unshift(newCodeObj);
        generated.push(newCodeObj);
      }

      localStorage.setItem('jisr_admin_activation_codes', JSON.stringify(codesList));
      return { success: true, count, codes: generated };
    },

    // 7. المستخدمون ورسائل التواصل
    fetchAdminProfiles: async function (roleFilter, searchFilter) {
      let stored = localStorage.getItem('jisr_admin_profiles');
      let list = stored ? JSON.parse(stored) : this._getInitialProfiles();
      if (!stored) localStorage.setItem('jisr_admin_profiles', JSON.stringify(list));

      if (roleFilter && roleFilter !== 'all') {
        list = list.filter(p => p.role === roleFilter);
      }
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        list = list.filter(p => 
          (p.full_name && p.full_name.toLowerCase().includes(q)) ||
          (p.email && p.email.toLowerCase().includes(q)) ||
          (p.phone && p.phone.includes(q))
        );
      }
      return list;
    },

    updateProfileStatus: async function (profileId, approvalStatus, isActive) {
      let profiles = await this.fetchAdminProfiles();
      const idx = profiles.findIndex(p => String(p.id) === String(profileId));
      if (idx !== -1) {
        if (approvalStatus !== undefined) profiles[idx].approval_status = approvalStatus;
        if (isActive !== undefined) profiles[idx].is_active = Boolean(isActive);
        localStorage.setItem('jisr_admin_profiles', JSON.stringify(profiles));
        return { success: true, profile: profiles[idx] };
      }
      return { success: false };
    },

    fetchAdminContactMessages: async function () {
      let stored = localStorage.getItem('jisr_contact_messages');
      if (stored) return JSON.parse(stored);
      const list = this._getInitialContactMessages();
      localStorage.setItem('jisr_contact_messages', JSON.stringify(list));
      return list;
    },

    markContactMessageRead: async function (messageId, status = 'replied') {
      let messages = await this.fetchAdminContactMessages();
      const idx = messages.findIndex(m => String(m.id) === String(messageId));
      if (idx !== -1) {
        messages[idx].status = status;
        localStorage.setItem('jisr_contact_messages', JSON.stringify(messages));
        return { success: true, message: messages[idx] };
      }
      return { success: false };
    }

  };
})();
