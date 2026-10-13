// Page animations, built on Motion (vendor/motion.js exposes the `Motion` global).
// Each page's <head> adds the `motion` class to <html> unless the visitor asked for
// reduced motion; styles.css hides [data-reveal] elements only while that class is set.
(() => {
  const root = document.documentElement;
  if (!root.classList.contains("motion")) return;
  if (!window.Motion) {
    root.classList.remove("motion"); // Motion failed to load: show everything as is.
    return;
  }

  const { animate, inView, stagger, press } = window.Motion;
  const ease = [0.22, 1, 0.36, 1];
  const rise = { opacity: [0, 1], y: [28, 0] };

  // First screen: elements rise one after another.
  animate("[data-reveal='intro']", rise, {
    duration: 0.8,
    ease,
    delay: stagger(0.09),
  });

  // Further down: each card rises as it scrolls into view.
  inView(
    "[data-reveal='scroll']",
    (el) => {
      animate(el, rise, { duration: 0.7, ease });
    },
    { amount: 0.15 },
  );

  // The logo floats gently, like a leaf on the breeze.
  animate(
    "[data-float]",
    { y: [0, -8, 0], rotate: [0, -1.5, 0] },
    { duration: 3.2, ease: "easeInOut", repeat: Infinity },
  );

  // Buttons give a springy squish when pressed.
  press("[data-press]", (el) => {
    animate(el, { scale: 0.94 }, { duration: 0.1 });
    return () =>
      animate(el, { scale: 1 }, { type: "spring", stiffness: 500, damping: 15 });
  });
})();
