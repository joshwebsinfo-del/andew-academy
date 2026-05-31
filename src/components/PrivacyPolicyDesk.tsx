import { Shield, Lock, Eye, Database, FileText } from "lucide-react";

export default function PrivacyPolicyDesk() {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto text-left">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0e1154]">Privacy Policy</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Your data and usage</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-medium">
          <p>
            Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <p>
            Welcome to Andrew Academy. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our educational and metallurgical calculation platform.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <Database className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-800 text-base">1. Information We Collect</h3>
                <p className="mt-1">
                  We collect minimal information to provide our core functionality. Currently, the platform operates primarily on your local device. Any calculation history or study journals you generate are stored locally in your browser's local storage. We do not automatically upload your personal files or study logs to external cloud databases unless explicitly stated via a feature login.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Eye className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-800 text-base">2. How We Use Your Information</h3>
                <p className="mt-1">
                  The prompts you send to the calculation engine are processed to return step-by-step metallurgical solutions. We use these prompts strictly to deliver the educational output you requested. We may analyze aggregated, anonymized usage data to improve our machine-learning models and syllabus accuracy over time.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-800 text-base">3. Data Security</h3>
                <p className="mt-1">
                  We implement standard security protocols to protect data during transmission (e.g., HTTPS). Because your study logs are kept locally, they are as secure as your personal device. We recommend not sharing sensitive industrial secrets in the public educational tool.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-800 text-base">4. Changes to This Policy</h3>
                <p className="mt-1">
                  We reserve the right to update this Privacy Policy as we add new features (such as user accounts or cloud syncing). Any changes will be posted on this page.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 p-4 rounded-xl">
            <h3 className="font-bold text-slate-800 text-sm mb-2">Contact Us</h3>
            <p className="text-xs">
              If you have any questions or concerns about this Privacy Policy, please contact the developer:
            </p>
            <ul className="mt-2 text-xs space-y-1 text-slate-700">
              <li><strong>Developer:</strong> joshwebs</li>
              <li><strong>Email:</strong> joshuamujakari15@gmail.com</li>
              <li><strong>Phone:</strong> 0789932832</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
