// Calculator variables
let expression = '';
let result = '0';
let history = [];
let ans = 0;
let calcMode = 'basic';
let currentMode = 'calculator';
let currentUnitCategory = 'length';

// Unit conversion data
const unitData = {
    length: {
        title: '📏 Length Converter',
        units: {
            'Meter': 1,
            'Kilometer': 0.001,
            'Centimeter': 100,
            'Millimeter': 1000,
            'Mile': 0.000621371,
            'Yard': 1.09361,
            'Foot': 3.28084,
            'Inch': 39.3701,
            'Nautical Mile': 0.000539957
        }
    },
    weight: {
        title: '⚖️ Weight Converter',
        units: {
            'Kilogram': 1,
            'Gram': 1000,
            'Milligram': 1000000,
            'Pound': 2.20462,
            'Ounce': 35.274,
            'Ton': 0.001,
            'Stone': 0.157473
        }
    },
    temperature: {
        title: '🌡️ Temperature Converter',
        units: {
            'Celsius': 'C',
            'Fahrenheit': 'F',
            'Kelvin': 'K'
        },
        custom: true
    },
    area: {
        title: '📐 Area Converter',
        units: {
            'Square Meter': 1,
            'Square Kilometer': 0.000001,
            'Square Centimeter': 10000,
            'Square Mile': 3.861e-7,
            'Square Yard': 1.19599,
            'Square Foot': 10.7639,
            'Square Inch': 1550,
            'Hectare': 0.0001,
            'Acre': 0.000247105
        }
    },
    volume: {
        title: '🧊 Volume Converter',
        units: {
            'Liter': 1,
            'Milliliter': 1000,
            'Cubic Meter': 0.001,
            'Cubic Centimeter': 1000,
            'Gallon (US)': 0.264172,
            'Gallon (UK)': 0.219969,
            'Quart': 1.05669,
            'Pint': 2.11338,
            'Cup': 4.22675,
            'Fluid Ounce': 33.814
        }
    },
    speed: {
        title: '🏃 Speed Converter',
        units: {
            'Meter/Second': 1,
            'Kilometer/Hour': 3.6,
            'Mile/Hour': 2.23694,
            'Foot/Second': 3.28084,
            'Knot': 1.94384
        }
    },
    time: {
        title: '⏰ Time Converter',
        units: {
            'Second': 1,
            'Minute': 0.0166667,
            'Hour': 0.000277778,
            'Day': 0.0000115741,
            'Week': 0.00000165344,
            'Month': 3.8052e-7,
            'Year': 3.171e-8,
            'Millisecond': 1000,
            'Microsecond': 1000000
        }
    },
    data: {
        title: '💾 Data Storage Converter',
        units: {
            'Byte': 1,
            'Kilobyte': 0.001,
            'Megabyte': 0.000001,
            'Gigabyte': 1e-9,
            'Terabyte': 1e-12,
            'Bit': 8,
            'Kilobit': 0.008,
            'Megabit': 0.000008,
            'Gigabit': 8e-9
        }
    }
};

// Theme toggle
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggle').textContent = '☀️';
    }
    updateHistory();
    setUnitCategory('length');
});

// Mode switching
function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const calculatorSection = document.getElementById('calculatorSection');
    const converterSection = document.getElementById('converterSection');
    
    if (mode === 'calculator') {
        calculatorSection.classList.add('active');
        converterSection.classList.remove('active');
    } else {
        calculatorSection.classList.remove('active');
        converterSection.classList.add('active');
    }
}

function setCalcMode(newMode) {
    calcMode = newMode;
    document.querySelectorAll('.calculator-section .mode-selector .mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const scientificButtons = document.getElementById('scientificButtons');
    if (calcMode === 'scientific') {
        scientificButtons.classList.add('active');
    } else {
        scientificButtons.classList.remove('active');
    }
}

// Unit converter functions
function setUnitCategory(category) {
    currentUnitCategory = category;
    
    document.querySelectorAll('.unit-category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const converterTitle = document.getElementById('converterTitle');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    converterTitle.textContent = unitData[category].title;
    
    // Clear and populate unit selects
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    Object.keys(unitData[category].units).forEach(unit => {
        fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
        toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
    
    // Set different default units
    toUnit.selectedIndex = 1;
    
    // Clear input values
    document.getElementById('fromValue').value = '';
    document.getElementById('toValue').value = '';
    
    updateQuickConversions();
}

function convertUnit() {
    const fromValue = parseFloat(document.getElementById('fromValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const toValueInput = document.getElementById('toValue');
    
    if (isNaN(fromValue)) {
        toValueInput.value = '';
        return;
    }
    
    let result;
    
    if (currentUnitCategory === 'temperature') {
        result = convertTemperature(fromValue, fromUnit, toUnit);
    } else {
        const category = unitData[currentUnitCategory];
        const fromFactor = category.units[fromUnit];
        const toFactor = category.units[toUnit];
        result = (fromValue / fromFactor) * toFactor;
    }
    
    toValueInput.value = result.toFixed(6).replace(/\.?0+$/, '');
    updateQuickConversions();
}

function convertTemperature(value, from, to) {
    let celsius;
    
    // Convert to Celsius first
    if (from === 'Celsius') {
        celsius = value;
    } else if (from === 'Fahrenheit') {
        celsius = (value - 32) * 5/9;
    } else if (from === 'Kelvin') {
        celsius = value - 273.15;
    }
    
    // Convert from Celsius to target unit
    if (to === 'Celsius') {
        return celsius;
    } else if (to === 'Fahrenheit') {
        return celsius * 9/5 + 32;
    } else if (to === 'Kelvin') {
        return celsius + 273.15;
    }
}

function updateQuickConversions() {
    const quickConversions = document.getElementById('quickConversions');
    const fromValue = parseFloat(document.getElementById('fromValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    
    if (isNaN(fromValue)) {
        quickConversions.innerHTML = '<p style="color: var(--text-secondary);">Enter a value to see quick conversions</p>';
        return;
    }
    
    let html = '';
    const category = unitData[currentUnitCategory];
    
    Object.keys(category.units).forEach(unit => {
        if (unit !== fromUnit) {
            let convertedValue;
            if (currentUnitCategory === 'temperature') {
                convertedValue = convertTemperature(fromValue, fromUnit, unit);
            } else {
                const fromFactor = category.units[fromUnit];
                const toFactor = category.units[unit];
                convertedValue = (fromValue / fromFactor) * toFactor;
            }
            html += `<div style="padding: 5px 0; color: var(--text-secondary);">
                ${fromValue} ${fromUnit} = <strong style="color: var(--text-primary);">${convertedValue.toFixed(4).replace(/\.?0+$/, '')}</strong> ${unit}
            </div>`;
        }
    });
    
    quickConversions.innerHTML = html;
}

// Calculator functions
function updateDisplay() {
    document.getElementById('expression').textContent = expression || '';
    document.getElementById('result').textContent = result;
}

function addNumber(num) {
    expression += num;
    updateDisplay();
}

function addOperator(op) {
    if (expression && !isOperator(expression[expression.length - 1])) {
        expression += op;
        updateDisplay();
    }
}

function addFunction(func) {
    expression += func;
    updateDisplay();
}

function insertValue(value) {
    expression += value;
    updateDisplay();
}

function isOperator(char) {
    return ['+', '-', '*', '/', '^', '%'].includes(char);
}

function clearAll() {
    expression = '';
    result = '0';
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function calculate() {
    try {
        let evalExpression = expression;
        
        // Replace mathematical constants
        evalExpression = evalExpression.replace(/π/g, Math.PI);
        evalExpression = evalExpression.replace(/e/g, Math.E);
        
        // Handle factorial
        evalExpression = evalExpression.replace(/(\d+)!/g, (match, num) => {
            return factorial(parseInt(num));
        });
        
        // Handle percentage
        evalExpression = evalExpression.replace(/(\d+)%/g, (match, num) => {
            return parseFloat(num) / 100;
        });
        
        // Replace mathematical functions
        evalExpression = evalExpression.replace(/sin\(/g, 'Math.sin(');
        evalExpression = evalExpression.replace(/cos\(/g, 'Math.cos(');
        evalExpression = evalExpression.replace(/tan\(/g, 'Math.tan(');
        evalExpression = evalExpression.replace(/log\(/g, 'Math.log10(');
        evalExpression = evalExpression.replace(/ln\(/g, 'Math.log(');
        evalExpression = evalExpression.replace(/sqrt\(/g, 'Math.sqrt(');

        // Handle power operator (^)
        evalExpression = evalExpression.replace(/\^/g, '**');

        // Evaluate the expression safely
        const calcResult = eval(evalExpression);

        // Format result
        result = parseFloat(calcResult.toFixed(10)).toString();
        ans = parseFloat(result);

        // Add to history
        addToHistory(expression + " = " + result);

        // Reset expression after evaluation
        expression = "";
        updateDisplay();
    } catch (error) {
        result = "Error";
        updateDisplay();
    }
}

// History functions (moved from original)
function addToHistory(entry) {
    history.push(entry);
    if (history.length > 10) { // Keep history manageable
        history.shift();
    }
    updateHistory();
}

function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = history.map(item => `<div class="history-item">${item}</div>`).join('');
}