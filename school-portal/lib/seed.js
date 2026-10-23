export function seedOnce(type) {
  try {
    if (localStorage.getItem("gh:seeded")) return;
    const A = type === "tertiary";
    const cls = A ? "BSc Computer Science Y2" : "JHS 2A";
    const hw = A ? ["Assignment 2: linked lists", "Lab report: SQL joins"] : ["Algebra worksheet 7", "Essay: A day in my town"];
    const T = A ? "Dr. Owusu" : "Mr. Owusu";
    const d = {
      notifs: [
        { to: "teacher", t: "Abena Owusu handed in: " + hw[0] }, { to: "teacher", t: "Yaw Boateng handed in: " + hw[1] },
        { to: "admin", t: "12 applications are waiting for review" }, { to: "admin", t: "Fee reminders were sent to 3 families" },
        { to: "student", t: "New homework posted: " + hw[1] }, { to: "parent", t: "Term fees are due on 15 Nov" }, { to: "nurse", t: "Two new health forms were submitted" },
      ],
      msgs: A ? [{ f: "Kofi Mensah", x: "Good afternoon Dr. Owusu, may I hand in assignment 2 on Monday?" }, { f: T, x: "Yes, Monday at 9:00 is fine." }]
        : [{ f: T, x: "Kofi did well on Friday's algebra quiz." }, { f: "Ama Mensah", x: "Thank you! He has been practising every evening." }, { f: T, x: "Wonderful. Please remind him to bring his geometry set on Monday." }],
      subs: [
        { hw: hw[0], st: "Abena Owusu", file: "abena-worksheet.pdf", size: 412, note: "", score: "", fb: "", ret: false },
        { hw: hw[1], st: "Yaw Boateng", file: "", size: 0, note: "My answers are below. Question 3 was the hardest.", score: "78", fb: "Good work. Check question 3 again.", ret: true },
      ],
      att: { "Kofi Mensah": "p", "Abena Owusu": "p", "Yaw Boateng": "a", "Efua Asante": "p", "Nana Addo": "p", "Esi Quaye": "p" },
      abs: [{ n: A ? "Yaw Boateng" : "Adwoa Mensah", d: "2026-10-28", r: "Appointment", ok: false }],
      notes: [{ st: "Kofi Mensah", k: "Praise", t: A ? "Led the group project very well." : "Helped a classmate with fractions." }, { st: "Yaw Boateng", k: "Concern", t: "Has been late three times this week." }],
      bc: [{ a: "All parents", t: "School closes at 12:00 on Friday for the mid-term break." }],
      slips: { "Photo consent": 1 },
      slots: [
        { day: "Mon", time: "08:00", subject: "Mathematics", teacher: T, room: "Rm 4" }, { day: "Mon", time: "08:00", subject: "English", teacher: "Ms. Adjei", room: "Rm 4" },
        { day: "Mon", time: "09:30", subject: "Integrated Science", teacher: "Mrs. Boateng", room: "Lab" }, { day: "Tue", time: "08:00", subject: "History", teacher: "Ms. Adjei", room: "Rm 6" },
        { day: "Wed", time: "11:00", subject: "ICT", teacher: T, room: "Computer lab" }, { day: "Fri", time: "09:00", subject: "Mathematics", teacher: T, room: "Rm 4" },
      ],
      events: [{ date: "2026-11-03", t: "Open day" }, { date: "2026-11-12", t: "Science fair" }, { date: "2026-11-20", t: "Parents and teachers evening" }, { date: "2026-12-05", t: "Carol service" }],
      exams: [{ subject: "Mathematics", date: "2026-12-01", time: "09:00", hall: "Hall A" }, { subject: "English", date: "2026-12-02", time: "09:00", hall: "Hall A" }, { subject: "Integrated Science", date: "2026-12-04", time: "10:30", hall: "Hall B" }],
      pay: { [T]: 1 }, satt: { [T]: "p", "Ms. Adjei": "p", "Mrs. Boateng": "a" },
      leave: [{ n: "Ms. Adjei", from: "2026-11-10", to: "2026-11-12", why: "Family event", s: "" }, { n: T, from: "2026-09-15", to: "2026-09-16", why: "Training workshop", s: "Approved" }],
      routes: [{ name: "Route 1", driver: "Mr. Asare", bus: "GR 1234-24", stops: "Adum, Asokwa, Santasi" }, { name: "Route 2", driver: "Mr. Danso", bus: "GR 5678-24", stops: "Ejisu, Kwadaso, Suame" }],
      collectors: { "Kofi Mensah": [{ name: "Ama Mensah", rel: "Mother" }, { name: "Kwame Mensah", rel: "Father" }], "Adwoa Mensah": [{ name: "Ama Mensah", rel: "Mother" }] },
      pickups: [{ st: "Kofi Mensah", who: "Ama Mensah", ok: true, at: "15:40" }, { st: "Abena Owusu", who: "Uncle Kojo", ok: false, at: "15:45" }],
      res_files: [{ t: "Maths mock paper 2025", f: "maths-mock-2025.pdf", kind: "Past paper", cls: cls }, { t: "Photosynthesis notes", f: "photosynthesis.pdf", kind: "Class notes", cls: cls }, { t: "Term reading list", f: "reading-list.pdf", kind: "Reading list", cls: cls }],
      loans: { "Things Fall Apart": { by: "Abena Owusu", due: "in 9 days" } },
      sick: [{ st: "Efua Asante", why: "Headache", act: "Rested and drank water", home: "No", at: "21/10/2026" }, { st: "Nana Addo", why: "Sprained ankle in football", act: "Ice pack, parent called", home: "Yes", at: "20/10/2026" }],
      health: { "Kofi Mensah": { contact: "Ama Mensah, 0240000000", notes: "Mild asthma, inhaler in school bag" }, "Adwoa Mensah": { contact: "Ama Mensah, 0240000000", notes: "None" } },
      alumni: [{ name: "Akosua Frimpong", year: "2012", phone: "0201111111" }, { name: "Daniel Tetteh", year: "2015", phone: "0242222222" }, { name: "Linda Amoah", year: "2018", phone: "0553333333" }],
      pledges: [{ c: "Library renovation", amt: "500", name: "Akosua Frimpong" }, { c: "Scholarship fund", amt: "1000", name: "Daniel Tetteh" }, { c: "School bus", amt: "2000", name: "Linda Amoah" }],
    };
    if (A) Object.assign(d, { reg: ["CS201", "MA202", "CS230"], cgrades: { CS201: "A", MA202: "B" }, hostels: { "Abena Owusu": { hall: "Unity Hall", room: "" } } });
    Object.entries(d).forEach(([k, v]) => { if (localStorage.getItem("gh:" + k) === null) localStorage.setItem("gh:" + k, JSON.stringify(v)); });
    localStorage.setItem("gh:seeded", "1");
  } catch {}
}
