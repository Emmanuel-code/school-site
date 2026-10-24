"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { roles, T } from "@/lib/data";
import { signIn, findApp, setPin } from "@/lib/apply";
export default function Login() {
  const r = useRouter(); const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  const [pend, setPend] = useState(null); const [np, setNp] = useState(""); const [cf, setCf] = useState(""); const [perr, setPerr] = useState("");
  const go = k => { localStorage.removeItem("gh:me"); r.push(`/portal/${k}`); };
  const goIn = a => { localStorage.setItem("gh:me", JSON.stringify({ name: a.name, role: a.role })); r.push(`/portal/${a.role}`); };
  const enter = e => { e.preventDefault(); const a = signIn(u, p);
    if (!a) { const f = findApp(u); setErr(f && !f.login ? "Your application is not approved yet." : "Wrong username or PIN."); return; }
    if (a.mustChange) { setPend(a); return; }
    goIn(a); };
  const change = e => { e.preventDefault();
    if (!/^\d{4,}$/.test(np)) { setPerr("Use at least 4 numbers for your PIN."); return; }
    if (np !== cf) { setPerr("The two PINs do not match."); return; }
    setPin(pend.kind, pend.id, np); goIn(pend); };
  return (<main className="wrap" style={{ padding: "4rem 1.25rem" }}><h1>Sign in to the portal</h1>
    {pend ? <form className="panel stack" style={{ maxWidth: 420, margin: "1.5rem 0" }} onSubmit={change}><h3>Set your own PIN</h3><p className="muted">Welcome, {pend.name}. Your temporary PIN worked — now choose one only you know.</p>
      <label>New PIN<input required inputMode="numeric" value={np} onChange={e => setNp(e.target.value)} /></label><label>Repeat new PIN<input required inputMode="numeric" value={cf} onChange={e => setCf(e.target.value)} /></label>
      <button className="btn dark">Save PIN and continue</button>{perr && <p role="alert">{perr}</p>}</form> :
    <form className="panel stack" style={{ maxWidth: 420, margin: "1.5rem 0" }} onSubmit={enter}><h3>Students, parents and staff</h3><p className="muted">Use the username and PIN you received — parents get theirs when enrollment is confirmed, staff get theirs from the school office.</p>
      <label>Username<input required value={u} onChange={e => setU(e.target.value)} placeholder="BN-12345" /></label><label>PIN<input required type="password" inputMode="numeric" value={p} onChange={e => setP(e.target.value)} /></label>
      <button className="btn dark">Sign in</button>{err && <p role="alert">{err} <Link href="/track">Track application</Link></p>}</form>}
    <p className="muted">Demo mode — tap a role to explore the portal. No username or PIN needed.</p>
    <div className="grid" style={{ marginTop: "1rem" }}>{Object.entries(roles).filter(([k]) => T.adult ? k !== "parent" : true).map(([k, v]) => (
      <button key={k} className="panel" style={{ textAlign: "left", cursor: "pointer", font: "inherit" }} onClick={() => go(k)}><h3>{({ parent: "LOGIN AS A PARENT", student: "LOGIN AS A STUDENT", teacher: "LOGIN AS A TEACHER", nurse: "LOGIN AS A NURSE", admin: "LOGIN AS HEADMASTER / PRINCIPAL" })[k] || `LOGIN AS ${v.label.toUpperCase()}`}</h3><span className="muted">{v.desc}</span><span style={{ display: "block", marginTop: ".6rem", fontWeight: 600 }}>Continue as {v.user} →</span></button>))}</div></main>);
}
