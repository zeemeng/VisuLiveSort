/**
* Author:    Zi Han Meng <zi.han.meng100@gmail.com>
* Copyright: (c) 2021 Zi Han Meng
* License:   GNU General Public License Version 3
**/

//Declarations for the speed/timer system
let speedSliderVal = 0.5, speedInterval, intervalHighBound, intervalLowBound;
//Utility function which calculates the timer interval for selection, insertion and bubble sorts
function calculateSpeedInterval() {
    speedInterval = (intervalLowBound + (intervalHighBound - intervalLowBound) * (1 - speedSliderVal)) / (count / 10);
}
//Utility function which calculates the timer interval for merge sort
function calculateSpeedIntervalMerge() {
    speedInterval = (intervalLowBound + (intervalHighBound - intervalLowBound) * (1 - speedSliderVal)) / Math.sqrt(count / 10);
}
//Utility function which calculates the timer interval for quicksort
function calculateSpeedIntervalQuick(){
    speedInterval = (intervalLowBound + (intervalHighBound - intervalLowBound) * (1 - speedSliderVal)) / Math.pow((count / 10), (1 / 1.45));
}
//Utility function which calculates the timer interval for counting sort
function calculateSpeedIntervalCounting() {
    speedInterval = (intervalLowBound + (intervalHighBound - intervalLowBound) * (1 - speedSliderVal)) / Math.pow((count / 10), (1 / 4.25));
}

//Utility function which resets the main DOM array if another run of animation is already ongoinig.
function resetActiveAnimation() {
    if (animationOngoing) {
        for (let i = randNumArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = randNumArray[j]; randNumArray[j] = randNumArray[i]; randNumArray[i] = temp;
        }
        updateMainArrayContent(undefined, randNumArray);
    }
};

//Selection sort algorithm
function selectionSort() {
    intervalHighBound = 350;
    intervalLowBound = 75;
    calculateSpeedInterval();

    resetActiveAnimation();
    animationOngoing = true;
    let tick = 0;
    initialTimerID = setTimeout(() => {});
    disableSlideDrag();
    resetArrayItemsColor();

    for (let i = 0; i < valsToSort.length; i++) {
        let swapIndex = i;
        setTimeout((e_i) => e_i.style.backgroundColor = "var(--main-magenta)", speedInterval * tick++, elems[i]);
        for (let j = i + 1; j < valsToSort.length; j++) {
            setTimeout(e_j => e_j.style.backgroundColor = "var(--main-yellow)", speedInterval * tick++, elems[j]);
            if (valsToSort[j] < valsToSort[swapIndex]) {
                setTimeout((bool, e_swapIndex, e_j) => {
                    if (bool) e_swapIndex.style.backgroundColor = "var(--main-blue)";
                    e_j.style.backgroundColor = "var(--main-magenta)";
                }, speedInterval * tick++, (swapIndex !== i), elems[swapIndex], elems[j]);
                swapIndex = j;
            } else setTimeout(e_j => e_j.style.backgroundColor = "var(--main-blue)", speedInterval * tick++, elems[j]);
        }
        if (i !== swapIndex) {
            setTimeout((e_i, e_swapIndex) => {
                elemStylePositioner(e_i, swapIndex);
                elemStylePositioner(e_swapIndex, i);
                e_i.style.backgroundColor = "var(--main-blue)";
            }, speedInterval * tick++, elems[i], elems[swapIndex]);
            [valsToSort[i], valsToSort[swapIndex]] = [valsToSort[swapIndex], valsToSort[i]];
            [elems[i], elems[swapIndex]] = [elems[swapIndex], elems[i]];
        }
        setTimeout(e_i => e_i.style.backgroundColor = "var(--main-green)", speedInterval * tick++, elems[i]);
    }

    setTimeout(() => {
        enableSlideDrag();
        animationOngoing = false;
    }, speedInterval * tick++);
}

//Insertion sort algorithm
function insertionSort() {
    intervalHighBound = 350;
    intervalLowBound = 75;
    calculateSpeedInterval();

    resetActiveAnimation();
    animationOngoing = true;
    let tick = 0;
    initialTimerID = setTimeout(() => {});
    disableSlideDrag();
    resetArrayItemsColor();

    for (let i = 1; i < valsToSort.length; i++) {
        let j, testVal = valsToSort[i], focusedElement = elems[i];
        setTimeout(() => {
            focusedElement.style.backgroundColor = "var(--main-magenta)";
            focusedElement.parentElement.style.zIndex = 50;
        }, speedInterval * tick++);
        for (j = i - 1; j >= 0; j--) {
            // setTimeout(e_j => e_j.style.backgroundColor = "var(--main-yellow)", speedInterval * tick++, elems[j]);
            setTimeout(e_j => e_j.style.boxShadow = "var(--yellow-fade2) 0 0 5px 3px", speedInterval * tick++, elems[j]);
            if (testVal < valsToSort[j]) {
                elems[j+1] = elems[j];
                valsToSort[j+1] = valsToSort[j];
                setTimeout((local_j, e_j) => {
                    elemStylePositioner(focusedElement, local_j);
                    elemStylePositioner(e_j, local_j + 1);
                    e_j.style.backgroundColor = "var(--main-green)";
                    e_j.style.boxShadow = "none";
                    if (local_j === 0) {
                        focusedElement.style.backgroundColor = "var(--main-green)";
                        focusedElement.parentElement.style.zIndex = 0;
                    }
                }, speedInterval * tick++, j, elems[j]);
            } else {
                setTimeout(e_j => {
                    e_j.style.backgroundColor = "var(--main-green)";
                    e_j.style.boxShadow = "none";
                    focusedElement.style.backgroundColor = "var(--main-green)";
                    focusedElement.parentElement.style.zIndex = 0;
                }, speedInterval * tick++, elems[j]);
                break;
            }
        }
        elems[j + 1] = focusedElement;
        valsToSort[j + 1] = testVal;
    }

    setTimeout(() => {
        enableSlideDrag();
        animationOngoing = false;
    }, speedInterval * tick++);
}

//Bubble sort algorithm
function bubbleSort() {
    intervalHighBound = 350;
    intervalLowBound = 75;
    calculateSpeedInterval();

    resetActiveAnimation();
    animationOngoing = true;
    let tick = 0;
    initialTimerID = setTimeout(() => {});
    disableSlideDrag();
    resetArrayItemsColor();

    for (let i = 0; i < valsToSort.length - 1; i++) {
        let swap = false;
        for (let j = 0; j < valsToSort.length - 1 - i; j++) {
            if (j) setTimeout((e_j, e_j_plus, e_j_minus) => { //This if-else prevents an error to be thrown in case that $e_j_minus and by association $elems[j-1] is undefined
                e_j_minus.style.backgroundColor = "var(--main-blue)";
                e_j.style.backgroundColor = "var(--main-magenta)";
                e_j.style.boxShadow = "none" //shadow
                // e_j_plus.style.backgroundColor = "var(--main-yellow)";
                e_j_plus.style.boxShadow = "var(--yellow-bright) 0 0 5px 3px" //shadow
            }, speedInterval * tick++, elems[j], elems[j+1], elems[j-1]);
            else setTimeout((e_j, e_j_plus) => {
                e_j.style.backgroundColor = "var(--main-magenta)";
                // e_j_plus.style.backgroundColor = "var(--main-yellow)";
                e_j_plus.style.boxShadow = "var(--yellow-bright) 0 0 5px 3px" //shadow
            }, speedInterval * tick++, elems[j], elems[j+1], elems[j-1]);

            if (valsToSort[j] > valsToSort[j+1]) {
                setTimeout((e_j, e_j_plus, local_j) => {
                    // e_j_plus.style.backgroundColor = "var(--main-blue)";
                    e_j_plus.style.boxShadow = "none" //shadow
                    e_j.parentElement.style.zIndex = 50;
                    elemStylePositioner(e_j, local_j + 1);
                    elemStylePositioner(e_j_plus, local_j);
                }, speedInterval * tick++, elems[j], elems[j+1], j);
                [elems[j], elems[j+1]] = [elems[j+1], elems[j]];
                [valsToSort[j], valsToSort[j+1]] = [valsToSort[j+1], valsToSort[j]];
                swap = true;
            } 
        }

        setTimeout((e_tail, e_tail_minus, colorLastItem) => { //Sets the sorted tail color
            e_tail.style.backgroundColor = "var(--main-green)";
            e_tail.style.boxShadow = "none" //shadow
            e_tail_minus.style.backgroundColor = "var(--main-blue)";
            if (colorLastItem) e_tail_minus.style.backgroundColor = "var(--main-green)"; //This is to treat the special case where the smallest value is initially at the rightmost position/highest index at the beginning of the sort.
        }, speedInterval * tick++, elems[elems.length - 1 - i], elems[elems.length - 2 - i], elems.length - 2 == i);
        if (!swap) { //Final color sweep when all is sorted due to no swapped being performed in this iteration
            let nextTickTime = tick * speedInterval;
            for (let j = 0; j < valsToSort.length - i; j++) {
                setTimeout(e_j => e_j.style.backgroundColor = "var(--main-green)", nextTickTime, elems[j]);
                nextTickTime += 15; 
            }
            tick = Math.ceil(nextTickTime / speedInterval);
            break;
        }
    }

    setTimeout(() => {
        elems.forEach(value => value.parentElement.style.zIndex = "auto");
        enableSlideDrag();
        animationOngoing = false;
    }, speedInterval * tick++);
}

//Merge sort algorithm
function mergeSortRecur() {
    intervalHighBound = 500;
    intervalLowBound = 160;
    calculateSpeedIntervalMerge();

    resetActiveAnimation();

    (function changeLayout() {
        //The following lines reformat the layout of the div#main-array.main-array by creating a new one and replacing the old with the new.
        let mainArray = document.querySelector('.main-array');
        mainArray.style.height = "45%";
        updateMainArrayContent(undefined, valsToSort);

        //The following lines creates the DOM buffer array and inserts it into the DOM tree.
        let bufferArray = mainArray.cloneNode(false);
        bufferArray.id = "buffer-array";
        document.getElementById("main-array").insertAdjacentElement('afterend', bufferArray);

        bufferArray.parentElement.style.justifyContent = "space-between";
        document.querySelectorAll(".slider-handle").forEach(value => value.style.display = "none");
    })();
    
    animationOngoing = true;
    let tick = 0;
    initialTimerID = setTimeout(() => {});
    disableSlideDrag();

    let buffer = [];
    let elemsBuffer = [];
    let dropDist = document.getElementById("buffer-array").getBoundingClientRect().bottom - document.getElementById("main-array").getBoundingClientRect().bottom;

    function mergeSort(start_i, end_i) { //$start_i and $end_i are inclusive smallest and largest indices of the sub-array to merge sort.
        if (start_i == end_i) return; //If $start_i == $end_i, then the sub-array to sort is the singleton base case, so just return.

        let mid = Math.floor((start_i + end_i) / 2); //This becomes the inclusive last index of the first sub-array.
        mergeSort(start_i, mid);
        mergeSort(mid + 1, end_i);

        merge(start_i, mid, end_i);
    }

    function merge(p, q, r) {
        setTimeout(() => {
            for (let i = p; i <= r; i++) elems[i].style.backgroundColor = "var(--yellow-fade1)";
        } , speedInterval * tick++);

        const length_pq = q - p + 1;
        for (let i = 0; i < length_pq; i++) buffer[i] = valsToSort[p + i]; //Copy only the first sub-array to merge into the buffer
        setTimeout(() => {
            for (let i = 0; i < length_pq; i++) {
                elems[p + i].parentElement.style.bottom = `-${dropDist}px`;
                elemsBuffer[i] = elems[p + i];
            }
        }, speedInterval * tick++)

        let i = 0, j = q + 1, k = p;
        while (i < length_pq && j < r + 1) {
            if (buffer[i] <= valsToSort[j]) {
                setTimeout((local_k, local_i) => {
                    elems[local_k] = elemsBuffer[local_i];
                    elems[local_k].parentElement.style.bottom = "0px";
                    elemStylePositioner(elems[local_k], local_k);

                    elemsBuffer[local_i].style.backgroundColor = "var(--main-green)";
                }, speedInterval * tick++, k, i);
                valsToSort[k] = buffer[i++];
            } //If lowest element in buffer is smaller than the lowest element in the 2nd sub-array, copy the lowest element from the buffer into the next available slot of the merged array segment.
            else {
                setTimeout((local_k, local_j) => {
                    elems[local_k] = elems[local_j];
                    elemStylePositioner(elems[local_k], local_k);

                    elems[local_j].style.backgroundColor = "var(--main-green)";
                }, speedInterval * tick++, k, j);
                valsToSort[k] = valsToSort[j++]; //If the above is not true, copy the lowest element from the 2nd sub-array directly into the next available slot of the merged array segment.
            }
            k++;
        }
        while (i < length_pq) {
            setTimeout((local_k, local_i) => {
                elems[local_k] = elemsBuffer[local_i];
                elems[local_k].parentElement.style.bottom = "0px";
                elemStylePositioner(elems[local_k], local_k);

                elemsBuffer[local_i].style.backgroundColor = "var(--main-green)";
            }, speedInterval * tick++, k, i);
            valsToSort[k++] = buffer[i++]; //Copies the remaining elements of the buffer if the elements of the 2nd sub-array is spent. If the elements in the buffer would be spent, no need to copy over the remaining elements of the 2nd sub-array as they would be already in right place.
        }

        while (j < r + 1) setTimeout(local_j => elems[local_j].style.backgroundColor = "var(--main-green)", speedInterval * tick++, j++); //For visual effects only.

        setTimeout(() => {
            for (let i = p; i <= r; i++) elems[i].style.backgroundColor = "var(--main-blue)";
        } , speedInterval * tick++);
    }

    mergeSort(0, valsToSort.length - 1);

    let tickTime = speedInterval * tick;
    for (let i = 0; i <= elems.length; i++) {
        setTimeout(() => {
            if (i !== elems.length) elems[i].style.backgroundColor = "var(--main-magenta)";
            if (i !== 0) elems[i - 1].style.backgroundColor = "var(--main-green)";
        }, tickTime);
        tickTime += (50 / Math.sqrt(count / 10));
    }

    function restoreLayout() {
        animationOngoing = false; //!Important to set it here to avoid issues when calling $updateMainArrayContent
        document.getElementById("buffer-array").parentElement.removeChild(document.getElementById("buffer-array"));
        
        let mainArray = document.querySelector('.main-array');
        let newMainArray = mainArray.cloneNode(false);
        newMainArray.style.height = "90%";
        mainArray.parentElement.style.justifyContent = "center";
        mainArray.parentElement.replaceChild(newMainArray, mainArray);
        updateMainArrayContent(undefined, valsToSort);

        elems.forEach(value => value.style.backgroundColor = "var(--main-green)");
    };

    setTimeout(() => {
        restoreLayout();
        enableSlideDrag();
    }, tickTime)
}

//Quicksort algorithm
function quicksort() {
    intervalHighBound = 320;
    intervalLowBound = 85;
    calculateSpeedIntervalQuick();

    resetActiveAnimation();
    animationOngoing = true;
    let tick = 0;
    initialTimerID = setTimeout(() => {});
    disableSlideDrag();

    //The recursive sort function
    function sort(lo, hi) {
        if (lo >= hi) {
            if (lo == hi) setTimeout(() => elems[hi].style.backgroundColor = "var(--main-green)", speedInterval * tick++);
            return; //Return immediately if this call corresponds to the base case scenarios of a single-element partition or a zero-element partition.
        }

        let center = partition(lo, hi); //Perform paritioning
        if (center - 1 - lo <= hi - (center + 1)) { //Make the recursive call first on the smaller of the two partitions.
            sort(lo, center -1);
            sort(center + 1, hi);
        } else {
            sort(center + 1, hi);
            sort(lo, center -1);
        }
    };

    //The partitioning function. This implementation uses Lomuto's partition scheme.
    function partition(lo, hi) {
        setTimeout(() => {
            for (let i = lo; i <= hi; i++) elems[i].style.backgroundColor = "var(--yellow-fade1)";
        }, speedInterval * tick++);

        let pivotVal = valsToSort[hi];
        let swapIndex = lo; //A pointer indicating the next position of the valsToSortay to swap into.

        setTimeout(() => {
            elems[hi].style.backgroundColor = "var(--main-magenta)";
        }, speedInterval * tick++, hi, elems[swapIndex]);

        for (let i = lo; i < hi; i++) {
            setTimeout((local_i, local_swapIndex) => {
                elems[local_i].style.backgroundColor = "var(--main-magenta)";
                if (local_i !== lo) elems[local_i - 1].style.backgroundColor = "var(--yellow-fade1)";
                elems[local_swapIndex].style.backgroundColor = "var(--main-magenta)";
            }, speedInterval * tick++, i, swapIndex);

            if (valsToSort[i] < pivotVal) {
                setTimeout((local_i, local_swapIndex) => {
                    elemStylePositioner(elems[local_i], local_swapIndex);
                    elemStylePositioner(elems[local_swapIndex], local_i);
                    [elems[local_i], elems[local_swapIndex]] = [elems[local_swapIndex], elems[local_i]];
                }, speedInterval * tick++, i, swapIndex);
                setTimeout(local_swapIndex => elems[local_swapIndex].style.backgroundColor = "var(--yellow-fade1)", speedInterval * tick++, swapIndex);

                [valsToSort[i], valsToSort[swapIndex]] = [valsToSort[swapIndex], valsToSort[i]];
                swapIndex++;
            }
        }
        [valsToSort[hi], valsToSort[swapIndex]] = [valsToSort[swapIndex], valsToSort[hi]]; //Swaps the pivot value into the center of the current partition at the end of the current iteration.
        
        setTimeout(() => {
            elemStylePositioner(elems[hi], swapIndex);
            elemStylePositioner(elems[swapIndex], hi);
            [elems[hi], elems[swapIndex]] = [elems[swapIndex], elems[hi]];
        }, speedInterval * tick++)

        setTimeout(() => {
            for (let i = lo; i <= hi; i++) elems[i].style.backgroundColor = "var(--main-blue)";
            elems[swapIndex].style.backgroundColor = "var(--main-green)";
        }, speedInterval * tick++);
        return swapIndex;
    };

    sort(0, valsToSort.length - 1);

    setTimeout(() => {
        enableSlideDrag();
        animationOngoing = false;
    }, speedInterval * tick++);
};

//Counting sort algorithm
function countingSort() {
    intervalHighBound = 345;
    intervalLowBound = 120;
    calculateSpeedIntervalCounting();

    resetActiveAnimation();

    //For changing the layout at animation start
    (function changeLayout() {
        //The following lines reformat the layout of the div#main-array.main-array by creating a new one and replacing the old with the new.
        let mainArray = document.querySelector('.main-array');
        mainArray.style.height = "60%";
        updateMainArrayContent(undefined, valsToSort);

        let keyCountSection = document.createElement('div');
        keyCountSection.style.height = "30%";
        keyCountSection.className = "counting-sort-container flex";
        keyCountSection.insertAdjacentHTML("beforeend", `<div class="counting-sort-subunit flex title-subunit">
        <div class="counting-sort-title">Key:</div>
        <div class="counting-sort-title">Number of<br>occurrences:</div>
        </div>`);
        for (let i = 0; i <= 10; i++) { keyCountSection.insertAdjacentHTML("beforeend", `<div class="counting-sort-subunit flex">
        <div class="counting-sort-key flex">${i}</div>
        <div class="key-occurrence flex">0</div>
        </div>`); }
        document.querySelector('.main-sec-container').appendChild(keyCountSection);

        keyCountSection.parentElement.style.justifyContent = "space-between";
    })();

    //Animation main section start
    animationOngoing = true;
    let tick = 0;
    initialTimerID = setTimeout(() => {});
    disableSlideDrag();

    let keysHTML = document.querySelectorAll('.counting-sort-key');
    let keyOccurrencesHTML = document.querySelectorAll('.key-occurrence');
    let count = [0,0,0,0,0,0,0,0,0,0,0], output = [], tempElems = [[],[],[],[],[],[],[],[],[],[],[]];
    valsToSort.forEach((value, index) => {
        count[value] += 1;
        tempElems[value].push(elems[index])

        setTimeout((e_index, local_value, local_count_value) => {
            e_index.style.backgroundColor = "var(--magenta-fade1)";
            keysHTML[local_value].style.backgroundColor = "var(--magenta-fade1)";
            keysHTML[local_value].style.color = "#fff";
            keyOccurrencesHTML[local_value].textContent = local_count_value;
            keyOccurrencesHTML[local_value].style.textShadow = "var(--magenta-fade1) 0 0 10px";
        }, speedInterval * tick++, elems[index], value, count[value]);
        
        setTimeout((e_index, local_value) => {
            e_index.parentElement.style.opacity = "0%"; //Set this to elems[index].parentElement.style.opacity
            keysHTML[local_value].style.backgroundColor = "var(--yellow-fade2)";
            keysHTML[local_value].style.color = "var(--main-purple)";
            keyOccurrencesHTML[local_value].style.textShadow = "none";
        }, speedInterval * tick++, elems[index], value);
    })

    count.forEach((value, index) => {
        if (value === 0) return;
        for (let i = 1; i <= value; i++) output.push(index);
    });
    valsToSort = output;

    elems = [];
    tempElems.forEach(value => {
        let j = value.length;
        for (let i = 0; i < j; i++) elems.push(value.pop());
    });
    
    tick += 1 / (speedInterval / intervalHighBound) //Setting extra delay on setTimeout timer to avoid visual artifact 
    setTimeout(() => elems.forEach(elemStylePositioner), speedInterval * tick++)
    tick += 1 / (speedInterval / intervalHighBound) //Setting extra delay on setTimeout timer to avoid visual artifact 
    elems.forEach((value, index) => {
        setTimeout(() => {
            value.parentElement.style.opacity = "100%"
            if (index !== 0) elems[index - 1].style.backgroundColor = "var(--main-green)";
            
            keyOccurrencesHTML[valsToSort[index]].textContent = parseInt(keyOccurrencesHTML[valsToSort[index]].textContent) - 1;
            keyOccurrencesHTML[valsToSort[index]].style.textShadow = "var(--magenta-fade1) 0 0 5px";
        }, speedInterval * tick);
        tick += 0.5
        setTimeout(() => {
            keyOccurrencesHTML[valsToSort[index]].style.textShadow = "none";
        }, speedInterval * tick);
        tick += 0.5
    });
    setTimeout(() => elems[elems.length - 1].style.backgroundColor = "var(--main-green)", speedInterval * tick++);
    //Animation main section end

    //For restoring the layout at animation end
    function restoreLayout() {
        animationOngoing = false; //!Important to set it here to avoid issues when calling $updateMainArrayContent
        document.querySelector('.counting-sort-container').parentElement.removeChild(document.querySelector('.counting-sort-container'));
        
        let mainArray = document.querySelector('.main-array');
        let newMainArray = mainArray.cloneNode(false);
        newMainArray.style.height = "90%";
        mainArray.parentElement.style.justifyContent = "center";
        mainArray.parentElement.replaceChild(newMainArray, mainArray);
        updateMainArrayContent(undefined, valsToSort);

        elems.forEach(value => value.style.backgroundColor = "var(--main-green)");
    };

    setTimeout(() => {
        restoreLayout();
        enableSlideDrag();
    }, speedInterval * tick++)
}
