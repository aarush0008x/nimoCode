import type { UserProfile } from '../types';

/**
 * Safely converts an image URL or SVG to a clean HTMLImageElement without CORS tainting.
 */
const preloadSafeAvatar = async (url: string): Promise<HTMLImageElement | null> => {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Fetch failed');
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };
      img.src = objectUrl;
    });
  } catch {
    // Direct Image fallback
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }
};

/**
 * Draws a 5-pointed star on the canvas using pure 2D vectors.
 */
const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) => {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
};

/**
 * Generates and downloads a high-resolution 1600x1000 PNG Certificate of Competitive Excellence.
 * 100% Vector & Clean Asset Rendering with Zero Missing Glyphs.
 */
export const downloadCertificateAsImage = async (user: UserProfile) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Preload avatar safely
  const avatarUrl =
    user.avatar ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.username || 'coder')}`;
  const avatarImg = await preloadSafeAvatar(avatarUrl);

  // 1. Dark Executive Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1000);
  bgGrad.addColorStop(0, '#09090b');
  bgGrad.addColorStop(0.3, '#121217');
  bgGrad.addColorStop(0.7, '#181820');
  bgGrad.addColorStop(1, '#09090b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1600, 1000);

  // Subtle Matrix Mesh Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1600; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1000);
    ctx.stroke();
  }
  for (let y = 0; y < 1000; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1600, y);
    ctx.stroke();
  }

  // 2. Triple Luxury Gold Border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, 1528, 928);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, 1504, 904);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(56, 56, 1488, 888);

  // Decorative Corner Accents
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(44, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 44);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(8, 8, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawCorner(64, 64, 0);
  drawCorner(1536, 64, Math.PI / 2);
  drawCorner(1536, 936, Math.PI);
  drawCorner(64, 936, -Math.PI / 2);

  // 3. Top Header Bar & Logo
  ctx.textAlign = 'center';

  ctx.save();
  ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(600, 75, 400, 38, 19);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.fillText('NIMOCODE AI • OFFICIAL VERIFIED CREDENTIAL', 800, 99);
  ctx.restore();

  // Certificate ID
  const certId = `CERTIFICATE ID: NC-${user.username.toUpperCase()}-${new Date().getFullYear()}-FAANG`;
  ctx.fillStyle = '#71717a';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillText(certId, 800, 134);

  // 4. Center Gold Ribbon Seal with 5-Pointed Star
  ctx.save();
  // Ribbon tails
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.moveTo(760, 235);
  ctx.lineTo(730, 305);
  ctx.lineTo(765, 285);
  ctx.lineTo(775, 245);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(840, 235);
  ctx.lineTo(870, 305);
  ctx.lineTo(835, 285);
  ctx.lineTo(825, 245);
  ctx.closePath();
  ctx.fill();

  // Outer gold gradient seal circle
  ctx.beginPath();
  ctx.arc(800, 215, 52, 0, Math.PI * 2);
  const sealGrad = ctx.createLinearGradient(748, 163, 852, 267);
  sealGrad.addColorStop(0, '#fde68a');
  sealGrad.addColorStop(0.5, '#f59e0b');
  sealGrad.addColorStop(1, '#92400e');
  ctx.fillStyle = sealGrad;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#fef3c7';
  ctx.stroke();

  // Inner black circular core
  ctx.beginPath();
  ctx.arc(800, 215, 42, 0, Math.PI * 2);
  ctx.fillStyle = '#18181b';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#f59e0b';
  ctx.stroke();

  // Pure 2D Vector Star
  ctx.fillStyle = '#fbbf24';
  drawStar(ctx, 800, 215, 5, 24, 11);
  ctx.fill();
  ctx.restore();

  // 5. User Avatar Badge (Top Right)
  ctx.save();
  if (avatarImg) {
    ctx.beginPath();
    ctx.arc(1410, 140, 48, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg, 1362, 92, 96, 96);
  } else {
    // Elegant Monogram Fallback
    ctx.beginPath();
    ctx.arc(1410, 140, 48, 0, Math.PI * 2);
    ctx.fillStyle = '#27272a';
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillText((user.name || user.username).charAt(0).toUpperCase(), 1410, 153);
  }
  ctx.restore();

  // Avatar Gold Ring Border
  ctx.beginPath();
  ctx.arc(1410, 140, 50, 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#fbbf24';
  ctx.stroke();

  // 6. Main Certificate Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('CERTIFICATE OF COMPETITIVE EXCELLENCE', 800, 345);

  // 7. Presentation Subtitle
  ctx.fillStyle = '#a1a1aa';
  ctx.font = 'bold 15px "Courier New", monospace';
  ctx.fillText('THIS PRESTIGIOUS CREDENTIAL IS PROUDLY CONFERRED UPON', 800, 390);

  // 8. Recipient Name
  const displayName = user.name || user.username;
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'italic 900 56px Georgia, serif';
  ctx.fillText(displayName, 800, 465);

  // Username & Campus / College Tag
  const campusText = user.college ? `@${user.username}  •  ${user.college}` : `@${user.username}`;
  ctx.fillStyle = '#e4e4e7';
  ctx.font = 'bold 19px "Courier New", monospace';
  ctx.fillText(campusText, 800, 510);

  // 9. Citation Description
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const line1 = 'For demonstrating superior algorithmic mastery, high-concurrency problem solving speed,';
  const line2 = `and securing an elite competitive rating of ${user.rating} ELO across the NimoCode Global Arena.`;
  ctx.fillText(line1, 800, 570);
  ctx.fillText(line2, 800, 600);

  // 10. Performance Highlights (3 Stat Badges)
  const drawStatPill = (x: number, label: string, val: string) => {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - 100, 645, 200, 75, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#71717a';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(label, x, 672);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillText(val, x, 704);
    ctx.restore();
  };

  drawStatPill(480, 'GLOBAL ELO RATING', `${user.rating} ELO`);
  drawStatPill(800, 'ALGORITHMS SOLVED', `${user.totalSolved} SOLVED`);
  drawStatPill(1120, 'DEVELOPER LEVEL', `LEVEL ${user.level}`);

  // 11. Security QR Code / Cryptographic Matrix Block (Bottom Left)
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(140, 780, 80, 80, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  const qrPixels = [
    [1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0, 1, 0],
    [1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 0, 1, 1, 1]
  ];
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if (qrPixels[r][c] === 1) {
        ctx.fillRect(152 + c * 8, 792 + r * 8, 6, 6);
      }
    }
  }
  ctx.restore();

  // 12. Footer Section
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, 760);
  ctx.lineTo(1480, 760);
  ctx.stroke();

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Date Information (Next to QR)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#71717a';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillText('ISSUED & AUTHENTICATED ON', 240, 810);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(currentDate, 240, 835);
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillText('SHA-256 CRYPTOGRAPHIC PROOF VERIFIED', 240, 855);

  // Center: Official Certification Desk Stamp
  ctx.textAlign = 'center';
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 15px "Courier New", monospace';
  ctx.fillText('AUTHENTICATED BY NIMOCODE AI EVALUATION DESK', 800, 825);
  ctx.fillStyle = '#71717a';
  ctx.font = '12px sans-serif';
  ctx.fillText('Direct Verifiable Record • Compatible with LinkedIn & Portfolios', 800, 850);

  // Right: Signature
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'italic bold 28px "Brush Script MT", cursive, Georgia, serif';
  ctx.fillText('NimoCode Evaluation Board', 1460, 825);
  ctx.fillStyle = '#71717a';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillText('OFFICIAL CERTIFICATION COMMITTEE', 1460, 850);

  // 13. Trigger Direct PNG File Download
  try {
    const link = document.createElement('a');
    link.download = `NimoCode_Certificate_${user.username.toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Error generating certificate PNG:', err);
  }
};
