import React from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

// Use the current hostname so this works in VM/LAN setups (not just localhost).
const API_BASE = `http://${window.location.hostname}:5000/api`;

function classNames(...values) {
  return values.filter(Boolean).join(' ');
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
      <div class="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-slate-700">
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

function useApi(getPath, deps = []) {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}${getPath}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, error, loading };
}

function App() {
  const [tab, setTab] = React.useState('home');

  const stats = useApi('/stats', [tab === 'home']);
  const reactions = useApi('/reactions', [tab === 'reactions']);
  const categories = useApi('/categories', [tab === 'reactions']);
  const tools = useApi('/tools', [tab === 'tools']);
  const toolCategories = useApi('/tool-categories', [tab === 'tools']);

  const [reactionQuery, setReactionQuery] = React.useState('');
  const [reactionCategory, setReactionCategory] = React.useState('');
  const [toolCategory, setToolCategory] = React.useState('');

  const [openReaction, setOpenReaction] = React.useState(null);
  const [openTool, setOpenTool] = React.useState(null);

  const filteredReactions = React.useMemo(() => {
    const list = Array.isArray(reactions.data) ? reactions.data : [];
    return list.filter((r) => {
      const matchesQuery =
        !reactionQuery ||
        r.name?.toLowerCase().includes(reactionQuery.toLowerCase()) ||
        r.equation?.toLowerCase().includes(reactionQuery.toLowerCase()) ||
        r.description?.toLowerCase().includes(reactionQuery.toLowerCase());
      const matchesCategory = !reactionCategory || r.category === reactionCategory;
      return matchesQuery && matchesCategory;
    });
  }, [reactions.data, reactionQuery, reactionCategory]);

  const filteredTools = React.useMemo(() => {
    const list = Array.isArray(tools.data) ? tools.data : [];
    return list.filter((t) => (!toolCategory ? true : t.category === toolCategory));
  }, [tools.data, toolCategory]);

  function TopNav() {
    const items = [
      ['home', 'Home'],
      ['reactions', 'Reactions'],
      ['tools', 'Tools'],
      ['about', 'About'],
    ];
    return html`
      <nav class="bg-black bg-opacity-50 backdrop-blur-lg sticky top-0 z-40 border-b border-cyan-500/30">
        <div class="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="text-2xl font-bold">⚗️ Virtual Science Lab</div>
            <div class="text-xs text-slate-400 hidden sm:block">React frontend</div>
          </div>
          <div class="flex gap-2 sm:gap-3 flex-wrap justify-end">
            ${items.map(
              ([key, label]) => html`
                <button
                  class=${classNames(
                    'px-3 py-1.5 rounded border text-sm transition',
                    tab === key
                      ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-300'
                      : 'border-slate-700 hover:border-slate-500 text-slate-200'
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

  function ConnectionBanner({ error }) {
    if (!error) return null;
    return html`
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div class="bg-red-900/40 border border-red-500/40 rounded-lg p-4 text-sm">
          <div class="font-bold mb-1">Connection Error</div>
          <div class="text-slate-200">
            Start the backend at <span class="font-mono">http://localhost:5000</span> and refresh.
          </div>
          <div class="text-slate-400 mt-1">Details: ${String(error.message || error)}</div>
        </div>
      </div>
    `;
  }

  function Home() {
    const s = stats.data || {};
    return html`
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <h1 class="text-2xl sm:text-3xl font-bold mb-4">Dashboard</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div class="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-4 sm:p-6">
            <div class="text-3xl sm:text-4xl mb-2">🧪</div>
            <div class="text-sm text-slate-300">Reactions</div>
            <div class="text-3xl font-bold text-cyan-400">${s.total_reactions ?? '—'}</div>
          </div>
          <div class="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 sm:p-6">
            <div class="text-3xl sm:text-4xl mb-2">🔬</div>
            <div class="text-sm text-slate-300">Tools</div>
            <div class="text-3xl font-bold text-purple-400">${s.total_tools ?? '—'}</div>
          </div>
          <div class="bg-green-900/30 border border-green-500/30 rounded-lg p-4 sm:p-6">
            <div class="text-3xl sm:text-4xl mb-2">📚</div>
            <div class="text-sm text-slate-300">Categories</div>
            <div class="text-3xl font-bold text-green-400">${s.categories ?? '—'}</div>
          </div>
        </div>
        <div class="bg-slate-900/40 border border-slate-700 rounded-lg p-4 sm:p-6">
          <div class="text-slate-300">
            This React UI reads the same Flask API as the static frontend.
          </div>
          <div class="mt-3 text-sm text-slate-400">
            Backend: <span class="font-mono">http://localhost:5000</span>
          </div>
        </div>
      </div>
    `;
  }

  function Reactions() {
    return html`
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
          <h1 class="text-2xl sm:text-3xl font-bold">Reactions</h1>
        </div>
        <div class="mb-5 flex flex-col sm:flex-row gap-3">
          <input
            class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 text-white text-sm placeholder-slate-500 focus:border-cyan-500 outline-none"
            placeholder="Search reactions..."
            value=${reactionQuery}
            onInput=${(e) => setReactionQuery(e.target.value)}
          />
          <select
            class="bg-slate-800 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 text-white text-sm"
            value=${reactionCategory}
            onChange=${(e) => setReactionCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            ${(Array.isArray(categories.data) ? categories.data : []).map(
              (c) => html`<option value=${c}>${c}</option>`
            )}
          </select>
        </div>

        ${reactions.loading
          ? html`<div class="text-slate-400">Loading...</div>`
          : html`
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                ${filteredReactions.map((r) => {
                  const energyColor = (r.type || '').includes('Exothermic') ? 'text-red-400' : 'text-blue-400';
                  return html`
                    <button
                      class="text-left bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-cyan-500/60 transition"
                      onClick=${() => setOpenReaction(r)}
                    >
                      <div class="text-cyan-300 font-bold">${r.name}</div>
                      <div class="text-xs text-slate-400 font-mono mt-1">${r.equation}</div>
                      <div class="flex justify-between items-center mt-3">
                        <span class="text-xs px-2 py-1 bg-slate-700 rounded">${r.category}</span>
                        <span class=${classNames('text-xs font-bold', energyColor)}>${r.type}</span>
                      </div>
                      <div class="text-sm text-slate-400 mt-3 line-clamp-2">${r.description}</div>
                    </button>
                  `;
                })}
              </div>
              ${filteredReactions.length === 0
                ? html`<div class="text-slate-400 mt-4">No reactions found.</div>`
                : null}
            `}
      </div>
    `;
  }

  function Tools() {
    return html`
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
          <h1 class="text-2xl sm:text-3xl font-bold">Tools</h1>
        </div>
        <div class="mb-5 flex flex-col sm:flex-row gap-3">
          <select
            class="bg-slate-800 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 text-white text-sm"
            value=${toolCategory}
            onChange=${(e) => setToolCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            ${(Array.isArray(toolCategories.data) ? toolCategories.data : []).map(
              (c) => html`<option value=${c}>${c}</option>`
            )}
          </select>
        </div>

        ${tools.loading
          ? html`<div class="text-slate-400">Loading...</div>`
          : html`
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                ${filteredTools.map(
                  (t) => html`
                    <button
                      class="text-left bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-purple-500/60 transition"
                      onClick=${() => setOpenTool(t)}
                    >
                      <div class="text-purple-300 font-bold">${t.name}</div>
                      <div class="text-xs px-2 py-1 bg-slate-700 rounded inline-block mt-2">${t.category}</div>
                      <div class="text-sm text-slate-400 mt-3 line-clamp-3">${t.description}</div>
                    </button>
                  `
                )}
              </div>
              ${filteredTools.length === 0 ? html`<div class="text-slate-400 mt-4">No tools found.</div>` : null}
            `}
      </div>
    `;
  }

  function About() {
    return html`
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div class="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 sm:p-8">
          <h1 class="text-2xl sm:text-3xl font-bold mb-4">About</h1>
          <div class="text-slate-300">
            Virtual Science Lab is an interactive chemistry platform with a Flask API backend.
          </div>
          <div class="text-slate-400 mt-4 text-sm">
            This React frontend is a lightweight, no-build setup (served as static files) that imports React via CDN.
          </div>
        </div>
      </div>
    `;
  }

  const anyError = stats.error || reactions.error || tools.error;

  return html`
    <${TopNav} />
    <${ConnectionBanner} error=${anyError} />
    ${tab === 'home' ? html`<${Home} />` : null}
    ${tab === 'reactions' ? html`<${Reactions} />` : null}
    ${tab === 'tools' ? html`<${Tools} />` : null}
    ${tab === 'about' ? html`<${About} />` : null}

    <${Modal}
      open=${!!openReaction}
      title=${openReaction ? openReaction.name : ''}
      onClose=${() => setOpenReaction(null)}
    >
      ${openReaction
        ? html`
            <div class="space-y-3 text-slate-300 text-sm">
              <div class="font-mono text-slate-200">${openReaction.equation}</div>
              <div class="flex gap-2 flex-wrap">
                <span class="text-xs px-2 py-1 bg-slate-700 rounded">${openReaction.category}</span>
                <span class="text-xs px-2 py-1 bg-slate-700 rounded">${openReaction.type}</span>
                <span class="text-xs px-2 py-1 bg-slate-700 rounded">Hazard: ${openReaction.hazard}</span>
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
              <div class="text-xs px-2 py-1 bg-slate-700 rounded inline-block">${openTool.category}</div>
              <div>${openTool.description}</div>
              ${openTool.formula ? html`<div class="font-mono text-slate-200">${openTool.formula}</div>` : null}
            </div>
          `
        : null}
    <//>
  `;
}

createRoot(document.getElementById('root')).render(html`<${App} />`);
