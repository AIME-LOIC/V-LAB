from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import math
import os
import re
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
    "hydrogen": {"name": "Hydrogen Gas (H₂)", "symbol": "H₂", "category": "Gas", "color": "#B3E5FC"},
    "nitrogen": {"name": "Nitrogen (N₂)", "symbol": "N₂", "category": "Gas", "color": "#A5B4FC"},
    "co2": {"name": "Carbon Dioxide (CO₂)", "symbol": "CO₂", "category": "Gas", "color": "#CBD5E1"},
    "hcl": {"name": "Hydrochloric Acid (HCl)", "symbol": "HCl", "category": "Acid", "color": "#FF6B6B"},
    "naoh": {"name": "Sodium Hydroxide (NaOH)", "symbol": "NaOH", "category": "Base", "color": "#4ECDC4"},
    "acetic": {"name": "Acetic Acid (CH₃COOH)", "symbol": "CH₃COOH", "category": "Acid", "color": "#FB7185"},
    "pbno3": {"name": "Lead Nitrate Pb(NO₃)₂", "symbol": "Pb(NO₃)₂", "category": "Salt", "color": "#FFE66D"},
    "ki": {"name": "Potassium Iodide (KI)", "symbol": "KI", "category": "Salt", "color": "#FFE66D"},
    "al": {"name": "Aluminum (Al)", "symbol": "Al", "category": "Metal", "color": "#C0C0C0"},
    "fe": {"name": "Iron (Fe)", "symbol": "Fe", "category": "Metal", "color": "#B45309"},
    "fe2o3": {"name": "Iron Oxide (Fe₂O₃)", "symbol": "Fe₂O₃", "category": "Compound", "color": "#8B4513"},
    "caco3": {"name": "Calcium Carbonate (CaCO₃)", "symbol": "CaCO₃", "category": "Salt", "color": "#F8FAFC"},
    "cac2": {"name": "Calcium Carbide (CaC₂)", "symbol": "CaC₂", "category": "Compound", "color": "#E2E8F0"},
    "h2o2": {"name": "Hydrogen Peroxide (H₂O₂)", "symbol": "H₂O₂", "category": "Chemical", "color": "#E0E0E0"},
    "enzyme": {"name": "Catalase Enzyme", "symbol": "Enzyme", "category": "Biological", "color": "#90EE90"},
    "yeast": {"name": "Yeast", "symbol": "Yeast", "category": "Biological", "color": "#D4A574"},
    "glucose": {"name": "Glucose", "symbol": "C₆H₁₂O₆", "category": "Sugar", "color": "#FFB6C1"},
    "egg": {"name": "Egg White", "symbol": "Protein", "category": "Biological", "color": "#FFFACD"},
    "heat": {"name": "Heat", "symbol": "Heat", "category": "Energy", "color": "#FF4500"},
    "salt": {"name": "Salt (NaCl)", "symbol": "NaCl", "category": "Salt", "color": "#FFFFFF"},
    "sugar": {"name": "Sugar", "symbol": "C₁₂H₂₂O₁₁", "category": "Sugar", "color": "#FFD700"},
    "water": {"name": "Water (H₂O)", "symbol": "H₂O", "category": "Solvent", "color": "#87CEEB"},
    "ethylene": {"name": "Ethylene (C₂H₄)", "symbol": "C₂H₄", "category": "Gas", "color": "#93C5FD"},
    "salicylic": {"name": "Salicylic Acid (C₆H₅COOH)", "symbol": "C₆H₅COOH", "category": "Acid", "color": "#FCA5A5"},
    "diazonium": {"name": "Diazonium Salt (ArN₂⁺)", "symbol": "ArN₂⁺", "category": "Chemical", "color": "#FDE68A"},
    "aldehyde": {"name": "Aldehyde (RCHO)", "symbol": "RCHO", "category": "Organic", "color": "#D8B4FE"},
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
    chemicals_used = data.get('chemicals', []) or []
    experiment_type = (data.get('type') or '').lower()
    tools_used = data.get('tools', []) or []
    heat_level = data.get('heat', 0) or 0
    volume_ml = data.get('volume_ml', 250) or 250

    def clamp_number(value, min_value, max_value, default):
        try:
            number = float(value)
        except (TypeError, ValueError):
            return default
        return max(min_value, min(max_value, number))

    heat_level = clamp_number(heat_level, 0, 100, 0)
    volume_ml = clamp_number(volume_ml, 50, 2000, 250)

    # Normalize chemicals to inventory entries where possible.
    inventory_by_name = {v["name"].lower(): v for v in CHEMICALS.values()}
    inventory_by_symbol = {v["symbol"].lower(): v for v in CHEMICALS.values()}

    normalized = []
    for raw in chemicals_used:
        raw_str = str(raw).strip()
        key = raw_str.lower()
        chem = inventory_by_name.get(key) or inventory_by_symbol.get(key)
        if not chem:
            # Try partial match for common user inputs.
            chem = next((v for n, v in inventory_by_name.items() if key in n), None)
        normalized.append(
            {
                "name": chem["name"] if chem else raw_str,
                "symbol": chem["symbol"] if chem else raw_str,
                "category": chem.get("category", "Unknown") if chem else "Unknown",
            }
        )

    provided_symbols = {c["symbol"] for c in normalized if c.get("symbol")}
    provided_categories = {c["category"] for c in normalized if c.get("category")}

    def required_symbols_from_equation(equation):
        """Extract a set of reactant-like symbols from the equation LHS.

        Note: the REACTIONS dataset includes simplified reactants lists (often incomplete),
        so equation parsing is used to improve matching.
        """
        if not equation:
            return set()
        parts = re.split(r"\s*(?:→|⇌)\s*", str(equation), maxsplit=1)
        lhs = parts[0] if parts else str(equation)
        tokens = [t.strip() for t in lhs.split("+")]
        symbols = set()
        for t in tokens:
            if not t:
                continue
            # Skip energy/light terms
            if not re.search(r"[A-Z]", t) and not re.search(r"[₀-₉]", t):
                continue
            # Remove leading coefficients like "2H₂O"
            t = re.sub(r"^\s*\d+\s*", "", t)
            # Handle polymerization forms like "n(C₂H₄)"
            t = re.sub(r"^\s*n\s*", "", t)
            t = t.strip()
            if t.startswith("(") and t.endswith(")"):
                t = t[1:-1].strip()
            # Collapse multiple spaces
            t = re.sub(r"\s+", " ", t)
            if " " in t:
                # Still looks like a phrase ("electrical energy") rather than a chemical formula
                continue
            symbols.add(t)
        return symbols

    # Pick the best matching reaction from the database based on reactant symbols.
    best = None
    best_required = set()
    for reaction in REACTIONS.values():
        required = required_symbols_from_equation(reaction.get("equation"))
        if not required:
            required = {r.get("symbol") for r in reaction.get("reactants", []) if r.get("symbol")}
        if not required:
            continue
        # Avoid over-matching single-reactant reactions when the user mixes multiple chemicals.
        # (Example: any mixture containing H₂O should not automatically become "Electrolysis of Water".)
        if len(required) == 1 and len(provided_symbols) > 1:
            continue
        if required.issubset(provided_symbols) and len(required) > len(best_required):
            best = reaction
            best_required = required

    def estimate_ph(categories, has_ph_meter):
        if not has_ph_meter:
            return None
        if "Acid" in categories and "Base" in categories:
            return 7.0
        if "Acid" in categories:
            return 2.5
        if "Base" in categories:
            return 11.5
        return 7.0

    def tool_notes(tools):
        notes = []
        if "Microscope" in tools:
            notes.append("Microscope: detailed observation enabled")
        if "Stirring Rod" in tools:
            notes.append("Stirring Rod: uniform mixing achieved")
        if "Pipette" in tools:
            notes.append("Pipette: precise transfer achieved")
        if "Thermometer" in tools:
            notes.append("Thermometer: temperature monitored")
        if "pH Meter" in tools:
            notes.append("pH Meter: acidity/basicity measured")
        if "Gloves" in tools:
            notes.append("Gloves: extra safety protection")
        if "Bunsen Burner" in tools:
            notes.append("Bunsen Burner: heat applied")
        return notes

    effective_heat = heat_level if "Bunsen Burner" in tools_used else 0
    if heat_level > 0 and effective_heat == 0:
        tools_used = list(tools_used) + ["(Heat ignored: add Bunsen Burner)"]

    ambient_c = 22.0
    volume_factor = math.sqrt(max(1.0, volume_ml / 250.0))

    reaction_summary = None
    observation = "Mixture prepared on lab bench."
    result_text = "Interaction observed."
    safety = "Standard lab safety"
    color = "No visible change"
    energy = 0.0
    reaction_type = "Physical"

    # If we matched a known reaction, use it.
    if best:
        reaction_summary = {
            "id": best.get("id"),
            "name": best.get("name"),
            "equation": best.get("equation"),
            "category": best.get("category"),
            "type": best.get("type"),
            "energyRelease": best.get("energyRelease"),
        }
        reaction_type = best.get("type") or reaction_type
        energy = float(best.get("energyRelease") or 0.0)
        color = best.get("color") or color
        safety = best.get("hazard") or safety
        observation = f"{color} observed. {best.get('description') or 'Reaction underway.'}"
        result_text = f"{best.get('name')}: {best.get('equation')}"
    else:
        # Always generate a meaningful interaction, even for unknown combos.
        categories = provided_categories
        if "Acid" in categories and "Base" in categories:
            reaction_type = "Exothermic"
            energy = 45.0
            color = "Clear solution; mild warming"
            observation = "Neutralization interaction: temperature rises slightly and pH trends toward neutral."
            result_text = "Salt + water formed (neutralization)."
            safety = "Corrosive reagents possible — wear gloves and goggles"
        elif "Metal" in categories and "Acid" in categories:
            reaction_type = "Exothermic"
            energy = 60.0
            color = "Bubbles and slight heating"
            observation = "Metal + acid interaction: bubbles indicate gas formation."
            result_text = "Salt formed; hydrogen gas may be released."
            safety = "Flammable gas risk — keep away from flames"
        elif "Solvent" in categories and "Liquid" in categories and any(c["symbol"] == "Oil" for c in normalized):
            reaction_type = "Physical"
            energy = 0.0
            color = "Layer separation"
            observation = "Immiscible mixture: liquids separate into layers based on density."
            result_text = "No chemical reaction; physical separation observed."
            safety = "Safe (avoid spills)"
        elif "Sugar" in categories and "Acid" in categories:
            reaction_type = "Exothermic"
            energy = 30.0
            color = "Darkening/char formation"
            observation = "Dehydration interaction: solution darkens as carbon-rich material forms."
            result_text = "Organic decomposition products formed."
            safety = "Irritating fumes possible — use ventilation"
        else:
            # Generic but still plausible based on lab type.
            if experiment_type == "biology":
                reaction_type = "Biochemical"
                energy = 10.0
                color = "Subtle cloudiness"
                observation = f"Biological interaction: {len(normalized)} samples show gradual change."
                result_text = "Enzymatic/biochemical activity detected."
                safety = "Safe (standard bio precautions)"
            elif experiment_type == "physics":
                reaction_type = "Physical"
                energy = 0.0
                color = "Phase/density change"
                observation = f"Physical interaction: material properties of {len(normalized)} substances observed."
                result_text = "No chemical transformation; physical properties recorded."
                safety = "Safe"
            else:
                reaction_type = "Chemical"
                energy = 15.0
                color = "Mild change"
                observation = f"General chemical interaction: {len(normalized)} reagents show observable change."
                result_text = "Reaction pathway not in database; interaction modeled."
                safety = "Use standard PPE"

    # Temperature model: tool heat + reaction energy, reduced by volume.
    heat_delta = (effective_heat * 0.45) / volume_factor
    reaction_delta = 0.0
    if "Exothermic" in reaction_type:
        reaction_delta = min(35.0, max(0.0, energy / 25.0)) / volume_factor
    elif "Endothermic" in reaction_type:
        reaction_delta = -min(12.0, max(0.0, abs(energy) / 120.0)) / volume_factor
    temperature_c = round(ambient_c + heat_delta + reaction_delta, 1)

    # A simple "reaction rate" proxy for UI (0..1).
    rate = clamp_number((effective_heat / 100.0) + (0.15 if "Exothermic" in reaction_type else 0.05), 0, 1, 0.1)

    measurements = {
        "temperature_c": temperature_c,
        "heat_level": round(effective_heat, 1),
        "volume_ml": round(volume_ml, 1),
        "ph": estimate_ph(provided_categories, "pH Meter" in tools_used),
        "rate": round(rate, 2),
    }

    payload = {
        "success": True,
        "timestamp": datetime.now().isoformat(),
        "chemicals": [c["name"] for c in normalized],
        "symbols": [c["symbol"] for c in normalized],
        "categories": sorted(provided_categories),
        "tools": tools_used,
        "toolNotes": tool_notes(tools_used),
        "reaction": reaction_summary,
        "observation": observation,
        "result": result_text,
        "color": color,
        "safety": safety,
        "measurements": measurements,
    }

    return jsonify(payload)

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
    # Persist findings to a local JSON file to make the notebook usable across devices.
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(data_dir, exist_ok=True)
    path = os.path.join(data_dir, "findings.json")

    try:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                existing = json.load(f)
                if not isinstance(existing, list):
                    existing = []
        else:
            existing = []
        existing.insert(0, finding)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(existing[:500], f, ensure_ascii=False, indent=2)
    except Exception:
        # If persistence fails, still return the finding so the UI can store it locally.
        pass

    return jsonify(finding), 201

@app.route('/api/findings', methods=['GET'])
def get_findings():
    """Get saved findings/notes"""
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    path = os.path.join(data_dir, "findings.json")
    if not os.path.exists(path):
        return jsonify([])
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data, list):
            return jsonify([])
        return jsonify(data)
    except Exception:
        return jsonify([]), 200

@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "Virtual Science Lab Backend - API Running"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
