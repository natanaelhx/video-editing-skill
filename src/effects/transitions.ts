export const transitions = {
  fade: { enter: { opacity: [0, 1] }, exit: { opacity: [1, 0] } },
  slideLeft: { enter: { translateX: ["100%", "0%"] }, exit: { translateX: ["0%", "-100%"] } },
  slideRight: { enter: { translateX: ["-100%", "0%"] }, exit: { translateX: ["0%", "100%"] } },
  slideUp: { enter: { translateY: ["100%", "0%"] }, exit: { translateY: ["0%", "-100%"] } },
  slideDown: { enter: { translateY: ["-100%", "0%"] }, exit: { translateY: ["0%", "100%"] } },
  zoom: { enter: { scale: [0, 1], opacity: [0, 1] }, exit: { scale: [1, 1.5], opacity: [1, 0] } },
  blur: { enter: { filter: ["blur(20px)", "blur(0px)"], opacity: [0, 1] }, exit: { filter: ["blur(0px)", "blur(20px)"], opacity: [1, 0] } },
  flip: { enter: { rotateY: [90, 0] }, exit: { rotateY: [0, -90] } },
};

export const filters = {
  cinematic: "brightness(0.95) contrast(1.3) saturate(0.85) sepia(0.15)",
  vintage: "brightness(1.1) contrast(0.9) saturate(0.6) sepia(0.4) hue-rotate(-10deg)",
  cyberpunk: "brightness(1.1) contrast(1.4) saturate(1.5) hue-rotate(280deg)",
  warm: "brightness(1.05) contrast(1.05) saturate(1.1) sepia(0.2)",
  cool: "brightness(1.0) contrast(1.1) saturate(0.9) hue-rotate(190deg)",
  bw: "brightness(1.1) contrast(1.3) saturate(0) grayscale(1)",
  sepia: "brightness(1.0) contrast(1.1) sepia(0.8)",
  dramatic: "brightness(0.9) contrast(1.5) saturate(1.2)",
  pastel: "brightness(1.15) contrast(0.85) saturate(0.7)",
  noir: "brightness(0.85) contrast(1.6) grayscale(0.9)",
};

export const animations = {
  fadeIn: (progress: number) => ({ opacity: progress }),
  fadeOut: (progress: number) => ({ opacity: 1 - progress }),
  scaleIn: (progress: number) => ({ transform: "scale(" + progress + ")" }),
  slideInLeft: (progress: number) => ({ transform: "translateX(" + ((1 - progress) * -100) + "%)" }),
  slideInRight: (progress: number) => ({ transform: "translateX(" + ((1 - progress) * 100) + "%)" }),
  slideInUp: (progress: number) => ({ transform: "translateY(" + ((1 - progress) * 100) + "%)" }),
  bounce: (progress: number) => {
    const bounce = Math.abs(Math.sin(progress * Math.PI * 3)) * (1 - progress) * 0.3;
    return { transform: "translateY(" + (-bounce * 100) + "px) scale(" + (0.5 + progress * 0.5) + ")" };
  },
  rotate: (progress: number) => ({ transform: "rotate(" + (progress * 360) + "deg)" }),
  pulse: (progress: number) => {
    const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.1;
    return { transform: "scale(" + scale + ")" };
  },
};
