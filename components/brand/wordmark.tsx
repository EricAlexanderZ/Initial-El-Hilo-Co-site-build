/**
 * The Brand First Merch wordmark.
 *
 * Set in type rather than shipped as an image, deliberately and for now.
 *
 * The old logo was a pure wordmark: it *was* the words "El Hilo Co" in a script
 * face, with no separable icon to carry across. So the rebrand had nothing to
 * inherit, and a PNG that literally spells the previous name cannot be kept
 * while the header says something else.
 *
 * Type also fixes a second problem. That PNG was 3845x1995, a 1.93:1 strip
 * rendered into 64px *square* boxes at `object-contain`, so it drew at roughly
 * 64x33 and was barely legible anywhere. The stacked lockup here is square by
 * construction, which is the shape every slot on this site actually has.
 *
 * Being type, it is crisp at 40px and at 400px, costs no request, and recolours
 * for dark ground with a prop instead of a second asset.
 *
 * When real logo artwork exists, replace the internals here and every usage
 * across the site updates at once.
 */

type Tone = "light" | "dark";

/**
 * `stack` is the default and the primary lockup: three lines, square, made for
 * the logo slots. `inline` is the single-line variant for tight horizontal
 * space such as the mobile drawer header.
 */
type Layout = "stack" | "inline";

type Props = {
  tone?: Tone;
  layout?: Layout;
  /**
   * Drives the whole lockup. Everything inside is sized in `em`, so one
   * font-size class scales the mark as a unit and nothing needs re-tuning.
   */
  className?: string;
};

export function Wordmark({ tone = "light", layout = "stack", className = "" }: Props) {
  // FIRST is the accent line. On white, raw gold measures about 1.7:1 and is
  // unreadable, so light ground takes gold-deep. On navy, gold is doing what
  // gold is for.
  const accent = tone === "dark" ? "text-gold" : "text-gold-deep";
  const base = tone === "dark" ? "text-white" : "text-navy-deep";

  if (layout === "inline") {
    return (
      <span
        className={`font-extrabold tracking-tight ${base} ${className}`}
        // The mark reads as one name; screen readers should not hear the
        // colour split as three separate words.
        aria-label="Brand First Merch"
      >
        <span aria-hidden="true">
          BRAND<span className={accent}>FIRST</span> MERCH
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex flex-col font-extrabold uppercase ${base} ${className}`}
      // 0.86 pulls the three lines into a block. Anything looser reads as a
      // list of words rather than a mark.
      style={{ lineHeight: 0.86, letterSpacing: "-0.03em" }}
      aria-label="Brand First Merch"
    >
      <span aria-hidden="true">Brand</span>
      <span aria-hidden="true" className={accent}>
        First
      </span>
      <span aria-hidden="true">Merch</span>
    </span>
  );
}
