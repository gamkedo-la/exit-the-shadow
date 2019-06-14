function distanceBetweenEntities(entity1, entity2) {
	var x1 = entity1.x + entity1.width / 2;
	var y1 = entity1.y + entity1.height - entity1.collisionBoxHeight / 2;
	
	var x2 = entity2.x + entity2.width / 2;
	var y2 = entity2.y + entity2.height - entity2.collisionBoxHeight / 2;
	
	return Math.abs(Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1))));
}

function relativeDistanceBetweenEntitiesX(entity1, entity2) {
	var x1 = entity1.x + entity1.width / 2;
	var x2 = entity2.x + entity2.width / 2;
	
	return x2 - x1;
}

function relativeDistanceBetweenEntitiesY(entity1, entity2) {
	var y1 = entity1.y + entity1.height - entity1.collisionBoxHeight / 2;
	var y2 = entity2.y + entity2.height - entity2.collisionBoxHeight / 2;
	
	return y2 - y1;
}

function distanceBetweenEntityObject(entity, objectX, objectY, objectWidth, objectHeight) {
	var x1 = entity.x + entity.width / 2;
	var y1 = entity.y + entity.height - entity.collisionBoxHeight / 2;
	
	var x2 = objectX + objectWidth / 2;
	var y2 = objectY + objectHeight / 2;
	
	return Math.abs(Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1))));
}

function distanceBetweenEntityObjectX(entity, objectX, objectWidth) {
	var x1 = entity.x + entity.width / 2;
	var x2 = objectX + objectWidth / 2;
	return Math.abs(x1 - x2);
}

function distanceBetweenEntityObjectY(entity, objectY, objectHeight) {
	var y1 = entity.y + entity.height - entity.collisionBoxHeight / 2;
	var y2 = objectY + objectHeight / 2;
	return Math.abs(y1 - y2);
}

function collisionBoxY(object) {
	return object.nextY + (object.height - object.collisionBoxHeight);
}

function lerp(from, to, lerpValue) {
	return (from * (1.0 - lerpValue)) + (to * lerpValue);
}

function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

function clamp01(num) {
	return clamp(num, 0.0, 1.0);
}

function calculateAnimationSpeed(animationTimeInFrames, numberOfAnimationFrames) {
	return numberOfAnimationFrames / animationTimeInFrames;
}