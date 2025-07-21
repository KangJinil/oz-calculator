import "./index.js";

const state = {
    currentInput: "",
    firstNumber: null,
    operator: null,
    isError: false,
};

window.appendNumber = async (number) => {
    const module = await import("./index.js");
    if (state.isError) {
        module.removeError();
        module.resetDisplay();
        state.currentInput = "";
        state.isError = false;
    }
    try {
        state.currentInput = module.appendNumber(number, state.currentInput);
    } catch (error) {
        console.error(error.message);
    }
};

window.setOperator = async (op) => {
    const module = await import("./index.js");
    if (state.isError) {
        module.removeError();
        module.resetDisplay();
        state.currentInput = "";
        state.firstNumber = null;
        state.operator = null;
        state.isError = false;
        return;
    }
    try {
        state.operator = module.setOperator(op, state.currentInput);
        state.firstNumber = Number(state.currentInput);
        state.currentInput = "";
        module.resetDisplay();
    } catch (error) {
        console.error(error.message);
    }
};

window.calculate = async () => {
    const module = await import("./index.js");
    if (state.isError) {
        module.removeError();
        module.resetDisplay();
        state.currentInput = "";
        state.firstNumber = null;
        state.operator = null;
        state.isError = false;
        return;
    }

    try {
        if (
            state.firstNumber === null ||
            state.operator === null ||
            !state.currentInput
        ) {
            state.isError = true;
            throw new Error("계산에 필요한 값이 부족합니다.");
        }
        const secondNumber = Number(state.currentInput);
        if (isNaN(secondNumber)) {
            state.isError = true;
            throw new Error("유효한 숫자를 입력하세요.");
        }
        const result = module.calculateOperation(
            state.firstNumber,
            secondNumber,
            state.operator
        );
        module.saveHistory(
            state.firstNumber,
            state.operator,
            secondNumber,
            result,
            module.history
        );
        const resultElement = document.getElementById("result");
        resultElement.classList.remove("d-none", "alert-danger");
        resultElement.classList.add("alert-info");
        resultElement.textContent = `결과: ${result}`;
        module.resetDisplay();
        state.firstNumber = null;
        state.operator = null;
        state.currentInput = "";
    } catch (error) {
        module.showError(error.message);
        state.isError = true;
    }
};

window.clearDisplay = async () => {
    const module = await import("./index.js");
    module.removeError();
    module.resetDisplay();
    state.currentInput = "";
    state.firstNumber = null;
    state.operator = null;
    state.isError = false;
};

document.addEventListener("keydown", async (event) => {
    const module = await import("./index.js");
    const key = event.key;
    if (module.VALID_NUMBERS.includes(key)) window.appendNumber(key);
    if (module.VALID_OPERATORS.includes(key)) window.setOperator(key);
    if (key === "Enter") window.calculate();
    if (key === "Backspace") {
        if (!state.isError) {
            state.currentInput = module.subDisplay();
        }
    }
    if (key === "Escape") window.clearDisplay();
});

window.displayHistory = async () => {
    const module = await import("./index.js");
    const historyElement = document.getElementById("history");
    historyElement.classList.remove("d-none");
    historyElement.style.whiteSpace = "pre-line";
    historyElement.textContent = module.displayHistory(module.history);
};
