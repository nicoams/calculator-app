class CalculatorController {
    constructor() {
        this._lastOperator = ''
        this._lastNumber = ''
        this._operation = []
        this._countEqual = 0
        this._countClearEntry = 0
        this._displayCalcEl = document.querySelector('.screen')
        this.currentPlace
        this.initialize()
        this.initButtonsEvents()
        this.initKeyboard()
    }

    pasteFromClipboard() {
        document.addEventListener('paste', (e) => {
            let text = e.clipboardData.getData('Text')
            this.displayCalc = parseFloat(text)
            this.addOperation(text)
        })
    }

    copyToClipboard() {
        let input = document.createElement('input')
        input.value = this.displayCalc
        document.body.appendChild(input)
        input.select()
        document.execCommand('Copy')
        input.remove()
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML
    }

    set displayCalc(value) {
        let num = parseFloat(value)
        let numFormatted = num.toLocaleString(undefined, {
            maximumFractionDigits: 4,
        })

        if (numFormatted.length > 10) {
            this.setError()
            return false
        }
        this._displayCalcEl.innerHTML = numFormatted
    }

    initialize() {
        this.setLastNumberToDisplay()
        this.pasteFromClipboard()
    }

    initKeyboard() {
        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'Escape':
                    this.clearAll()
                    break
                case 'Backspace':
                    this.clearEntry()
                    break
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key)
                    break
                case '.':
                case ',':
                    this.addDot('.')
                    break
                case 'Enter':
                case '=':
                    this.calc()
                    break
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key))
                    break
                case 'c':
                    if (e.ctrlKey) this.copyToClipboard()
                    break
            }
        })
    }

    initButtonsEvents() {
        let buttons = document.getElementsByTagName('button')

        Array.from(buttons).forEach((btn, index) => {
            btn.addEventListener('click', () => {
                let textBtn = btn.innerHTML
                console.log(textBtn)
                this.execBtn(btn.innerHTML)
            })
        })
    }

    setError() {
        this.displayCalc = 'Error'
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1]
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value
    }

    isOperator(value) {
        return ['+', '-', '*', '/', '%'].indexOf(value) > -1
    }

    pushOperation(value) {
        this._operation.push(value)
        if (this._operation.length > 3) {
            this.calc()
        }
    }

    getResult() {
        try {
            return eval(this._operation.join(''))
        } catch (e) {
            setTimeout(() => {
                this.setError()
            }, 1)
        }
    }

    calc() {
        if (this.displayCalc == 0) {
            return
        } else {
            let last = ''
            this._lastOperator = this.getLastItem()
            if (this._operation.length < 3) {
                let firstItem = this._operation[0]
                this._operation = [firstItem, this._lastOperator, this._lastNumber]
            }
            if (this._operation.length > 3) {
                last = this._operation.pop()
                this._lastNumber = this.getResult()
            } else if (this._operation.length == 3) {
                this._lastNumber = this.getLastItem(false)
            }

            let result = this.getResult()
            if (last == '%') {
                result /= 100
                this._operation = [result]
            } else {
                this._operation = [result]
                if (last) this._operation.push(last)
            }
            this.setLastNumberToDisplay()
        }
    }

    getLastItem(isOperator = true) {
        let lastItem
        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i]
                break
            }
        }
        if (!lastItem) {
            lastItem = isOperator ? this._lastOperator : this._lastNumber
        }
        return lastItem
    }

    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false)

        if (!lastNumber) lastNumber = 0

        this.displayCalc = lastNumber
    }

    addOperation(value) {
        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value)
            } else {
                this.pushOperation(value)
                this.setLastNumberToDisplay()
            }
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value)
            } else {
                let newValue = this.getLastOperation().toString() + value.toString()
                this.setLastOperation(newValue)
                this.setLastNumberToDisplay()
            }
        }

        console.log(this._operation)
    }

    addDot() {
        let lastOperation = this.getLastOperation()
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return
        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.')
        } else {
            this.setLastOperation(lastOperation.toString() + '.')
        }
        this.setLastNumberToDisplay()
        console.log(lastOperation)
    }

    clearAll() {
        this._operation = []
        this._lastOperator = ''
        this._lastNumber = ''
        this.setLastNumberToDisplay()
    }

    clearEntry() {
        this._operation.pop()
        this.setLastNumberToDisplay()
    }

    del() {
        if (this._countEqual > 0 || this._countClearEntry >= 2) {
            this.clearAll()
            this._countEqual = 0
            this._countClearEntry = 0
        } else {
            this.clearEntry()
        }
    }

    execBtn(value) {
        switch (value) {
            case 'RESET':
                this.clearAll()
                break
            case 'DEL':
                this._countClearEntry += 1
                this.del()
                break
            case '+':
                this.addOperation('+')
                break
            case '-':
                this.addOperation('-')
                break
            case '/':
                this.addOperation('/')
                break
            case 'x':
            case '*':
                this.addOperation('*')
                break
            case '.':
                this.addDot('.')
                break
            case '=':
                this.calc()
                this._countEqual += 1
                break
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value))
                break
            default:
                this.setError()
                break
        }
    }
}
