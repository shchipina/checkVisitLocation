import { useEffect, useRef } from "react"

export const useAutoFocus = () => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus()
  }, []);

  return ref;
}