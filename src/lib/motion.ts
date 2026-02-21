import { useReducedMotion } from 'framer-motion';

export const useMotionPreferences = () => {
  const shouldReduceMotion = useReducedMotion();
  return { shouldReduceMotion };
};

export const springConfig = {
  stiff: { type: 'spring', stiffness: 300, damping: 20 },
  bouncy: { type: 'spring', stiffness: 200, damping: 12 },
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  slow: { type: 'spring', stiffness: 50, damping: 20 },
};

export const transitionVariations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

export const generateStaggerConfig = (staggerChildren = 0.1, delayChildren = 0) => ({
  animate: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});
