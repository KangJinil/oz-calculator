import calculateOperation from './operations.js';
import { resetDisplay, setDisplay, subDisplay, appendNumber, setOperator, VALID_NUMBERS, VALID_OPERATORS } from './input.js';
import { showError, removeError } from './error.js';
import saveHistory from './history.js';

let history = [];
let currentInput = "";
let firstNumber = null;
let operator = null;
let isError = false;

export { calculateOperation, resetDisplay, setDisplay, subDisplay, appendNumber, setOperator, showError, removeError, saveHistory, VALID_NUMBERS, VALID_OPERATORS, history, currentInput, firstNumber, operator, isError };

export default function calculate() {
    try {
        if (firstNumber === null || operator === null || !currentInput) {
            isError = true;
            throw new Error("ƒ∞– Dî\ t Äqi»‰.");
        }
        const secondNumber = Number(currentInput);
        if (isNaN(secondNumber)) {
            isError = true;
            throw new Error(" ®\ +ê| Ö%X8î.");
        }
        const result = calculateOperation(firstNumber, secondNumber, operator);
        saveHistory(firstNumber, operator, secondNumber, result, history);
        const resultElement = document.getElementById("result");
        resultElement.classList.remove("d-none", "alert-danger");
        resultElement.classList.add("alert-info");
        resultElement.textContent = `∞¸: ${result}`;
        resetDisplay();
        firstNumber = null;
        operator = null;
        currentInput = "";
    } catch (error) {
        showError(error.message);
    }
}