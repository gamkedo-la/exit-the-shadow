function distanceBetweenEntities(entity1, entity2) {
	var x1 = entity1.x + entity1.width / 2;
	var y1 = entity1.y + entity1.height - entity1.collisionBoxHeight / 2;
	
	var x2 = entity2.x + entity2.width / 2;
	var y2 = entity2.y + entity2.height - entity2.collisionBoxHeight / 2;
	
	return Math.abs(Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1))));
}