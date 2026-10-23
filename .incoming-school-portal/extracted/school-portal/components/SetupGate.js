"use client";
import { useEffect, useState } from "react";
import { applyDemo } from "@/lib/data";
import { seedOnce } from "@/lib/seed";
const LOW = ["Nursery", "Primary", "JHS", "SHS"], TER = ["Diploma", "Undergraduate", "Postgraduate", "Short courses"];
const COLORS = ["#123b2e", "#1d3557", "#5a189a", "#7a1f2b"];
const TYPES = [["lower", "Lower levels", "Nursery, primary, JHS or SHS. Parents are linked to their children."], ["tertiary", "Tertiary", "Diploma, degree or postgraduate. Students are adults with their own accounts."], ["both", "Both", "Lower levels plus a tertiary arm."]];
function paint(c) { const r = document.documentElement.style; r.setProperty("--board", c); r.setProperty("--board2", `color-mix(in srgb, ${c} 80%, #fff)`); }
export default function SetupGate({ children }) {
  const [cfg, setCfg] = useState(undefined);
  useEffect(() => { try { const s = localStorage.getItem("gh:setup"); if (s) { const c = JSON.parse(s); applyDemo(c); seedOnce(c.type); paint(c.accent); setCfg(c); return; } } catch {} setCfg(null); }, []);
  if (cfg === undefined) return null;
  if (cfg) return children;
  return <Wizard onDone={c => { try { localStorage.setItem("gh:setup", JSON.stringify(c)); } catch {} applyDemo(c); seedOnce(c.type); paint(c.accent); setCfg(c); }} />;
}
function Wizard({ onDone }) {
  const [type, setType] = useState("lower"); const [f, setF] = useState({ name: "", tagline: "", phone: "", email: "" }); const [levels, setLevels] = useState([]); const [accent, setAccent] = useState(COLORS[0]);
  const opts = type === "lower" ? LOW : type === "tertiary" ? TER : [...LOW, ...TER];
  const tog = l => setLevels(levels.includes(l) ? levels.filter(x => x !== l) : [...levels, l]);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const h = { fontSize: "1.3rem", marginTop: "1rem" };
  return (<main className="wrap" style={{ padding: "2.5rem 1.25rem", maxWidth: 760 }}><h1>Set up your school site</h1><p className="muted">Answer a few questions and the website and portal are built to match. You can reset this later in Admin, Settings.</p>
    <form className="stack" onSubmit={e => { e.preventDefault(); if (levels.length) onDone({ type, ...f, levels, accent }); }}>
      <h2 style={h}>1. What kind of school is it?</h2>
      <div className="grid">{TYPES.map(([k, t, d]) => <button type="button" key={k} className="panel" aria-pressed={type === k} style={{ textAlign: "left", cursor: "pointer", font: "inherit", borderWidth: type === k ? 3 : 1, borderColor: type === k ? "var(--board)" : undefined }} onClick={() => { setType(k); setLevels([]); }}><h3>{t}</h3><span className="muted">{d}</span></button>)}</div>
      <h2 style={h}>2. School details</h2>
      <label>School name<input required value={f.name} onChange={set("name")} /></label>
      <label>Tagline (optional)<input value={f.tagline} onChange={set("tagline")} /></label>
      <label>Phone<input type="tel" required value={f.phone} onChange={set("phone")} /></label>
      <label>Email<input type="email" required value={f.email} onChange={set("email")} /></label>
      <h2 style={h}>3. Which levels do you run?</h2>
      <div className="tog">{opts.map(l => <button type="button" key={l} className={levels.includes(l) ? "on" : ""} aria-pressed={levels.includes(l)} onClick={() => tog(l)}>{l}</button>)}</div>
      <h2 style={h}>4. Main colour</h2>
      <div className="tog">{COLORS.map(c => <button type="button" key={c} aria-label={"Use " + c} style={{ background: c, width: 38, height: 38, outline: accent === c ? "3px solid var(--chalk)" : "none" }} onClick={() => { setAccent(c); paint(c); }} />)}</div>
      <button className="btn dark" disabled={!levels.length || !f.name.trim()}>Launch my school site</button>{!levels.length && <p className="muted">Pick at least one level.</p>}
    </form></main>);
}
