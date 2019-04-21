function handleWorldCollisions(object) {
	var objectXMovement = Math.abs(object.nextX - object.x);
	var objectYMovement = Math.abs(object.nextY - object.y);
	var numSteps = objectXMovement > objectYMovement ? objectXMovement : objectYMovement; // take the larger number of pixel movements from x or y
	var speedX = (object.nextX - object.x) / numSteps; // max can be 1 (these used to slowly increment through movement)
	var speedY = (object.nextY - object.y) / numSteps; // max can be 1 (and check collisions on max 1 pixel movement)
	var prevX, prevY;
	
	/*if(numSteps > object.moveSpeed) {
		// NEED TO IMPLEMENT (Maybe)
		// object is not moving of its own accord (e.g. been hit by an enemy)
		// direction should change on collision - how to do this??
	}*/
	
	// use these variables to store the current position that we will alter
	object.nextX = object.x;
	object.nextY = object.y;
	
	var i;
	for (i = 0; i < numSteps; i++) {
		// handle x axis collisions
		prevX = object.nextX;
		prevY = object.nextY;
		object.nextX += speedX;
		if (detectWorldCollisions(object.nextX, collisionBoxY(object), object.width, object.collisionBoxHeight)) {
			resolveWorldCollisions(object, prevX, prevY, speedX, 0);
			
			// remove this to allow dashing on walls - doesn't work properly though
			if (numSteps > object.moveSpeed && object instanceof PlayerClass) {
				object.nextX = prevX;
				object.nextY = prevY;
				object.cancelDash();
				break;
			}
		}
		// handle y axis collisions
		prevX = object.nextX;
		prevY = object.nextY;
		object.nextY += speedY;
		if (detectWorldCollisions(object.nextX, collisionBoxY(object), object.width, object.collisionBoxHeight)) {
			resolveWorldCollisions(object, prevX, prevY, 0, speedY);
			
			// remove this to allow dashing on walls - doesn't work properly though
			if (numSteps > object.moveSpeed && object instanceof PlayerClass) {
				object.nextX = prevX;
				object.nextY = prevY;
				object.cancelDash();
				break;
			}
		}
	}
}

function detectWorldCollisions(objectX, objectY, objectWidth, objectHeight) {
	// decrement to make right and bottom collisions go all the way against the next tile
	objectWidth--;
	objectHeight--;
	
	var leftTile = Math.floor(objectX / TILE_W);
	var rightTile = Math.floor((objectX + objectWidth) / TILE_W)
	var topTile = Math.floor(objectY / TILE_H);
	var bottomTile = Math.floor((objectY + objectHeight) / TILE_H)
	
	var tileXPos, tileYPos;
	var tileType;
	var tileCollisionData;
	var lineVertex1;
	var lineVertex2;
	
	var row, col;
	for (row = topTile; row <= bottomTile; row++) {
		for (col = leftTile; col <= rightTile; col++) {
			tileType = tileTypeAtColRow(tileGrid, col, row);
			tileXPos = col*TILE_W;
			tileYPos = row*TILE_W;
			
			tileCollisionData = TILE_COLLISION_DATA[tileType];
			
			if (tileCollisionData.leftWallCollider) {
				lineVertex1 = tileCollisionData.topLeftVertex;
				lineVertex2 = tileCollisionData.bottomLeftVertex;
				
				if (lineRectangleCollider(
					lineVertex1.x + col * TILE_W, lineVertex1.y + row * TILE_H, 
					lineVertex2.x + col * TILE_W, lineVertex2.y + row * TILE_H,
					objectX, objectY, objectWidth, objectHeight)) {
					return true;
				}
			}
			
			if (tileCollisionData.rightWallCollider) {
				lineVertex1 = tileCollisionData.topRightVertex;
				lineVertex2 = tileCollisionData.bottomRightVertex;
				
				if (lineRectangleCollider(
					lineVertex1.x + col * TILE_W, lineVertex1.y + row * TILE_H, 
					lineVertex2.x + col * TILE_W, lineVertex2.y + row * TILE_H,
					objectX, objectY, objectWidth, objectHeight)) {
					
					return true;
				}
			}
			if (tileCollisionData.topWallCollider) {
				lineVertex1 = tileCollisionData.topLeftVertex;
				lineVertex2 = tileCollisionData.topRightVertex;
				
				if (lineRectangleCollider(
					lineVertex1.x + col * TILE_W, lineVertex1.y + row * TILE_H, 
					lineVertex2.x + col * TILE_W, lineVertex2.y + row * TILE_H,
					objectX, objectY, objectWidth, objectHeight)) {
					
					return true;
				}
			}
			if (tileCollisionData.bottomWallCollider) {
				lineVertex1 = tileCollisionData.bottomLeftVertex;
				lineVertex2 = tileCollisionData.bottomRightVertex;
				
				if (lineRectangleCollider(
					lineVertex1.x + col * TILE_W, lineVertex1.y + row * TILE_H, 
					lineVertex2.x + col * TILE_W, lineVertex2.y + row * TILE_H,
					objectX, objectY, objectWidth, objectHeight)) {
					
					return true;
				}
			}
		}
	}
	return false;
}

function resolveWorldCollisions(object, prevX, prevY, speedX, speedY) {
	var collision;
	
	if (speedX != 0 && speedY != 0) { // moving diagonally
		object.nextX = prevX;
		object.nextY = prevY;
	}
	
	if (speedX != 0) { // moving horizontally
		/* incrementing/decrementing by 2 instead of 1 here prevents the bottom 
		right corners of tiles causing collision when they shouldn't */
		collision = detectWorldCollisions(object.nextX, collisionBoxY(object) - 2, object.width, object.collisionBoxHeight); // check if moving up solves it (slope)
		if (!collision) {
			object.nextY--;
			return;
		}
			
		collision = detectWorldCollisions(object.nextX, collisionBoxY(object) + 2, object.width, object.collisionBoxHeight); // check if moving down solves it (slope)
		if (!collision) {
			object.nextY++;
			return;
		}
			
		object.nextX = prevX; // otherwise move back to previous location
		return;
	}
		
	if (speedY != 0) { // moving vertically
		collision = detectWorldCollisions(object.nextX - 2, collisionBoxY(object), object.width, object.collisionBoxHeight); // check if moving left solves it (slope)
		if (!collision) {
			object.nextX--;
			return;
		}
		
		collision = detectWorldCollisions(object.nextX + 2, collisionBoxY(object), object.width, object.collisionBoxHeight); // check if moving right solves it (slope)
		if (!collision) {
			object.nextX++;
			return;
		}
			
		object.nextY = prevY; // otherwise move back to previous location
		return;
	}
}

function collisionBoxY(object) {
	return object.nextY + (object.height - object.collisionBoxHeight);
}

function lineRectangleCollider(x1,y1, x2,y2, rx,ry, rw,rh) {
	  var left =   lineLineCollider(x1,y1,x2,y2, rx,ry,rx, ry+rh);
	  var right =  lineLineCollider(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
	  var top =    lineLineCollider(x1,y1,x2,y2, rx,ry, rx+rw,ry);
	  var bottom = lineLineCollider(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);

	  if (left || right || top || bottom) {
		  return true;
	  }
	  return false;
}

function lineLineCollider(x1,y1, x2,y2, x3,y3, x4,y4) {
	// calculate direction of lines
	var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	
  	// if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
		
		var intersectionX = x1 + (uA * (x2-x1));
		var intersectionY = y1 + (uA * (y2-y1));
		
		/*// uncommment and swap draw and move in Main to draw collision points on screen
		canvasContext.save();
		canvasContext.translate(-camPanX, -camPanY);
		colorCircle(intersectionX, intersectionY, 10, 'blue');
		canvasContext.restore();*/
		
    	return true;
    }
    return false;
}

function handleEntityCollisions(entity) {
	var entityXMovement = Math.abs(entity.nextX - entity.x);
	var entityYMovement = Math.abs(entity.nextY - entity.y);
	var numSteps = entityXMovement > entityYMovement ? entityXMovement : entityYMovement; // take the larger number of pixel movements from x or y
	var speedX = (entity.nextX - entity.x) / numSteps; // max can be 1 (these used to slowly increment through movement)
	var speedY = (entity.nextY - entity.y) / numSteps; // max can be 1 (and check collisions on max 1 pixel movement)
	var prevX, prevY;
	
	// use these variables to store the current position that we will alter
	entity.nextX = entity.x;
	entity.nextY = entity.y;
	
	for (var i = 0; i < numSteps; i++) {
		// handle x axis collisions
		prevX = entity.nextX;
		prevY = entity.nextY;
		entity.nextX += speedX;
		for (var j = 0; j < Entities.length; j++) {
			if (entity == Entities[j]) {
				continue;
			}
			
			if (AABBCollisionDetection(entity.nextX,collisionBoxY(entity), entity.width,entity.collisionBoxHeight,
											Entities[j].x,collisionBoxY(Entities[j]), Entities[j].width,Entities[j].collisionBoxHeight)) {
					 entity.nextX = prevX;
			}
		}

		// handle y axis collisions
		prevX = entity.nextX;
		prevY = entity.nextY;
		entity.nextY += speedY;
		for (j = 0; j < Entities.length; j++) {
			if (entity == Entities[j]) {
				continue;
			}
			
			if (AABBCollisionDetection(entity.nextX,collisionBoxY(entity), entity.width,entity.collisionBoxHeight,
											Entities[j].x,collisionBoxY(Entities[j]), Entities[j].width,Entities[j].collisionBoxHeight)) {
					 entity.nextY = prevY;
			}
		}
	}
}

function handleProjectileCollisions(projectile) { 
	for (var i = 0; i < Entities.length; i++) {
		var entityIsImmune = false;
		for (var j = 0; j < projectile.immuneEntities.length; j++) {
			if (projectile.immuneEntities[j] == Entities[i]) {
				entityIsImmune = true;
			}
		}
		if (entityIsImmune) {
			continue;
		}
		
		if (projectileHitEntity(Entities[i], projectile)) {
			// collision detected: cause damage to entity, add to immune list if damage could be done
			if (Entities[i].takeDamage(projectile.damage)) {
				pendingScreenshakes = 6;
				Entities[i].forceX += projectile.velocityX;
				Entities[i].forceY += projectile.velocityY;
				projectile.immuneEntities.push(Entities[i]);
				handleDeadEntities(); // check if anyone is dead
			}
		}
	}
}

function projectileHitEntity(entity, projectile) {
	if (AABBCollisionDetection(projectile.centerX - projectile.width / 2,projectile.centerY - projectile.width / 2, projectile.width,projectile.height,
		entity.x,collisionBoxY(entity), entity.width,entity.collisionBoxHeight)) {
			return true;
	}
	return false;
}

function AABBCollisionDetection(object1X,object1Y, object1Width,object1Height, object2X,object2Y, object2Width,object2Height) {
	if (object1X < object2X + object2Width &&
	   object1X + object1Width > object2X &&
	   object1Y < object2Y + object2Height &&
	   object1Y + object1Height > object2Y) {
	    
		// collision detected
		   return true;
	}
	return false;
}


