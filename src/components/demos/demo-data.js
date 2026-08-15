// Shared fake patient and data for all marketing demo components
// Edit copy here without touching component code

export const PATIENT = {
  name: "Maria Rodriguez",
  age: 64,
  sex: "F",
  mrn: "FAKE-00001",
  pcp: "Dr. J. Kantrowitz",
  lastVisit: "3 weeks ago",
};

// ============ HUDDLE DATA ============

export const HUDDLE_DATA = {
  active: [
    {
      title: "Type 2 diabetes",
      hccCodes: [{ hcc_code: "37", hcc_description: "Diabetes with chronic complications", raf_weight: 0.302 }],
      reassessMonths: null,
      hasOverdue: false,
      resolved: false,
      tasks: [
        { id: 1, description: "Obtain UACR — annual diabetic nephropathy screen", type: "order", status: "active", priority: "medium", reminder_date: "2026-01-15" },
      ],
      lastAP: {
        date: "4/15/2026",
        provider: "Dr. J. Kantrowitz",
        assessment: "Rising A1c 8.4 despite current regimen. Adherence good per patient.",
        plan: ["Increase metformin to 1000mg BID", "A1c recheck in 3 months", "Continue diet and exercise counseling"],
      },
      priorAPs: [],
    },
    {
      title: "Hypertension",
      hccCodes: [],
      reassessMonths: null,
      hasOverdue: false,
      resolved: false,
      tasks: [],
      lastAP: {
        date: "3/24/2026",
        provider: "Dr. J. Kantrowitz",
        assessment: "BP at goal on current regimen.",
        plan: ["Continue lisinopril 20mg daily", "No changes"],
      },
      priorAPs: [],
    },
    {
      title: "Anxiety",
      hccCodes: [],
      reassessMonths: null,
      hasOverdue: false,
      resolved: false,
      tasks: [],
      lastAP: {
        date: "1/22/2026",
        provider: "Dr. J. Kantrowitz",
        assessment: "Improved on sertraline, patient reports good effect and no side effects.",
        plan: ["Continue sertraline 50mg daily", "Follow up at next visit"],
      },
      priorAPs: [],
    },
  ],
  fallingOff: [
    {
      title: "Hypothyroidism",
      hccCodes: [],
      reassessMonths: 11,
      hasOverdue: false,
      resolved: false,
      tasks: [],
      lastAP: {
        date: "5/10/2025",
        provider: "Dr. J. Kantrowitz",
        assessment: "TSH within normal limits on current dose.",
        plan: ["Continue levothyroxine 75mcg daily", "Recheck TSH in 6 months"],
      },
      priorAPs: [],
    },
    {
      title: "CKD stage 2",
      hccCodes: [{ hcc_code: "326", hcc_description: "Chronic kidney disease, stage 2", raf_weight: 0.0 }],
      reassessMonths: 13,
      hasOverdue: false,
      resolved: false,
      tasks: [],
      lastAP: {
        date: "3/8/2025",
        provider: "Dr. J. Kantrowitz",
        assessment: "Stable CKD stage 2. eGFR 64.",
        plan: ["Continue current management", "Avoid nephrotoxic medications", "Recheck BMP and eGFR in 6 months"],
      },
      priorAPs: [],
    },
  ],
  hccDue: [
    {
      title: "COPD",
      hccCodes: [{ hcc_code: "280", hcc_description: "Chronic obstructive pulmonary disease", raf_weight: 0.319 }],
      reassessMonths: 8,
      hasOverdue: false,
      resolved: false,
      tasks: [],
      lastAP: {
        date: "11/10/2025",
        provider: "Dr. J. Kantrowitz",
        assessment: "Mild COPD, well controlled. mMRC dyspnea scale 1. Former smoker, quit 2019.",
        plan: ["Continue tiotropium daily", "Spirometry at annual exam", "Vaccinations up to date"],
      },
      priorAPs: [],
    },
  ],
};

// ============ ENCOUNTER DATA ============

export const ENCOUNTER_DATA = {
  subjective: "64F with T2DM, HTN, anxiety for follow-up. Generally well. Fingersticks 140-180 mornings. Denies CP, SOB, dizziness. Anxiety improved on sertraline, no side effects.",
  objective: "BP 138/86, HR 74, weight 182 lb. RRR, CTA bilaterally, no edema. Labs: A1c 8.4 (up from 7.9), BMP unremarkable, lipids at goal.",
  problems: [
    {
      title: "Type 2 diabetes mellitus",
      icd_codes: ["E11.9"],
      subjective: "Fingersticks 140-180 mornings. Taking metformin 850mg BID. No hypoglycemia.",
      objective: "A1c 8.4 (up from 7.9). Weight 182 lb.",
      assessment: "Rising A1c 8.4 despite current regimen. Adherence good per patient.",
      plan: "- Increase metformin to 1000mg BID\n- A1c recheck in 3 months\n- Continue diet and exercise counseling",
    },
    {
      title: "Hypertension",
      icd_codes: ["I10"],
      subjective: "No headaches, dizziness, or chest pain. Taking lisinopril 20mg daily.",
      objective: "BP 138/86. HR 74.",
      assessment: "BP at goal on current regimen.",
      plan: "- Continue lisinopril 20mg daily\n- No changes",
    },
    {
      title: "Anxiety",
      icd_codes: ["F41.1"],
      subjective: "Feels sertraline is working. No side effects. Sleep improved.",
      objective: "Pleasant, appropriate affect. No psychomotor agitation.",
      assessment: "Improved on sertraline, patient reports good effect and no side effects.",
      plan: "- Continue sertraline 50mg daily\n- Follow up at next visit",
    },
  ],
};

// ============ TIMELINE DATA ============

export const TIMELINE_ENTRIES = [
  {
    date: "Apr 15, 2026",
    provider: "Dr. J. Kantrowitz",
    assessment: "Rising A1c despite current regimen. Adherence reportedly good.",
    plan: "Increased metformin to 1000mg BID. RTC 3 months.",
  },
  {
    date: "Jan 22, 2026",
    provider: "Dr. J. Kantrowitz",
    assessment: "A1c up to 7.9 from 7.4. Patient reports occasional missed doses.",
    plan: "Increased metformin to 850mg BID. Diet/adherence counseling.",
  },
  {
    date: "Oct 10, 2025",
    provider: "Dr. J. Kantrowitz",
    assessment: "A1c 7.4, suboptimal. Tolerating metformin well.",
    plan: "Started metformin 500mg BID. Diabetes education scheduled.",
  },
  {
    date: "Jul 3, 2025",
    provider: "Dr. J. Kantrowitz",
    assessment: "New dx T2DM. A1c 7.1 on screening.",
    plan: "Lifestyle counseling. Start metformin 500mg daily, titrate up. Nephrology baseline labs.",
  },
];

// ============ RECAP DATA (hardcoded, no LLM call) ============

export const RECAP_DATA = {
  problem_title: "Type 2 diabetes mellitus",
  narrative: "Maria's Type 2 diabetes has shown a concerning upward trajectory over the past 10 months. Her A1c rose from 7.1 at diagnosis in July 2025 to 8.4 as of this month, despite two metformin titrations. Adherence concerns were raised at the January visit. She has not been seen by nephrology or endocrinology since initial diagnosis. Current regimen is metformin 1000mg BID, recently increased.",
  medication_trials: [
    {
      medication: "Metformin",
      dosage: "1000mg BID",
      start_date: "Apr 2026",
      end_date: null,
      duration: null,
      is_current: true,
      outcome: "ongoing",
      outcome_detail: "Recently titrated up due to rising A1c",
    },
    {
      medication: "Metformin",
      dosage: "850mg BID",
      start_date: "Jan 2026",
      end_date: "Apr 2026",
      duration: "3 months",
      is_current: false,
      outcome: "ineffective",
      outcome_detail: "Titrated up; A1c rose despite adherence counseling",
    },
    {
      medication: "Metformin",
      dosage: "500mg BID",
      start_date: "Oct 2025",
      end_date: "Jan 2026",
      duration: "3 months",
      is_current: false,
      outcome: "ineffective",
      outcome_detail: "Initial dose post-diagnosis; well tolerated but A1c continued to rise",
    },
  ],
  key_metrics: [
    { metric: "HbA1c", value: "8.4%", date: "Apr 2026" },
    { metric: "HbA1c", value: "7.9%", date: "Jan 2026" },
    { metric: "HbA1c", value: "7.4%", date: "Oct 2025" },
    { metric: "HbA1c", value: "7.1%", date: "Jul 2025" },
  ],
};

// ============ INTAKE DATA ============
// Fictional outside document for the Intake page (S4 provenance demo + S6/S7/S8 mocks).
// Sender, author and institution are invented stand-ins — see the copy deck's demo-data rule.

export const INTAKE_DOCUMENT = {
  title: "Discharge Summary with Dr. A. Chen, 3/15/24",
  type: "Discharge Summary",
  author: "Dr. A. Chen",
  institution: "Riverside Medical Center",
  date: "3/15/24",
  pageCount: 12,
  stamp: "from Discharge Summary — Dr. A. Chen, Riverside Medical Center, 3/15/24",
};

// Mock scanned pages. `id` lines are the ones facts point back to.
export const INTAKE_PAGES = {
  3: {
    heading: "HOSPITAL COURSE — ENDOCRINE",
    lines: [
      { text: "The patient was admitted on 3/11/24 for evaluation of hyperglycemia" },
      { text: "and generalized fatigue of two weeks' duration." },
      { id: "dm-a1c", text: "Hemoglobin A1c on admission was 9.1% (Riverside lab, 3/12/24)." },
      { text: "Prior outside value was reported as 8.4% approximately eleven months ago." },
      { id: "dm-insulin", text: "Insulin glargine 10 units nightly was started during this admission." },
      { text: "Metformin 1000 mg twice daily was continued without change." },
      { text: "Fingerstick glucose ranged 142–210 mg/dL over the final 48 hours." },
      { id: "dm-followup", text: "Recommend repeat A1c in 3 months." },
      { text: "Diabetes education was completed with the inpatient team on 3/14/24." },
    ],
  },
  4: {
    heading: "HOSPITAL COURSE — CARDIOVASCULAR",
    lines: [
      { text: "The patient has a long-standing history of essential hypertension." },
      { id: "htn-bp", text: "Blood pressure on admission was 168/94, improving to 138/82 by discharge." },
      { text: "Telemetry throughout the admission showed normal sinus rhythm." },
      { id: "htn-amlodipine", text: "Amlodipine 5 mg daily was added to the existing lisinopril 20 mg daily." },
      { text: "No orthostatic symptoms were reported following the addition." },
      { id: "htn-bmp", text: "Repeat BMP in 1–2 weeks to assess electrolytes after the medication change." },
      { text: "An exertional murmur was noted on the day of discharge." },
      { id: "htn-echo", text: "Refer to cardiology for stress echo." },
    ],
  },
  5: {
    heading: "HOSPITAL COURSE — RENAL",
    lines: [
      { text: "Baseline renal function was reviewed against records provided by the patient." },
      { id: "ckd-cr", text: "Creatinine 1.24 mg/dL with eGFR 58, down from 64 six months prior." },
      { text: "Urinalysis showed no active sediment. No proteinuria on dipstick." },
      { id: "ckd-held", text: "Nephrotoxic agents were held for the duration of the admission." },
      { text: "Volume status remained euvolemic throughout." },
      { id: "ckd-neph", text: "Refer to nephrology for evaluation of declining eGFR." },
      { text: "The patient was counseled to avoid NSAIDs after discharge." },
    ],
  },
};

// One excerpt per document, per problem — the S4 / S6 shape.
export const INTAKE_EXCERPTS = [
  {
    problem: "Type 2 diabetes mellitus",
    matchedTo: "Type 2 diabetes",
    icd: "E11.65",
    status: "Worsening — A1c up from prior outside value",
    groups: [
      {
        label: "What the data says",
        facts: [{ text: "A1c 9.1% on admission", page: 3, line: "dm-a1c" }],
      },
      {
        label: "What was done",
        facts: [{ text: "Insulin glargine 10 units nightly started", page: 3, line: "dm-insulin" }],
      },
      {
        label: "What happens next",
        facts: [{ text: "Repeat A1c in 3 months", page: 3, line: "dm-followup" }],
      },
    ],
  },
  {
    problem: "Hypertension",
    matchedTo: "Hypertension",
    icd: "I10",
    status: "Regimen changed during admission",
    groups: [
      {
        label: "What the data says",
        facts: [{ text: "BP 168/94 on admission, 138/82 at discharge", page: 4, line: "htn-bp" }],
      },
      {
        label: "What was done",
        facts: [{ text: "Amlodipine 5 mg daily added to lisinopril 20 mg daily", page: 4, line: "htn-amlodipine" }],
      },
      {
        label: "What happens next",
        facts: [
          { text: "Repeat BMP in 1–2 weeks", page: 4, line: "htn-bmp" },
          { text: "Refer to cardiology for stress echo", page: 4, line: "htn-echo" },
        ],
      },
    ],
  },
  {
    problem: "CKD stage 2",
    matchedTo: "CKD stage 2",
    icd: "N18.2",
    status: "eGFR declining since last recorded value",
    groups: [
      {
        label: "What the data says",
        facts: [{ text: "Creatinine 1.24, eGFR 58 — down from 64", page: 5, line: "ckd-cr" }],
      },
      {
        label: "What was done",
        facts: [{ text: "Nephrotoxic agents held during admission", page: 5, line: "ckd-held" }],
      },
      {
        label: "What happens next",
        facts: [{ text: "Refer to nephrology for declining eGFR", page: 5, line: "ckd-neph" }],
      },
    ],
  },
];

// S7 — what this one document says about medications. Not a reconciled list.
export const INTAKE_MEDICATIONS = [
  { name: "Insulin glargine", detail: "10 units subcutaneous nightly", change: "Started this admission", page: 3, line: "dm-insulin" },
  { name: "Amlodipine", detail: "5 mg daily", change: "Added", page: 4, line: "htn-amlodipine" },
  { name: "Lisinopril", detail: "20 mg daily", change: "Continued", page: 4, line: "htn-amlodipine" },
  { name: "Metformin", detail: "1000 mg twice daily", change: "Continued", page: 3, line: "dm-insulin" },
];

// S8 — proposed tasks. Every row carries the verbatim quote that justifies it.
export const INTAKE_TASKS = [
  {
    action: "Repeat BMP in 1–2 weeks",
    type: "Order",
    problem: "Hypertension",
    timeframe: "1–2 weeks",
    quote: "Repeat BMP in 1–2 weeks to assess electrolytes after the medication change.",
    page: 4,
    assignee: "Dr. J. Kantrowitz",
  },
  {
    action: "Refer to cardiology for stress echo",
    type: "Referral",
    problem: "Hypertension",
    timeframe: "",
    quote: "Refer to cardiology for stress echo.",
    page: 4,
    assignee: "Dr. J. Kantrowitz",
  },
  {
    action: "Refer to nephrology for evaluation of declining eGFR",
    type: "Referral",
    problem: "CKD stage 2",
    timeframe: "",
    quote: "Refer to nephrology for evaluation of declining eGFR.",
    page: 5,
    assignee: "Dr. J. Kantrowitz",
  },
];
