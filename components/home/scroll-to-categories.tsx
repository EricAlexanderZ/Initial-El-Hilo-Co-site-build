"use client";

export default function ScrollToCategories() {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    const target = document.getElementById("categories");
    if (!target) return;

    const headerOffset = 96;
    const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 1600;
    let startTime: number | null = null;

    function easeInOutQuart(t: number) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutQuart(progress));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  return (
    <a
      href="#categories"
      onClick={handleClick}
      className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:bg-white/20"
    >
      Shop all categories
    </a>
  );
}
