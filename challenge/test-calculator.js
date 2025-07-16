// \uacc4\uc0b0\uae30 \uae30\ub2a5 \ud14c\uc2a4\ud2b8 \uc2a4\ud06c\ub9bd\ud2b8

// \ud14c\uc2a4\ud2b8 \uacb0\uacfc\ub97c \uc800\uc7a5\ud560 \ubc30\uc5f4
const testResults = [];

// \ud14c\uc2a4\ud2b8 \ud568\uc218
function runTest(testName, testFunc) {
  try {
    testFunc();
    testResults.push({ name: testName, status: '\u2705 \ud1b5\uacfc', error: null });
    console.log(`\u2705 ${testName}: \ud1b5\uacfc`);
  } catch (error) {
    testResults.push({ name: testName, status: '\u274c \uc2e4\ud328', error: error.message });
    console.error(`\u274c ${testName}: \uc2e4\ud328 - ${error.message}`);
  }
}

// \uacb0\uacfc \ube44\uad50 \ud568\uc218
function assertResult(expected, actual, tolerance = 0.0001) {
  if (Math.abs(expected - actual) > tolerance) {
    throw new Error(`\uae30\ub300\uac12: ${expected}, \uc2e4\uc81c\uac12: ${actual}`);
  }
}

// \ud45c\uc900 \uacc4\uc0b0\uae30 \ud14c\uc2a4\ud2b8
function testStandardCalculator() {
  console.log('\n=== \ud45c\uc900 \uacc4\uc0b0\uae30 \ud14c\uc2a4\ud2b8 ===');
  
  // \uacc4\uc0b0\uae30 \ucd08\uae30\ud654
  clearDisplay();
  
  // \uae30\ubcf8 \uc0b0\uc220 \ud14c\uc2a4\ud2b8
  runTest('\ub367\uc148: 5 + 3', () => {
    clearDisplay();
    appendNumber('5');
    setOperator('+');
    appendNumber('3');
    calculate();
    const result = parseFloat(expression);
    assertResult(8, result);
  });
  
  runTest('\ube84\uc148: 10 - 4', () => {
    clearDisplay();
    appendNumber('1');
    appendNumber('0');
    setOperator('-');
    appendNumber('4');
    calculate();
    const result = parseFloat(expression);
    assertResult(6, result);
  });
  
  runTest('\uacf1\uc148: 7 * 6', () => {
    clearDisplay();
    appendNumber('7');
    setOperator('*');
    appendNumber('6');
    calculate();
    const result = parseFloat(expression);
    assertResult(42, result);
  });
  
  runTest('\ub098\ub217\uc148: 20 / 4', () => {
    clearDisplay();
    appendNumber('2');
    appendNumber('0');
    setOperator('/');
    appendNumber('4');
    calculate();
    const result = parseFloat(expression);
    assertResult(5, result);
  });
  
  // \uc18c\uc218\uc810 \ud14c\uc2a4\ud2b8
  runTest('\uc18c\uc218\uc810 \uacc4\uc0b0: 3.5 + 2.5', () => {
    clearDisplay();
    appendNumber('3');
    appendToExpression('.');
    appendNumber('5');
    setOperator('+');
    appendNumber('2');
    appendToExpression('.');
    appendNumber('5');
    calculate();
    const result = parseFloat(expression);
    assertResult(6, result);
  });
  
  // \uad04\ud638 \ud14c\uc2a4\ud2b8
  runTest('\uad04\ud638 \uacc4\uc0b0: (5 + 3) * 2', () => {
    clearDisplay();
    appendToExpression('(');
    appendNumber('5');
    setOperator('+');
    appendNumber('3');
    appendToExpression(')');
    setOperator('*');
    appendNumber('2');
    calculate();
    const result = parseFloat(expression);
    assertResult(16, result);
  });
  
  // \uc74c\uc218 \ud14c\uc2a4\ud2b8
  runTest('\uc74c\uc218 \uacc4\uc0b0: -5 + 3', () => {
    clearDisplay();
    setOperator('-');
    appendNumber('5');
    setOperator('+');
    appendNumber('3');
    calculate();
    const result = parseFloat(expression);
    assertResult(-2, result);
  });
}

// \ub0a0\uc9dc \uacc4\uc0b0\uae30 \ud14c\uc2a4\ud2b8
function testDateCalculator() {
  console.log('\n=== \ub0a0\uc9dc \uacc4\uc0b0\uae30 \ud14c\uc2a4\ud2b8 ===');
  
  runTest('\ub0a0\uc9dc \ucc28\uc774 \uacc4\uc0b0', () => {
    // 2024\ub144 1\uc6d4 1\uc77c\uacfc 2024\ub144 1\uc6d4 10\uc77c \ucc28\uc774 = 9\uc77c
    document.getElementById('start-date').value = '2024-01-01';
    document.getElementById('end-date').value = '2024-01-10';
    calculateDateDiff();
    
    // displayValue\uc5d0\uc11c \uc22b\uc790 \ucd94\ucd9c
    const match = displayValue.match(/^([\\d,]+)\uc77c$/);
    if (!match) throw new Error(`\ub0a0\uc9dc \ucc28\uc774 \uacc4\uc0b0 \uc624\ub958: ${displayValue}`);
    const days = parseInt(match[1].replace(/,/g, ''));
    assertResult(9, days);
  });
  
  runTest('\ub0a0\uc9dc \ub354\ud558\uae30', () => {
    // 2024\ub144 1\uc6d4 1\uc77c + 30\uc77c = 2024\ub144 1\uc6d4 31\uc77c
    document.getElementById('start-date').value = '2024-01-01';
    document.getElementById('days-to-add').value = '30';
    addDaysToDate();
    
    // displayValue\uc5d0 \ub0a0\uc9dc\uac00 \ud45c\uc2dc\ub418\ub294\uc9c0 \ud655\uc778
    if (!displayValue.includes('2024') || !displayValue.includes('31')) {
      throw new Error(`\ub0a0\uc9dc \ub354\ud558\uae30 \uc624\ub958: ${displayValue}`);
    }
  });
}

// \ub2e8\uc704 \ubcc0\ud658\uae30 \ud14c\uc2a4\ud2b8
function testUnitConverter() {
  console.log('\n=== \ub2e8\uc704 \ubcc0\ud658\uae30 \ud14c\uc2a4\ud2b8 ===');
  
  // \uad6c\ud604\uc774 \ubcf5\uc7a1\ud558\ubbc0\ub85c \uae30\ubcf8\uc801\uc778 \ud14c\uc2a4\ud2b8\ub9cc \uc218\ud589
  runTest('\ubb34\uac8c \ubcc0\ud658: 100mg \u2192 g', () => {
    switchMode('converter');
    document.getElementById('unit-type').value = 'weight';
    updateUnitOptions();
    document.getElementById('from-unit').value = 'mg';
    document.getElementById('to-unit').value = 'g';
    document.getElementById('from-value').value = '100';
    convertUnits();
    
    const toValue = document.getElementById('to-value').value;
    const result = parseFloat(toValue);
    assertResult(0.1, result);
  });
  
  runTest('\uae38\uc774 \ubcc0\ud658: 1km \u2192 m', () => {
    document.getElementById('unit-type').value = 'length';
    updateUnitOptions();
    document.getElementById('from-unit').value = 'km';
    document.getElementById('to-unit').value = 'm';
    document.getElementById('from-value').value = '1';
    convertUnits();
    
    const toValue = document.getElementById('to-value').value;
    const result = parseFloat(toValue);
    assertResult(1000, result);
  });
}

// \ud1b5\ud654 \ubcc0\ud658\uae30 \ud14c\uc2a4\ud2b8
async function testCurrencyConverter() {
  console.log('\n=== \ud1b5\ud654 \ubcc0\ud658\uae30 \ud14c\uc2a4\ud2b8 ===');
  
  // \ud1b5\ud654 \uc120\ud0dd \uc911\ubcf5 \ubc29\uc9c0 \ud14c\uc2a4\ud2b8
  runTest('\ud1b5\ud654 \uc120\ud0dd \uc911\ubcf5 \ubc29\uc9c0', () => {
    switchMode('currency');
    
    // KRW\uc5d0\uc11c USD\ub85c \ubcc0\uacbd
    document.getElementById('from-currency').value = 'USD';
    handleCurrencyChange('from');
    
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    
    if (fromCurrency === toCurrency) {
      throw new Error('\ubcf4\uc720 \ud1b5\ud654\uc640 \ubcc0\ud658\ud560 \ud1b5\ud654\uac00 \uac19\uc2b5\ub2c8\ub2e4');
    }
  });
  
  // \ud658\uc728 API \ud14c\uc2a4\ud2b8\ub294 \ub124\ud2b8\uc6cc\ud06c \uc5f0\uacb0\uc774 \ud544\uc694\ud558\ubbc0\ub85c \uae30\ubcf8 \ud14c\uc2a4\ud2b8\ub9cc \uc218\ud589
  runTest('\ud1b5\ud654 \uc785\ub825 \ud544\ub4dc \ud655\uc778', () => {
    const fromValueInput = document.getElementById('currency-from-value');
    const toValueInput = document.getElementById('currency-to-value');
    
    if (!fromValueInput || !toValueInput) {
      throw new Error('\ud1b5\ud654 \uc785\ub825 \ud544\ub4dc\uac00 \uc5c6\uc2b5\ub2c8\ub2e4');
    }
  });
}

// \ud14c\uc2a4\ud2b8 \uc2e4\ud589 \ud568\uc218
async function runAllTests() {
  console.log('\ud83e\uddea \uacc4\uc0b0\uae30 \uae30\ub2a5 \ud14c\uc2a4\ud2b8 \uc2dc\uc791...\n');
  
  // \ud45c\uc900 \uacc4\uc0b0\uae30 \ud14c\uc2a4\ud2b8
  testStandardCalculator();
  
  // \ub0a0\uc9dc \uacc4\uc0b0\uae30 \ud14c\uc2a4\ud2b8
  testDateCalculator();
  
  // \ub2e8\uc704 \ubcc0\ud658\uae30 \ud14c\uc2a4\ud2b8
  testUnitConverter();
  
  // \ud1b5\ud654 \ubcc0\ud658\uae30 \ud14c\uc2a4\ud2b8
  await testCurrencyConverter();
  
  // \ud14c\uc2a4\ud2b8 \uacb0\uacfc \uc694\uc57d
  console.log('\n=== \ud14c\uc2a4\ud2b8 \uacb0\uacfc \uc694\uc57d ===');
  const passedTests = testResults.filter(r => r.status === '\u2705 \ud1b5\uacfc').length;
  const failedTests = testResults.filter(r => r.status === '\u274c \uc2e4\ud328').length;
  
  console.log(`\ucd1d \ud14c\uc2a4\ud2b8: ${testResults.length}`);
  console.log(`\ud1b5\uacfc: ${passedTests}`);
  console.log(`\uc2e4\ud328: ${failedTests}`);
  
  if (failedTests > 0) {
    console.log('\n\uc2e4\ud328\ud55c \ud14c\uc2a4\ud2b8:');
    testResults.filter(r => r.status === '\u274c \uc2e4\ud328').forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }
  
  return { passed: passedTests, failed: failedTests };
}

// \ud398\uc774\uc9c0 \ub85c\ub4dc \ud6c4 \ud14c\uc2a4\ud2b8 \uc2e4\ud589
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      runAllTests().then(results => {
        if (results.failed === 0) {
          console.log('\n\ud83c\udf89 \ubaa8\ub4e0 \ud14c\uc2a4\ud2b8\uac00 \ud1b5\uacfc\ud588\uc2b5\ub2c8\ub2e4!');
        } else {
          console.log('\n\u26a0\ufe0f  \uc77c\ubd80 \ud14c\uc2a4\ud2b8\uac00 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.');
        }
      });
    }, 1000); // \ud398\uc774\uc9c0 \uc644\uc804 \ub85c\ub4dc \ub300\uae30
  });
}