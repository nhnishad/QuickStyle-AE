const csInterface = new CSInterface();
let savedColors = [];
let isLocked = true;

// HARDCODED FONTS
const PRESET_FONTS = [
    { name: "Helvetica Now", postscript: "HelveticaNowDisplay-Regular" },
    { name: "Dela Gothic", postscript: "DelaGothicOne-Regular" },
    { name: "Xamire", postscript: "Xamire-Regular" },
    { name: "IvyPresto Display", postscript: "IvyPrestoDisplay-SemiBoldItalic" },
    { name: "Monigue", postscript: "Monigue-Regular" },
    { name: "Bebas Neue", postscript: "BebasNeue-Regular" }
];


// HARDCODED EFFECTS
const PRESET_EFFECTS = [
    { name: "Fill", matchName: "ADBE Fill" },
    { name: "Gradient Ramp", matchName: "ADBE Ramp" },
    { name: "Tint", matchName: "ADBE Tint" },
    { name: "Glow", matchName: "ADBE Glo2" },
    { name: "Drop Shadow", matchName: "ADBE Drop Shadow" },
    { name: "Gaussian Blur", matchName: "ADBE Gaussian Blur 2" },
    { name: "Curves", matchName: "ADBE CurvesCustom" },
    { name: "Hue/Saturation", matchName: "ADBE HUE SATURATION" },
    { name: "Brightness & Contrast", matchName: "ADBE Brightness & Contrast 2" },
    { name: "Sharpen", matchName: "ADBE Sharpen" },
    { name: "Find Edges", matchName: "ADBE Find Edges" },
    { name: "Noise", matchName: "ADBE Noise" }
];

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    loadColors();
    setupEvents();
    setupDropdowns();
    csInterface.setBackgroundColor(38, 38, 38);
});

function setupEvents() {
    const hexInput = document.getElementById('hexInput');
    const addBtn = document.getElementById('addBtn');
    const lockBtn = document.getElementById('lockBtn');
    const fontDropdown = document.getElementById('fontDropdown');
    const effectsDropdown = document.getElementById('effectsDropdown');
    
    // Hex input validation
    hexInput.addEventListener('input', (e) => {
        let value = e.target.value;
        
        if (value.length > 0 && value[0] !== '#') {
            value = '#' + value;
            e.target.value = value;
        }
        
        e.target.value = value.toUpperCase();
    });
    
    // Add color
    addBtn.addEventListener('click', addColor);
    
    hexInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addColor();
        }
    });
    
    // Lock/Unlock
    lockBtn.addEventListener('click', toggleLock);
    
    // Font dropdown
    fontDropdown.addEventListener('change', (e) => {
        const fontPostscript = e.target.value;
        if (fontPostscript) {
            applyFont(fontPostscript);
            fontDropdown.value = ''; // Reset dropdown
        }
    });
    
    // Effects dropdown
    effectsDropdown.addEventListener('change', (e) => {
        const effectMatchName = e.target.value;
        if (effectMatchName) {
            applyEffect(effectMatchName);
            effectsDropdown.value = ''; // Reset dropdown
        }
    });
}

// Setup dropdowns
function setupDropdowns() {
    // Font dropdown
    const fontDropdown = document.getElementById('fontDropdown');
    fontDropdown.innerHTML = '<option value="">Select Font</option>';
    PRESET_FONTS.forEach(font => {
        const option = document.createElement('option');
        option.value = font.postscript;
        option.textContent = font.name;
        fontDropdown.appendChild(option);
    });
    
    // Effects dropdown
    const effectsDropdown = document.getElementById('effectsDropdown');
    effectsDropdown.innerHTML = '<option value="">Add Effect</option>';
    PRESET_EFFECTS.forEach(effect => {
        const option = document.createElement('option');
        option.value = effect.matchName;
        option.textContent = effect.name;
        effectsDropdown.appendChild(option);
    });
}

// Apply Effect
function applyEffect(effectMatchName) {
    csInterface.evalScript(`applyEffectToLayer("${effectMatchName}")`, (result) => {
        if (result === 'success') {
            const effect = PRESET_EFFECTS.find(e => e.matchName === effectMatchName);
            showStatus('Added ' + (effect ? effect.name : 'effect'), 'success');
        } else if (result === 'no_layer') {
            showStatus('Select a layer', 'error');
        } else {
            showStatus('Could not add effect', 'error');
        }
    });
}

// Color Management
function addColor() {
    const hexInput = document.getElementById('hexInput');
    let color = hexInput.value.trim();
    
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
        if (/^[0-9A-F]{6}$/i.test(color)) {
            color = '#' + color;
        } else {
            showStatus('Invalid hex color', 'error');
            hexInput.focus();
            return;
        }
    }
    
    color = color.toUpperCase();
    
    if (savedColors.includes(color)) {
        showStatus('Color already exists', 'error');
        return;
    }
    
    savedColors.push(color);
    saveColors();
    renderColors();
    
    hexInput.value = '';
    showStatus('Added ' + color, 'success');
}

function toggleLock() {
    const lockBtn = document.getElementById('lockBtn');
    isLocked = !isLocked;
    
    if (isLocked) {
        lockBtn.classList.add('locked');
        lockBtn.title = 'Unlock to Delete';
        document.body.classList.remove('unlocked');
        showStatus('Locked');
    } else {
        lockBtn.classList.remove('locked');
        lockBtn.title = 'Lock to Prevent Deletion';
        document.body.classList.add('unlocked');
        showStatus('Unlocked - Can delete');
    }
}

function renderColors() {
    const grid = document.getElementById('colorGrid');
    grid.innerHTML = '';
    
    savedColors.forEach((color, i) => {
        const dot = document.createElement('div');
        dot.className = 'color-dot';
        dot.style.backgroundColor = color;
        dot.title = color;
        
        dot.onclick = () => applyColor(color, dot);
        
        const del = document.createElement('button');
        del.className = 'delete-btn';
        del.innerHTML = '×';
        del.title = 'Delete';
        del.onclick = (e) => {
            e.stopPropagation();
            if (!isLocked) {
                deleteColor(i);
            }
        };
        
        dot.appendChild(del);
        grid.appendChild(dot);
    });
}

function deleteColor(index) {
    const color = savedColors[index];
    savedColors.splice(index, 1);
    saveColors();
    renderColors();
    showStatus('Deleted ' + color);
}

function applyColor(hex, element) {
    const rgb = hexToRgb(hex);
    
    element.classList.add('applied');
    setTimeout(() => element.classList.remove('applied'), 300);
    
    csInterface.evalScript(`smartApplyColor(${rgb.r}, ${rgb.g}, ${rgb.b})`, (result) => {
        if (result === 'success') {
            showStatus('Applied ' + hex);
        } else if (result === 'no_layer') {
            showStatus('Select a layer', 'error');
        }
    });
}

// Font Management
function applyFont(fontPostscript) {
    csInterface.evalScript(`applyFontToText("${fontPostscript}")`, (result) => {
        if (result === 'success') {
            const font = PRESET_FONTS.find(f => f.postscript === fontPostscript);
            showStatus('Applied ' + (font ? font.name : fontPostscript), 'success');
        } else if (result === 'no_text') {
            showStatus('Select a text layer', 'error');
        } else {
            showStatus('Could not apply font', 'error');
        }
    });
}

// Storage
function saveColors() {
    localStorage.setItem('aeColors', JSON.stringify(savedColors));
}

function loadColors() {
    const stored = localStorage.getItem('aeColors');
    if (stored) {
        try {
            savedColors = JSON.parse(stored);
            renderColors();
        } catch (e) {
            savedColors = [];
        }
    }
}

// Utilities
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : null;
}

function showStatus(msg, type = '') {
    const status = document.getElementById('status');
    status.textContent = msg;
    status.className = 'status show ' + type;
    
    clearTimeout(window.statusTimeout);
    window.statusTimeout = setTimeout(() => {
        status.className = 'status';
        status.textContent = '';
    }, 2000);
}