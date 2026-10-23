"use client";
import { useState, useEffect } from "react";
export function useStore(key, init) {
  const k = "gh:" + key;
  const [v, setV] = useState(init);
  useEffect(() => { try { const s = localStorage.getItem(k); if (s) setV(JSON.parse(s)); } catch {} }, [k]);
  const set = n => { let cur = v; try { const s = localStorage.getItem(k); if (s) cur = JSON.parse(s); } catch {}
    const x = typeof n === "function" ? n(cur) : n; try { localStorage.setItem(k, JSON.stringify(x)); } catch {} setV(x); };
  return [v, set];
}
