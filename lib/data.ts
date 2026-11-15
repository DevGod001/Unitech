// Sample data for the demo portal.
// When the database is connected, these values come from the server instead.

export const UNIVERSITY = {
  name: "Unitech University",
  city: "Port Harcourt",
  session: "2026/2027",
  semester: "First semester",
  registrationCloses: "Friday 27 November 2026",
  feesDue: "Friday 18 December 2026",
  minUnits: 15,
  maxUnits: 24,
};

export const DEMO_LOGIN = {
  matric: "UTP/23/CSC/0142",
  password: "Unitech@2026",
};

export const STUDENT = {
  firstName: "Tamuno",
  lastName: "Briggs",
  matric: DEMO_LOGIN.matric,
  level: "300 Level",
  department: "Computer Science",
  faculty: "Faculty of Computing",
  programme: "B.Sc. Computer Science",
  gender: "Male" as "Male" | "Female",
  stateOfOrigin: "Rivers State",
  headOfDepartment: "Prof. Dagogo Amadi",
  schoolEmail: "tamuno.briggs@student.unitech.edu.ng",
  adviser: "Dr. Ngozi Wokoma",
};

export const DEFAULT_CONTACT = {
  phone: "0803 555 0142",
  email: "tamuno.briggs@example.com",
  address: "14 Aggrey Road, Port Harcourt",
};

export type Course = {
  code: string;
  title: string;
  units: number;
  required: boolean;
  lecturer: string;
};

export const COURSES: Course[] = [
  { code: "CSC 301", title: "Data Structures and Algorithms", units: 3, required: true, lecturer: "Dr. N. Wokoma" },
  { code: "CSC 303", title: "Operating Systems", units: 3, required: true, lecturer: "Prof. D. Amadi" },
  { code: "CSC 305", title: "Database Systems", units: 3, required: true, lecturer: "Dr. I. Okafor" },
  { code: "CSC 307", title: "Software Engineering", units: 3, required: true, lecturer: "Mrs. B. Jaja" },
  { code: "CSC 309", title: "Computer Networks", units: 3, required: true, lecturer: "Dr. S. Bello" },
  { code: "GST 301", title: "Entrepreneurship Studies", units: 2, required: true, lecturer: "Mr. K. Eze" },
  { code: "MTH 301", title: "Numerical Analysis", units: 3, required: false, lecturer: "Dr. A. Nwosu" },
  { code: "CSC 311", title: "Human-Computer Interaction", units: 2, required: false, lecturer: "Ms. T. Hart" },
  { code: "CSC 313", title: "Web Technologies", units: 2, required: false, lecturer: "Mr. O. Adeyemi" },
  { code: "STA 301", title: "Probability and Statistics", units: 2, required: false, lecturer: "Dr. F. Danjuma" },
];

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
export type Day = (typeof DAYS)[number];

export type ClassSlot = { code: string; day: Day; start: string; end: string; venue: string };

export const TIMETABLE: ClassSlot[] = [
  { code: "CSC 301", day: "Monday", start: "8:00 am", end: "10:00 am", venue: "Lecture Theatre 2" },
  { code: "CSC 305", day: "Monday", start: "11:00 am", end: "1:00 pm", venue: "Computing Lab A" },
  { code: "MTH 301", day: "Monday", start: "2:00 pm", end: "4:00 pm", venue: "Science Block, Room 12" },
  { code: "CSC 303", day: "Tuesday", start: "9:00 am", end: "11:00 am", venue: "Lecture Theatre 1" },
  { code: "CSC 311", day: "Tuesday", start: "12:00 pm", end: "2:00 pm", venue: "Computing Block, Room 5" },
  { code: "CSC 307", day: "Wednesday", start: "8:00 am", end: "10:00 am", venue: "Lecture Theatre 2" },
  { code: "CSC 301", day: "Wednesday", start: "11:00 am", end: "12:00 pm", venue: "Computing Lab B" },
  { code: "STA 301", day: "Wednesday", start: "1:00 pm", end: "3:00 pm", venue: "Science Block, Room 4" },
  { code: "CSC 309", day: "Thursday", start: "10:00 am", end: "12:00 pm", venue: "Lecture Theatre 1" },
  { code: "CSC 313", day: "Thursday", start: "1:00 pm", end: "3:00 pm", venue: "Computing Lab A" },
  { code: "GST 301", day: "Friday", start: "9:00 am", end: "11:00 am", venue: "Main Auditorium" },
  { code: "CSC 303", day: "Friday", start: "12:00 pm", end: "1:00 pm", venue: "Computing Lab B" },
];

export type Result = { code: string; title: string; units: number; score: number };
export type SemesterResult = { id: string; label: string; session: string; results: Result[] };

export const RESULTS: SemesterResult[] = [
  {
    id: "200-2",
    label: "200 Level, second semester",
    session: "2025/2026",
    results: [
      { code: "CSC 202", title: "Object-Oriented Programming", units: 3, score: 74 },
      { code: "CSC 204", title: "Computer Architecture", units: 3, score: 66 },
      { code: "CSC 206", title: "Discrete Structures", units: 3, score: 71 },
      { code: "MTH 202", title: "Linear Algebra II", units: 3, score: 58 },
      { code: "STA 202", title: "Statistics for Computing", units: 2, score: 63 },
      { code: "GST 202", title: "Peace and Conflict Studies", units: 2, score: 77 },
    ],
  },
  {
    id: "200-1",
    label: "200 Level, first semester",
    session: "2025/2026",
    results: [
      { code: "CSC 201", title: "Computer Programming I", units: 3, score: 81 },
      { code: "CSC 203", title: "Digital Logic Design", units: 3, score: 64 },
      { code: "CSC 205", title: "Introduction to Systems Analysis", units: 2, score: 69 },
      { code: "MTH 201", title: "Mathematical Methods", units: 3, score: 55 },
      { code: "MTH 203", title: "Linear Algebra I", units: 3, score: 62 },
      { code: "GST 201", title: "Nigerian Peoples and Culture", units: 2, score: 72 },
    ],
  },
  {
    id: "100-2",
    label: "100 Level, second semester",
    session: "2024/2025",
    results: [
      { code: "CSC 102", title: "Introduction to Problem Solving", units: 3, score: 78 },
      { code: "MTH 102", title: "Elementary Mathematics II", units: 3, score: 61 },
      { code: "PHY 102", title: "General Physics II", units: 3, score: 52 },
      { code: "CHM 102", title: "General Chemistry II", units: 3, score: 47 },
      { code: "GST 102", title: "Communication in English II", units: 2, score: 70 },
    ],
  },
  {
    id: "100-1",
    label: "100 Level, first semester",
    session: "2024/2025",
    results: [
      { code: "CSC 101", title: "Introduction to Computer Science", units: 3, score: 83 },
      { code: "MTH 101", title: "Elementary Mathematics I", units: 3, score: 67 },
      { code: "PHY 101", title: "General Physics I", units: 3, score: 59 },
      { code: "CHM 101", title: "General Chemistry I", units: 3, score: 54 },
      { code: "GST 101", title: "Communication in English I", units: 2, score: 68 },
    ],
  },
];

export const FEE_ITEMS = [
  { label: "Tuition", amount: 450000 },
  { label: "ICT and portal", amount: 25000 },
  { label: "Examination", amount: 20000 },
  { label: "Library", amount: 15000 },
  { label: "Medical", amount: 10000 },
  { label: "Student union", amount: 5000 },
];

export type Receipt = {
  id: string;
  date: string;
  session: string;
  description: string;
  amount: number;
  method: string;
};

export const RECEIPTS: Receipt[] = [
  { id: "UTP-RCP-260914-0387", date: "14 September 2026", session: "2026/2027", description: "School fees, first instalment", amount: 300000, method: "Bank transfer" },
  { id: "UTP-RCP-260112-0911", date: "12 January 2026", session: "2025/2026", description: "School fees, second instalment", amount: 220000, method: "Bank transfer" },
  { id: "UTP-RCP-250908-0254", date: "8 September 2025", session: "2025/2026", description: "School fees, first instalment", amount: 280000, method: "Bank deposit" },
];

export type RoomOption = { beds: number; price: number; spacesLeft: number };
export type Hall = { name: string; gender: "Male" | "Female"; about: string; rooms: RoomOption[] };

export const HALLS: Hall[] = [
  {
    name: "Bonny Hall",
    gender: "Male",
    about: "Beside the Computing Block. Five minutes' walk to lectures.",
    rooms: [
      { beds: 4, price: 85000, spacesLeft: 46 },
      { beds: 2, price: 140000, spacesLeft: 8 },
    ],
  },
  {
    name: "Okrika Hall",
    gender: "Male",
    about: "Near the sports centre and the main gate.",
    rooms: [
      { beds: 4, price: 75000, spacesLeft: 112 },
      { beds: 2, price: 130000, spacesLeft: 0 },
    ],
  },
  {
    name: "Opobo Hall",
    gender: "Female",
    about: "Beside the library, with a reading room on each floor.",
    rooms: [
      { beds: 4, price: 85000, spacesLeft: 58 },
      { beds: 2, price: 140000, spacesLeft: 12 },
    ],
  },
  {
    name: "Kalabari Hall",
    gender: "Female",
    about: "Near the medical centre and the cafeteria.",
    rooms: [
      { beds: 4, price: 75000, spacesLeft: 90 },
      { beds: 2, price: 130000, spacesLeft: 3 },
    ],
  },
];

export const ACCOMMODATION = {
  closes: "Friday 4 December 2026",
  office: "Student Affairs office",
};

export const PROGRAMMES: { faculty: string; programmes: string[] }[] = [
  { faculty: "Faculty of Computing", programmes: ["B.Sc. Software Engineering", "B.Sc. Cyber Security", "B.Sc. Information Technology"] },
  { faculty: "Faculty of Engineering", programmes: ["B.Eng. Computer Engineering", "B.Eng. Electrical Engineering", "B.Eng. Petroleum Engineering"] },
  { faculty: "Faculty of Science", programmes: ["B.Sc. Mathematics", "B.Sc. Physics", "B.Sc. Statistics"] },
  { faculty: "Faculty of Management Sciences", programmes: ["B.Sc. Accounting", "B.Sc. Business Administration"] },
];

export const COURSE_CHANGE = {
  minCgpa: 2.4,
  closes: "Friday 11 December 2026",
};

// Seasonal theme. Set `active` to false to return to the normal look.
export const CHRISTMAS = {
  active: true,
  breakStarts: "Friday 18 December 2026",
  lecturesResume: "Monday 4 January 2027",
};
