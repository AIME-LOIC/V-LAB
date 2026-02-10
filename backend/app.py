from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Chemical Reactions Database (20+ reactions)
REACTIONS = {
    "combustion_methane": {
        "id": "combustion_methane",
        "name": "Combustion of Methane",
        "equation": "CH₄ + 2O₂ → CO₂ + 2H₂O",
        "category": "Combustion",
        "description": "Methane burns in oxygen to produce carbon dioxide and water",
        "reactants": [{"name": "Methane", "symbol": "CH₄", "amount": "1"}],
        "products": [{"name": "Carbon Dioxide", "symbol": "CO₂", "amount": "1"}, {"name": "Water", "symbol": "H₂O", "amount": "2"}],
        "type": "Exothermic",
        "energyRelease": 890,
        "color": "blue to yellow flame",
        "hazard": "Highly flammable"
    },
    "rusting_iron": {
        "id": "rusting_iron",
        "name": "Rusting of Iron",
        "equation": "4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃",
        "category": "Oxidation-Reduction",
        "description": "Iron oxidizes when exposed to oxygen and water",
        "reactants": [{"name": "Iron", "symbol": "Fe", "amount": "4"}],
        "products": [{"name": "Iron(III) Hydroxide", "symbol": "Fe(OH)₃", "amount": "4"}],
        "type": "Exothermic",
        "energyRelease": 150,
        "color": "Orange-brown precipitate",
        "hazard": "Non-toxic but can be slippery"
    },
    "photosynthesis": {
        "id": "photosynthesis",
        "name": "Photosynthesis",
        "equation": "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
        "category": "Biochemical",
        "description": "Plants convert light energy into chemical energy",
        "reactants": [{"name": "Carbon Dioxide", "symbol": "CO₂", "amount": "6"}],
        "products": [{"name": "Glucose", "symbol": "C₆H₁₂O₆", "amount": "1"}],
        "type": "Endothermic",
        "energyRelease": -2800,
        "color": "No visible change",
        "hazard": "Safe"
    },
    "decomposition_water": {
        "id": "decomposition_water",
        "name": "Electrolysis of Water",
        "equation": "2H₂O + electrical energy → 2H₂ + O₂",
        "category": "Decomposition",
        "description": "Water decomposes into hydrogen and oxygen under electrical current",
        "reactants": [{"name": "Water", "symbol": "H₂O", "amount": "2"}],
        "products": [{"name": "Hydrogen Gas", "symbol": "H₂", "amount": "2"}, {"name": "Oxygen Gas", "symbol": "O₂", "amount": "1"}],
        "type": "Endothermic",
        "energyRelease": -286,
        "color": "Bubbles at electrodes",
        "hazard": "Explosive mixture"
    },
    "neutralization": {
        "id": "neutralization",
        "name": "Acid-Base Neutralization",
        "equation": "HCl + NaOH → NaCl + H₂O",
        "category": "Acid-Base",
        "description": "Hydrochloric acid reacts with sodium hydroxide to form salt and water",
        "reactants": [{"name": "Hydrochloric Acid", "symbol": "HCl", "amount": "1"}],
        "products": [{"name": "Sodium Chloride", "symbol": "NaCl", "amount": "1"}],
        "type": "Exothermic",
        "energyRelease": 57.3,
        "color": "Heat released",
        "hazard": "Corrosive acids and bases"
    },
    "synthesis_ammonia": {
        "id": "synthesis_ammonia",
        "name": "Haber Process - Ammonia Synthesis",
        "equation": "N₂ + 3H₂ ⇌ 2NH₃",
        "category": "Synthesis",
        "description": "Nitrogen and hydrogen form ammonia under high pressure and temperature",
        "reactants": [{"name": "Nitrogen", "symbol": "N₂", "amount": "1"}],
        "products": [{"name": "Ammonia", "symbol": "NH₃", "amount": "2"}],
        "type": "Exothermic",
        "energyRelease": 92,
        "color": "Colorless gas",
        "hazard": "Toxic gas, pungent odor"
    },
    "combustion_hydrogen": {
        "id": "combustion_hydrogen",
        "name": "Combustion of Hydrogen",
        "equation": "2H₂ + O₂ → 2H₂O",
        "category": "Combustion",
        "description": "Hydrogen burns in oxygen producing water",
        "reactants": [{"name": "Hydrogen Gas", "symbol": "H₂", "amount": "2"}],
        "products": [{"name": "Water", "symbol": "H₂O", "amount": "2"}],
        "type": "Exothermic",
        "energyRelease": 286,
        "color": "Blue flame with pale yellow border",
        "hazard": "Highly explosive"
    },
    "thermal_decomposition_limestone": {
        "id": "thermal_decomposition_limestone",
        "name": "Thermal Decomposition of Limestone",
        "equation": "CaCO₃ → CaO + CO₂",
        "category": "Decomposition",
        "description": "Calcium carbonate decomposes when heated to produce quicklime",
        "reactants": [{"name": "Calcium Carbonate", "symbol": "CaCO₃", "amount": "1"}],
        "products": [{"name": "Calcium Oxide", "symbol": "CaO", "amount": "1"}],
        "type": "Endothermic",
        "energyRelease": -178,
        "color": "White to black",
        "hazard": "Requires high heat"
    },
    "redox_copper_iron": {
        "id": "redox_copper_iron",
        "name": "Displacement - Iron and Copper",
        "equation": "Fe + CuSO₄ → FeSO₄ + Cu",
        "category": "Oxidation-Reduction",
        "description": "Iron displaces copper from copper sulfate solution",
        "reactants": [{"name": "Iron", "symbol": "Fe", "amount": "1"}],
        "products": [{"name": "Copper", "symbol": "Cu", "amount": "1"}],
        "type": "Exothermic",
        "energyRelease": 67,
        "color": "Blue solution becomes pale green/yellow",
        "hazard": "Mild corrosive"
    },
    "combustion_ethanol": {
        "id": "combustion_ethanol",
        "name": "Combustion of Ethanol",
        "equation": "C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O",
        "category": "Combustion",
        "description": "Ethanol burns to produce carbon dioxide and water",
        "reactants": [{"name": "Ethanol", "symbol": "C₂H₅OH", "amount": "1"}],
        "products": [{"name": "Carbon Dioxide", "symbol": "CO₂", "amount": "2"}],
        "type": "Exothermic",
        "energyRelease": 1367,
        "color": "Blue flame",
        "hazard": "Flammable liquid"
    },
    "polymerization": {
        "id": "polymerization",
        "name": "Polymerization of Ethylene",
        "equation": "n(C₂H₄) → (C₂H₄)ₙ",
        "category": "Polymerization",
        "description": "Ethylene monomers join to form polyethylene polymer",
        "reactants": [{"name": "Ethylene", "symbol": "C₂H₄", "amount": "n"}],
        "products": [{"name": "Polyethylene", "symbol": "(C₂H₄)ₙ", "amount": "1"}],
        "type": "Exothermic",
        "energyRelease": 101,
        "color": "Colorless to white solid",
        "hazard": "Non-toxic but flammable when hot"
    },
    "fermentation": {
        "id": "fermentation",
        "name": "Alcoholic Fermentation",
        "equation": "C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂",
        "category": "Biochemical",
        "description": "Glucose ferments to produce ethanol and carbon dioxide",
        "reactants": [{"name": "Glucose", "symbol": "C₆H₁₂O₆", "amount": "1"}],
        "products": [{"name": "Ethanol", "symbol": "C₂H₅OH", "amount": "2"}],
        "type": "Exothermic",
        "energyRelease": 235,
        "color": "Clear solution with bubbles",
        "hazard": "Non-toxic but produces flammable gas"
    },
    "synthesis_methyl_orange": {
        "id": "synthesis_methyl_orange",
        "name": "Synthesis of Methyl Orange",
        "equation": "C₆H₅N₂⁺ + C₆H₄(OH)SO₃Na → Methyl Orange",
        "category": "Organic Synthesis",
        "description": "Formation of azo dye used as a pH indicator",
        "reactants": [{"name": "Diazonium salt", "symbol": "ArN₂⁺", "amount": "1"}],
        "products": [{"name": "Methyl Orange", "symbol": "C₁₄H₁₄N₃NaO₃S", "amount": "1"}],
        "type": "Exothermic",
        "energyRelease": 50,
        "color": "Orange solution",
        "hazard": "May contain toxic chemicals"
    },
    "titration_vinegar": {
        "id": "titration_vinegar",
        "name": "Titration - Vinegar Analysis",
        "equation": "CH₃COOH + NaOH → CH₃COONa + H₂O",
        "category": "Acid-Base",
        "description": "Determination of acetic acid content in vinegar",
        "reactants": [{"name": "Acetic Acid", "symbol": "CH₃COOH", "amount": "1"}],
        "products": [{"name": "Sodium Acetate", "symbol": "CH₃COONa", "amount": "1"}],
        "type": "Exothermic",
        "energyRelease": 55,
        "color": "Colorless to pink (with indicator)",
        "hazard": "Weak acid, generally safe"
    },
    "synthesis_aspirin": {
        "id": "synthesis_aspirin",
        "name": "Aspirin Synthesis",
        "equation": "C₆H₅COOH + (CH₃CO)₂O → C₆H₄(OCOCH₃)COOH + CH₃COOH",
        "category": "Organic Synthesis",
        "description": "Salicylic acid reacts with acetic anhydride to form aspirin",
        "reactants": [{"name": "Salicylic Acid", "symbol": "C₆H₅COOH", "amount": "1"}],
        "products": [{"name": "Acetylsalicylic Acid (Aspirin)", "symbol": "C₉H₈O₄", "amount": "1"}],
        "type": "Exothermic",
        "energyRelease": 60,
        "color": "White crystalline solid",
        "hazard": "Toxic in large amounts"
    },
    "esterification": {
        "id": "esterification",
        "name": "Esterification Reaction",
        "equation": "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O",
        "category": "Organic Chemistry",
        "description": "Acetic acid reacts with ethanol to form ethyl acetate",
        "reactants": [{"name": "Acetic Acid", "symbol": "CH₃COOH", "amount": "1"}],
        "products": [{"name": "Ethyl Acetate", "symbol": "CH₃COOC₂H₅", "amount": "1"}],
        "type": "Reversible",
        "energyRelease": 8,
        "color": "Clear liquid",
        "hazard": "Flammable"
    },
    "calcium_carbide_acetylene": {
        "id": "calcium_carbide_acetylene",
        "name": "Calcium Carbide and Water",
        "equation": "CaC₂ + 2H₂O → Ca(OH)₂ + C₂H₂",
        "category": "Synthesis",
        "description": "Calcium carbide reacts with water to produce acetylene gas",
        "reactants": [{"name": "Calcium Carbide", "symbol": "CaC₂", "amount": "1"}],
        "products": [{"name": "Acetylene", "symbol": "C₂H₂", "amount": "1"}],
        "type": "Exothermic",
        "energyRelease": 130,
        "color": "Colorless gas",
        "hazard": "Highly flammable, toxic impurities"
    },
    "glucose_oxidation": {
        "id": "glucose_oxidation",
        "name": "Cellular Respiration - Glucose Oxidation",
        "equation": "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy (ATP)",
        "category": "Biochemical",
        "description": "Glucose oxidation provides energy for living cells",
        "reactants": [{"name": "Glucose", "symbol": "C₆H₁₂O₆", "amount": "1"}],
        "products": [{"name": "Carbon Dioxide", "symbol": "CO₂", "amount": "6"}],
        "type": "Exothermic",
        "energyRelease": 2808,
        "color": "No visible change",
        "hazard": "Safe biochemical process"
    },
    "silver_mirror_test": {
        "id": "silver_mirror_test",
        "name": "Silver Mirror Test (Tollens Test)",
        "equation": "RCHO + 2[Ag(NH₃)₂]⁺ + 3OH⁻ → RCOONH₄ + 2Ag + 4NH₃ + H₂O",
        "category": "Redox",
        "description": "Detection of aldehydes by formation of silver mirror",
        "reactants": [{"name": "Aldehyde", "symbol": "RCHO", "amount": "1"}],
        "products": [{"name": "Silver Metal", "symbol": "Ag", "amount": "2"}],
        "type": "Exothermic",
        "energyRelease": 75,
        "color": "Silver mirror formation",
        "hazard": "Explosive when dry"
    },
    "thermite_reaction": {
        "id": "thermite_reaction",
        "name": "Thermite Reaction",
        "equation": "2Al + Fe₂O₃ → 2Fe + Al₂O₃",
        "category": "Exothermic",
        "description": "Aluminum reduces iron oxide with extreme heat release",
        "reactants": [{"name": "Aluminum", "symbol": "Al", "amount": "2"}],
        "products": [{"name": "Iron", "symbol": "Fe", "amount": "2"}],
        "type": "Exothermic",
        "energyRelease": 3350,
        "color": "Bright white flame, molten iron",
        "hazard": "Extremely hot, cannot be extinguished with water"
    },
    "iodine_clock": {
        "id": "iodine_clock",
        "name": "Iodine Clock Reaction",
        "equation": "H₂O₂ + 2I⁻ + 2H⁺ ⇌ I₂ + 2H₂O",
        "category": "Kinetics",
        "description": "Oscillating chemical reaction that changes color periodically",
        "reactants": [{"name": "Hydrogen Peroxide", "symbol": "H₂O₂", "amount": "1"}],
        "products": [{"name": "Iodine", "symbol": "I₂", "amount": "1"}],
        "type": "Exothermic",
        "energyRelease": 100,
        "color": "Blue-to-clear oscillations",
        "hazard": "Iodine is toxic"
    },
    "precipitation_pbno3": {
        "id": "precipitation_pbno3",
        "name": "Precipitation of Lead Iodide",
        "equation": "Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃",
        "category": "Precipitation",
        "description": "Formation of bright yellow precipitate",
        "reactants": [{"name": "Lead Nitrate", "symbol": "Pb(NO₃)₂", "amount": "1"}],
        "products": [{"name": "Lead Iodide", "symbol": "PbI₂", "amount": "1"}],
        "type": "Exothermic",
        "energyRelease": 20,
        "color": "Bright yellow precipitate",
        "hazard": "Lead compound, toxic"
    }
}

# Tools and Features (30+ tools)
TOOLS = [
    {"id": "reaction_explorer", "name": "Reaction Explorer", "description": "Browse and search chemical reactions", "category": "Learning"},
    {"id": "molecular_weight_calc", "name": "Molecular Weight Calculator", "description": "Calculate molecular weights of compounds", "category": "Calculation"},
    {"id": "molarity_calculator", "name": "Molarity Calculator", "description": "Calculate molarity, volume, and moles", "category": "Calculation"},
    {"id": "ph_calculator", "name": "pH Calculator", "description": "Calculate pH and pOH values", "category": "Calculation"},
    {"id": "electron_config", "name": "Electron Configuration", "description": "Determine electron configurations", "category": "Atomic"},
    {"id": "lewis_structures", "name": "Lewis Structure Generator", "description": "Generate Lewis dot structures", "category": "Visualization"},
    {"id": "vsepr_predictor", "name": "VSEPR Predictor", "description": "Predict molecular geometry", "category": "Visualization"},
    {"id": "oxidation_states", "name": "Oxidation State Finder", "description": "Determine oxidation states", "category": "Calculation"},
    {"id": "balancing_equations", "name": "Chemical Equation Balancer", "description": "Balance chemical equations", "category": "Tool"},
    {"id": "percent_composition", "name": "Percent Composition Calculator", "description": "Calculate percent composition of elements", "category": "Calculation"},
    {"id": "empirical_formula", "name": "Empirical Formula Finder", "description": "Determine empirical formulas", "category": "Calculation"},
    {"id": "reaction_predictor", "name": "Reaction Type Predictor", "description": "Predict types of chemical reactions", "category": "Tool"},
    {"id": "spectroscopy_simulator", "name": "Spectroscopy Simulator", "description": "Simulate UV-Vis absorption spectra", "category": "Simulation"},
    {"id": "phase_diagram", "name": "Phase Diagram Viewer", "description": "View phase diagrams of substances", "category": "Visualization"},
    {"id": "titration_simulator", "name": "Titration Simulator", "description": "Simulate acid-base titrations", "category": "Simulation"},
    {"id": "stoichiometry_solver", "name": "Stoichiometry Problem Solver", "description": "Solve stoichiometry problems", "category": "Calculation"},
    {"id": "thermal_properties", "name": "Thermal Properties Calculator", "description": "Calculate heat and thermodynamics", "category": "Calculation"},
    {"id": "solubility_predictor", "name": "Solubility Predictor", "description": "Predict solubility of compounds", "category": "Prediction"},
    {"id": "kinetics_simulator", "name": "Reaction Kinetics Simulator", "description": "Simulate reaction rates and mechanisms", "category": "Simulation"},
    {"id": "bonding_analyzer", "name": "Chemical Bonding Analyzer", "description": "Analyze types of chemical bonds", "category": "Analysis"},
    {"id": "isotope_calculator", "name": "Isotope Calculator", "description": "Calculate properties of isotopes", "category": "Calculation"},
    {"id": "gas_law_calculator", "name": "Gas Law Calculator", "description": "Calculate using ideal gas law", "category": "Calculation"},
    {"id": "buffer_solver", "name": "Buffer Solution Solver", "description": "Calculate buffer pH and capacity", "category": "Calculation"},
    {"id": "redox_analyzer", "name": "Redox Analyzer", "description": "Analyze redox reactions", "category": "Analysis"},
    {"id": "periodic_table", "name": "Interactive Periodic Table", "description": "Explore periodic table with properties", "category": "Reference"},
    {"id": "nomenclature_tool", "name": "Chemical Nomenclature Tool", "description": "Name and identify chemical compounds", "category": "Tool"},
    {"id": "reaction_energy", "name": "Reaction Energy Calculator", "description": "Calculate enthalpy and Gibbs energy", "category": "Calculation"},
    {"id": "virtual_lab", "name": "Virtual Lab Experiments", "description": "Perform virtual experiments safely", "category": "Simulation"},
    {"id": "molecular_visualizer", "name": "3D Molecular Visualizer", "description": "View 3D molecular structures", "category": "Visualization"},
    {"id": "quiz_generator", "name": "Chemistry Quiz Generator", "description": "Generate chemistry quizzes", "category": "Learning"},
]

# Routes
@app.route('/api/reactions', methods=['GET'])
def get_reactions():
    """Get all reactions or filtered reactions"""
    category = request.args.get('category')
    if category:
        filtered = {k: v for k, v in REACTIONS.items() if v['category'].lower() == category.lower()}
        return jsonify(list(filtered.values()))
    return jsonify(list(REACTIONS.values()))

@app.route('/api/reactions/<reaction_id>', methods=['GET'])
def get_reaction(reaction_id):
    """Get specific reaction details"""
    reaction = REACTIONS.get(reaction_id)
    if reaction:
        return jsonify(reaction)
    return jsonify({"error": "Reaction not found"}), 404

@app.route('/api/tools', methods=['GET'])
def get_tools():
    """Get all tools"""
    category = request.args.get('category')
    if category:
        filtered = [t for t in TOOLS if t['category'].lower() == category.lower()]
        return jsonify(filtered)
    return jsonify(TOOLS)

@app.route('/api/tools/<tool_id>', methods=['GET'])
def get_tool(tool_id):
    """Get specific tool details"""
    tool = next((t for t in TOOLS if t['id'] == tool_id), None)
    if tool:
        return jsonify(tool)
    return jsonify({"error": "Tool not found"}), 404

@app.route('/api/calculate/molecular-weight', methods=['POST'])
def calculate_molecular_weight():
    """Calculate molecular weight"""
    data = request.json
    formula = data.get('formula', '')
    # Simplified atomic weights
    atomic_weights = {
        'H': 1, 'C': 12, 'N': 14, 'O': 16, 'S': 32, 'P': 31,
        'Na': 23, 'K': 39, 'Ca': 40, 'Mg': 24, 'Fe': 56, 'Cu': 64,
        'Cl': 35.5, 'Br': 80, 'I': 127, 'F': 19
    }
    try:
        weight = 0
        i = 0
        while i < len(formula):
            if formula[i].isupper():
                element = formula[i]
                i += 1
                if i < len(formula) and formula[i].islower():
                    element += formula[i]
                    i += 1
                count = ''
                while i < len(formula) and formula[i].isdigit():
                    count += formula[i]
                    i += 1
                count = int(count) if count else 1
                weight += atomic_weights.get(element, 0) * count
        return jsonify({"formula": formula, "molecular_weight": weight})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/calculate/molarity', methods=['POST'])
def calculate_molarity():
    """Calculate molarity"""
    data = request.json
    moles = data.get('moles')
    volume = data.get('volume')  # in liters
    if moles and volume:
        molarity = moles / volume
        return jsonify({"moles": moles, "volume": volume, "molarity": molarity})
    return jsonify({"error": "Missing parameters"}), 400

@app.route('/api/calculate/ph', methods=['POST'])
def calculate_ph():
    """Calculate pH"""
    data = request.json
    h_concentration = data.get('h_concentration')
    if h_concentration:
        import math
        ph = -math.log10(h_concentration)
        poh = 14 - ph
        return jsonify({"h_concentration": h_concentration, "pH": round(ph, 2), "pOH": round(poh, 2)})
    return jsonify({"error": "Missing H+ concentration"}), 400

@app.route('/api/calculate/stoichiometry', methods=['POST'])
def calculate_stoichiometry():
    """Calculate stoichiometry"""
    data = request.json
    reactant_moles = data.get('reactant_moles')
    reactant_coeff = data.get('reactant_coeff')
    product_coeff = data.get('product_coeff')
    
    if all([reactant_moles, reactant_coeff, product_coeff]):
        product_moles = (reactant_moles * product_coeff) / reactant_coeff
        return jsonify({
            "reactant_moles": reactant_moles,
            "product_moles": round(product_moles, 4)
        })
    return jsonify({"error": "Missing parameters"}), 400

@app.route('/api/search', methods=['GET'])
def search():
    """Search reactions by name or properties"""
    query = request.args.get('q', '').lower()
    results = []
    
    for reaction in REACTIONS.values():
        if (query in reaction['name'].lower() or 
            query in reaction['equation'].lower() or
            query in reaction['category'].lower()):
            results.append(reaction)
    
    return jsonify(results)

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all reaction categories"""
    categories = set(r['category'] for r in REACTIONS.values())
    return jsonify(sorted(list(categories)))

@app.route('/api/tool-categories', methods=['GET'])
def get_tool_categories():
    """Get all tool categories"""
    categories = set(t['category'] for t in TOOLS)
    return jsonify(sorted(list(categories)))

# Virtual Lab Experiments Database
EXPERIMENTS = {
    "chem_combustion": {
        "id": "chem_combustion",
        "lab": "Chemistry",
        "name": "Combustion Reaction",
        "description": "Combine methane with oxygen to observe combustion",
        "chemicals": ["Methane (CH₄)", "Oxygen (O₂)"],
        "result": "CO₂ + H₂O + Energy",
        "color": "Blue flame",
        "safety": "Highly flammable",
        "duration": "Instant"
    },
    "chem_acid_base": {
        "id": "chem_acid_base",
        "lab": "Chemistry",
        "name": "Acid-Base Reaction",
        "description": "Mix acid with base to neutralize",
        "chemicals": ["HCl", "NaOH"],
        "result": "NaCl + H₂O (Heat released)",
        "color": "Solution becomes warm",
        "safety": "Corrosive - handle carefully",
        "duration": "Instant"
    },
    "chem_precipitation": {
        "id": "chem_precipitation",
        "lab": "Chemistry",
        "name": "Precipitation Reaction",
        "description": "Combine ions to form insoluble salt",
        "chemicals": ["Pb(NO₃)₂", "KI"],
        "result": "Bright yellow PbI₂ precipitate",
        "color": "Yellow solid forms",
        "safety": "Lead compound - toxic",
        "duration": "Instant"
    },
    "chem_color_change": {
        "id": "chem_color_change",
        "lab": "Chemistry",
        "name": "Redox Color Change",
        "description": "Iron reacts with copper sulfate",
        "chemicals": ["Fe", "CuSO₄"],
        "result": "Red copper metal + pale green FeSO₄",
        "color": "Blue → pale green",
        "safety": "Generally safe",
        "duration": "1-2 minutes"
    },
    "chem_thermite": {
        "id": "chem_thermite",
        "lab": "Chemistry",
        "name": "Thermite Reaction",
        "description": "Aluminum reduces iron oxide with extreme heat",
        "chemicals": ["Al", "Fe₂O₃"],
        "result": "Molten iron + Al₂O₃",
        "color": "Bright white flame, molten iron",
        "safety": "EXTREMELY HOT - Do not touch",
        "duration": "Seconds"
    },
    "bio_enzyme": {
        "id": "bio_enzyme",
        "lab": "Biology",
        "name": "Enzyme Activity",
        "description": "Catalase enzyme breaks down hydrogen peroxide",
        "chemicals": ["H₂O₂", "Enzyme (from liver)"],
        "result": "O₂ gas + H₂O (Fizzing reaction)",
        "color": "Bubbling/foaming",
        "safety": "H₂O₂ can irritate skin",
        "duration": "30 seconds"
    },
    "bio_fermentation": {
        "id": "bio_fermentation",
        "lab": "Biology",
        "name": "Fermentation",
        "description": "Yeast ferments glucose to ethanol and CO₂",
        "chemicals": ["Yeast", "Glucose", "Water"],
        "result": "Ethanol + CO₂ (bubbles))",
        "color": "Clear solution with bubbles",
        "safety": "Non-toxic but produces flammable gas",
        "duration": "Hours"
    },
    "bio_protein": {
        "id": "bio_protein",
        "lab": "Biology",
        "name": "Protein Denaturation",
        "description": "Heat causes proteins to denature and coagulate",
        "chemicals": ["Egg white", "Heat"],
        "result": "Solid white precipitate",
        "color": "Clear → opaque white",
        "safety": "Safe",
        "duration": "Minutes"
    },
    "bio_dna": {
        "id": "bio_dna",
        "lab": "Biology",
        "name": "DNA Extraction",
        "description": "Extract DNA from cell nucleus using detergent",
        "chemicals": ["Onion cells", "Detergent", "Salt water", "Ethanol"],
        "result": "White DNA strands precipitate",
        "color": "White threadlike material",
        "safety": "Generally safe",
        "duration": "10 minutes"
    },
    "phy_density": {
        "id": "phy_density",
        "lab": "Physics",
        "name": "Density Separation",
        "description": "Layer liquids of different densities",
        "chemicals": ["Honey", "Water", "Oil", "Alcohol"],
        "result": "Clear layers based on density",
        "color": "Layered colors",
        "safety": "Safe",
        "duration": "Minutes"
    },
    "phy_crystal": {
        "id": "phy_crystal",
        "lab": "Physics",
        "name": "Crystal Growth",
        "description": "Grow salt or sugar crystals through crystallization",
        "chemicals": ["Salt/Sugar", "Hot water"],
        "result": "Beautiful crystal formations",
        "color": "Clear/White crystals",
        "safety": "Safe",
        "duration": "Hours to days"
    },
    "phy_osmosis": {
        "id": "phy_osmosis",
        "lab": "Physics",
        "name": "Osmosis Demonstration",
        "description": "Water crosses semipermeable membrane",
        "chemicals": ["Salt water", "Fresh water", "Membrane"],
        "result": "Water level increases in salt solution",
        "color": "Solutions change concentration",
        "safety": "Safe",
        "duration": "30 minutes"
    }
}

# Chemical inventory for dragging
CHEMICALS = {
    "methane": {"name": "Methane (CH₄)", "symbol": "CH₄", "category": "Gas", "color": "#87CEEB"},
    "oxygen": {"name": "Oxygen (O₂)", "symbol": "O₂", "category": "Gas", "color": "#87CEEB"},
    "hcl": {"name": "Hydrochloric Acid (HCl)", "symbol": "HCl", "category": "Acid", "color": "#FF6B6B"},
    "naoh": {"name": "Sodium Hydroxide (NaOH)", "symbol": "NaOH", "category": "Base", "color": "#4ECDC4"},
    "pbno3": {"name": "Lead Nitrate Pb(NO₃)₂", "symbol": "Pb(NO₃)₂", "category": "Salt", "color": "#FFE66D"},
    "ki": {"name": "Potassium Iodide (KI)", "symbol": "KI", "category": "Salt", "color": "#FFE66D"},
    "al": {"name": "Aluminum (Al)", "symbol": "Al", "category": "Metal", "color": "#C0C0C0"},
    "fe2o3": {"name": "Iron Oxide (Fe₂O₃)", "symbol": "Fe₂O₃", "category": "Compound", "color": "#8B4513"},
    "h2o2": {"name": "Hydrogen Peroxide (H₂O₂)", "symbol": "H₂O₂", "category": "Chemical", "color": "#E0E0E0"},
    "enzyme": {"name": "Catalase Enzyme", "symbol": "Enzyme", "category": "Biological", "color": "#90EE90"},
    "yeast": {"name": "Yeast", "symbol": "Yeast", "category": "Biological", "color": "#D4A574"},
    "glucose": {"name": "Glucose", "symbol": "C₆H₁₂O₆", "category": "Sugar", "color": "#FFB6C1"},
    "egg": {"name": "Egg White", "symbol": "Protein", "category": "Biological", "color": "#FFFACD"},
    "heat": {"name": "Heat", "symbol": "Heat", "category": "Energy", "color": "#FF4500"},
    "salt": {"name": "Salt (NaCl)", "symbol": "NaCl", "category": "Salt", "color": "#FFFFFF"},
    "sugar": {"name": "Sugar", "symbol": "C₁₂H₂₂O₁₁", "category": "Sugar", "color": "#FFD700"},
    "water": {"name": "Water (H₂O)", "symbol": "H₂O", "category": "Solvent", "color": "#87CEEB"},
    "oil": {"name": "Oil", "symbol": "Oil", "category": "Liquid", "color": "#FFD700"},
    "alcohol": {"name": "Alcohol", "symbol": "C₂H₅OH", "category": "Liquid", "color": "#E6E6FA"},
    "honey": {"name": "Honey", "symbol": "Honey", "category": "Liquid", "color": "#DAA520"}
}

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get lab statistics"""
    return jsonify({
        "total_reactions": len(REACTIONS),
        "total_tools": len(TOOLS),
        "total_experiments": len(EXPERIMENTS),
        "categories": len(set(r['category'] for r in REACTIONS.values())),
        "exothermic": len([r for r in REACTIONS.values() if 'Exothermic' in r['type']]),
        "endothermic": len([r for r in REACTIONS.values() if 'Endothermic' in r['type']])
    })

@app.route('/api/experiments', methods=['GET'])
def get_experiments():
    """Get all experiments or filtered by lab"""
    lab = request.args.get('lab')
    if lab:
        filtered = {k: v for k, v in EXPERIMENTS.items() if v['lab'].lower() == lab.lower()}
        return jsonify(list(filtered.values()))
    return jsonify(list(EXPERIMENTS.values()))

@app.route('/api/experiments/<exp_id>', methods=['GET'])
def get_experiment(exp_id):
    """Get specific experiment"""
    experiment = EXPERIMENTS.get(exp_id)
    if experiment:
        return jsonify(experiment)
    return jsonify({"error": "Experiment not found"}), 404

@app.route('/api/chemicals', methods=['GET'])
def get_chemicals():
    """Get all available chemicals"""
    return jsonify(list(CHEMICALS.values()))

@app.route('/api/run-experiment', methods=['POST'])
def run_experiment():
    """Run a virtual experiment by mixing chemicals and using tools"""
    data = request.json
    chemicals_used = data.get('chemicals', [])
    experiment_type = data.get('type', '').lower()
    tools_used = data.get('tools', [])
    
    # Smart reaction generation based on chemicals
    reaction_map = {
        # Chemistry Lab Reactions
        ('methane', 'oxygen'): {
            'result': 'Bright blue flame and heat release! Combustion reaction.',
            'observation': 'Blue to yellow flame - Methane combusting',
            'safety': 'High temperature, ensure ventilation',
            'color': 'Blue flame'
        },
        ('hydrochloric acid', 'sodium hydroxide'): {
            'result': 'Neutralization reaction! Solution becomes warm.',
            'observation': 'Heat release, solution becomes clear',
            'safety': 'Exothermic - wear gloves',
            'color': 'Clear solution, warming'
        },
        ('lead nitrate', 'potassium iodide'): {
            'result': 'Yellow precipitate forms! Precipitation reaction.',
            'observation': 'Bright yellow solid forms',
            'safety': 'Lead compound - dispose carefully',
            'color': 'Yellow precipitate'
        },
        ('sugar', 'hydrochloric acid'): {
            'result': 'Dehydration reaction - carbon forms!',
            'observation': 'Black carbon residue appears',
            'safety': 'Exothermic reaction',
            'color': 'Black carbon formation'
        },
        # Biology Lab Reactions
        ('yeast', 'glucose'): {
            'result': 'Fermentation begins! Gas bubbles forming.',
            'observation': 'Rapid bubble formation - CO₂ production',
            'safety': 'Anaerobic fermentation in progress',
            'color': 'Bubbling solution'
        },
        ('enzyme', 'sugar'): {
            'result': 'Enzymatic reaction! Breaking down substrate.',
            'observation': 'Solution changes rapidly',
            'safety': 'Biochemical reaction safe',
            'color': 'Color change observed'
        },
        # Physics Lab Reactions
        ('water', 'oil'): {
            'result': 'Immiscible liquids - density separation!',
            'observation': 'Two distinct layers form',
            'safety': 'Physical mixture only',
            'color': 'Layered liquids'
        },
    }
    
    # Generate base result
    result = {
        "chemicals": chemicals_used,
        "result": "Reaction occurred!",
        "observation": "Chemical mixture being analyzed",
        "timestamp": datetime.now().isoformat(),
        "success": True,
        "tools": tools_used
    }
    
    # Check for matching reactions
    chem_lower = [c.lower() for c in chemicals_used]
    
    # Look for exact matches
    for key, reaction in reaction_map.items():
        if len(chem_lower) >= len(key) and all(k in chem_lower for k in key):
            result.update(reaction)
            break
    
    # Tool modifiers
    tool_effects = []
    if 'Bunsen Burner' in tools_used:
        result['result'] += ' [Accelerated by heat]'
        tool_effects.append('heat acceleration')
    if 'Thermometer' in tools_used:
        result['observation'] += ' (Temperature monitored)'
        tool_effects.append('temperature control')
    if 'Microscope' in tools_used:
        result['observation'] = f'[Microscopic view] {result["observation"]}'
        tool_effects.append('detailed observation')
    if 'Stirring Rod' in tools_used:
        result['observation'] += ' - thoroughly mixed'
        tool_effects.append('uniform mixing')
    if 'Pipette' in tools_used:
        result['observation'] += ' - precise transfer achieved'
        tool_effects.append('precise handling')
    if 'pH Meter' in tools_used:
        result['observation'] += ' - pH level detected'
        tool_effects.append('acidity monitoring')
    if 'Gloves' in tools_used:
        result['safety'] = 'Safety protection active - ' + result.get('safety', 'Safe')
        tool_effects.append('safety precautions')
    
    # If no known reaction, create a generic one based on lab type
    if 'observation' not in result or result['observation'] == 'Chemical mixture being analyzed':
        observations = {
            'chemistry': f'Mixed {len(chemicals_used)} chemicals - exothermic reaction detected',
            'biology': f'{len(chemicals_used)} biological samples interacting - enzymatic activity',
            'physics': f'Physical properties of {len(chemicals_used)} substances being observed'
        }
        result['observation'] = observations.get(experiment_type, 'Reaction in progress')
        result['result'] = f'Experiment with {chemicals_used[0] if chemicals_used else "unknown"} completed successfully!'
    
    return jsonify(result)

@app.route('/api/findings', methods=['POST'])
def save_findings():
    """Save lab findings/notes"""
    data = request.json
    finding = {
        "id": data.get('id', f"finding_{datetime.now().timestamp()}"),
        "title": data.get('title', 'Untitled Finding'),
        "content": data.get('content', ''),
        "experiment": data.get('experiment', ''),
        "lab": data.get('lab', ''),
        "timestamp": datetime.now().isoformat(),
        "observations": data.get('observations', ''),
        "conclusion": data.get('conclusion', '')
    }
    return jsonify(finding), 201

@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "Virtual Science Lab Backend - API Running"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
