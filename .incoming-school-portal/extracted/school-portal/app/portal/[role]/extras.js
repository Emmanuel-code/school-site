"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { roster, grades, children, classes, roles } from "@/lib/data";
const Bar = ({ v }) => <div className="bar"><i style={{ width: v + "%" }} /></div>;
const Row = ({ children }) => <div className="ev" style={{ alignItems: "center" }}>{children}</div>;
const Empty = ({ t }) => <p className="muted">{t}</p>;
const avg = a => Math.round(a.reduce((x, y) => x + (+y || 0), 0) / a.length);
const bad = { background: "#f6d9d3" };
function useNotify() { const [, s] = useStore("notifs", []); return (to, t) => s(p => [{ to, t }, ...p]); }
function AddForm({ title, fields, onAdd, btn = "Add" }) {
  const [v, setV] = useState({});
  return <form className="panel stack" onSubmit={e => { e.preventDefault(); onAdd(v); setV({}); }}><h3>{title}</h3>
    {fields.map(([k, l, t, o]) => <label key={k}>{l}{o ? <select required value={v[k] || ""} onChange={e => setV({ ...v, [k]: e.target.value })}><option value="">Choose</option>{o.map(x => <option key={x}>{x}</option>)}</select> : <input required type={t || "text"} value={v[k] || ""} onChange={e => setV({ ...v, [k]: e.target.value })} />}</label>)}
    <button className="btn dark">{btn}</button></form>;
}
const Del = ({ onClick, l }) => <button className="mv" aria-label={l} onClick={onClick}>x</button>;
/* 1. Timetable and calendar */
export function TimetableAdmin() {
  const [slots, setSlots] = useStore("slots", [{ day: "Mon", time: "08:00", subject: "Mathematics", teacher: "Mr. Owusu", room: "Rm 4" }]);
  const [ev, setEv] = useStore("events", [{ date: "2026-11-03", t: "Open day" }, { date: "2026-11-12", t: "Science fair" }]);
  const clash = s => slots.some(o => o !== s && o.day === s.day && o.time === s.time && (o.room === s.room || o.teacher === s.teacher));
  const ics = () => { const b = ev.map((e, i) => `BEGIN:VEVENT\r\nUID:${i}@school\r\nDTSTART;VALUE=DATE:${e.date.replaceAll("-", "")}\r\nSUMMARY:${e.t}\r\nEND:VEVENT`).join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["BEGIN:VCALENDAR\r\nVERSION:2.0\r\n" + b + "\r\nEND:VCALENDAR"], { type: "text/calendar" })); a.download = "school-calendar.ics"; a.click(); };
  return <>
    <div className="panel span"><h3>Weekly timetable</h3>{slots.length ? <table><tbody>{slots.map((s, i) => <tr key={i}><td>{s.day} {s.time}</td><td>{s.subject}</td><td>{s.teacher}, {s.room}</td><td>{clash(s) && <span className="tag" style={bad}>Clash</span>}</td><td><Del l="Remove lesson" onClick={() => setSlots(slots.filter((_, j) => j !== i))} /></td></tr>)}</tbody></table> : <Empty t="No lessons yet." />}</div>
    <AddForm title="Add a lesson" fields={[["day", "Day", "", ["Mon", "Tue", "Wed", "Thu", "Fri"]], ["time", "Time", "time"], ["subject", "Subject"], ["teacher", "Teacher"], ["room", "Room"]]} onAdd={s => setSlots([...slots, s])} />
    <AddForm title="Add a calendar event" fields={[["date", "Date", "date"], ["t", "Event"]]} onAdd={e => setEv([...ev, e].sort((a, b) => a.date.localeCompare(b.date)))} />
    <div className="panel"><h3>Calendar</h3>{ev.map((e, i) => <Row key={i}><b>{e.date}</b><span>{e.t}</span></Row>)}<button className="btn dark" style={{ marginTop: ".8rem" }} onClick={ics}>Download calendar (.ics)</button><p className="muted">Open the file in Google or Apple Calendar. A live subscribe link needs the database version.</p></div></>;
}
/* 2. Exams */
export function ExamsAdmin() {
  const [ex, setEx] = useStore("exams", [{ subject: "Mathematics", date: "2026-12-01", time: "09:00", hall: "Hall A" }]); const [g] = useStore("gb", null);
  const rows = g ? roster.map(n => avg(g[n] || [0])) : []; const pass = rows.length ? Math.round(rows.filter(v => v >= 50).length / rows.length * 100) : null;
  return <>
    <div className="panel span"><h3>Exam timetable</h3>{ex.map((e, i) => <Row key={i}><b>{e.date}</b><span style={{ flex: 1 }}>{e.subject}, {e.time}, {e.hall}</span><Del l="Remove exam" onClick={() => setEx(ex.filter((_, j) => j !== i))} /></Row>)}</div>
    <AddForm title="Add an exam" fields={[["subject", "Subject"], ["date", "Date", "date"], ["time", "Time", "time"], ["hall", "Hall"]]} onAdd={x => setEx([...ex, x])} />
    <div className="panel"><h3>Seat numbers</h3><p className="muted">Assigned in roster order for {classes[0].n}.</p><table><tbody>{roster.map((n, i) => <tr key={n}><td>{n}</td><td>{ex[0]?.hall || "Hall"}, seat {i + 1}</td></tr>)}</tbody></table></div>
    <div className="panel"><h3>Result analytics</h3>{grades.map(x => <div key={x.s} style={{ marginBottom: ".5rem" }}>{x.s}: <b>{x.v}%</b><Bar v={x.v} /></div>)}<p>Pass rate, {classes[0].n}: <b>{pass === null ? "no scores yet" : pass + "%"}</b></p></div></>;
}
export function ExamsStudent() { const [ex] = useStore("exams", [{ subject: "Mathematics", date: "2026-12-01", time: "09:00", hall: "Hall A" }]);
  return <div className="panel"><h3>My exams</h3>{ex.map((e, i) => <Row key={i}><b>{e.date}</b><span>{e.subject}, {e.time}, {e.hall}, seat {roster.indexOf(children[0].n) + 1}</span></Row>)}</div>; }
/* 3. Staff */
const STAFF = [["Mr. Owusu", "Teacher", 1800], ["Ms. Adjei", "Teacher", 1750], ["Mrs. Boateng", "Office", 1400]];
export function StaffAdmin() {
  const [pay, setPay] = useStore("pay", {}); const [att, setAtt] = useStore("satt", {}); const [lv, setLv] = useStore("leave", []); const nt = useNotify();
  const dec = (i, s) => { setLv(lv.map((x, j) => j === i ? { ...x, s } : x)); nt("teacher", "Leave " + s.toLowerCase() + ": " + lv[i].from); };
  return <>
    <div className="panel span"><h3>Staff attendance and payroll</h3><table><thead><tr><th>Name</th><th>Today</th><th>Monthly pay</th><th></th></tr></thead><tbody>{STAFF.map(([n, r, p]) => <tr key={n}><td>{n}<br /><span className="muted">{r}</span></td>
      <td><span className="tog"><button className={att[n] === "p" ? "on" : ""} onClick={() => setAtt({ ...att, [n]: "p" })}>In</button><button className={"ab " + (att[n] === "a" ? "on" : "")} onClick={() => setAtt({ ...att, [n]: "a" })}>Out</button></span></td>
      <td>GHS {p}</td><td>{pay[n] ? <span className="tag done">Paid</span> : <button className="btn dark" onClick={() => setPay({ ...pay, [n]: 1 })}>Mark paid</button>}</td></tr>)}</tbody></table><p className="muted">Pay figures are samples. Only admins should see this page.</p></div>
    <div className="panel"><h3>Leave requests</h3>{lv.length ? lv.map((l, i) => <Row key={i}><span style={{ flex: 1 }}>{l.n}: {l.from} to {l.to}, {l.why}</span>{l.s ? <span className="tag done">{l.s}</span> : <><button className="btn dark" onClick={() => dec(i, "Approved")}>Approve</button><Del l="Decline" onClick={() => dec(i, "Declined")} /></>}</Row>) : <Empty t="No requests." />}</div></>;
}
export function LeaveTeacher() { const [lv, setLv] = useStore("leave", []); const nt = useNotify(); const me = roles.teacher.user;
  return <><AddForm title="Request leave" btn="Send request" fields={[["from", "From", "date"], ["to", "To", "date"], ["why", "Reason"]]} onAdd={v => { setLv([{ n: me, ...v, s: "" }, ...lv]); nt("admin", me + " requested leave from " + v.from); }} />
    <div className="panel"><h3>My requests</h3>{lv.filter(l => l.n === me).map((l, i) => <Row key={i}><span style={{ flex: 1 }}>{l.from} to {l.to}</span><span className="tag">{l.s || "Waiting"}</span></Row>)}</div></>; }
/* 4. Transport and pickup */
export function TransportAdmin() { const [r, setR] = useStore("routes", [{ name: "Route 1", driver: "Mr. Asare", bus: "GR 1234-24", stops: "Adum, Asokwa, Santasi" }]);
  return <><div className="panel"><h3>Bus routes</h3>{r.map((x, i) => <div className="ev" key={i} style={{ display: "block" }}><b>{x.name}</b>, {x.bus}<p className="muted" style={{ margin: 0 }}>Driver {x.driver}. Stops: {x.stops}</p></div>)}</div>
    <AddForm title="Add a route" fields={[["name", "Route name"], ["bus", "Bus number"], ["driver", "Driver"], ["stops", "Stops, comma separated"]]} onAdd={x => setR([...r, x])} /></>; }
export function TransportParent({ ch }) { const [c, setC] = useStore("collectors", {}); const [log] = useStore("pickups", []); const [r] = useStore("routes", []); const mine = c[ch.n] || []; const mylog = log.filter(l => l.st === ch.n);
  return <><AddForm title={"Who may collect " + ch.n.split(" ")[0]} btn="Add person" fields={[["name", "Full name"], ["rel", "Relationship"]]} onAdd={x => setC({ ...c, [ch.n]: [...mine, x] })} />
    <div className="panel"><h3>Approved collectors</h3>{mine.length ? mine.map((x, i) => <Row key={i}>{x.name}, {x.rel}</Row>) : <Empty t="No one added yet. Teachers will flag anyone not on this list." />}</div>
    <div className="panel"><h3>Pickup record</h3>{mylog.length ? mylog.map((l, i) => <Row key={i}><b>{l.at}</b><span>{l.who}{l.ok ? "" : " (not on list)"}</span></Row>) : <Empty t="No pickups recorded." />}</div>
    {r[0] && <div className="panel"><h3>School bus</h3><p>{r[0].name}, driver {r[0].driver}. Stops: {r[0].stops}</p></div>}</>; }
export function PickupTeacher() { const [c] = useStore("collectors", {}); const [log, setLog] = useStore("pickups", []); const nt = useNotify();
  return <><AddForm title="Record a pickup" btn="Save" fields={[["st", "Student", "", roster], ["who", "Collected by"]]} onAdd={v => { const ok = (c[v.st] || []).some(x => x.name.toLowerCase() === v.who.trim().toLowerCase());
      setLog([{ ...v, ok, at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...log]); if (!ok) nt("parent", "Pickup alert: " + v.st + " was collected by " + v.who + ", who is not on your approved list."); }} />
    <div className="panel"><h3>Today</h3>{log.length ? log.map((l, i) => <Row key={i}><b>{l.at}</b><span style={{ flex: 1 }}>{l.st} with {l.who}</span>{!l.ok && <span className="tag" style={bad}>Not on list</span>}</Row>) : <Empty t="Nothing recorded yet." />}</div></>; }
/* 5. Library and resources */
const BOOKS = [["Things Fall Apart", "Chinua Achebe"], ["The Boy Who Harnessed the Wind", "William Kamkwamba"], ["Integrated Science 2", "GES"]];
export function ResourcesTeacher() { const [r, setR] = useStore("res_files", []);
  return <><AddForm title="Share a resource" btn="Share" fields={[["t", "Title"], ["f", "File name or link"], ["kind", "Type", "", ["Past paper", "Class notes", "Reading list"]], ["cls", "Class", "", classes.map(c => c.n)]]} onAdd={x => setR([x, ...r])} />
    <div className="panel"><h3>Shared so far</h3>{r.length ? r.map((x, i) => <Row key={i}><b>{x.kind}</b><span>{x.t}, {x.cls}</span></Row>) : <Empty t="Nothing shared yet." />}</div></>; }
export function Library() { const [r] = useStore("res_files", []); const [loans, setLoans] = useStore("loans", {}); const me = children[0].n;
  return <><div className="panel"><h3>Past papers and notes</h3>{r.length ? r.map((x, i) => <Row key={i}><b>{x.kind}</b><span>{x.t}, {x.cls}</span></Row>) : <Empty t="Your teachers have not shared anything yet." />}</div>
    <div className="panel"><h3>Library books</h3>{BOOKS.map(([t, a]) => { const l = loans[t]; return <Row key={t}><span style={{ flex: 1 }}>{t}<br /><span className="muted">{a}</span></span>{!l ? <button className="btn dark" onClick={() => setLoans({ ...loans, [t]: { by: me, due: "in 14 days" } })}>Borrow</button> : l.by === me ? <span className="tag done">Yours, due {l.due}</span> : <span className="tag">Out</span>}</Row>; })}</div></>; }
export function LibraryAdmin() { const [loans, setLoans] = useStore("loans", {}); const o = Object.entries(loans);
  return <div className="panel span"><h3>Books on loan</h3>{o.length ? o.map(([t, l]) => <Row key={t}><span style={{ flex: 1 }}>{t}, {l.by}, due {l.due}</span><button className="btn dark" onClick={() => { const n = { ...loans }; delete n[t]; setLoans(n); }}>Mark returned</button></Row>) : <Empty t="No books out." />}</div>; }
/* 6. Health and welfare */
export function SickBay() { const [v, setV] = useStore("sick", []); const nt = useNotify();
  return <><AddForm title="Log a visit" btn="Save visit" fields={[["st", "Student", "", roster], ["why", "Complaint"], ["act", "Action taken"], ["home", "Sent home?", "", ["No", "Yes"]]]}
      onAdd={x => { setV([{ ...x, at: new Date().toLocaleDateString() }, ...v]); if (x.st === children[0].n) nt("parent", x.st.split(" ")[0] + " visited the school nurse: " + x.why + (x.home === "Yes" ? ". Please collect them." : ".")); }} />
    <div className="panel"><h3>Recent visits</h3>{v.length ? v.map((x, i) => <Row key={i}><b>{x.at}</b><span>{x.st}: {x.why}. {x.act}.{x.home === "Yes" ? " Sent home." : ""}</span></Row>) : <Empty t="No visits logged." />}<p className="muted">Kept private: only the nurse, the admin and the child's parent should see this.</p></div></>; }
export function EmergencyInfo() { const [h] = useStore("health", {}); const e = Object.entries(h);
  return <div className="panel span"><h3>Emergency contacts and medical notes</h3>{e.length ? e.map(([n, x]) => <div className="ev" key={n} style={{ display: "block" }}><b>{n}</b><p className="muted" style={{ margin: 0 }}>Contact: {x.contact}. Notes: {x.notes}</p></div>) : <Empty t="No parents have added details yet." />}</div>; }
export function HealthParent({ ch }) { const [h, setH] = useStore("health", {}); const [v] = useStore("sick", []); const d = h[ch.n]; const mine = v.filter(x => x.st === ch.n);
  return <><AddForm title={"Health details for " + ch.n.split(" ")[0]} btn="Save" fields={[["contact", "Emergency contact name and phone"], ["notes", "Allergies or medical notes (write none if nothing)"]]} onAdd={x => setH({ ...h, [ch.n]: x })} />
    <div className="panel"><h3>On file</h3>{d ? <p>Contact: {d.contact}. Notes: {d.notes}.</p> : <Empty t="Nothing saved yet." />}<p className="muted">Only the school nurse and admin can see this.</p></div>
    <div className="panel"><h3>Nurse visits</h3>{mine.length ? mine.map((x, i) => <Row key={i}><b>{x.at}</b><span>{x.why}. {x.act}.</span></Row>) : <Empty t="No visits." />}</div></>; }
/* 7. Alumni */
export function AlumniAdmin() { const [al] = useStore("alumni", []); const [pl] = useStore("pledges", []);
  return <><div className="panel"><h3>Alumni list ({al.length})</h3>{al.length ? al.map((a, i) => <Row key={i}><b>{a.year}</b><span>{a.name}, {a.phone}</span></Row>) : <Empty t="Nobody has joined yet. Share the Alumni page link." />}</div>
    <div className="panel"><h3>Pledges</h3>{pl.length ? pl.map((p, i) => <Row key={i}><b>GHS {p.amt}</b><span>{p.name}, {p.c}</span></Row>) : <Empty t="No pledges yet." />}</div></>; }
/* 8. Tertiary extras */
const COURSES = [["CS201", "Data Structures", 3], ["MA202", "Calculus II", 3], ["EN110", "Technical Writing", 2], ["CS230", "Database Systems", 3], ["CS250", "Operating Systems", 3], ["EC101", "Intro Economics", 3]];
const PTS = { A: 4, B: 3, C: 2, D: 1, F: 0 }; const cr = c => COURSES.find(x => x[0] === c)[2];
export function Register() { const [reg, setReg] = useStore("reg", []); const n = reg.reduce((a, c) => a + cr(c), 0);
  return <div className="panel"><h3>Course registration</h3><p className="muted">{n} of 21 credits registered.</p>{COURSES.map(([c, t, k]) => <Row key={c}><span style={{ flex: 1 }}>{c} {t} <span className="muted">({k} credits)</span></span>{reg.includes(c) ? <button className="btn ghost" onClick={() => setReg(reg.filter(x => x !== c))}>Drop</button> : <button className="btn dark" disabled={n + k > 21} onClick={() => setReg([...reg, c])}>Register</button>}</Row>)}</div>; }
export function Gpa() { const [reg] = useStore("reg", []); const [gr, setGr] = useStore("cgrades", {}); const rows = reg.filter(c => gr[c]); const k = rows.reduce((a, c) => a + cr(c), 0);
  return <div className="panel"><h3>GPA calculator</h3>{reg.length ? <>{reg.map(c => <Row key={c}><span style={{ flex: 1 }}>{c} {COURSES.find(x => x[0] === c)[1]}</span><select aria-label={"Expected grade for " + c} style={{ width: "6rem" }} value={gr[c] || ""} onChange={e => setGr({ ...gr, [c]: e.target.value })}><option value="">Grade</option>{Object.keys(PTS).map(l => <option key={l}>{l}</option>)}</select></Row>)}
    <div className="stat">{k ? (rows.reduce((a, c) => a + PTS[gr[c]] * cr(c), 0) / k).toFixed(2) : "-"}</div><span className="muted">projected, 4.0 scale. This is only a what-if tool.</span></> : <Empty t="Register for courses first." />}</div>; }
export function Transcript() {
  const rows = grades.map(g => { const c = COURSES.find(x => x[1] === g.s) || ["", g.s, 3]; return [c[0], c[1], c[2], g.v, g.v >= 80 ? "A" : g.v >= 70 ? "B" : g.v >= 60 ? "C" : g.v >= 50 ? "D" : "F"]; });
  const k = rows.reduce((a, r) => a + r[2], 0);
  return <div className="panel card"><h3>Official transcript</h3><p className="muted">{children[0].n}, {children[0].cls}</p><table><thead><tr><th>Code</th><th>Course</th><th>Credits</th><th>Score</th><th>Grade</th></tr></thead><tbody>{rows.map(r => <tr key={r[1]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody></table>
    <p><b>GPA {(rows.reduce((a, r) => a + PTS[r[4]] * r[2], 0) / k).toFixed(2)}</b> over {k} credits</p><button className="btn dark noprint" onClick={() => window.print()}>Print or save as PDF</button></div>; }
const HALLS = ["Unity Hall", "Akuafo Hall", "Independence Hall"];
export function HostelStudent() { const [h, setH] = useStore("hostels", {}); const nt = useNotify(); const me = children[0].n; const x = h[me];
  return x ? <div className="panel"><h3>Hostel</h3><p>{x.hall}: {x.room ? "Room " + x.room + " allocated." : "request pending."}</p></div> : <AddForm title="Apply for a hostel" btn="Apply" fields={[["hall", "First choice", "", HALLS]]} onAdd={v => { setH({ ...h, [me]: { hall: v.hall, room: "" } }); nt("admin", me + " applied for " + v.hall); }} />; }
export function HostelAdmin() { const [h, setH] = useStore("hostels", {}); const nt = useNotify(); const [rm, setRm] = useState({}); const e = Object.entries(h);
  return <div className="panel span"><h3>Hostel requests</h3>{e.length ? e.map(([n, x]) => <Row key={n}><span style={{ flex: 1 }}>{n}, {x.hall}</span>{x.room ? <span className="tag done">Room {x.room}</span> : <><input style={{ width: "6rem" }} aria-label={"Room for " + n} placeholder="Room" value={rm[n] || ""} onChange={ev => setRm({ ...rm, [n]: ev.target.value })} />
    <button className="btn dark" disabled={!rm[n]} onClick={() => { setH({ ...h, [n]: { ...x, room: rm[n] } }); nt("student", "Hostel allocated: " + x.hall + ", room " + rm[n]); }}>Allocate</button></>}</Row>) : <Empty t="No requests yet." />}</div>; }
