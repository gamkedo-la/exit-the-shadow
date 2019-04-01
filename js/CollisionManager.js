function handleWorldCollisions(object) {
	var objectXMovement = Math.abs(object.nextX - object.x);
	var objectYMovement = Math.abs(object.nextY - object.y);
	var numSteps = objectXMovement > objectYMovement ? objectXMovement : objectYMovement;
	var speedX = (object.nextX - object.x) / numSteps;
	var speedY = (object.nextY - object.y) / numSteps;
	var prevX, prevY;
	
	if(numSteps > object.moveSpeed) {
		// NEED TO IMPLEMENT
		// object is not moving of its own accord - direction should change on collision
		// how to do this??
	}
	
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
			tileType = tileTypeAtColRow(col, row);
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
	for (var i = 0; i < Entities.length; i++) {
		if (entity == Entities[i]) {
			continue;
			//Adding comment for practice commit 
		}
		
		if (AABBCollisionDetection(entity.x,collisionBoxY(entity), entity.width,entity.collisionBoxHeight,
				 				   Entities[i].x,collisionBoxY(Entities[i]), Entities[i].width,Entities[i].collisionBoxHeight)) {
			   console.log("entity collision detected");
				 	if(entity.movementDirection[UP]){
					 Entities[i].nextY-=15;
					 entity.nextY += 15;
					}
					if(entity.movementDirection[DOWN]){
						Entities[i].nextY+=15;
						entity.nextY -= 15;
					 }
					 if(entity.movementDirection[LEFT]){
						Entities[i].nextX-=15;
						entity.nextX += 15;
					 }
					 if(entity.movementDirection[RIGHT]){
						Entities[i].nextX+=15;
						entity.nextX -= 15;
					 }
					
		}
	}
}

function handleProjectileCollisions(projectile) { 
	for (var i = 0; i < Entities.length; i++) {
		var entityIsImmune = false;
		for (var j = 0; j < projectile.immuneEntities.length; j++) {
			if (projectile.immuneEntities[j] == Entities[i]) { // THIS MAY NOT ALWAYS WORK IF JAVASCRIPT COPIES OBJECTS INSTEAD OF PASSING POINTERS - MAY NEED TO ADD ENTITITY IDS IF THIS HAPPENS
				entityIsImmune = true;
			}
		}
		if (entityIsImmune) {
			continue;
		}
		
		if (AABBCollisionDetection(projectile.centerX - projectile.width / 2,projectile.centerY - projectile.width / 2, projectile.width,projectile.height,
				 				   Entities[i].x,collisionBoxY(Entities[i]), Entities[i].width,Entities[i].collisionBoxHeight)) {
			   console.log("attack collision detected");
			   // handle projectile collisions (cause damage to entity, add to immune list)
		}
	}
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
