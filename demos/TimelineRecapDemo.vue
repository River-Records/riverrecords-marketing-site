<template>
  <div class="timeline-demo">
    <div class="demo-marker">DEMO - fake patient data - not a real chart</div>

    <!-- Header -->
    <div class="timeline-header">
      <button v-if="showRecap" class="btn-back" @click="showRecap = false">&larr; Back to Timeline</button>
      <div class="d-flex align-items-center gap-8">
        <span class="problem-name">Type 2 diabetes mellitus</span>
        <span class="icd-tag">E11.9</span>
        <span class="timeline-label">Timeline</span>
      </div>
      <button v-if="!showRecap" class="recap-btn" @click="triggerRecap" :disabled="recapLoading">
        <template v-if="recapLoading">
          <span class="spinner"></span> Generating...
        </template>
        <template v-else>
          &#10024; Recap
        </template>
      </button>
    </div>

    <!-- Recap Panel (revealed after button click + delay) -->
    <div v-if="showRecap && recapData" class="recap-panel">
      <p class="recap-narrative">{{ recapData.narrative }}</p>

      <!-- Medication History -->
      <div v-if="recapData.medication_trials.length > 0" class="recap-section">
        <p class="recap-section-label">Medication History</p>
        <div v-for="(med, i) in recapData.medication_trials" :key="i" class="recap-med-row">
          <div class="d-flex align-items-center gap-4 flex-wrap">
            <span class="med-name">{{ med.medication }}</span>
            <span class="med-dosage">{{ med.dosage }}</span>
            <span v-if="med.is_current" class="recap-badge recap-badge-active">current</span>
            <span v-else-if="med.outcome === 'effective'" class="recap-badge recap-badge-success">effective</span>
            <span v-else-if="med.outcome === 'ineffective'" class="recap-badge recap-badge-warn">ineffective</span>
            <span v-else-if="med.outcome === 'intolerable'" class="recap-badge recap-badge-danger">intolerable</span>
            <span v-else-if="med.outcome === 'ongoing'" class="recap-badge recap-badge-active">ongoing</span>
            <span v-else class="recap-badge recap-badge-muted">d/c</span>
            <span v-if="med.start_date" class="med-date">started {{ med.start_date }}</span>
            <span v-if="med.end_date" class="med-date">&middot; stopped {{ med.end_date }}</span>
          </div>
          <p v-if="med.outcome_detail" class="med-detail">{{ med.outcome_detail }}</p>
        </div>
      </div>

      <!-- Key Metrics -->
      <div v-if="recapData.key_metrics.length > 0" class="recap-section">
        <p class="recap-section-label">Key Metrics</p>
        <div class="metrics-row">
          <span v-for="(m, i) in recapData.key_metrics" :key="i" class="metric-item">
            <span class="metric-name">{{ m.metric }}:</span> {{ m.value }}<span v-if="m.date" class="metric-date"> ({{ m.date }})</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Timeline Entries -->
    <div class="timeline-body">
      <div v-for="(entry, i) in entries" :key="i" class="timeline-entry">
        <div class="entry-header">
          <span class="entry-date">{{ entry.date }}</span>
          <span v-if="entry.provider" class="entry-provider">{{ entry.provider }}</span>
        </div>
        <div class="entry-field">
          <span class="entry-label">A:</span>
          <span>{{ entry.assessment }}</span>
        </div>
        <div class="entry-field">
          <span class="entry-label">P:</span>
          <span>{{ entry.plan }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TIMELINE_ENTRIES, RECAP_DATA } from './demo-data.js';

export default {
  name: 'TimelineRecapDemo',
  data() {
    return {
      entries: TIMELINE_ENTRIES,
      recapData: RECAP_DATA,
      showRecap: false,
      recapLoading: false,
    };
  },
  methods: {
    triggerRecap() {
      this.recapLoading = true;
      setTimeout(() => {
        this.recapLoading = false;
        this.showRecap = true;
      }, 1500);
    },
  },
};
</script>

<style scoped>
.timeline-demo { font-family: 'Inter', -apple-system, sans-serif; font-size: 14px; color: #1a1a1a; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; max-width: 700px; background: white; }
.demo-marker { background: #f5f1e8; text-align: center; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #999; padding: 4px; border-bottom: 1px solid #e0e0e0; }

.d-flex { display: flex; }
.align-items-center { align-items: center; }
.gap-4 { gap: 4px; }
.gap-8 { gap: 8px; }
.flex-wrap { flex-wrap: wrap; }

.timeline-header { padding: 12px 16px; border-bottom: 1px solid #e0e0e0; display: flex; flex-direction: column; gap: 6px; }
.problem-name { font-size: 16px; font-weight: 600; color: #1a1a1a; }
.icd-tag { padding: 1px 6px; border-radius: 3px; font-size: 10px; font-weight: 600; background: #e8f0fe; color: #4a90d9; }
.timeline-label { font-size: 11px; font-weight: 500; color: #888; text-transform: uppercase; letter-spacing: 0.3px; }

.btn-back { border: none; background: none; padding: 2px 0; font-size: 12px; font-weight: 500; color: #4a90d9; cursor: pointer; }
.btn-back:hover { text-decoration: underline; }

.recap-btn { border: 1px solid #4a90d9; background: #e8f0fe; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #4a90d9; cursor: pointer; transition: all 0.15s ease; align-self: flex-start; }
.recap-btn:hover { background: #d0e1f9; }
.recap-btn:disabled { opacity: 0.7; cursor: default; }

.spinner { display: inline-block; width: 12px; height: 12px; border: 2px solid #4a90d9; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 4px; vertical-align: middle; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Recap panel */
.recap-panel { padding: 12px 16px; margin: 12px 16px; background: #f0f7ff; border-radius: 8px; border: 1px solid #cce0ff; }
.recap-narrative { font-size: 13px; color: #333; margin: 0 0 8px 0; line-height: 1.6; font-style: italic; }
.recap-section { margin-top: 8px; }
.recap-section-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: #888; margin: 0 0 4px 0; }
.recap-med-row { padding: 3px 0; }
.med-name { font-weight: 600; font-size: 12px; color: #4a90d9; }
.med-dosage { font-size: 11px; color: #555; }
.med-date { font-size: 10px; color: #888; }
.med-detail { font-size: 11px; color: #555; margin: 1px 0 0 0; }
.recap-badge { padding: 1px 4px; border-radius: 3px; font-size: 9px; font-weight: 600; text-transform: uppercase; white-space: nowrap; }
.recap-badge-active { background: #e8f0fe; color: #4a90d9; }
.recap-badge-success { background: #e8f5e9; color: #2e7d32; }
.recap-badge-warn { background: #fff3e0; color: #e65100; }
.recap-badge-danger { background: #fde8e8; color: #d32f2f; }
.recap-badge-muted { background: #f5f5f5; color: #888; }

.metrics-row { display: flex; flex-wrap: wrap; gap: 12px; }
.metric-item { font-size: 12px; }
.metric-name { font-weight: 500; }
.metric-date { color: #888; }

/* Timeline entries */
.timeline-body { padding: 0 16px 16px; }
.timeline-entry { border-left: 2px solid #4a90d9; padding: 10px 0 10px 14px; margin-left: 8px; }
.timeline-entry:last-child { border-left-color: #e0e0e0; }
.entry-header { margin-bottom: 4px; }
.entry-date { font-size: 13px; font-weight: 600; color: #333; }
.entry-provider { font-size: 12px; color: #888; margin-left: 8px; }
.entry-field { display: flex; align-items: flex-start; gap: 6px; font-size: 13px; color: #555; line-height: 1.5; margin-bottom: 2px; }
.entry-label { font-weight: 600; color: #555; width: 16px; flex-shrink: 0; }

@media (max-width: 380px) {
  .recap-panel { margin: 8px; }
  .metrics-row { flex-direction: column; gap: 4px; }
}
</style>
