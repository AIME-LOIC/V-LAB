// Configuration
// Backend runs on port 5000 (see backend/app.py and README).
const API_BASE = 'http://localhost:5000/api';

// State
let allReactions = [];
let allTools = [];
let currentReaction = null;
let currentTool = null;
let selectedLabTools = [];
let mixedChemicals = [];
let currentLab = 'Chemistry';
let findings = JSON.parse(localStorage.getItem('findings')) || [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Setup mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });
    }

    try {
        await loadStats();
        await loadReactions();
        await loadTools();
        await loadCategories();
        setupDragAndDrop();
        await selectLab('Chemistry');
        displayFindings();
    } catch (error) {
        console.error('Initialization error:', error);
        document.body.innerHTML += '<div style="padding: 20px; background: #991b1b; color: white; margin: 10px; border-radius: 5px;"><strong>Connection Error:</strong> Make sure backend is running on http://localhost:5000</div>';
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-reactions');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchReactions, 300));
    }
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function goToSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(el => el.classList.add('hidden'));
    
    // Show selected section
    const sectionId = section === 'home' ? 'home-section' : 
                      section === 'reactions' ? 'reactions-section' :
                      section === 'tools' ? 'tools-section' :
                      section === 'lab' ? 'lab-section' :
                      section === 'notebook' ? 'notebook-section' : 'about-section';
    document.getElementById(sectionId).classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle Lab Tools
function toggleTool(toolName, element) {
    if (selectedLabTools.includes(toolName)) {
        selectedLabTools = selectedLabTools.filter(t => t !== toolName);
        element.classList.remove('border-yellow-400', 'bg-opacity-80');
        element.classList.add('border-transparent');
    } else {
        selectedLabTools.push(toolName);
        element.classList.add('border-yellow-400', 'bg-opacity-80');
    }
    updateSelectedToolsDisplay();
}

function updateSelectedToolsDisplay() {
    const display = document.getElementById('selected-tools');
    if (selectedLabTools.length === 0) {
        display.innerHTML = '<span class="text-slate-500">No tools selected</span>';
    } else {
        display.innerHTML = `<strong>Selected Tools:</strong> ${selectedLabTools.join(', ')}`;
    }
}

// Load Stats
async function loadStats() {
    try {
        const response = await axios.get(`${API_BASE}/stats`);
        const stats = response.data;
        
        document.getElementById('total-reactions').textContent = stats.total_reactions;
        document.getElementById('total-tools').textContent = stats.total_tools;
        document.getElementById('exothermic-count').textContent = stats.exothermic;
        document.getElementById('endothermic-count').textContent = stats.endothermic;
        
        document.getElementById('stat-reactions').textContent = stats.total_reactions;
        document.getElementById('stat-tools').textContent = stats.total_tools;
        document.getElementById('stat-categories').textContent = stats.categories;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load Reactions
async function loadReactions() {
    try {
        const response = await axios.get(`${API_BASE}/reactions`);
        allReactions = response.data;
        renderReactions(allReactions);
    } catch (error) {
        console.error('Error loading reactions:', error);
    }
}

// Load Tools
async function loadTools() {
    try {
        const response = await axios.get(`${API_BASE}/tools`);
        allTools = response.data;
        renderTools(allTools);
    } catch (error) {
        console.error('Error loading tools:', error);
    }
}

// Load Categories
async function loadCategories() {
    try {
        const response = await axios.get(`${API_BASE}/categories`);
        const categories = response.data;
        const select = document.getElementById('category-filter');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
        
        const response2 = await axios.get(`${API_BASE}/tool-categories`);
        const toolCategories = response2.data;
        const toolSelect = document.getElementById('tool-category-filter');
        toolCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            toolSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Render Reactions
function renderReactions(reactions) {
    const grid = document.getElementById('reactions-grid');
    grid.innerHTML = '';
    
    if (reactions.length === 0) {
        grid.innerHTML = '<div class="col-span-2 text-center text-slate-400">No reactions found</div>';
        return;
    }
    
    reactions.forEach(reaction => {
        const energyColor = reaction.type.includes('Exothermic') ? 'text-red-400' : 'text-blue-400';
        const card = document.createElement('div');
        card.className = 'bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/60 cursor-pointer transition transform hover:scale-105';
        card.onclick = () => showReactionModal(reaction.id);
        card.innerHTML = `
            <h3 class="text-xl font-bold mb-2 text-cyan-300">${reaction.name}</h3>
            <p class="text-sm text-slate-400 mb-3 font-mono">${reaction.equation}</p>
            <div class="flex justify-between items-center mb-3">
                <span class="text-xs px-2 py-1 bg-slate-700 rounded">${reaction.category}</span>
                <span class="${energyColor} text-xs font-bold">${reaction.type}</span>
            </div>
            <p class="text-slate-400 text-sm line-clamp-2">${reaction.description}</p>
        `;
        grid.appendChild(card);
    });
}

// Render Tools
function renderTools(tools) {
    const grid = document.getElementById('tools-grid');
    grid.innerHTML = '';
    
    const calculators = [];
    const otherTools = [];
    
    tools.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-purple-500/60 cursor-pointer transition transform hover:scale-105';
        card.onclick = () => showToolModal(tool.id);
        card.innerHTML = `
            <h3 class="text-lg font-bold mb-1 text-purple-300">${tool.name}</h3>
            <p class="text-xs px-2 py-1 bg-slate-700 rounded inline-block mb-3">${tool.category}</p>
            <p class="text-slate-400 text-sm line-clamp-2">${tool.description}</p>
        `;
        grid.appendChild(card);
        
        if (['Calculation', 'Simulation'].includes(tool.category)) {
            calculators.push(tool);
        }
    });
    
    // Render calculators separately
    renderCalculators(tools.filter(t => t.category === 'Calculation'));
}

// Render Calculators
function renderCalculators(calculators) {
    const section = document.getElementById('calculator-section');
    section.innerHTML = '';
    
    calculators.slice(0, 6).forEach(calc => {
        const card = document.createElement('div');
        card.className = 'bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/60 cursor-pointer transition';
        card.onclick = () => showToolModal(calc.id);
        card.innerHTML = `
            <h3 class="text-lg font-bold mb-2 text-cyan-300">${calc.name}</h3>
            <p class="text-slate-400 text-sm mb-4">${calc.description}</p>
            <button class="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded text-sm">Use Calculator</button>
        `;
        section.appendChild(card);
    });
}

// Filter Reactions
function filterReactions() {
    const category = document.getElementById('category-filter').value;
    if (category) {
        const filtered = allReactions.filter(r => r.category === category);
        renderReactions(filtered);
    } else {
        renderReactions(allReactions);
    }
}

// Filter Tools
function filterTools() {
    const category = document.getElementById('tool-category-filter').value;
    if (category) {
        const filtered = allTools.filter(t => t.category === category);
        renderTools(filtered);
    } else {
        renderTools(allTools);
    }
}

// Search Reactions
async function searchReactions() {
    const query = document.getElementById('search-reactions').value;
    if (query.length < 2) {
        renderReactions(allReactions);
        return;
    }
    
    try {
        const response = await axios.get(`${API_BASE}/search?q=${query}`);
        renderReactions(response.data);
    } catch (error) {
        console.error('Error searching:', error);
    }
}

// Show Reaction Modal
function showReactionModal(reactionId) {
    const reaction = allReactions.find(r => r.id === reactionId);
    if (!reaction) return;
    
    currentReaction = reaction;
    document.getElementById('modal-title').textContent = reaction.name;
    
    let content = `
        <div class="space-y-3">
            <div>
                <h4 class="font-bold text-cyan-400">Chemical Equation</h4>
                <p class="font-mono text-lg mt-1">${reaction.equation}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h4 class="font-bold text-cyan-400">Category</h4>
                    <p>${reaction.category}</p>
                </div>
                <div>
                    <h4 class="font-bold text-cyan-400">Type</h4>
                    <p>${reaction.type}</p>
                </div>
            </div>
            <div>
                <h4 class="font-bold text-cyan-400">Description</h4>
                <p>${reaction.description}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h4 class="font-bold text-cyan-400">Reactants</h4>
                    ${reaction.reactants.map(r => `<p class="text-sm">${r.name} (${r.symbol})</p>`).join('')}
                </div>
                <div>
                    <h4 class="font-bold text-cyan-400">Products</h4>
                    ${reaction.products.map(p => `<p class="text-sm">${p.name} (${p.symbol})</p>`).join('')}
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h4 class="font-bold text-cyan-400">Energy Release</h4>
                    <p>${reaction.energyRelease} kJ/mol</p>
                </div>
                <div>
                    <h4 class="font-bold text-cyan-400">Color Change</h4>
                    <p>${reaction.color}</p>
                </div>
            </div>
            <div>
                <h4 class="font-bold text-red-400">⚠️ Hazard</h4>
                <p>${reaction.hazard}</p>
            </div>
        </div>
    `;
    
    document.getElementById('modal-content').innerHTML = content;
    document.getElementById('reaction-modal').classList.remove('hidden');
}

// Close Reaction Modal
function closeReactionModal() {
    document.getElementById('reaction-modal').classList.add('hidden');
}

// Show Tool Modal
function showToolModal(toolId) {
    const tool = allTools.find(t => t.id === toolId);
    if (!tool) return;
    
    currentTool = tool;
    document.getElementById('tool-modal-title').textContent = tool.name;
    document.getElementById('tool-modal-category').textContent = tool.category;
    document.getElementById('tool-modal-description').textContent = tool.description;
    
    const inputDiv = document.getElementById('calculator-input');
    inputDiv.innerHTML = '';
    
    // Specific calculator layouts
    if (tool.id === 'molecular_weight_calc') {
        inputDiv.innerHTML = `
            <div>
                <label class="block text-sm mb-2">Chemical Formula (e.g., H2O, CO2)</label>
                <input type="text" id="formula-input" placeholder="Enter formula" class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                <button onclick="calculateMolecularWeight()" class="mt-3 w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded">Calculate</button>
                <div id="mw-result" class="mt-3 text-cyan-400"></div>
            </div>
        `;
    } else if (tool.id === 'molarity_calculator') {
        inputDiv.innerHTML = `
            <div>
                <label class="block text-sm mb-2">Moles</label>
                <input type="number" id="moles-input" placeholder="Enter moles" class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                <label class="block text-sm mb-2 mt-3">Volume (L)</label>
                <input type="number" id="volume-input" placeholder="Enter volume in liters" class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                <button onclick="calculateMolarity()" class="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Calculate Molarity</button>
                <div id="molarity-result" class="mt-3 text-purple-400"></div>
            </div>
        `;
    } else if (tool.id === 'ph_calculator') {
        inputDiv.innerHTML = `
            <div>
                <label class="block text-sm mb-2">H⁺ Concentration (mol/L)</label>
                <input type="number" id="h-conc-input" placeholder="Enter H+ concentration" step="0.00000001" class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                <button onclick="calculatePH()" class="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Calculate pH</button>
                <div id="ph-result" class="mt-3 text-green-400"></div>
            </div>
        `;
    } else if (tool.id === 'stoichiometry_solver') {
        inputDiv.innerHTML = `
            <div>
                <label class="block text-sm mb-2">Reactant Moles</label>
                <input type="number" id="react-moles-input" placeholder="Enter moles" class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                <label class="block text-sm mb-2 mt-3">Reactant Coefficient</label>
                <input type="number" id="react-coeff-input" placeholder="Enter coefficient" class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                <label class="block text-sm mb-2 mt-3">Product Coefficient</label>
                <input type="number" id="prod-coeff-input" placeholder="Enter coefficient" class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                <button onclick="calculateStoichiometry()" class="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded">Solve</button>
                <div id="stoic-result" class="mt-3 text-orange-400"></div>
            </div>
        `;
    } else {
        inputDiv.innerHTML = `
            <p class="text-slate-400">This tool is currently being configured for interactive use.</p>
            <p class="text-sm text-slate-500 mt-2">Tools include: Interactive Periodic Table, Lewis Structure Generator, VSEPR Predictor, Titration Simulator, and more.</p>
        `;
    }
    
    document.getElementById('tool-modal').classList.remove('hidden');
}

// Close Tool Modal
function closeToolModal() {
    document.getElementById('tool-modal').classList.add('hidden');
}

// Calculator Functions
async function calculateMolecularWeight() {
    const formula = document.getElementById('formula-input').value;
    try {
        const response = await axios.post(`${API_BASE}/calculate/molecular-weight`, { formula });
        document.getElementById('mw-result').innerHTML = `
            <strong>Molecular Weight of ${response.data.formula}: ${response.data.molecular_weight} g/mol</strong>
        `;
    } catch (error) {
        document.getElementById('mw-result').innerHTML = `<span class="text-red-400">Error: ${error.response.data.error}</span>`;
    }
}

async function calculateMolarity() {
    const moles = parseFloat(document.getElementById('moles-input').value);
    const volume = parseFloat(document.getElementById('volume-input').value);
    try {
        const response = await axios.post(`${API_BASE}/calculate/molarity`, { moles, volume });
        document.getElementById('molarity-result').innerHTML = `
            <strong>Molarity: ${response.data.molarity.toFixed(4)} M</strong>
        `;
    } catch (error) {
        document.getElementById('molarity-result').innerHTML = `<span class="text-red-400">Error</span>`;
    }
}

async function calculatePH() {
    const h_concentration = parseFloat(document.getElementById('h-conc-input').value);
    try {
        const response = await axios.post(`${API_BASE}/calculate/ph`, { h_concentration });
        document.getElementById('ph-result').innerHTML = `
            <div>
                <strong>pH: ${response.data.pH}</strong><br>
                <strong>pOH: ${response.data.pOH}</strong>
            </div>
        `;
    } catch (error) {
        document.getElementById('ph-result').innerHTML = `<span class="text-red-400">Error</span>`;
    }
}

async function calculateStoichiometry() {
    const reactant_moles = parseFloat(document.getElementById('react-moles-input').value);
    const reactant_coeff = parseFloat(document.getElementById('react-coeff-input').value);
    const product_coeff = parseFloat(document.getElementById('prod-coeff-input').value);
    
    try {
        const response = await axios.post(`${API_BASE}/calculate/stoichiometry`, {
            reactant_moles, reactant_coeff, product_coeff
        });
        document.getElementById('stoic-result').innerHTML = `
            <div>
                <strong>Product Moles: ${response.data.product_moles}</strong>
            </div>
        `;
    } catch (error) {
        document.getElementById('stoic-result').innerHTML = `<span class="text-red-400">Error</span>`;
    }
}

// Virtual Lab Functions
let currentLab = 'Chemistry';
let mixedChemicals = [];
let findings = [];

async function selectLab(lab) {
    currentLab = lab;
    document.querySelectorAll('.lab-btn').forEach(btn => btn.classList.remove('ring-2', 'ring-yellow-400'));
    event.target.classList.add('ring-2', 'ring-yellow-400');
    
    await loadExperiments(lab);
    await loadChemicals();
}

async function loadExperiments(lab) {
    try {
        const response = await axios.get(`${API_BASE}/experiments?lab=${lab}`);
        const experimentsGrid = document.getElementById('experiments-grid');
        experimentsGrid.innerHTML = '';
        
        response.data.forEach(exp => {
            const card = document.createElement('div');
            card.className = 'bg-slate-700 border border-slate-600 rounded-lg p-4 hover:border-purple-500/60 transition cursor-pointer';
            card.onclick = () => {
                document.getElementById('finding-title').value = exp.name;
                document.getElementById('finding-observations').value = exp.result;
            };
            card.innerHTML = `
                <h4 class="font-bold text-purple-300 mb-2">${exp.name}</h4>
                <p class="text-sm text-slate-400 mb-2">${exp.description}</p>
                <div class="text-xs space-y-1">
                    <p><strong>Chemicals:</strong> ${exp.chemicals.join(', ')}</p>
                    <p><strong>Result:</strong> ${exp.result}</p>
                    <p><strong>Color:</strong> ${exp.color}</p>
                </div>
            `;
            experimentsGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading experiments:', error);
    }
}

async function loadChemicals() {
    try {
        const response = await axios.get(`${API_BASE}/chemicals`);
        const palette = document.getElementById('chemical-palette');
        palette.innerHTML = '';
        
        response.data.forEach(chem => {
            const div = document.createElement('div');
            div.className = 'bg-slate-700 border border-slate-600 rounded p-3 cursor-move hover:border-cyan-500 transition';
            div.draggable = true;
            div.style.backgroundColor = chem.color;
            div.style.opacity = '0.8';
            div.textContent = chem.name;
            div.dataset.chemical = JSON.stringify(chem);
            
            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', chem.name);
                e.dataTransfer.setData('chemical', JSON.stringify(chem));
            });
            
            palette.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading chemicals:', error);
    }
}

function setupDragAndDrop() {
    const beaker = document.getElementById('beaker');
    const mixedArea = document.getElementById('mixed-chemicals');
    
    beaker.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        beaker.classList.add('border-green-500', 'bg-slate-800/80');
    });
    
    beaker.addEventListener('dragleave', () => {
        beaker.classList.remove('border-green-500', 'bg-slate-800/80');
    });
    
    beaker.addEventListener('drop', (e) => {
        e.preventDefault();
        beaker.classList.remove('border-green-500', 'bg-slate-800/80');
        
        const chemData = e.dataTransfer.getData('chemical');
        const chemName = e.dataTransfer.getData('text/plain');
        
        if (chemData) {
            const chem = JSON.parse(chemData);
            mixedChemicals.push(chem);
            
            const tag = document.createElement('span');
            tag.className = 'bg-slate-700 text-white px-3 py-1 rounded-full text-sm';
            tag.innerHTML = `${chem.name} <span onclick="this.parentElement.remove()" class="ml-2 cursor-pointer">×</span>`;
            mixedArea.appendChild(tag);
        }
    });
}

async function runExperiment() {
    if (mixedChemicals.length === 0) {
        alert('Please add chemicals to the beaker first!');
        return;
    }
    
    try {
        const chemNames = mixedChemicals.map(c => c.name);
        const response = await axios.post(`${API_BASE}/run-experiment`, {
            chemicals: chemNames,
            type: currentLab.toLowerCase(),
            tools: selectedLabTools
        });
        
        const timestamp = new Date(response.data.timestamp);
        
        // Generate tool effects descriptions
        let toolEffects = '';
        let toolModifiers = '';
        if (selectedLabTools.length > 0) {
            toolEffects = '<p class="text-sm mt-3 border-t border-slate-700 pt-3"><strong>Tools Used:</strong></p>';
            selectedLabTools.forEach(tool => {
                let modifier = '';
                if (tool === 'Bunsen Burner') modifier = ' - Accelerated reaction with heat';
                else if (tool === 'Thermometer') modifier = ' - Temperature monitored';
                else if (tool === 'Microscope') modifier = ' - Detailed observation enabled';
                else if (tool === 'Stirring Rod') modifier = ' - Uniform mixing achieved';
                else if (tool === 'Pipette') modifier = ' - Precise chemical transfer';
                else if (tool === 'pH Meter') modifier = ' - pH level detected';
                else if (tool === 'Gloves') modifier = ' - Safety protection active';
                
                toolEffects += `<p class="text-xs text-slate-300 ml-2">• ${tool}${modifier}</p>`;
            });
        }
        
        const resultsDiv = document.getElementById('results-display');
        resultsDiv.innerHTML = `
            <div class="space-y-3">
                <h4 class="font-bold text-green-400">✅ Experiment Result</h4>
                <p><strong>Chemicals Mixed:</strong> ${chemNames.join(', ')}</p>
                <p><strong>Observation:</strong> <span class="text-yellow-300">${response.data.observation}</span></p>
                <p><strong>Result:</strong> ${response.data.result}</p>
                ${response.data.safety ? `<p><strong>⚠️ Safety:</strong> ${response.data.safety}</p>` : ''}
                ${toolEffects}
                <p class="text-xs text-slate-400 mt-2">Time: ${timestamp.toLocaleTimeString()}</p>
            </div>
        `;
        
        // Auto-generate finding with tools
        const finding = {
            title: `${currentLab} Experiment: ${response.data.name || chemNames[0]}`,
            content: `Experimental Run - Mixed chemicals in ${currentLab} lab${selectedLabTools.length > 0 ? ' using ' + selectedLabTools.join(', ') : ''}`,
            observations: response.data.observation,
            conclusion: response.data.result,
            chemicals: chemNames.join(', '),
            tools: selectedLabTools.length > 0 ? selectedLabTools.join(', ') : 'None',
            safety: response.data.safety || 'Standard lab safety',
            timestamp: timestamp.toLocaleString(),
            timeOnly: timestamp.toLocaleTimeString(),
            lab: currentLab
        };
        
        findings.push(finding);
        displayFindings();
        
        // Auto-scroll to notebook tab hint
        const notebookBtn = document.querySelector('[onclick*="notebook"]');
        if (notebookBtn) {
            const tooltip = document.createElement('div');
            tooltip.className = 'fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse z-50';
            tooltip.textContent = '📝 New finding generated! View in Notebook →';
            document.body.appendChild(tooltip);
            setTimeout(() => tooltip.remove(), 3000);
        }
    } catch (error) {
        console.error('Error running experiment:', error);
    }
}

function clearBeaker() {
    mixedChemicals = [];
    document.getElementById('mixed-chemicals').innerHTML = '';
    document.getElementById('results-display').innerHTML = '<p class="text-slate-500">Results will appear here...</p>';
}

async function saveFinding() {
    const title = document.getElementById('finding-title').value;
    const content = document.getElementById('finding-content').value;
    const observations = document.getElementById('finding-observations').value;
    const conclusion = document.getElementById('finding-conclusion').value;
    
    if (!title || !content) {
        alert('Please enter a title and findings!');
        return;
    }
    
    try {
        const timestamp = new Date();
        const finding = {
            title,
            content,
            observations,
            conclusion,
            lab: currentLab,
            chemicals: mixedChemicals.map(c => c.name).join(', '),
            experiment: mixedChemicals.map(c => c.name).join(', '),
            timestamp: timestamp.toLocaleString(),
            timeOnly: timestamp.toLocaleTimeString(),
            safety: 'Standard lab safety'
        };
        
        findings.push(finding);
        displayFindings();
        
        // Clear form
        document.getElementById('finding-title').value = '';
        document.getElementById('finding-content').value = '';
        document.getElementById('finding-observations').value = '';
        document.getElementById('finding-conclusion').value = '';
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        successDiv.textContent = '✅ Finding saved successfully!';
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 2000);
    } catch (error) {
        console.error('Error saving finding:', error);
        alert('Error saving finding. Please try again.');
    }
}

function displayFindings() {
    const listDiv = document.getElementById('findings-list');
    const archiveDiv = document.getElementById('archive-grid');
    
    if (findings.length === 0) {
        listDiv.innerHTML = '<p class="text-slate-500">No findings yet...</p>';
        archiveDiv.innerHTML = '';
        return;
    }
    
    listDiv.innerHTML = findings.map((f, i) => `
        <div class="bg-slate-700 p-3 rounded cursor-pointer hover:bg-slate-600 transition border-l-4 border-green-500" onclick="scrollToArchive(${i})">
            <p class="font-bold text-green-300 text-sm">${f.title}</p>
            <p class="text-xs text-slate-400">${f.timestamp ? new Date(f.timestamp).toLocaleDateString() : new Date().toLocaleDateString()}</p>
        </div>
    `).join('');
    
    archiveDiv.innerHTML = findings.map((f, i) => `
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4 hover:border-green-500/50 transition">
            <div class="mb-3">
                <h4 class="font-bold text-green-400 mb-1">${f.title}</h4>
                <p class="text-xs text-slate-400">📅 ${f.timestamp ? new Date(f.timestamp).toLocaleDateString() : new Date().toLocaleDateString()} | ⏰ ${f.timeOnly || (f.timestamp ? new Date(f.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString())}</p>
            </div>
            
            <div class="bg-slate-900/50 rounded p-3 text-xs space-y-2 mb-3">
                ${f.chemicals ? `<p><span class="text-cyan-400 font-bold"><i class="fas fa-flask-vial"></i> Chemicals Mixed:</span> ${f.chemicals}</p>` : f.experiment ? `<p><span class="text-cyan-400 font-bold"><i class="fas fa-flask-vial"></i> Chemicals Mixed:</span> ${f.experiment}</p>` : ''}
                
                ${f.tools && f.tools !== 'None' ? `<p><span class="text-blue-400 font-bold"><i class="fas fa-tools"></i> Tools Used:</span> ${f.tools}</p>` : ''}
                
                ${f.observations ? `<p><span class="text-yellow-400 font-bold"><i class="fas fa-eye"></i> Observation:</span> ${f.observations}</p>` : ''}
                
                ${f.conclusion ? `<p><span class="text-green-400 font-bold"><i class="fas fa-check"></i> Result:</span> ${f.conclusion}</p>` : ''}
                
                ${f.safety ? `<p><span class="text-orange-400 font-bold"><i class="fas fa-triangle-exclamation"></i> Safety:</span> ${f.safety}</p>` : ''}
                
                ${f.lab ? `<p><span class="text-purple-400 font-bold"><i class="fas fa-flask"></i> Lab:</span> ${f.lab}</p>` : ''}
            </div>
            
            ${f.content ? `<p class="text-xs text-slate-400 mb-3"><strong>Notes:</strong> ${f.content}</p>` : ''}
            
            <button onclick="deleteFinding(${i})" class="w-full bg-red-600/50 hover:bg-red-600 text-white text-xs py-1 rounded transition"><i class="fas fa-trash"></i> Delete</button>
        </div>
    `).join('');
}

function deleteFinding(index) {
    if (confirm('Delete this finding?')) {
        findings.splice(index, 1);
        displayFindings();
    }
}

function scrollToArchive(index) {
    document.querySelector('#archive-grid').children[index].scrollIntoView({ behavior: 'smooth' });
}

// Close modals on outside click
window.onclick = function(event) {
    const reactionModal = document.getElementById('reaction-modal');
    const toolModal = document.getElementById('tool-modal');
    if (event.target === reactionModal) {
        reactionModal.classList.add('hidden');
    }
    if (event.target === toolModal) {
        toolModal.classList.add('hidden');
    }
}
