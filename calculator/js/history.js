export default function saveHistory(firstNumber, operator, secondNumber, result, history) {
    const record = { firstNumber, operator, secondNumber, result };
    history.push(record);
    console.log("İ 0]:", JSON.stringify(history, null, 2));
    return history;
}