const body = document.getElementById("body");
	const cvs = document.getElementById("canvas");
	const ctx = cvs.getContext("2d");


	const grid = {width:parseInt(cvs.width/3),height:parseInt(cvs.height/3)};
	const offset = {x:20,y:20};
	ctx.lineWidth = 10;

	
	

	// let available =[];
//----setup-----------------	
	var board ;
	const human = 0;
	const ai = 1;
	let turn = human;
	let winner = null;
	const winnerScore = {'x':-1,'o':1,'tie':0};
	const player=['x','o'];
	


//-----------------------------------

	
		document.getElementById("player1").innerText = player[human];
		document.getElementById("player2").innerText = player[ai];


//----------- start ----------

initializeGame();

//-------------------------

	function initializeGame(){

		board =	 [
						['','',''],
						['','',''],
						['','','']
							];

			// availableInitialization();
			drawGrid();			
	}

function changeStatus(){
	displayMoves();
	 winner = checkForWinner(true);
	if(winner != null){
		document.getElementById("winner").innerText = winner;
	}
}

//------------ event listener (for player human )******************

body.addEventListener('click',mouseClick);



function mouseClick(event){
	let spot = [];
	if(turn == human){
		spot = getMousePosition(event);
	
	try{
		if(board[spot[0]][spot[1]] == ''){
			board[spot[0]][spot[1]] = player[turn];
			changeStatus();
			turn = ai;
			if(winner==null){
				nextTurn();
			}
		   }
		}
	catch(e){
		console.log(e);
	   }
	}
}



function getMousePosition(event){
	var rec = canvas.getBoundingClientRect();
	var x = Math.floor((event.clientX - rec.left)/grid.width);
	var y = Math.floor((event.clientY - rec.top)/grid.height);
	return [y,x];
}


//-------------------------------------------------------------------

//-------------------- for AI  --------------------------------------------------

function nextTurn(){  // for ai 
	let bestScore = -Infinity;
	let bestMove;

	for (let i = 0 ; i < board.length;i++){
		for (let j = 0 ; j < board.length;j++){

			if(board[i][j] == ''){
			  	board[i][j] =player[ai];
			  	let score = minMaxAlgorithm(0,false);
			  	board[i][j] = '';
			  	if(score > bestScore){
			  		bestScore = score;
			  		bestMove = {'x':i,'y':j};
			  	}
			}
		}
	}
	
		board[bestMove.x][bestMove.y] = player[ai];
		changeStatus();
		turn = human;
}



//-------------------------------- MIN MAX ALGORITHM --------------------------------------------

function minMaxAlgorithm(depth,maxTurn){
	let winner = checkForWinner(false);

	if(winner != null){
		return winnerScore[winner];
	}

if(maxTurn){
		let bestScore = -Infinity;
	
		for (let i = 0 ; i < board.length;i++){
			for (let j = 0 ; j < board.length;j++){
				if(board[i][j] == ''){
				  	board[i][j] =player[ai];
				  	let score = minMaxAlgorithm(depth+1,false);
				  	board[i][j] = '';
				  	bestScore = Math.max(bestScore,score);
				}
		}

	}
		return bestScore;
}

else {
	let bestScore = Infinity;
		for (let i = 0 ; i < board.length;i++){
			for (let j = 0 ; j < board.length;j++){
				if(board[i][j] == ''){
				  	board[i][j] = player[human];
				  	let score = minMaxAlgorithm(depth+1,true);
				  	board[i][j] = '';
				  	bestScore = Math.min(bestScore,score);
				}
		}

	}
		return bestScore;
	}


}

//------------------------------------------------------------------------------------------------------------

// function availableInitialization(){
// 	for (let i = 0 ; i < board.length;i++){
// 		for (let j = 0 ;j <board.length;j++){
// 			  available.push([i,j]);
// 		}
// 	}
// }


function displayMoves(){
	ctx.lineWidth = 10;
	ctx.strokeStyle = "gray";
	for(let j=0;j<board.length;j++){
		for(let i=0;i<board.length;i++){
			if(board[j][i] == 'x')
				drawX(i,j);
			else if(board[j][i] == 'o')
				drawO(i,j);
		}

	}
}
	

function checkForWinner(winnerFlag){

		let to,from;
		let winner = null;
		ctx.lineWidth =7;
		ctx.strokeStyle = 'white';

			for (let i=0;i<board.length;i++){  // row wise search
				  if(areEqual(board[i][0],board[i][1],board[i][2])){
				  		
				  		from = {x:0,y:i};
				  		to = {x:2,y:i};
				  	if(winnerFlag)
				  		drawHorizontalLine(from,to);
				  		
				  		winner = board[i][0];
				  }
			}
		
			for(let j = 0 ; j < board.length;j++){ //column wise search
				if(areEqual(board[0][j],board[1][j],board[2][j])){
						from = {x:j,y:0};
				  		to = {x:j,y:2};
				  	if(winnerFlag)
				  		drawVerticalLine(from,to);
					
					winner = board[0][j];
				}
			}

			if(areEqual(board[0][0],board[1][1],board[2][2])){  // diagonal ->  \ 
						from = {x:0,y:0};
				  		to = {x:2,y:2};
				  	if(winnerFlag)
				  		drawDiagonal1(from,to);
				
				winner = board[0][0];
			}
			else if (areEqual(board[2][0],board[1][1],board[0][2])){  //diagonal -> / 
						from = {x:0,y:2};
				  		to = {x:2,y:0};

				  	if(winnerFlag)
				  	drawDiagonal2(from,to);
				
				winner = board[2][0];
			}
			let availableSpot = 0;
			for(let i= 0 ; i < 3 ; i++){
				for(let j=0; j < 3; j++){
					if(board[i][j]=='')
						availableSpot++;
				}
			}

			if (winner == null && availableSpot == 0)
					return 'tie';

			else
				return winner;


	}



function areEqual(a,b,c){
	return (a==b && a==c && a!='');
}



//-------------------------------------- layouts and moves draw ----------------------------------------------
	function drawGrid(){
		ctx.strokeStyle = "gray"; 
		ctx.lineWidth = 1;
		for(let i = 0 ; i <= board.length ; i++){
			ctx.beginPath();
			ctx.moveTo(i*grid.width,0);
			ctx.lineTo(i*grid.height,cvs.height);
			ctx.stroke();
		}
		for(let j = 0 ; j <= board.length ; j++){
			ctx.beginPath();
			ctx.moveTo(0,j*grid.height);
			ctx.lineTo(cvs.width,j*grid.width);
			ctx.stroke();
		}
	}


	function drawX(x,y){
		
			ctx.lineWidth  = 10;
			ctx.strokeStyle = "gray";
		// --------------- draw ->  \
 			ctx.beginPath();
			ctx.moveTo(x*grid.width+offset.x,y*grid.height+offset.y);
			ctx.lineTo((x+1)*grid.width-offset.x,(y+1)*grid.height-offset.y);
			ctx.stroke();

		// ----------------draw -> /
		
			ctx.beginPath();
			ctx.moveTo((x+1)*grid.width-offset.x,y*grid.height+offset.y);
			ctx.lineTo(x*grid.width+offset.x,(y+1)*grid.height-offset.y);
			ctx.stroke();
	}


	function drawO(x,y){

		ctx.beginPath();
		ctx.arc(parseInt(x*grid.width+grid.width/2),parseInt(y*grid.height+grid.height/2),parseInt(grid.height/2)-offset.y,0,Math.PI*2);
		ctx.stroke();

	}

	function drawHorizontalLine(from,to){
			ctx.beginPath();
			ctx.moveTo(from.x*grid.width+offset.x,from.y*grid.height+grid.height/2);
			ctx.lineTo((to.x+1)*grid.width-offset.x,(to.y)*grid.height+grid.height/2);
			ctx.stroke();
}

function drawVerticalLine(from,to){

			ctx.beginPath();
			ctx.moveTo(from.x*grid.width+grid.width/2,from.y*grid.height+offset.y);
			ctx.lineTo((to.x+1)*grid.width-grid.width/2,(to.y+1)*grid.height-offset.y);
			ctx.stroke();

}

function drawDiagonal1(from,to){  // diagonal -->  \
		
			ctx.beginPath();
			ctx.moveTo(from.x*grid.width+offset.x,from.y*grid.height+offset.y);
			ctx.lineTo((to.x+1)*grid.width-offset.x,(to.y+1)*grid.height-offset.y);
			ctx.stroke();
}
function drawDiagonal2(from,to){  // diagonal -->  /
		
			
			ctx.beginPath();
			ctx.moveTo((from.x)*grid.width+offset.x,(from.y+1)*grid.height-offset.y);
			ctx.lineTo((to.x+1)*grid.width-offset.x,(to.y)*grid.height+offset.y);
			ctx.stroke();
}

//---------------------------------------------------------------------------------------------------------------------------