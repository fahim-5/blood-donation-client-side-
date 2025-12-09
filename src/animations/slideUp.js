/**
 * Slide Up Animation Variants
 * For upward sliding animations
 */

import { motion } from 'framer-motion';

// Basic slide up
export const slideUp = {
  hidden: { 
    y: "100%",
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: { 
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  }
};

// Slide up from bottom with spring
export const slideUpSpring = {
  hidden: { 
    y: "100%",
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      mass: 0.5
    }
  },
  exit: { 
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Quick slide up
export const slideUpQuick = {
  hidden: { 
    y: "100%",
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Slide up with scale
export const slideUpScale = {
  hidden: { 
    y: "50%",
    scale: 0.9,
    opacity: 0 
  },
  visible: { 
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: { 
    y: "50%",
    scale: 0.9,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  }
};

// Slide up with delay
export const createSlideUpWithDelay = (delay = 0) => ({
  hidden: { 
    y: "100%",
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: delay,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: { 
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  }
});

// Slide up from custom position
export const createSlideUpFrom = (from = "100%") => ({
  hidden: { 
    y: from,
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: { 
    y: from,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  }
});

// Component for slide up animation
export const SlideUp = ({ children, variant = 'default', delay = 0, from = "100%", ...props }) => {
  const variants = {
    default: slideUp,
    spring: slideUpSpring,
    quick: slideUpQuick,
    scale: slideUpScale,
  };
  
  const selectedVariant = variants[variant] || slideUp;
  
  // Customize based on 'from' prop
  const customVariant = variant === 'custom' 
    ? createSlideUpFrom(from)
    : selectedVariant;
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={customVariant}
      transition={{
        ...customVariant.visible?.transition,
        delay: delay
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Modal slide up (from bottom)
export const modalSlideUp = {
  hidden: { 
    y: "100%",
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 250,
      mass: 0.8
    }
  },
  exit: { 
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Drawer slide up
export const drawerSlideUp = {
  hidden: { 
    y: "100%",
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: { 
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Toast notification slide up
export const toastSlideUp = {
  hidden: { 
    y: "100%",
    opacity: 0,
    scale: 0.9 
  },
  visible: { 
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  },
  exit: { 
    y: "100%",
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Bottom sheet slide up
export const bottomSheetSlideUp = {
  hidden: { 
    y: "100%",
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      mass: 1
    }
  },
  exit: { 
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Popup menu slide up
export const popupSlideUp = {
  hidden: { 
    y: "20%",
    opacity: 0,
    scale: 0.95 
  },
  visible: { 
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    y: "20%",
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Tooltip slide up
export const tooltipSlideUp = {
  hidden: { 
    y: 10,
    opacity: 0,
    scale: 0.95 
  },
  visible: { 
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    y: 10,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
};

// Floating action button slide up
export const fabSlideUp = {
  hidden: { 
    y: 100,
    opacity: 0,
    scale: 0.8 
  },
  visible: { 
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200
    }
  },
  exit: { 
    y: 100,
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Input field slide up (for labels)
export const inputLabelSlideUp = {
  hidden: { 
    y: 20,
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    y: 20,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
};

// Card stack slide up
export const cardStackSlideUp = (index) => ({
  hidden: { 
    y: 50 * (index + 1),
    opacity: 0,
    scale: 0.9 
  },
  visible: { 
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: index * 0.1,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: { 
    y: 50,
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
});

// Table row slide up
export const tableRowSlideUp = (index) => ({
  hidden: { 
    y: 20,
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: index * 0.05,
      ease: "easeOut"
    }
  },
  exit: { 
    y: -20,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
});

// List item slide up
export const listItemSlideUp = (index) => ({
  hidden: { 
    y: 30,
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: index * 0.1,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: { 
    y: -30,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
});

// Stats card slide up
export const statsCardSlideUp = (index) => ({
  hidden: { 
    y: 40,
    opacity: 0,
    scale: 0.95 
  },
  visible: { 
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: index * 0.15,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: { 
    y: 40,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  }
});

// Progress indicator slide up
export const progressSlideUp = {
  hidden: { 
    y: "100%",
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

// Loading spinner slide up
export const spinnerSlideUp = {
  hidden: { 
    y: 20,
    opacity: 0,
    scale: 0.8 
  },
  visible: { 
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100
    }
  },
  exit: { 
    y: 20,
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Error message slide up
export const errorSlideUp = {
  hidden: { 
    y: "100%",
    opacity: 0,
    scale: 0.95 
  },
  visible: { 
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 250
    }
  },
  exit: { 
    y: "100%",
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Success message slide up
export const successSlideUp = {
  hidden: { 
    y: "100%",
    opacity: 0,
    scale: 0.95 
  },
  visible: { 
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 250
    }
  },
  exit: { 
    y: "100%",
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Hook for slide up animation
export const useSlideUp = (variant = 'default', delay = 0, from = "100%") => {
  const variants = {
    default: slideUp,
    spring: slideUpSpring,
    quick: slideUpQuick,
    scale: slideUpScale,
    modal: modalSlideUp,
    drawer: drawerSlideUp,
    toast: toastSlideUp,
    bottomSheet: bottomSheetSlideUp,
    popup: popupSlideUp,
    tooltip: tooltipSlideUp,
    fab: fabSlideUp,
  };
  
  const selectedVariant = variants[variant] || slideUp;
  
  // Customize based on 'from' prop
  const customVariant = variant === 'custom' 
    ? createSlideUpFrom(from)
    : selectedVariant;
  
  return {
    initial: "hidden",
    animate: "visible",
    exit: "exit",
    variants: customVariant,
    transition: {
      ...customVariant.visible?.transition,
      delay: delay
    }
  };
};

// HOC for slide up animation
export const withSlideUp = (Component, variant = 'default', delay = 0, from = "100%") => {
  const slideUpProps = useSlideUp(variant, delay, from);
  
  return (props) => (
    <motion.div {...slideUpProps}>
      <Component {...props} />
    </motion.div>
  );
};

// Sequential slide up animations
export const createSequentialSlideUp = (count, baseDelay = 0, stagger = 0.1) => {
  return Array.from({ length: count }, (_, index) => ({
    hidden: { 
      y: "100%",
      opacity: 0 
    },
    visible: { 
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: baseDelay + (index * stagger),
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    },
    exit: { 
      y: "100%",
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  }));
};

export default {
  // Basic variants
  slideUp,
  slideUpSpring,
  slideUpQuick,
  slideUpScale,
  
  // Factory functions
  createSlideUpWithDelay,
  createSlideUpFrom,
  
  // Components
  SlideUp,
  withSlideUp,
  useSlideUp,
  
  // Component-specific variants
  modalSlideUp,
  drawerSlideUp,
  toastSlideUp,
  bottomSheetSlideUp,
  popupSlideUp,
  tooltipSlideUp,
  fabSlideUp,
  inputLabelSlideUp,
  cardStackSlideUp,
  tableRowSlideUp,
  listItemSlideUp,
  statsCardSlideUp,
  progressSlideUp,
  spinnerSlideUp,
  errorSlideUp,
  successSlideUp,
  
  // Utility functions
  createSequentialSlideUp,
};