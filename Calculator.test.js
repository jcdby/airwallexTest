var Calculator = require('./Calculator');

describe('Calculator Test!', ()=> {

  let calculator = new Calculator();

  test('should parse a string to a array.', () => {
    let inputString = '12 2 + -';
    let expectArr = ['12', '2', '+', '-'];

    expect(calculator.inputStringParser(inputString)).toEqual(expectArr);
  });

  test('should rise an error if inputString includes not both real numbers or allowed operator.', () => {
    let inputString1 = '12+ 2 3sqrt unndo';
    let inputString = '12 2 - 3 4 *';
    let inputString2 = '33.2 -22.3 + sqrt33';



    expect(()=>{calculator.inputStringParser(inputString1)}).toThrowError("There are 3 unallowed parameters in your input.Position: 1,5,7. Your input is [12+ 2 3sqrt unndo]!");
    expect(()=>{calculator.inputStringParser(inputString2)}).toThrowError("There are 1 unallowed parameters in your input.Position: 7. Your input is [33.2 -22.3 + sqrt33]!");
    expect(()=>{calculator.inputStringParser(inputString)}).not.toThrowError();


  })

  test('should return true if test input string is real number.', () => {
    let realNumber1 = '12';
    let realNumber2 = '12.222';
    let realNumber3 = '-22.23';
    let wrongNumber = '22-';
    let wrongNumber2 = 'sqrt22.22';
    
    expect(calculator.isRealNumber(realNumber1)).toBe(true);
    expect(calculator.isRealNumber(realNumber2)).toBe(true);
    expect(calculator.isRealNumber(realNumber3)).toBe(true);
    expect(calculator.isRealNumber(wrongNumber)).toBeFalsy();
    expect(calculator.isRealNumber(wrongNumber2)).toBeFalsy();
  })

  test('should return true when input string is allowed operator.', () => {
    let addition = '+';
    let min = '-';
    let multi = '*';
    let divi = '/';
    let sqrt = 'sqrt';
    let undo = 'undo';
    let clear = 'clear';
    let wrongOpr = 'plus';
    let wrongOpr2 = '++';
    let wrongOpr3 = 'sqrt-';
    let wrongOpr4 = '3sqrt';
    let wrongOpr5 = 'sqrt33';

    expect(calculator.isAllowedOperator(addition)).toBeTruthy();
    expect(calculator.isAllowedOperator(min)).toBeTruthy();
    expect(calculator.isAllowedOperator(multi)).toBeTruthy();
    expect(calculator.isAllowedOperator(divi)).toBeTruthy();
    expect(calculator.isAllowedOperator(sqrt)).toBeTruthy();
    expect(calculator.isAllowedOperator(undo)).toBeTruthy();
    expect(calculator.isAllowedOperator(clear)).toBeTruthy();
    expect(calculator.isAllowedOperator(wrongOpr)).toBeFalsy();
    expect(calculator.isAllowedOperator(wrongOpr2)).toBeFalsy();
    expect(calculator.isAllowedOperator(wrongOpr3)).toBeFalsy();
    expect(calculator.isAllowedOperator(wrongOpr4)).toBeFalsy();
    expect(calculator.isAllowedOperator(wrongOpr5)).toBeFalsy();
  });


  test('should return right result of calculation.', () => {
    let inputString = '5 2';

    calculator.calculate(inputString);
    expect(calculator.getStack()).toEqual('5 2');

    calculator.clear();
    inputString = '2 sqrt';
    calculator.calculate(inputString);
    expect(calculator.getStack()).toEqual('1.4142135623'); 
    inputString = 'clear 9 sqrt';
    calculator.calculate(inputString);
    expect(calculator.getStack()).toEqual('3')

    calculator.clear();
    inputString = '9 sqrt';
    calculator.calculate(inputString);
    expect(calculator.getStack()).toEqual('3'); 

    calculator.clear();
    inputString = '5 2 -';
    calculator.calculate(inputString);
    expect(calculator.getStack()).toEqual('3'); 
    
    calculator.clear();
    inputString = '7 12 2 /';
    calculator.calculate(inputString);
    expect(calculator.getStack()).toEqual('7 6');  
    calculator.calculate('*');
    expect(calculator.getStack()).toEqual('42');
    calculator.calculate('4 /');
    expect(calculator.getStack()).toEqual('10.5');

    calculator.clear();
    inputString = '1 2 3 4 5';
    calculator.calculate(inputString);
    expect(calculator.getStack()).toEqual('1 2 3 4 5');  
    calculator.calculate('* * * *');
    expect(calculator.getStack()).toEqual('120');

    

    
  })

  test('should clear stack if call clear function.', () => {
    let inputString = '5 2';
    calculator.calculate(inputString);
    calculator.clear();
    expect(calculator.getStack()).toEqual('');
  });

  test('should return valid number.', () => {
    let num1 = '1.232245345345345345345345';
    let num2 = '1.22';
    let num3 = '-33'
    expect(calculator.numConvertor(num1)).toBe('1.2322453453');
    expect(calculator.numConvertor(num2)).toBe('1.22');
    expect(calculator.numConvertor(num3)).toBe('-33');
  })

  test('should rise an error if insucient parameters for sqrt!', () => {
    let inputString = 'sqrt';
    calculator.stack = [];
    expect(()=>{calculator.sqrt(inputString,0);}).toThrowError('Operator sqrt (position: 1): insucient parameters');

  })

  test('should rise an error if insucient paraments for binary calculation!', () => {
    let inputString = '-';
    calculator.stack = ['1'];
    expect(()=>{calculator.biOperation(inputString,5);}).toThrowError('Operator - (position: 11): insucient parameters');
  });

  test('should undo the previous operation if user input a undo command.', () => {
    calculator.clear();
    calculator.operationSnapshot = [];
    let inputString = '5 4 3 2';
    calculator.calculate(inputString);
    let secInputString = 'undo undo *';
    calculator.calculate(secInputString);
    expect(calculator.getStack()).toEqual('20');
    let thrdInputString = '5 *';
    calculator.calculate(thrdInputString);
    expect(calculator.getStack()).toEqual('100');
    let forthInputString = 'undo';
    calculator.calculate(forthInputString);
    expect(calculator.getStack()).toEqual('20 5');
  });

})