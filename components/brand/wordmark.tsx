import Image from "next/image";

/**
 * The Brand First Merch logo.
 *
 * One component for every placement, so the mark is swapped in exactly one file
 * rather than in ten. This started as the name set in type, as a stand-in while
 * no artwork existed; both variants below are now the real thing, and every
 * call site picked each change up without edits to its markup.
 *
 * Both variants carry their own keyline, which is why there is no light and
 * dark pair. `standard` reads on white, on the black footer, on the navy admin
 * panel and over a photograph from a single file. Do not add a `tone` prop or
 * an inverted copy: both would solve a problem the keyline already solves.
 *
 * Sizing is height-driven. The wrapper takes its aspect ratio from the source
 * dimensions recorded below, so callers pass a height class and the width
 * follows. That avoids the bug the old El Hilo Co logo had, where a 1.93:1
 * strip was dropped into square boxes and drew at about a third of its slot.
 */

const VARIANTS = {
  /** Black and gold with a white keyline. The everyday mark. */
  standard: { src: "/images/brand/bf-merch-logo.png", w: 997, h: 816 },
  /**
   * Iridescent keyline, for the home hero only.
   *
   * It earns the extra weight there because the hero is the one place the mark
   * is the subject rather than a label, and the pastel edge separates it from a
   * dark photograph more strongly than the plain white one does. Everywhere
   * else the standard mark is the right call: at 44px the iridescence is
   * invisible and only the file size survives.
   */
  holographic: { src: "/images/brand/bf-holographic.png", w: 2944, h: 2406 },
} as const;

type Props = {
  variant?: keyof typeof VARIANTS;
  /**
   * Height classes, e.g. `h-12` or `h-40 md:h-56`. Width comes from the aspect
   * ratio, so setting a width here will fight the ratio rather than help.
   */
  className?: string;
  /**
   * Set only for a mark above the fold on first paint. Currently the home hero
   * and the promo header; everything else should stay lazy.
   */
  priority?: boolean;
  /**
   * Rendered width hint for the responsive srcset. Keep it near the real
   * display width: too large and the browser fetches a file far bigger than the
   * box, which is the mistake that costs most on phones.
   */
  sizes?: string;
};

export function Wordmark({
  variant = "standard",
  className = "",
  priority = false,
  sizes = "120px",
}: Props) {
  const { src, w, h } = VARIANTS[variant];
  return (
    <span
      className={`relative block ${className}`}
      // Set from the source dimensions rather than a hardcoded class, so a
      // variant with a different ratio cannot silently letterbox.
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <Image
        src={src}
        alt="Brand First Merch"
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain"
      />
    </span>
  );
}
