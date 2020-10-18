const numbers = document.querySelectorAll('.number'),
      operations = document.querySelectorAll('.operator'),
      clearBtns = document.querySelectorAll('.clear-btn'),
      resultBtn = document.getElementById('result'),
      display = document.getElementById('display'),
      decimalBtn = document.getElementById('decimal'),
      resultDisplay = document.getElementById('result_display'),
      sqrtBtn = document.getElementById('sqrt'),
      plusMinusBtn = document.getElementById('plusMinus');
    

let memoryCurrentNumber = '0',
    memoryNewNumber = false,
    isDecimalUsed = false,
    isResultDisplayEmpty = true,
    isNewNumber = false,
    isNewEquation = false,
    isplusMinus = false;


for (let i = 0; i < numbers.length; i++) {  
    let number = numbers[i];
    number.addEventListener('click', function (e) {
        numberPress(e.target.textContent);
    })
}

for (let i = 0; i < operations.length; i++) {  
    let operationBtn = operations[i];
    operationBtn.addEventListener('click', function (e) {
        operation(e.target.textContent);
    })
}

for (let i = 0; i < clearBtns.length; i++) {  
    let clearBtn = clearBtns[i];
    clearBtn.addEventListener('click', function (e) {
        clear(e.target.id);    
    })
}

resultBtn.addEventListener('click', function () {
    result()
    })

decimalBtn.addEventListener('click', function () {
    decimal()
    })

sqrtBtn.addEventListener('click', function () {
    sqrt()
    })

plusMinusBtn.addEventListener('click', function () {
    plusMinus()
})

function sqrt () {
    resultDisplay.innerHTML += ' √';
}

function plusMinus () {
    if (display.value[0] != '-') isPlusMinus = false;
    if (!isPlusMinus) {
        display.value = '-' + display.value;
        isPlusMinus = true;
    } else {
        display.value = display.value.slice(1, display.value.length);
        isPlusMinus = false;    
    }
}

function numberPress(num) {
    if (memoryNewNumber == true) {
        display.value = '';
        memoryNewNumber = false;
    }

    if (display.value == '0') {
        display.value = num;
    } else if (isNewNumber) {
        display.value = num;
        isNewNumber = false;
    } else {
        display.value += num;
    }

    if (isNewEquation) {
        resultDisplay.innerHTML = '';
        isNewEquation = false;
    }
}

function decimal() {
    if (isDecimalUsed == false) {
        display.value += '.';
        isDecimalUsed = true;
    }
}

function clear(id) {
    if (id == 'c') {
        if (display.value.length == 1) {
            display.value = '0';
        } else {
            display.value = display.value.slice(0, -1);
        }
    } else if (id = 'ce') {
        display.value = '0';
        resultDisplay.innerHTML = '';
    }

    isDecimalUsed = !(Number.isInteger(Number(display.value))); 
}

function result() {
    let tempValue = display.value;
    if (resultDisplay.innerHTML[resultDisplay.innerHTML.length - 1] == ')') {
        let temp = myEval(resultDisplay.innerHTML);
        if (temp == "otric") {
            resultDisplay.innerHTML = "";
            display.value = "0";
            return;
        } else {
            display.value = temp;
            resultDisplay.innerHTML += ' ' + tempValue.slice(0, tempValue.length - 1) + ' =';
        }
        
    } else {
        temp = myEval(resultDisplay.innerHTML + display.value);
        if (temp == "otric") {
            resultDisplay.innerHTML = "";
            display.value = "0";
            return;
        }   
        display.value = temp;
        resultDisplay.innerHTML += ' ' + tempValue + ' =';
    }
    

    memoryNewNumber = true;
    isDecimalUsed  = false;
    isResultDisplayEmpty = true;
    isNewNumber = true;
    isNewEquation = true;
}

function operation(symbol) {
    if (isNewEquation) {
        resultDisplay.innerHTML = '';
        isNewEquation = false;
    }

    if (resultDisplay.innerHTML[resultDisplay.innerHTML.length - 1] == ')') {
        resultDisplay.innerHTML += " " + symbol;
    } else {
        resultDisplay.innerHTML += " " + display.value + " " + symbol;
    }
    
    isResultDisplayEmpty = false;
    memoryNewNumber = false;
    isDecimalUsed = false;
    isNewNumber = true;
    var lastSymbol = symbol;
}

function myEval(expr) {
	const stackNumbers = [];
    const stackOperations = [];

    const priorityOperations = {
    	'–' : 1,
    	'+' : 1,
    	'*' : 2,
        "/" : 2,
        '^' : 3,
        '√' : 3,
    }

    let arr = devideStr(expr);
  
    for (let i = 0; i < arr.length; i++) {
    	if (!isNaN(arr[i]))  {
    		stackNumbers.push(Number(arr[i]));
    		continue;
    	}

    	if (arr[i] == '(') {
    		stackOperations.push(arr[i]);
    		continue;
    	}

    	if (arr[i] == ')') {
    		while (stackOperations[stackOperations.length - 1] != '(') {
		    	let SecondNum = stackNumbers.pop();
		    	let firstNum = stackNumbers.pop();
		 		let operat = stackOperations.pop();

		  		countFunc(firstNum, operat, SecondNum);
  			
		    }
		    stackOperations.pop();
		    continue;
    	}

    	if (stackOperations[0] == undefined) {	
    		stackOperations.push(arr[i]);	
    		continue;
    	}


    	let lastElemOperStack = stackOperations[stackOperations.length - 1];
 		let lastOperStackPriority = priorityOperations[lastElemOperStack];

 		let currentElement = arr[i];
 		let currentElementPriority = priorityOperations[currentElement];
 		
 		if (currentElementPriority > lastOperStackPriority) {
 			stackOperations.push(arr[i]);	
    		continue;	
 		}

    	while (lastOperStackPriority >= currentElementPriority) {
    		let SecondNum = stackNumbers.pop();
  			let firstNum = stackNumbers.pop();
  			let operat = stackOperations.pop();

  			countFunc(firstNum, operat, SecondNum);

    		lastElemOperStack = stackOperations[stackOperations.length - 1];
 			lastOperStackPriority = priorityOperations[lastElemOperStack];
    	}
    	stackOperations.push(arr[i]);

    }

    while (stackOperations[0] != undefined) {
    	let SecondNum = stackNumbers.pop();
    	let firstNum = stackNumbers.pop();
 		let operat = stackOperations.pop();

        let res = countFunc(firstNum, operat, SecondNum);
        if (res == 'otric') return 'otric';
    }

    let resultNumber = cleanEnding(stackNumbers[0]);
	return resultNumber;

    function cleanEnding(number) {
        number = number.toString();
        let match = number.match(/\.\d*/);
        if (match === null) return number;
        match = match[0];
        let position = match.search(/0{4,}/);
        console.log(position);
        if (position == -1) {
            return number;
        } else {
            let firstPart = number > 0 ? Math.floor(number) : '-' + Math.ceil(number);
            number = firstPart + match.slice(0, position);
        return number;
        }
    }

	function devideStr(arr) {
		const re = /([+–/*^√)(])/;
	    arr = arr.split(re);

	    for (i in arr) {
	    	arr[i] = arr[i].trim();
	    	if ( (arr[i] == '') || ( arr[i] == ' ') ) {
	    		arr.splice(i, 1);
	    	}
	    }

	    return arr;
	}

	function countFunc(firstNum, operat, SecondNum) {
		switch (operat) {
	  		case "+" :
	  			stackNumbers.push(firstNum + SecondNum);
	  			break;
	  		case "–" : 
	  			stackNumbers.push(firstNum - SecondNum);
	  			break;
	  		case "*" : 
	  			stackNumbers.push(firstNum * SecondNum);
	  			break;
	  		case "/" :
                if (SecondNum == 0) throw("TypeError: Division by zero."); 
                stackNumbers.push(firstNum / SecondNum);
                break;
            case "^" :
                stackNumbers.push( Math.pow(firstNum, SecondNum) );
                break;
            case "√" :
                if (SecondNum < 0) 
                {
                    alert("Корень из отрицательного!");
                    return "otric";
                }
                if (firstNum) stackNumbers.push(firstNum);
                stackNumbers.push(Math.sqrt(SecondNum));
                
                break;
	  	}
	}
}