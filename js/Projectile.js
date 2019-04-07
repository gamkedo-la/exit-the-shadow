function ProjectileClass(options) {	
	this.centerX = options.centerX;
	this.centerY = options.centerY;
	this.width = options.width;
	this.height = options.height;
	this.damage = options.damage;
	this.immuneEntities = options.immuneEntities || [];
	
	this.attackFinished = false;

	let velocityX = options.velocityX;
	let velocityY = options.velocityY;
	let frameLength = options.frameLength;
	
	let framesLeft = frameLength;
	
	this.update = function() {
		if (!this.attackFinished) {
			this.centerX += velocityX;
			this.centerY += velocityY;
			framesLeft--;
			
			// draw attack hitbox (TEMPORARY)
			canvasContext.save();
			canvasContext.translate(-camPanX, -camPanY);
			colorRect(this.centerX - this.width/2,this.centerY - this.height/2, this.width,this.height, 'green');
			canvasContext.restore();
			
			handleProjectileCollisions(this);
		
			if (framesLeft <= 0) {
				this.attackFinished = true;
			}
		}
	}
}