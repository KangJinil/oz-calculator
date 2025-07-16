let history = []; // 계산 기록을 저장하는 배열
let expression = ""; // 전체 수식을 저장
let displayValue = "0"; // 디스플레이에 표시될 값

// 디스플레이 업데이트 함수
const updateDisplay = () => {
  const display = document.getElementById("display");
  
  // 프로그래머 모드는 쉼표 없이 표시
  if (currentMode === 'programmer') {
    display.textContent = displayValue;
    return;
  }
  
  // 날짜 모드도 쉼표 없이 표시
  if (currentMode === 'date') {
    display.textContent = displayValue;
    return;
  }
  
  // 수식이 아닌 숫자만 있을 때 천 단위 쉼표 추가
  // 연산자나 괄호가 포함된 경우는 그대로 표시
  if (/^-?\d+\.?\d*$/.test(displayValue)) {
    // 마지막이 소수점으로 끝나는 경우 그대로 표시
    if (displayValue.endsWith('.')) {
      display.textContent = displayValue;
    } else {
      const num = parseFloat(displayValue);
      if (!isNaN(num)) {
        display.textContent = num.toLocaleString('ko-KR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 10
        });
      } else {
        display.textContent = displayValue;
      }
    }
  } else {
    // 수식인 경우 그대로 표시
    display.textContent = displayValue;
  }
};

// 수식에 문자 추가 (숫자, 연산자, 괄호 등)
const appendToExpression = (char) => {
  try {
    // 초기 상태에서 0 제거
    if (expression === "" && displayValue === "0") {
      displayValue = "";
    }
    
    // 소수점 유효성 검사
    if (char === '.') {
      // 현재 숫자에 이미 소수점이 있는지 확인
      const lastNumber = expression.split(/[\+\-\*\/\(\)]/).pop();
      if (lastNumber.includes('.')) {
        throw new Error("이미 소수점이 있습니다.");
      }
      // 소수점 앞에 숫자가 없으면 0 추가
      if (expression === "" || /[\+\-\*\/\(]$/.test(expression)) {
        expression += "0";
        displayValue += "0";
      }
    }
    
    expression += char;
    displayValue += char;
    updateDisplay();
  } catch (error) {
    showError(error.message);
  }
};

// 숫자 추가
const appendNumber = (number) => {
  try {
    // 프로그래머 모드에서는 16진수도 허용
    if (currentMode === 'programmer' && currentBase === 'hex') {
      if (!/^[0-9A-Fa-f]$/.test(number)) throw new Error("유효한 숫자를 입력하세요.");
    } else if (!/^[0-9]$/.test(number)) {
      throw new Error("유효한 숫자를 입력하세요.");
    }
    
    // 초기 상태에서 0 제거
    if (expression === "" && displayValue === "0") {
      displayValue = "";
    }
    
    expression += number;
    displayValue += number;
    updateDisplay();
  } catch (error) {
    showError(error.message);
  }
};

// 연산자 추가
const setOperator = (op) => {
  try {
    if (!["+", "-", "*", "/", "%", "**"].includes(op)) throw new Error("유효한 연산자를 선택하세요.");
    
    // 수식이 비어있고 음수를 입력하는 경우
    if (expression === "" && op === "-") {
      expression = "-";
      displayValue = "-";
      updateDisplay();
      return;
    }
    
    // 수식이 비어있으면 에러
    if (expression === "") throw new Error("숫자를 먼저 입력하세요.");
    
    // 마지막 문자가 연산자인 경우 교체
    if (/[\+\-\*\/]$/.test(expression)) {
      expression = expression.slice(0, -1) + op;
      displayValue = displayValue.slice(0, -1) + op;
    } else {
      expression += op;
      displayValue += op;
    }
    
    updateDisplay();
  } catch (error) {
    showError(error.message);
  }
};

// 백스페이스
const backspace = () => {
  if (expression.length > 0) {
    expression = expression.slice(0, -1);
    displayValue = displayValue.slice(0, -1);
    
    if (displayValue === "") {
      displayValue = "0";
    }
    
    updateDisplay();
  }
};

// 초기화
const clearDisplay = () => {
  expression = "";
  displayValue = "0";
  updateDisplay();
  document.getElementById("result").classList.add("hidden");
  
  // 계산 내역도 함께 초기화
  if (history.length > 0) {
    history = [];
    document.getElementById("history-container").classList.add("hidden");
    document.getElementById("history").innerHTML = "";
  }
};

// 괄호 짝 맞는지 검사
const checkParentheses = (expr) => {
  let count = 0;
  for (let char of expr) {
    if (char === '(') count++;
    else if (char === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
};

// 수식 평가 (eval 대신 안전한 방법 사용)
const evaluateExpression = (expr) => {
  // 곱하기 기호 변환
  expr = expr.replace(/×/g, '*');
  expr = expr.replace(/÷/g, '/');
  
  // 괄호 검사
  if (!checkParentheses(expr)) {
    throw new Error("괄호가 올바르지 않습니다.");
  }
  
  // 빈 괄호 검사
  if (expr.includes("()")) {
    throw new Error("빈 괄호가 있습니다.");
  }
  
  // 연산자 연속 검사
  if (/[\+\-\*\/]{2,}/.test(expr) && !/-\d/.test(expr)) {
    throw new Error("연산자가 연속으로 있습니다.");
  }
  
  // 수식 끝이 연산자인지 검사
  if (/[\+\-\*\/]$/.test(expr)) {
    throw new Error("수식이 완성되지 않았습니다.");
  }
  
  try {
    // Function 생성자를 사용하여 안전하게 평가
    const result = new Function('return ' + expr)();
    
    if (!isFinite(result)) {
      throw new Error("계산 결과가 유효하지 않습니다.");
    }
    
    return result;
  } catch (e) {
    throw new Error("수식을 계산할 수 없습니다.");
  }
};

// 계산 내역 업데이트
const updateHistory = () => {
  // 통화 모드에서는 계산 내역을 업데이트하지 않음
  if (currentMode === 'currency') {
    return;
  }
  
  const historyContainer = document.getElementById("history-container");
  const historyElement = document.getElementById("history");
  
  // 2번 이상 계산했을 때만 표시
  if (history.length >= 2) {
    historyContainer.classList.remove("hidden");
    
    // 최근 계산부터 표시 (역순) - 천 단위 쉼표 포함
    historyElement.innerHTML = history.slice().reverse().map((record, index) => {
      const formattedResult = record.result.toLocaleString('ko-KR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 10
      });
      return `<div class="text-slate-600 py-1 ${index !== history.length - 1 ? 'border-b border-slate-200' : ''}">
        ${record.expression} = <span class="font-semibold">${formattedResult}</span>
      </div>`;
    }).join('');
  }
};

// 계산 실행
const calculate = () => {
  const resultElement = document.getElementById("result");
  try {
    if (expression === "") throw new Error("계산할 수식이 없습니다.");
    
    const result = evaluateExpression(expression);
    
    // 결과를 디스플레이에 표시
    displayValue = result.toString();
    updateDisplay();
    
    // 결과 출력 (천 단위 쉼표 포함)
    const formattedResult = result.toLocaleString('ko-KR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 10
    });
    resultElement.classList.remove("hidden", "bg-red-100", "text-red-800", "border-red-200");
    resultElement.classList.add("bg-blue-100", "text-blue-800", "border", "border-blue-200");
    resultElement.textContent = `${expression} = ${formattedResult}`;
    
    // 통화 모드가 아닐 때만 계산 기록 저장
    if (currentMode !== 'currency') {
      const record = { expression, result };
      history.push(record);
      console.log("계산 기록:", JSON.stringify(history, null, 2));
      
      // 계산 내역 업데이트
      updateHistory();
    }
    
    // 계산 후 수식을 결과값으로 대체
    expression = result.toString();
  } catch (error) {
    showError(error.message);
  }
};

// 에러 메시지 출력
const showError = (message) => {
  const resultElement = document.getElementById("result");
  resultElement.classList.remove("hidden", "bg-blue-100", "text-blue-800", "border-blue-200");
  resultElement.classList.add("bg-red-100", "text-red-800", "border", "border-red-200");
  resultElement.textContent = `에러: ${message}`;
};

// 키보드 입력 처리
document.addEventListener('keydown', (event) => {
  const key = event.key;
  
  // 숫자 입력
  if (key >= '0' && key <= '9') {
    appendNumber(key);
  }
  // 연산자 입력
  else if (key === '+' || key === '-' || key === '*' || key === '/') {
    setOperator(key);
  }
  // 소수점
  else if (key === '.') {
    appendToExpression('.');
  }
  // 괄호
  else if (key === '(' || key === ')') {
    appendToExpression(key);
  }
  // Enter 키로 계산
  else if (key === 'Enter' || key === '=') {
    event.preventDefault();
    // 각 모드에 따라 적절한 함수 호출
    if (currentMode === 'converter') {
      convertUnits();
    } else if (currentMode === 'currency') {
      convertCurrency();
    } else if (currentMode === 'date') {
      // 날짜 계산기는 별도 처리 필요 없음
      return;
    } else {
      calculate();
    }
  }
  // ESC 또는 C 키로 초기화
  else if (key === 'Escape' || key.toLowerCase() === 'c') {
    clearDisplay();
  }
  // Backspace
  else if (key === 'Backspace') {
    backspace();
  }
});