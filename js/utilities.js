/**
* Author:    Zi Han Meng <zi.han.meng100@gmail.com>
* Copyright: (c) 2021 Zi Han Meng
* License:   GNU General Public License Version 3
**/

/*** General Utility Functions ***/
function disableSlideDrag() {
    document.querySelectorAll('.slider-handle').forEach((element) => element.onmousedown = null); //Detaching the drag action initializer to all DOM elements with class="slider-handle"
    elems.forEach(elem => { elem.onmousedown = null; }); //Detaching the drag-sort action initialization event handler from each array element of $elems
};

function enableSlideDrag() {
    document.querySelectorAll('.slider-handle').forEach((element) => element.onmousedown = dragInit); //Attaching the drag action initializer to all DOM elements with class="slider-handle"
    elems.forEach(elem => { elem.onmousedown = dragSortInit; }); //Attaching the drag-sort action initialization event handler to each array element of $elems
};

function resetArrayItemsColor() {
    elems.forEach(elem => elem.style.backgroundColor = "var(--main-blue)");
    if (activeSortHandle.id == 'insertion-sort' || activeSortHandle.id == 'bubble-sort') elems.forEach(elem => {
        elem.style.boxShadow = "none";
        elem.parentElement.style.zIndex = "auto";
    });
}

let initialTimerID;
function cancelPendingJobs() {
    let currentTimerID = setTimeout(() => {});
    for (let i = initialTimerID; i <= currentTimerID; i++) clearTimeout(i);

    //For smoothly clearing up any potentially active info dialog, since the usual info dialog presentation process is also affected by the statements above
    activeInfoDialog.style.opacity = "0%";
    setTimeout(() => activeInfoDialog.style.top = "-100px", 500);
};

function fixTextOverflow(sliderHandle) {
    const numberDisplay = sliderHandle.firstChild;
    if (Math.hypot(numberDisplay.offsetWidth, numberDisplay.offsetHeight) > sliderHandle.offsetWidth) numberDisplay.textContent = "#";
    if (Math.hypot(numberDisplay.offsetWidth, numberDisplay.offsetHeight) > sliderHandle.offsetWidth) numberDisplay.textContent = "";
}


/*** For Slider Drag Action ***/
//All variables declared below are defined/redefined by dragInit() and would hold values to be used by the slider drag action mechanism. (i.e. dragInit() and dragOn() )
let target, targetHalfHeight, sliderBar;
let targetTrack, trackInfo, trackHeight;
let highestPos, lowestPos;
let sliderVal = 0; //Declares a globally accessible variable to hold the slider value
let hasNotMoved = true;

//Drag action initialization event handler
function dragInit(e) {
    e.preventDefault();
    hasNotMoved = true;

    //Redefining all values used and manipulated by the slider drag action mechanism based on the selected slider handle
    target = this; //This is the currently selected slider handle
    targetHalfHeight = target.getBoundingClientRect().height / 2;
    targetTrack = this.parentElement; //This is the slider track on which the handle slides
    trackInfo = targetTrack.getBoundingClientRect(); //This value holds the dimensions of the slider track
    trackHeight = trackInfo.height;
    highestPos = trackInfo.top + window.scrollY; //$trackInfo.top is viewport coordinate; adding $window.scrollY converts it to document-page coordinate
    lowestPos = trackInfo.bottom + window.scrollY; //$trackInfo.bottom is viewport coordinate; adding $window.scrollY converts it to document-page coordinate
    sliderBar = this.previousElementSibling; //This is the "slider bar" component controlled by the current slider handle

    //Add decorative styles to slider handle
    target.style.boxShadow = '0px 0px 0px 8px rgba(0, 0, 0, 0.25)';
    target.style.zIndex = 1;

    //Attach motion event handlers
    document.onmouseup = dragFini;
    document.onmousemove = dragOn;
};

//Drag action core event handler
function dragOn(e) {
    e.preventDefault();
    hasNotMoved = false;

    //Calculates $sliderVal value, which ranges from 0 to 1 based $e.pageY
    if (e.pageY > lowestPos) sliderVal = 0;
    else if (e.pageY >= highestPos) sliderVal = (lowestPos - e.pageY) / trackHeight;
    else sliderVal = 1;

    target.style.top = trackHeight * (1 - sliderVal) - targetHalfHeight + 'px'; //Updates the position of the slider handle using CSS
    target.firstChild.textContent = Math.round(sliderVal * maxNumVal); //Updates the number displayed within the slider handle through the HTML content
    fixTextOverflow(target); //Prevents the overflowing of textContent of the span.number-display within $target
    sliderBar.style.height = trackHeight * sliderVal + 'px'; //Updates the position of the "slider-bar"'s height using CSS
};

//Drag action termination event handler
function dragFini(e) {
    //Detach motion event handlers
    document.onmouseup = null;
    document.onmousemove = null;

    //Reset decorative styles
    target.style.boxShadow = null;
    target.style.zIndex = null;

    if (hasNotMoved) return;

    randNumArray[parseInt(target.parentElement.getAttribute('data-currentindex'))] = Math.round(sliderVal * maxNumVal);
    
    let roundedSliderVal = Math.round(sliderVal * maxNumVal) / maxNumVal;
    target.style.top = trackHeight * (1 - roundedSliderVal) - targetHalfHeight + 'px'; //Updates the position of the slider handle using CSS
    sliderBar.style.height = trackHeight * roundedSliderVal + 'px'; //Updates the position of the "slider-bar"'s height using CSS
};

//Attaching initialization event handlers
document.querySelectorAll('.slider-handle').forEach((element) => {
    fixTextOverflow(element); //Prevents the overflowing of textContent of the span.number-display within $target
    element.onmousedown = dragInit; //Attaching the drag action initializer to all DOM elements with class="slider-handle"
});


/*** For Horizontal Sliders of Settings Box ***/
let trackWidth, leftmostPos, rightmostPos

//Horizontal slider drag action initialization event handler
function h_dragInit(e) {
    e.preventDefault();

    //Redefining all values used and manipulated by the slider drag action mechanism based on the selected slider handle
    target = this; //This is the currently selected slider handle
    targetHalfHeight = target.getBoundingClientRect().height / 2;
    targetTrack = this.parentElement; //This is the slider track on which the handle slides
    trackInfo = targetTrack.getBoundingClientRect(); //This value holds the dimensions of the slider track
    trackWidth = trackInfo.width;
    leftmostPos = trackInfo.left + window.scrollX; //$trackInfo.left is viewport coordinate; adding $window.scrollX converts it to document-page coordinate
    rightmostPos = trackInfo.right + window.scrollX; //$trackInfo.right is viewport coordinate; adding $window.scrollX converts it to document-page coordinate


    document.onmouseup = h_dragFini;
    document.onmousemove = h_dragOn;
};

//Drag action core event handler
function h_dragOn(e) {
    e.preventDefault();

    //Calculates $sliderVal value, which ranges from 0 to 1 based on $e.pageX
    if (e.pageX < leftmostPos) sliderVal = 0;
    else if (e.pageX <= rightmostPos) sliderVal = (e.pageX - leftmostPos) / trackWidth;
    else sliderVal = 1;

    target.style.left = trackWidth * sliderVal - targetHalfHeight + 'px'; //Updates the position of the slider handle using CSS

    if (e.pageX >= leftmostPos && e.pageX <= rightmostPos && target.id === "size-handle") {
        arrSizeSliderVal = sliderVal;
        calculateWidthGapCount();
        updateMainArrayContent(1);
    }
};

//Drag action termination event handler
function h_dragFini(e) {
    document.onmouseup = null;
    document.onmousemove = null;

    if (target.id === "size-handle") {
        console.log("size:", sliderVal)
    } else {
        speedSliderVal = sliderVal;
        showInfoDialog('success-msg-1');
        console.log("speed:", sliderVal)
    }
};

//Attaching initialization event handlers
document.querySelectorAll('.h-slider-handle').forEach((element) => element.onmousedown = h_dragInit); //Attaching the drag action initializer to all DOM elements with class="h-slider-handle"


/*** For drag-sort drag action ***/
//Declaration and definition of tweakable, independent variables
let arrElemGap = gap; //**IMPORTANT** $gap is declared in "script.js"
let arrElemWidth = width; //**IMPORTANT** $width is declared in "script.js"
let valsToSort = randNumArray //**IMPORTANT** $randNumArray is declared in "script.js"

//Declaration and definition of non-tweakable variables
let elems = [...document.querySelectorAll('.drag-sort-handle')]; //A bijection exists between $elems and $valsToSort, whereby indices of $valsToSort topologically maps to the relative position of each elements of $elems within the bounds of "div.main-array".
let elemsContainerDimen = document.querySelector('.main-array').getBoundingClientRect();
let oldIndex, target2;

//Utility function which adjusts the style of a given DOM element's !PARENT! based on a given position and updates that parent element's "data-currentindex" attribute
function elemStylePositioner(elem, pos) {
    elem.parentElement.style.left = `${pos * (arrElemWidth + arrElemGap)}px`;
    elem.parentElement.setAttribute('data-currentindex', pos + "");
};

//Utility function which updates the position of elements within $elems and $valsToSort arrays upon a drag-sort action
function arraysUpdateOnDrag(oldIndex, newIndex) {
    elems.splice(newIndex, 0, ...elems.splice(oldIndex, 1));
    valsToSort.splice(newIndex, 0, ...valsToSort.splice(oldIndex,1));
};

//Drag-sort action initialization event handler
function dragSortInit(e) {
    e.preventDefault();

    target2 = this; //Registers the active DOM element being dragged 
    oldIndex = parseInt(target2.parentElement.getAttribute('data-currentindex')); //This fixes issue of main array items stacking when multiple of these are selected in rapid succession.

    //Sets special CSS style for the active DOM element being dragged !AND ITS PARENT!
    target2.parentElement.style.zIndex = 50; //Applying CSS property on the parent instead
    target2.parentElement.style.transition = 'none'; //Applying CSS property on the parent instead
    target2.style.boxShadow = '0px 0px 5px 5px var(--main-green)';
    document.getElementById('main-array').style.cursor = 'pointer';

    //Attaches subcomponent event handlers
    document.onmouseup = dragSortFini;
    document.onmousemove = dragSortOn;
};

//Drag-sort action core event handler
function dragSortOn(e) {
    e.preventDefault();
    
    //Below is for the proper positioning of all affected DOM elements upon drag over
    let newIndex;
    if (e.clientX <= elemsContainerDimen.left) newIndex = 0; //This line and the next bounds the drag-sort motion of the active DOM element to within its DOM container.
    else if (e.clientX >= elemsContainerDimen.right) newIndex = elems.length - 1;
    else newIndex = Math.floor((e.pageX - elemsContainerDimen.left) / (arrElemWidth + arrElemGap));
    
    elemStylePositioner(target2, newIndex); //Updates the position of the active DOM element.
    //Update the position of the non-active DOM elements !ONLY! if the value of $newIndex has changed in order to save some compute.
    if (oldIndex !== newIndex) {
        if (newIndex <= oldIndex) {
            for (let i = newIndex; i < oldIndex; i++) {
                elemStylePositioner(elems[i], i + 1);
            };
        } else {
            for (let i = newIndex; i > oldIndex; i--) {
                elemStylePositioner(elems[i], i - 1);
            };
        }
        arraysUpdateOnDrag(oldIndex, newIndex);
        oldIndex = newIndex;
    }
};

//Drag-sort action termination event handler
function dragSortFini(e) {
    //Detach subcomponent event handlers
    document.onmouseup = null;
    document.onmousemove = null;
    //Restore initial CSS styles
    target2.parentElement.style.zIndex = "auto"; //Applying CSS property on the !PARENT! instead
    target2.parentElement.style.transition = "0.5s ease-out"; //Applying CSS property on the !PARENT! instead
    target2.style.boxShadow = "none";
    document.getElementById('main-array').style.cursor = 'initial';
};

//Actually executing previously defined code
elems.forEach(elemStylePositioner); //Initially places the unsorted DOM elements within their DOM container
elems.forEach(elem => { elem.onmousedown = dragSortInit; }); //Attaching the drag-sort action initialization event handler to each array element of $elems


/*** For Informational Dialogs Presentation ***/
let dialogTimerID;
let activeInfoDialog = document.getElementById('success-msg-1');
function showInfoDialog(infoDialogID) {
    dismissInfoDialog();
    activeInfoDialog = document.getElementById(infoDialogID);
    activeInfoDialog.style.transition = "500ms ease-out";
    activeInfoDialog.style.opacity = "100%";
    activeInfoDialog.style.top = "30px";

    dialogTimerID = setTimeout(() => {
        activeInfoDialog.style.opacity = "0%";
        dialogTimerID = setTimeout(() => activeInfoDialog.style.top = "-100px", 500);
    }, 3000);
}

//Event handler for the dismiss button on each info dialog
function dismissInfoDialog() {
    clearTimeout(dialogTimerID);
    activeInfoDialog.style.transition = "none";
    activeInfoDialog.style.opacity = "0%";
    activeInfoDialog.style.top = "-100px";
}
document.querySelectorAll('.info-dial-dismiss').forEach(value => value.addEventListener("click", dismissInfoDialog));