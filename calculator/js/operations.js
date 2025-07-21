export default function calculateOperation(firstNumber, secondNumber, operator) {
    switch (operator) {
        case '+':
            return firstNumber + secondNumber;
        case '-':
            return firstNumber - secondNumber;
        case '*':
            return firstNumber * secondNumber;
        case '/':
            if (secondNumber === 0) {
                throw new Error("0<\ ˜  ÆµÈä.");
            }
            return firstNumber / secondNumber;
        default:
            throw new Error(" ¨XÀ J@ ð°…Èä.");
    }
}