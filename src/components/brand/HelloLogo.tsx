import Image from "next/image";
import { BRAND_ASSETS } from "@/data/brand-assets";

type Props = {
  /** 세로 높이(px) — 가로는 로고 비율 유지 */
  height?: number;
  /** 아이콘만 (날개 H) */
  markOnly?: boolean;
  className?: string;
  priority?: boolean;
};

export function HelloLogo({
  height = 44,
  markOnly = false,
  className = "",
  priority = false,
}: Props) {
  const src = markOnly ? BRAND_ASSETS.logoMark : BRAND_ASSETS.logo;
  const alt = markOnly ? "HELLO" : "HELLO · Hello Music Academy";
  const width = markOnly ? height : Math.round(height * 0.85);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`h-auto w-auto object-contain ${className}`}
      style={{ height, width: markOnly ? height : "auto", maxWidth: markOnly ? height : 140 }}
    />
  );
}
