<template>
  <div class="encounter-demo">
    <div class="demo-marker">DEMO - fake patient data - not a real chart</div>

    <!-- Format toggle -->
    <div class="format-bar">
      <span class="format-label">Note Style:</span>
      <button v-for="fmt in formats" :key="fmt.id"
        class="format-btn" :class="{ 'format-btn-active': activeFormat === fmt.id }"
        @click="activeFormat = fmt.id">
        {{ fmt.label }}
      </button>
    </div>

    <!-- CLASSIC SOAP -->
    <div v-if="activeFormat === 'classic-soap'" class="note-container">
      <div class="note-card">
        <!-- Subjective -->
        <div class="section">
          <h6 class="section-title">Subjective</h6>
          <p class="section-text">{{ encounter.subjective }}</p>
        </div>
        <hr class="section-divider" />
        <!-- Objective -->
        <div class="section">
          <h6 class="section-title">Objective</h6>
          <p class="section-text">{{ encounter.objective }}</p>
        </div>
        <hr class="section-divider" />
        <!-- Assessment & Plan -->
        <div class="section">
          <h6 class="section-title">Assessment &amp; Plan</h6>
          <div v-for="prob in encounter.problems" :key="prob.title" class="problem-card">
            <div class="problem-card-header">
              <span class="problem-name">{{ prob.title }}</span>
              <span v-for="code in prob.icd_codes" :key="code" class="icd-tag">{{ code }}</span>
            </div>
            <div class="field-row"><span class="field-label">A:</span><span>{{ prob.assessment }}</span></div>
            <div class="field-row"><span class="field-label">P:</span><span class="plan-content">{{ prob.plan }}</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- FULLY COMBINED -->
    <div v-else-if="activeFormat === 'fully-combined'" class="note-container">
      <div class="note-card">
        <div class="section">
          <h6 class="section-title">Subjective</h6>
          <p class="section-text">{{ encounter.subjective }}</p>
        </div>
        <hr class="section-divider" />
        <div class="section">
          <h6 class="section-title">Objective</h6>
          <p class="section-text">{{ encounter.objective }}</p>
        </div>
        <hr class="section-divider" />
        <div class="section">
          <h6 class="section-title">Assessment</h6>
          <div v-for="prob in encounter.problems" :key="prob.title" class="field-row m-b-4">
            <span class="problem-name-inline">{{ prob.title }}:</span>
            <span>{{ prob.assessment }}</span>
          </div>
        </div>
        <hr class="section-divider" />
        <div class="section">
          <h6 class="section-title">Plan</h6>
          <div v-for="prob in encounter.problems" :key="prob.title" class="problem-card">
            <div class="problem-card-header">
              <span class="problem-name">{{ prob.title }}</span>
              <span v-for="code in prob.icd_codes" :key="code" class="icd-tag">{{ code }}</span>
            </div>
            <div class="field-row"><span class="plan-content">{{ prob.plan }}</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- PROBLEM-BASED -->
    <div v-else class="note-container">
      <div v-for="prob in encounter.problems" :key="prob.title" class="note-card m-b-12">
        <div class="problem-card-header">
          <span class="problem-name">{{ prob.title }}</span>
          <span v-for="code in prob.icd_codes" :key="code" class="icd-tag">{{ code }}</span>
        </div>
        <div class="field-row"><span class="field-label">S:</span><span>{{ prob.subjective }}</span></div>
        <div class="field-row"><span class="field-label">O:</span><span>{{ prob.objective }}</span></div>
        <div class="field-row"><span class="field-label">A:</span><span>{{ prob.assessment }}</span></div>
        <div class="field-row"><span class="field-label">P:</span><span class="plan-content">{{ prob.plan }}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ENCOUNTER_DATA } from './demo-data.js';

export default {
  name: 'EncounterViewDemo',
  data() {
    return {
      encounter: ENCOUNTER_DATA,
      activeFormat: 'classic-soap',
      formats: [
        { id: 'classic-soap', label: 'Classic SOAP' },
        { id: 'fully-combined', label: 'Fully Combined' },
        { id: 'problem-based', label: 'Problem-Based' },
      ],
    };
  },
};
</script>

<style scoped>
.encounter-demo { font-family: 'Inter', -apple-system, sans-serif; font-size: 14px; color: #1a1a1a; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; max-width: 700px; background: white; }
.demo-marker { background: #f5f1e8; text-align: center; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #999; padding: 4px; border-bottom: 1px solid #e0e0e0; }

.format-bar { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-bottom: 1px solid #e0e0e0; }
.format-label { font-size: 12px; font-weight: 500; color: #888; }
.format-btn { border: 1px solid #ccc; background: white; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; color: #555; cursor: pointer; transition: all 0.15s ease; }
.format-btn:hover { border-color: #4a90d9; color: #4a90d9; }
.format-btn-active { background: #e8f0fe; border-color: #4a90d9; color: #4a90d9; font-weight: 600; }

.note-container { padding: 16px; }
.note-card { background: white; border: 1px solid #e8e8e8; border-radius: 8px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.m-b-12 { margin-bottom: 12px; }
.m-b-4 { margin-bottom: 4px; }

.section { margin-bottom: 4px; }
.section-title { font-size: 14px; font-weight: 600; color: #4a90d9; margin: 0 0 6px 0; }
.section-text { font-size: 13px; color: #444; margin: 0; line-height: 1.6; }
.section-divider { border: none; border-top: 1px solid #f0f0f0; margin: 12px 0; }

.problem-card { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f5f5f5; }
.problem-card:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.problem-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.problem-name { font-size: 14px; font-weight: 600; color: #1a1a1a; }
.problem-name-inline { font-weight: 600; color: #1a1a1a; margin-right: 4px; }
.icd-tag { padding: 1px 6px; border-radius: 3px; font-size: 10px; font-weight: 600; background: #e8f0fe; color: #4a90d9; }

.field-row { display: flex; align-items: flex-start; gap: 6px; font-size: 13px; color: #444; line-height: 1.6; margin-bottom: 2px; }
.field-label { font-weight: 600; color: #555; width: 16px; flex-shrink: 0; }
.plan-content { white-space: pre-wrap; }

@media (max-width: 380px) {
  .format-bar { flex-wrap: wrap; }
}
</style>
