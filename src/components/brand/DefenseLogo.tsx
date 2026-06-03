import Image from "next/image";
import { clsx } from "clsx";

/** Source artwork is 766×224 (≈3.42:1). */
const ASPECT = 766 / 224;

interface DefenseLogoProps {
  className?: string;
  /** Pick the variant for the background it sits on. */
  tone?: "light" | "dark";
  /** Rendered height in px; width is derived from the locked aspect ratio. */
  height?: number;
  priority?: boolean;
}

/**
 * REVIA DEFENSE lockup — the shield-and-chevrons mark with the DEFENSE wordmark.
 * Distinct from the commercial amber `Wordmark`; used on the Defense section.
 * Two prepared transparent renders live in /public/brand:
 *   - `light`: white art, for dark (navy) backgrounds.
 *   - `dark` : navy art, for light (cream) backgrounds.
 */
export function DefenseLogo({
  className,
  tone = "light",
  height = 72,
  priority = false,
}: DefenseLogoProps) {
  const src =
    tone === "light"
      ? "/brand/revia-defense-white.png"
      : "/brand/revia-defense-dark.png";

  return (
    <Image
      src={src}
      alt="Revia Defense"
      width={Math.round(height * ASPECT)}
      height={height}
      priority={priority}
      className={clsx("h-auto w-auto", className)}
    />
  );
}
