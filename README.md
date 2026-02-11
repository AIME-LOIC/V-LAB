# Virtual Science Lab - Chemistry Explorer 🧪

A comprehensive, interactive chemistry education platform featuring 20+ chemical reactions, 30+ tools and calculators, real-time simulations, and interactive visualizations.

## Features

### 🧪 Chemical Reactions (20+)
- Comprehensive database of common and complex chemical reactions
- Detailed information including equations, products, reactants, energy data
- Categorized by reaction type (Combustion, Synthesis, Decomposition, Redox, etc.)
- Safety hazard information for each reaction

### 🔬 Tools & Calculators (30+)
Complete suite of chemistry tools including molecular weight calculators, molarity solvers, pH calculators, stoichiometry problem solvers, titration simulators, and more.

## Tech Stack

- **Backend:** Python Flask with Flask-CORS
- **Frontend:** HTML5, Vanilla JavaScript, Tailwind CSS
- **Data:** JSON-based API
- **Styling:** Modern gradient UI with dark theme

## Quick Start

### Backend (Python)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Server runs on: http://localhost:5000

### Frontend
```bash
cd frontend
python -m http.server 8000
```
Open: http://localhost:8000

### React Frontend (Pro UI, runs with `npm run dev`)
This repo includes a React UI that intentionally avoids native build tools (to prevent `esbuild`/Vite install issues on some systems). It still runs via `npm run dev` using a tiny Node dev server + `/api` proxy.

```bash
cd frontend-react
npm run dev
```
Open: http://localhost:5173

React UI includes:
- Lab: mix chemicals and run experiments (auto-observations)
- Notebook: auto-saved findings + edit/delete/export

## Project Structure

```
V-LAB/
├── backend/
│   ├── app.py              # Flask API with 20+ reactions & 30+ tools
│   └── requirements.txt     # Flask, Flask-CORS
├── frontend/
│   ├── index.html          # Interactive UI with Tailwind CSS
│   └── app.js              # JavaScript with Axios API calls
├── frontend-react/
│   ├── index.html          # React UI (served as static files)
│   └── src/main.js         # React app entry (CDN imports)
└── README.md
```

## Features Included

✅ 22 Chemical Reactions (with equations, properties, safety info)
✅ 30+ Tools & Calculators
✅ Molecular Weight Calculator
✅ Molarity Calculator
✅ pH/pOH Calculator
✅ Stoichiometry Solver
✅ Titration Simulator
✅ 3D Molecular Visualizer
✅ Interactive Periodic Table
✅ Chemical Equation Balancer
✅ VSEPR Geometry Predictor
✅ Real-time Search & Filtering
✅ Responsive Mobile Design
✅ Dark Theme UI

## API Endpoints

- `GET /api/reactions` - All reactions
- `GET /api/tools` - All tools
- `POST /api/calculate/molecular-weight` - MW calculator
- `POST /api/calculate/molarity` - Molarity solver
- `POST /api/calculate/ph` - pH calculator
- `POST /api/calculate/stoichiometry` - Stoichiometry solver
- `GET /api/stats` - Lab statistics
- `GET /api/search` - Search reactions

## Reactions Database (22+)

1. Combustion of Methane - CH₄ + 2O₂ → CO₂ + 2H₂O
2. Rusting of Iron - 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃
3. Photosynthesis - 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂
4. Electrolysis of Water - 2H₂O + electrical energy → 2H₂ + O₂
5. Acid-Base Neutralization - HCl + NaOH → NaCl + H₂O
6. Haber Process - N₂ + 3H₂ ⇌ 2NH₃
7. Combustion of Hydrogen - 2H₂ + O₂ → 2H₂O
8. Thermal Decomposition of Limestone - CaCO₃ → CaO + CO₂
9. Displacement (Iron & Copper) - Fe + CuSO₄ → FeSO₄ + Cu
10. Combustion of Ethanol - C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O
11. Polymerization - n(C₂H₄) → (C₂H₄)ₙ
12. Fermentation - C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂
13. Methyl Orange Synthesis
14. Titration (Vinegar Analysis) - CH₃COOH + NaOH → CH₃COONa + H₂O
15. Aspirin Synthesis
16. Esterification - CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O
17. Calcium Carbide & Water - CaC₂ + 2H₂O → Ca(OH)₂ + C₂H₂
18. Cellular Respiration - C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP
19. Silver Mirror Test - RCHO + 2[Ag(NH₃)₂]⁺ + 3OH⁻ → RCOONH₄ + 2Ag
20. Thermite Reaction - 2Al + Fe₂O₃ → 2Fe + Al₂O₃
21. Iodine Clock Reaction - H₂O₂ + 2I⁻ + 2H⁺ ⇌ I₂ + 2H₂O
22. Lead Iodide Precipitation - Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃

## Tools & Features (30+)

### Calculators
1. Molecular Weight Calculator
2. Molarity Calculator
3. pH and pOH Calculator
4. Stoichiometry Solver
5. Percent Composition
6. Empirical Formula Finder
7. Gas Law Calculator
8. Buffer Solution Solver
9. Thermal Properties Calculator
10. Isotope Calculator

### Analysis Tools
11. Oxidation State Finder
12. Chemical Equation Balancer
13. Reaction Type Predictor
14. Solubility Predictor
15. Bonding Analyzer
16. Redox Analyzer

### Visualization & Simulation
17. 3D Molecular Visualizer
18. Lewis Structure Generator
19. VSEPR Predictor
20. Phase Diagram Viewer
21. Spectroscopy Simulator
22. Titration Simulator
23. Kinetics Simulator
24. Virtual Lab Experiments

### Learning Resources
25. Interactive Periodic Table
26. Electron Configuration Tool
27. Chemical Nomenclature Tool
28. Reaction Energy Calculator
29. Chemistry Quiz Generator
30. Reaction Explorer

## Installation & Usage

### Step 1: Clone/Download
```bash
cd V-LAB
```

### Step 2: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Start Backend
```bash
python app.py
```
✅ Backend running on port 5000

### Step 4: Start Frontend
```bash
cd ../frontend
python -m http.server 8000
```
✅ Frontend running on port 8000

### Step 5: Open in Browser
Navigate to: **http://localhost:8000**

## Features Overview

### Home Dashboard
- Lab statistics (total reactions, tools)
- Exothermic vs Endothermic counts
- Quick links to all sections

### Reactions Browser
- Search all 22+ reactions
- Filter by category (Combustion, Synthesis, etc.)
- View detailed reaction information
- Equation, properties, hazards, energy data

### Tools & Calculators
- Molecular Weight Calculator
- Molarity & Concentration Calculator
- pH/pOH Calculator
- Stoichiometry Problem Solver
- All calculators with instant results

### About Section
- Feature overview
- Technology stack details
- Learning resources

## Browser Requirements

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Customization

### Add New Reactions
Edit `backend/app.py` and add to `REACTIONS` dictionary

### Add New Tools
Edit `backend/app.py` and add to `TOOLS` list

### Styling
Tailwind CSS is loaded via CDN - customize in `frontend/index.html`

## Performance

- API responses: <100ms
- Smooth animations
- Responsive design
- Optimized for desktop & tablet

## Troubleshooting

**Connection refused error:**
- Ensure Flask server is running: `python app.py` in backend folder
- Check port 5000 is available

**CORS errors:**
- Backend has Flask-CORS enabled
- Frontend and backend must run on different ports

**Calculators not showing results:**
- Check browser console (F12) for errors
- Ensure all required values are entered
- Refresh the page

## Future Enhancements

- Database persistence
- User accounts
- Advanced 3D visualization
- Collaborative sessions
- Mobile apps
- AR molecular structures
- Quantum mechanics simulations

## License

Open source - MIT License

---

**Virtual Science Lab** - Making Chemistry Interactive & Fun! 🧬⚗️
