const nums=document.querySelectorAll(".number");
const buttons = document.querySelectorAll(".buttonContainer");
const display = document.querySelector("#display");
const decimalButton = document.querySelector("#dot");
const clearall = document.querySelector("#Escape");
let mathExpression=[];
const operators = /\+|-|x|\*|\/|÷/;
let currentNumber = "";
let divideByZero = false;
let no = true;
let a=1;

window.addEventListener('keydown', (e) => {
    let keyInput = e.key;
    let validInput = /^[0-9]*$|\.|Backspace|Enter|Escape/;
    nums.forEach(num => {
        if (num.textContent===e.key) {
            num.classList.add('buttonpressed');
            setTimeout(() => {
                num.classList.remove('buttonpressed');
            }, 200)
        }
    })
    if (validInput.test(keyInput) || operators.test(keyInput)) {
        if (keyInput !== '.' || noDecimal) {
            callCalculator(keyInput);
        }
    }
})

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (button.textContent !== '.' || noDecimal){
        let buttonInput = e.target.textContent;
        callCalculator(buttonInput);
    }
    })
})

function callCalculator(input) {
   
    if (!(input === '⌫' || input === 'Backspace')) {
        appendDisplay(input);
    }
    //if operator then save the number and operator
    if (operators.test(input)) {    
        //push object into an array
        mathExpression.push({ number: currentNumber, operator: input });
        currentNumber = "";
    } else if (input === "AC"||input ==='Escape') {
        clearDisplay();
    } else if (input === "⌫" || input === "Backspace") {
        backspaceExpression();
        backspaceDisplay();
    } else if (input === "=" || input === "Enter") {
        mathExpression.push({ number: currentNumber });
        //call operate on the numbers: *and / operater, then + -
        evaluateExpression:
            while (mathExpression.some(checkMultiplyDivide)) {
                let multOrDivideIndex = mathExpression.findIndex(checkMultiplyDivide);
                let sum = sumOfSubExpression(multOrDivideIndex);
                if (divideByZero === true) {
                    break evaluateExpression;
                }
                updateMathExpression(sum, multOrDivideIndex);
            }
            while (mathExpression.length > 1) {
                let beginningIndex = 0;
                let sum = sumOfSubExpression(beginningIndex);
                updateMathExpression(sum, beginningIndex);
            }
            dispayFinalNumber();
    } else {
        currentNumber += input;
    }
    checkForDecimal(currentNumber.toString());
}

function dispayFinalNumber() {
    mathExpression[0].number = roundToThousandths(mathExpression[0].number);
    currentNumber = mathExpression[0].number;
    display.textContent = currentNumber;
    mathExpression = [];
}

function backspaceExpression() {
    currentNumber = currentNumber.toString();
    if (currentNumber.length > 0) { //if current number isn't empty then backspace current number
    currentNumber = currentNumber.slice(0, currentNumber.length - 1);
} else if (mathExpression.length !== 0) {
    //if operator isn't empty delete that
    let lastIndex = mathExpression.length - 1;
    //check operator and delete it
        currentNumber = mathExpression[lastIndex].number;
        mathExpression.pop();
    }
}

function backspaceDisplay() {
    displayLength = display.textContent.length;
    display.textContent = display.textContent.slice(0, displayLength - 1);
}

//limit user to write more than one dot
function checkForDecimal(number) {
    if (number.includes(".")) {
        // decimalButton.disabled = true;
        noDecimal = false;
    } else {
        decimalButton.disabled = false;
        noDecimal = true;
    }
}

function divisionByZero() {
    display.textContent = "Can't divide by 0, CLEAR display!";
    divideByZero = true;
}

function clearDisplay() {
    display.textContent = "";
    currentNumber = "";
    mathExpression = [];
    divideByZero = false;
    decimalButton.disabled = false;
}

function roundToThousandths(number) {

    return Math.round(number * 1000) / 1000;
}

function sumOfSubExpression(index) {
 
    let current = mathExpression[index];
    let second = mathExpression[index + 1];
    //check number is not divided by zero
    if ((current.operator == '÷' || current.operator == '/') && second.number == 0) {
        divisionByZero();
    }
    let sum = operate(current.number, current.operator, second.number);
    return sum;
}

function updateMathExpression(newNumber, currentIndex) {
    mathExpression[currentIndex + 1].number = newNumber;
    mathExpression = [...mathExpression.slice(0, currentIndex),
        ...mathExpression.slice(currentIndex + 1)
    ];
}

function checkMultiplyDivide(obj) {
    return obj.operator === "x" || obj.operator === "÷" || obj.operator === "*" || obj.operator === "/";
}

function appendDisplay(anotherValue) {
    display.textContent += anotherValue;
}

function add(a, b) {
    return parseFloat(a) + parseFloat(b);
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(first, operator, second) {
    let result;
    switch (operator) {
        case '+':
            result = add(first, second);
            break;
        case '-':
            result = subtract(first, second);
            break;
        case 'x':
        case '*':
            result = multiply(first, second);
            break;
        case '÷':
        case '/':
            result = divide(first, second);
            break;
        default:
            result = "That operator is not recongnized, please try again.";
            break;
    }
    return result;
    
}