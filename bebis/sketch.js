let PIECES = [];
let DIM = {l:10,h:10};
let COL = ['#99ccff','#0099ff','#b81f1f','#780606'];
BACKGROUND_COLOR = 0
let GRID;
let SOLUTION = [
	[0,0,2,0,0,0,0,2,0,0],
	[1,2,1,2,1,1,2,1,2,1],
	[0,0,2,2,2,2,2,2,0,0],
	[1,1,2,2,2,2,2,2,1,1],
	[0,2,2,3,2,2,3,2,2,0],
	[1,2,2,2,2,2,2,2,2,1],
	[0,2,2,2,2,2,2,2,2,0],
	[1,2,2,3,2,2,3,2,2,1],
	[0,0,2,2,3,3,2,2,0,0],
	[1,1,1,2,2,2,2,1,1,1]
];


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

let PIECES_POS={x:120,dx:180,y:1120};
let GRID_POS={x:20,y:460,dx:560,dy:560};
let PREVIEW_POS={x:100,y:40,dx:400,dy:400};

let IMAGES=[];
function preload() {
	IMAGES.push(loadImage('lvl/albero.bmp'));
	IMAGES.push(loadImage('lvl/cuore.bmp'));
	IMAGES.push(loadImage('lvl/paperella.bmp'));
        IMAGES.push(loadImage('lvl/mela.png'));
        IMAGES.push(loadImage('lvl/barca.png'));
        IMAGES.push(loadImage('lvl/gelato.png'));
        IMAGES.push(loadImage('lvl/ananas.png'));
        IMAGES.push(loadImage('lvl/ciliegia.png'));
        IMAGES.push(loadImage('lvl/moneta.png'));
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

function grid(position, dimension, color_grid){
    let cell = {
        l:position.dx/dimension.l,
        h:position.dy/dimension.h
    };
	for(let i=0;i<dimension.h;i++)
		for(let j=0;j<dimension.l;j++){
			fill(COL[color_grid[i][j]]);
			rect(position.x+cell.l*j, position.y+cell.h*i, cell.l, cell.h);
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
			y:(PIECES_POS.y-(ret[i].cell.y*ret[i].s.h/2)),
			fx:(PIECES_POS.x+PIECES_POS.dx*i-(ret[i].cell.x*ret[i].s.l/2))+ret[i].cell.x*ret[i].s.l,
			fy:(PIECES_POS.y-(ret[i].cell.y*ret[i].s.h/2))+ret[i].cell.y*ret[i].s.h
		};
		ret[i].drag={dragging:false};
	}
	return ret;
}

function mousePressed() {
	for (let i=0;i<PIECES.length;i++){
		if (mouseX > PIECES[i].hitbox.x && mouseX < PIECES[i].hitbox.fx && mouseY > PIECES[i].hitbox.y && mouseY < PIECES[i].hitbox.fy) {
			PIECES[i].drag.dragging=true;
			PIECES[i].drag.offx = PIECES[i].hitbox.x-mouseX;
			PIECES[i].drag.offy = PIECES[i].hitbox.y-mouseY;
		  }
	}
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
	}
	return ret;
}
function schedule_updates(){
	if(JSON.stringify(SOLUTION)===JSON.stringify(GRID)){
		alert('WIN');
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
				PIECES[i].hitbox={
					x:(PIECES_POS.x+PIECES_POS.dx*i-(PIECES[i].cell.x*PIECES[i].s.l/2)),
					y:(PIECES_POS.y-(PIECES[i].cell.y*PIECES[i].s.h/2)),
					fx:(PIECES_POS.x+PIECES_POS.dx*i-(PIECES[i].cell.x*PIECES[i].s.l/2))+PIECES[i].cell.x*PIECES[i].s.l,
					fy:(PIECES_POS.y-(PIECES[i].cell.y*PIECES[i].s.h/2))+PIECES[i].cell.y*PIECES[i].s.h
				}
			}
		}
	}
}

function touchStarted(){
 mousePressed()
 return false;
}

function touchEnded(){
 mouseReleased();
 return false;
}

function setup() {
	PIECES_POS={x:windowWidth/4,dx:windowWidth/4,y:windowHeight-(windowHeight-windowWidth)*3/DIM.h+0.03*windowWidth};
        GRID_POS={x:0.01*windowWidth,y:(DIM.h-3)/DIM.h*(windowHeight-windowWidth)+0.02*windowWidth,dx:0.98*windowWidth,dy:0.98*windowWidth};
        PREVIEW_POS={x:(windowWidth-((DIM.h-3)/(windowHeight-DIM.h*windowWidth)))/2,y:0.01*windowWidth,dx:(DIM.h-3)/DIM.h*(windowHeight-windowWidth),dy:(DIM.h-3)/DIM.h*(windowHeight-windowWidth)};
	createCanvas(windowWidth, windowHeight).center('horizontal');
	//createCanvas(800, 1220).center('horizontal');
        solution_from_image(randomInt(IMAGES.length));
	initialize_grid(); 
	PIECES = new_pieces();
}

function draw() {
	clear();
	background('#484848');
    grid(
        PREVIEW_POS,
		DIM,
		SOLUTION
    );
    grid(
        GRID_POS,
		DIM,
		GRID
	);
	for (let i=0;i<PIECES.length;i++){
		if (PIECES[i].drag.dragging==true) {
			update_hitbox(i);
		}

		draw_shape(
			{x:PIECES[i].hitbox.x,y:PIECES[i].hitbox.y},
			PIECES[i].cell,
			PIECES[i].s,
			PIECES[i].c
		);
	}
}
