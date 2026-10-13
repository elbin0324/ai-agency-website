// Savings calculator (ROI model). Structure from content/SCENARIOS.md section 1,
// inputs and constants recalibrated to the BASE values in content/BENCHMARKS.md.
// Dependency-free on purpose (no imports, no enums) so Node can import it for checks.
//
// Framing: the model counts specific task-level workflows handed to agents
// (routine replies, data entry, scheduling, follow-ups, routine customer
// inquiries), never whole-job replacement. Every output is a "Modeled estimate".
//
// Formulas (all integer arithmetic until the final floor):
//   internal hrs/month = teamSize x repetitiveHours x aiSharePct% x (1 - 20% review) x 50 weeks / 12
//   inquiry hrs/month  = monthlyInquiries x 5 min x 20% AI-resolved / 60
//   each line rounded down to whole hours; hoursPerMonth = sum of the lines
//   annualValue        = hoursPerMonth x 12 x hourlyCost
//   fteCapacity        = hoursPerMonth x 12 / 1,880, rounded down to one decimal
//
// Sanity check at the defaults: 7 h x 25% x 0.8 = 1.4 h per person per week,
// below the BASE ceiling of 2.0 h/week for all routine-admin agent tasks
// combined and about 3.5% of a 40-hour week (BASE whole-job cap: 4%).

export type RoiInput = {
  id: string;
  label: string;
  unit: string;
  default: number;
  min: number;
  max: number;
  step: number;
  help: string;
};

export const roiInputs: RoiInput[] = [
  {
    id: 'teamSize',
    label: 'Team members in desk or customer-facing roles',
    unit: 'people',
    default: 15,
    min: 1,
    max: 500,
    step: 1,
    help: 'Count office, admin, customer service, sales and management staff. Leave out roles that are almost all hands-on, such as field technicians or kitchen staff.',
  },
  {
    id: 'hourlyCost',
    label: 'Average loaded cost per hour',
    unit: '$ per hour',
    default: 29,
    min: 20,
    max: 150,
    step: 1,
    help: 'Hourly pay plus payroll taxes and benefits. If you only know the wage, multiply it by 1.35. $29 is the typical loaded cost of routine office work in the U.S.',
  },
  {
    id: 'repetitiveHours',
    label: 'Hours per person each week on repetitive tasks',
    unit: 'hours per week',
    default: 7,
    min: 1,
    max: 20,
    step: 1,
    help: 'Routine email, data entry, copying between systems, scheduling and follow-ups. Leave out time spent answering customers; that is the last question.',
  },
  {
    id: 'aiSharePct',
    label: 'Share of those tasks agents take on',
    unit: '%',
    default: 25,
    min: 10,
    max: 40,
    step: 5,
    help: '25% is a realistic starting point: agents take over specific workflows, not whole jobs. We cap it at 40% because your people keep the judgment calls, and we set aside a further 20% of the agents\' work for human review.',
  },
  {
    id: 'monthlyInquiries',
    label: 'Customer inquiries per month',
    unit: 'per month',
    default: 200,
    min: 0,
    max: 10000,
    step: 50,
    help: 'Calls, chats, emails, texts and web forms from customers and prospects. We count only the routine share an AI agent resolves without your staff.',
  },
];

const C = {
  weeksPerYear: 50,
  monthsPerYear: 12,
  reviewAllowancePct: 20,
  minutesPerInquiry: 5,
  aiResolutionPct: 20,
  fteHoursPerYear: 1880,
} as const;

export const roiAssumptions: { id: string; label: string; value: number; unit: string; sources: string[] }[] = [
  { id: 'weeksPerYear', label: 'Weeks per year the repetitive tasks recur (annualizing weekly hours)', value: C.weeksPerYear, unit: 'weeks per year', sources: ['lab-06', 'lab-09', 'lab-11'] },
  { id: 'reviewAllowancePct', label: 'Human review allowance, subtracted from the hours agents take on', value: C.reviewAllowancePct, unit: '% of agent-handled hours', sources: ['ai-20', 'ai-21'] },
  { id: 'minutesPerInquiry', label: 'Staff minutes per routine customer inquiry, including wrap-up and logging', value: C.minutesPerInquiry, unit: 'minutes per inquiry', sources: ['cx-34', 'cx-10'] },
  { id: 'aiResolutionPct', label: 'Share of inquiries an AI agent resolves end to end without staff (blend of chat, email and phone; conservative chat rate, base phone rate)', value: C.aiResolutionPct, unit: '% of inquiries', sources: ['cx-09', 'cx-10', 'ai-28'] },
  { id: 'fteHoursPerYear', label: 'Hours actually worked per full-time employee per year (for FTE capacity)', value: C.fteHoursPerYear, unit: 'hours per year', sources: ['lab-04', 'lab-05', 'lab-11'] },
  { id: 'defaultHourlyCost', label: 'Default loaded hourly cost: routine office and admin work (median wage x 1.35)', value: 29, unit: '$ per hour worked', sources: ['lab-01', 'lab-06'] },
  { id: 'perPersonCeiling', label: 'Evidence ceiling on routine-admin hours returned per worker (all agent tasks combined); the defaults return 1.4', value: 2, unit: 'hours per worker per week', sources: ['time-01', 'ai-15', 'time-05'] },
];

export type RoiResult = {
  hoursPerMonth: number;
  annualValue: number;
  fteCapacity: number;
  breakdown: { id: string; label: string; hoursPerMonth: number; annualValue: number }[];
};

function sanitize(values: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const spec of roiInputs) {
    const v = Number(values[spec.id]);
    const base = Number.isFinite(v) ? v : spec.default;
    const snapped = Math.round(base / spec.step) * spec.step;
    out[spec.id] = Math.min(spec.max, Math.max(spec.min, snapped));
  }
  return out;
}

export function computeRoi(values: Record<string, number>): RoiResult {
  const i = sanitize(values);
  const keepPct = 100 - C.reviewAllowancePct; // 80
  // Integer numerators; divide once and floor so rounding never inflates a result.
  const internal = Math.floor(
    (i.teamSize * i.repetitiveHours * i.aiSharePct * keepPct * C.weeksPerYear) / (100 * 100 * C.monthsPerYear),
  );
  const inquiries = Math.floor((i.monthlyInquiries * C.minutesPerInquiry * C.aiResolutionPct) / (60 * 100));
  const yearly = (h: number) => h * C.monthsPerYear * i.hourlyCost;
  const breakdown = [
    { id: 'repetitiveTasks', label: 'Repetitive desk tasks handed to agents, after human review', hoursPerMonth: internal, annualValue: yearly(internal) },
    { id: 'customerInquiries', label: 'Routine customer inquiries resolved by an AI agent without staff', hoursPerMonth: inquiries, annualValue: yearly(inquiries) },
  ];
  const hoursPerMonth = internal + inquiries;
  return {
    hoursPerMonth,
    annualValue: yearly(hoursPerMonth),
    fteCapacity: Math.floor((hoursPerMonth * C.monthsPerYear * 10) / C.fteHoursPerYear) / 10,
    breakdown,
  };
}

export const roiDisclaimer =
  'Modeled estimate, not a quote or a guarantee. The calculator shows the gross value of staff time returned, at the loaded hourly cost you enter, from specific repetitive tasks and routine customer inquiries handed to AI agents, after setting aside 20% of the agents\' work for human review. It excludes the cost of the engagement, does not count new revenue, and assumes the agents are fully up and running, so first-year results will be lower while they ramp up. Your results depend on your processes, systems and data. In a free assessment, we replace these assumptions with your real numbers.';

const exampleInputs: { name: string; inputs: Record<string, number> }[] = [
  { name: 'Small business: 8-person professional office', inputs: { teamSize: 8, hourlyCost: 30, repetitiveHours: 7, aiSharePct: 25, monthlyInquiries: 300 } },
  { name: 'Medium business: 40 desk staff in a multi-location service company', inputs: { teamSize: 40, hourlyCost: 30, repetitiveHours: 7, aiSharePct: 25, monthlyInquiries: 1000 } },
  { name: 'Larger business: 120 desk staff at a regional company', inputs: { teamSize: 120, hourlyCost: 30, repetitiveHours: 6, aiSharePct: 20, monthlyInquiries: 2600 } },
];

export const roiExamples: { name: string; inputs: Record<string, number>; result: RoiResult }[] = exampleInputs.map((e) => ({
  ...e,
  result: computeRoi(e.inputs),
}));
