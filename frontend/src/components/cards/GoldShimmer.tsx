import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star } from 'lucide-react';
import CardShell from './CardShell';
import type { CardProps } from '../../types/card';

const GoldShimmer: React.FC<CardProps> = ({ customText, senderName, customStyling, isPreview }) => {
  const accent = customStyling?.primaryColor ?? '#d97706';
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Shimmer particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; size: number; speed: number; angle: number; opacity: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1 + Math.random() * 3,
        speed: 0.5 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2,
        opacity: Math.random(),
      });
    }

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += Math.cos(p.angle) * p.speed * 0.3;
        p.y += Math.sin(p.angle) * p.speed * 0.3 - 0.3;
        p.opacity += 0.02 * (Math.random() > 0.5 ? 1 : -1);
        p.opacity = Math.max(0.1, Math.min(1, p.opacity));
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${p.opacity * 0.8})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <CardShell
      coverFrom="#fef3c7"
      coverTo={accent}
      coverIcon={<Trophy size={36} className="text-white" />}
      interactionHint="Tap to open"
      isPreview={isPreview}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #fefce8 0%, #fffbeb 50%, #fef3c7 100%)' }}
      >
        {/* Shimmer canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: isPreview ? 0 : 0.2 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          {/* Corner stars */}
          {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map(pos => (
            <div key={pos} className={`absolute ${pos} opacity-30`}>
              <Star size={16} fill={accent} style={{ color: accent }} />
            </div>
          ))}

          <motion.div
            animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Trophy size={48} style={{ color: accent }} />
          </motion.div>

          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: accent }}
          >
            <Star size={10} fill={accent} style={{ color: accent }} />
            Congratulations
            <Star size={10} fill={accent} style={{ color: accent }} />
          </motion.div>

          {customText.to && (
            <p className="text-sm italic" style={{ color: accent, fontFamily: 'Cormorant Garamond, serif' }}>
              Dear {customText.to},
            </p>
          )}

          <h2
            className="text-2xl font-bold leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#78350f' }}
          >
            {customText.headline}
          </h2>

          <p className="text-sm leading-relaxed max-w-[200px] italic text-stone-600"
             style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {customText.body}
          </p>

          <div className="flex items-center gap-3">
            <div className="w-8 h-px" style={{ background: accent, opacity: 0.4 }} />
            <p className="text-xs italic text-stone-400" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {customText.signature}{senderName ? `, ${senderName}` : ''}
            </p>
            <div className="w-8 h-px" style={{ background: accent, opacity: 0.4 }} />
          </div>
        </motion.div>
      </div>
    </CardShell>
  );
};

export default GoldShimmer;
