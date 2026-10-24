import { apps } from "@/lib/data";
const read = () => { try { return JSON.parse(localStorage.getItem("gh:apps")) || apps; } catch { return apps; } };
export const getApps = read;
const writeApps = a => { try { localStorage.setItem("gh:apps", JSON.stringify(a)); } catch {} };
const staffRead = () => { try { return JSON.parse(localStorage.getItem("gh:staff")) || []; } catch { return []; } };
const staffWrite = s => { try { localStorage.setItem("gh:staff", JSON.stringify(s)); } catch {} };
const randPin = () => String(Math.floor(1000 + Math.random() * 9000));
export function notify(to, t) { try { const n = JSON.parse(localStorage.getItem("gh:notifs")) || []; localStorage.setItem("gh:notifs", JSON.stringify([{ to, t }, ...n])); } catch {} }
export function submitApplication(rec) {
  const ref = "BN-" + Math.floor(10000 + Math.random() * 90000);
  try { localStorage.setItem("gh:apps", JSON.stringify([...read(), { id: Date.now(), ref, s: 0, ...rec, at: new Date().toLocaleDateString() }])); } catch {}
  notify("admin", "New application " + ref + ": " + rec.n);
  return ref;
}
export const findApp = ref => read().find(a => a.ref === ref.trim().toUpperCase());
export const listStaff = staffRead;
export function addStaff({ name, role, phone }) {
  const s = staffRead();
  const rec = { id: Date.now(), name, role, phone, login: { user: "STF-" + (1000 + s.length), pin: randPin() }, mustChange: true };
  staffWrite([...s, rec]);
  notify("admin", "Staff account created for " + name + " (" + rec.login.user + ")");
  return rec;
}
export function resetPin(kind, id) {
  const pin = randPin();
  if (kind === "staff") staffWrite(staffRead().map(x => x.id === id ? { ...x, login: { ...x.login, pin }, mustChange: true } : x));
  else writeApps(read().map(x => x.id === id ? { ...x, login: { ...x.login, pin }, mustChange: true } : x));
  return pin;
}
export function setPin(kind, id, pin) {
  if (kind === "staff") staffWrite(staffRead().map(x => x.id === id ? { ...x, login: { ...x.login, pin }, mustChange: false } : x));
  else writeApps(read().map(x => x.id === id ? { ...x, login: { ...x.login, pin }, mustChange: false } : x));
}
export function signIn(u, p) {
  const uu = u.trim().toUpperCase(), pp = p.trim();
  const a = read().find(x => x.login && x.login.user === uu && x.login.pin === pp);
  if (a) return { kind: "app", id: a.id, role: a.adult ? "student" : "parent", name: a.by || a.n, mustChange: !!a.mustChange };
  const s = staffRead().find(x => x.login && x.login.user === uu && x.login.pin === pp);
  if (s) return { kind: "staff", id: s.id, role: s.role, name: s.name, mustChange: !!s.mustChange };
  return null;
}
