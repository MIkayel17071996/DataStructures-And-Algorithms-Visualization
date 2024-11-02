import ArrayRepresentation from "./ArrayRepresentation.js";
import Value from "./Values.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const addFrontbutton = document.getElementById('add-front');
const inputField = document.getElementById('value');
const addBackButton = document.getElementById('add-back');
const addAtIndexButton = document.getElementById('add-at-index');
const indexInputField = document.getElementById('indexValue');
const removeBack = document.getElementById('remove-back');
const removeFront = document.getElementById('remove-front');
const removeFromIndex = document.getElementById('remove-from-index');

let window_width = window.innerWidth;
let window_height = 700;

canvas.width = window_width;
canvas.height = window_height;
canvas.style.background = 'rgba(255, 255, 255, 1)';

let animationTime = 2000;
let valuesSpeedPixels = 3.5;

const LW = 2;
let elementCount = 6;
let arrayImage = new ArrayRepresentation(ctx, 200, 200, 'black', LW, 100, elementCount);
arrayImage.createArray();

const values = [];
let isAnimating = false;  


addFrontbutton.addEventListener('click', async function () {
    if (isAnimating)
         return; 

    isAnimating = true;  
    const inputValue = inputField.value;

    if (inputValue) {
        performOperationForAddingFront();
        if (values.length < elementCount) {
            if (values.length > 0)
                await moveValuesRight();
            addValue(inputValue, 0);
        } else {
            await resizeArray(inputValue, true);
        }
    } else {
        alert('Please enter a value.');
    }
    isAnimating = false; 
});

addBackButton.addEventListener('click', async function () {
    const inputValue = inputField.value;

    if (inputValue) {
        performOperationForAddingBack()

        if (values.length < elementCount) {
            addValue(inputValue, values.length);
        } else {
            await resizeArray(inputValue, false);
        }
    } else {
        alert('Please enter a value.');
    }
});

addAtIndexButton.addEventListener('click', async function () {
    const inputIndex = parseInt(indexInputField.value);
    const inputValue = inputField.value;

    if (values.length === 0 && inputIndex !== 0) {
        alert('The index must be 0 if the array is empty!');
    } else if (inputIndex < 0 || inputIndex > values.length) {
        alert('The index must be between 0 and ' + values.length);
    } else if (inputIndex >= 0 && inputIndex <= values.length && values.length < elementCount) {
        performOperationForAddingAtIndex(inputIndex); 
        await moveValuesRightForInserting(inputIndex);
        insertElement(inputIndex, inputValue);        
    } else if (inputIndex >= 0 && inputIndex <= values.length && values.length === elementCount) {
        await resizeArray(inputValue, true, inputIndex);
    }
});


removeBack.addEventListener('click', function () {
    if (values.length === 0)
        alert('Cannot remove element from the empty array!');

    performOperationForRemoving();
    values.pop();
    animate();
});

removeFront.addEventListener('click', async function () {
    if (values.length === 0) {
        alert('Cannot remove element from the empty array!');
        return;
    }

    performOperationForRemoving();
    values.shift();

    ctx.clearRect(250, 240, 100, 50);

    await moveValuesLeft();

    animate();
});

removeFromIndex.addEventListener('click', async function () {
    const inputIndex = parseInt(indexInputField.value);

    if (inputIndex < 0 || inputIndex >= values.length)
    {
        alert('Index is out of the range');
    }
    performOperationForRemoving()

    values.splice(inputIndex, 1);
    ctx.clearRect(250, 240, 100, 50);


    await moveValuesLeftForErasing(inputIndex);
    animate();


});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    arrayImage.createArray();

    values.forEach(({ value, object }) => {
        object.draw(value);
        object.update();
    });

    if (values.some(v => v.object.isMoving)) {
        requestAnimationFrame(animate);
    }
}

async function moveValuesRight() {
    for (let index = values.length - 1; index >= 0; index--) {
        const object = values[index].object;
        object.targetX += 100; 
        object.isMoving = true; 
    }

    while (values.some(value => value.object.isMoving)) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        arrayImage.createArray(); 

        values.forEach(({ value, object }) => {
            object.updateToRight(); 
            object.draw(value);
        });

        await new Promise(resolve => setTimeout(resolve, 10)); 
    }
}

async function moveValuesLeft() {
    for (let index = 0; index < values.length; index++) {
        const object = values[index].object;
        object.targetX -= 100;
        object.isMoving = true;
    }

    while (values.some(value => value.object.isMoving)) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        arrayImage.createArray();

        values.forEach(({ value, object }) => {
            object.updateToLeft();
            object.draw(value);
        });

        await new Promise(resolve => setTimeout(resolve, 10));
    }

}

async function moveValuesRightForInserting(position) {
    for (let index = values.length - 1; index >= position; index--) {
        const object = values[index].object;
        object.targetX += 100; 
        object.isMoving = true; 
    }

    while (values.some(value => value.object.isMoving)) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        arrayImage.createArray();

        values.forEach(({ value, object }) => {
            object.updateToRight(); 
            object.draw(value);
        });

        await new Promise(resolve => setTimeout(resolve, 10)); 
    }
}



async function moveValuesLeftForErasing(position) {
    for (let index = position; index < values.length; index++) {
        const object = values[index].object;
        object.targetX -= 100; 
        object.isMoving = true; 
    }

    while (values.some(value => value.object.isMoving)) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        arrayImage.createArray();

        values.forEach(({ value, object }) => {
            object.updateToLeft(); 
            object.draw(value);
        });

        await new Promise(resolve => setTimeout(resolve, 20)); 
    }
}


function updateTargetPositions() {
    values.forEach((item, index) => {
        item.object.targetX = 250 + index * 100;
    });
}

async function resizeArray(inputValue, addToFront, insertIndex = null) {
    const oldElementCount = elementCount;
    elementCount *= 2;
    const newArrayImage = new ArrayRepresentation(ctx, 200, 400, 'black', LW, 100, elementCount);
    newArrayImage.createArray();
    newArrayImage.targetY = 200;
    newArrayImage.arrMoving = true;

    const originalArrayImage = arrayImage;
    arrayImage = newArrayImage;

    const animateBoth = async () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        originalArrayImage.createArray();
        originalArrayImage.updatePosition();

        arrayImage.updatePosition();
        arrayImage.createArray();

        if (arrayImage.arrMoving) {
            requestAnimationFrame(animateBoth);
        } else {
            if (insertIndex !== null) {
                await moveValuesRightForInserting(insertIndex);
                insertElement(insertIndex, inputValue);
            } else {
                if (addToFront !== null && addToFront === true)
                    await moveValuesRight();
                addValue(inputValue, addToFront ? 0 : values.length);
            }
        }
    };

    animateBoth();
}

function insertElement(inputIndex, inputValue) {
    const x = 250 + (inputIndex * 100);
    const y = 240;
    valuesSpeedPixels += 0.24;
    const newValue = new Value(ctx, 100, 50, 'black', valuesSpeedPixels, x, y);

    values.splice(inputIndex, 0, { value: inputValue, object: newValue });

    updateTargetPositions();
    animate();
}


function addValue(inputValue, index) {
    const x = 250 + (index * 100);
    const y = 240;
    if (elementCount < 7) {
        valuesSpeedPixels += 0.2;
    } else {
        valuesSpeedPixels += 0.24;
    }

    const newValue = new Value(ctx, 100, 50, 'black', valuesSpeedPixels, x, y);

    if (index === 0) {
        values.unshift({ value: inputValue, object: newValue });
    } else {
        values.push({ value: inputValue, object: newValue });
    }

    updateTargetPositions();
    animate();
}




function disableButtons() {
    addFrontbutton.disabled = true;
    inputField.disabled = true; 
    addBackButton.disabled = true; 
    addAtIndexButton.disabled = true; 
    indexInputField.disabled = true;
    removeBack.disabled = true; 
    removeFront.disabled = true; 
    removeFromIndex.disabled = true; 
}

function enableButtons() {
    addFrontbutton.disabled = false;
    inputField.disabled = false; 
    addBackButton.disabled = false; 
    addAtIndexButton.disabled = false; 
    indexInputField.disabled = false;
    removeBack.disabled = false; 
    removeFront.disabled = false; 
    removeFromIndex.disabled = false; 
}

async function performOperationForAddingBack() {
    if (elementCount < 7) {
        animationTime = 2000 + ((values.length / 2 ) * 300);
    } else {
        animationTime = 3500 + ((values.length / 2 ) * 55);
    }
    disableButtons(); 

    await new Promise(resolve => setTimeout(resolve, animationTime)); 

    enableButtons();
}

async function performOperationForAddingFront() {
    disableButtons(); 

    await new Promise(resolve => setTimeout(resolve, 2000)); 

    enableButtons();
}

async function performOperationForAddingAtIndex(index) {
    disableButtons(); 

    const time = 2000 + (index * 270);
    await new Promise(resolve => setTimeout(resolve, time)); 

    enableButtons();
}

async function performOperationForRemoving() {

    disableButtons(); 

    await new Promise(resolve => setTimeout(resolve, 500)); 

    enableButtons();
}

