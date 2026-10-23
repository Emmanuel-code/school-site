"use client";
import Link from "next/link";
import { useState } from "react";
import { school, T, levelCards } from "@/lib/data";
import { submitApplication } from "@/lib/apply";
export default function Home() {
  const [sent, setSent] = useState(false); const [who, setWho] = useState("Parent for a child"); const adult = T.adult || who === "Adult student"; const TER = ["Diploma","Undergraduate","Postgraduate","Short courses"]; const terLv = school.levels.filter(l=>TER.includes(l)); const lowLv = school.levels.filter(l=>!TER.includes(l)); const hasBoth = terLv.length>0 && lowLv.length>0; const [fm, setFm] = useState({name:"",child:"",phone:"",level:"",note:""}); const u = k => e => setFm({...fm,[k]:e.target.value}); const lvl = adult ? terLv : lowLv; const lev = lvl.includes(fm.level) ? fm.level : lvl[0];
  return (<>
    <div className="bar-top"><div className="wrap">Call {school.phone} or email {school.email}</div></div>
    <header className="hero"><div className="wrap">
      <div className="top"><Link className="brand" href="/">{school.name}</Link>
        <nav><a href="#admissions">Admissions</a><a href="#events">Events</a><Link href="/track">Track application</Link><Link href="/faq">FAQ</Link><Link href="/alumni">Alumni</Link><Link className="btn" href="/login">Portal login</Link></nav></div>
      <h1>{school.tagline.split(". ").length > 1 ? <>{school.tagline.split(". ")[0]}. <span>{school.tagline.split(". ").slice(1).join(". ")}</span></> : <span>{school.tagline}</span>}</h1>
      <p>{T.hero}</p>
      <div className="row"><a className="btn" href="#admissions">Apply for next {T.term.toLowerCase()}</a><a className="btn ghost" href="#visit">Book a visit</a></div>
      <div className="hero-image" style={{marginTop:"3rem",borderRadius:"28px",overflow:"hidden",border:"1px solid #ffffff24",boxShadow:"0 30px 80px #080d1f66"}}><img src="/campus-future.png" alt="Students learning together on the school campus" style={{display:"block",width:"100%",height:"min(42vw,440px)",objectFit:"cover"}} /></div>
    </div></header>
    <section className="s" style={{paddingBottom:"2rem"}}><div className="wrap"><p style={{color:"#5e50eb",fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",fontSize:".75rem"}}>Your journey, made simple</p><div className="grid"><div className="panel"><b>01 · Discover</b><p className="muted">Explore programmes, meet our community, and find the right path.</p></div><div className="panel"><b>02 · Apply</b><p className="muted">Send your details online in under five minutes. No paperwork maze.</p></div><div className="panel"><b>03 · Belong</b><p className="muted">Follow your application, pay fees, and stay connected from one portal.</p></div></div></div></section>
    <section className="s"><div className="wrap"><h2>What we teach</h2>
      <div className="grid">{levelCards().map(([t,b])=>(<div className="panel" key={t}><h3>{t}</h3><p className="muted">{b}</p></div>))}</div></div></section>
    <section className="s sky" id="events"><div className="wrap"><h2>Coming up</h2>
      {[["3 Nov","Open day and campus tour"],["12 Nov","Science fair"],["20 Nov","Parents and teachers evening"],["5 Dec","Carol service"]].map(([d,t])=>(<div className="ev" key={t}><b>{d}</b><span>{t}</span></div>))}</div></section>
    <section className="s"><div className="wrap"><h2>Results and people</h2><div className="grid">{[T.adult?["90%","of graduates working or studying within a year"]:["96%","passed BECE core subjects last year"],T.adult?["1 to 25","lecturer to student ratio"]:["1 to 18","teacher to pupil ratio"],["12","clubs and teams to join"]].map(([n,t])=>(<div className="panel" key={t}><div className="stat">{n}</div><span className="muted">{t}</span></div>))}</div>
      <div className="grid" style={{marginTop:"1.25rem"}}>{[["Head teacher","Leads the school and meets every new family."],["Mr. Owusu","Mathematics and robotics club."],["Ms. Adjei","English and the school choir."]].map(([n,t])=>(<div className="panel" key={n}><h3>{n}</h3><p className="muted">{t}</p></div>))}</div></div></section>
    <section className="s" id="admissions"><div className="wrap grid">
      <div><h2>Apply online</h2><p className="muted">Tell us about your child. The admissions office replies within two working days with next steps and required documents.</p><div className="warn"><b>Beware of scams.</b> We never ask for money to guarantee a place. Only use the phone number and email on this website.</div></div>
      {sent ? <div className="panel"><h3>Application received</h3><p>Your reference code is <b>{sent}</b>. Write it down, then use <Link href="/track">Track application</Link> to follow your progress and collect your login once you are enrolled.</p></div> :
      <form className="f" id="visit" onSubmit={e=>{e.preventDefault();setSent(submitApplication({n:adult?fm.name:fm.child,by:fm.name,phone:fm.phone,l:lev,adult,note:fm.note}))}}>
        {hasBoth && <label>Applying as<select value={who} onChange={e=>setWho(e.target.value)}><option>Parent for a child</option><option>Adult student</option></select></label>}
        <label>{adult?"Your full name":"Parent or guardian name"}<input required value={fm.name} onChange={u("name")}/></label>
        {!adult && <label>Child's full name<input required value={fm.child} onChange={u("child")}/></label>}
        <label>Phone<input required type="tel" value={fm.phone} onChange={u("phone")}/></label>
        <label>{adult?"Programme level":"Child's level"}<select value={lev} onChange={u("level")}>{lvl.map(l=><option key={l}>{l}</option>)}</select></label>
        <label>Anything we should know<textarea rows="3" value={fm.note} onChange={u("note")}/></label><button className="btn dark">Send application</button></form>}
    </div></section>
    <section className="s sky"><div className="wrap"><h2>Paying fees</h2><p className="muted">Pay by any of these. Always keep your receipt, and you can pay in installments from the parent portal.</p><div className="grid">{school.payments.map(p=>(<div className="panel" key={p}><b>{p}</b></div>))}</div></div></section>
    <footer><div className="wrap">{school.name}. Open Monday to Friday, 7:30 to 16:00. Call {school.phone} or email {school.email}. <Link href="/faq" style={{marginLeft:".5rem"}}>FAQ</Link></div></footer></>);
}
