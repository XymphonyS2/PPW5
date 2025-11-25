class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.memoryIndicator = document.getElementById('memoryIndicator');
        
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForNewValue = false;
        this.memory = 0;
        
        this.initializeButtons();
        this.updateDisplay();
    }
    
    initializeButtons() {
        for (let i = 0; i <= 9; i++) {
            const btn = document.getElementById(i === 0 ? 'zero' : ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][i - 1]);
            if (btn) {
                btn.addEventListener('click', () => this.inputNumber(i.toString()));
            }
        }
        
        const decimalBtn = document.getElementById('decimal');
        if (decimalBtn) {
            decimalBtn.addEventListener('click', () => this.inputDecimal());
        }
    }
    
    inputNumber(num) {
        if (this.waitingForNewValue) {
            this.currentValue = num;
            this.waitingForNewValue = false;
        } else {
            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }
        this.updateDisplay();
    }
    
    inputDecimal() {
        if (this.waitingForNewValue) {
            this.currentValue = '0.';
            this.waitingForNewValue = false;
        } else if (this.currentValue.indexOf('.') === -1) {
            this.currentValue += '.';
        }
        this.updateDisplay();
    }
    
    updateDisplay() {
        let displayValue = this.currentValue;
        
        if (displayValue.includes('.')) {
            const parts = displayValue.split('.');
            displayValue = this.formatNumber(parts[0]) + '.' + parts[1];
        } else {
            displayValue = this.formatNumber(displayValue);
        }
        
        this.display.textContent = displayValue;
    }
    
    formatNumber(num) {
        const number = parseFloat(num);
        if (isNaN(number)) return num;
        
        if (Math.abs(number) >= 1e15) {
            return number.toExponential(5);
        }
        
        return number.toLocaleString('id-ID', {
            maximumFractionDigits: 10,
            useGrouping: false
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});