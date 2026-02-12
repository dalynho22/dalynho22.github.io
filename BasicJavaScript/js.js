// Global counter variable
let counter = 0;

// Increase counter
function tickUp(){
    counter++;
    document.getElementById("counter").textContent = counter;
}

/* A method is just a function that belongs to an object. 
  document.getElementById() → method of document */

/* .textContent works with plain text. 
  It's a property that gets or sets the text inside an element. */

// Decrease counter
function tickDown(){
    counter--; 
    document.getElementById("counter").textContent = counter; 
}

function runForLoop(){
    let result = " ";
    for (let i = 0; i<= counter; i++){
        result += i + " " ;
    }
    document.getElementById("forLoopResult").textContent = result; 
}

function showOddNumbers(){
    let oddResults = " ";
    
    for(let i = 1; i<= counter; i++){
        if(i % 2 !== 0 ){ //!== (Strict Not Equal): Compares value AND type with No automatic conversion
            oddResults += i + " "; //!=(Loose Not Equal): Compares values with Automatica type conversion (type coercion)
        }
    }
    document.getElementById("oddNumberResult").textContent = oddResults; 

}

function addMultiplesToArray(){
    let arr = [ ];

    for (let i = counter; i >= 5; i--){
        if(i % 5 === 0){
            arr.push(i);
        }
    }

    /* == (loose equality): Checks value & Automatically converts types (type coercion) */
    /* === (strict equality): Checks value & Checks type & No automatic conversion */

    console.log(arr);
}

function printCarObject() {
    let car = {
        //.value is used for form inputs(not .textContent)
        cType: document.getElementById("carType").value,
        cMPG: document.getElementById("carMPG").value,
        cColor: document.getElementById("carColor").value
    };

    console.log(car);
}

/* .value is specifically used for form controls (like <input>, <select>, <textarea>, and <button>) 
to get or set the data they contain. This is the data that would be submitted with a form. */

/* .textContent is used for all other HTML elements (like <div>, <p>, <span>, <h1>, etc.) 
to get or set the plain text content between their opening and closing tag */
function loadCar(num) {
    let car;

    if (num === 1) {
        car = carObject1;
    } else if (num === 2) {
        car = carObject2;
    } else if (num === 3){
        car = carObject3;
    }

    document.getElementById("carType").value = car.cType;
    document.getElementById("carMPG").value = car.cMPG;
    document.getElementById("carColor").value = car.cColor;
}

/* Set style using pure JavaScript .style property applies to individual DOM elements. 
It's a collection of objects Copy document.body.style */
function changeColor(num) {
    let paragraph = document.getElementById("styleParagraph");

    if (num === 1) {
        paragraph.style.color = "red";
    } else if (num === 2) {
        paragraph.style.color = "green";
    } else if (num ===3 ) {
        paragraph.style.color = "blue";
    }
}
