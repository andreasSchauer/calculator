"use strict";

const commandLine = document.getElementById("command-line");
const equalButton = document.getElementById("equal-button");
const clearButton = document.getElementById("clear-button");
const dotButton = document.getElementById("dot-button");
const parenthesesOpenButton = document.getElementById("parentheses-open");
const parenthesesCloseButton = document.getElementById("parentheses-close");
const numberButtons = document.getElementsByClassName("number");
const operatorButtons = document.getElementsByClassName("operator");


const formulas = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y
}

const replaceFormula = (string, regex) => {
  return string.replace(regex, (_match, num1, operator, num2) => {
    return formulas[operator](Number(num1), Number(num2));
  });
}

const calculate = (input) => {
  let solution = input;
  
  // accounts for negative values as well as decimal numbers
  const number = `((?:(?<!=\\d)\\-)?\\d+\\.?\\d*)`;
  const plusMinusRegex = new RegExp(number + `(\\+|\\-)` + number);
  const multiplyDivideRegex = new RegExp(number + `(\\*|\\/)` + number);
  const parenthesesRegex = /\(([\d\.\+\-\*\/]+)\)/; 
  
  while(solution.match(parenthesesRegex)) {
    solution = solution.replace(parenthesesRegex, ((match, content) => calculate(content)));
  } 
  
  while(solution.match(multiplyDivideRegex)) {
    solution = replaceFormula(solution, multiplyDivideRegex);
  }
  
  while(solution.match(plusMinusRegex)) {
    solution = replaceFormula(solution, plusMinusRegex);
  }
  
  return solution;
}


const findDecimalPlaces = (input) => {
  const decimalRegex = /(?<=\.)\d+/g;
  const matchedDecimals = input.match(decimalRegex);
  
  if(!matchedDecimals) {
    return 0;
  };
  
  const highestDecimalPlaces = matchedDecimals.toSorted((a,b) => b.length - a.length);
  return highestDecimalPlaces[0].length;
}

const findIntegerDigits = (input) => {
  const integer = Math.floor(input);
  return integer === 0 ? 0 : String(integer).length;
}


window.onload = () => {
  for(let button of numberButtons) {
    button.addEventListener("click", () => {
      commandLine.textContent += button.textContent;
    })
  }
  
  for(let button of operatorButtons) {
    button.addEventListener("click", () => {
      const operatorAtEnd = /[\.\+\-\*\/]$/.test(commandLine.textContent);
      const isNotMinus = /[\+\*\/]/.test(button.textContent);
      const openParenthesesAtEnd = /\($/.test(commandLine.textContent);
      
      if(openParenthesesAtEnd && isNotMinus) {
        return
      }
      
      if(operatorAtEnd) {
        return;
      }
      
      commandLine.textContent += button.textContent;
    })
  }
}


parenthesesOpenButton.addEventListener("click", () => {
  const alreadyOpen = /\([\d\.\+\-\*\/]*$/.test(commandLine.textContent);
  const noOperatorAtEnd = /[\d\.\)]$/.test(commandLine.textContent);

  if(alreadyOpen || noOperatorAtEnd) {
    return
  }
  
  commandLine.textContent += "(";
})

parenthesesCloseButton.addEventListener("click", () => {
  const alreadyClosed = !/\([\d\.\+\-\*\/]+$/.test(commandLine.textContent);
  const noDigitAtEnd = !/\d$/.test(commandLine.textContent);
  
  if(alreadyClosed || noDigitAtEnd) {
    return
  }
  
  commandLine.textContent += ")";
})

dotButton.addEventListener("click", () => {
  const startsWithDigit = /^\d+$/.test(commandLine.textContent);
  const noFloatingNum = /([\+\-\*\/\(\)]\d+)$/.test(commandLine.textContent);
  
  if(startsWithDigit || noFloatingNum) {
    commandLine.textContent += "."
  }
})


equalButton.addEventListener ("click", () => {
  const input = commandLine.textContent;
  const endsWithDot = /\.$/.test(input);
  const result = Number(calculate(input));
  
  if(!result || endsWithDot) {
    commandLine.textContent = "Invalid Input";
    setTimeout(() => {
      commandLine.textContent = "";
    }, 1500);
    return
  }
  
  if(Number.isInteger(result)) {
    commandLine.textContent = result;
    return
  }
  
  const digitsAmount = findIntegerDigits(result) + findDecimalPlaces(input);
  commandLine.textContent = result.toPrecision(digitsAmount);
})

clearButton.addEventListener("click", () => {
  commandLine.innerHTML = "";
})
