import { useEffect, useRef, useCallback } from "react";
export const useOutsideClick = <T extends HTMLElement = HTMLDivElement>(
    callback: () => void
  ) => {
    const ref = useRef<T>(null);
  
    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      },
      [callback]
    );
  
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [handleClickOutside]);
  
    return ref;
  };
  
  export default useOutsideClick;