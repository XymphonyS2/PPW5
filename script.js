class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.memoryIndicator = document.getElementById('memoryIndicator');
        this.historyPanel = document.getElementById('historyPanel');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForNewValue = false;
        this.memory = 0;
        this.history = [];
        
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
        
        document.getElementById('add').addEventListener('click', () => this.setOperation('+'));
        document.getElementById('subtract').addEventListener('click', () => this.setOperation('-'));
        document.getElementById('multiply').addEventListener('click', () => this.setOperation('×'));
        document.getElementById('divide').addEventListener('click', () => this.setOperation('÷'));
        
        document.getElementById('equals').addEventListener('click', () => this.calculate());
        
        document.getElementById('c').addEventListener('click', () => this.clear());
        document.getElementById('ce').addEventListener('click', () => this.clearEntry());
        
        document.getElementById('mc').addEventListener('click', () => this.memoryClear());
        document.getElementById('mr').addEventListener('click', () => this.memoryRecall());
        document.getElementById('mPlus').addEventListener('click', () => this.memoryAdd());
        document.getElementById('mMinus').addEventListener('click', () => this.memorySubtract());
        
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
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
    
    setOperation(op) {
        if (this.previousValue !== null && !this.waitingForNewValue) {
            this.calculate();
        }
        
        this.previousValue = parseFloat(this.currentValue);
        this.operation = op;
        this.waitingForNewValue = true;
    }
    
    calculate() {
        if (this.previousValue === null || this.operation === null) {
            return;
        }
        
        const current = parseFloat(this.currentValue);
        let result;
        const expression = `${this.previousValue} ${this.operation} ${current}`;
        
        try {
            switch (this.operation) {
                case '+':
                    result = this.previousValue + current;
                    break;
                case '-':
                    result = this.previousValue - current;
                    break;
                case '×':
                    result = this.previousValue * current;
                    break;
                case '÷':
                    if (current === 0) {
                        throw new Error('Pembagian dengan nol tidak diperbolehkan');
                    }
                    result = this.previousValue / current;
                    break;
                default:
                    return;
            }
            
            result = Math.round(result * 100000000) / 100000000;
            
            this.addToHistory(expression, result);
            
            this.currentValue = result.toString();
            this.previousValue = null;
            this.operation = null;
            this.waitingForNewValue = true;
            this.updateDisplay();
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForNewValue = false;
        this.updateDisplay();
    }
    
    clearEntry() {
        this.currentValue = '0';
        this.waitingForNewValue = false;
        this.updateDisplay();
    }
    
    memoryClear() {
        this.memory = 0;
        this.updateMemoryIndicator();
    }
    
    memoryRecall() {
        this.currentValue = this.memory.toString();
        this.waitingForNewValue = false;
        this.updateDisplay();
    }
    
    memoryAdd() {
        this.memory += parseFloat(this.currentValue);
        this.updateMemoryIndicator();
    }
    
    memorySubtract() {
        this.memory -= parseFloat(this.currentValue);
        this.updateMemoryIndicator();
    }
    
    updateMemoryIndicator() {
        if (this.memory !== 0) {
            this.memoryIndicator.classList.add('active');
        } else {
            this.memoryIndicator.classList.remove('active');
        }
    }
    
    addToHistory(expression, result) {
        const historyItem = {
            expression: expression,
            result: result,
            full: `${expression} = ${result}`
        };
        
        this.history.unshift(historyItem);
        
        if (this.history.length > 5) {
            this.history.pop();
        }
        
        this.updateHistory();
    }
    
    updateHistory() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<p class="text-gray-400 text-center py-2 italic">Belum ada riwayat</p>';
            this.historyPanel.classList.remove('show');
        } else {
            this.historyPanel.classList.add('show');
            this.historyList.innerHTML = '';
            
            this.history.forEach((item, index) => {
                const historyItem = document.createElement('div');
                historyItem.className = 'py-1.5 border-b border-gray-200 cursor-pointer transition-colors hover:text-blue-600 text-gray-600';
                historyItem.textContent = item.full;
                historyItem.addEventListener('click', () => {
                    this.currentValue = item.result.toString();
                    this.waitingForNewValue = false;
                    this.updateDisplay();
                });
                this.historyList.appendChild(historyItem);
            });
        }
    }
    
    clearHistory() {
        this.history = [];
        this.updateHistory();
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
    
    displayError(message) {
        this.display.textContent = message;
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForNewValue = false;
        
        setTimeout(() => {
            this.updateDisplay();
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});