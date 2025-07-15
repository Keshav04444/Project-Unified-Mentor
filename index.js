let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

// Initialize calculator
function init() {
    display.textContent = '0';
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
}

// Clear display and reset calculator
function clearDisplay() {
    init();
}

// Clear current entry
function clearEntry() {
    currentInput = '';
    display.textContent = '0';
}

// Append number to display
function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '' && num === '0') {
        return; // Don't add leading zeros
    }
    
    currentInput += num;
    display.textContent = currentInput;
}

// Append decimal point
function appendDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '') {
        currentInput = '0';
    }
    
    if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
        display.textContent = currentInput;
    }
}

// Append operator
function appendOperator(op) {
    if (currentInput === '' && previousInput === '') {
        return; // Don't allow operator as first input
    }
    
    if (currentInput === '' && previousInput !== '') {
        operator = op; // Change operator if no new number entered
        return;
    }
    
    if (previousInput !== '' && currentInput !== '' && operator !== '') {
        calculate(); // Perform calculation if there's a pending operation
    }
    
    previousInput = currentInput || previousInput;
    operator = op;
    currentInput = '';
    shouldResetDisplay = false;
}

// Perform calculation
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    
    try {
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    throw new Error('Division by zero');
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Handle very large or very small numbers
        if (!isFinite(result)) {
            throw new Error('Result is too large');
        }
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        display.textContent = result.toString();
        currentInput = result.toString();
        previousInput = '';
        operator = '';
        shouldResetDisplay = true;
        
    } catch (error) {
        showError(error.message);
    }
}

// Show error message
function showError(message) {
    display.textContent = 'Error';
    display.classList.add('error');
    
    setTimeout(() => {
        display.classList.remove('error');
        init();
    }, 2000);
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    }
    // Operators
    else if (key === '+') {
        appendOperator('+');
    }
    else if (key === '-') {
        appendOperator('-');
    }
    else if (key === '*') {
        appendOperator('*');
    }
    else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        appendOperator('/');
    }
    // Decimal point
    else if (key === '.') {
        appendDecimal();
    }
    // Equals
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    // Clear
    else if (key === 'Escape') {
        clearDisplay();
    }
    // Backspace
    else if (key === 'Backspace') {
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            display.textContent = currentInput || '0';
        }
    }
});

// Initialize calculator on page load
init();
