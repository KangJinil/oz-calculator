const VALID_NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const VALID_OPERATORS = ["+", "-", "*", "/", "^"];

const resetDisplay = () => {
    const displayElement = document.getElementById("display");
    displayElement.value = "0";
    return "";
};

const setDisplay = (text) => {
    const displayElement = document.getElementById("display");
    displayElement.value = text;
    return text;
};

const subDisplay = () => {
    const displayElement = document.getElementById("display");
    const currentValue = displayElement.value;
    if (currentValue.length > 1) {
        displayElement.value = currentValue.slice(0, -1);
    } else {
        displayElement.value = "0";
    }
    return displayElement.value === "0" ? "" : displayElement.value;
};

const appendNumber = (number, currentInput) => {
    if (!VALID_NUMBERS.includes(number))
        throw new Error("유효한 숫자를 입력하세요.");
    return setDisplay(currentInput + number);
};

const setOperator = (op, currentInput) => {
    if (!VALID_OPERATORS.includes(op))
        throw new Error("유효한 연산 기호를 입력하세요.");
    if (!currentInput) throw new Error("잘못된 계산식 입니다.");
    return op;
};

export {
    resetDisplay,
    setDisplay,
    subDisplay,
    appendNumber,
    setOperator,
    VALID_NUMBERS,
    VALID_OPERATORS,
};
