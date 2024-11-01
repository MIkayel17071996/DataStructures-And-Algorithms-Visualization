class Value {
    constructor(ctx, xpos, ypos, color, speed, targetX, targetY) {
        this.ctx = ctx;  
        this.xpos = xpos;
        this.ypos = ypos;
        this.color = color;
        this.speed = speed;
        this.targetX = targetX;
        this.targetY = targetY;
        this.isMoving = true;
    }

    draw(inputValue) {
        this.ctx.beginPath(); 
        this.ctx.fillStyle = this.color;     
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText(inputValue, this.xpos, this.ypos);
        this.ctx.fill();
    }

    update() {
        if (this.isMoving) {
            if (this.xpos < this.targetX) {
                this.xpos += this.speed;
            }
            if (this.ypos < this.targetY && this.xpos !== this.targetX) {
                this.ypos += 0.1;
            } else if (this.ypos < this.targetY && this.xpos >= this.targetX) {
                this.ypos += this.speed;
            }
            if (this.xpos >= this.targetX && this.ypos >= this.targetY) {
                this.isMoving = false;
            }
        }
    }

    updateToRight() {
        const rightPix = 100;
        let currentPos = this.xpos;

        if (this.xpos !== currentPos + rightPix) {
            this.xpos += this.speed;
        }
    }
}

export default Value;