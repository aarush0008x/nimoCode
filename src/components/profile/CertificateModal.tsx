import React from 'react';
import { Award, Download, X, ShieldCheck, Sparkles } from 'lucide-react';
import type { UserProfile } from '../../types';

interface CertificateModalProps {
  user: UserProfile;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ user, onClose }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative space-y-6 p-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div id="printable-certificate" className="p-10 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border-4 border-amber-500/30 text-center space-y-6 relative shadow-inner">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              NIMOCODE AI OFFICIAL VERIFIED CERTIFICATE
            </div>
            <span className="text-[10px] font-mono text-neutral-500">ID: CERT-{user.username.toUpperCase()}-2026</span>
          </div>

          <div className="space-y-2 py-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-xl">
              <Award className="w-9 h-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase pt-2">
              Certificate of Competitive Excellence
            </h2>
            <p className="text-xs text-neutral-400 font-mono">This is officially awarded to</p>
          </div>

          <div className="py-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight font-serif italic">
              {user.name} (@{user.username})
            </div>
            <div className="text-xs font-mono text-neutral-300 mt-2">
              For demonstrating mastery in Data Structures & Competitive Algorithms with a peak rating of <strong className="text-amber-400">{user.rating} ELO</strong>.
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-left text-xs font-mono gap-4">
            <div>
              <div className="text-neutral-500 uppercase text-[10px]">Issued Date</div>
              <div className="text-white font-bold">{currentDate}</div>
            </div>

            <div className="text-center sm:text-right">
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                VERIFIED FAANG READY
              </div>
              <div className="text-[10px] text-neutral-500">Authenticated via NimoCode AI Engine</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handlePrintCertificate}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download & Print Certificate (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
