import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type Sparkle = { id: number; x: number; y: number; hue: number };

/**
 * Custom pointer companion: a soft blob that trails the cursor, grows over
 * interactive elements, and drops sparkles as you move. Desktop only.
 */
export function CursorCompanion() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const lastSpark = useRef(0);
  const idRef = useRef(0);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none-desktop");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const target = e.target as HTMLElement | null;
      setHovering(
        !!target?.closest("a, button, [role='button'], input, textarea, [data-cursor='grow']"),
      );

      const now = performance.now();
      if (now - lastSpark.current > 90) {
        lastSpark.current = now;
        const id = ++idRef.current;
        setSparkles((prev) => [
          ...prev.slice(-10),
          { id, x: e.clientX, y: e.clientY, hue: Math.random() },
        ]);
        window.setTimeout(() => {
          setSparkles((prev) => prev.filter((s) => s.id !== id));
        }, 700);
      }
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("cursor-none-desktop");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="absolute size-2 rounded-full bg-gradient-primary"
          style={{ left: s.x, top: s.y, marginLeft: -4, marginTop: -4 }}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{
            scale: 0,
            opacity: 0,
            x: (s.hue - 0.5) * 40,
            y: 26 + s.hue * 20,
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}

      <motion.div
        className="absolute rounded-full border border-primary/50 bg-primary/10 backdrop-blur-[1px]"
        style={{ left: ringX, top: ringY, x: "-50%", y: "-50%" }}
        animate={{
          width: hovering ? 56 : 30,
          height: hovering ? 56 : 30,
          opacity: pressed ? 0.5 : 1,
          scale: pressed ? 0.82 : 1,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
      />
      <motion.div
        className="absolute size-2 rounded-full bg-primary"
        style={{ left: x, top: y, x: "-50%", y: "-50%" }}
        animate={{ scale: hovering ? 0.4 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
      />
    </div>
  );
}
