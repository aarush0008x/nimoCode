import React, { useState } from 'react';
import { Award, Download, X, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import type { UserProfile } from '../../types';
import { downloadCertificateAsImage } from '../../utils/certificateGenerator';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  user: UserProfile;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ user, onClose }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownloadCertificate = async () => {
    await downloadCertificateAsImage(user);
    setIsDownloaded(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    setTimeout(() => setIsDownloaded(false), 3000);
  };


  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative space-y-6 p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div id="printable-certificate" className="p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border-4 border-amber-500/30 text-center space-y-6 relative shadow-inner">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>NIMOCODE AI OFFICIAL VERIFIED CERTIFICATE</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">ID: CERT-{user.username.toUpperCase()}-2026</span>
          </div>

          <div className="space-y-2 py-3">
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
              {user.name || user.username} (@{user.username})
            </div>
            {user.college && (
              <div className="text-xs font-semibold text-emerald-400 mt-1">
                🎓 {user.college}
              </div>
            )}
            <div className="text-xs font-mono text-neutral-300 mt-2">
              For demonstrating mastery in Data Structures & Competitive Algorithms with a peak rating of <strong className="text-amber-400">{user.rating} ELO</strong>.
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-left text-xs font-mono gap-4">
            <div>
              <div className="text-neutral-500 uppercase text-[10px]">Issued Date</div>
              <div className="text-white font-bold">{currentDate}</div>
            </div>

            <div className="text-center sm:text-right">
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>VERIFIED FAANG READY</span>
              </div>
              <div className="text-[10px] text-neutral-500">Authenticated via NimoCode AI Engine</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-neutral-400 font-mono hidden sm:block">
            High-Resolution 1600x1000 PNG with Cryptographic Seal
          </div>

          <button
            onClick={handleDownloadCertificate}
            className={`px-6 py-3 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2 ${
              isDownloaded
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-neutral-950 hover:scale-102'
            }`}
          >
            {isDownloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Downloaded Successfully!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Certificate (PNG Image)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

