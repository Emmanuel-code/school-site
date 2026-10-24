"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import * as X from "./extras";
import { roles, school, T, timetable, homework, grades, fees, announcements, classes, roster, stats, alerts, children, apps, stages, defaulters, slips } from "@/lib/data";
import { getApps, resetPin } from "@/lib/apply";
const money = n => "GHS " + n.toLocaleString();
const letter = v => (v >= 80 ? "A" : v >= 70 ? "B" : v >= 60 ? "C" : v >= 50 ? "D" : "F");
const avg = a => Math.round(a.reduce((x, y) => x + (+y || 0), 0) / a.length);
const gradesFor = c => grades.map(g => ({ ...g, v: g.v - children.indexOf(c) * 6 }));
const seed = Object.fromEntries(roster.map((n, i) => [n, [70 + ((i * 3) % 25), 65 + ((i * 5) % 30), 60 + ((i * 7) % 35)]]));
const Bar = ({ v }) => <div className="bar" role="img" aria-label={`${v}%`}><i style={{ width: v + "%" }} /></div>;
const Spark = ({ pts }) => { const m = Math.max(...pts), n = Math.min(...pts);
  const p = pts.map((v, i) => `${i * 30},${28 - ((v - n) / (m - n || 1)) * 24}`).join(" ");
  return <svg width="90" height="30" aria-hidden><polyline points={p} fill="none" stroke="var(--board2)" strokeWidth="2.5" /></svg>; };
const Ann = () => announcements.map(a => <div className="panel" key={a.t}><h3>{a.t}</h3><p className="muted">{a.b}</p></div>);
const Today = () => <div className="panel"><h3>Today</h3>{timetable.map(t => <div className="ev" key={t[0]}><b>{t[0]}</b><span>{t[1]} <span className="muted">({t[2]})</span></span></div>)}</div>;
const Digest = ({ ch }) => { const g = gradesFor(ch); return <div className="panel"><h3>This week for {ch.n.split(" ")[0]}</h3><p>Attendance 4 of 5 days. Average {avg(g.map(x => x.v))}%. {homework.filter(h => h.s === "todo").length} assignments due.</p><p className="muted">We also send this every Friday by WhatsApp or email.</p></div>; };
const GradesInner = ({ ch }) => { const g = gradesFor(ch); return <>
  <div className="panel"><h3>Grades</h3><table><tbody>{g.map(x => <tr key={x.s}><td>{x.s}</td><td><Spark pts={x.trend} /></td><td><b>{x.v}%</b></td></tr>)}</tbody></table></div>
  <div className="panel card"><h3>{T.term} 1 report card</h3><p className="muted">{ch.n}, {ch.cls}</p>
    <table><thead><tr><th>Subject</th><th>Score</th><th>Grade</th></tr></thead><tbody>{g.map(x => <tr key={x.s}><td>{x.s}</td><td>{x.v}</td><td>{letter(x.v)}</td></tr>)}</tbody></table>
    <p>Class teacher: steady progress, keep reading daily.</p><button className="btn dark noprint" onClick={() => window.print()}>Print or save as PDF</button></div></>; };
function Fees() { const [plan, setPlan] = useStore("plan", 1); const left = fees.total - fees.paid; return <>
  <div className="panel"><h3>Fees</h3><div className="stat">{money(left)}</div><p className="muted">outstanding of {money(fees.total)}</p><Bar v={Math.round(fees.paid / fees.total * 100)} />
    <table><tbody>{fees.history.map(h => <tr key={h[0]}><td>{h[0]}</td><td>{money(h[1])}</td></tr>)}</tbody></table></div>
  <div className="panel"><h3>Payment plan</h3><div className="tog">{[1, 2, 3].map(n => <button key={n} className={plan === n ? "on" : ""} onClick={() => setPlan(n)}>{n === 1 ? "Pay in full" : n + " installments"}</button>)}</div>
    <table><tbody>{Array.from({ length: plan }, (_, i) => <tr key={i}><td>Payment {i + 1}</td><td>{money(Math.round(left / plan))}</td><td className="muted">{["15 Nov", "15 Dec", "15 Jan"][i]}</td></tr>)}</tbody></table>
    <button className="btn dark" style={{ marginTop: ".8rem" }}>Pay with mobile money</button><p className="muted">Reminders go out 3 days before each date.</p></div></>; }
function Forms() { const [s, setS] = useStore("slips", {}); return <div className="panel"><h3>Forms to sign</h3>{slips.map(f => <div className="ev" key={f[0]}><span style={{ flex: 1 }}>{f[0]} <span className="muted">{f[1]}</span></span>{s[f[0]] ? <span className="tag done">Signed</span> : <button className="btn dark" onClick={() => setS({ ...s, [f[0]]: 1 })}>Sign</button>}</div>)}</div>; }
function Msgs({ me }) { const [m, setM] = useStore("msgs", [{ f: "Mr. Owusu", x: "Kofi did well on Friday's algebra quiz." }]); const [t, setT] = useState("");
  return <div className="panel"><h3>Messages</h3><div className="thread">{m.map((x, i) => <p key={i} className={x.f === me ? "me" : ""}><b>{x.f}</b> {x.x}</p>)}</div>
    <form className="rowf" onSubmit={e => { e.preventDefault(); if (!t.trim()) return; setM([...m, { f: me, x: t }]); setT(""); }}><input value={t} onChange={e => setT(e.target.value)} placeholder="Write a message" aria-label="Message" /><button className="btn dark">Send</button></form></div>; }
function Homework() {
  const [h] = useStore("hw", homework); const [subs, setSubs] = useStore("subs", []); const nt = useNotify();
  const [open, setOpen] = useState(null); const [note, setNote] = useState(""); const [file, setFile] = useState(null);
  const submit = t => { setSubs([...subs.filter(s => s.hw !== t), { hw: t, st: "Kofi Mensah", file: file ? file.name : "", size: file ? Math.round(file.size / 1024) : 0, note, score: "", fb: "", ret: false }]); nt("teacher", "Kofi Mensah handed in: " + t); setOpen(null); setNote(""); setFile(null); };
  return <div className="panel"><h3>Homework</h3>{h.map(x => { const s = subs.find(y => y.hw === x.t); return <div className="ev" key={x.t} style={{ display: "block" }}>
    <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}><span style={{ flex: 1 }}>{x.t}</span><span className="muted">{x.d}</span><span className={"tag " + (s ? "done" : "")}>{s ? (s.ret ? "Marked" : "Handed in") : "To do"}</span>{!s && <button className="btn dark" onClick={() => setOpen(x.t)}>Hand in</button>}</div>
    {s && <p className="muted" style={{ margin: ".3rem 0 0" }}>{s.file ? s.file + " (" + s.size + " KB)" : "Typed answer"}{s.ret && ". Score " + s.score + "/100. " + s.fb}</p>}
    {open === x.t && <div className="stack" style={{ marginTop: ".6rem" }}><input type="file" aria-label="Upload your work" onChange={e => setFile(e.target.files[0] || null)} /><textarea rows="3" placeholder="Add a note or type your answer" value={note} onChange={e => setNote(e.target.value)} /><button className="btn dark" disabled={!file && !note.trim()} onClick={() => submit(x.t)}>Submit</button></div>}</div>; })}</div>;
}
function Goals() { const [t, setT] = useStore("goals", {}); return <div className="panel"><h3>My targets</h3>{grades.map(g => { const tg = t[g.s] || 85; return <div key={g.s} style={{ marginBottom: "1rem" }}>
  <div className="ev" style={{ border: 0, padding: 0, alignItems: "center" }}><b style={{ flex: 1 }}>{g.s}</b><span>{g.v} of {tg}</span><input type="number" min="50" max="100" value={tg} style={{ width: "5rem" }} aria-label={g.s + " target"} onChange={e => setT({ ...t, [g.s]: +e.target.value })} /></div><Bar v={Math.min(100, Math.round(g.v / tg * 100))} /></div>; })}</div>; }
function Checkin() { const [m, setM] = useStore("mood", null); return <div className="panel"><h3>How are you feeling today?</h3><div className="tog">{["Great", "Good", "Okay", "Low", "Rough"].map(x => <button key={x} className={m === x ? "on" : ""} onClick={() => setM(x)}>{x}</button>)}</div>{m && <p role="status">Thanks. This is optional and only the school counsellor sees it.</p>}</div>; }
function Classes() { const [g] = useStore("gb", seed); const risk = roster.filter(n => avg(g[n]) < 60);
  return <><div className="panel"><h3>Classes</h3>{classes.map(c => <div key={c.n} style={{ marginBottom: ".8rem" }}><div className="ev" style={{ border: 0, padding: 0 }}><b>{c.n}</b><span className="muted">{c.present} of {c.c} present</span></div><Bar v={Math.round(c.present / c.c * 100)} /></div>)}</div>
  <div className="panel"><h3>Students to check in on</h3>{risk.length ? risk.map(n => <div className="warn" key={n}>{n} is averaging {avg(g[n])}%</div>) : <p className="muted">Nobody is below 60% right now.</p>}</div></>; }
function Attendance() { const [m, setM] = useStore("att", {}); const [saved, setSaved] = useState(false); const a = roster.filter(n => m[n] === "a").length;
  return <div className="panel"><h3>{classes[0].n} attendance</h3><div className="tog" style={{ marginBottom: ".6rem" }}><button onClick={() => { setM(Object.fromEntries(roster.map(n => [n, "p"]))); setSaved(false); }}>Mark all present</button></div>
    <table><tbody>{roster.map(n => <tr key={n}><td>{n}</td><td><span className="tog"><button className={m[n] === "p" ? "on" : ""} onClick={() => setM({ ...m, [n]: "p" })}>Present</button><button className={"ab " + (m[n] === "a" ? "on" : "")} onClick={() => setM({ ...m, [n]: "a" })}>Absent</button></span></td></tr>)}</tbody></table>
    <button className="btn dark" style={{ marginTop: ".8rem" }} onClick={() => setSaved(true)}>Save attendance</button>{saved && <p role="status">Saved. {a} absent, their parents will be notified.</p>}</div>; }
function Gradebook() { const [g, setG] = useStore("gb", seed); const [rs, setRs] = useStore("res", "published"); const nt = useNotify(); const set = (n, i, v) => { setRs("draft"); setG({ ...g, [n]: g[n].map((x, j) => j === i ? v : x) }); };
  return <div className="panel"><h3>Gradebook, {classes[0].n}</h3><table><thead><tr><th>Student</th><th>Quiz</th><th>Test</th><th>Exam</th><th>Avg</th></tr></thead><tbody>
    {roster.map(n => <tr key={n}><td>{n}</td>{g[n].map((v, i) => <td key={i}><input type="number" min="0" max="100" value={v} style={{ width: "4.2rem" }} aria-label={n + " score " + (i + 1)} onChange={e => set(n, i, e.target.value)} /></td>)}<td><b>{avg(g[n])}</b> {avg(g[n]) < 60 && <span className="tag" style={{ background: "#f6d9d3" }}>At risk</span>}</td></tr>)}</tbody></table>
    <p className="muted">Class average: {avg(roster.map(n => avg(g[n])))}%. Status: {rs}.</p>{rs === "draft" && <button className="btn dark" onClick={() => { setRs("submitted"); nt("admin", classes[0].n + " " + T.term + " 1 results are waiting for approval"); }}>Submit results for approval</button>}{rs === "submitted" && <p role="status">Sent. Waiting for the admin to approve.</p>}{rs === "published" && <p role="status">Published. Editing a score will pull results back to draft.</p>}</div>; }
function Assign() { const [h, setH] = useStore("hw", homework); const [t, setT] = useState(""); const [d, setD] = useState("Fri");
  return <div className="panel stack"><h3>Post homework</h3><label>Title<input value={t} onChange={e => setT(e.target.value)} /></label><label>Due<input value={d} onChange={e => setD(e.target.value)} /></label>
    <button className="btn dark" onClick={() => { if (!t.trim()) return; setH([...h, { t, d, s: "todo" }]); setT(""); }}>Post to students</button><p className="muted">{h.length} assignments posted. Students see them straight away.</p></div>; }
const Stats = () => { const [ap] = useStore("apps", apps); return <div className="grid span">{[["Enrolled", stats.enrolled], ["Attendance", stats.attendance + "%"], ["Fees collected", stats.collected + "%"], ["Open applications", ap.filter(x => x.s < 3 && !x.dec).length]].map(([l, v]) => <div className="panel" key={l}><div className="stat">{v}</div><span className="muted">{l}</span></div>)}</div>; };
const Alerts = () => <div className="span"><h3>Needs attention</h3>{alerts.map(a => <div className="warn" key={a}>{a}</div>)}</div>;
function Pipeline() { const [a, setA] = useStore("apps", apps);
  const mv = (id, d) => setA(a.map(x => { if (x.id !== id) return x; if (d > 0 && x.s === 2 && !x.fee) return x; const s = Math.max(0, Math.min(3, x.s + d)); const nl = s === 3 && !x.login; const login = nl ? { user: x.ref || "BN-" + x.id, pin: String(Math.floor(1000 + Math.random() * 9000)) } : x.login; return { ...x, s, login, mustChange: nl ? true : x.mustChange }; }));
  const fee = id => setA(a.map(x => x.id === id ? { ...x, fee: !x.fee } : x));
  const rp = id => { resetPin("app", id); setA(getApps()); };
  const dc = (id, v) => setA(a.map(x => x.id === id ? { ...x, dec: v } : x));
  return <div className="grid span">{stages.map((s, si) => <div className="panel" key={s}><h3>{s} ({a.filter(x => x.s === si).length})</h3>{a.filter(x => x.s === si).map(x => <div className="ev" key={x.id} style={{ display: "block" }}>
    <div style={{ display: "flex", alignItems: "center" }}><span style={{ flex: 1 }}>{x.n}<br /><span className="muted">{x.l}{x.ref ? ", " + x.ref : ""}</span></span>
      {!x.dec && si > 0 && <button className="mv" aria-label={"Move " + x.n + " back"} onClick={() => mv(x.id, -1)}>‹</button>}{!x.dec && si < 3 && !(si === 2 && !x.fee) && <button className="mv" aria-label={"Move " + x.n + " forward"} onClick={() => mv(x.id, 1)}>›</button>}</div>
    {x.phone && <p className="muted" style={{ margin: ".2rem 0" }}>{x.by}, {x.phone}</p>}
    {si === 2 && !x.fee && <><button className="btn dark" onClick={() => fee(x.id)}>Mark acceptance fee paid</button><p className="muted" style={{ margin: ".2rem 0" }}>The family moves to Enrolled once the fee is confirmed.</p></>}
    {si === 2 && x.fee && <p className="muted" style={{ margin: ".2rem 0" }}>Acceptance fee confirmed — ready to enrol.</p>}
    {x.dec ? <><span className="tag" style={{ background: "#f6d9d3" }}>Declined</span> <button className="mv" style={{ width: "auto", padding: "0 .6rem" }} onClick={() => dc(x.id, false)}>Reopen</button></> : si < 3 && <button className="mv" style={{ width: "auto", padding: "0 .6rem" }} onClick={() => dc(x.id, true)}>Decline</button>}
    {x.login && <p className="muted" style={{ margin: ".2rem 0" }}>Login {x.login.user}, PIN {x.login.pin}{x.mustChange ? " (temporary — changes on first sign-in)" : ""} <button className="mv" style={{ width: "auto", padding: "0 .6rem" }} onClick={() => rp(x.id)}>Reset PIN</button></p>}</div>)}</div>)}</div>; }
function Defaulters() { const [r, setR] = useStore("rem", {}); return <><div className="panel"><h3>Collected this term</h3><div className="stat">{stats.collected}%</div><Bar v={stats.collected} /></div>
  <div className="panel"><h3>Overdue families</h3><table><tbody>{defaulters.map(d => <tr key={d[0]}><td>{d[0]}</td><td>{money(d[1])}</td><td className="muted">{d[2]} days</td><td>{r[d[0]] ? <span className="tag done">Reminded</span> : <button className="btn dark" onClick={() => setR({ ...r, [d[0]]: 1 })}>Remind</button>}</td></tr>)}</tbody></table></div></>; }
function Broadcast() { const [log, setLog] = useStore("bc", []); const [t, setT] = useState(""); const [a, setA] = useState("All parents");
  return <><form className="panel stack" onSubmit={e => { e.preventDefault(); setLog([{ a, t }, ...log]); setT(""); }}><h3>Send a message</h3><label>Audience<select value={a} onChange={e => setA(e.target.value)}><option>All parents</option><option>JHS 3A parents</option><option>Staff</option></select></label>
    <label>Message<textarea rows="4" required value={t} onChange={e => setT(e.target.value)} /></label><button className="btn dark">Send by SMS and email</button></form>
    <div className="panel"><h3>Sent</h3>{log.length ? log.map((l, i) => <div className="ev" key={i}><b>{l.a}</b><span>{l.t}</span></div>) : <p className="muted">Nothing sent yet.</p>}</div></>; }
function Settings({ theme, setTheme }) { const [csv, setCsv] = useState("name,class,parent_phone\nEfua Asante,JHS 1A,0240000000\nNana Addo,JHS 1A,0201111111"); const [ok, setOk] = useState(false);
  const rows = csv.trim().split("\n").slice(1).filter(Boolean).map(l => l.split(","));
  return <><div className="panel"><h3>School colour</h3><p className="muted">Changes the portal look. No code needed.</p><div className="tog">{["#123b2e", "#1d3557", "#5a189a", "#7a1f2b"].map(c => <button key={c} aria-label={"Use " + c} className={theme === c ? "on" : ""} style={{ background: c, width: 38, height: 38 }} onClick={() => setTheme(c)} />)}</div></div>
  <div className="panel stack"><h3>Import students</h3><p className="muted">Paste a CSV with name, class and parent phone.</p><textarea rows="5" value={csv} onChange={e => { setCsv(e.target.value); setOk(false); }} />
    <table><tbody>{rows.slice(0, 3).map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table><button className="btn dark" onClick={() => setOk(true)}>Import {rows.length} students</button>{ok && <p role="status">{rows.length} students and their parents are ready in this demo. In the live system, invite links would go out by SMS.</p>}</div>
  <div className="panel stack"><h3>Start setup again</h3><p className="muted">Clears the school details and all demo data in this browser, then shows the setup questions.</p><button className="btn ghost" onClick={() => { Object.keys(localStorage).filter(k => k.startsWith("gh:")).forEach(k => localStorage.removeItem(k)); location.href = "/"; }}>Reset and run setup</button> <button className="btn ghost" onClick={() => { Object.keys(localStorage).filter(k => k.startsWith("gh:") && k !== "gh:setup").forEach(k => localStorage.removeItem(k)); localStorage.setItem("gh:seeded", "1"); location.reload(); }}>Clear sample data</button></div></>; }
const Overview = () => <><Stats /><Alerts /><div className="panel span"><h3>Attendance by class</h3>{classes.map(c => <div key={c.n} style={{ marginBottom: ".6rem" }}><b>{c.n}</b><Bar v={Math.round(c.present / c.c * 100)} /></div>)}</div></>;
function useNotify() { const [, setN] = useStore("notifs", []); return (to, t) => setN(p => [{ to, t }, ...p]); }
const Notices = ({ role }) => { const [n] = useStore("notifs", []); const mine = n.filter(x => x.to === role); return <div className="panel"><h3>Notices</h3>{mine.length ? mine.map((x, i) => <div className="ev" key={i}><span>{x.t}</span></div>) : <p className="muted">Nothing new.</p>}</div>; };
const Grades = p => { const [r] = useStore("res", "published"); return r === "published" ? <GradesInner {...p} /> : <div className="panel"><h3>Results not published yet</h3><p className="muted">The school is checking this term's results. You will get a notice when they are ready.</p></div>; };
function Subs() { const [subs, setSubs] = useStore("subs", []); const nt = useNotify(); const upd = (i, p) => setSubs(subs.map((s, j) => j === i ? { ...s, ...p } : s));
  return <div className="panel"><h3>Student submissions</h3>{subs.length ? subs.map((s, i) => <div className="ev" key={i} style={{ display: "block" }}><b>{s.st}</b>, {s.hw}<p className="muted" style={{ margin: ".2rem 0" }}>{s.file ? s.file + " (" + s.size + " KB). " : ""}{s.note}</p>
    <div className="rowf"><input type="number" min="0" max="100" placeholder="Score" style={{ width: "6rem" }} aria-label="Score" value={s.score} onChange={e => upd(i, { score: e.target.value })} /><input placeholder="Feedback" aria-label="Feedback" value={s.fb} onChange={e => upd(i, { fb: e.target.value })} />
    {s.ret ? <span className="tag done">Returned</span> : <button className="btn dark" disabled={s.score === ""} onClick={() => { upd(i, { ret: true }); nt("student", "Your work on " + s.hw + " was marked"); }}>Return</button>}</div></div>) : <p className="muted">No submissions yet. Work students hand in appears here.</p>}</div>; }
function Approvals() { const [rs, setRs] = useStore("res", "published"); const nt = useNotify(); const [g] = useStore("gb", seed);
  const go = (v, m, to) => { setRs(v); to.forEach(r => nt(r, m)); };
  return <div className="panel stack"><h3>{T.term} 1 results, {classes[0].n}</h3><p>Status: <span className="tag">{rs}</span> Class average {avg(roster.map(n => avg(g[n])))}%</p>
    {rs === "submitted" ? <div className="rowf"><button className="btn dark" onClick={() => go("published", T.term + " 1 results are now published", ["parent", "student", "teacher"])}>Approve and publish</button><button className="btn ghost" onClick={() => go("draft", "Results sent back for changes", ["teacher"])}>Send back</button></div> : <p className="muted">{rs === "published" ? "Parents and students can see these results." : "Waiting for the teacher to submit."}</p>}</div>; }
function Absence({ ch }) { const [a, setA] = useStore("abs", []); const nt = useNotify(); const [d, setD] = useState(""); const [r, setR] = useState("Sick");
  return <form className="panel stack" onSubmit={e => { e.preventDefault(); setA([{ n: ch.n, d, r, ok: false }, ...a]); nt("teacher", ch.n + " will be absent on " + d + " (" + r + ")"); setD(""); }}><h3>Report an absence</h3>
    <label>Date<input type="date" required value={d} onChange={e => setD(e.target.value)} /></label><label>Reason<select value={r} onChange={e => setR(e.target.value)}><option>Sick</option><option>Family event</option><option>Appointment</option><option>Other</option></select></label>
    <button className="btn dark">Send to school</button>{a.slice(0, 3).map((x, i) => <p className="muted" key={i}>{x.n}, {x.d}: {x.ok ? "Excused" : "Sent"}</p>)}</form>; }
function AbsList() { const [a, setA] = useStore("abs", []); return <div className="panel"><h3>Absence notes from parents</h3>{a.length ? a.map((x, i) => <div className="ev" key={i} style={{ alignItems: "center" }}><span style={{ flex: 1 }}>{x.n}, {x.d}, {x.r}</span>{x.ok ? <span className="tag done">Excused</span> : <button className="btn dark" onClick={() => setA(a.map((y, j) => j === i ? { ...y, ok: true } : y))}>Excuse</button>}</div>) : <p className="muted">No absence notes.</p>}</div>; }
function Notes() { const [n, setN] = useStore("notes", []); const nt = useNotify(); const [st, setSt] = useState(roster[0]); const [k, setK] = useState("Praise"); const [t, setT] = useState("");
  return <form className="panel stack" onSubmit={e => { e.preventDefault(); if (!t.trim()) return; setN([{ st, k, t }, ...n]); if (st === "Kofi Mensah") nt("parent", k + " note about Kofi: " + t); setT(""); }}><h3>Add a student note</h3>
    <label>Student<select value={st} onChange={e => setSt(e.target.value)}>{roster.map(r => <option key={r}>{r}</option>)}</select></label><label>Type<select value={k} onChange={e => setK(e.target.value)}><option>Praise</option><option>Concern</option></select></label>
    <label>Note<textarea rows="3" value={t} onChange={e => setT(e.target.value)} /></label><button className="btn dark">Save note</button><p className="muted">{n.length} notes saved. Notes about Kofi are shared with his parent.</p></form>; }
const NotesFeed = ({ ch }) => { const [n] = useStore("notes", []); const m = n.filter(x => x.st === ch.n); return m.length ? <div className="panel"><h3>From the teacher</h3>{m.map((x, i) => <div className="ev" key={i}><b>{x.k}</b><span>{x.t}</span></div>)}</div> : null; };
const navFor = r => Object.keys(views[r] || {}).filter(k => T.adult || !((r === "student" && ["Fees", "Messages", "Register", "GPA", "Transcript", "Hostel"].includes(k)) || (r === "admin" && k === "Hostels")));
const views = {
  parent: { Overview: p => <><Digest {...p} /><NotesFeed {...p} /><Today /><Ann /></>, Grades, Fees, Forms: p => <><Forms /><Absence {...p} /></>, Messages: () => <Msgs me="Ama Mensah" />, Transport: p => <X.TransportParent {...p} />, Health: p => <X.HealthParent {...p} />, Notices: () => <Notices role="parent" /> },
  student: { Today: () => <><Today /><Ann /></>, Homework, Goals, "Check-in": Checkin, Grades, Fees, Messages: () => <Msgs me="Kofi Mensah" />, Exams: X.ExamsStudent, Library: X.Library, Register: X.Register, GPA: X.Gpa, Transcript: X.Transcript, Hostel: X.HostelStudent, Notices: () => <Notices role="student" /> },
  teacher: { Classes, Attendance: () => <><Attendance /><AbsList /></>, Gradebook, Assignments: Assign, Submissions: Subs, Notes, Leave: X.LeaveTeacher, Pickup: X.PickupTeacher, Resources: X.ResourcesTeacher, Messages: () => <Msgs me={roles.teacher.user} />, Notices: () => <Notices role="teacher" /> },
  admin: { Overview, Enrollment: Pipeline, Results: Approvals, Fees: Defaulters, Timetable: X.TimetableAdmin, Exams: X.ExamsAdmin, Staff: X.StaffAdmin, Transport: X.TransportAdmin, Library: X.LibraryAdmin, Alumni: X.AlumniAdmin, Hostels: X.HostelAdmin, Broadcast, Settings, Notices: () => <Notices role="admin" /> },
  nurse: { "Sick bay": X.SickBay, "Emergency info": X.EmergencyInfo, Notices: () => <Notices role="nurse" /> },
};
export default function Portal() {
  const { role } = useParams(); const r = useRouter(); const cfg = roles[role];
  const [tab, setTab] = useState(navFor(role)[0]); const [ci, setCi] = useState(0); const [me] = useStore("me", null); const [theme, setTheme] = useStore("theme", school.accent || "#123b2e");
  if (!cfg) return <main className="wrap"><h1>Unknown role</h1></main>;
  const [ap] = useStore("apps", apps);
  const kids = role === "parent" && me && me.role === "parent" ? ap.filter(x => x.s === 3 && x.by === me.name).map(x => ({ n: x.n, cls: x.l })) : [];
  const kidList = kids.length ? kids : children;
  const ch = role === "parent" ? kidList[Math.min(ci, kidList.length - 1)] : children[0]; const View = views[role][tab];
  return (<div className="shell" style={{ "--board": theme }}><aside className="side noprint"><b style={{ fontFamily: "var(--display)", fontSize: "1.2rem", marginBottom: "1rem" }}>{school.name}</b>
    {navFor(role).map(n => <button key={n} aria-current={n === tab} onClick={() => setTab(n)}>{n}</button>)}
    <button onClick={() => r.push("/login")} style={{ marginTop: "auto" }}>Switch role</button></aside>
    <main className="main"><div className="noprint"><h1>{tab}</h1><p className="muted">{cfg.label} view, signed in as {me && me.role === role ? me.name : cfg.user}</p></div>
      {role === "parent" && <div className="tog noprint" style={{ marginBottom: "1rem" }}>{kidList.map((c, i) => <button key={c.n} className={ci === i ? "on" : ""} onClick={() => setCi(i)}>{c.n.split(" ")[0]}, {c.cls}</button>)}</div>}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", alignItems: "start" }}><View ch={ch} theme={theme} setTheme={setTheme} /></div></main></div>);
}
