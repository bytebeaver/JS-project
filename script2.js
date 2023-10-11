const inputSlider = document.querySelector("[data-lengthSlider]");//custom attribute ka use krke element fetch kr rahe hain ..uska syntax yahi hota hai

const lengthDisplay= document.querySelector("[data-lengthNumber]");

const passwordDisplay= document.querySelector("[data-passwordDisplay]");

const copyBtn= document.querySelector("[data-copy]");

const copyMsg= document.querySelector("[data-copyMsg]");

const uppercaseCheck= document.querySelector("#uppercase");

const lowercaseCheck= document.querySelector("#lowercase");

const numbersCheck= document.querySelector("#numbers");

const symbolsCheck= document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");

const generateBtn= document.querySelector(".generateButton");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");



let password="";

//default case me password length 10 hai
let passwordLength= 10;

let checkCount= 0;//jb checkbox koi bhi check hoga to count increment ho jayega
handleSlider();
//set strength circle color to grey



//creating functions:

//handling the slider: it will set the password length according to the positionn of the slider
function handleSlider()
{
    //slider initially 10 pe point kr raha hai
    inputSlider.value = passwordLength;
    
    //intially length bhi 10 hi display ho rahi hai
    lengthDisplay.innerText = passwordLength;

    
}

function setIndicator(color){
   
    indicator.style.backgroundColor = color;
    //deploying shadow:

}

function getRandomInteger(min, max){
   return Math.floor( Math.random() * (max-min) ) + min;
   //math.random function o se 1 ke bich kuch return krega
   //us number ko max-min se multiply krenge to we'll get a number in range 0 to (max-min), 0 included and (max- min) excluded
   //isme decimal number bhi generate ho skte hain to usko round of krne ke liye math.floor
   //hme to min to max ke bich me number chahie so min + kr diya end me
}

//getting the digit for our password
function generateRandomNumber(){
    return getRandomInteger(0,9);
}

//getting lowercase for password
function generateLowerCase()
{
     return String.fromCharCode(getRandomInteger(97, 123));
     //97 and 123 are ascii values of a and z respectively
     
     //string.fromcharcode(ascii code) converts the ascii value to its respective character

}

//getting uppercase for password
function generateUpperCase()
{
     return String.fromCharCode(getRandomInteger(65,90));//65 and 91 are ascii values of A and Z respectively
}

//getting symbol for password
function generateSymbol()
{
    const symbols = ['!', '@', '#', '$', '%', '^', '&', '*'];
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
}

//calculating strength of password
function calcStrength(){
    let hasUpper = false;
    let hasLower= false;
    let hasNum = false;
    let hasSymbol = false;
    
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSymbol=true;
    
   if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength>8)
   {
    setIndicator("#0f0");
   }

   else if((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength>=6)
   {
    setIndicator("#ff0");
   }

   else 
   {
    setIndicator("#f00");
   }
}

//very important
async function copyContent(){
   try{
   await navigator.clipboard.writeText(passwordDisplay.value);
   copyMsg.innerText="copied";
   }


   catch(e){
    copyMsg.innerText="failed";
   }
   
   //to make copy wala span visible
   copyMsg.classList.add("active");

   setTimeout(() => {

    copyMsg.classList.remove("active");
   },2000 );


}


//event listeners

//event listener on slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

//copy button wala

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value)//agr koi password generated pda hai and copy button pr click kre to copycontent function call ho jaye
    copyContent();
})

//implementing eventlistener on checkbox

function handleCheckBoxChange() {
    console.log("Checkbox change event triggered");
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }


}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})




//generate password wala eventlistener

//isme end me jb password generate ho jayega to usko shuffle vhi krna hoga
function shufflePassword(array) {
    //Fisher Yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        //swap
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}





generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    
    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRandomInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});

