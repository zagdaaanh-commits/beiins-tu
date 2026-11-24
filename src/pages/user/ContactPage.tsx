import {
  ChevronDown,
  ChevronUp,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import React, { useState } from 'react';
import { SampleBadge } from '../../components/common/SampleBadge';
import { useAppStore } from '../../context/AppStoreContext';
import { SAMPLE_FAQS } from '../../data/mockData';

export function ContactPage() {
  const { showToast } = useAppStore();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(SAMPLE_FAQS[0]?.id ?? null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      showToast('Бүх талбарыг бөглөөд илгээнэ үү.', 'warning');
      return;
    }
    showToast('Таны хүсэлтийг хүлээн авлаа (UI Прототип — бодит имэйл илгээгдээгүй).', 'info');
    setName('');
    setContact('');
    setMessage('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-10 space-y-14">
      {/* Contact Form & About Info */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#EB5E43]">
                Холбоо барих
              </span>
              <SampleBadge variant="sample" />
            </div>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl font-black text-[#1A1A1A]">
              Асуулт байвал бидэнтэй холбогдоорой
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#5C5C5C] leading-relaxed">
              Түвшин тодорхойлох, багцын мэдээлэл болон сургалтын хөтөлбөрийн талаар зөвлөгөө авах хүсэлт илгээх загвар маягт.
            </p>
          </div>

          <div id="about" className="rounded-3xl border border-[#EAE0D2] bg-[#FAF4EA] p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-extrabold text-[#1A1A1A]">
                Бидний тухай · Beijing Institute
              </h2>
              <SampleBadge variant="sample" label="Жишээ мэдээлэл" />
            </div>
            <p className="text-sm text-[#3F3F3F] leading-relaxed">
              Beijing Institute нь монгол суралцагчдад хятад хэлний дуудлага, ханз бичиг болон HSK шалгалтын мэдлэгийг ойлгомжтой, орчин үеийн дижитал орчинд хүргэх зорилготой онлайн сургалтын платформ юм.
            </p>
            <div className="space-y-2.5 text-sm text-[#1A1A1A] pt-1">
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#EB5E43] shrink-0" />
                <span>Улаанбаатар хот, Сүхбаатар дүүрэг (Жишээ хаяг)</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#25533E] shrink-0" />
                <span>+976 7700-0000 (Жишээ утас)</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#25533E] shrink-0" />
                <span>hello@beijing-institute.example.mn (Жишээ имэйл)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-6 rounded-[32px] border border-[#EAE0D2] bg-white p-6 sm:p-8 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold text-[#1A1A1A]">
              Мессеж илгээх (Прототип)
            </h2>
            <SampleBadge variant="sample" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
              Таны нэр
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Жишээ: Б. Анужин"
              className="w-full rounded-2xl border border-[#E5DDD0] bg-[#FDFBF7] px-4 py-3 text-sm focus:border-[#25533E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
              Утасны дугаар эсвэл Имэйл
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Жишээ: 9911-XXXX эсвэл name@example.mn"
              className="w-full rounded-2xl border border-[#E5DDD0] bg-[#FDFBF7] px-4 py-3 text-sm focus:border-[#25533E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
              Асуулт / Сэтгэгдэл
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Аль түвшингээс эхлэхээ асуух боломжтой..."
              className="w-full rounded-2xl border border-[#E5DDD0] bg-[#FDFBF7] px-4 py-3 text-sm focus:border-[#25533E] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EB5E43] py-3.5 text-sm font-extrabold text-white hover:bg-[#D44B31] cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span>Хүсэлт илгээх (Туршилт)</span>
          </button>
        </form>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="max-w-4xl mx-auto space-y-5">
        <div className="text-center space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#25533E]">
            Түгээмэл асуултууд
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
            FAQ — Түгээмэл асуулт хариулт
          </h2>
        </div>

        <div className="space-y-3">
          {SAMPLE_FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-3xl border border-[#EAE0D2] bg-white overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer hover:bg-[#FAF4EA]/60 transition"
                >
                  <span className="font-display text-sm sm:text-base font-extrabold text-[#1A1A1A]">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-[#EB5E43] shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#5C5C5C] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#5C5C5C] leading-relaxed border-t border-[#F4EDE2] pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
