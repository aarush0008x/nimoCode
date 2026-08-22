import type { UserProfile } from '../types';

/**
 * Generates and downloads a high-resolution 1600x1000 PNG Certificate of Competitive Excellence.
 */
export const downloadCertificateAsImage = (user: UserProfile) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1000);
  bgGrad.addColorStop(0, '#09090b');
  bgGrad.addColorStop(0.5, '#121215');
  bgGrad.addColorStop(1, '#09090b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1600, 1000);

  // Background subtle grid/mesh pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
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

  // 2. Gold Luxury Outer Border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, 1520, 920);

  // Inner Gold Border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(55, 55, 1490, 890);

  // Decorative Corner Accents
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 40);
    ctx.stroke();
    ctx.restore();
  };

  drawCorner(65, 65, 0);
  drawCorner(1535, 65, Math.PI / 2);
  drawCorner(1535, 935, Math.PI);
  drawCorner(65, 935, -Math.PI / 2);

  // 3. Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 18px "Courier New", monospace';
  ctx.fillText('? NIMOCODE AI ? OFFICIAL VERIFIED CERTIFICATE OF EXCELLENCE ?', 800, 120);

  // Certificate ID & Security Hash
  const certId = `ID: CERT-${user.username.toUpperCase()}-${new Date().getFullYear()}`;
  ctx.fillStyle = '#71717a';
  ctx.font = '14px "Courier New", monospace';
  ctx.fillText(certId, 800, 150);

  // 4. Gold Seal Icon Badge
  ctx.save();
  ctx.beginPath();
  ctx.arc(800, 230, 45, 0, Math.PI * 2);
  const sealGrad = ctx.createLinearGradient(755, 185, 845, 275);
  sealGrad.addColorStop(0, '#fbbf24');
  sealGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = sealGrad;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#fde68a';
  ctx.stroke();

  // Seal Star
  ctx.fillStyle = '#09090b';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('?', 800, 242);
  ctx.restore();

  // 5. Main Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('CERTIFICATE OF COMPETITIVE EXCELLENCE', 800, 340);

  // 6. Presentation Line
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '600 18px sans-serif';
  ctx.fillText('THIS IS OFFICIALLY PRESENTED TO', 800, 390);

  // 7. Recipient Name
  const displayName = user.name || user.username;
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'italic 900 58px Georgia, serif';
  ctx.fillText(displayName, 800, 470);

  // Username & Campus
  const subTitleText = user.college ? `@${user.username} ? ?? ${user.college}` : `@${user.username}`;
  ctx.fillStyle = '#d4d4d8';
  ctx.font = 'bold 20px "Courier New", monospace';
  ctx.fillText(subTitleText, 800, 520);

  // 8. Citation Description
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const line1 = 'For demonstrating exceptional algorithmic problem solving mastery, high-speed code execution,';
  const line2 = `and achieving an elite competitive rating of ${user.rating} ELO across the NimoCode Global Arena.`;
  ctx.fillText(line1, 800, 590);
  ctx.fillText(line2, 800, 625);

  // 9. Stats Highlight Pills
  const drawStatPill = (x: number, label: string, val: string) => {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - 90, 670, 180, 70, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#71717a';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(label, x, 695);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillText(val, x, 725);
    ctx.restore();
  };

  drawStatPill(500, 'PEAK RATING', `${user.rating} ELO`);
  drawStatPill(800, 'PROBLEMS SOLVED', `${user.totalSolved} SOLVED`);
  drawStatPill(1100, 'CODER LEVEL', `LEVEL ${user.level}`);

  // 10. Footer Section
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, 790);
  ctx.lineTo(1480, 790);
  ctx.stroke();

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Left: Date
  ctx.textAlign = 'left';
  ctx.fillStyle = '#71717a';
  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.fillText('DATE OF ISSUANCE', 140, 835);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText(currentDate, 140, 865);

  // Center: Verification Seal
  ctx.textAlign = 'center';
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.fillText('? CRYPTOGRAPHICALLY VERIFIED', 800, 840);
  ctx.fillStyle = '#71717a';
  ctx.font = '13px sans-serif';
  ctx.fillText('Authenticated via NimoCode Distributed Verification Protocol', 800, 865);

  // Right: Signature
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'italic bold 26px "Brush Script MT", cursive, Georgia, serif';
  ctx.fillText('NimoCode Evaluation Board', 1460, 840);
  ctx.fillStyle = '#71717a';
  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.fillText('OFFICIAL CERTIFICATION DESK', 1460, 865);

  // 11. Trigger Download
  const link = document.createElement('a');
  link.download = `NimoCode_Certificate_${user.username.toLowerCase()}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
