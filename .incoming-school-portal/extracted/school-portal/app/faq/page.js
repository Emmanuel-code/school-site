"use client";
import Link from "next/link";
import { school, faqs } from "@/lib/data";
export default function Faq() {
  return (<><div className="bar-top"><div className="wrap">Call {school.phone} or email {school.email}</div></div>
    <main className="wrap" style={{ padding: "2.5rem 1.25rem" }}><Link href="/">Back to the school site</Link>
      <h1 style={{ marginTop: "1rem" }}>Questions parents ask</h1>
      <div style={{ maxWidth: 720, marginTop: "1.5rem" }}>{faqs.map(([q, a]) => (<details className="faq" key={q}><summary>{q}</summary><p className="muted">{a}</p></details>))}</div>
      <p style={{ marginTop: "2rem" }}>Still stuck? Call {school.phone} or email {school.email}.</p></main></>);
}
