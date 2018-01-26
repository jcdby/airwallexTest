var readline = require('readline');
var output = console.log;
var Calculator = require('./Calculator.js');

var rl = readline.createInterface({
  input: process.stdin,
});



var calculator = new Calculator();

output("Calculator has been initiated!")
rl.on('line', (line) => {
  if(line === 'exit'){
    rl.close();
  }
  try{
    calculator.calculate(line);
  }catch(e){
    output(e.message + ` Please try again!`);
  }

  output(`stack: ${calculator.getStack()}`);
  
});

rl.on('close', ()=>{
  process.exit(0);
})

