import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Colour utilities for the internal design-system reference.
 *
 * These read the real token declarations out of `globals.css` at build time
 * rather than keeping a second copy of the palette in TypeScript. The page is
 * therefore self-verifying: if a token is edited and its contrast drops below
 * the threshold for its role, the reference route says so on the next build.
 */

export type Oklch = { l: number; c: number; h: number };
export type Mode = "light" | "dark";

/** OKLCH → linear sRGB, then to both a hex string and relative luminance. */
export function resolve(color: Oklch): { hex: string; luminance: number } {
  const hRad = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(hRad);
  const b = color.c * Math.sin(hRad);

  const lp = color.l + 0.3963377774 * a + 0.2158037573 * b;
  const mp = color.l - 0.1055613458 * a - 0.0638541728 * b;
  const sp = color.l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = lp ** 3;
  const m3 = mp ** 3;
  const s3 = sp ** 3;

  const clamp = (x: number) => Math.min(1, Math.max(0, x));
  const r = clamp(4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3);
  const g = clamp(-1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3);
  const bl = clamp(-0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3);

  const encode = (x: number) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  const channel = (x: number) =>
    Math.round(encode(x) * 255)
      .toString(16)
      .padStart(2, "0");

  return {
    hex: `#${channel(r)}${channel(g)}${channel(bl)}`,
    luminance: 0.2126 * r + 0.7152 * g + 0.0722 * bl,
  };
}

export function contrast(a: Oklch, b: Oklch): number {
  const la = resolve(a).luminance;
  const lb = resolve(b).luminance;
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Extracts the body of the first `selector { ... }` rule by brace matching. */
function ruleBody(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return "";
  let depth = 0;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) return css.slice(css.indexOf("{", start) + 1, i);
    }
  }
  return "";
}

const OKLCH_DECL = /--([a-z-]+):\s*oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/g;

function parseTokens(body: string): Record<string, Oklch> {
  const tokens: Record<string, Oklch> = {};
  for (const match of body.matchAll(OKLCH_DECL)) {
    tokens[match[1]] = {
      l: Number(match[2]),
      c: Number(match[3]),
      h: Number(match[4]),
    };
  }
  return tokens;
}

let cache: Record<Mode, Record<string, Oklch>> | null = null;

export function palette(): Record<Mode, Record<string, Oklch>> {
  if (cache) return cache;
  const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
  cache = {
    light: parseTokens(ruleBody(css, ":root")),
    dark: parseTokens(ruleBody(css, ".dark")),
  };
  return cache;
}

export function formatOklch(color: Oklch): string {
  return `oklch(${color.l} ${color.c} ${color.h})`;
}
