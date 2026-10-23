import { apps } from "@/lib/data";
const read = () => { try { return JSON.parse(localStorage.getItem("gh:apps")) || apps; } catch { return apps; } };
export function notify(to, t) { try { const n = JSON.parse(localStorage.getItem("gh:notifs")) || []; localStorage.setItem("gh:notifs", JSON.stringify([{ to, t }, ...n])); } catch {} }
export function submitApplication(rec) {
  const ref = "BN-" + Math.floor(10000 + Math.random() * 90000);
  try { localStorage.setItem("gh:apps", JSON.stringify([...read(), { id: Date.now(), ref, s: 0, ...rec, at: new Date().toLocaleDateString() }])); } catch {}
  notify("admin", "New application " + ref + ": " + rec.n);
  return ref;
}
export const findApp = ref => read().find(a => a.ref === ref.trim().toUpperCase());
export const signIn = (u, p) => read().find(a => a.login && a.login.user === u.trim().toUpperCase() && a.login.pin === p.trim());
