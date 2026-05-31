import { Heart, Mail, Phone, Code, Globe } from "lucide-react";

export default function AboutDesk() {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-left">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0e1154]">About the Creator</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Meet the Developer behind Andrew Academy</p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-slate-600 leading-relaxed font-medium">
            Andrew Academy was proudly developed and engineered by <strong className="text-[#0e1154]">joshwebs</strong>. The platform is designed to provide high-quality, syllabus-aligned computational tools for ZNQF Level 4 Operator Technicians and students entering the field of industrial metallurgy.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4 hover:border-indigo-200 transition-colors">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 shadow-xs border border-slate-100 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">Lead Developer</h3>
                <p className="text-indigo-600 font-black text-lg">joshwebs</p>
                <p className="text-xs text-slate-500 mt-1">Full-Stack Engineer & Designer</p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4 hover:border-indigo-200 transition-colors">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 shadow-xs border border-slate-100 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">Direct Support</h3>
                <a href="mailto:joshuamujakari15@gmail.com" className="text-emerald-600 font-bold hover:underline transition-all">
                  joshuamujakari15@gmail.com
                </a>
                <p className="text-xs text-slate-500 mt-1">For technical issues or feedback</p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4 hover:border-indigo-200 transition-colors">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 shadow-xs border border-slate-100 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">Phone Contact</h3>
                <a href="tel:0789932832" className="text-emerald-600 font-bold hover:underline transition-all">
                  0789932832
                </a>
                <p className="text-xs text-slate-500 mt-1">Available during standard office hours</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span>by joshwebs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
