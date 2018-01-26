var output = console.log;
module.exports = class Calculator {
    constructor(){
        this.stack = [];
        this.operationSnapshot = [];
        this.inputString = '';
    }

    calculate(inputString) {
        let input = inputString;
        let parsedParameters = [];
        try{
            parsedParameters = this.inputStringParser(input);
            parsedParameters.forEach((el,index) => {
                if(this.isAllowedOperator(el)){
                    try{
                        switch(el){
                            case 'sqrt':
                                this.operationSnapshot.push([...this.stack]);
                                this.stack.push(this.sqrt(el,index));
                                break;
                            case '+':
                            case '-':
                            case '*':
                            case '/':
                                this.operationSnapshot.push([...this.stack]);
                                this.stack.push(this.biOperation(el, index));
                                break;
                            case 'undo':
                                this.undo(el, index);
                                break;
                            case 'clear':
                                this.clear();
                                break;
                            default:
                                break;
                        }
                    }catch(e) {
                        throw new Error(e.message)
                    }

                }else{
                   this.stack.push(el);
                }
            })
        }catch(e){
            throw new Error(e.message);
        }

    }

    inputStringParser(inputString) {
        let parsedArray = [];
        let __arr = inputString.trim().split(" ");
        let wrongPosition = [];
        __arr.forEach((el,index) => {
            if(this.isRealNumber(el) || this.isAllowedOperator(el)){
                parsedArray.push(el);
            }else{
                wrongPosition.push(index*2+1);
            }
        })
        if(wrongPosition.length>0){
            throw new Error("There are "+wrongPosition.length+" unallowed parameters in your input.Position: " + wrongPosition.join(",") + ". Your input is [" + inputString + "]!");
        }else{
            parsedArray = __arr.slice();
        }

        return parsedArray;
    }

    isRealNumber(inputString) {
        let realNumberRegx = /^[-+]?[0-9]*\.?[0-9]+$/;
        return realNumberRegx.test(inputString);
    }

    isAllowedOperator(inputString) {
        let allowedOperatorRegx = /^sqrt$|^undo$|^clear$|^[+\-*\/]$/;
        return allowedOperatorRegx.test(inputString);
    }

    clear() {
        this.stack = [];
        //Decision about whether clear oerationSnapshot or not could be made by requirement.Here I suggest it should be cleared.
        this.operationSnapshot = [];
    }

    numConvertor(numString){
        if(numString.indexOf('.') !== -1){
            let numArr = numString.split('.');
            let digiPart = numArr[1];
            if(digiPart.length > 10){
                numArr[1] = digiPart.substr(0,10);
            }
            return numArr.join('.');
        }else{
            return numString;
        }
    }

    getStack() {
        return this.disPlayStack(this.stack).join(" ");
    }

    disPlayStack(stackArr){
        let __arr = stackArr.slice();
        let that = this;
        __arr = __arr.map(el=>{
            return that.numConvertor(el);
        })
        return __arr;
    }

    sqrt(el,index) {
        if(this.stack.length > 0){
            let operand = this.stack.pop();
            return Math.sqrt(operand).toString();
        }else {
            throw new Error(`Operator ${el} (position: ${index*2+1}): insucient parameters`);
        }
    }

    biOperation(el, index) {
        if(this.stack.length > 1){
            let operandRight = this.stack.pop();
            let operandLeft = this.stack.pop();
            let result;
            switch (el) {
                case '+':
                    result =  +operandLeft + +operandRight;
                    break;
                case '-': 
                    result =  operandLeft - operandRight;
                    break;
                case '*':
                    result = operandLeft * operandRight;
                    break;
                case '/': 
                    result = operandLeft / operandRight;
                default:
                    break;
            }
            return result.toString()
        }else {
            throw new Error(`Operator ${el} (position: ${index*2+1}): insucient parameters`);
        } 
    }

    undo(el, index){
        // means it has previous operations
        if(this.operationSnapshot.length > 0){
           this.stack = this.operationSnapshot.pop(); 
        }else {
            this.stack.pop();
        }
    }

}