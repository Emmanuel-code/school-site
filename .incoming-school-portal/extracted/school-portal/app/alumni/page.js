"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { school } from "@/lib/data";
const CAMPAIGNS = [["Library renovation", 20000], ["Scholarship fund", 50000], ["School bus", 80000]];
export default function Alumni() {
  const [al, setAl] = useStore("alumni", []); const [pl, setPl] = useStore("pledges", []);
  const [f, setF] = useState({ name: "", year: "", phone: "" }); const [d, setD] = useState({ c: CAMPAIGNS[0][0], amt: "", name: "" }); const [msg, setMsg] = useState("");
  const raised = c => pl.filter(p => p.c === c).reduce((a, p) => a + Number(p.amt), 0);
  return (<main className="wrap" style={{ padding: "2.5rem 1.25rem" }}><Link href="/">Back to the school site</Link><h1 style={{ marginTop: "1rem" }}>{school.name} alumni</h1>
    <div className="grid">
      <form className="panel stack" onSubmit={e => { e.preventDefault(); setAl([...al, f]); setF({ name: "", year: "", phone: "" }); setMsg("Thank you, you are on the alumni list."); }}><h3>Join the alumni list</h3>
        <label>Full name<input required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></label><label>Year you left<input required inputMode="numeric" value={f.year} onChange={e => setF({ ...f, year: e.target.value })} /></label><label>Phone<input required type="tel" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></label><button className="btn dark">Join</button></form>
      <form className="panel stack" onSubmit={e => { e.preventDefault(); setPl([...pl, d]); setD({ ...d, amt: "", name: "" }); setMsg("Thank you. Your pledge is recorded. The office will send mobile money payment details."); }}><h3>Give to a campaign</h3>
        <label>Campaign<select value={d.c} onChange={e => setD({ ...d, c: e.target.value })}>{CAMPAIGNS.map(c => <option key={c[0]}>{c[0]}</option>)}</select></label><label>Your name<input required value={d.name} onChange={e => setD({ ...d, name: e.target.value })} /></label><label>Amount (GHS)<input required type="number" min="1" value={d.amt} onChange={e => setD({ ...d, amt: e.target.value })} /></label><button className="btn dark">Pledge with mobile money</button></form></div>
    {msg && <p role="status" className="panel" style={{ marginTop: "1rem" }}>{msg}</p>}
    <h2 style={{ marginTop: "2rem" }}>Campaigns</h2><div className="grid">{CAMPAIGNS.map(([c, g]) => <div className="panel" key={c}><h3>{c}</h3><div className="bar" role="img" aria-label="progress"><i style={{ width: Math.min(100, Math.round(raised(c) / g * 100)) + "%" }} /></div><p className="muted">GHS {raised(c).toLocaleString()} pledged of GHS {g.toLocaleString()}</p></div>)}</div></main>);
}
