let speed = 1;

document.getElementById('start-sort-btn').addEventListener('click', quicksort);

//Selection sort algorithm
function selectionSort() {
    let tick = 0;
    for (let i = 0; i < valsToSort.length; i++) {
        let swapIndex = i;
        setTimeout((e_i) => e_i.style.backgroundColor = "var(--main-magenta)", 300 * tick++, elems[i]);
        for (let j = i + 1; j < valsToSort.length; j++) {
            setTimeout(e_j => e_j.style.backgroundColor = "var(--main-yellow)", 300 * tick++, elems[j]);
            if (valsToSort[j] < valsToSort[swapIndex]) {
                setTimeout((bool, e_swapIndex, e_j) => {
                    if (bool) e_swapIndex.style.backgroundColor = "var(--main-blue)";
                    e_j.style.backgroundColor = "var(--main-magenta)";
                }, 300 * tick++, (swapIndex !== i), elems[swapIndex], elems[j]);
                swapIndex = j;
            } else setTimeout(e_j => e_j.style.backgroundColor = "var(--main-blue)", 300 * tick++, elems[j]);
        }
        if (i !== swapIndex) {
            setTimeout((e_i, e_swapIndex) => {
                elemStylePositioner(e_i, swapIndex);
                elemStylePositioner(e_swapIndex, i);
                e_i.style.backgroundColor = "var(--main-blue)";
            }, 300 * tick++, elems[i], elems[swapIndex]);
            [valsToSort[i], valsToSort[swapIndex]] = [valsToSort[swapIndex], valsToSort[i]];
            [elems[i], elems[swapIndex]] = [elems[swapIndex], elems[i]];
        }
        setTimeout(e_i => e_i.style.backgroundColor = "var(--main-green)", 300 * tick++, elems[i]);
    }
    console.log(valsToSort); //This shall be removed for production.
}

//Insertion sort algorithm
function insertionSort() {
    let tick = 0;
    for (let i = 1; i < valsToSort.length; i++) {
        let j, testVal = valsToSort[i], focusedElement = elems[i];
        setTimeout(() => focusedElement.style.backgroundColor = "var(--main-magenta)", 300 * tick++);
        for (j = i - 1; j >= 0; j--) {
            setTimeout(e_j => e_j.style.backgroundColor = "var(--main-yellow)", 300 * tick++, elems[j]);
            if (testVal < valsToSort[j]) {
                elems[j+1] = elems[j];
                valsToSort[j+1] = valsToSort[j];
                setTimeout((local_j, e_j) => {
                    elemStylePositioner(focusedElement, local_j);
                    elemStylePositioner(e_j, local_j + 1);
                    e_j.style.backgroundColor = "var(--main-green)";
                    if (local_j === 0) focusedElement.style.backgroundColor = "var(--main-green)";
                }, 300 * tick++, j, elems[j]);
            }
            else {
                setTimeout(e_j => {
                    e_j.style.backgroundColor = "var(--main-green)";
                    focusedElement.style.backgroundColor = "var(--main-green)";
                }, 300 * tick++, elems[j]);
                break;
            }
        }
        elems[j + 1] = focusedElement;
        valsToSort[j + 1] = testVal;
    }
    console.log(valsToSort); //This shall be removed for production.
}

//Bubble sort algorithm
function bubbleSort() {
    let tick = 0;
    for (let i = 0; i < valsToSort.length - 1; i++) {
        let swap = false;
        for (let j = 0; j < valsToSort.length - 1 - i; j++) {
            if (j) setTimeout((e_j, e_j_plus, e_j_minus) => { //This if-else prevents an error to be thrown in case that $e_j_minus and by association $elems[j-1] is undefined
                e_j_minus.style.backgroundColor = "var(--main-blue)";
                e_j.style.backgroundColor = "var(--main-magenta)";
                e_j_plus.style.backgroundColor = "var(--main-yellow)";
            }, 300 * tick++, elems[j], elems[j+1], elems[j-1]);
            else setTimeout((e_j, e_j_plus) => {
                e_j.style.backgroundColor = "var(--main-magenta)";
                e_j_plus.style.backgroundColor = "var(--main-yellow)";
            }, 300 * tick++, elems[j], elems[j+1], elems[j-1]);

            if (valsToSort[j] > valsToSort[j+1]) {
                setTimeout((e_j, e_j_plus, local_j) => {
                    e_j_plus.style.backgroundColor = "var(--main-blue)";
                    elemStylePositioner(e_j, local_j + 1);
                    elemStylePositioner(e_j_plus, local_j);
                }, 300 * tick++, elems[j], elems[j+1], j);
                [elems[j], elems[j+1]] = [elems[j+1], elems[j]];
                [valsToSort[j], valsToSort[j+1]] = [valsToSort[j+1], valsToSort[j]];
                swap = true;
            } 
        }

        setTimeout((e_tail, e_tail_minus) => { //Sets the sorted tail color
            e_tail.style.backgroundColor = "var(--main-green)";
            e_tail_minus.style.backgroundColor = "var(--main-blue)";
        }, 300 * tick++, elems[elems.length - 1 - i], elems[elems.length - 2 - i])
        if (!swap) { //Final color sweep when all is sorted due to no swapped being performed in this iteration
            let nextTickTime = tick * 300;
            for (let j = 0; j < valsToSort.length - i; j++) {
                setTimeout(e_j => e_j.style.backgroundColor = "var(--main-green)", nextTickTime, elems[j]);
                nextTickTime += 15; 
            }
            break;
        }
    }
    console.log(valsToSort); //This shall be removed for production.
}

//Merge sort algorithm
function mergeSortRecur() {
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
    
    let tick = 0;
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
            for (let i = p; i <= r; i++) elems[i].style.backgroundColor = "var(--main-yellow)";
        } , 400 * tick++);

        const length_pq = q - p + 1;
        for (let i = 0; i < length_pq; i++) buffer[i] = valsToSort[p + i]; //Copy only the first sub-array to merge into the buffer
        setTimeout(() => {
            for (let i = 0; i < length_pq; i++) {
                elems[p + i].parentElement.style.bottom = `-${dropDist}px`;
                elemsBuffer[i] = elems[p + i];
            }
        }, 400 * tick++)

        let i = 0, j = q + 1, k = p;
        // setTimeout((local_i, local_j) => {
        //     elemsBuffer[local_i].style.backgroundColor = "var(--main-magenta)";
        //     elems[local_j].style.backgroundColor = "var(--main-magenta)";
        // }, 400 * tick++, i, j);
        while (i < length_pq && j < r + 1) {
            if (buffer[i] <= valsToSort[j]) {
                setTimeout((local_k, local_i) => {
                    elems[local_k] = elemsBuffer[local_i];
                    elems[local_k].parentElement.style.bottom = "0px";
                    elemStylePositioner(elems[local_k], local_k);

                    elemsBuffer[local_i].style.backgroundColor = "var(--main-green)";
                    // if (local_i !== length_pq - 1) elemsBuffer[local_i + 1].style.backgroundColor = "var(--main-magenta)";
                }, 400 * tick++, k, i);
                valsToSort[k] = buffer[i++];
            } //If lowest element in buffer is smaller than the lowest element in the 2nd sub-array, copy the lowest element from the buffer into the next available slot of the merged array segment.
            else {
                setTimeout((local_k, local_j) => {
                    elems[local_k] = elems[local_j];
                    elemStylePositioner(elems[local_k], local_k);

                    elems[local_j].style.backgroundColor = "var(--main-green)";
                    // if (local_j !== r) elems[local_j + 1].style.backgroundColor = "var(--main-magenta)";
                }, 400 * tick++, k, j);
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
                // if (local_i !== length_pq - 1) elemsBuffer[local_i + 1].style.backgroundColor = "var(--main-magenta)";
            }, 400 * tick++, k, i);
            valsToSort[k++] = buffer[i++]; //Copies the remaining elements of the buffer if the elements of the 2nd sub-array is spent. If the elements in the buffer would be spent, no need to copy over the remaining elements of the 2nd sub-array as they would be already in right place.
        }

        while (j < r + 1) setTimeout(local_j => elems[local_j].style.backgroundColor = "var(--main-green)", 400 * tick++, j++); //For visual effects only.

        setTimeout(() => {
            for (let i = p; i <= r; i++) elems[i].style.backgroundColor = "var(--main-blue)";
        } , 400 * tick++);
    }

    mergeSort(0, valsToSort.length - 1);
    console.log(valsToSort); //This shall be removed for production.

    let tickTime = 400 * tick;
    for (let i = 0; i <= elems.length; i++) {
        setTimeout(() => {
            if (i !== elems.length) elems[i].style.backgroundColor = "var(--main-magenta)";
            if (i !== 0) elems[i - 1].style.backgroundColor = "var(--main-green)";
        }, tickTime);
        tickTime += 50;
    }

    function restoreLayout() {
        document.getElementById("buffer-array").parentElement.removeChild(document.getElementById("buffer-array"));
        
        let mainArray = document.querySelector('.main-array');
        let newMainArray = mainArray.cloneNode(false);
        newMainArray.style.height = "90%";
        mainArray.parentElement.style.justifyContent = "center";
        mainArray.parentElement.replaceChild(newMainArray, mainArray);
        updateMainArrayContent(undefined, valsToSort);

        elems.forEach(value => value.style.backgroundColor = "var(--main-green)");
    };

    setTimeout(restoreLayout, tickTime);
}

//Quicksort algorithm
function quicksort() {
    let tick = 0;

    //The recursive sort function
    function sort(lo, hi) {
        if (lo >= hi) {
            if (lo == hi) setTimeout(() => elems[hi].style.backgroundColor = "var(--main-green)", 300 * tick++);
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
            for (let i = lo; i <= hi; i++) elems[i].style.backgroundColor = "var(--main-yellow)";
        }, 300 * tick++);

        let pivotVal = valsToSort[hi];
        let swapIndex = lo; //A pointer indicating the next position of the valsToSortay to swap into.

        setTimeout(() => {
            elems[hi].style.backgroundColor = "var(--main-magenta)";
            // e_swapIndex.style.backgroundColor = "var(--main-magenta)";
        }, 300 * tick++, hi, elems[swapIndex]);

        for (let i = lo; i < hi; i++) {
            setTimeout((local_i, local_swapIndex) => {
                elems[local_i].style.backgroundColor = "var(--main-magenta)";
                if (local_i !== lo) elems[local_i - 1].style.backgroundColor = "var(--main-yellow)";
                elems[local_swapIndex].style.backgroundColor = "var(--main-magenta)";
            }, 300 * tick++, i, swapIndex);

            if (valsToSort[i] < pivotVal) {
                setTimeout((local_i, local_swapIndex) => {
                    elemStylePositioner(elems[local_i], local_swapIndex);
                    elemStylePositioner(elems[local_swapIndex], local_i);
                    [elems[local_i], elems[local_swapIndex]] = [elems[local_swapIndex], elems[local_i]];
                }, 300 * tick++, i, swapIndex);
                setTimeout(local_swapIndex => elems[local_swapIndex].style.backgroundColor = "var(--main-yellow)", 300 * tick++, swapIndex);

                [valsToSort[i], valsToSort[swapIndex]] = [valsToSort[swapIndex], valsToSort[i]];
                swapIndex++;
            }
        }
        [valsToSort[hi], valsToSort[swapIndex]] = [valsToSort[swapIndex], valsToSort[hi]]; //Swaps the pivot value into the center of the current partition at the end of the current iteration.
        
        setTimeout(() => {
            elemStylePositioner(elems[hi], swapIndex);
            elemStylePositioner(elems[swapIndex], hi);
            [elems[hi], elems[swapIndex]] = [elems[swapIndex], elems[hi]];
        }, 300 * tick++)

        setTimeout(() => {
            for (let i = lo; i <= hi; i++) elems[i].style.backgroundColor = "var(--main-blue)";
            elems[swapIndex].style.backgroundColor = "var(--main-green)";
        }, 300 * tick++);
        return swapIndex;
    };

    sort(0, valsToSort.length - 1);
    console.log(valsToSort); //This shall be removed for production.
};