//ArrayRepresentation.js
class ArrayRepresentation {
    constructor(ctx, xpos, ypos, color, LW, spacing, numberOfElements) {
        this.ctx = ctx;
        this.xpos = xpos;
        this.ypos = ypos;
        this.color = color;
        this.LW = LW;
        this.spacing = spacing;
        this.numberOfElements = numberOfElements;
        this.arrMoving = true; 
        this.targetY = ypos; 
    }

    createArray() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.LW;

        const numberOfLines = 3;
        const width = this.numberOfElements * this.spacing;

        for (let i = 0; i < numberOfLines; i++) {
            if (i === 0) {
                this.ctx.moveTo(this.xpos, this.ypos + (i * 80));
                this.ctx.lineTo(this.xpos + width, this.ypos + (i * 80));
            } else if (i === 1) {
                this.ctx.moveTo(this.xpos, this.ypos + (i * 80));
                this.ctx.lineTo(this.xpos + width, this.ypos + (i * 80));
                for (let j = 0; j < this.numberOfElements; j++) {
                    this.ctx.fillStyle = 'blue';
                    this.ctx.font = 'bold 20px Arial';
                    this.ctx.fillText(j, this.xpos + (this.spacing * j) + 50, this.ypos + (i * 80) + 20);
                }
            } else {
                this.ctx.moveTo(this.xpos, this.ypos + (i * 80) - 55);
                this.ctx.lineTo(this.xpos + width, this.ypos + (i * 80) - 55);
            }
        }

        this.ctx.stroke();
        this.ctx.closePath();
        this.createArrayVerticals();
    }

    createArrayVerticals() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.LW;

        for (let i = 0; i < this.numberOfElements + 1; i++) {
            this.ctx.moveTo(this.xpos + (i * this.spacing), this.ypos);
            this.ctx.lineTo(this.xpos + (i * this.spacing), this.ypos + this.spacing + 5);
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }

    updatePosition() {
        if (this.arrMoving) {
            if (this.ypos > this.targetY) {
                this.ypos -= 2; 
            }
            if (this.ypos <= this.targetY) {
                this.ypos = this.targetY; 
                this.arrMoving = false;
            }
            this.createArray(); 
        }
    }
}

export default ArrayRepresentation;