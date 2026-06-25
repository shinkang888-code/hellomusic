import Image from "next/image";

type LonexLogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  accent?: string;
};

const sizes = {
  sm: { img: 32, className: "size-8 rounded-md" },
  md: { img: 72, className: "size-16 rounded-2xl ring-1 ring-slate-800 sm:size-20" },
  lg: { img: 96, className: "size-24 rounded-2xl ring-1 ring-slate-800" },
};

export function LonexLogo({
  size = "sm",
  showText = true,
  accent = "AI",
}: LonexLogoProps) {
  const config = sizes[size];

  return (
    <span className="flex items-center gap-2">
      <Image
        alt="Lonex"
        src="/brand/lonex-logo.png"
        width={config.img}
        height={config.img}
        className={config.className}
        priority={size !== "sm"}
      />
      {showText && (
        <span className={size === "sm" ? "text-lg font-bold" : "text-4xl font-bold tracking-tight sm:text-6xl"}>
          Lonex{" "}
          {accent ? <span className="text-blue-400">{accent}</span> : null}
        </span>
      )}
    </span>
  );
}
