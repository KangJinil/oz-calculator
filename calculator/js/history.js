export default function saveHistory(
    firstNumber,
    operator,
    secondNumber,
    result,
    history
) {
    const record = { firstNumber, operator, secondNumber, result };
    history.push(record);
    console.log("계산 기록:", JSON.stringify(history, null, 2));
    return history;
}

export function displayHistory(history) {
    let result = "계산 기록:\\n";
    for (const record of history) {
        result += `${record.firstNumber} ${record.operator} ${record.secondNumber} = ${record.result}\\n`;
    }
    return result || "기록이 없습니다.";
}
