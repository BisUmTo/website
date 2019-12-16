let PIECES = [];
let DIM = {};
let COL = [];
BACKGROUND_COLOR = 0
let GRID = [];
let SOLUTION = [];

let SHP = [
	{
		l:1,h:1,
		p:[[true]]
	},
	{
		l:2,h:1,
		p:[[true,true]]
	},
	{
		l:2,h:2,
		p:[[true,false],[true,true]]
	},
	{
		l:2,h:2,
		p:[[true,true],[true,true]]
	},
	{
		l:3,h:2,
		p:[[true,true,true],[false,false,true]]
	}
];

let PIECES_POS = {};
let GRID_POS = {};
let PREVIEW_POS = {};

let TOUCH_N = 0;
let SHOW_PREVIEW = false;
let SCREEN_NEEDS_UPDATE = true;

let START_TIME;
let BLOCK_PLACED;
let ROW_DESTROYED;

let IMAGES=[];
function preload() {
    IMAGES.push(loadImage('lvl/albero.bmp'));
    IMAGES.push(loadImage('lvl/cuore.bmp'));
    //IMAGES.push(loadImage('lvl/paperella.bmp'));
    IMAGES.push(loadImage('lvl/mela.png'));
    IMAGES.push(loadImage('lvl/barca.png'));
    IMAGES.push(loadImage('lvl/gelato.png'));
    IMAGES.push(loadImage('lvl/ananas.png'));
    IMAGES.push(loadImage('lvl/ciliegia.png'));
    IMAGES.push(loadImage('lvl/moneta.png'));
    IMAGES.push(loadImage('lvl/albicocca.png'));
    IMAGES.push(loadImage('lvl/corona.png'));
    IMAGES.push(loadImage('lvl/kiwi.png'));
    IMAGES.push(loadImage('lvl/limone.png'));
}

function solution_from_image(number){
	IMAGES[number].loadPixels();
	COL=[];
	SOLUTION=[];
	DIM={l:IMAGES[number].width,h:IMAGES[number].height};
	for(let i=0;i<IMAGES[number].height;i++){
		SOLUTION[i]=[];
	}
	for(let i=0;i<4*IMAGES[number].width*IMAGES[number].height;i+=4){
		let p_color=color(IMAGES[number].pixels[i],IMAGES[number].pixels[i+1],IMAGES[number].pixels[i+2])
		let index=COL.findIndex((a)=>JSON.stringify(a)===JSON.stringify(p_color));
		if (index==-1){
			index=COL.length;
			COL.push(p_color);
		}
		SOLUTION[Math.floor(Math.floor(i/4)/IMAGES[number].width)][Math.floor(i/4)%IMAGES[number].width]=index;
	}
}

function grid(position, dimension, color_grid, preview=false, preview_grid=undefined){
    let cell = {
        l:position.dx/dimension.l,
        h:position.dy/dimension.h
    };
	for(let i=0;i<dimension.h;i++)
		for(let j=0;j<dimension.l;j++){
			fill(COL[color_grid[i][j]]);
			rect(position.x+cell.l*j, position.y+cell.h*i, cell.l, cell.h);
		}
	if(preview)
		for(let i=0;i<dimension.h;i++)
			for(let j=0;j<dimension.l;j++){
				noStroke();
				let c=COL[preview_grid[i][j]];
				c.setAlpha(128);
				fill(c);
				rect(position.x+cell.l*j+2, position.y+cell.h*i+2, cell.l-2, cell.h-2, cell.l/3, cell.h/3);
				c.setAlpha(255);
				stroke('#000');
			}
}


function mirrow_shape(shape,axe){
	if (shape.l==1 && axe=='y') return shape; 
	if (shape.h==1 && axe=='x') return shape;
	
	let ret = {l:0,h:0,p:[]};
	if(axe=='y'){
		ret.h=shape.h;
		ret.l=shape.l;
		
		for(let i=0;i<shape.h;i++){
			ret.p[i]=[];
			for(let j=0;j<shape.l;j++){
				ret.p[i][j]=shape.p[i][shape.l-1-j];
			}	
		}
	} else if(axe=='x'){
		ret.h=shape.h;
		ret.l=shape.l;
		
		for(let i=0;i<shape.h;i++){
			ret.p[i]=[];
			for(let j=0;j<shape.l;j++){
				ret.p[i][j]=shape.p[shape.h-1-i][j];
			}	
		}
	} else {
		ret.h=shape.h;
		ret.l=shape.l;
		
		for(let i=0;i<shape.h;i++){
			ret.p[i]=[];
			for(let j=0;j<shape.l;j++){
				ret.p[i][j]=shape.p[shape.h-1-i][shape.l-1-j];
			}	
		}
	}
	return ret;
}

function rotate_shape(shape,rotation){
	let ret = {l:0,h:0,p:[]};
	if(rotation==90){
		ret.h=shape.l;
		ret.l=shape.h;
		
		for(let i=0;i<shape.l;i++){
			ret.p[i]=[];
			for(let j=0;j<shape.h;j++){	
				ret.p[i][j]=shape.p[j][shape.l-1-i];
			}	
		}
	} else if(rotation==180){
		ret = mirrow_shape(shape,'d');
	} else if(rotation==270){
		ret.h=shape.l;
		ret.l=shape.h;
		
		for(let i=0;i<shape.l;i++){
			ret.p[i]=[];
			for(let j=0;j<shape.h;j++){	
				ret.p[i][j]=shape.p[shape.h-1-j][i];
			}	
		}
	} else {
		ret = shape;
	}
	return ret;
}

function draw_shape(corner,cell,shape,col){
	for(let i=0;i<shape.h;i++){
		for(let j=0;j<shape.l;j++){
			if(shape.p[i][j]){
				fill(COL[col]);
				rect(corner.x+cell.x*j, corner.y+cell.y*i, cell.x, cell.y);
			}
		}
	}
}

function randomInt(max) {
	return Math.floor(Math.random()*max);
}

function random_shape(dimension){
	let ret = {};
	do{
		ret = SHP[randomInt(SHP.length)];
		if(randomInt(2)==1) ret=mirrow_shape(ret,'x');
		if(randomInt(2)==1) ret=mirrow_shape(ret,'y');
		ret=rotate_shape(ret,randomInt(4)*90);
	} while(ret.l>dimension.l || ret.h>dimension.h);
	return ret;
}

function new_pieces(){
	let ret=[];
	for(let i=0;i<3;i++){
		let unique;
		do{
			unique=true;
			ret[i]={s:random_shape(DIM),c:randomInt(COL.length)};
			for(let j=0;j<i;j++){
				if(JSON.stringify(ret[i])===JSON.stringify(ret[j])){
					unique=false;
				}
			}
		} while(unique==false);
	}
	let only_background_color=true;
	for(let i=0;i<3;i++){
		if(ret[i].c!=BACKGROUND_COLOR){
			only_background_color=false;
		}
	}
	if(only_background_color){
		let col;
		do{
			col = randomInt(COL.length);
		} while(col==BACKGROUND_COLOR);
		ret[randomInt(3)].c=col;
	}
	for(let i=0;i<ret.length;i++){
		ret[i].cell={
			x:GRID_POS.dx/DIM.l,
			y:GRID_POS.dy/DIM.h
		};
		ret[i].hitbox={
			x:(PIECES_POS.x+PIECES_POS.dx*i-(ret[i].cell.x*ret[i].s.l/2)),
			y:(PIECES_POS.y+PIECES_POS.dy*i-(ret[i].cell.y*ret[i].s.h/2)),
			fx:(PIECES_POS.x+PIECES_POS.dx*i-(ret[i].cell.x*ret[i].s.l/2))+ret[i].cell.x*ret[i].s.l,
			fy:(PIECES_POS.y+PIECES_POS.dy*i-(ret[i].cell.y*ret[i].s.h/2))+ret[i].cell.y*ret[i].s.h
		};
		ret[i].drag={dragging:false};
	}
	return ret;
}

function mousePressed() {
	let ret = true;
	for (let i=0;i<PIECES.length;i++){
                let dx = (PIECES_POS.sp)/4;
                let dy = (PIECES_POS.sp)/4;
		if (mouseX > PIECES[i].hitbox.x-dx && mouseX < PIECES[i].hitbox.fx+dx && mouseY > PIECES[i].hitbox.y-dy && mouseY < PIECES[i].hitbox.fy+dy) {
			PIECES[i].drag.dragging=true;
			PIECES[i].drag.offx = PIECES[i].hitbox.x-mouseX;
			PIECES[i].drag.offy = PIECES[i].hitbox.y-mouseY;
			ret = false;
		}
	}
	if (mouseX > PREVIEW_POS.x && mouseX < PREVIEW_POS.x+PREVIEW_POS.dx && mouseY > PREVIEW_POS.y && mouseY < PREVIEW_POS.y+PREVIEW_POS.dy) {
		ret = false;
		SHOW_PREVIEW = !SHOW_PREVIEW;
		SCREEN_NEEDS_UPDATE = true;
	}
	if (mouseX > GRID_POS.x && mouseX < GRID_POS.x+GRID_POS.dx && mouseY > GRID_POS.y && mouseY < GRID_POS.y+GRID_POS.dy) {
		//ret = false;
	}
	return ret;
}

function initialize_grid(){
	GRID=[];
	for(let i=0;i<DIM.h;i++){
		GRID[i]=[];
		for(let j=0;j<DIM.l;j++){
			GRID[i][j]=BACKGROUND_COLOR;
		}
	}
}

function place_piece(index){
	let ret = false;
	let cell = {
        l:GRID_POS.dx/DIM.l,
        h:GRID_POS.dy/DIM.h
    };
	let dummy={
		x:PIECES[index].cell.x/2,
		y:PIECES[index].cell.y/2
	};
	let snap={
		l:Math.floor((PIECES[index].hitbox.x-GRID_POS.x+dummy.x-1)/cell.l),
		h:Math.floor((PIECES[index].hitbox.y-GRID_POS.y+dummy.y-1)/cell.h)
	};
	for(let i=0;i<PIECES[index].s.h;i++){
		for(let j=0;j<PIECES[index].s.l;j++){
			if(PIECES[index].s.p[i][j]){
				if (GRID[snap.h+i][snap.l+j]!=PIECES[index].c){
					ret = true;
				}
			}
		}
	}
	if(ret){
		for(let i=0;i<PIECES[index].s.h;i++){
			for(let j=0;j<PIECES[index].s.l;j++){
				if(PIECES[index].s.p[i][j]){
					GRID[snap.h+i][snap.l+j]=PIECES[index].c;
				}
			}
		}
		BLOCK_PLACED++;
	}
	return ret;
}

function win(){
	let TIME = new Date() - START_TIME;
	alert('WIN! Time: '+
		new Date(TIME).toISOString().slice(11, -1).replace(/(.*):(.*):(.*)\..*/, '$1h $2m $3s')+
		', Pieces placed: '+BLOCK_PLACED+', Rows cleared: '+ROW_DESTROYED);
}

function schedule_updates(){
	if(JSON.stringify(SOLUTION)===JSON.stringify(GRID)){
		win();
	}
	for(let i=0;i<DIM.h;i++){
		let equals = GRID[i][0] != BACKGROUND_COLOR;
		for(let j=1;j<DIM.l;j++){
			if(!equals) break;
			if(GRID[i][j]!=GRID[i][0]){
				equals=false
			}
		}
		if(equals){
			GRID.splice(i,1);
			let empty = [];
			for(let j=0;j<DIM.l;j++){
				empty.push(BACKGROUND_COLOR);
			}
			GRID.unshift(empty);
			ROW_DESTROYED++;
		}
	}
}

function update_hitbox(index){
	PIECES[index].hitbox.x = mouseX + PIECES[index].drag.offx;
	PIECES[index].hitbox.y = mouseY + PIECES[index].drag.offy;
	PIECES[index].hitbox.fx = mouseX + PIECES[index].drag.offx + PIECES[index].cell.x*PIECES[index].s.l;
	PIECES[index].hitbox.fy = mouseY + PIECES[index].drag.offy + PIECES[index].cell.y*PIECES[index].s.h;
}

function mouseReleased() {
    for (let i=0;i<PIECES.length;i++){
		if(PIECES[i].drag.dragging==true){
			PIECES[i].drag.dragging=false;
			let dummy={x:PIECES[i].cell.x/2,y:PIECES[i].cell.y/2};
			let valid_move = false;
			if(PIECES[i].hitbox.x > GRID_POS.x-dummy.x && PIECES[i].hitbox.y > GRID_POS.y-dummy.y && PIECES[i].hitbox.fx < GRID_POS.x+GRID_POS.dx+dummy.x && PIECES[i].hitbox.fy < GRID_POS.y+GRID_POS.dy+dummy.y){
				valid_move = place_piece(i);
				if (valid_move){
					PIECES = new_pieces(i);
					draw();
					schedule_updates();
				}
			}
			if(!valid_move) {
				reset_piece(i);
			}
		}
	}
	SCREEN_NEEDS_UPDATE = true;
}

function reset_piece(index){
	PIECES[index].hitbox={
		x:(PIECES_POS.x+PIECES_POS.dx*index-(PIECES[index].cell.x*PIECES[index].s.l/2)),
		y:(PIECES_POS.y+PIECES_POS.dy*index-(PIECES[index].cell.y*PIECES[index].s.h/2)),
		fx:(PIECES_POS.x+PIECES_POS.dx*index-(PIECES[index].cell.x*PIECES[index].s.l/2))+PIECES[index].cell.x*PIECES[index].s.l,
		fy:(PIECES_POS.y+PIECES_POS.dy*index-(PIECES[index].cell.y*PIECES[index].s.h/2))+PIECES[index].cell.y*PIECES[index].s.h
	};
	PIECES[index].cell={
		x:GRID_POS.dx/DIM.l,
		y:GRID_POS.dy/DIM.h
	};
}

function touchStarted(){
	let ret=true;
	if(TOUCH_N==0){
		ret = mousePressed();
	}
	TOUCH_N++;
	return ret;
	
}

function touchEnded(){
	if(TOUCH_N==1){
		mouseReleased();
	}
	TOUCH_N--;
	return true;
}

function layout(){
	createCanvas(windowWidth, windowHeight).center('horizontal');
	if (windowWidth<windowHeight){
		let mr = 0.01*windowWidth;
		let wh = min(windowHeight,2.5*windowWidth);
		let ww = min(windowWidth,0.5*windowHeight);
		let sl = (wh-(ww+2*mr));
		
		PREVIEW_POS={
			x:(windowWidth-Math.min((DIM.h-3)/DIM.h*sl,ww-2*mr))/2,
			y:mr,
			dx:Math.min((DIM.h-3)/DIM.h*sl,ww-2*mr),
			dy:Math.min((DIM.h-3)/DIM.h*sl,ww-2*mr)
		};
		GRID_POS={
			x:(windowWidth-(ww-2*mr))/2,
			y:PREVIEW_POS.dy+2*mr,
			dx:ww-2*mr,
			dy:ww-2*mr
		};
		PIECES_POS={
			x:(windowWidth-(ww-2*mr))/2+(ww-2*mr)/6,
			y:wh-1.5/DIM.h*(ww-2*mr)-mr,
			dx:(ww-2*mr)/3,
			dy:0,
                        sp:(windowWidth-(ww-2*mr))/2+(ww-2*mr)/6
		};
	} else {
		let mr = 0.01*windowHeight;
		let wh = min(windowWidth,2.5*windowHeight);
		let ww = min(windowHeight,0.5*windowWidth);
		let sl = (wh-(ww+2*mr));
		
		PREVIEW_POS={
			y:(windowHeight-Math.min((DIM.h-3)/DIM.h*sl,ww-2*mr))/2,
			x:mr,
			dy:Math.min((DIM.h-3)/DIM.h*sl,ww-2*mr),
			dx:Math.min((DIM.h-3)/DIM.h*sl,ww-2*mr)
		};
		GRID_POS={
			y:(windowHeight-(ww-2*mr))/2,
			x:PREVIEW_POS.dx+2*mr,
			dy:ww-2*mr,
			dx:ww-2*mr
		};
		PIECES_POS={
			y:(windowHeight-(ww-2*mr))/2+(ww-2*mr)/6,
			x:wh-1.5/DIM.h*(ww-2*mr)-mr,
			dy:(ww-2*mr)/3,
			dx:0,
                        sp:(windowHeight-(ww-2*mr))/2+(ww-2*mr)/6
		};
	}
}

function windowResized(){
	layout();
	for(let i=0;i<PIECES.length;i++) reset_piece(i);
	SCREEN_NEEDS_UPDATE = true;
}

function setup() {
	solution_from_image(randomInt(IMAGES.length));
	layout();
	initialize_grid(); 
	PIECES = new_pieces();
	frameRate(20);

	START_TIME = new Date();
	BLOCK_PLACED = 0;
	ROW_DESTROYED = 0;
}

function draw() {
	for (let i=0;i<PIECES.length;i++){
		if (PIECES[i].drag.dragging==true) {
			update_hitbox(i);
			SCREEN_NEEDS_UPDATE = true;
		}
	}
	if(SCREEN_NEEDS_UPDATE){
		clear();
		background('#484848');
		grid(
			PREVIEW_POS,
			DIM,
			SOLUTION
		);
		if(!SHOW_PREVIEW)
			grid(
				GRID_POS,
				DIM,
				GRID
			);
		else
			grid(
				GRID_POS,
				DIM,
				GRID,
				true,
				SOLUTION
			);
		for (let i=0;i<PIECES.length;i++){
			draw_shape(
				{x:PIECES[i].hitbox.x,y:PIECES[i].hitbox.y},
				PIECES[i].cell,
				PIECES[i].s,
				PIECES[i].c
			);
		}
		SCREEN_NEEDS_UPDATE=false;
	}
}
