"use client";
import { useState } from "react";
import Link from "next/link";
import { stages } from "@/lib/data";
import { findApp } from "@/lib/apply";
const MSG = ["We have received your application and will review it.", "You are invited for an interview. The office will call you to book a time.", "Congratulations, we are offering you a place. Pay the acceptance fee to secure it.", "You are enrolled. Use the login below to sign in."];
export default function Track() {
  const [c, setC] = useState(""); const [a, setA] = useState(undefined);
  return (<main className="wrap" style={{ padding: "3rem 1.25rem" }}><Link href="/">Back to the school site</Link><h1 style={{ marginTop: "1rem" }}>Track your application</h1>
    <form className="f" onSubmit={e => { e.preventDefault(); setA(findApp(c) || null); }}><label>Reference code<input value={c} onChange={e => setC(e.target.value)} placeholder="GH-12345" required /></label><button className="btn dark">Check status</button></form>
    {a === null && <p role="alert" style={{ marginTop: "1rem" }}>We could not find that code. Check it and try again, or call the office.</p>}
    {a && <div className="panel" style={{ marginTop: "1.5rem", maxWidth: 520 }}><h3>{a.n}</h3><p className="muted">{a.l}, applied {a.at || "recently"}</p>
      {a.dec ? <p>Sorry, this application was not successful this time. Please call the office to talk about other options.</p> : <>
        {stages.map((s, i) => <div className="ev" key={s}><b>{i < a.s ? "Done" : i === a.s ? "Now" : "Next"}</b><span>{s}</span></div>)}
        <p style={{ marginTop: ".8rem" }}>{MSG[a.s]}</p>
        {a.login && <div className="warn">Username <b>{a.login.user}</b>, temporary PIN <b>{a.login.pin}</b>. <Link href="/login">Sign in here</Link></div>}</>}</div>}</main>);
}
