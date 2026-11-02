<template>
  <div class="ptd">
    <div class="ptd-settings" role="group" aria-label="Which task types your practice tracks">
      <span class="ptd-settings-label">Your practice tracks:</span>
      <button v-for="t in typeList" :key="t.id" type="button"
        class="ptd-type" :class="{ 'ptd-type-on': settings[t.id] }"
        :aria-pressed="settings[t.id] ? 'true' : 'false'"
        @click="toggleType(t.id)">
        <span aria-hidden="true">{{ settings[t.id] ? '✓' : '+' }}</span> {{ t.plural }}
      </button>
    </div>

    <div class="ptd-panes">
      <div class="ptd-note">
        <div class="ptd-pane-head">
          <span>Visit note · Assessment &amp; Plan</span>
          <span class="ptd-patient">Sample patient · 58F</span>
        </div>
        <div v-for="prob in problems" :key="prob.title" class="ptd-problem">
          <div class="ptd-problem-title">{{ prob.title }}</div>
          <div v-for="line in prob.plan" :key="line.id" class="ptd-line">
            <button v-if="line.type" type="button" class="ptd-ctl"
              :class="{ 'ptd-ctl-on': isTracked(line) }"
              :aria-pressed="isTracked(line) ? 'true' : 'false'"
              :aria-label="(isTracked(line) ? 'Stop tracking: ' : 'Track: ') + line.text"
              @click="toggleLine(line)">{{ isTracked(line) ? '✓' : '+' }}</button>
            <span v-else class="ptd-ctl-none" aria-hidden="true"></span>
            <span class="ptd-line-text">{{ line.text }}</span>
          </div>
        </div>
        <div class="ptd-sign-row">
          <button v-if="!signed" type="button" class="ptd-sign" @click="sign">Sign note</button>
          <template v-else>
            <span class="ptd-signed">Signed · {{ tasks.length }} {{ tasks.length === 1 ? 'task' : 'tasks' }} created, 0 extra clicks</span>
            <button type="button" class="ptd-reset" @click="reset">Reset</button>
          </template>
        </div>
      </div>

      <div ref="list" class="ptd-list" aria-live="polite">
        <div class="ptd-pane-head">
          <span>Clinic task list</span>
          <span class="ptd-patient">Shared with your staff</span>
        </div>
        <p v-if="!signed" class="ptd-empty">Sign the note. Every checked plan item lands here, filed under its problem.</p>
        <p v-else-if="tasks.length === 0" class="ptd-empty">Nothing tracked. Turn a type on above, or check a line in the plan.</p>
        <TransitionGroup v-else name="ptd-pop" tag="ul" class="ptd-tasks">
          <li v-for="task in tasks" :key="task.id" class="ptd-task">
            <span class="ptd-task-icon" aria-hidden="true">{{ types[task.type].icon }}</span>
            <div class="ptd-task-body">
              <div class="ptd-task-text">{{ task.text }}</div>
              <div class="ptd-task-meta">
                <span class="ptd-chip">{{ task.problem }}</span>
                <span>Waiting on: {{ types[task.type].waitingOn }}</span>
                <span v-if="types[task.type].overdueDays" class="ptd-overdue">Overdue after {{ types[task.type].overdueDays }} days</span>
              </div>
            </div>
          </li>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script>
// Mirrors the product's task-type registry (ai-scribe api/src/services/clinical-tasks/taskTypes.ts):
// the default-on set, the overdue thresholds and what each type waits on. If those change in the
// product, change them here — a demo that disagrees with the app is a claim we cannot keep.
const TYPES = {
  referral:       { plural: 'Referrals',      icon: '🔗', waitingOn: 'consult note',       overdueDays: 90, defaultOn: true },
  lab:            { plural: 'Labs',           icon: '🧪', waitingOn: 'results',            overdueDays: 60, defaultOn: true },
  imaging:        { plural: 'Imaging',        icon: '🩻', waitingOn: 'report',             overdueDays: 60, defaultOn: true },
  follow_up:      { plural: 'Follow-ups',     icon: '🔁', waitingOn: 'return visit',       overdueDays: null, defaultOn: true },
  external_visit: { plural: 'Outside visits', icon: '📅', waitingOn: 'outside notes',      overdueDays: 14, defaultOn: true },
  medication:     { plural: 'Medications',    icon: '💊', waitingOn: 'clinician follow-up', overdueDays: 30, defaultOn: false },
};

// type: null is a continuation ("continue metformin"). The product does not offer to track those,
// so the demo shows no control on them.
const PROBLEMS = [
  {
    title: 'Type 2 diabetes',
    plan: [
      { id: 'dm1', text: 'A1c and BMP today', type: 'lab' },
      { id: 'dm2', text: 'Continue metformin 1000 mg twice daily', type: null },
      { id: 'dm3', text: 'Refer to ophthalmology for diabetic eye exam', type: 'referral' },
    ],
  },
  {
    title: 'Right knee pain',
    plan: [
      { id: 'kn1', text: 'X-ray right knee, standing AP and lateral', type: 'imaging' },
      { id: 'kn2', text: 'Start naproxen 500 mg twice daily with food', type: 'medication' },
      { id: 'kn3', text: 'Seeing orthopedics next month, obtain their note', type: 'external_visit' },
    ],
  },
  {
    title: 'Hypertension',
    plan: [
      { id: 'ht1', text: 'Continue lisinopril 20 mg daily', type: null },
      { id: 'ht2', text: 'Follow up in 3 months', type: 'follow_up' },
    ],
  },
];

function defaultSettings() {
  const s = {};
  Object.keys(TYPES).forEach((k) => { s[k] = TYPES[k].defaultOn; });
  return s;
}

export default {
  name: 'PlanTrackingDemo',
  data() {
    return {
      types: TYPES,
      problems: PROBLEMS,
      settings: defaultSettings(),
      overrides: {},
      signed: false,
    };
  },
  computed: {
    typeList() {
      return Object.keys(TYPES).map((id) => ({ id, ...TYPES[id] }));
    },
    tasks() {
      const out = [];
      this.problems.forEach((p) => p.plan.forEach((line) => {
        if (line.type && this.isTracked(line)) out.push({ ...line, problem: p.title });
      }));
      return out;
    },
  },
  methods: {
    isTracked(line) {
      if (!line.type) return false;
      return line.id in this.overrides ? this.overrides[line.id] : this.settings[line.type];
    },
    toggleType(id) {
      this.settings = { ...this.settings, [id]: !this.settings[id] };
      // A practice setting decides where a line starts; flipping it clears per-line choices for that type.
      const next = { ...this.overrides };
      this.problems.forEach((p) => p.plan.forEach((l) => { if (l.type === id) delete next[l.id]; }));
      this.overrides = next;
    },
    toggleLine(line) {
      this.overrides = { ...this.overrides, [line.id]: !this.isTracked(line) };
    },
    sign() {
      this.signed = true;
      // On a phone the list sits below the note, so without this the tap appears to do nothing.
      if (window.matchMedia('(max-width: 760px)').matches) {
        this.$nextTick(() => this.$refs.list.scrollIntoView({ block: 'start', behavior: 'smooth' }));
      }
    },
    reset() {
      this.settings = defaultSettings();
      this.overrides = {};
      this.signed = false;
    },
  },
};
</script>

<style scoped>
.ptd { font-family: var(--font-sans); font-size: 14px; color: var(--ink); background: var(--white); border: 1px solid var(--border); border-radius: var(--r-lg); box-shadow: var(--shadow-md); overflow: hidden; }

.ptd-settings { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 14px 18px; border-bottom: 1px solid var(--border); background: var(--surface); }
.ptd-settings-label { font-size: 12px; font-weight: 600; color: var(--ink-faint); margin-right: 4px; }
.ptd-type { font: inherit; font-size: 12.5px; font-weight: 500; border: 1px solid var(--border-strong); background: var(--white); color: var(--ink-muted); border-radius: var(--r-pill); padding: 5px 12px; cursor: pointer; transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease; }
.ptd-type:hover { border-color: var(--primary); }
.ptd-type-on { background: var(--primary); border-color: var(--primary); color: var(--white); }

.ptd-panes { display: grid; grid-template-columns: 1fr 1fr; }
.ptd-note { border-right: 1px solid var(--border); padding-bottom: 14px; }
.ptd-list { background: var(--surface); min-height: 100%; }

.ptd-pane-head { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding: 12px 18px; border-bottom: 1px solid var(--border); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-faint); }
.ptd-patient { font-weight: 400; text-transform: none; letter-spacing: 0; }

.ptd-problem { padding: 12px 18px 4px; }
.ptd-problem-title { font-weight: 600; font-size: 14px; margin-bottom: 6px; color: var(--primary-dark); }
.ptd-line { display: flex; align-items: flex-start; gap: 10px; padding: 3px 0; }
.ptd-line-text { font-size: 13.5px; line-height: 1.45; color: var(--ink-muted); }

.ptd-ctl { flex-shrink: 0; width: 20px; height: 20px; margin-top: 1px; border-radius: 50%; border: 1.5px dashed var(--border-strong); background: transparent; color: var(--ink-faint); font: inherit; font-size: 12px; line-height: 1; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; transition: all 0.15s ease; }
.ptd-ctl:hover { border-color: var(--primary); color: var(--primary); }
.ptd-ctl-on { border: 1.5px solid var(--primary); border-radius: var(--r-sm); background: var(--primary); color: var(--white); }
.ptd-ctl-on:hover { color: var(--white); }
.ptd-ctl-none { flex-shrink: 0; width: 20px; }

.ptd-sign-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 14px 18px 0; }
.ptd-sign { font: inherit; font-weight: 600; font-size: 13.5px; background: var(--primary); color: var(--white); border: none; border-radius: var(--r-pill); padding: 8px 20px; cursor: pointer; box-shadow: var(--shadow-sm); }
.ptd-sign:hover { background: var(--primary-dark); }
.ptd-signed { font-size: 13px; font-weight: 600; color: var(--primary); }
.ptd-reset { font: inherit; font-size: 12.5px; background: none; border: none; color: var(--ink-faint); text-decoration: underline; cursor: pointer; padding: 0; }

.ptd-empty { padding: 28px 22px; margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--ink-faint); }
.ptd-tasks { list-style: none; margin: 0; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
.ptd-task { display: flex; gap: 10px; align-items: flex-start; background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 10px 12px; box-shadow: var(--shadow-xs); }
.ptd-task-icon { font-size: 15px; line-height: 1.3; }
.ptd-task-text { font-size: 13.5px; font-weight: 500; line-height: 1.4; }
.ptd-task-meta { display: flex; flex-wrap: wrap; gap: 4px 6px; align-items: center; margin-top: 5px; font-size: 11.5px; color: var(--ink-faint); }
.ptd-overdue { white-space: nowrap; }
.ptd-overdue::before { content: '· '; }
.ptd-chip { background: var(--primary-light); color: var(--primary-dark); border-radius: var(--r-pill); padding: 1px 8px; font-weight: 600; }

.ptd-pop-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.ptd-pop-leave-active { transition: opacity 0.2s ease; }
.ptd-pop-enter-from { opacity: 0; transform: translateX(-14px); }
.ptd-pop-leave-to { opacity: 0; }
.ptd-pop-move { transition: transform 0.3s ease; }
.ptd-pop-enter-active:nth-child(2) { transition-delay: 70ms; }
.ptd-pop-enter-active:nth-child(3) { transition-delay: 140ms; }
.ptd-pop-enter-active:nth-child(4) { transition-delay: 210ms; }
.ptd-pop-enter-active:nth-child(5) { transition-delay: 280ms; }
.ptd-pop-enter-active:nth-child(n+6) { transition-delay: 350ms; }

@media (max-width: 760px) {
  .ptd-panes { grid-template-columns: 1fr; }
  .ptd-note { border-right: none; border-bottom: 1px solid var(--border); }
}
@media (prefers-reduced-motion: reduce) {
  .ptd-pop-enter-active, .ptd-pop-leave-active, .ptd-pop-move { transition: none; }
}
</style>
