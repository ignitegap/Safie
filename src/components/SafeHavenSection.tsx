'use client';

import React from 'react';
import {
  ShieldAlert,
  Building2,
  Phone,
  CheckCircle2,
  Lock,
  MessageSquare,
} from 'lucide-react';
import { DELHI_NCR_SAFE_HAVENS } from '@/lib/data-delhi-ncr';
import { useLanguage } from '@/lib/i18n';

export default function SafeHavenSection() {
  const { lang } = useLanguage();

  return (
    <section id="safe-havens" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-rose-100">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200/80 text-rose-700 text-xs font-mono">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'भौतिक सुरक्षित ठिकाने' : 'Physical Refuge Infrastructure'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
          {lang === 'hi' ? '"Ask for Angela" सुरक्षित शरण नेटवर्क' : '"Ask for Angela" Safe Haven Network'}
        </h2>
        <p className="text-sm text-stone-600">
          {lang === 'hi'
            ? 'सिर्फ मोबाइल अलार्म काफी नहीं अगर भागने के लिए कोई सुरक्षित जगह न हो। सेफ़ी 24/7 खुली फार्मेसी, अस्पतालों और मेट्रो चौकियों को प्रमाणित शरण स्थल बनाता है।'
            : 'Digital alarms fail if there is nowhere safe to run. Safie certifies 24/7 pharmacies, hospitals, and transit kiosks as immediate physical shelters.'}
        </p>
      </div>

      {/* Protocol Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-rose-200/80 space-y-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-stone-900">
            {lang === 'hi' ? 'गुप्त कोडवर्ड' : 'Discreet Codeword'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {lang === 'hi'
              ? 'किसी भी भागीदार ठिकाने पर जाकर स्टाफ से कहें: "क्या मैं एंजेला (Angela) से बात कर सकती हूँ?"। स्टाफ बिना किसी को शक हुए तुरंत आपको सुरक्षित कमरे में ले जाएगा।'
              : 'Walk into any partner location and ask: "Can I speak with Angela?". Staff are trained to immediately initiate the sanctuary protocol without alarming people nearby.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-rose-200/80 space-y-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-stone-900">
            {lang === 'hi' ? 'सुरक्षित कमरा व शरण' : 'Secure Employee Refuge'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {lang === 'hi'
              ? 'स्टाफ आपको काउंटर के पीछे या बंद कमरे में ले जाता है, जहाँ पानी, फोन चार्जिंग और सुरक्षित पनाह मिलती है, जबकि पीछा करने वाला सीसीटीवी के सामने बाहर ही रहता है।'
              : 'Staff escorts you behind the counter or into a locked staff room, providing water, phone charging, and a safe space while keeping pursuers outside under CCTV recording.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-rose-200/80 space-y-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Phone className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-stone-900">
            {lang === 'hi' ? 'पुलिस व सुरक्षित एस्कॉर्ट' : 'Direct Police Escort'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {lang === 'hi'
              ? 'मैनेजर तुरंत नजदीकी पीसीआर वैन को बुलाता है या जांची हुई कैब की व्यवस्था करता है, जिससे आप अकेले कभी भी असुरक्षित बाहर न निकलें।'
              : 'The manager notifies the nearest police PCR van or summons an authenticated cab with driver ID verification, ensuring you never leave the refuge alone.'}
          </p>
        </div>
      </div>

      {/* Directory Table / Cards of Real Delhi-NCR Havens */}
      <div className="rounded-2xl bg-white border border-rose-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-rose-100">
          <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-stone-500" />
            <span>
              {lang === 'hi' ? 'सक्रिय दिल्ली-एनसीआर सुरक्षित ठिकाने' : 'Active Delhi-NCR Safe Haven Registry'}
            </span>
          </h3>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            {DELHI_NCR_SAFE_HAVENS.length} {lang === 'hi' ? 'जाँचे हुए ठिकाने' : 'Verified Sanctuaries'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DELHI_NCR_SAFE_HAVENS.slice(0, 9).map((h) => (
            <div
              key={h.id}
              className="p-3.5 rounded-xl bg-rose-50/30 border border-rose-100 flex flex-col justify-between text-left space-y-2.5"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-50 text-rose-700 border border-rose-200">
                    {h.categoryLabel}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {h.address.includes('Gurugram') ? 'Gurugram' : 'Delhi'}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-stone-900">{h.name}</h4>
                <p className="text-[11px] text-stone-500 line-clamp-2">{h.address}</p>
              </div>

              <div className="pt-2 border-t border-rose-100/60 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'hi' ? 'प्रमाणित ठिकाना' : 'Protocol Certified'}</span>
                </span>
                <a
                  href={`tel:${h.phone}`}
                  className="font-mono text-[11px] text-stone-600 hover:text-rose-600 font-medium"
                >
                  {h.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}