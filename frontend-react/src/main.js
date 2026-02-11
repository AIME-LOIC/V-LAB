import React from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

const API_BASE = '/api';

function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function formatDateTime(value) {
  try {
    const date = typeof value === 'string' ? new Date(value) : value instanceof Date ? value : new Date();
    return date.toLocaleString();
  } catch {
    return String(value);
  }
}

function useLocalStorageState(key, initialValue) {
  const [value, setValue] = React.useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored == null) return initialValue;
      return JSON.parse(stored);
    } catch {
      return initialValue;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue];
}

function useToast() {
  const [toast, setToast] = React.useState(null);
  const timerRef = React.useRef(null);

  const show = React.useCallback((message, type = 'success') => {
    setToast({ id: uid('toast'), message, type });
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const node =
    toast &&
    html`
      <div class="fixed top-4 right-4 z-[60]">
        <div
          class=${classNames(
            'rounded-lg border px-4 py-3 shadow-lg backdrop-blur-md text-sm max-w-[22rem]',
            toast.type === 'error'
              ? 'bg-red-900/50 border-red-500/40 text-red-50'
              : 'bg-emerald-900/50 border-emerald-500/40 text-emerald-50'
          )}
        >
          ${toast.message}
        </div>
      </div>
    `;

  return { show, node };
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return html`
    <div
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3"
      role="dialog"
      aria-modal="true"
      onClick=${(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div class="bg-slate-950/90 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-slate-700 shadow-xl">
        <div class="p-4 sm:p-6">
          <div class="flex justify-between items-start mb-4 gap-4">
            <h2 class="text-xl sm:text-2xl font-bold">${title}</h2>
            <button class="text-2xl hover:text-cyan-400" onClick=${onClose} aria-label="Close">×</button>
          </div>
          ${children}
        </div>
      </div>
    </div>
  `;
}

async function apiGet(path) {
  const resp = await fetch(`${API_BASE}${path}`);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

async function apiPost(path, body) {
  const resp = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

function App() {
  const toast = useToast();
  const [tab, setTab] = React.useState('home');

  const [stats, setStats] = React.useState(null);
  const [reactions, setReactions] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [tools, setTools] = React.useState([]);
  const [toolCategories, setToolCategories] = React.useState([]);
  const [chemicals, setChemicals] = React.useState([]);
  const [apiError, setApiError] = React.useState(null);

  const [reactionQuery, setReactionQuery] = React.useState('');
  const [reactionCategory, setReactionCategory] = React.useState('');
  const [toolCategory, setToolCategory] = React.useState('');

  const [openReaction, setOpenReaction] = React.useState(null);
  const [openTool, setOpenTool] = React.useState(null);

  const [labType, setLabType] = React.useState('Chemistry');
  const [labQuery, setLabQuery] = React.useState('');
  const [selectedChemicals, setSelectedChemicals] = React.useState([]);
  const [selectedTools, setSelectedTools] = React.useState([]);
  const [heatLevel, setHeatLevel] = React.useState(40);
  const [volumeMl, setVolumeMl] = React.useState(250);
  const [labRunning, setLabRunning] = React.useState(false);
  const [labResult, setLabResult] = React.useState(null);
  const [labStage, setLabStage] = React.useState('idle'); // idle | mixing | reacting | done
  const [labProgress, setLabProgress] = React.useState(0); // 0..100
  const [labLog, setLabLog] = React.useState([]);
  const labTimerRef = React.useRef(null);

  const [findings, setFindings] = useLocalStorageState('vlab_findings_v2', []);
  const [activeFindingId, setActiveFindingId] = React.useState(null);

  const LAB_TOOLS = React.useMemo(
    () => [
      { name: 'Bunsen Burner', note: 'Apply and control heat', icon: 'fa-solid fa-fire-flame-curved' },
      { name: 'Thermometer', note: 'Measure temperature', icon: 'fa-solid fa-temperature-three-quarters' },
      { name: 'pH Meter', note: 'Estimate pH of mixture', icon: 'fa-solid fa-flask' },
      { name: 'Microscope', note: 'Microscopic observation', icon: 'fa-solid fa-microscope' },
      { name: 'Stirring Rod', note: 'Uniform mixing', icon: 'fa-solid fa-rotate' },
      { name: 'Pipette', note: 'Precise transfer', icon: 'fa-solid fa-droplet' },
      { name: 'Gloves', note: 'Extra safety', icon: 'fa-solid fa-hand' },
    ],
    []
  );

  React.useEffect(() => {
    // base data
    Promise.all([
      apiGet('/stats'),
      apiGet('/reactions'),
      apiGet('/categories'),
      apiGet('/tools'),
      apiGet('/tool-categories'),
      apiGet('/chemicals'),
      apiGet('/findings').catch(() => []),
    ])
      .then(([s, r, c, t, tc, ch, remoteFindings]) => {
        setStats(s);
        setReactions(Array.isArray(r) ? r : []);
        setCategories(Array.isArray(c) ? c : []);
        setTools(Array.isArray(t) ? t : []);
        setToolCategories(Array.isArray(tc) ? tc : []);
        setChemicals(Array.isArray(ch) ? ch : []);
        if (Array.isArray(remoteFindings) && remoteFindings.length) {
          setFindings((prev) => {
            const local = Array.isArray(prev) ? prev : [];
            const localIds = new Set(local.map((f) => f.id));
            const merged = [...remoteFindings.filter((f) => !localIds.has(f.id)), ...local];
            return merged.slice(0, 500);
          });
        }
        setApiError(null);
      })
      .catch((e) => setApiError(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (activeFindingId) return;
    if (Array.isArray(findings) && findings.length > 0) setActiveFindingId(findings[0].id);
  }, [activeFindingId, findings]);

  function addChemical(c) {
    setSelectedChemicals((prev) => {
      if (prev.some((x) => x.name === c.name)) return prev;
      return [...prev, c];
    });
    setLabLog((prev) => [
      { id: uid('log'), at: new Date().toISOString(), type: 'add', message: `Added ${c.name} to beaker.` },
      ...prev,
    ]);
  }
  function removeChemical(name) {
    setSelectedChemicals((prev) => prev.filter((c) => c.name !== name));
    setLabLog((prev) => [{ id: uid('log'), at: new Date().toISOString(), type: 'remove', message: `Removed ${name}.` }, ...prev]);
  }
  function toggleTool(name) {
    setSelectedTools((prev) => {
      const enabled = !prev.includes(name);
      setLabLog((logPrev) => [
        {
          id: uid('log'),
          at: new Date().toISOString(),
          type: 'tool',
          message: `${name} ${enabled ? 'enabled' : 'disabled'}.`,
        },
        ...logPrev,
      ]);
      return enabled ? [...prev, name] : prev.filter((t) => t !== name);
    });
  }
  function clearLab() {
    setSelectedChemicals([]);
    setSelectedTools([]);
    setLabResult(null);
    setLabStage('idle');
    setLabProgress(0);
    setLabLog((prev) => [{ id: uid('log'), at: new Date().toISOString(), type: 'clear', message: 'Bench cleared.' }, ...prev]);
    toast.show('Cleared the lab bench.', 'success');
  }

  const burnerOn = selectedTools.includes('Bunsen Burner');

  async function runExperiment() {
    if (selectedChemicals.length === 0) {
      toast.show('Add at least one chemical to the beaker.', 'error');
      return;
    }
    setLabRunning(true);
    setLabStage('mixing');
    setLabProgress(0);
    try {
      const payload = {
        chemicals: selectedChemicals.map((c) => c.name),
        type: labType.toLowerCase(),
        tools: selectedTools,
        heat: heatLevel,
        volume_ml: volumeMl,
      };

      setLabLog((prev) => [
        { id: uid('log'), at: new Date().toISOString(), type: 'run', message: `Run started (${labType}).` },
        ...prev,
      ]);

      // Local “sim” timeline: mix -> react -> settle, driven by backend measurements rate/temperature.
      const tick = () => {
        setLabProgress((p) => Math.min(100, p + 3));
      };
      if (labTimerRef.current) window.clearInterval(labTimerRef.current);
      labTimerRef.current = window.setInterval(tick, 90);

      const data = await apiPost('/run-experiment', payload);
      setLabResult(data);

      // Adapt animation duration: faster if higher rate.
      const rate = typeof data?.measurements?.rate === 'number' ? data.measurements.rate : 0.2;
      const phaseMs = Math.max(650, Math.round(1600 - rate * 900));
      setLabStage('reacting');
      window.setTimeout(() => setLabStage('done'), phaseMs);
      window.setTimeout(() => setLabProgress(100), Math.max(400, Math.round(phaseMs * 0.85)));

      if (labTimerRef.current) {
        window.clearInterval(labTimerRef.current);
        labTimerRef.current = null;
      }

      const createdAt = data.timestamp || new Date().toISOString();
      const finding = {
        id: uid('finding'),
        title: `${labType} Lab: ${payload.chemicals[0]}`,
        notes: `Mixture: ${payload.chemicals.join(', ')}${payload.tools.length ? ` · Tools: ${payload.tools.join(', ')}` : ''}`,
        observations: data.observation || '',
        conclusion: data.result || '',
        safety: data.safety || 'Standard lab safety',
        chemicals: payload.chemicals,
        tools: payload.tools,
        lab: labType,
        measurements: data.measurements || null,
        reaction: data.reaction || null,
        createdAt,
      };

      setFindings((prev) => [finding, ...(Array.isArray(prev) ? prev : [])].slice(0, 500));
      setActiveFindingId(finding.id);
      toast.show('Experiment completed. Saved to Notebook.', 'success');

      apiPost('/findings', {
        id: finding.id,
        title: finding.title,
        content: finding.notes,
        experiment: payload.chemicals.join(', '),
        lab: finding.lab,
        observations: finding.observations,
        conclusion: finding.conclusion,
      }).catch(() => {});

      setLabLog((prev) => {
        const next = [
          { id: uid('log'), at: new Date().toISOString(), type: 'result', message: `Observation: ${data.observation}` },
          ...(data.reaction?.name
            ? [{ id: uid('log'), at: new Date().toISOString(), type: 'match', message: `Matched: ${data.reaction.name}` }]
            : []),
          ...prev,
        ];
        return next.slice(0, 80);
      });
    } catch (e) {
      toast.show(`Experiment failed: ${String(e.message || e)}`, 'error');
      setLabStage('idle');
      setLabProgress(0);
    } finally {
      setLabRunning(false);
    }
  }

  const filteredReactions = React.useMemo(() => {
    return (Array.isArray(reactions) ? reactions : []).filter((r) => {
      const q = reactionQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        (r.name || '').toLowerCase().includes(q) ||
        (r.equation || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q);
      const matchesCategory = !reactionCategory || r.category === reactionCategory;
      return matchesQuery && matchesCategory;
    });
  }, [reactions, reactionQuery, reactionCategory]);

  const filteredTools = React.useMemo(() => {
    return (Array.isArray(tools) ? tools : []).filter((t) => (!toolCategory ? true : t.category === toolCategory));
  }, [tools, toolCategory]);

  const filteredChemicals = React.useMemo(() => {
    const q = labQuery.trim().toLowerCase();
    return (Array.isArray(chemicals) ? chemicals : []).filter((c) => {
      if (!q) return true;
      return (c.name || '').toLowerCase().includes(q) || (c.symbol || '').toLowerCase().includes(q);
    });
  }, [chemicals, labQuery]);

  function ConnectionBanner() {
    if (!apiError) return null;
    return html`
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div class="bg-red-900/30 border border-red-500/40 rounded-xl p-4 text-sm">
          <div class="font-bold mb-1">Connection Error</div>
          <div class="text-slate-200">
            Start the backend at <span class="font-mono">http://127.0.0.1:5000</span> and refresh.
          </div>
          <div class="text-slate-400 mt-1">Details: ${String(apiError.message || apiError)}</div>
        </div>
      </div>
    `;
  }

  function TopNav() {
    const items = [
      ['home', 'Home'],
      ['reactions', 'Reactions'],
      ['tools', 'Tools'],
      ['lab', 'Lab'],
      ['notebook', 'Notebook'],
      ['about', 'About'],
    ];
    return html`
      <nav class="bg-black/40 backdrop-blur-xl sticky top-0 z-40 border-b border-cyan-500/20">
        <div class="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="text-xl sm:text-2xl font-extrabold tracking-tight">
              <span class="text-cyan-300">⚗️</span> Virtual Science Lab
            </div>
            <div class="hidden sm:block text-xs text-slate-400 border border-slate-700/60 rounded-full px-2 py-1">
              Student-friendly lab simulator
            </div>
          </div>
          <div class="flex gap-2 sm:gap-3 flex-wrap justify-end">
            ${items.map(
              ([key, label]) => html`
                <button
                  class=${classNames(
                    'px-3 py-1.5 rounded-lg border text-sm transition',
                    tab === key
                      ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200'
                      : 'border-slate-800 hover:border-slate-600 text-slate-200 bg-slate-900/40'
                  )}
                  onClick=${() => setTab(key)}
                >
                  ${label}
                </button>
              `
            )}
          </div>
        </div>
      </nav>
    `;
  }

  function Home() {
    return html`
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 section">
        <div class="flex items-end justify-between gap-4 flex-wrap mb-5">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <div class="text-sm text-slate-400 mt-1">Professional lab bench · instrument controls · notebook.</div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div class="rounded-xl border p-4 sm:p-6 bg-cyan-950/20 border-cyan-500/20">
            <div class="text-3xl sm:text-4xl mb-2">🧪</div>
            <div class="text-sm text-slate-300">Reactions</div>
            <div class="text-3xl font-bold mt-1 text-cyan-200">${stats ? stats.total_reactions : '—'}</div>
          </div>
          <div class="rounded-xl border p-4 sm:p-6 bg-purple-950/20 border-purple-500/20">
            <div class="text-3xl sm:text-4xl mb-2">🔬</div>
            <div class="text-sm text-slate-300">Tools</div>
            <div class="text-3xl font-bold mt-1 text-purple-200">${stats ? stats.total_tools : '—'}</div>
          </div>
          <div class="rounded-xl border p-4 sm:p-6 bg-emerald-950/20 border-emerald-500/20">
            <div class="text-3xl sm:text-4xl mb-2">📚</div>
            <div class="text-sm text-slate-300">Categories</div>
            <div class="text-3xl font-bold mt-1 text-emerald-200">${stats ? stats.categories : '—'}</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div class="lg:col-span-2 bg-slate-950/30 border border-slate-800 rounded-xl p-4 sm:p-6">
            <div class="flex items-center gap-2 text-cyan-200 font-bold mb-2">
              <i class="fa-solid fa-flask"></i> Lab workflow
            </div>
            <div class="text-sm text-slate-300">
              Go to <span class="font-bold text-slate-100">Lab</span>, mix chemicals, set heat + volume, run the experiment, and review
              observations. Each run is saved in <span class="font-bold text-slate-100">Notebook</span>.
            </div>
          </div>
          <div class="bg-slate-950/30 border border-slate-800 rounded-xl p-4 sm:p-6">
            <div class="flex items-center gap-2 text-emerald-200 font-bold mb-2">
              <i class="fa-solid fa-book"></i> Notebook
            </div>
            <div class="text-sm text-slate-300">
              Findings saved: <span class="font-bold text-emerald-100">${Array.isArray(findings) ? findings.length : 0}</span>
            </div>
            <button
              class="mt-4 w-full bg-emerald-600/80 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
              onClick=${() => setTab('notebook')}
            >
              Open Notebook
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function Reactions() {
    return html`
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 section">
        <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
          <h1 class="text-2xl sm:text-3xl font-bold">Reactions</h1>
        </div>
        <div class="mb-5 flex flex-col sm:flex-row gap-3">
          <input
            class="flex-1 bg-slate-900/60 border border-slate-800 rounded-lg px-3 sm:px-4 py-2 text-white text-sm placeholder-slate-500 focus:border-cyan-500 outline-none"
            placeholder="Search reactions..."
            value=${reactionQuery}
            onInput=${(e) => setReactionQuery(e.target.value)}
          />
          <select
            class="bg-slate-900/60 border border-slate-800 rounded-lg px-3 sm:px-4 py-2 text-white text-sm"
            value=${reactionCategory}
            onChange=${(e) => setReactionCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            ${(Array.isArray(categories) ? categories : []).map((c) => html`<option value=${c}>${c}</option>`)}
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          ${filteredReactions.map((r) => {
            const energyColor = (r.type || '').includes('Exothermic') ? 'text-red-400' : 'text-blue-400';
            return html`
              <button
                class="text-left bg-slate-950/30 border border-slate-800 rounded-xl p-4 hover:border-cyan-500/50 transition"
                onClick=${() => setOpenReaction(r)}
              >
                <div class="text-cyan-200 font-bold">${r.name}</div>
                <div class="text-xs text-slate-400 font-mono mt-1">${r.equation}</div>
                <div class="flex justify-between items-center mt-3">
                  <span class="text-xs px-2 py-1 bg-slate-900/60 border border-slate-800 rounded">${r.category}</span>
                  <span class=${classNames('text-xs font-bold', energyColor)}>${r.type}</span>
                </div>
                <div class="text-sm text-slate-400 mt-3 line-clamp-2">${r.description}</div>
              </button>
            `;
          })}
        </div>
        ${filteredReactions.length === 0 ? html`<div class="text-slate-400 mt-4">No reactions found.</div>` : null}
      </div>
    `;
  }

  function Tools() {
    return html`
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 section">
        <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
          <h1 class="text-2xl sm:text-3xl font-bold">Tools</h1>
        </div>
        <div class="mb-5 flex flex-col sm:flex-row gap-3">
          <select
            class="bg-slate-900/60 border border-slate-800 rounded-lg px-3 sm:px-4 py-2 text-white text-sm"
            value=${toolCategory}
            onChange=${(e) => setToolCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            ${(Array.isArray(toolCategories) ? toolCategories : []).map((c) => html`<option value=${c}>${c}</option>`)}
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          ${filteredTools.map(
            (t) => html`
              <button
                class="text-left bg-slate-950/30 border border-slate-800 rounded-xl p-4 hover:border-purple-500/50 transition"
                onClick=${() => setOpenTool(t)}
              >
                <div class="text-purple-200 font-bold">${t.name}</div>
                <div class="text-xs px-2 py-1 bg-slate-900/60 border border-slate-800 rounded inline-block mt-2">${t.category}</div>
                <div class="text-sm text-slate-400 mt-3 line-clamp-3">${t.description}</div>
              </button>
            `
          )}
        </div>
        ${filteredTools.length === 0 ? html`<div class="text-slate-400 mt-4">No tools found.</div>` : null}
      </div>
    `;
  }

  function Lab() {
    function liquidColor() {
      if (labStage === 'idle' || selectedChemicals.length === 0) return 'rgba(34,211,238,0.08)';
      if (labResult?.reaction?.category === 'Combustion') return 'rgba(251, 146, 60, 0.25)';
      if (labResult?.reaction?.category === 'Acid-Base') return 'rgba(34, 197, 94, 0.20)';
      if ((labResult?.observation || '').toLowerCase().includes('yellow')) return 'rgba(250, 204, 21, 0.26)';
      if ((labResult?.observation || '').toLowerCase().includes('black')) return 'rgba(15, 23, 42, 0.45)';
      const top = selectedChemicals[0]?.color || '#22d3ee';
      return `${top}40`; // adds alpha if hex
    }

    function shouldBubble() {
      const obs = (labResult?.observation || '').toLowerCase();
      if (labStage === 'reacting') return true;
      return obs.includes('bubbles') || obs.includes('bubbling') || obs.includes('gas') || obs.includes('fizz');
    }

    function shouldSmoke() {
      const obs = (labResult?.observation || '').toLowerCase();
      return labStage === 'reacting' && (obs.includes('decomposition') || obs.includes('combust') || obs.includes('fumes') || obs.includes('black'));
    }

    const obsText = (labResult?.observation || '').toLowerCase();
    const hasWater = selectedChemicals.some((c) => String(c.symbol || '').includes('H₂O') || String(c.name || '').toLowerCase().includes('water'));
    const hasOil = selectedChemicals.some((c) => String(c.symbol || '').toLowerCase() === 'oil' || String(c.name || '').toLowerCase().includes('oil'));
    const showLayers = (hasWater && hasOil) || obsText.includes('immiscible') || obsText.includes('layers') || obsText.includes('layer');

    function onDragStartChemical(e, chem) {
      e.dataTransfer.setData('chemical', JSON.stringify(chem));
      e.dataTransfer.effectAllowed = 'copy';
    }

    function onDropBeaker(e) {
      e.preventDefault();
      try {
        const raw = e.dataTransfer.getData('chemical');
        if (!raw) return;
        const chem = JSON.parse(raw);
        addChemical(chem);
      } catch {
        // ignore
      }
    }

    function onDragOverBeaker(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }

    return html`
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 section">
        <div class="flex items-end justify-between gap-4 flex-wrap mb-5">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold">Chem Lab Bench</h1>
            <div class="text-sm text-slate-400 mt-1">Drag reagents onto the bench, pour into the beaker, control instruments, run, observe.</div>
          </div>
          <div class="flex gap-2">
            <button
              class="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-100 px-3 py-2 rounded-lg text-sm transition"
              onClick=${clearLab}
            >
              <i class="fa-solid fa-eraser mr-2"></i>Clear
            </button>
            <button
              class=${classNames(
                'px-3 py-2 rounded-lg text-sm font-bold transition border',
                labRunning ? 'bg-purple-700/30 border-purple-500/40 text-purple-100' : 'bg-purple-600 hover:bg-purple-500 border-purple-400/40'
              )}
              disabled=${labRunning}
              onClick=${runExperiment}
            >
              <i class="fa-solid fa-play mr-2"></i>${labRunning ? 'Running...' : 'Run'}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div class="lg:col-span-2 space-y-4 sm:space-y-6">
            <div class="lab-surface rounded-2xl p-4 sm:p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-1 glass rounded-xl p-3">
                  <div class="flex items-center justify-between gap-3 mb-3">
                    <div class="text-xs text-slate-300 font-bold flex items-center gap-2">
                      <i class="fa-solid fa-warehouse"></i> Chemical Storage
                    </div>
                    <div class="text-[11px] text-slate-400">Drag → Beaker</div>
                  </div>
                  <div class="flex gap-2 mb-2">
                    <select
                      class="flex-1 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm"
                      value=${labType}
                      onChange=${(e) => setLabType(e.target.value)}
                    >
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Physics">Physics</option>
                    </select>
                    <div class=${classNames('led', apiError ? '' : 'on')} title="API status"></div>
                  </div>
                  <input
                    class="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:border-cyan-500 outline-none"
                    placeholder="Search (name / symbol)..."
                    value=${labQuery}
                    onInput=${(e) => setLabQuery(e.target.value)}
                  />
                  <div class="mt-3 max-h-[420px] overflow-y-auto space-y-2 pr-1">
                    ${filteredChemicals.slice(0, 120).map((c) => {
                      const selected = selectedChemicals.some((x) => x.name === c.name);
                      return html`
                        <div
                          draggable="true"
                          onDragStart=${(e) => onDragStartChemical(e, c)}
                          onClick=${() => addChemical(c)}
                          class=${classNames(
                            'select-none cursor-grab active:cursor-grabbing rounded-xl border px-3 py-2 transition flex items-center justify-between gap-2',
                            selected ? 'border-emerald-500/35 bg-emerald-500/10' : 'border-slate-800 hover:border-slate-600 bg-slate-950/30'
                          )}
                          title="Drag into beaker"
                        >
                          <div class="min-w-0 flex-1">
                            <div class="text-sm text-slate-100 truncate">${c.name}</div>
                            <div class="text-[11px] text-slate-400 truncate">${c.category}</div>
                          </div>
                          <div class="flex items-center gap-2 shrink-0">
                            <span class="text-xs font-mono text-slate-300 truncate max-w-[80px]">${c.symbol}</span>
                            <span class="h-3 w-3 rounded-full border border-white/10" style=${{ background: c.color || '#64748b' }}></span>
                          </div>
                        </div>
                      `;
                    })}
                  </div>
                  <div class="mt-3 text-[11px] text-slate-500">
                    Mobile: tap any chemical to add (or drag on desktop).
                  </div>
                </div>

                <div class="md:col-span-2 space-y-4">
                  <div class="glass rounded-xl p-4">
                    <div class="flex items-center justify-between gap-3 flex-wrap mb-3">
                      <div class="text-xs text-slate-300 font-bold flex items-center gap-2">
                        <i class="fa-solid fa-table"></i> Lab Table
                      </div>
                      <div class="text-[11px] text-slate-400">
                        Step: <span class="font-mono">${labStage}</span> · Volume: <span class="font-mono">${volumeMl} mL</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div class="relative bg-slate-950/35 border border-slate-800 rounded-xl p-4 beaker-glow">
                        <div class="text-xs text-slate-400 mb-2 flex items-center justify-between">
                          <span><i class="fa-solid fa-flask-vial mr-2"></i>Beaker</span>
                          <span class="font-mono">${selectedChemicals.length} reagents</span>
                        </div>

                        <div
                          class=${classNames(
                            'relative rounded-xl border border-dashed p-3',
                            'border-cyan-500/35 bg-cyan-500/5'
                          )}
                          onDrop=${onDropBeaker}
                          onDragOver=${onDragOverBeaker}
                          title="Drop chemicals here"
                        >
                          <div class=${classNames('relative h-[260px] overflow-hidden rounded-lg bg-gradient-to-b from-slate-950/40 to-slate-900/20', labStage === 'mixing' ? 'shake' : '')}>
                            <!-- liquid -->
                            ${showLayers
                              ? html`
                                  <div class="absolute left-0 right-0 bottom-0 transition-all duration-500" style=${{
                                    height: '62%',
                                    background: 'rgba(59, 130, 246, 0.24)',
                                    borderTop: '1px solid rgba(255,255,255,0.10)',
                                  }}></div>
                                  <div class="absolute left-0 right-0 bottom-[62%] transition-all duration-500" style=${{
                                    height: '24%',
                                    background: 'rgba(250, 204, 21, 0.26)',
                                    borderTop: '1px solid rgba(255,255,255,0.10)',
                                  }}></div>
                                  ${labStage === 'mixing'
                                    ? html`<div class="absolute inset-0" style=${{
                                        background:
                                          'radial-gradient(120px 80px at 40% 60%, rgba(250,204,21,0.15), transparent 60%), radial-gradient(140px 80px at 60% 70%, rgba(59,130,246,0.14), transparent 60%)',
                                        opacity: 0.9,
                                      }}></div>`
                                    : null}
                                `
                              : html`
                                  <div
                                    class="absolute left-0 right-0 bottom-0 transition-all duration-500"
                                    style=${{
                                      height: `${Math.min(80, Math.max(12, selectedChemicals.length * 14 + volumeMl / 80))}%`,
                                      background: liquidColor(),
                                      borderTop: '1px solid rgba(255,255,255,0.10)',
                                    }}
                                  ></div>
                                `}
                            <!-- bubbles / smoke -->
                            ${shouldBubble()
                              ? Array.from({ length: 8 }).map((_, i) => {
                                  const x = 12 + i * 11 + (i % 2) * 4;
                                  const dur = 1.8 + (i % 4) * 0.45;
                                  return html`<div class="bubble" style=${{ '--x': `${x}%`, '--dur': `${dur}s` }}></div>`;
                                })
                              : null}
                            ${shouldSmoke()
                              ? Array.from({ length: 6 }).map((_, i) => {
                                  const x = 20 + i * 12;
                                  const dur = 2.5 + (i % 3) * 0.65;
                                  return html`<div class="smoke" style=${{ '--x': `${x}%`, '--dur': `${dur}s` }}></div>`;
                                })
                              : null}

                            <!-- beaker glass -->
                            <svg class="absolute inset-0" viewBox="0 0 200 260" preserveAspectRatio="none" aria-hidden="true">
                              <defs>
                                <linearGradient id="glassGrad" x1="0" x2="1">
                                  <stop offset="0" stop-color="rgba(255,255,255,0.08)"></stop>
                                  <stop offset="0.5" stop-color="rgba(255,255,255,0.03)"></stop>
                                  <stop offset="1" stop-color="rgba(255,255,255,0.07)"></stop>
                                </linearGradient>
                              </defs>
                              <path
                                d="M30,10 h140 v18 c0,10 -8,18 -18,18 h-12 v160 c0,26 -20,44 -40,44 h-20 c-20,0 -40,-18 -40,-44 v-160 h-12 c-10,0 -18,-8 -18,-18 z"
                                fill="url(#glassGrad)"
                                stroke="rgba(148,163,184,0.35)"
                                stroke-width="2"
                              />
                              <!-- measurement ticks -->
                              ${Array.from({ length: 6 }).map((_, i) => {
                                const y = 70 + i * 26;
                                return html`<line x1="155" y1="${y}" x2="170" y2="${y}" stroke="rgba(148,163,184,0.25)" stroke-width="2" />`;
                              })}
                            </svg>
                          </div>

                          <div class="mt-3 flex flex-wrap gap-2 min-h-10 min-w-0">
                            ${selectedChemicals.length === 0
                              ? html`<div class="text-sm text-slate-500">Drop reagents here.</div>`
                              : selectedChemicals.map(
                                  (c) => html`
                                    <span
                                      class="inline-flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-full px-3 py-1 text-xs"
                                      title=${c.name}
                                    >
                                      <span class="h-2.5 w-2.5 rounded-full" style=${{ background: c.color || '#64748b' }}></span>
                                      <span class="text-slate-100">${c.symbol}</span>
                                      <button class="text-slate-400 hover:text-white" onClick=${() => removeChemical(c.name)} aria-label="Remove">×</button>
                                    </span>
                                  `
                                )}
                          </div>
                        </div>

                        <!-- Test tube visual (for “real lab” feeling) -->
                        <div class="mt-4 flex items-center justify-between gap-3">
                          <div class="text-xs text-slate-400"><i class="fa-solid fa-vial mr-2"></i>Test tube</div>
                          <div class=${classNames('relative w-[110px] h-[46px] rounded-full tube overflow-hidden', labStage === 'mixing' ? 'shake' : '')}>
                            <div class="absolute left-2 top-1 bottom-1 w-9 rounded-full tube-cap"></div>
                            <div class="absolute inset-0" style=${{ background: `linear-gradient(90deg, rgba(255,255,255,0.06), transparent)` }}></div>
                            <div class="absolute left-10 right-2 bottom-1 rounded-full" style=${{
                              height: '60%',
                              background: showLayers ? 'linear-gradient(90deg, rgba(59,130,246,0.22), rgba(250,204,21,0.22))' : liquidColor(),
                              borderTop: '1px solid rgba(255,255,255,0.10)',
                            }}></div>
                          </div>
                        </div>
                      </div>

                      <div class="space-y-3">
                        <div class="bg-slate-950/35 border border-slate-800 rounded-xl p-4">
                          <div class="text-xs text-slate-400 mb-2 flex items-center justify-between">
                            <span><i class="fa-solid fa-sliders mr-2"></i>Controls</span>
                            <span class="font-mono">${labProgress}%</span>
                          </div>

                          <div class="w-full bg-slate-900/70 border border-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              class="h-2 rounded-full bg-gradient-to-r from-cyan-400/70 to-purple-500/70 transition-all duration-200"
                              style=${{ width: `${labProgress}%` }}
                            ></div>
                          </div>

                          <div class="mt-3 grid grid-cols-2 gap-2">
                            <div class="bg-slate-900/60 border border-slate-800 rounded-lg p-2">
                              <div class="text-[11px] text-slate-400"><i class="fa-solid fa-temperature-three-quarters mr-2"></i>Temp (°C)</div>
                              <div class="text-lg font-extrabold">
                                ${labResult?.measurements?.temperature_c != null ? labResult.measurements.temperature_c : '—'}
                              </div>
                            </div>
                            <div class="bg-slate-900/60 border border-slate-800 rounded-lg p-2">
                              <div class="text-[11px] text-slate-400"><i class="fa-solid fa-gauge-high mr-2"></i>Reaction speed</div>
                              <div class="text-lg font-extrabold">
                                ${labResult?.measurements?.rate != null ? labResult.measurements.rate : '—'}
                              </div>
                            </div>
                            <div class="bg-slate-900/60 border border-slate-800 rounded-lg p-2">
                              <div class="text-[11px] text-slate-400"><i class="fa-solid fa-vial mr-2"></i>pH</div>
                              <div class="text-lg font-extrabold">
                                ${labResult?.measurements?.ph != null ? labResult.measurements.ph : '—'}
                              </div>
                            </div>
                            <div class="bg-slate-900/60 border border-slate-800 rounded-lg p-2">
                              <div class="text-[11px] text-slate-400"><i class="fa-solid fa-beaker mr-2"></i>Volume</div>
                              <div class="text-lg font-extrabold">${volumeMl}</div>
                            </div>
                          </div>

                          <div class="mt-4">
                            <div class="flex items-center justify-between">
                              <div class="text-sm font-bold text-slate-100 flex items-center gap-2">
                                <i class=${classNames('fa-solid fa-fire-flame-curved', burnerOn ? 'text-orange-300' : 'text-slate-500')}></i>
                                Burner heat
                              </div>
                              <div class="text-xs text-slate-400">
                                ${burnerOn ? html`<span class="font-mono">${heatLevel}</span>/100` : 'Enable Bunsen Burner'}
                              </div>
                            </div>
                            <input
                              class=${classNames('w-full mt-2', burnerOn ? '' : 'opacity-40')}
                              type="range"
                              min="0"
                              max="100"
                              step="1"
                              value=${heatLevel}
                              disabled=${!burnerOn}
                              onInput=${(e) => {
                                const next = Number(e.target.value);
                                setHeatLevel(next);
                                setLabLog((prev) => [{ id: uid('log'), at: new Date().toISOString(), type: 'heat', message: `Heat set to ${next}/100.` }, ...prev]);
                              }}
                            />
                            <div class="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                              <span>Low</span><span>High</span>
                            </div>
                          </div>

                          <div class="mt-4">
                            <label class="text-xs text-slate-400">Volume (mL)</label>
                            <input
                              class="w-full mt-2"
                              type="range"
                              min="50"
                              max="1000"
                              step="50"
                              value=${volumeMl}
                              onInput=${(e) => setVolumeMl(Number(e.target.value))}
                            />
                          </div>

                          <div class="mt-4 flex items-center justify-between">
                            <div class="text-xs text-slate-400">Burner</div>
                            ${burnerOn && heatLevel > 0
                              ? html`<div class="flex items-center gap-3">
                                  <div class="flame"></div>
                                  <div class="text-xs text-slate-300 font-mono">${Math.round((heatLevel / 100) * 100)}%</div>
                                </div>`
                              : html`<div class="text-xs text-slate-500">Off</div>`}
                          </div>
                        </div>

                        <div class="bg-slate-950/35 border border-slate-800 rounded-xl p-4">
                          <div class="text-xs text-slate-400 mb-2"><i class="fa-solid fa-screwdriver-wrench mr-2"></i>Tools rack</div>
                          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            ${LAB_TOOLS.map((t) => {
                              const active = selectedTools.includes(t.name);
                              return html`
                                <button
                                  class=${classNames(
                                    'rounded-lg px-3 py-2 border text-left text-xs transition group',
                                    active ? 'border-yellow-400/60 bg-yellow-500/10' : 'border-slate-800 hover:border-slate-600 bg-slate-950/30'
                                  )}
                                  onClick=${() => toggleTool(t.name)}
                                  title=${t.note}
                                  type="button"
                                >
                                  <div class="flex items-center gap-2 min-w-0">
                                    <i class=${classNames(t.icon, active ? 'text-yellow-200' : 'text-slate-300')}></i>
                                    <div class="font-bold text-slate-100 truncate">${t.name}</div>
                                  </div>
                                  <div class="text-[11px] text-slate-400 truncate mt-1 group-hover:text-slate-300">${t.note}</div>
                                </button>
                              `;
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4 sm:space-y-6">
            <div class="bg-slate-950/30 border border-slate-800 rounded-xl p-4 sm:p-6">
              <div class="flex items-center gap-2 font-bold text-emerald-200 mb-3">
                <i class="fa-solid fa-eye"></i> Observations
              </div>
              ${labResult
                ? html`
                    <div class="space-y-3 text-sm text-slate-200">
                      <div class="text-xs text-slate-400">Observation</div>
                      <div class="text-yellow-200 break-words whitespace-pre-wrap">${labResult.observation}</div>
                      <div class="text-xs text-slate-400 mt-2">Result</div>
                      <div class="break-words whitespace-pre-wrap">${labResult.result}</div>

                      ${labResult.reaction
                        ? html`
                            <div class="mt-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                              <div class="text-xs text-slate-400 mb-1">Matched reaction</div>
                              <div class="font-bold text-cyan-200">${labResult.reaction.name}</div>
                              <div class="text-xs font-mono text-slate-300 mt-1 break-words">${labResult.reaction.equation}</div>
                              <div class="text-xs text-slate-400 mt-2">
                                ${labResult.reaction.type} · Energy: ${labResult.reaction.energyRelease ?? '—'}
                              </div>
                            </div>
                          `
                        : null}

                      <div class="text-xs text-slate-400">Safety</div>
                      <div class="text-orange-100 break-words whitespace-pre-wrap">${labResult.safety || 'Standard lab safety'}</div>

                      ${Array.isArray(labResult.toolNotes) && labResult.toolNotes.length
                        ? html`
                            <div class="text-xs text-slate-400">
                              <div class="mt-2 mb-1">Tool notes</div>
                              <ul class="space-y-1">
                                ${labResult.toolNotes.slice(0, 8).map((n) => html`<li class="text-slate-300">• ${n}</li>`)}
                              </ul>
                            </div>
                          `
                        : null}

                      <div class="text-xs text-slate-400">Time: ${formatDateTime(labResult.timestamp)}</div>
                      <button
                        class="w-full bg-emerald-600/80 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                        onClick=${() => setTab('notebook')}
                      >
                        View in Notebook
                      </button>
                    </div>
                  `
                : html`<div class="text-sm text-slate-500">Run an experiment to see observations here.</div>`}
            </div>

            <div class="bg-slate-950/30 border border-slate-800 rounded-xl p-4 sm:p-6">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2 font-bold text-cyan-200">
                  <i class="fa-solid fa-terminal"></i> Lab Console
                </div>
                <div class="text-[11px] text-slate-500">latest first</div>
              </div>
              <div class="bg-black/30 border border-slate-800 rounded-xl p-3 max-h-72 overflow-y-auto text-xs font-mono">
                ${labLog.length === 0
                  ? html`<div class="text-slate-500">No events yet. Drag chemicals into the beaker.</div>`
                  : labLog.slice(0, 24).map(
                      (l) => html`
                        <div class="flex gap-2 py-1 border-b border-slate-800/60 last:border-b-0 min-w-0">
                          <span class="text-slate-500 shrink-0">${new Date(l.at).toLocaleTimeString()}</span>
                          <span class="text-slate-200 break-words min-w-0 flex-1">${l.message}</span>
                        </div>
                      `
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function Notebook() {
    const list = Array.isArray(findings) ? findings : [];
    const active = list.find((f) => f.id === activeFindingId) || list[0] || null;

    const [draft, setDraft] = React.useState({ title: '', notes: '', observations: '', conclusion: '' });
    React.useEffect(() => {
      if (!active) {
        setDraft({ title: '', notes: '', observations: '', conclusion: '' });
        return;
      }
      setDraft({
        title: active.title || '',
        notes: active.notes || '',
        observations: active.observations || '',
        conclusion: active.conclusion || '',
      });
    }, [active?.id]);

    function createBlank() {
      const now = new Date().toISOString();
      const f = {
        id: uid('finding'),
        title: 'New Finding',
        notes: '',
        observations: '',
        conclusion: '',
        safety: 'Standard lab safety',
        chemicals: [],
        tools: [],
        lab: labType,
        createdAt: now,
      };
      setFindings((prev) => [f, ...(Array.isArray(prev) ? prev : [])].slice(0, 500));
      setActiveFindingId(f.id);
      toast.show('Created a new finding.', 'success');
    }

    function saveEdits() {
      if (!active) return;
      const updated = {
        ...active,
        title: draft.title || active.title,
        notes: draft.notes,
        observations: draft.observations,
        conclusion: draft.conclusion,
        updatedAt: new Date().toISOString(),
      };
      setFindings((prev) => (Array.isArray(prev) ? prev : []).map((f) => (f.id === active.id ? updated : f)));
      toast.show('Saved to notebook.', 'success');
      apiPost('/findings', {
        id: updated.id,
        title: updated.title,
        content: updated.notes,
        experiment: (updated.chemicals || []).join(', '),
        lab: updated.lab,
        observations: updated.observations,
        conclusion: updated.conclusion,
      }).catch(() => {});
    }

    function deleteActive() {
      if (!active) return;
      if (!window.confirm('Delete this finding?')) return;
      setFindings((prev) => (Array.isArray(prev) ? prev : []).filter((f) => f.id !== active.id));
      setActiveFindingId(null);
      toast.show('Deleted finding.', 'success');
    }

    function exportJson() {
      const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vlab-notebook.json';
      a.click();
      URL.revokeObjectURL(url);
    }

    return html`
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 section">
        <div class="flex items-end justify-between gap-4 flex-wrap mb-5">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold">Notebook</h1>
            <div class="text-sm text-slate-400 mt-1">Findings are auto-saved from the Lab.</div>
          </div>
          <div class="flex gap-2 flex-wrap">
            <button
              class="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-100 px-3 py-2 rounded-lg text-sm transition"
              onClick=${exportJson}
            >
              <i class="fa-solid fa-download mr-2"></i>Export JSON
            </button>
            <button
              class="bg-emerald-600/80 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-bold transition"
              onClick=${createBlank}
            >
              <i class="fa-solid fa-plus mr-2"></i>New
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div class="bg-slate-950/30 border border-slate-800 rounded-xl p-3 sm:p-4">
            <div class="text-xs text-slate-400 mb-2">Findings</div>
            <div class="max-h-[70vh] overflow-y-auto space-y-2 pr-1">
              ${list.length === 0
                ? html`<div class="text-sm text-slate-500 p-2">No findings yet. Run an experiment in Lab.</div>`
                : list.map((f) => {
                    const isActive = active && f.id === active.id;
                    return html`
                      <button
                        class=${classNames(
                          'w-full text-left rounded-lg px-3 py-2 border transition',
                          isActive ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-slate-800 hover:border-slate-600 bg-slate-950/30'
                        )}
                        onClick=${() => setActiveFindingId(f.id)}
                      >
                        <div class="text-sm font-bold text-emerald-100 truncate">${f.title || 'Untitled'}</div>
                        <div class="text-[11px] text-slate-400 truncate">${(f.lab || 'Lab') + ' · ' + formatDateTime(f.createdAt)}</div>
                      </button>
                    `;
                  })}
            </div>
          </div>

          <div class="lg:col-span-2 bg-slate-950/30 border border-slate-800 rounded-xl p-4 sm:p-6">
            ${!active
              ? html`<div class="text-sm text-slate-500">Select a finding to view/edit.</div>`
              : html`
                  <div class="flex items-start justify-between gap-3 flex-wrap mb-4">
                    <div>
                      <div class="text-xs text-slate-400">Finding</div>
                      <div class="text-lg font-bold text-slate-100">${active.title}</div>
                      <div class="text-xs text-slate-400 mt-1">
                        ${active.lab || 'Lab'} · Created: ${formatDateTime(active.createdAt)}
                        ${active.updatedAt ? html` · Updated: ${formatDateTime(active.updatedAt)}` : null}
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <button
                        class="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-100 px-3 py-2 rounded-lg text-sm transition"
                        onClick=${deleteActive}
                      >
                        <i class="fa-solid fa-trash mr-2"></i>Delete
                      </button>
                      <button
                        class="bg-emerald-600/80 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-bold transition"
                        onClick=${saveEdits}
                      >
                        <i class="fa-solid fa-floppy-disk mr-2"></i>Save
                      </button>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div class="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
                      <div class="text-xs text-slate-400 mb-1"><i class="fa-solid fa-flask-vial mr-2"></i>Chemicals</div>
                      <div class="text-sm text-slate-200">
                        ${active.chemicals && active.chemicals.length ? active.chemicals.join(', ') : '—'}
                      </div>
                    </div>
                    <div class="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
                      <div class="text-xs text-slate-400 mb-1"><i class="fa-solid fa-screwdriver-wrench mr-2"></i>Tools</div>
                      <div class="text-sm text-slate-200">
                        ${active.tools && active.tools.length ? active.tools.join(', ') : '—'}
                      </div>
                    </div>
                  </div>

                  ${active.measurements
                    ? html`
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                          <div class="bg-slate-900/60 border border-slate-800 rounded-lg p-2">
                            <div class="text-[11px] text-slate-400">Temp (°C)</div>
                            <div class="text-lg font-extrabold">${active.measurements.temperature_c ?? '—'}</div>
                          </div>
                          <div class="bg-slate-900/60 border border-slate-800 rounded-lg p-2">
                            <div class="text-[11px] text-slate-400">Heat</div>
                            <div class="text-lg font-extrabold">${active.measurements.heat_level ?? '—'}</div>
                          </div>
                          <div class="bg-slate-900/60 border border-slate-800 rounded-lg p-2">
                            <div class="text-[11px] text-slate-400">pH</div>
                            <div class="text-lg font-extrabold">${active.measurements.ph ?? '—'}</div>
                          </div>
                          <div class="bg-slate-900/60 border border-slate-800 rounded-lg p-2">
                            <div class="text-[11px] text-slate-400">Rate</div>
                            <div class="text-lg font-extrabold">${active.measurements.rate ?? '—'}</div>
                          </div>
                        </div>
                      `
                    : null}

                  <div class="space-y-3">
                    <div>
                      <label class="text-xs text-slate-400">Title</label>
                      <input
                        class="mt-1 w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm"
                        value=${draft.title}
                        onInput=${(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label class="text-xs text-slate-400">Notes</label>
                      <textarea
                        class="mt-1 w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm min-h-28"
                        value=${draft.notes}
                        onInput=${(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                      ></textarea>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label class="text-xs text-slate-400">Observations</label>
                        <textarea
                          class="mt-1 w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm min-h-24"
                          value=${draft.observations}
                          onInput=${(e) => setDraft((d) => ({ ...d, observations: e.target.value }))}
                        ></textarea>
                      </div>
                      <div>
                        <label class="text-xs text-slate-400">Conclusion</label>
                        <textarea
                          class="mt-1 w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm min-h-24"
                          value=${draft.conclusion}
                          onInput=${(e) => setDraft((d) => ({ ...d, conclusion: e.target.value }))}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                `}
          </div>
        </div>
      </div>
    `;
  }

  function About() {
    return html`
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 section">
        <div class="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-4 sm:p-8">
          <h1 class="text-2xl sm:text-3xl font-bold mb-4">About</h1>
          <div class="text-slate-300">
            This frontend is intentionally <strong>no-build</strong> to avoid native toolchain issues (esbuild segfault on some systems).
            It still runs via <span class="font-mono">npm run dev</span> using a tiny Node dev server with an API proxy.
          </div>
        </div>
      </div>
    `;
  }

  return html`
    <${TopNav} />
    ${toast.node}
    <${ConnectionBanner} />
    ${tab === 'home' ? html`<${Home} />` : null}
    ${tab === 'reactions' ? html`<${Reactions} />` : null}
    ${tab === 'tools' ? html`<${Tools} />` : null}
    ${tab === 'lab' ? html`<${Lab} />` : null}
    ${tab === 'notebook' ? html`<${Notebook} />` : null}
    ${tab === 'about' ? html`<${About} />` : null}

    <${Modal} open=${!!openReaction} title=${openReaction ? openReaction.name : ''} onClose=${() => setOpenReaction(null)}>
      ${openReaction
        ? html`
            <div class="space-y-3 text-slate-300 text-sm">
              <div class="font-mono text-slate-100 break-words">${openReaction.equation}</div>
              <div class="flex gap-2 flex-wrap">
                <span class="text-xs px-2 py-1 bg-slate-900/60 border border-slate-800 rounded">${openReaction.category}</span>
                <span class="text-xs px-2 py-1 bg-slate-900/60 border border-slate-800 rounded">${openReaction.type}</span>
                <span class="text-xs px-2 py-1 bg-slate-900/60 border border-slate-800 rounded">
                  Hazard: ${openReaction.hazard}
                </span>
              </div>
              <div>${openReaction.description}</div>
              ${openReaction.energyRelease != null
                ? html`<div class="text-xs text-slate-400">Energy (kJ/mol): ${openReaction.energyRelease}</div>`
                : null}
            </div>
          `
        : null}
    <//>

    <${Modal} open=${!!openTool} title=${openTool ? openTool.name : ''} onClose=${() => setOpenTool(null)}>
      ${openTool
        ? html`
            <div class="space-y-3 text-slate-300 text-sm">
              <div class="text-xs px-2 py-1 bg-slate-900/60 border border-slate-800 rounded inline-block">${openTool.category}</div>
              <div>${openTool.description}</div>
              ${openTool.formula ? html`<div class="font-mono text-slate-100">${openTool.formula}</div>` : null}
            </div>
          `
        : null}
    <//>
  `;
}

createRoot(document.getElementById('root')).render(html`<${App} />`);
