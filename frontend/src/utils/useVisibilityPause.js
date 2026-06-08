/**
 * useVisibilityPause — shared utility for all WebGL scene components.
 *
 * Returns two helpers:
 *   - observeElement(el, onVisible, onHidden)  → starts an IntersectionObserver
 *   - watchPageVisibility(onVisible, onHidden) → listens for visibilitychange
 *
 * Both return a cleanup function you should call in the useEffect cleanup.
 */

/**
 * Observes an element and calls callbacks when it enters/leaves the viewport.
 * @param {Element} element - DOM element to observe
 * @param {Function} onVisible - called when element enters viewport
 * @param {Function} onHidden  - called when element leaves viewport
 * @param {number} threshold   - 0–1, how much of the element must be visible
 * @returns {Function} cleanup
 */
export function observeElement(element, onVisible, onHidden, threshold = 0.01) {
  if (!element || typeof IntersectionObserver === 'undefined') {
    // Fallback: always treat as visible
    onVisible();
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onVisible();
        } else {
          onHidden();
        }
      });
    },
    { threshold }
  );

  observer.observe(element);
  return () => observer.disconnect();
}

/**
 * Watches the Page Visibility API and calls callbacks accordingly.
 * @param {Function} onVisible - called when tab becomes visible
 * @param {Function} onHidden  - called when tab becomes hidden
 * @returns {Function} cleanup
 */
export function watchPageVisibility(onVisible, onHidden) {
  const handler = () => {
    if (document.hidden) {
      onHidden();
    } else {
      onVisible();
    }
  };

  document.addEventListener('visibilitychange', handler);
  return () => document.removeEventListener('visibilitychange', handler);
}
