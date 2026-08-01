import { useRef, ReactNode, MouseEvent } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';

interface MagneticButtonProps {
  children: ReactNode;
  variant?: Variant;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<Variant, string> = {
  primary: 'gradient-brand text-black shadow-[0_0_40px_-10px_rgba(217,70,239,0.6)] hover:opacity-90',
  secondary: 'bg-transparent border border-[#D946EF] text-white hover:bg-white/5',
  ghost: 'bg-transparent text-white underline underline-offset-4 hover:text-[#D946EF]',
};

export function MagneticButton({
  children,
  variant = 'primary',
  onClick,
  className,
  type = 'button',
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  function handleMouseMove(e: MouseEvent<HTMLButtonElement>) {
    const rect = ref.current!.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.button
      ref={ref}
      type={type}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        'rounded-full h-14 px-8 font-medium tracking-wide uppercase text-sm transition-opacity cursor-pointer',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </m.button>
  );
}
