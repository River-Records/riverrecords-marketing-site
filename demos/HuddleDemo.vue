<template>
  <div class="huddle-demo">
    <div class="demo-marker">DEMO - fake patient data - not a real chart</div>

    <!-- Patient header -->
    <div class="huddle-header">
      <h6 class="m-0">{{ patient.name }} <span class="patient-meta">{{ patient.age }}{{ patient.sex }} - {{ patient.pcp }}</span></h6>
    </div>

    <!-- Filter tabs -->
    <div class="huddle-tabs">
      <button v-for="tab in tabs" :key="tab.id"
        class="huddle-tab" :class="{ 'huddle-tab-active': activeTab === tab.id }"
        @click="activeTab = tab.id">
        {{ tab.label }} <span class="huddle-tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Problem list -->
    <div class="huddle-body">
      <div v-if="activeProblems.length === 0" class="huddle-empty">
        No problems in this view.
      </div>
      <div v-for="prob in activeProblems" :key="prob.title"
        class="problem-block"
        @click="$emit('problem-click', prob.title)">

        <!-- Problem header row -->
        <div class="problem-header">
          <span class="problem-title">{{ prob.title }}</span>
          <span v-for="hcc in (prob.hccCodes || [])" :key="hcc.hcc_code" class="badge badge-hcc"
            :title="'HCC ' + hcc.hcc_code + ': ' + hcc.hcc_description + ' (RAF ' + hcc.raf_weight + ')'">
            HCC {{ hcc.hcc_code }}
          </span>
          <span v-if="prob.reassessMonths >= 11" class="badge badge-danger">{{ prob.reassessMonths }}mo</span>
          <span v-else-if="prob.reassessMonths >= 9" class="badge badge-warning">{{ prob.reassessMonths }}mo</span>
          <span v-if="prob.hasOverdue" class="badge badge-danger">overdue</span>
          <span class="timeline-link">Timeline &rarr;</span>
        </div>

        <!-- Reassessment signal -->
        <p v-if="prob.hccCodes?.length > 0 && prob.reassessMonths >= 9" class="reassess-signal">
          &#9888; HCC condition &mdash; {{ prob.reassessMonths }}mo since last documented. Reassess to maintain RAF coding.
        </p>
        <p v-else-if="prob.reassessMonths >= 9" class="meta-text">
          &#9888; {{ prob.reassessMonths }}mo since last documented
        </p>

        <!-- Tasks -->
        <div v-for="task in (prob.tasks || [])" :key="task.id" class="task-row">
          <span class="task-icon">{{ taskIcon(task.type) }}</span>
          <span class="task-title">{{ task.description }}</span>
          <span v-if="isOverdue(task)" class="badge badge-danger">overdue</span>
        </div>

        <!-- Last A&P -->
        <div v-if="prob.lastAP" class="plan-card">
          <p class="meta-text">Last visit &middot; {{ prob.lastAP.date }}{{ prob.lastAP.provider ? ' &middot; ' + prob.lastAP.provider : '' }}</p>
          <div v-if="prob.lastAP.assessment" class="plan-text">
            <span class="plan-label">A:</span>
            <span>{{ prob.lastAP.assessment }}</span>
          </div>
          <div v-if="prob.lastAP.plan" class="plan-text">
            <template v-if="Array.isArray(prob.lastAP.plan)">
              <div v-for="(item, i) in prob.lastAP.plan" :key="i" class="plan-item">
                <span v-if="i === 0" class="plan-label">P:</span>
                <span v-else class="plan-label-spacer"></span>
                <span>&bull; {{ item }}</span>
              </div>
            </template>
            <template v-else>
              <div class="plan-item">
                <span class="plan-label">P:</span>
                <span>{{ prob.lastAP.plan }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PATIENT, HUDDLE_DATA } from './demo-data.js';

export default {
  name: 'HuddleDemo',
  emits: ['problem-click'],
  data() {
    return {
      patient: PATIENT,
      data: HUDDLE_DATA,
      activeTab: 'active',
    };
  },
  computed: {
    tabs() {
      return [
        { id: 'active', label: 'Active Now', count: this.data.active.length },
        { id: 'falling-off', label: 'Falling Off', count: this.data.fallingOff.length },
        { id: 'hcc-due', label: 'HCC Due', count: this.data.hccDue.length },
      ];
    },
    activeProblems() {
      if (this.activeTab === 'falling-off') return this.data.fallingOff;
      if (this.activeTab === 'hcc-due') return this.data.hccDue;
      return this.data.active;
    },
  },
  methods: {
    taskIcon(type) {
      const icons = { order: '📋', referral: '🔗', medication: '💊', general: '📌', document_review: '📄' };
      return icons[type] || '📌';
    },
    isOverdue(task) {
      if (!task.reminder_date) return false;
      return new Date(task.reminder_date) < new Date();
    },
  },
};
</script>

<style scoped>
.huddle-demo { font-family: 'Inter', -apple-system, sans-serif; font-size: 14px; color: #1a1a1a; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; max-width: 700px; background: white; }
.demo-marker { background: #f5f1e8; text-align: center; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #999; padding: 4px; border-bottom: 1px solid #e0e0e0; }
.huddle-header { padding: 12px 16px; border-bottom: 1px solid #e0e0e0; }
.patient-meta { font-weight: 400; color: #888; font-size: 12px; margin-left: 8px; }

.huddle-tabs { display: flex; gap: 4px; padding: 8px 16px; border-bottom: 1px solid #e0e0e0; }
.huddle-tab { border: 1px solid #ccc; background: white; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; color: #555; cursor: pointer; transition: all 0.15s ease; }
.huddle-tab:hover { border-color: #4a90d9; color: #4a90d9; }
.huddle-tab-active { background: #e8f0fe; border-color: #4a90d9; color: #4a90d9; font-weight: 600; }
.huddle-tab-count { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; font-size: 11px; font-weight: 600; background: #ccc; color: #555; margin-left: 4px; }
.huddle-tab-active .huddle-tab-count { background: white; color: #4a90d9; }

.huddle-body { padding: 0; }
.huddle-empty { padding: 32px; text-align: center; color: #999; }

.problem-block { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; cursor: pointer; }
.problem-block:last-child { border-bottom: none; }
.problem-block:hover { background: #fafafa; }

.problem-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap; }
.problem-title { font-size: 14px; font-weight: 600; color: #1a1a1a; }
.timeline-link { border: none; background: none; padding: 1px 6px; font-size: 11px; font-weight: 500; color: #4a90d9; cursor: pointer; border-radius: 3px; white-space: nowrap; margin-left: auto; }
.timeline-link:hover { background: #e8f0fe; }

.badge { padding: 1px 5px; border-radius: 3px; font-size: 9px; font-weight: 700; display: inline-block; white-space: nowrap; text-transform: uppercase; flex-shrink: 0; }
.badge-danger { background: #fde8e8; color: #d32f2f; }
.badge-warning { background: #fff3e0; color: #e65100; }
.badge-hcc { background: #fef3cd; color: #856404; cursor: help; }

.reassess-signal { font-size: 12px; font-weight: 500; color: #d32f2f; margin: 0 0 4px 2px; }
.meta-text { font-size: 13px; color: #888; margin: 0 0 2px 0; }

.task-row { display: flex; align-items: center; gap: 8px; padding: 4px; border-radius: 4px; }
.task-row:hover { background: #f5f5f5; }
.task-icon { font-size: 14px; width: 20px; text-align: center; flex-shrink: 0; }
.task-title { font-size: 13px; font-weight: 500; color: #333; flex-grow: 1; }

.plan-card { margin-top: 4px; margin-left: 2px; }
.plan-text { font-size: 14px; color: #666; margin: 0; line-height: 1.5; display: flex; align-items: flex-start; gap: 4px; }
.plan-label { font-weight: 600; color: #555; width: 16px; flex-shrink: 0; }
.plan-label-spacer { width: 16px; flex-shrink: 0; }
.plan-item { display: flex; align-items: flex-start; gap: 4px; padding: 1px 0; }

@media (max-width: 380px) {
  .huddle-tabs { flex-wrap: wrap; }
  .problem-header { flex-direction: column; align-items: flex-start; }
  .timeline-link { margin-left: 0; }
}
</style>
