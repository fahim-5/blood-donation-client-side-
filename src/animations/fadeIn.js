/**
 * Fade In Animation Variants
 * For smooth fade-in effects with different directions
 */

import { motion } from 'framer-motion';

// Basic fade in
export const fadeIn = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Fade in from bottom
export const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Fade in from top
export const fadeInDown = {
  hidden: { 
    opacity: 0, 
    y: -20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Fade in from left
export const fadeInLeft = {
  hidden: { 
    opacity: 0, 
    x: -30 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: { 
    opacity: 0, 
    x: 30,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Fade in from right
export const fadeInRight = {
  hidden: { 
    opacity: 0, 
    x: 30 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: { 
    opacity: 0, 
    x: -30,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Fade in with scale
export const fadeInScale = {
  hidden: { 
    opacity: 0, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Slow fade in (for background elements)
export const fadeInSlow = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Quick fade in (for interactive elements)
export const fadeInQuick = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
};

// Fade in with delay
export const createFadeInWithDelay = (delay = 0) => ({
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: delay,
      ease: "easeInOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
});

// Fade in with custom duration
export const createFadeInWithDuration = (duration = 0.4) => ({
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: duration,
      ease: "easeInOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: duration * 0.75,
      ease: "easeOut"
    }
  }
});

// Component for fade in animation
export const FadeIn = ({ children, variant = 'default', delay = 0, ...props }) => {
  const variants = {
    default: fadeIn,
    up: fadeInUp,
    down: fadeInDown,
    left: fadeInLeft,
    right: fadeInRight,
    scale: fadeInScale,
    slow: fadeInSlow,
    quick: fadeInQuick,
  };
  
  const selectedVariant = variants[variant] || fadeIn;
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={selectedVariant}
      transition={{
        ...selectedVariant.visible?.transition,
        delay: delay
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// HOC for fade in animation
export const withFadeIn = (Component, variant = 'default', delay = 0) => {
  const variants = {
    default: fadeIn,
    up: fadeInUp,
    down: fadeInDown,
    left: fadeInLeft,
    right: fadeInRight,
    scale: fadeInScale,
  };
  
  const selectedVariant = variants[variant] || fadeIn;
  
  return (props) => (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={selectedVariant}
      transition={{
        ...selectedVariant.visible?.transition,
        delay: delay
      }}
    >
      <Component {...props} />
    </motion.div>
  );
};

// Hook for fade in animation
export const useFadeIn = (variant = 'default', delay = 0) => {
  const variants = {
    default: fadeIn,
    up: fadeInUp,
    down: fadeInDown,
    left: fadeInLeft,
    right: fadeInRight,
    scale: fadeInScale,
    slow: fadeInSlow,
    quick: fadeInQuick,
  };
  
  const selectedVariant = variants[variant] || fadeIn;
  
  return {
    initial: "hidden",
    animate: "visible",
    exit: "exit",
    variants: selectedVariant,
    transition: {
      ...selectedVariant.visible?.transition,
      delay: delay
    }
  };
};

// Page transition fade in
export const pageFadeIn = {
  initial: { 
    opacity: 0,
    y: 20 
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Modal fade in
export const modalFadeIn = {
  hidden: { 
    opacity: 0,
    scale: 0.9 
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Card fade in
export const cardFadeIn = {
  hidden: { 
    opacity: 0,
    y: 20 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeIn"
    }
  }
};

// Button fade in
export const buttonFadeIn = {
  hidden: { 
    opacity: 0,
    scale: 0.95 
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeIn"
    }
  }
};

// List item fade in
export const listItemFadeIn = {
  hidden: { 
    opacity: 0,
    x: -20 
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Table row fade in
export const tableRowFadeIn = {
  hidden: { 
    opacity: 0,
    y: 10 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Alert/Notification fade in
export const alertFadeIn = {
  hidden: { 
    opacity: 0,
    x: -30,
    scale: 0.95 
  },
  visible: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      type: "spring",
      damping: 20,
      stiffness: 200
    }
  },
  exit: { 
    opacity: 0,
    x: 30,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Progress bar fade in
export const progressFadeIn = {
  hidden: { 
    width: 0,
    opacity: 0 
  },
  visible: { 
    width: "100%",
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

// Skeleton fade in (pulse effect)
export const skeletonFadeIn = {
  hidden: { 
    opacity: 0.5 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

// Text fade in (for typography)
export const textFadeIn = {
  hidden: { 
    opacity: 0,
    y: 10 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

// Image fade in (for lazy loading)
export const imageFadeIn = {
  hidden: { 
    opacity: 0,
    scale: 1.05,
    filter: "blur(10px)" 
  },
  visible: { 
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Overlay fade in
export const overlayFadeIn = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

export default {
  // Basic variants
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fadeInScale,
  fadeInSlow,
  fadeInQuick,
  
  // Factory functions
  createFadeInWithDelay,
  createFadeInWithDuration,
  
  // Components
  FadeIn,
  withFadeIn,
  useFadeIn,
  
  // Component-specific variants
  pageFadeIn,
  modalFadeIn,
  cardFadeIn,
  buttonFadeIn,
  listItemFadeIn,
  tableRowFadeIn,
  alertFadeIn,
  progressFadeIn,
  skeletonFadeIn,
  textFadeIn,
  imageFadeIn,
  overlayFadeIn,
};