"use client";

import AOS from "aos";
import "aos/dist/aos.css";

export const AOSInit = (time: number) => {
  if (typeof window !== "undefined") {
    AOS.init({
      easing: "ease-in-out",
      duration: time,
      once: false,
    });
  }

  return null;
};
