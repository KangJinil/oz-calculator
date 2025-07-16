// 현재 계산기 모드
let currentMode = 'standard';
let currentBase = 'dec'; // 프로그래머 모드용
let dropdownOpen = false;

// 드롭다운 토글
const toggleModeDropdown = () => {
  const dropdown = document.getElementById('mode-dropdown');
  const arrow = document.getElementById('dropdown-arrow');
  
  dropdownOpen = !dropdownOpen;
  
  if (dropdownOpen) {
    dropdown.classList.remove('opacity-0', 'invisible', '-translate-y-2');
    dropdown.classList.add('opacity-100', 'visible', 'translate-y-0');
    arrow.classList.add('rotate-180');
  } else {
    dropdown.classList.add('opacity-0', 'invisible', '-translate-y-2');
    dropdown.classList.remove('opacity-100', 'visible', 'translate-y-0');
    arrow.classList.remove('rotate-180');
  }
};

// 모드 선택
const selectMode = (mode) => {
  switchMode(mode);
  toggleModeDropdown();
  updateModeDisplay(mode);
};

// 모드 전환
const switchMode = (mode) => {
  // 모든 탭 컨텐츠 숨기기
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // 선택된 모드 활성화
  document.getElementById(`${mode}-calc`).classList.add('active');
  
  currentMode = mode;
  
  // 모든 모드 전환 시 디스플레이 및 수식 초기화
  clearDisplay();
  
  // 통화, 날짜, 단위 변환 모드에서는 계산 내역 숨기기
  const historyContainer = document.getElementById('history-container');
  if (mode === 'currency' || mode === 'date' || mode === 'converter') {
    historyContainer.style.display = 'none';
  } else {
    historyContainer.style.display = '';
  }
};

// 모드 표시 업데이트
const updateModeDisplay = (mode) => {
  const modeText = document.getElementById('mode-text');
  const modeNames = {
    'standard': '표준 계산기',
    'scientific': '공학용 계산기',
    'programmer': '프로그래머 계산기',
    'date': '날짜 계산기',
    'converter': '단위 변환기',
    'currency': '통화 변환기'
  };
  
  modeText.textContent = modeNames[mode];
};

// 공학용 함수
const scientificFunction = (func) => {
  try {
    let value = parseFloat(expression || '0');
    let result;
    
    switch(func) {
      case 'sin':
        result = Math.sin(value * Math.PI / 180); // 각도를 라디안으로 변환
        break;
      case 'cos':
        result = Math.cos(value * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(value * Math.PI / 180);
        break;
      case 'asin':
        result = Math.asin(value) * 180 / Math.PI; // 라디안을 각도로 변환
        break;
      case 'acos':
        result = Math.acos(value) * 180 / Math.PI;
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'pow2':
        result = Math.pow(value, 2);
        break;
      case 'pow':
        // 다음 입력을 기다림
        expression += '**';
        displayValue += '^';
        updateDisplay();
        return;
      case 'factorial':
        if (value < 0 || value !== Math.floor(value)) {
          throw new Error("양의 정수만 가능합니다.");
        }
        result = factorial(value);
        break;
      case 'abs':
        result = Math.abs(value);
        break;
      case 'reciprocal':
        if (value === 0) throw new Error("0으로 나눌 수 없습니다.");
        result = 1 / value;
        break;
    }
    
    expression = result.toString();
    displayValue = result.toString();
    updateDisplay();
  } catch (error) {
    showError(error.message);
  }
};

// 팩토리얼 계산
const factorial = (n) => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

// 상수 추가
const appendConstant = (constant) => {
  if (expression === "" && displayValue === "0") {
    displayValue = "";
  }
  
  switch(constant) {
    case 'pi':
      expression += Math.PI.toString();
      displayValue += 'π';
      break;
    case 'e':
      expression += Math.E.toString();
      displayValue += 'e';
      break;
  }
  updateDisplay();
};

// 프로그래머 모드 - 진법 변환
const setNumberBase = (base) => {
  // 모든 진법 버튼 스타일 초기화
  document.querySelectorAll('.base-btn').forEach(btn => {
    btn.classList.remove('bg-slate-800', 'text-white');
    btn.classList.add('bg-slate-100', 'text-slate-700');
  });
  
  // 선택된 진법 버튼 활성화
  const activeBtn = document.querySelector(`[data-base="${base}"]`);
  activeBtn.classList.remove('bg-slate-100', 'text-slate-700');
  activeBtn.classList.add('bg-slate-800', 'text-white');
  
  // 현재 값을 새 진법으로 변환
  if (expression) {
    let decimalValue = parseInt(expression, getBaseNumber(currentBase));
    expression = decimalValue.toString(getBaseNumber(base));
    displayValue = expression.toUpperCase();
    updateDisplay();
  }
  
  currentBase = base;
  updateProgrammerButtons();
};

// 진법에 따른 숫자 반환
const getBaseNumber = (base) => {
  switch(base) {
    case 'bin': return 2;
    case 'oct': return 8;
    case 'dec': return 10;
    case 'hex': return 16;
  }
};

// 프로그래머 모드 버튼 업데이트
const updateProgrammerButtons = () => {
  // 2-9, A-F 버튼 활성화/비활성화
  const binButtons = document.querySelectorAll('.bin-btn');
  const octButtons = document.querySelectorAll('.oct-btn');
  const hexButtons = document.querySelectorAll('.hex-btn');
  
  // 모든 버튼 활성화
  [...binButtons, ...octButtons, ...hexButtons].forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('opacity-50', 'cursor-not-allowed');
  });
  
  // 진법에 따라 버튼 비활성화
  switch(currentBase) {
    case 'bin':
      [...binButtons.slice(1), ...octButtons, ...hexButtons].forEach(btn => {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
      });
      break;
    case 'oct':
      [...octButtons, ...hexButtons].forEach(btn => {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
      });
      break;
  }
};

// 비트 연산
const bitwiseOp = (op) => {
  try {
    let value = parseInt(expression, getBaseNumber(currentBase));
    let result;
    
    switch(op) {
      case 'not':
        result = ~value;
        break;
      case 'and':
      case 'or':
      case 'xor':
      case 'lshift':
      case 'rshift':
        // 두 번째 피연산자가 필요한 연산
        expression += ` ${op.toUpperCase()} `;
        displayValue += ` ${op.toUpperCase()} `;
        updateDisplay();
        return;
    }
    
    if (result !== undefined) {
      expression = result.toString(getBaseNumber(currentBase));
      displayValue = expression.toUpperCase();
      updateDisplay();
    }
  } catch (error) {
    showError("유효하지 않은 연산입니다.");
  }
};

// 날짜 계산
const calculateDateDiff = () => {
  const startDate = new Date(document.getElementById('start-date').value);
  const endDate = new Date(document.getElementById('end-date').value);
  
  if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
    showError("날짜를 입력해주세요.");
    return;
  }
  
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // 천 단위 쉼표 추가
  const formattedDays = diffDays.toLocaleString('ko-KR');
  displayValue = `${formattedDays}일`;
  updateDisplay();
  
  // 상세 정보 표시
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;
  
  const resultElement = document.getElementById("result");
  resultElement.classList.remove("hidden", "bg-red-100", "text-red-800", "border-red-200");
  resultElement.classList.add("bg-blue-100", "text-blue-800", "border", "border-blue-200");
  resultElement.textContent = `${years}년 ${months}개월 ${days}일 (총 ${formattedDays}일)`;
};

const addDaysToDate = () => {
  const startDate = new Date(document.getElementById('start-date').value);
  const daysToAdd = parseInt(document.getElementById('days-to-add').value);
  
  if (!startDate || isNaN(startDate)) {
    showError("시작 날짜를 입력해주세요.");
    return;
  }
  
  if (isNaN(daysToAdd)) {
    showError("추가할 일수를 입력해주세요.");
    return;
  }
  
  const resultDate = new Date(startDate);
  resultDate.setDate(resultDate.getDate() + daysToAdd);
  
  displayValue = resultDate.toLocaleDateString('ko-KR');
  updateDisplay();
  
  const resultElement = document.getElementById("result");
  resultElement.classList.remove("hidden", "bg-red-100", "text-red-800", "border-red-200");
  resultElement.classList.add("bg-blue-100", "text-blue-800", "border", "border-blue-200");
  resultElement.textContent = `결과: ${resultDate.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  })}`;
};

// 단위 변환
const unitConversions = {
  length: {
    units: ['mm', 'cm', 'm', 'km', 'inch', 'ft', 'yard', 'mile'],
    toMeter: {
      'mm': 0.001,
      'cm': 0.01,
      'm': 1,
      'km': 1000,
      'inch': 0.0254,
      'ft': 0.3048,
      'yard': 0.9144,
      'mile': 1609.344
    }
  },
  weight: {
    units: ['mg', 'g', 'kg', 'ton', 'oz', 'lb'],
    toKg: {
      'mg': 0.000001,
      'g': 0.001,
      'kg': 1,
      'ton': 1000,
      'oz': 0.0283495,
      'lb': 0.453592
    }
  },
  temperature: {
    units: ['°C', '°F', 'K'],
    convert: (value, from, to) => {
      // 섭씨 기준으로 변환
      let celsius = value;
      if (from === '°F') celsius = (value - 32) * 5/9;
      else if (from === 'K') celsius = value - 273.15;
      
      if (to === '°C') return celsius;
      else if (to === '°F') return celsius * 9/5 + 32;
      else if (to === 'K') return celsius + 273.15;
    }
  },
  area: {
    units: ['mm²', 'cm²', 'm²', 'km²', 'ft²', 'acre'],
    toM2: {
      'mm²': 0.000001,
      'cm²': 0.0001,
      'm²': 1,
      'km²': 1000000,
      'ft²': 0.092903,
      'acre': 4046.86
    }
  },
  volume: {
    units: ['mL', 'L', 'm³', 'gal', 'qt', 'pt'],
    toL: {
      'mL': 0.001,
      'L': 1,
      'm³': 1000,
      'gal': 3.78541,
      'qt': 0.946353,
      'pt': 0.473176
    }
  },
  speed: {
    units: ['m/s', 'km/h', 'mph', 'knot'],
    toMs: {
      'm/s': 1,
      'km/h': 0.277778,
      'mph': 0.44704,
      'knot': 0.514444
    }
  },
  data: {
    units: ['bit', 'byte', 'KB', 'MB', 'GB', 'TB'],
    toByte: {
      'bit': 0.125,
      'byte': 1,
      'KB': 1024,
      'MB': 1048576,
      'GB': 1073741824,
      'TB': 1099511627776
    }
  }
};

const updateUnitOptions = () => {
  const unitType = document.getElementById('unit-type').value;
  const fromSelect = document.getElementById('from-unit');
  const toSelect = document.getElementById('to-unit');
  
  // 기존 옵션 제거
  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';
  
  // 새 옵션 추가
  unitConversions[unitType].units.forEach(unit => {
    fromSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
    toSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
  });
  
  // 기본값 설정
  if (unitConversions[unitType].units.length > 1) {
    toSelect.selectedIndex = 1;
  }
};

const convertUnits = () => {
  // 단위 변환 모드가 아니면 기본 계산 실행
  if (currentMode !== 'converter') {
    calculate();
    return;
  }
  
  const unitType = document.getElementById('unit-type').value;
  const fromUnit = document.getElementById('from-unit').value;
  const toUnit = document.getElementById('to-unit').value;
  const fromValue = parseFloat(document.getElementById('from-value').value);
  
  if (isNaN(fromValue)) {
    showError("값을 입력해주세요.");
    return;
  }
  
  let result;
  
  if (unitType === 'temperature') {
    result = unitConversions.temperature.convert(fromValue, fromUnit, toUnit);
  } else {
    const conversion = unitConversions[unitType];
    const conversionKey = Object.keys(conversion)[1]; // toMeter, toKg, toL 등
    const baseValue = fromValue * conversion[conversionKey][fromUnit];
    result = baseValue / conversion[conversionKey][toUnit];
  }
  
  // 결과값 소수점 처리 개선
  let formattedResult;
  if (Math.abs(result) < 0.000001 || Math.abs(result) > 1000000) {
    formattedResult = result.toExponential(6);
  } else if (result % 1 === 0) {
    // 정수인 경우
    formattedResult = result.toString();
  } else {
    // 소수인 경우 불필요한 0 제거
    formattedResult = parseFloat(result.toFixed(10)).toString();
  }
  
  document.getElementById('to-value').value = formattedResult;
  
  // 디스플레이와 결과 영역에 올바른 변환 결과 표시
  // 입력값도 천 단위 쉼표 추가 (정수일 때만)
  const formattedFromValue = fromValue % 1 === 0 
    ? fromValue.toLocaleString('ko-KR') 
    : fromValue.toLocaleString('ko-KR', { minimumFractionDigits: 0, maximumFractionDigits: 10 });
  
  displayValue = `${formattedFromValue} ${fromUnit} = ${formattedResult} ${toUnit}`;
  updateDisplay();
  
  // 결과 영역에도 표시
  const resultElement = document.getElementById("result");
  resultElement.classList.remove("hidden", "bg-red-100", "text-red-800", "border-red-200");
  resultElement.classList.add("bg-blue-100", "text-blue-800", "border", "border-blue-200");
  resultElement.textContent = `${formattedFromValue} ${fromUnit} = ${formattedResult} ${toUnit}`;
};

// 실시간 환율 데이터 저장
let exchangeRates = null;
let ratesLastUpdated = null;

// 환율 API에서 데이터 가져오기
const fetchExchangeRates = async () => {
  try {
    // 캐시된 데이터가 있고 10분 이내라면 재사용
    if (exchangeRates && ratesLastUpdated && (Date.now() - ratesLastUpdated < 600000)) {
      return exchangeRates;
    }
    
    // 통화 모드에서는 result element를 사용하지 않음
    
    // 무료 환율 API 사용 (exchangerate-api.com)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    // USD 기준 환율을 저장
    exchangeRates = {
      'USD': 1,
      'KRW': data.rates.KRW,
      'EUR': data.rates.EUR,
      'JPY': data.rates.JPY,
      'CNY': data.rates.CNY,
      'GBP': data.rates.GBP
    };
    
    ratesLastUpdated = Date.now();
    
    // 통화 모드에서는 result element를 사용하지 않음
    
    return exchangeRates;
  } catch (error) {
    console.error('환율 정보 가져오기 실패:', error);
    
    // 에러 모달 표시
    showErrorModal();
    
    // null 반환하여 변환 중단
    return null;
  }
};

const convertCurrency = async () => {
  // 통화 변환 모드가 아니면 리턴
  if (currentMode !== 'currency') {
    return;
  }
  
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;
  const fromValue = parseFloat(document.getElementById('currency-from-value').value);
  
  if (isNaN(fromValue)) {
    showError("금액을 입력해주세요.");
    return;
  }
  
  // 실시간 환율 가져오기
  const rates = await fetchExchangeRates();
  
  // 환율 정보가 없으면 중단
  if (!rates) {
    return;
  }
  
  // USD 기준으로 변환
  const usdValue = fromValue / rates[fromCurrency];
  const result = usdValue * rates[toCurrency];
  
  // 결과값 포매팅 (소수점이 0이면 표시하지 않음)
  let formattedResult;
  if (result % 1 === 0) {
    // 정수인 경우
    formattedResult = result.toLocaleString('ko-KR');
  } else {
    // 소수인 경우 불필요한 0 제거
    formattedResult = result.toLocaleString('ko-KR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 10
    });
  }
  
  document.getElementById('currency-to-value').value = formattedResult;
  
  // 입력값 포매팅 (소수점이 0이면 표시하지 않음)
  let formattedFromValue;
  if (fromValue % 1 === 0) {
    formattedFromValue = fromValue.toLocaleString('ko-KR');
  } else {
    formattedFromValue = fromValue.toLocaleString('ko-KR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 10
    });
  }
  
  displayValue = `${formattedFromValue} ${fromCurrency} = ${formattedResult} ${toCurrency}`;
  updateDisplay();
};

// 통화 선택 변경 시 중복 방지
const handleCurrencyChange = (type) => {
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;
  
  // 같은 통화가 선택된 경우
  if (fromCurrency === toCurrency) {
    if (type === 'from') {
      // 보유 통화를 변경한 경우, 변환할 통화를 USD로 변경 (USD가 아닌 경우)
      if (fromCurrency !== 'USD') {
        document.getElementById('to-currency').value = 'USD';
      } else {
        // USD를 선택한 경우 KRW로 변경
        document.getElementById('to-currency').value = 'KRW';
      }
    } else {
      // 변환할 통화를 변경한 경우, 보유 통화를 USD로 변경 (USD가 아닌 경우)
      if (toCurrency !== 'USD') {
        document.getElementById('from-currency').value = 'USD';
      } else {
        // USD를 선택한 경우 KRW로 변경
        document.getElementById('from-currency').value = 'KRW';
      }
    }
  }
};

// 에러 모달 표시
const showErrorModal = () => {
  const modal = document.getElementById('error-modal');
  modal.classList.remove('hidden');
  
  // 애니메이션을 위해 약간의 딜레이 후 표시
  setTimeout(() => {
    modal.querySelector('.animate-modal-bounce').style.animation = 'none';
    modal.querySelector('.animate-modal-bounce').offsetHeight; // reflow
    modal.querySelector('.animate-modal-bounce').style.animation = null;
  }, 10);
};

// 에러 모달 닫기
const closeErrorModal = () => {
  const modal = document.getElementById('error-modal');
  modal.classList.add('hidden');
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  updateUnitOptions();
  
  // 오늘 날짜로 초기화
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('start-date').value = today;
  document.getElementById('end-date').value = today;
  
  // 드롭다운 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('mode-dropdown');
    const button = e.target.closest('button[onclick*="toggleModeDropdown"]');
    
    if (!button && !dropdown.contains(e.target) && dropdownOpen) {
      toggleModeDropdown();
    }
  });
  
  // 통화 선택 변경 이벤트 리스너
  const fromCurrencySelect = document.getElementById('from-currency');
  const toCurrencySelect = document.getElementById('to-currency');
  
  if (fromCurrencySelect) {
    fromCurrencySelect.addEventListener('change', () => handleCurrencyChange('from'));
  }
  
  if (toCurrencySelect) {
    toCurrencySelect.addEventListener('change', () => handleCurrencyChange('to'));
  }
});