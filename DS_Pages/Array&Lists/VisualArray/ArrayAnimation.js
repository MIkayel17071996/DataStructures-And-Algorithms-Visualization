class ArrayAnimation {
    constructor(canvas, ctx, values, arrayImage) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.values = values;
        this.arrayImage = arrayImage;
        this.animationRunning = false; // New flag to control animation loop
    }

    animate() {
        // Clear and redraw the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.arrayImage.createArray();
        this.values.forEach(({ value, object }) => {
            object.draw(value);
            object.update();
        });

        // Only request another frame if objects are still moving
        if (this.values.some(v => v.object.isMoving)) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.animationRunning = false; // Stop the loop when no object is moving
        }
    }

    startAnimation() {
        if (!this.animationRunning) {
            this.animationRunning = true;
            this.animate();
        }
    }

    async moveValuesRight() {
        for (let index = this.values.length - 1; index >= 0; index--) {
            const object = this.values[index].object; 
            object.targetX += 100;
            object.isMoving = true;
    
            while (object.isMoving) {
                object.updateToRight();
                this.startAnimation();
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    }

    async moveValuesRightForInserting(position) {
        for (let index = this.values.length - 1; index >= position; index--) {
            const object = this.values[index].object;
            object.targetX += 100;
            object.isMoving = true;
    
            while (object.isMoving) {
                object.updateToRight();
                this.startAnimation();
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    }

    updateTargetPositions() {
        this.values.forEach((item, index) => {
            item.object.targetX = 250 + index * 100;
        });
    }
}

export default ArrayAnimation;
