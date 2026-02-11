import React from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

const API_BASE = '/api';
const TAB_ROUTES = {
  vlab: '/',
  home: '/home',
  reactions: '/reactions',
  tools: '/tools',
  periodic: '/periodic-table',
  lab: '/lab',
  notebook: '/notebook',
  about: '/about',
};
const TAB_KEYS = new Set(Object.keys(TAB_ROUTES));
const TAB_TITLES = {
  vlab: 'Virtual Science Lab',
  home: 'Dashboard',
  reactions: 'Reactions',
  tools: 'Tools',
  periodic: 'Periodic Table',
  lab: 'Lab',
  notebook: 'Notebook',
  about: 'About',
};

const WEBSITE_TABS = new Set(['vlab', 'home', 'about']);
const APP_TABS = new Set(['lab', 'notebook', 'periodic', 'reactions', 'tools']);

const ELEMENTS = [
  { number: 1, symbol: 'H', name: 'Hydrogen', category: 'Nonmetal', group: 1, period: 1 },
  { number: 2, symbol: 'He', name: 'Helium', category: 'Noble gas', group: 18, period: 1 },
  { number: 3, symbol: 'Li', name: 'Lithium', category: 'Alkali metal', group: 1, period: 2 },
  { number: 4, symbol: 'Be', name: 'Beryllium', category: 'Alkaline earth metal', group: 2, period: 2 },
  { number: 5, symbol: 'B', name: 'Boron', category: 'Metalloid', group: 13, period: 2 },
  { number: 6, symbol: 'C', name: 'Carbon', category: 'Nonmetal', group: 14, period: 2 },
  { number: 7, symbol: 'N', name: 'Nitrogen', category: 'Nonmetal', group: 15, period: 2 },
  { number: 8, symbol: 'O', name: 'Oxygen', category: 'Nonmetal', group: 16, period: 2 },
  { number: 9, symbol: 'F', name: 'Fluorine', category: 'Halogen', group: 17, period: 2 },
  { number: 10, symbol: 'Ne', name: 'Neon', category: 'Noble gas', group: 18, period: 2 },
  { number: 11, symbol: 'Na', name: 'Sodium', category: 'Alkali metal', group: 1, period: 3 },
  { number: 12, symbol: 'Mg', name: 'Magnesium', category: 'Alkaline earth metal', group: 2, period: 3 },
  { number: 13, symbol: 'Al', name: 'Aluminum', category: 'Post-transition metal', group: 13, period: 3 },
  { number: 14, symbol: 'Si', name: 'Silicon', category: 'Metalloid', group: 14, period: 3 },
  { number: 15, symbol: 'P', name: 'Phosphorus', category: 'Nonmetal', group: 15, period: 3 },
  { number: 16, symbol: 'S', name: 'Sulfur', category: 'Nonmetal', group: 16, period: 3 },
  { number: 17, symbol: 'Cl', name: 'Chlorine', category: 'Halogen', group: 17, period: 3 },
  { number: 18, symbol: 'Ar', name: 'Argon', category: 'Noble gas', group: 18, period: 3 },
  { number: 19, symbol: 'K', name: 'Potassium', category: 'Alkali metal', group: 1, period: 4 },
  { number: 20, symbol: 'Ca', name: 'Calcium', category: 'Alkaline earth metal', group: 2, period: 4 },
  { number: 21, symbol: 'Sc', name: 'Scandium', category: 'Transition metal', group: 3, period: 4 },
  { number: 22, symbol: 'Ti', name: 'Titanium', category: 'Transition metal', group: 4, period: 4 },
  { number: 23, symbol: 'V', name: 'Vanadium', category: 'Transition metal', group: 5, period: 4 },
  { number: 24, symbol: 'Cr', name: 'Chromium', category: 'Transition metal', group: 6, period: 4 },
  { number: 25, symbol: 'Mn', name: 'Manganese', category: 'Transition metal', group: 7, period: 4 },
  { number: 26, symbol: 'Fe', name: 'Iron', category: 'Transition metal', group: 8, period: 4 },
  { number: 27, symbol: 'Co', name: 'Cobalt', category: 'Transition metal', group: 9, period: 4 },
  { number: 28, symbol: 'Ni', name: 'Nickel', category: 'Transition metal', group: 10, period: 4 },
  { number: 29, symbol: 'Cu', name: 'Copper', category: 'Transition metal', group: 11, period: 4 },
  { number: 30, symbol: 'Zn', name: 'Zinc', category: 'Transition metal', group: 12, period: 4 },
  { number: 31, symbol: 'Ga', name: 'Gallium', category: 'Post-transition metal', group: 13, period: 4 },
  { number: 32, symbol: 'Ge', name: 'Germanium', category: 'Metalloid', group: 14, period: 4 },
  { number: 33, symbol: 'As', name: 'Arsenic', category: 'Metalloid', group: 15, period: 4 },
  { number: 34, symbol: 'Se', name: 'Selenium', category: 'Nonmetal', group: 16, period: 4 },
  { number: 35, symbol: 'Br', name: 'Bromine', category: 'Halogen', group: 17, period: 4 },
  { number: 36, symbol: 'Kr', name: 'Krypton', category: 'Noble gas', group: 18, period: 4 },
  { number: 37, symbol: 'Rb', name: 'Rubidium', category: 'Alkali metal', group: 1, period: 5 },
  { number: 38, symbol: 'Sr', name: 'Strontium', category: 'Alkaline earth metal', group: 2, period: 5 },
  { number: 39, symbol: 'Y', name: 'Yttrium', category: 'Transition metal', group: 3, period: 5 },
  { number: 40, symbol: 'Zr', name: 'Zirconium', category: 'Transition metal', group: 4, period: 5 },
  { number: 41, symbol: 'Nb', name: 'Niobium', category: 'Transition metal', group: 5, period: 5 },
  { number: 42, symbol: 'Mo', name: 'Molybdenum', category: 'Transition metal', group: 6, period: 5 },
  { number: 43, symbol: 'Tc', name: 'Technetium', category: 'Transition metal', group: 7, period: 5 },
  { number: 44, symbol: 'Ru', name: 'Ruthenium', category: 'Transition metal', group: 8, period: 5 },
  { number: 45, symbol: 'Rh', name: 'Rhodium', category: 'Transition metal', group: 9, period: 5 },
  { number: 46, symbol: 'Pd', name: 'Palladium', category: 'Transition metal', group: 10, period: 5 },
  { number: 47, symbol: 'Ag', name: 'Silver', category: 'Transition metal', group: 11, period: 5 },
  { number: 48, symbol: 'Cd', name: 'Cadmium', category: 'Transition metal', group: 12, period: 5 },
  { number: 49, symbol: 'In', name: 'Indium', category: 'Post-transition metal', group: 13, period: 5 },
  { number: 50, symbol: 'Sn', name: 'Tin', category: 'Post-transition metal', group: 14, period: 5 },
  { number: 51, symbol: 'Sb', name: 'Antimony', category: 'Metalloid', group: 15, period: 5 },
  { number: 52, symbol: 'Te', name: 'Tellurium', category: 'Metalloid', group: 16, period: 5 },
  { number: 53, symbol: 'I', name: 'Iodine', category: 'Halogen', group: 17, period: 5 },
  { number: 54, symbol: 'Xe', name: 'Xenon', category: 'Noble gas', group: 18, period: 5 },
  { number: 55, symbol: 'Cs', name: 'Cesium', category: 'Alkali metal', group: 1, period: 6 },
  { number: 56, symbol: 'Ba', name: 'Barium', category: 'Alkaline earth metal', group: 2, period: 6 },
  { number: 57, symbol: 'La', name: 'Lanthanum', category: 'Lanthanide', group: 3, period: 6 },
  { number: 58, symbol: 'Ce', name: 'Cerium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 59, symbol: 'Pr', name: 'Praseodymium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 60, symbol: 'Nd', name: 'Neodymium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 61, symbol: 'Pm', name: 'Promethium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 62, symbol: 'Sm', name: 'Samarium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 63, symbol: 'Eu', name: 'Europium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 64, symbol: 'Gd', name: 'Gadolinium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 65, symbol: 'Tb', name: 'Terbium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 66, symbol: 'Dy', name: 'Dysprosium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 67, symbol: 'Ho', name: 'Holmium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 68, symbol: 'Er', name: 'Erbium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 69, symbol: 'Tm', name: 'Thulium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 70, symbol: 'Yb', name: 'Ytterbium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 71, symbol: 'Lu', name: 'Lutetium', category: 'Lanthanide', period: 6, series: 'lanthanide' },
  { number: 72, symbol: 'Hf', name: 'Hafnium', category: 'Transition metal', group: 4, period: 6 },
  { number: 73, symbol: 'Ta', name: 'Tantalum', category: 'Transition metal', group: 5, period: 6 },
  { number: 74, symbol: 'W', name: 'Tungsten', category: 'Transition metal', group: 6, period: 6 },
  { number: 75, symbol: 'Re', name: 'Rhenium', category: 'Transition metal', group: 7, period: 6 },
  { number: 76, symbol: 'Os', name: 'Osmium', category: 'Transition metal', group: 8, period: 6 },
  { number: 77, symbol: 'Ir', name: 'Iridium', category: 'Transition metal', group: 9, period: 6 },
  { number: 78, symbol: 'Pt', name: 'Platinum', category: 'Transition metal', group: 10, period: 6 },
  { number: 79, symbol: 'Au', name: 'Gold', category: 'Transition metal', group: 11, period: 6 },
  { number: 80, symbol: 'Hg', name: 'Mercury', category: 'Transition metal', group: 12, period: 6 },
  { number: 81, symbol: 'Tl', name: 'Thallium', category: 'Post-transition metal', group: 13, period: 6 },
  { number: 82, symbol: 'Pb', name: 'Lead', category: 'Post-transition metal', group: 14, period: 6 },
  { number: 83, symbol: 'Bi', name: 'Bismuth', category: 'Post-transition metal', group: 15, period: 6 },
  { number: 84, symbol: 'Po', name: 'Polonium', category: 'Metalloid', group: 16, period: 6 },
  { number: 85, symbol: 'At', name: 'Astatine', category: 'Halogen', group: 17, period: 6 },
  { number: 86, symbol: 'Rn', name: 'Radon', category: 'Noble gas', group: 18, period: 6 },
  { number: 87, symbol: 'Fr', name: 'Francium', category: 'Alkali metal', group: 1, period: 7 },
  { number: 88, symbol: 'Ra', name: 'Radium', category: 'Alkaline earth metal', group: 2, period: 7 },
  { number: 89, symbol: 'Ac', name: 'Actinium', category: 'Actinide', group: 3, period: 7 },
  { number: 90, symbol: 'Th', name: 'Thorium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 91, symbol: 'Pa', name: 'Protactinium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 92, symbol: 'U', name: 'Uranium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 93, symbol: 'Np', name: 'Neptunium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 94, symbol: 'Pu', name: 'Plutonium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 95, symbol: 'Am', name: 'Americium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 96, symbol: 'Cm', name: 'Curium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 97, symbol: 'Bk', name: 'Berkelium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 98, symbol: 'Cf', name: 'Californium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 99, symbol: 'Es', name: 'Einsteinium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 100, symbol: 'Fm', name: 'Fermium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 101, symbol: 'Md', name: 'Mendelevium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 102, symbol: 'No', name: 'Nobelium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 103, symbol: 'Lr', name: 'Lawrencium', category: 'Actinide', period: 7, series: 'actinide' },
  { number: 104, symbol: 'Rf', name: 'Rutherfordium', category: 'Transition metal', group: 4, period: 7 },
  { number: 105, symbol: 'Db', name: 'Dubnium', category: 'Transition metal', group: 5, period: 7 },
  { number: 106, symbol: 'Sg', name: 'Seaborgium', category: 'Transition metal', group: 6, period: 7 },
  { number: 107, symbol: 'Bh', name: 'Bohrium', category: 'Transition metal', group: 7, period: 7 },
  { number: 108, symbol: 'Hs', name: 'Hassium', category: 'Transition metal', group: 8, period: 7 },
  { number: 109, symbol: 'Mt', name: 'Meitnerium', category: 'Transition metal', group: 9, period: 7 },
  { number: 110, symbol: 'Ds', name: 'Darmstadtium', category: 'Transition metal', group: 10, period: 7 },
  { number: 111, symbol: 'Rg', name: 'Roentgenium', category: 'Transition metal', group: 11, period: 7 },
  { number: 112, symbol: 'Cn', name: 'Copernicium', category: 'Transition metal', group: 12, period: 7 },
  { number: 113, symbol: 'Nh', name: 'Nihonium', category: 'Post-transition metal', group: 13, period: 7 },
  { number: 114, symbol: 'Fl', name: 'Flerovium', category: 'Post-transition metal', group: 14, period: 7 },
  { number: 115, symbol: 'Mc', name: 'Moscovium', category: 'Post-transition metal', group: 15, period: 7 },
  { number: 116, symbol: 'Lv', name: 'Livermorium', category: 'Post-transition metal', group: 16, period: 7 },
  { number: 117, symbol: 'Ts', name: 'Tennessine', category: 'Halogen', group: 17, period: 7 },
  { number: 118, symbol: 'Og', name: 'Oganesson', category: 'Noble gas', group: 18, period: 7 },
];

const CATEGORY_CLASS = {
  'Alkali metal': 'elem-alkali',
  'Alkaline earth metal': 'elem-alkaline',
  'Transition metal': 'elem-transition',
  'Post-transition metal': 'elem-post',
  Metalloid: 'elem-metalloid',
  Nonmetal: 'elem-nonmetal',
  Halogen: 'elem-halogen',
  'Noble gas': 'elem-noble',
  Lanthanide: 'elem-lanth',
  Actinide: 'elem-act',
};

const CATEGORY_ORDER = [
  'Alkali metal',
  'Alkaline earth metal',
  'Transition metal',
  'Post-transition metal',
  'Metalloid',
  'Nonmetal',
  'Halogen',
  'Noble gas',
  'Lanthanide',
  'Actinide',
];

function normalizePathname(pathname) {
  if (!pathname) return '/';
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function normalizeTab(value) {
  if (TAB_KEYS.has(value)) return value;
  return 'vlab';
}

function getTabFromLocation() {
  if (typeof window === 'undefined') return 'vlab';
  const path = normalizePathname(window.location.pathname);
  const matched = Object.entries(TAB_ROUTES).find(([, route]) => route === path);
  if (matched) return matched[0];
  const params = new URLSearchParams(window.location.search);
  const paramTab = params.get('tab');
  if (paramTab && TAB_KEYS.has(paramTab)) return paramTab;
  const hashTab = (window.location.hash || '').replace(/^#\/?/, '');
  if (TAB_KEYS.has(hashTab)) return hashTab;
  return 'vlab';
}

function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

function ThreeHero() {
  const hostRef = React.useRef(null);
  const rafRef = React.useRef(0);

  React.useEffect(() => {
    let disposed = false;
    let renderer;
    let resizeObserver;

    (async () => {
      const THREE = await import('https://esm.sh/three@0.160.0');
      if (disposed) return;

      const host = hostRef.current;
      if (!host) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0.6, 3.2);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.setSize(host.clientWidth, host.clientHeight, false);
      host.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const key = new THREE.PointLight(0x22d3ee, 1.2, 0, 2);
      key.position.set(2.5, 2.0, 2.0);
      scene.add(key);
      const fill = new THREE.PointLight(0xa855f7, 0.9, 0, 2);
      fill.position.set(-2.2, 1.2, 1.6);
      scene.add(fill);

      const group = new THREE.Group();
      scene.add(group);

      const atom = (radius, color) => new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.05 }));

      const core = atom(0.34, 0x38bdf8);
      group.add(core);

      const orbiters = [
        { r: 0.16, c: 0xfacc15, p: [0.9, 0.1, 0.0] },
        { r: 0.14, c: 0xa855f7, p: [-0.7, 0.35, 0.2] },
        { r: 0.12, c: 0x22c55e, p: [0.1, -0.65, -0.15] },
        { r: 0.11, c: 0xf97316, p: [-0.05, 0.65, -0.35] },
      ].map((o) => {
        const m = atom(o.r, o.c);
        m.position.set(o.p[0], o.p[1], o.p[2]);
        group.add(m);
        return m;
      });

      const points = [core.position, ...orbiters.map((m) => m.position)];
      const lineMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.35 });
      for (let i = 1; i < points.length; i += 1) {
        const geo = new THREE.BufferGeometry().setFromPoints([points[0], points[i]]);
        group.add(new THREE.Line(geo, lineMat));
      }

      const animate = () => {
        if (disposed) return;
        group.rotation.y += 0.008;
        group.rotation.x = 0.22 + Math.sin(Date.now() * 0.001) * 0.06;
        renderer.render(scene, camera);
        rafRef.current = requestAnimationFrame(animate);
      };
      animate();

      const resize = () => {
        const w = Math.max(1, host.clientWidth);
        const h = Math.max(1, host.clientHeight);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();
    })().catch(() => {
      // ignore
    });

    return () => {
      disposed = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeObserver) resizeObserver.disconnect();
      if (renderer) {
        try {
          renderer.dispose();
        } catch {
          // ignore
        }
        try {
          renderer.domElement?.remove();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return html`<div ref=${hostRef} class="w-full h-[260px] rounded-xl border border-slate-800 bg-slate-950/30"></div>`;
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
  const [tab, setTab] = React.useState(() => getTabFromLocation());
  const [mode, setMode] = React.useState(() => (APP_TABS.has(getTabFromLocation()) ? 'app' : 'web'));
  const didInitRouteRef = React.useRef(false);

  const goTab = React.useCallback((nextTab) => {
    const normalized = normalizeTab(nextTab);
    setTab(normalized);
    if (typeof window === 'undefined') return;
    const current = normalizePathname(window.location.pathname);
    const target = TAB_ROUTES[normalized] || '/';
    if (current !== target) {
      window.history.pushState({ tab: normalized }, '', target);
    }
  }, []);

  const openApp = React.useCallback(
    (nextTab = 'lab') => {
      setMode('app');
      goTab(nextTab);
    },
    [goTab]
  );

  const openWebsite = React.useCallback(
    (nextTab = 'vlab') => {
      setMode('web');
      goTab(nextTab);
    },
    [goTab]
  );

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
  const [vessel, setVessel] = React.useState('beaker'); // beaker | tube
  const [labRunning, setLabRunning] = React.useState(false);
  const [labResult, setLabResult] = React.useState(null);
  const [labStage, setLabStage] = React.useState('idle'); // idle | mixing | reacting | done
  const [labProgress, setLabProgress] = React.useState(0); // 0..100
  const [labLog, setLabLog] = React.useState([]);
  const labTimersRef = React.useRef({ interval: null, timeouts: [] });

  function clearLabInterval() {
    if (labTimersRef.current.interval) {
      window.clearInterval(labTimersRef.current.interval);
      labTimersRef.current.interval = null;
    }
  }

  function clearLabTimers() {
    clearLabInterval();
    if (labTimersRef.current.timeouts.length) {
      labTimersRef.current.timeouts.forEach((t) => window.clearTimeout(t));
      labTimersRef.current.timeouts = [];
    }
  }

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
    if (typeof window === 'undefined') return;
    if (!didInitRouteRef.current) {
      const target = TAB_ROUTES[tab] || '/';
      const current = normalizePathname(window.location.pathname);
      if (current !== target) {
        window.history.replaceState({ tab }, '', target);
      }
      didInitRouteRef.current = true;
    }
  }, [tab]);

  React.useEffect(() => {
    if (APP_TABS.has(tab) && mode !== 'app') {
      setMode('app');
      return;
    }
    if (WEBSITE_TABS.has(tab) && mode !== 'web') {
      setMode('web');
    }
  }, [tab, mode]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePop = () => {
      setTab(getTabFromLocation());
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const suffix = TAB_TITLES[tab] || 'V-LAB';
    document.title = `V-LAB • ${suffix}`;
  }, [tab]);

  const loadBaseData = React.useCallback(() => {
    return Promise.all([
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
  }, [setFindings]);

  React.useEffect(() => {
    loadBaseData();
  }, [loadBaseData]);

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
    clearLabTimers();
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
    clearLabTimers();
    try {
      const payload = {
        chemicals: selectedChemicals.map((c) => c.name),
        type: labType.toLowerCase(),
        tools: selectedTools,
        heat: heatLevel,
        volume_ml: volumeMl,
        vessel,
      };

      setLabLog((prev) => [
        { id: uid('log'), at: new Date().toISOString(), type: 'run', message: `Run started (${labType}).` },
        ...prev,
      ]);

      // Local “sim” timeline: mix -> react -> settle, driven by backend measurements rate/temperature.
      const tick = () => {
        setLabProgress((p) => Math.min(100, p + 3));
      };
      labTimersRef.current.interval = window.setInterval(tick, 90);

      const data = await apiPost('/run-experiment', payload);
      setLabResult(data);

      // Adapt animation duration: faster if higher rate.
      const rate = typeof data?.measurements?.rate === 'number' ? data.measurements.rate : 0.2;
      const phaseMs = Math.max(650, Math.round(1600 - rate * 900));
      setLabStage('reacting');
      labTimersRef.current.timeouts.push(window.setTimeout(() => setLabStage('done'), phaseMs));
      labTimersRef.current.timeouts.push(window.setTimeout(() => setLabProgress(100), Math.max(400, Math.round(phaseMs * 0.85))));
      clearLabInterval();

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
        vessel,
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
      clearLabTimers();
    } finally {
      setLabRunning(false);
    }
  }

  React.useEffect(() => {
    if (tab !== 'lab') {
      clearLabTimers();
    }
    return () => clearLabTimers();
  }, [tab]);

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
          <div class="mt-3 flex flex-wrap gap-2">
            <button class="btn btn-danger" onClick=${loadBaseData} type="button">
              <i class="fa-solid fa-rotate"></i> Retry
            </button>
            <button class="btn" onClick=${() => openWebsite('about')} type="button">
              <i class="fa-solid fa-circle-info"></i> Setup Help
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function TopNav() {
    const items = [
      ['vlab', 'V-LAB'],
      ['home', 'Home'],
      ['about', 'About'],
    ];
    const appItems = [
      ['lab', 'Lab'],
      ['notebook', 'Notebook'],
      ['periodic', 'Periodic Table'],
      ['reactions', 'Reactions'],
      ['tools', 'Tools'],
    ];
    return html`
      <nav class="nav-shell sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="logo-mark"><i class="fa-solid fa-atom"></i></div>
            <div>
              <div class="text-xl sm:text-2xl font-extrabold tracking-tight">V-LAB</div>
              <div class="hidden sm:block text-xs text-slate-400">Virtual Science Lab</div>
            </div>
          </div>
          <div class="flex flex-wrap gap-3 items-center justify-end max-w-full">
            <div class="flex flex-wrap gap-2 items-center">
              <span class="text-[11px] text-slate-500 font-semibold tracking-widest uppercase">
                ${mode === 'app' ? 'Lab App' : 'Website'}
              </span>
              ${(mode === 'app' ? appItems : items).map(
                ([key, label]) => html`
                  <button
                    class=${classNames('nav-link', tab === key ? 'active' : '')}
                    onClick=${() => (mode === 'app' ? openApp(key) : openWebsite(key))}
                    type="button"
                  >
                    ${label}
                  </button>
                `
              )}
            </div>
            <div class="h-6 w-px bg-slate-800/80 hidden lg:block"></div>
            <div class="flex items-center gap-2">
              ${mode === 'app'
                ? html`
                    <button class="btn" onClick=${() => openWebsite('vlab')} type="button">
                      <i class="fa-solid fa-arrow-left"></i> Back to Website
                    </button>
                  `
                : html`
                    <button class="btn btn-solid" onClick=${() => openApp('lab')} type="button">
                      <i class="fa-solid fa-flask-vial"></i> Get Started
                    </button>
                  `}
            </div>
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
            <h1 class="text-2xl sm:text-3xl font-bold title-grad">Dashboard</h1>
            <div class="text-sm text-slate-400 mt-1">Clean, guided lab simulator for students.</div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div class="kpi p-4 sm:p-6">
            <div class="text-3xl sm:text-4xl mb-2">🧪</div>
            <div class="kpi-label">Reactions</div>
            <div class="kpi-value text-3xl mt-1 text-cyan-200">${stats ? stats.total_reactions : '—'}</div>
          </div>
          <div class="kpi p-4 sm:p-6">
            <div class="text-3xl sm:text-4xl mb-2">🔬</div>
            <div class="kpi-label">Tools</div>
            <div class="kpi-value text-3xl mt-1 text-purple-200">${stats ? stats.total_tools : '—'}</div>
          </div>
          <div class="kpi p-4 sm:p-6">
            <div class="text-3xl sm:text-4xl mb-2">📚</div>
            <div class="kpi-label">Categories</div>
            <div class="kpi-value text-3xl mt-1 text-emerald-200">${stats ? stats.categories : '—'}</div>
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
              class="btn btn-primary w-full mt-4"
              onClick=${() => openApp('lab')}
              type="button"
            >
              <i class="fa-solid fa-flask-vial"></i> Get Started
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

  function PeriodicTable() {
    const [query, setQuery] = React.useState('');
    const [activeElement, setActiveElement] = React.useState(ELEMENTS[0]);

    const lanthanides = React.useMemo(() => ELEMENTS.filter((e) => e.series === 'lanthanide'), []);
    const actinides = React.useMemo(() => ELEMENTS.filter((e) => e.series === 'actinide'), []);
    const lanthIndex = React.useMemo(() => new Map(lanthanides.map((e, i) => [e.number, i])), [lanthanides]);
    const actIndex = React.useMemo(() => new Map(actinides.map((e, i) => [e.number, i])), [actinides]);

    const filtered = React.useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return ELEMENTS;
      return ELEMENTS.filter((e) => {
        return (
          e.name.toLowerCase().includes(q) ||
          e.symbol.toLowerCase().includes(q) ||
          String(e.number).includes(q) ||
          (e.category || '').toLowerCase().includes(q)
        );
      });
    }, [query]);

    React.useEffect(() => {
      if (!activeElement) return;
      const stillThere = filtered.some((e) => e.number === activeElement.number);
      if (!stillThere) setActiveElement(filtered[0] || ELEMENTS[0]);
    }, [filtered, activeElement]);

    function elementMatches(e) {
      if (!query.trim()) return true;
      return filtered.some((x) => x.number === e.number);
    }

    function gridPosition(e) {
      if (e.series === 'lanthanide') {
        const idx = lanthIndex.get(e.number) ?? 0;
        return { row: 8, col: 3 + idx };
      }
      if (e.series === 'actinide') {
        const idx = actIndex.get(e.number) ?? 0;
        return { row: 9, col: 3 + idx };
      }
      return { row: e.period, col: e.group };
    }

    return html`
      <div class="max-w-full mx-auto px-3 sm:px-4 py-6 sm:py-8 section">
        <div class="flex items-end justify-between gap-4 flex-wrap mb-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold title-grad">Periodic Table</h1>
            <div class="text-sm text-slate-400 mt-1">All 118 elements with categories and quick detail view.</div>
          </div>
          <div class="min-w-[240px] w-full sm:w-auto">
            <input
              class="field"
              placeholder="Search by name, symbol, number, or category..."
              value=${query}
              onInput=${(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div class="panel p-3 sm:p-4 mb-4">
          <div class="flex flex-wrap gap-2 mb-3 text-[11px] text-slate-300">
            ${CATEGORY_ORDER.map(
              (c) => html`<span class=${classNames('status-pill', CATEGORY_CLASS[c] || 'elem-unknown')}>${c}</span>`
            )}
          </div>
          ${activeElement
            ? html`
                <div class="grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] gap-3 items-center">
                  <div class=${classNames('element-card', CATEGORY_CLASS[activeElement.category] || 'elem-unknown')}>
                    <div class="element-number">Atomic #${activeElement.number}</div>
                    <div class="element-symbol text-3xl">${activeElement.symbol}</div>
                    <div class="element-name text-base font-bold">${activeElement.name}</div>
                  </div>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-slate-300">
                    <div class="metric-card">
                      <div class="text-[11px] text-slate-400">Category</div>
                      <div class="font-semibold text-slate-100">${activeElement.category}</div>
                    </div>
                    <div class="metric-card">
                      <div class="text-[11px] text-slate-400">Group</div>
                      <div class="font-semibold text-slate-100">${activeElement.group ?? '—'}</div>
                    </div>
                    <div class="metric-card">
                      <div class="text-[11px] text-slate-400">Period</div>
                      <div class="font-semibold text-slate-100">${activeElement.period}</div>
                    </div>
                    <div class="metric-card">
                      <div class="text-[11px] text-slate-400">Series</div>
                      <div class="font-semibold text-slate-100">${activeElement.series || 'Main'}</div>
                    </div>
                  </div>
                </div>
              `
            : html`<div class="text-sm text-slate-500">Select an element to see details.</div>`}
        </div>

        <div class="panel p-3 sm:p-4">
          <div class="periodic-wrap">
            <div class="periodic-grid">
              ${ELEMENTS.map((e) => {
                const pos = gridPosition(e);
                const active = activeElement && activeElement.number === e.number;
                const matches = elementMatches(e);
                return html`
                  <button
                    class=${classNames(
                      'element-card',
                      CATEGORY_CLASS[e.category] || 'elem-unknown',
                      matches ? '' : 'dim',
                      active ? 'ring-2 ring-cyan-400/60' : ''
                    )}
                    style=${{ gridColumn: pos.col, gridRow: pos.row }}
                    onClick=${() => setActiveElement(e)}
                    type="button"
                    title=${`${e.name} (${e.symbol})`}
                  >
                    <div class="element-number">${e.number}</div>
                    <div class="element-symbol">${e.symbol}</div>
                    <div class="element-name">${e.name}</div>
                  </button>
                `;
              })}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function VLabWebsite() {
    return html`
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10 section">
        <div class="lab-surface rounded-2xl p-5 sm:p-8 overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div class="min-w-0">
              <div class="text-xs text-slate-300 tracking-widest uppercase">Virtual Science Lab</div>
              <h1 class="text-3xl sm:text-5xl font-extrabold mt-2 leading-tight title-grad">
                Learn Science by <span class="text-cyan-300">doing</span>.
              </h1>
              <p class="text-slate-300 mt-4 max-w-xl">
                Mix chemicals safely, control lab tools, observe results, and save notes — built for students and teachers.
              </p>

              <div class="mt-6 flex gap-3 flex-wrap">
                <button
                  class="btn btn-solid"
                  onClick=${() => openApp('lab')}
                  type="button"
                >
                  <i class="fa-solid fa-flask-vial"></i> Get Started
                </button>
                <button
                  class="btn"
                  onClick=${() => openWebsite('about')}
                  type="button"
                >
                  <i class="fa-solid fa-circle-info"></i> Learn More
                </button>
              </div>

              <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="panel p-4 min-w-0">
                  <div class="font-bold text-slate-100 flex items-center gap-2">
                    <i class="fa-solid fa-flask-vial text-cyan-200"></i> Real lab steps
                  </div>
                  <div class="text-sm text-slate-300 mt-1">
                    Drag reagents, use tools, run experiments, and observe.
                  </div>
                </div>
                <div class="panel p-4 min-w-0">
                  <div class="font-bold text-slate-100 flex items-center gap-2">
                    <i class="fa-solid fa-book text-emerald-200"></i> Notes included
                  </div>
                  <div class="text-sm text-slate-300 mt-1">
                    Results are saved automatically in the Notebook.
                  </div>
                </div>
              </div>
            </div>

            <div class="panel p-4 sm:p-6 overflow-hidden">
              <div class="flex items-center justify-between mb-3 min-w-0">
                <div class="font-bold text-slate-100 flex items-center gap-2 min-w-0">
                  <i class="fa-solid fa-cube text-purple-200"></i>
                  <span class="truncate">3D demo (Three.js)</span>
                </div>
                <div class="text-[11px] text-slate-400 shrink-0">auto-rotating</div>
              </div>
              <${ThreeHero} />
              <div class="text-[11px] text-slate-400 mt-3">
                The lab simulator works even if 3D is slow on older devices.
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div class="panel p-4">
            <div class="font-bold text-slate-100 flex items-center gap-2">
              <i class="fa-solid fa-route text-cyan-200"></i> Guided workflow
            </div>
            <div class="text-sm text-slate-300 mt-2">
              Step-by-step lab flow with clear status, so non-technical students feel confident.
            </div>
          </div>
          <div class="panel p-4">
            <div class="font-bold text-slate-100 flex items-center gap-2">
              <i class="fa-solid fa-gauge text-purple-200"></i> Instrument-grade controls
            </div>
            <div class="text-sm text-slate-300 mt-2">
              Measure temperature, control heat, and track reaction speed in real time.
            </div>
          </div>
          <div class="panel p-4">
            <div class="font-bold text-slate-100 flex items-center gap-2">
              <i class="fa-solid fa-shield-halved text-emerald-200"></i> Safety-first
            </div>
            <div class="text-sm text-slate-300 mt-2">
              Visual warnings and lab-safe outcomes for classroom use.
            </div>
          </div>
        </div>
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
    const controlsTouched = burnerOn || volumeMl !== 250;
    const steps = [
      { key: 'reagents', label: 'Reagents', done: selectedChemicals.length > 0 },
      { key: 'tools', label: 'Tools', done: selectedTools.length > 0 },
      { key: 'controls', label: 'Heat + Volume', done: controlsTouched },
      { key: 'run', label: 'Run', done: labStage !== 'idle' },
      { key: 'observe', label: 'Observe', done: labStage === 'done' && !!labResult },
    ];
    let activeStep = 'reagents';
    if (selectedChemicals.length > 0) activeStep = 'tools';
    if (selectedChemicals.length > 0 && selectedTools.length > 0) activeStep = 'controls';
    if (controlsTouched) activeStep = 'run';
    if (labStage === 'mixing' || labStage === 'reacting') activeStep = 'run';
    if (labStage === 'done') activeStep = 'observe';
    const stageTone = labStage === 'done' ? 'ok' : labStage === 'reacting' || labStage === 'mixing' ? 'warn' : '';
    const apiTone = apiError ? 'err' : 'ok';

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
            <h1 class="text-2xl sm:text-3xl font-bold title-grad">Chem Lab Bench</h1>
            <div class="text-sm text-slate-400 mt-1">1) Add chemicals → 2) Choose tools → 3) Set heat/volume → 4) Run → 5) Save notes.</div>
          </div>
          <div class="flex gap-2">
            <button
              class="btn"
              onClick=${clearLab}
              type="button"
            >
              <i class="fa-solid fa-eraser mr-2"></i>Clear
            </button>
            <button
              class=${classNames('btn btn-solid', labRunning ? 'opacity-70' : '')}
              disabled=${labRunning}
              onClick=${runExperiment}
              type="button"
            >
              <i class="fa-solid fa-play mr-2"></i>${labRunning ? 'Running...' : 'Run'}
            </button>
          </div>
        </div>

        <div class="status-strip mb-4 sm:mb-5">
          <div class="stepper">
            ${steps.map((step) => {
              const isActive = activeStep === step.key;
              return html`
                <div class=${classNames('step', step.done ? 'done' : '', isActive ? 'active' : '')}>
                  <span class="dot"></span>${step.label}
                </div>
              `;
            })}
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <div class="status-pill">
              <span class=${classNames('status-dot', apiTone)}></span> API ${apiError ? 'Offline' : 'Online'}
            </div>
            <div class="status-pill">
              <span class=${classNames('status-dot', stageTone)}></span> Stage ${labStage}
            </div>
            <div class="status-pill">
              <span class="status-dot"></span> Reagents ${selectedChemicals.length}
            </div>
            <div class="status-pill">
              <span class="status-dot"></span> Tools ${selectedTools.length}
            </div>
            <div class="status-pill">
              <span class="status-dot"></span> Vessel ${vessel === 'beaker' ? 'Beaker' : 'Test tube'}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div class="lg:col-span-2 space-y-4 sm:space-y-6">
            <div class="lab-surface rounded-2xl p-4 sm:p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-1 panel">
                  <div class="panel-hd">
                    <div class="title text-xs">
                      <i class="fa-solid fa-warehouse"></i> Chemical Storage
                    </div>
                    <div class="chip">Drag → Beaker</div>
                  </div>
                  <div class="panel-bd">
                    <div class="flex gap-2 mb-2">
                      <select
                        class="field"
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
                      class="field"
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
                              <span class="text-xs mono text-slate-300 truncate max-w-[80px]">${c.symbol}</span>
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
                </div>

                <div class="md:col-span-2 space-y-4">
                  <div class="panel">
                    <div class="panel-hd">
                      <div class="title text-xs">
                        <i class="fa-solid fa-table"></i> Lab Table
                      </div>
                      <div class="flex items-center gap-2 flex-wrap justify-end min-w-0">
                        <div class="text-[11px] text-slate-400">
                          Step: <span class="mono">${labStage}</span> · Volume: <span class="mono">${volumeMl} mL</span>
                        </div>
                        <div class="flex items-center gap-1 bg-slate-900/50 border border-slate-800 rounded-xl p-1">
                          <button
                            class=${classNames('chip', vessel === 'beaker' ? 'on' : '')}
                            onClick=${() => {
                              setVessel('beaker');
                              setLabLog((p) => [{ id: uid('log'), at: new Date().toISOString(), type: 'vessel', message: 'Switched to beaker.' }, ...p]);
                            }}
                            type="button"
                          >
                            <i class="fa-solid fa-flask-vial"></i> Beaker
                          </button>
                          <button
                            class=${classNames('chip', vessel === 'tube' ? 'on' : '')}
                            onClick=${() => {
                              setVessel('tube');
                              setLabLog((p) => [{ id: uid('log'), at: new Date().toISOString(), type: 'vessel', message: 'Switched to test tube.' }, ...p]);
                            }}
                            type="button"
                          >
                            <i class="fa-solid fa-vial"></i> Test tube
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="panel-bd">
                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div class="relative bg-slate-950/35 border border-slate-800 rounded-xl p-4 beaker-glow">
                        <div class="text-xs text-slate-400 mb-2 flex items-center justify-between min-w-0">
                          <span class="truncate"><i class="fa-solid fa-flask-vial mr-2"></i>${vessel === 'beaker' ? 'Beaker' : 'Test tube'}</span>
                          <span class="font-mono shrink-0">${selectedChemicals.length} reagents</span>
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

                            ${vessel === 'beaker'
                              ? html`
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
                                    ${Array.from({ length: 6 }).map((_, i) => {
                                      const y = 70 + i * 26;
                                      return html`<line x1="155" y1="${y}" x2="170" y2="${y}" stroke="rgba(148,163,184,0.25)" stroke-width="2" />`;
                                    })}
                                  </svg>
                                `
                              : html`
                                  <svg class="absolute inset-0" viewBox="0 0 200 260" preserveAspectRatio="none" aria-hidden="true">
                                    <defs>
                                      <linearGradient id="tubeGrad" x1="0" x2="1">
                                        <stop offset="0" stop-color="rgba(255,255,255,0.08)"></stop>
                                        <stop offset="0.55" stop-color="rgba(255,255,255,0.02)"></stop>
                                        <stop offset="1" stop-color="rgba(255,255,255,0.07)"></stop>
                                      </linearGradient>
                                    </defs>
                                    <path
                                      d="M70,18 h60 a14,14 0 0 1 14,14 v160 a44,44 0 0 1 -44,44 h0 a44,44 0 0 1 -44,-44 v-160 a14,14 0 0 1 14,-14 z"
                                      fill="url(#tubeGrad)"
                                      stroke="rgba(148,163,184,0.35)"
                                      stroke-width="2"
                                    />
                                    <rect x="64" y="10" width="72" height="18" rx="8" fill="rgba(148,163,184,0.14)" stroke="rgba(148,163,184,0.25)" />
                                    ${Array.from({ length: 6 }).map((_, i) => {
                                      const y = 70 + i * 26;
                                      return html`<line x1="125" y1="${y}" x2="140" y2="${y}" stroke="rgba(148,163,184,0.25)" stroke-width="2" />`;
                                    })}
                                  </svg>
                                `}
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

                        ${vessel === 'beaker'
                          ? html`
                              <div class="mt-4 flex items-center justify-between gap-3 min-w-0">
                                <div class="text-xs text-slate-400 truncate"><i class="fa-solid fa-vial mr-2"></i>Test tube (preview)</div>
                                <div class=${classNames('relative w-[110px] h-[46px] rounded-full tube overflow-hidden shrink-0', labStage === 'mixing' ? 'shake' : '')}>
                                  <div class="absolute left-2 top-1 bottom-1 w-9 rounded-full tube-cap"></div>
                                  <div class="absolute inset-0" style=${{ background: `linear-gradient(90deg, rgba(255,255,255,0.06), transparent)` }}></div>
                                  <div class="absolute left-10 right-2 bottom-1 rounded-full" style=${{
                                    height: '60%',
                                    background: showLayers ? 'linear-gradient(90deg, rgba(59,130,246,0.22), rgba(250,204,21,0.22))' : liquidColor(),
                                    borderTop: '1px solid rgba(255,255,255,0.10)',
                                  }}></div>
                                </div>
                              </div>
                            `
                          : html`
                              <div class="mt-4 flex items-center justify-between gap-3 min-w-0">
                                <div class="text-xs text-slate-400 truncate"><i class="fa-solid fa-flask-vial mr-2"></i>Beaker (preview)</div>
                                <div class="relative w-[110px] h-[46px] rounded-xl border border-slate-800 bg-slate-950/30 overflow-hidden shrink-0">
                                  <div class="absolute inset-0" style=${{ background: `linear-gradient(90deg, rgba(255,255,255,0.06), transparent)` }}></div>
                                  <div class="absolute left-0 right-0 bottom-0" style=${{ height: '68%', background: liquidColor(), borderTop: '1px solid rgba(255,255,255,0.10)' }}></div>
                                </div>
                              </div>
                            `}
                      </div>

                      <div class="space-y-3">
                        <div class="panel">
                          <div class="panel-hd">
                            <div class="title text-xs">
                              <i class="fa-solid fa-sliders"></i> Controls
                            </div>
                            <div class="text-[11px] text-slate-400 font-mono">${labProgress}%</div>
                          </div>
                          <div class="panel-bd">

                          <div class="w-full bg-slate-900/70 border border-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              class="h-2 rounded-full bg-gradient-to-r from-cyan-400/70 to-purple-500/70 transition-all duration-200"
                              style=${{ width: `${labProgress}%` }}
                            ></div>
                          </div>

                          <div class="mt-3 grid grid-cols-2 gap-2">
                            <div class="metric-card">
                              <div class="text-[11px] text-slate-400"><i class="fa-solid fa-temperature-three-quarters mr-2"></i>Temp (°C)</div>
                              <div class="text-lg font-extrabold">
                                ${labResult?.measurements?.temperature_c != null ? labResult.measurements.temperature_c : '—'}
                              </div>
                            </div>
                            <div class="metric-card">
                              <div class="text-[11px] text-slate-400"><i class="fa-solid fa-gauge-high mr-2"></i>Reaction speed</div>
                              <div class="text-lg font-extrabold">
                                ${labResult?.measurements?.rate != null ? labResult.measurements.rate : '—'}
                              </div>
                            </div>
                            <div class="metric-card">
                              <div class="text-[11px] text-slate-400"><i class="fa-solid fa-vial mr-2"></i>pH</div>
                              <div class="text-lg font-extrabold">
                                ${labResult?.measurements?.ph != null ? labResult.measurements.ph : '—'}
                              </div>
                            </div>
                            <div class="metric-card">
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
                        </div>

                        <div class="panel">
                          <div class="panel-hd">
                            <div class="title text-xs">
                              <i class="fa-solid fa-screwdriver-wrench"></i> Tools rack
                            </div>
                            <div class="text-[11px] text-slate-400">${selectedTools.length} active</div>
                          </div>
                          <div class="panel-bd">
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              ${LAB_TOOLS.map((t) => {
                                const active = selectedTools.includes(t.name);
                                return html`
                                  <button
                                    class=${classNames(
                                      'tool-card rounded-lg px-3 py-2 border text-left text-xs transition group',
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
            </div>
          </div>

          <div class="space-y-4 sm:space-y-6">
            <div class="panel p-4 sm:p-6">
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
                        class="btn btn-primary w-full"
                        onClick=${() => goTab('notebook')}
                        type="button"
                      >
                        <i class="fa-solid fa-book"></i> View in Notebook
                      </button>
                    </div>
                  `
                : html`<div class="text-sm text-slate-500">Run an experiment to see observations here.</div>`}
            </div>

            <div class="panel p-4 sm:p-6">
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
            <button class="btn" onClick=${exportJson} type="button">
              <i class="fa-solid fa-download"></i> Export JSON
            </button>
            <button class="btn btn-primary" onClick=${createBlank} type="button">
              <i class="fa-solid fa-plus"></i> New
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div class="panel p-3 sm:p-4">
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

          <div class="lg:col-span-2 panel p-4 sm:p-6">
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
                      <button class="btn btn-danger" onClick=${deleteActive} type="button">
                        <i class="fa-solid fa-trash"></i> Delete
                      </button>
                      <button class="btn btn-primary" onClick=${saveEdits} type="button">
                        <i class="fa-solid fa-floppy-disk"></i> Save
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
    ${tab === 'vlab' ? html`<${VLabWebsite} />` : null}
    ${tab === 'home' ? html`<${Home} />` : null}
    ${tab === 'reactions' ? html`<${Reactions} />` : null}
    ${tab === 'tools' ? html`<${Tools} />` : null}
    ${tab === 'periodic' ? html`<${PeriodicTable} />` : null}
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
