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
            // جلب ملف المستخدم من جدول profiles
            let { data: profile, error: profErr } = await client
              .from('profiles')
              .select('*')
              .eq('auth_user_id', authData.user.id)
              .maybeSingle();

            if (!profile) {
              // محاولة ثانية بالبريد الإلكتروني
              const res = await client
                .from('profiles')
                .select('*')
                .eq('email', email)
                .maybeSingle();
              profile = res.data;
            }

            if (!profile) {
              // ملف مستفيد افتراضي إن لم يوجد
              profile = {
                id: authData.user.id,
                auth_user_id: authData.user.id,
                full_name: authData.user.user_metadata?.full_name || email.split('@')[0],
                email: email,
                role: 'beneficiary',
                approval_status: 'approved'
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

            const sessionUser = {
              id: profile.id,
              auth_user_id: authData.user.id,
              email: email,
              full_name: profile.full_name || 'مستخدم منصة جسور',
              role: profile.role || 'beneficiary',
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
        'beneficiary@jisr.sa': { full_name: 'أحمد الهاشمي (مستفيد)', role: 'beneficiary', approval_status: 'approved' },
        'specialist@jisr.sa': { full_name: 'د. خالد المعالج (أخصائي)', role: 'specialist', approval_status: 'approved' },
        'supervisor@jisr.sa': { full_name: 'فيصل السبيعي (مشرف حركي)', role: 'motor_supervisor', approval_status: 'approved' },
        'hospital@jisr.sa': { full_name: 'مستشفى التأهيل المتقدم', role: 'hospital_admin', approval_status: 'approved' },
        'charity@jisr.sa': { full_name: 'جمعية رعاية وتأهيل ذوي الإعاقة', role: 'charity_admin', approval_status: 'approved' },
        'pending@jisr.sa': { full_name: 'أخصائي تحت المراجعة', role: 'specialist', approval_status: 'pending' },
        'rejected@jisr.sa': { full_name: 'طلب غير معتمد', role: 'specialist', approval_status: 'rejected' }
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
          approval_status: matched.approval_status
        };

        window.jisrDB.setCurrentUser(sessionUser);
        return { user: { id: sessionUser.id, email }, profile: sessionUser, error: null };
      }

      // إذا أدخل المستخدم أي بريد عام في الوضع التجريبي
      if (password && password.length >= 4) {
        // افتراضياً مستفيد معتمد
        let autoRole = 'beneficiary';
        if (email.includes('specialist') || email.includes('doctor')) autoRole = 'specialist';
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
      const payload = {
        applicant_name: appData.applicant_name,
        requested_role: appData.requested_role || 'specialist',
        license_number: appData.license_number || null,
        phone: appData.phone,
        email: appData.email || null,
        city: appData.city || 'الرياض',
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
    }
  };
})();
