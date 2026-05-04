import Link from "next/link";
import { ArrowForward } from "@mui/icons-material";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="relative inline-block">
          <h1 className="text-[12rem] md:text-[18rem] font-black leading-none text-white/5 tracking-tighter">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-primary/10 border border-primary/20 text-primary px-6 py-2 rounded-2xl text-sm font-black uppercase tracking-widest backdrop-blur-xl">
               الصفحة غير موجودة
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
             عذراً، فقدنا <span className="text-primary italic">المسار</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-bold max-w-lg mx-auto">
            يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو أنها لم تعد موجودة في نظامنا.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            href="/"
            className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            العودة للرئيسية <ArrowForward className="rotate-180" />
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto bg-white/5 text-white border border-white/10 px-8 py-4 rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center"
          >
            تصفح المدونة
          </Link>
        </div>
      </div>

      {/* Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
    </div>
  );
}
