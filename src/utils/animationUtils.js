/**
 * Animation Utility Functions
 * Provides reusable animation configurations for Framer Motion
 */

// Basic Animations
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

// Scale Animations
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
};

// Slide Animations
export const slideInUp = {
  hidden: { y: '100%' },
  visible: { y: 0 },
  exit: { y: '100%' },
};

export const slideInDown = {
  hidden: { y: '-100%' },
  visible: { y: 0 },
  exit: { y: '-100%' },
};

export const slideInLeft = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
  exit: { x: '-100%' },
};

export const slideInRight = {
  hidden: { x: '100%' },
  visible: { x: 0 },
  exit: { x: '100%' },
};

// Stagger Animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerChildren = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// Page Transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

export const modalTransition = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { type: 'spring', damping: 25, stiffness: 300 },
};

// Card Animations
export const cardHover = {
  scale: 1.02,
  y: -5,
  transition: { type: 'spring', stiffness: 300 },
};

export const cardTap = {
  scale: 0.98,
};

// Button Animations
export const buttonHover = {
  scale: 1.05,
  transition: { type: 'spring', stiffness: 400, damping: 10 },
};

export const buttonTap = {
  scale: 0.95,
};

// List Item Animations
export const listItem = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

// Loading Animations
export const loadingPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const loadingSpin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Shake Animation
export const shake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

// Bounce Animation
export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

// Pulse Animation
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
    },
  },
};

// Wobble Animation
export const wobble = {
  animate: {
    rotate: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
    },
  },
};

// Flip Animation
export const flip = {
  animate: {
    rotateY: [0, 180, 0],
    transition: {
      duration: 0.8,
    },
  },
};

// Attention Seekers
export const attentionSeekers = {
  bounce: {
    animate: {
      y: [0, -30, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 1,
      },
    },
  },
  flash: {
    animate: {
      opacity: [1, 0, 1, 0, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
      },
    },
  },
  rubberBand: {
    animate: {
      scale: [1, 1.25, 0.75, 1.15, 0.95, 1],
      transition: {
        duration: 0.8,
      },
    },
  },
  tada: {
    animate: {
      scale: [1, 0.9, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
      rotate: [0, -3, -3, -3, 3, -3, 3, -3, 3, 0],
      transition: {
        duration: 1,
      },
    },
  },
};

// Transition Presets
export const transitions = {
  default: { duration: 0.3, ease: 'easeInOut' },
  spring: { type: 'spring', stiffness: 300, damping: 25 },
  quick: { duration: 0.15, ease: 'easeOut' },
  slow: { duration: 0.5, ease: 'easeInOut' },
  bounce: { type: 'spring', stiffness: 400, damping: 10 },
};

// Easing Functions
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
};

// Animation Variants for Components
export const componentVariants = {
  // Card component
  card: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, scale: 1.02 },
    tap: { scale: 0.98 },
  },
  
  // Button component
  button: {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    loading: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
      },
    },
  },
  
  // Modal component
  modal: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  
  // Alert component
  alert: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  // Notification component
  notification: {
    hidden: { opacity: 0, y: -20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.9 },
  },
  
  // Dropdown component
  dropdown: {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  },
  
  // Tooltip component
  tooltip: {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 5 },
  },
  
  // Progress bar
  progress: {
    initial: { width: 0 },
    animate: { width: '100%' },
  },
  
  // Skeleton loader
  skeleton: {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
  },
};

// Animation Hooks
export const useAnimationConfig = (type = 'fadeIn', delay = 0) => {
  const animations = {
    fadeIn,
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    slideInUp,
  };
  
  const animation = animations[type] || fadeIn;
  
  return {
    ...animation,
    transition: {
      ...animation.transition,
      delay,
    },
  };
};

// Stagger function
export const createStagger = (staggerAmount = 0.1, delayChildren = 0) => {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerAmount,
        delayChildren,
      },
    },
  };
};

// Sequential animation
export const createSequence = (items, animationType = 'fadeInUp', stagger = 0.1) => {
  return items.map((_, index) => ({
    ...useAnimationConfig(animationType),
    transition: {
      ...useAnimationConfig(animationType).transition,
      delay: index * stagger,
    },
  }));
};

// Parallax effect
export const parallax = (distance = 50) => ({
  initial: { y: distance, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 },
});

// Scroll triggered animations
export const scrollReveal = {
  hidden: { opacity: 0, y: 75 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

// Masonry grid animation
export const masonryItem = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
};

// Typewriter effect
export const typewriter = {
  hidden: { width: 0 },
  visible: {
    width: '100%',
    transition: {
      duration: 1,
      ease: 'linear',
    },
  },
};

// Counter animation
export const counter = {
  animate: (value) => ({
    count: value,
    transition: {
      duration: 1,
      ease: 'easeOut',
    },
  }),
};

// Wave animation
export const wave = {
  animate: {
    rotate: [0, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 2,
    },
  },
};

// Heartbeat animation
export const heartbeat = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

// Utility function to combine animations
export const combineAnimations = (...animations) => {
  const combined = {};
  
  animations.forEach(anim => {
    Object.keys(anim).forEach(key => {
      if (!combined[key]) {
        combined[key] = {};
      }
      Object.assign(combined[key], anim[key]);
    });
  });
  
  return combined;
};

// Get animation by name
export const getAnimation = (name, customProps = {}) => {
  const animations = {
    fadeIn,
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    scaleUp,
    slideInUp,
    slideInDown,
    slideInLeft,
    slideInRight,
    staggerContainer,
    ...attentionSeekers,
  };
  
  return {
    ...animations[name],
    ...customProps,
  };
};

export default {
  // Basic Animations
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  scaleUp,
  slideInUp,
  slideInDown,
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerChildren,
  
  // Page Transitions
  pageTransition,
  modalTransition,
  
  // Interactive Animations
  cardHover,
  cardTap,
  buttonHover,
  buttonTap,
  listItem,
  
  // Loading Animations
  loadingPulse,
  loadingSpin,
  
  // Effect Animations
  shake,
  bounce,
  pulse,
  wobble,
  flip,
  
  // Attention Seekers
  ...attentionSeekers,
  
  // Transitions & Easing
  transitions,
  easings,
  
  // Component Variants
  componentVariants,
  
  // Utility Functions
  useAnimationConfig,
  createStagger,
  createSequence,
  parallax,
  scrollReveal,
  masonryItem,
  typewriter,
  counter,
  wave,
  heartbeat,
  combineAnimations,
  getAnimation,
};