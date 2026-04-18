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
      tasks: [],
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
        assessment: "Rising A1c 8.4 despite current regimen.",
        plan: ["Increase metformin to 1000mg BID", "A1c recheck in 3 months"],
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
