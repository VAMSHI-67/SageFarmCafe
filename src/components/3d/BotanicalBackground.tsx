'use client';

import { useEffect, useRef } from 'react';

export default function BotanicalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Organic particle system
    const particles: {
      x: number; y: number; size: number; speed: number;
      opacity: number; type: 'spore' | 'leaf' | 'ring';
      rotation: number; rotSpeed: number; drift: number;
    }[] = [];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 1200),
        y: Math.random() * (canvas.height || 800),
        size: Math.random() * 6 + 2,
        speed: Math.random() * 0.3 + 0.08,
        opacity: Math.random() * 0.15 + 0.04,
        type: ['spore', 'leaf', 'ring'][Math.floor(Math.random() * 3)] as any,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        drift: Math.random() * 2 - 1,
      });
    }

    // Flowing vine curves
    const vines: { startX: number; startY: number; length: number; angle: number; speed: number }[] = [];
    for (let i = 0; i < 6; i++) {
      vines.push({
        startX: Math.random() * (canvas.width || 1200),
        startY: Math.random() * (canvas.height || 800),
        length: Math.random() * 200 + 100,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.002 + 0.001,
      });
    }

    function drawLeaf(context: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, opacity: number) {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = opacity;
      context.beginPath();
      context.moveTo(0, -size * 1.5);
      context.bezierCurveTo(size, -size, size, size * 0.5, 0, size * 1.5);
      context.bezierCurveTo(-size, size * 0.5, -size, -size, 0, -size * 1.5);
      context.fillStyle = '#5F7C60';
      context.fill();
      context.beginPath();
      context.moveTo(0, -size * 1.2);
      context.lineTo(0, size * 1.2);
      context.strokeStyle = '#8FA58F';
      context.lineWidth = 0.5;
      context.stroke();
      context.restore();
    }

    function drawSpore(context: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) {
      context.save();
      context.globalAlpha = opacity;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fillStyle = '#C46849';
      context.fill();
      context.beginPath();
      context.arc(x, y, size * 0.5, 0, Math.PI * 2);
      context.fillStyle = '#DCB3A3';
      context.fill();
      context.restore();
    }

    function drawRing(context: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) {
      context.save();
      context.globalAlpha = opacity * 0.6;
      context.beginPath();
      context.arc(x, y, size * 2, 0, Math.PI * 2);
      context.strokeStyle = '#AEC7AD';
      context.lineWidth = 0.8;
      context.setLineDash([2, 3]);
      context.stroke();
      context.restore();
    }

    function drawVineCurve(context: CanvasRenderingContext2D, vine: typeof vines[0], t: number) {
      context.save();
      context.globalAlpha = 0.06;
      context.beginPath();
      const phase = t * vine.speed;
      for (let i = 0; i < vine.length; i++) {
        const progress = i / vine.length;
        const px = vine.startX + Math.cos(vine.angle + progress * 4 + phase) * 60 * progress;
        const py = vine.startY + i * 1.2 + Math.sin(phase + progress * 6) * 20;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.strokeStyle = '#5F7C60';
      context.lineWidth = 1.5;
      context.stroke();
      context.restore();
    }

    function drawGrowthRings(context: CanvasRenderingContext2D, cx: number, cy: number, t: number) {
      for (let i = 0; i < 4; i++) {
        const radius = 80 + i * 60 + Math.sin(t * 0.2 + i) * 10;
        context.save();
        context.globalAlpha = 0.03 + Math.sin(t * 0.3 + i * 0.5) * 0.015;
        context.beginPath();
        context.arc(cx, cy, radius, 0, Math.PI * 2);
        context.strokeStyle = i % 2 === 0 ? '#8FA58F' : '#C46849';
        context.lineWidth = 1;
        context.setLineDash([6, 8]);
        context.stroke();
        context.restore();
      }
    }

    const animate = () => {
      if (!canvas || !ctx) return;
      time += 1;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      drawGrowthRings(ctx, w * 0.15, h * 0.2, time * 0.02);
      drawGrowthRings(ctx, w * 0.85, h * 0.75, time * 0.025);

      vines.forEach(v => drawVineCurve(ctx, v, time));

      particles.forEach(p => {
        p.y -= p.speed;
        p.x += Math.sin(time * 0.01 + p.drift) * 0.2;
        p.rotation += p.rotSpeed;

        if (p.y < -20) {
          p.y = h + 20;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        const breathe = Math.sin(time * 0.015 + p.x * 0.01) * 0.03;

        if (p.type === 'leaf') {
          drawLeaf(ctx, p.x, p.y, p.size, p.rotation, p.opacity + breathe);
        } else if (p.type === 'spore') {
          drawSpore(ctx, p.x, p.y, p.size, p.opacity + breathe);
        } else {
          drawRing(ctx, p.x, p.y, p.size, p.opacity + breathe);
        }
      });

      const gridSpacing = 80;
      const gridOff = (time * 0.05) % gridSpacing;
      ctx.save();
      ctx.globalAlpha = 0.035;
      for (let x = gridOff; x < w; x += gridSpacing) {
        for (let y = gridOff; y < h; y += gridSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = '#5F7C60';
          ctx.fill();
        }
      }
      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
