import ArrayRepresentation from "./ArrayRepresentation.js";
import Value from "./Values.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const button = document.getElementById('add-front');
const inputField = document.getElementById('value');
const addBackButton = document.getElementById('add-back');
const addAtIndexButton = document.getElementById('add-at-index');
const indexInputField = document.getElementById('indexValue');

let window_width = window.innerWidth;
let window_height = 700;

canvas.width = window_width;
canvas.height = window_height;
canvas.style.background = 'rgba(255, 255, 255, 1)';

const LW = 2;
let elementCount = 6;
let arrayImage = new ArrayRepresentation(ctx, 200, 200, 'black', LW, 100, elementCount);
arrayImage.createArray();

const values = [];

button.addEventListener('click', async function () {
    const inputValue = inputField.value;

    if (inputValue) {
        if (values.length !== elementCount) {
            if (values.length > 0) {
                await moveValuesRight();
            }

            const x = 250;
            const y = 240;
            const newValue = new Value(ctx, 100, 50, 'black', 2, x, y);
            values.unshift({ value: inputValue, object: newValue });
            updateTargetPositions();
            animate();
        } else {
            resizeArray(inputValue, true);
        }
    } else {
        alert('Please enter a value.');
    }
});

addBackButton.addEventListener('click', async function () {
    const inputValue = inputField.value;

    if (inputValue) {
        if (values.length !== elementCount) {
            const x = 250 + values.length * 100;
            const y = 240;
            const newValue = new Value(ctx, 100, 50, 'black', 2, x, y);
            values.push({ value: inputValue, object: newValue });
            updateTargetPositions();
            animate();
        } else {
            resizeArray(inputValue, false);
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
    } else if (inputIndex >= 0 && inputIndex <= values.length && values.length !== elementCount) {
        await moveValuesRightForInserting(inputIndex);
        InsertElement(inputIndex, inputValue);
    } else if (inputIndex >= 0 && inputIndex <= values.length && values.length === elementCount) {
        resizeArrayForInserting(inputIndex, inputValue)
    }
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

        while (object.isMoving) {
            object.updateToRight();
            animate();
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}

async function moveValuesRightForInserting(position) {
    for (let index = values.length - 1; index >= position; index--) { 
        const object = values[index].object;
        object.targetX += 100;
        object.isMoving = true;

        while (object.isMoving) {
            object.updateToRight();
            animate();
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

}

function updateTargetPositions() {
    values.forEach((item, index) => {
        item.object.targetX = 250 + index * 100;
    });
}

function resizeArray(inputValue, addToFront) {
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
        arrayImage.updatePosition();
        arrayImage.createArray();

        if (arrayImage.arrMoving) {
            requestAnimationFrame(animateBoth);
        } else {
            if (addToFront) {
                await moveValuesRight();

                const x = 250;
                const y = 240;
                const newValue = new Value(ctx, 100, 50, 'black', 2, x, y);
                values.unshift({ value: inputValue, object: newValue });
                updateTargetPositions();
                animate();
            } else {
                const x = 250 + values.length * 100;
                const y = 240;
                const newValue = new Value(ctx, 100, 50, 'black', 2, x, y);
                values.push({ value: inputValue, object: newValue });
                updateTargetPositions();
                animate();
            }
        }
    };

    animateBoth();
}

function InsertElement(inputIndex, inputValue)
{
    const x = 250 + (inputIndex * 100);
    const y = 240;
    const newValue = new Value(ctx, 100, 50, 'black', 2, x, y);

    values.splice(inputIndex, 0, { value: inputValue, object: newValue });

    updateTargetPositions();
    animate();
}

