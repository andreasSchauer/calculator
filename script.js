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
  const plusMinusRegex = /((?:(?<!=\d)\-)?\d+\.?\d*)(\+|\-)((?:(?<!=\d)\-)?\d+\.?\d*)/;
  const multiplyDivideRegex = /((?:(?<!=\d)\-)?\d+\.?\d*)(\*|\/)((?:(?<!=\d)\-)?\d+\.?\d*)/;
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
  const integer = Math.floor(Number(input));
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
      const isMultiplyOrDivide = /\*|\//.test(button.textContent);
      const openParenthesesAtEnd = /\($/.test(commandLine.textContent);
      
      if(openParenthesesAtEnd && isMultiplyOrDivide) {
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
  const unclosedParentheses = /\([\d\.\+\-\*\/]*$/.test(commandLine.textContent);
  const noOperatorAtEnd = /[\d\.\)]$/.test(commandLine.textContent);

  if(unclosedParentheses || noOperatorAtEnd) {
    return
  }
  
  commandLine.textContent += "(";
})

parenthesesCloseButton.addEventListener("click", () => {
  const unclosedParentheses = /\([\d\.\+\-\*\/]+$/.test(commandLine.textContent);
  const noDigitAtEnd = !/\d$/.test(commandLine.textContent);
  
  if(!unclosedParentheses || noDigitAtEnd) {
    return
  }
  
  commandLine.textContent += ")";
})

dotButton.addEventListener("click", () => {
  const startsWithDigit = /^\d+$/.test(commandLine.textContent);
  const noCurrentFloat = /([\+\-\*\/\(\)]\d+)$/.test(commandLine.textContent);
  
  if(startsWithDigit || noCurrentFloat) {
    commandLine.textContent += "."
  }
})


equalButton.addEventListener ("click", () => {
  const input = commandLine.textContent;
  const result = calculate(input);
  
  if (Number(result) === Math.floor(result)) {
    commandLine.textContent = result;
    return
  }
  
  const digitsAmount = findIntegerDigits(result) + findDecimalPlaces(input);
  commandLine.textContent = Number(result).toPrecision(digitsAmount);
})

clearButton.addEventListener("click", () => {
  commandLine.innerHTML = "";
})

