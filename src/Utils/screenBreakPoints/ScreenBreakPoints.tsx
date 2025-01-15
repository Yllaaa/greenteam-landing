"use client";
import { useScreenWidth } from "../useScreenWidth/useScreenWidth";

export function ScreenBreakpoints() {
  const screenWidth = useScreenWidth();

  const isMobile = screenWidth <= 768; // Adjust the breakpoint as needed
  const isTablet = screenWidth > 768 && screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;

  return { isMobile, isTablet, isDesktop };
}
