# Virtual Science Lab - Getting Started Guide

## 🎯 What You Have

A complete, functional virtual chemistry lab with:
- 22 chemical reactions
- 30+ chemistry tools
- Interactive web interface
- Python REST API backend

---

## ⚡ Quick Start (2 Steps)

### Step 1: Install Backend
```bash
cd /home/aime/V-LAB/backend
pip install -r requirements.txt
python app.py
```
✅ Backend running on http://localhost:5000

### Step 2: Start Frontend  
```bash
cd /home/aime/V-LAB/frontend
python -m http.server 8000
```
✅ Open http://localhost:8000 in your browser

---

## 🧪 What to Try

### 1. Explore Reactions
1. Click "Reactions" in the navigation
2. Search for "combustion" or any reaction
3. Filter by category (Combustion, Synthesis, etc.)
4. Click a reaction card to see details

### 2. Use Calculators
1. Click "Tools" in navigation
2. Scroll to "Calculators" section
3. Try:
   - Molecular Weight Calculator (enter "H2O")
   - Molarity Calculator (moles: 1, volume: 2)
   - pH Calculator (H+ concentration: 0.001)
   - Stoichiometry Solver

### 3. Check Statistics
Home page shows:
- Total reactions (22)
- Total tools (30)
- Categories breakdown
- Exothermic vs Endothermic

### 4. Read About
Click "About" to see all features and technology details

---

## 📊 Available Reactions

Search for any of these:
- Methane combustion
- Iron rusting
- Photosynthesis
- Water electrolysis
- Acid-base neutralization
- Ammonia synthesis (Haber)
- Hydrogen combustion
- Limestone decomposition
- Iron-copper displacement
- Ethanol combustion
- Ethylene polymerization
- Fermentation
- Aspirin synthesis
- Esterification
- Acetylene formation
- Cellular respiration
- Silver mirror test
- Thermite reaction
- Iodine clock
- Lead iodide precipitation

---

## 🔧 Key Features to Explore

### Search & Filter
- Search bar finds reactions by name, equation, or category
- Dropdown filters by category
- Results update in real-time

### Reaction Details
- Chemical equation
- Reactants and products
- Reaction category and type
- Energy release/absorption
- Color changes
- Safety hazards

### Calculators
- **Molecular Weight** - Input formula like "NaCl", "CaCO3"
- **Molarity** - Calculate M = n/V
- **pH** - Convert concentration to pH value
- **Stoichiometry** - Solve mole ratios

### Tools Listed
- Periodic table
- Nomenclature tool
- Equation balancer
- VSEPR predictor
- Lewis structures
- Electron configurations
- Oxidation states
- Kinetics simulator
- Titration simulator
- And 21 more...

---

## 🎨 User Interface Guide

### Navigation Bar
- **Home** - Dashboard with statistics
- **Reactions** - Browse all reactions
- **Tools** - Access calculators and tools
- **About** - Feature overview

### Home Dashboard
Shows:
- 3 stat cards (Reactions, Tools, Categories)
- Lab overview with statistics
- Quick links to other sections

### Reactions Section
- Search input for quick finding
- Category dropdown filter
- Grid of reaction cards
- Click card for full details

### Tools Section
- Tool category filter
- Tool cards grid
- Calculator section with 6 active calculators
- Each calculator has input fields and instant results

### Modals (Popups)
- Click any reaction card → see full details
- Click any calculator → input values and calculate
- Close with X button or click outside

---

## 💡 Example Workflows

### Example 1: Learn About Exothermic Reactions
1. Go to Reactions
2. Filter by "Exothermic"
3. Click on "Combustion of Methane"
4. Read equation and details
5. Note the energy release: 890 kJ/mol

### Example 2: Calculate Molarity
1. Go to Tools
2. Click "Molarity Calculator" in Calculators section
3. Enter: Moles = 0.5, Volume = 1.0 L
4. Get result: 0.5 M

### Example 3: Find Reactions by Type
1. Go to Reactions
2. Use category dropdown
3. Select "Synthesis"
4. Browse synthesis reactions (Haber, polymerization, aspirin, etc.)

### Example 4: Search for Specific Reaction
1. Go to Reactions
2. Type in search: "photosynthesis"
3. See only photosynthesis reaction
4. Click to learn about light-driven reactions

---

## 🔌 API Usage (Advanced)

If you want to use the backend API directly:

### Get All Reactions
```bash
curl http://localhost:5000/api/reactions
```

### Get Combustion Reactions
```bash
curl "http://localhost:5000/api/reactions?category=Combustion"
```

### Calculate Molecular Weight
```bash
curl -X POST http://localhost:5000/api/calculate/molecular-weight \
  -H "Content-Type: application/json" \
  -d '{"formula": "H2SO4"}'
```

### Calculate Molarity
```bash
curl -X POST http://localhost:5000/api/calculate/molarity \
  -H "Content-Type: application/json" \
  -d '{"moles": 2, "volume": 0.5}'
```

### Calculate pH
```bash
curl -X POST http://localhost:5000/api/calculate/ph \
  -H "Content-Type: application/json" \
  -d '{"h_concentration": 0.01}'
```

### Search Reactions
```bash
curl "http://localhost:5000/api/search?q=combustion"
```

### Get Statistics
```bash
curl http://localhost:5000/api/stats
```

---

## 🛠️ Troubleshooting

### "Cannot connect to localhost:5000"
- Make sure backend is running: `python app.py` in backend folder
- Check port 5000 is not in use by another program
- Try: `netstat -tlnp | grep 5000` (Linux/Mac)

### Calculators not responding
- Check browser console (F12) for errors
- Make sure backend API is running
- Refresh the page (Ctrl+R)
- Try a different calculator

### CORS error in console
- Backend has CORS enabled
- Make sure frontend runs on different port (8000)
- Don't open frontend from file:// protocol

### Page loads but no reactions showing
- Wait a moment for API to respond
- Check backend logs for errors
- Try refreshing the page
- Check browser console (F12)

---

## 📱 Mobile Access

The lab is fully responsive:
- Access from tablet or phone
- Touch-friendly buttons
- Readable on all screen sizes
- Same features as desktop

To access from another device on same network:
1. Get your computer's IP: `ipconfig` (Windows) or `ifconfig` (Linux)
2. Open: `http://<your-ip>:8000` on mobile device
3. Backend must still run locally on :5000

---

## 🎓 Educational Uses

### For Teachers
- Show reactions in interactive way
- Demonstrate calculators
- Explore molecular structures
- Quiz students on reaction types

### For Students
- Learn reaction mechanisms
- Practice calculations
- Explore chemical properties
- Study at your own pace

### For Chemistry Clubs
- Demonstrations
- Competitions (who calculates fastest?)
- Research tool
- Reference material

---

## 🚀 Next Steps

1. **Explore everything** - Try all reactions and tools
2. **Try calculations** - Practice with sample data
3. **Read safety info** - Learn hazards
4. **Customize** - Add your own reactions to the database
5. **Deploy** - Share on a server

---

## 📚 File Locations

- **Backend code**: `/home/aime/V-LAB/backend/app.py`
- **Frontend HTML**: `/home/aime/V-LAB/frontend/index.html`
- **Frontend JS**: `/home/aime/V-LAB/frontend/app.js`
- **Documentation**: `/home/aime/V-LAB/README.md`
- **Requirements**: `/home/aime/V-LAB/backend/requirements.txt`

---

## 💾 Customization

### Add a Reaction
Edit `backend/app.py`, find `REACTIONS = {`, add:
```python
"my_reaction": {
    "id": "my_reaction",
    "name": "My Custom Reaction",
    "equation": "A + B → C",
    "category": "Custom",
    "description": "My description",
    # ... other fields (copy from existing reaction)
}
```
Restart backend with Ctrl+C and `python app.py`

### Change UI Colors
Edit `frontend/index.html` - look for Tailwind classes like:
- `from-cyan-900` - start gradient color
- `to-blue-900` - end gradient color
- `text-cyan-400` - text color
- Change to other Tailwind colors

### Add a Calculator
Edit `backend/app.py`:
1. Add route in Flask (e.g., `/api/calculate/my-calc`)
2. Edit `frontend/app.js` in `showToolModal()` function
3. Add input and button HTML
4. Add JavaScript function to call the API

---

## ✅ You're All Set!

Everything is ready to use. Just run the two commands and explore!

Questions? Check the README.md for more details.

**Enjoy exploring chemistry! 🧪🔬**
