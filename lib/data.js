// Drop-in replacement for lib/data.js in Emmanuel-code/school-site (Next.js app dir).
// Rebrands the whole portal as Bernavi International School. Copy this entire file
// over lib/data.js, commit, push — Vercel redeploys automatically.
// TODO: ask Bernavi for their real email and replace admissions@bernavi.invalid.
// Verified facts: Bernavi International School, Tamale, Gbolo-Kpalsi (opp. St Lucy Polyclinic),
// Crèche–JHS ("Admissions open at all levels" — their own Facebook post, Aug 2025), phone 024 994 6094.
export const school = { name: "Bernavi International School", tagline: "Admissions open at all levels.", phone: "024 994 6094", email: "admissions@bernavi.invalid", payments: ["MTN MoMo", "Telecel Cash", "AirtelTigo Money", "Bank transfer", "Cash at the school office"] };

export const faqs = [

  ["What ages and levels do you take?", "We take children from Crèche through JHS 3. Contact the office to confirm the levels open for next term."],

  ["How do I apply?", "Use the form on our website, then keep your reference code and check progress on the Track application page. The office replies within two working days."],

  ["What documents do I need?", "A birth certificate, the last school report card, two passport photos and a copy of the parent or guardian ID."],

  ["How do I pay school fees?", "Pay by mobile money, bank transfer or cash at the school office. You can also pay in 2 or 3 installments from the parent portal."],

  ["Can I see my child's results online?", "Yes. Once results are approved by the school you can view and print the report card from the parent portal."],

  ["What are the school hours?", "Monday to Friday, 7:30 to 16:00. The office closes at 16:30."],

  ["How do I report my child absent?", "Use Report an absence in the parent portal, or call the office before 8:00."],

  ["How can I tell an official message from a scam?", "We never ask you to pay into a personal account or promise a place in exchange for money. Only trust the phone number on this website."],

];

export const roles = {

  parent: { label: "Parent", user: "Ama Mensah", desc: "See your child's grades, fees and messages.", nav: ["Overview", "Grades", "Fees", "Messages"] },

  student: { label: "Student", user: "Kofi Mensah", desc: "Your homework, timetable and grades.", nav: ["Today", "Homework", "Grades", "Resources"] },

  teacher: { label: "Teacher", user: "Mr. Owusu", desc: "Your classes, attendance and gradebook.", nav: ["Classes", "Attendance", "Gradebook", "Messages"] },

  admin: { label: "School office", user: "Mrs. Boateng", desc: "Admissions, fees and announcements for the whole school.", nav: ["Overview", "Enrollment", "Fees", "Broadcast"] },

};

export const timetable = [["8:00","Mathematics","Rm 4"],["9:30","English","Rm 2"],["11:00","Integrated Science","Lab"],["13:00","History","Rm 6"]];

export const homework = [{t:"Algebra worksheet 7",d:"Tomorrow",s:"todo"},{t:"Essay: A day in my town",d:"Fri",s:"todo"},{t:"Science lab report",d:"Mon",s:"done"}];

export const grades = [{s:"Mathematics",v:86,trend:[72,78,81,86]},{s:"English",v:78,trend:[80,74,76,78]},{s:"Integrated Science",v:91,trend:[85,88,90,91]},{s:"History",v:69,trend:[60,64,66,69]}];

export const fees = { total: 4200, paid: 3000, history: [["Term 1 deposit",1500],["Term 1 balance",1500]] };

export const announcements = [{t:"Mid-term break starts Friday",b:"School closes at 12:00. Classes resume on the 3rd."},{t:"Science fair sign-ups open",b:"Pick a project with your science teacher by next week."}];

export const classes = [{n:"JHS 2A",c:32,present:29},{n:"JHS 2B",c:30,present:30},{n:"JHS 3A",c:28,present:24}];

export const roster = ["Kofi Mensah","Abena Owusu","Yaw Boateng","Efua Asante","Nana Addo","Esi Quaye"];

export const stats = { enrolled: 412, attendance: 94, collected: 78, applications: 37 };

export const alerts = ["JHS 3A attendance dropped 8% this month","5 families have fees overdue by 30+ days","12 applications waiting for review"];

export const children=[{n:"Kofi Mensah",cls:"JHS 2A"},{n:"Adwoa Mensah",cls:"Primary 4"}];

export const stages=["New","Interview","Offer","Enrolled"];

export const apps=[{id:1,ref:"BN-10001",n:"Esi Quaye",l:"JHS 1",s:0,by:"Mr. Quaye",phone:"0241112222",adult:false},{id:2,ref:"BN-10002",n:"Yaw Darko",l:"Primary 3",s:0,by:"Mrs. Darko",phone:"0202223333",adult:false},{id:3,ref:"BN-10003",n:"Naa Lamptey",l:"Crèche & KG",s:1,by:"Mr. Lamptey",phone:"0553334444",adult:false},{id:4,ref:"BN-10004",n:"Kwame Ofori",l:"JHS 1",s:2,by:"Mrs. Ofori",phone:"0244445555",adult:false},{id:5,ref:"BN-10005",n:"Akua Sarpong",l:"Primary 5",s:3,by:"Mrs. Sarpong",phone:"0203334444",adult:false,login:{user:"BN-10005",pin:"4821"}}];

export const defaulters=[["Boateng family",2400,62],["Mensah family",1200,45],["Asante family",600,33]];

export const slips=[["Science fair trip","Fri 14 Nov"],["Photo consent",""],["Sports day","Sat 22 Nov"]];

school.levels = ["Crèche & KG", "Primary", "JHS"]; school.accent = "";

export const T = { term: "Term", teacher: "Teacher", adult: false, hero: "A school for Crèche & KG, Primary and JHS, with teachers who know every child by name." };

const LV = { "Crèche & KG": "Play-based learning, early reading and songs — a gentle start for our youngest.", Nursery: "Play-based learning, early reading and songs.", Primary: "Reading, number sense and curiosity, with project days every Friday.", JHS: "Core subjects, ICT and BECE preparation with weekly mock tests.", SHS: "Elective programmes and WASSCE preparation with career guidance.", Diploma: "Practical two-year programmes that lead straight into work or a degree.", Undergraduate: "Degree programmes with lectures, labs and a final-year project.", Postgraduate: "Masters and research degrees with supervised thesis work.", "Short courses": "Evening and weekend courses for working adults." };

export const levelCards = () => school.levels.slice(0, 3).map(l => [l, LV[l] || ""]);

export function applyDemo(cfg) {

  const adult = cfg.type === "tertiary";

  Object.assign(school, { name: cfg.name, tagline: cfg.tagline || school.tagline, phone: cfg.phone || school.phone, email: cfg.email || school.email, levels: cfg.levels, accent: cfg.accent });

  Object.assign(T, { adult, term: adult ? "Semester" : "Term", teacher: adult ? "Lecturer" : "Teacher", hero: adult ? "Programmes at " + cfg.levels.join(", ").toLowerCase() + " level, taught by lecturers who know your name." : "A school for " + cfg.levels.join(", ") + ", with teachers who know every child by name." });

  roles.teacher.label = T.teacher; roles.teacher.user = adult ? "Dr. Owusu" : "Mr. Owusu";

  if (!adult) return;

  apps.splice(0, apps.length, { id: 1, ref: "BN-10001", n: "Esi Quaye", l: "Undergraduate", s: 0, by: "Esi Quaye", phone: "0241112222", adult: true }, { id: 2, ref: "BN-10002", n: "Yaw Darko", l: "Diploma", s: 0, by: "Yaw Darko", phone: "0202223333", adult: true }, { id: 3, ref: "BN-10003", n: "Naa Lamptey", l: "Postgraduate", s: 1, by: "Naa Lamptey", phone: "0553334444", adult: true }, { id: 4, ref: "BN-10004", n: "Kwame Ofori", l: "Undergraduate", s: 2, by: "Kwame Ofori", phone: "0244445555", adult: true }, { id: 5, ref: "BN-10005", n: "Akua Sarpong", l: "Undergraduate", s: 3, by: "Kwame Ofori", phone: "0203334444", adult: true, login: { user: "BN-10005", pin: "4821" } });

  children.splice(0, children.length, { n: "Kofi Mensah", cls: "BSc Computer Science, Year 2" });

  classes.splice(0, classes.length, { n: "BSc Computer Science Y2", c: 60, present: 54 }, { n: "BA Economics Y1", c: 80, present: 71 }, { n: "Diploma in Business Y1", c: 45, present: 45 });

  timetable.splice(0, timetable.length, ["8:00", "Data Structures", "LT 1"], ["10:00", "Calculus II", "Rm 12"], ["13:00", "Technical Writing", "Rm 4"], ["15:00", "Database Systems", "Lab 2"]);

  grades.splice(0, grades.length, { s: "Data Structures", v: 84, trend: [70, 76, 80, 84] }, { s: "Calculus II", v: 72, trend: [65, 68, 70, 72] }, { s: "Technical Writing", v: 79, trend: [75, 77, 78, 79] }, { s: "Database Systems", v: 88, trend: [80, 84, 86, 88] });

  homework.splice(0, homework.length, { t: "Assignment 2: linked lists", d: "Tomorrow", s: "todo" }, { t: "Lab report: SQL joins", d: "Fri", s: "todo" }, { t: "Essay: ethics in computing", d: "Mon", s: "todo" });

  announcements.splice(0, announcements.length, { t: "Exam timetable is out", b: "Check your programme page and report clashes to the registry by Friday." }, { t: "Career fair next month", b: "Employers meet final-year students. Update your CV before then." });

  fees.total = 8400; fees.paid = 5000; fees.history.splice(0, fees.history.length, ["Semester 1 deposit", 3000], ["Semester 1 instalment", 2000]);

}

roles.nurse = { label: "Nurse", user: "Nurse Abena", desc: "Sick bay visits and pupils' health records.", nav: [] };
