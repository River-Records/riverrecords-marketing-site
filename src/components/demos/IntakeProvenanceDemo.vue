<template>
  <div class="intake-demo">
    <div class="demo-marker">DEMO — fake patient data — not a real chart</div>

    <div class="intake-grid">
      <!-- Excerpt side -->
      <div class="intake-pane">
        <div class="pane-head">
          <span class="pane-label">Huddle</span>
          <span class="pane-meta">{{ patient.name }}, {{ patient.age }}{{ patient.sex }}</span>
        </div>

        <p class="pane-hint">
          Click any fact to open the source document at the sentence it came from.
        </p>

        <div class="problem-tabs" role="tablist" aria-label="Problems this document was filed under">
          <button
            v-for="(ex, i) in excerpts"
            :key="ex.problem"
            :id="`intake-tab-${i}`"
            role="tab"
            type="button"
            class="problem-tab"
            :class="{ 'problem-tab-active': i === activeExcerpt }"
            :aria-selected="i === activeExcerpt"
            :tabindex="i === activeExcerpt ? 0 : -1"
            :aria-controls="`intake-panel-${i}`"
            @click="activeExcerpt = i"
            @keydown="onTabKey($event, i)"
          >
            {{ ex.problem }}
          </button>
        </div>

        <div
          :id="`intake-panel-${activeExcerpt}`"
          role="tabpanel"
          :aria-labelledby="`intake-tab-${activeExcerpt}`"
          class="excerpt-card"
        >
          <div class="excerpt-stamp">{{ doc.stamp }}</div>
          <div class="excerpt-status">
            <span class="status-dot"></span>{{ current.status }}
            <span class="excerpt-icd">{{ current.icd }}</span>
          </div>

          <div v-for="group in current.groups" :key="group.label" class="excerpt-group">
            <div class="group-label">{{ group.label }}</div>
            <button
              v-for="fact in group.facts"
              :key="fact.line"
              type="button"
              class="fact"
              :class="{ 'fact-active': fact.line === activeLine }"
              @click="showSource(fact)"
            >
              <span class="fact-text">{{ fact.text }}</span>
              <span class="fact-page">p.{{ fact.page }}</span>
            </button>
          </div>

          <div class="excerpt-actions">
            <span class="ea">Accept</span>
            <span class="ea">No action</span>
            <span class="ea">Re-tag</span>
            <span class="ea">Dismiss</span>
            <span class="ea ea-on">View source</span>
            <span class="ea">Include in note</span>
          </div>
        </div>
      </div>

      <!-- Source side -->
      <div class="intake-pane intake-pane-source" ref="sourcePane">
        <div class="pane-head">
          <span class="pane-label">Source</span>
          <span class="pane-meta">{{ doc.type }} · page {{ activePage }} of {{ doc.pageCount }}</span>
        </div>

        <div class="doc-sheet" aria-live="polite">
          <div class="doc-letterhead">
            <strong>{{ doc.institution }}</strong>
            <span>{{ doc.type }} · {{ doc.date }} · {{ doc.author }}</span>
          </div>
          <div class="doc-heading">{{ page.heading }}</div>
          <p
            v-for="(line, i) in page.lines"
            :key="i"
            class="doc-line"
            :class="{ 'doc-line-hit': line.id && line.id === activeLine }"
            :ref="line.id && line.id === activeLine ? 'hitLine' : undefined"
          >
            <mark v-if="line.id && line.id === activeLine">{{ line.text }}</mark>
            <template v-else>{{ line.text }}</template>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PATIENT, INTAKE_DOCUMENT, INTAKE_PAGES, INTAKE_EXCERPTS } from './demo-data.js';

export default {
  name: 'IntakeProvenanceDemo',
  data() {
    return {
      patient: PATIENT,
      doc: INTAKE_DOCUMENT,
      pages: INTAKE_PAGES,
      excerpts: INTAKE_EXCERPTS,
      activeExcerpt: 0,
      activePage: 3,
      activeLine: 'dm-a1c',
    };
  },
  computed: {
    current() {
      return this.excerpts[this.activeExcerpt];
    },
    page() {
      return this.pages[this.activePage];
    },
  },
  watch: {
    activeExcerpt(i) {
      // Selecting a problem jumps the source to that excerpt's first fact.
      const first = this.excerpts[i].groups[0].facts[0];
      this.showSource(first);
    },
  },
  methods: {
    showSource(fact) {
      this.activePage = fact.page;
      this.activeLine = fact.line;
      this.$nextTick(() => this.scrollToHit());
    },
    scrollToHit() {
      const hit = this.$el.querySelector('.doc-line-hit');
      if (!hit) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const sheet = hit.closest('.doc-sheet');
      if (sheet) {
        sheet.scrollTo({
          top: hit.offsetTop - sheet.clientHeight / 2 + hit.clientHeight / 2,
          behavior: reduce ? 'auto' : 'smooth',
        });
      }
      // On stacked (mobile) layout the source pane sits below the fold.
      if (window.matchMedia('(max-width: 720px)').matches) {
        this.$refs.sourcePane?.scrollIntoView({
          behavior: reduce ? 'auto' : 'smooth',
          block: 'nearest',
        });
      }
    },
    onTabKey(e, i) {
      const last = this.excerpts.length - 1;
      let next = null;
      if (e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
      if (e.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = last;
      if (next === null) return;
      e.preventDefault();
      this.activeExcerpt = next;
      this.$nextTick(() => this.$el.querySelector(`#intake-tab-${next}`)?.focus());
    },
  },
};
</script>

<style scoped>
.intake-demo {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 14px;
  color: #1a1a1a;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}
.demo-marker {
  background: #f5f1e8;
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #999;
  padding: 4px;
  border-bottom: 1px solid #e0e0e0;
}
.intake-grid { display: grid; grid-template-columns: 1fr 1fr; }
.intake-pane { padding: 0; min-width: 0; }
.intake-pane-source { border-left: 1px solid #e0e0e0; background: #fbfbfa; }

.pane-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid #eee;
}
.pane-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #666; }
.pane-meta { font-size: 11px; color: #999; text-align: right; }
.pane-hint { font-size: 11.5px; color: #888; padding: 10px 14px 0; margin: 0; line-height: 1.5; }

.problem-tabs { display: flex; flex-wrap: wrap; gap: 4px; padding: 10px 14px; }
.problem-tab {
  border: 1px solid #ccc;
  background: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.problem-tab:hover { border-color: #4a90d9; color: #4a90d9; }
.problem-tab-active { background: #e8f0fe; border-color: #4a90d9; color: #4a90d9; font-weight: 600; }

.excerpt-card { padding: 0 14px 14px; }
.excerpt-stamp {
  font-size: 11px;
  color: #777;
  font-style: italic;
  padding: 8px 10px;
  background: #f7f7f6;
  border-left: 2px solid #ccc;
  border-radius: 0 4px 4px 0;
  margin-bottom: 10px;
  line-height: 1.45;
}
.excerpt-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.status-dot { width: 7px; height: 7px; border-radius: 50%; background: #d98324; flex-shrink: 0; }
.excerpt-icd {
  font-size: 10.5px;
  font-weight: 600;
  color: #666;
  background: #f0f0ef;
  border-radius: 4px;
  padding: 2px 6px;
  letter-spacing: 0.02em;
}

.excerpt-group { margin-bottom: 10px; }
.group-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 4px;
}
.fact {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  text-align: left;
  font: inherit;
  font-size: 12.5px;
  line-height: 1.5;
  color: #1a1a1a;
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  padding: 7px 9px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.fact:hover { border-color: #4a90d9; background: #f7fbff; }
.fact:focus-visible { outline: 2px solid #4a90d9; outline-offset: 1px; }
.fact-active { border-color: #4a90d9; background: #e8f0fe; }
.fact-page { font-size: 10.5px; color: #4a90d9; font-weight: 600; flex-shrink: 0; }

.excerpt-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-top: 12px;
}
.ea {
  font-size: 10.5px;
  color: #777;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 3px 7px;
}
.ea-on { color: #4a90d9; border-color: #b9d5f2; background: #f2f8ff; font-weight: 600; }

.doc-sheet {
  height: 340px;
  overflow-y: auto;
  padding: 16px 18px 24px;
  font-family: 'Times New Roman', Times, serif;
  font-size: 12.5px;
  line-height: 1.75;
  color: #2a2a2a;
  scroll-behavior: auto;
}
.doc-letterhead {
  border-bottom: 1.5px solid #333;
  padding-bottom: 6px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.doc-letterhead strong { font-size: 13px; letter-spacing: 0.02em; }
.doc-letterhead span { font-size: 10.5px; color: #666; font-family: 'Inter', sans-serif; }
.doc-heading {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #444;
  margin-bottom: 10px;
  font-family: 'Inter', sans-serif;
}
.doc-line { margin: 0 0 6px; }
.doc-line mark { background: #ffe9a8; box-shadow: 0 0 0 3px #ffe9a8; border-radius: 1px; color: inherit; }

@media (max-width: 720px) {
  .intake-grid { grid-template-columns: 1fr; }
  .intake-pane-source { border-left: none; border-top: 1px solid #e0e0e0; }
  .doc-sheet { height: 260px; }
}
@media (prefers-reduced-motion: reduce) {
  .problem-tab, .fact { transition: none; }
}
</style>
