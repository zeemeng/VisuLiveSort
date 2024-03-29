/**
* Author:    Zi Han Meng <zi.han.meng100@gmail.com>
* Copyright: (c) 2021 Zi Han Meng
* License:   GNU General Public License Version 3
**/

/* Attaching event handler to control buttons */
document.getElementById('nra-btn').addEventListener('click', updateMainArrayContent);

document.getElementById('reshuffle-btn').addEventListener('click', reshuffle);

document.getElementById('manual-array-form').addEventListener('submit', processManualArrayForm);

document.getElementById('manual-array').addEventListener('click', clearFormError);

/* "nra-btn" event handler */// --> Updates all parameters and variables required by "utilities.js", reexecutes all relevant statements (excludes variable declarations) from "utilities.js", sets $maxNumVal if directly invoked as event handler callback and executes "generateHTMLMainArray()".
function updateMainArrayContent(event, customArray) {
    cancelPendingJobs();
    if (animationOngoing && activeSortHandle.id == 'merge-sort') {
        document.getElementById("buffer-array").parentElement.removeChild(document.getElementById("buffer-array"));
        
        let mainArray = document.querySelector('.main-array');
        let newMainArray = mainArray.cloneNode(false);
        newMainArray.style.height = "90%";
        mainArray.parentElement.style.justifyContent = "center";
        mainArray.parentElement.replaceChild(newMainArray, mainArray);
    }

    if (animationOngoing && activeSortHandle.id == 'counting-sort') {
        document.querySelector('.counting-sort-container').parentElement.removeChild(document.querySelector('.counting-sort-container'));
        
        let mainArray = document.querySelector('.main-array');
        let newMainArray = mainArray.cloneNode(false);
        newMainArray.style.height = "90%";
        mainArray.parentElement.style.justifyContent = "center";
        mainArray.parentElement.replaceChild(newMainArray, mainArray);
    }

    animationOngoing = false;
    if (event) maxNumVal = activeSortHandle.id == 'counting-sort' ? 10 : 100; //Sets $maxNumVal if "updateMainArrayContent()" is directly invoked as event handler callback
    generateHTMLMainArray(customArray); //The argument $customArray would be undefined if "updateMainArrayContent()" is directly invoked as event handler callback, otherwise an array object shall be provided as its value.
    arrElemGap = gap; //**IMPORTANT** $gap is declared in "script.js" and $arrElemGap is declared in "utilities.js"
    arrElemWidth = width; //**IMPORTANT** $width is declared in "script.js" and $arrElemWidth is declared in "utilities.js"
    valsToSort = randNumArray //**IMPORTANT** $randNumArray is declared in "script.js" and $valsToSort is declared in "utilities.js"
    elems = [...document.querySelectorAll('.drag-sort-handle')];
    elemsContainerDimen = document.querySelector('.main-array').getBoundingClientRect();
    elems.forEach(elemStylePositioner); //Initially places the unsorted DOM elements within their DOM container
    elems.forEach(elem => { elem.onmousedown = dragSortInit; }); //Attaching the drag-sort action initialization event handler to each array element of $elems
    document.querySelectorAll('.slider-handle').forEach((element) => {
        fixTextOverflow(element); //Prevents the overflowing of textContent of the span.number-display within $target
        element.onmousedown = dragInit; //Attaching the drag action initializer to all DOM elements with class="slider-handle"
    });
};

/* "reshuffle-btn" event handler using the Fisher-Yates algorithm */
function reshuffle() {
    if (animationOngoing) {
        if (activeSortHandle.id == 'merge-sort' || activeSortHandle.id == 'quick-sort' || activeSortHandle.id == 'counting-sort') {
            updateMainArrayContent(undefined, valsToSort);
        } else {
            cancelPendingJobs();
            enableSlideDrag();
            animationOngoing = false;
        }
    }
    
    for (let i = randNumArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); //This statement needs to use "Math.floor()" in conjunction with the expression "(i + 1)" instead of using "Math.round()" in conjuction with the expression "i", since Math.round() has a probability distribution over the range of return values that is skewed at both tails (in most cases) whereby the lowest possible integer and the highest possible integer have half the probability of being returned than any integer in-between them.

        let temp = randNumArray[j]; randNumArray[j] = randNumArray[i]; randNumArray[i] = temp;
        temp = elems[j]; elems[j] = elems[i]; elems[i] = temp;
    }

    resetArrayItemsColor();
    setTimeout(() => { //This "setTimeout" delayed execution of code is required in order for FF to properly process transitions on DOM "array items", if "setTimeout" is omitted FF skips all transitions that would normally be induced by code within $reshuffle. Chrome does not have this issue and would not require this delayed execution of code.
        elems.forEach(elemStylePositioner); //Reposition each main array subelement at the right position
    }, 5)
};

/* "Manual input array" form handler */
function processManualArrayForm(e) {
    e.preventDefault();
    clearFormError();
    const inputCtrl = document.getElementById('manual-array'); //Gets the input control DOM object
    let inputVal = inputCtrl.value; //A string value
    let quit = false;

    //The following lines convert the value of $inputVal into a format that is suitable for validation and further processing.
    if (inputVal.startsWith('[') && inputVal.endsWith(']')) inputVal = inputVal.substring(1, inputVal.length - 1);
    inputVal = inputVal.split(/[\s,]+/);
    if (inputVal[0] === '') inputVal.shift();
    if (inputVal[inputVal.length - 1] === '') inputVal.pop();
    if (inputVal.length === 0) return;

    //User input data validation
    inputVal.forEach((elem, index) => {
        if (quit) return; //If the $quit flag has been set by a previous iteration, exit this iteration immediately.
        
        if (Number.isNaN(Number(elem))) {
            inputCtrl.classList.add("invalid");
            document.querySelector('#manual-array-fs > legend').style.visibility = "visible";
            inputCtrl.select();
            quit = true;
            return;
        } else {
            const currentNumber = parseFloat(elem); //Parse the current value as a number.

            //If the current value is a number, check whether it is negative and if the current sorting method is "counting sort", check if the value is greater than ten. In both these cases, signal an error.
            if (currentNumber < 0 || (activeSortHandle.id == 'counting-sort' && currentNumber > 10)) {
                inputCtrl.classList.add("invalid");
                document.querySelector('#manual-array-fs > legend').style.visibility = "visible";
                inputCtrl.select();
                quit = true;
                if (currentNumber < 0) showInfoDialog('warning-msg-1');
                else showInfoDialog('warning-msg-2');
                return;
            }

            inputVal[index] = currentNumber; //If the current value passes all checks, store it in $inputVal.
        }
    });
    
    if (quit) return; //If the $quit flag has been set due to a failed validation test, exit this event handler now.

    //If the user input data passes validation, it is used to update the main DOM array.
    maxNumVal = inputVal.reduce((accum, currVal) => accum > currVal ? accum : currVal);
    calculateWidthGapCount(inputVal.length);
    updateMainArrayContent(undefined, inputVal);
};

/* Clears error prompt on "manual input array" if present */
function clearFormError() {
    document.getElementById('manual-array').classList.remove("invalid");
    document.querySelector('#manual-array-fs > legend').style.visibility = "hidden";
};
