"use client";

import { usePathname } from "next/navigation";
import { Nav } from "./nav";

const PATH_TO_ACTIVE: Record<
  string,
  "home" | "about" | "services" | "contact" | "office" | "console" | "control-tower"
> = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/contact": "contact",
  "/office": "office",
  "/console": "console",
  "/control-tower": "control-tower",
};

export function NavActive() {
  const pathname = usePathname();
  const active = PATH_TO_ACTIVE[pathname] ?? undefined;
  return <Nav active={active} />;
}
