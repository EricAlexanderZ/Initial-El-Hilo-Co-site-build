import Image from "next/image";

/**
 * The Brand First Merch logo.
 *
 * One component for every placement, so the mark is swapped in exactly one file
 * rather than in nine. This previously set the name in type, as a stand-in
 * while no artwork existed; it now renders the real logo and every call site
 * picked up the change without edits to markup.
 *
 * The artwork carries its own white keyline, which is why there is no light and
 * dark variant. It reads on white, on the black footer, on the navy admin panel
 * and over the hero photograph from a single file. Do not add a `tone` prop or
 * an inverted copy: both would be solving a problem the keyline already solves.
 *
 * Sizing is height-driven. The wrapper sets `aspect-[997/816]` to match the
 * source exactly, so callers pass a height class and the width follows. That
 * avoids the bug the old logo had, where a 1.93:1 strip was dropped into square
 * boxes and drew at roughly a third of the space it was given.
 */

const LOGO = "/images/brand/bf-merch-logo.png";

type Props = {
  /**
   * Height classes, e.g. `h-12` or `h-40 md:h-56`. Width comes from the aspect
   * ratio, so setting a width here will fight the ratio rather than help.
   */
  className?: string;
  /**
   * Set only for a mark that is above the fold on first paint. Currently just
   * the home hero; everything else should stay lazy.
   */
  priority?: boolean;
  /**
   * Rendered width hint for the responsive srcset. Keep it near the real
   * display width: too large and the browser downloads a file far bigger than
   * the box, which is the mistake that costs the most on phones.
   */
  sizes?: string;
};

export function Wordmark({ className = "", priority = false, sizes = "120px" }: Props) {
  return (
    <span className={`relative block aspect-[997/816] ${className}`}>
      <Image
        src={LOGO}
        alt="Brand First Merch"
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain"
      />
    </span>
  );
}
