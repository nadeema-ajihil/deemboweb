/**
 * Mine Detective - a twist to the popular game MineSweeper
 * @author - Nadeema Ajihil
 */


(function(global){
    
    var MineDetective = function(){
        
        var that = this,
            height = 16,
            width = 30,
            totalCells = height * width,
            totalMines = Math.round(totalCells * 0.075),
            clickedCells = 0,
            markedMines = 0,
            timer,
            timerValue = ['00', '00', '00'],
            cellColor = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
        
        //holds reference to all cell nodes
        var cells = [];
        
        //holds reference to remaining mines div
        var remainingMines;
        
        //holds reference to timer
        var timerDiv;
        
        var buildSettings = function(body){
            body.insertAdjacentHTML('beforeend', '<div id="popupSettings" class="overlay"> \
	<div class="popup"> \
		<h2>Difficulty Level</h2> \
		<div class="content"> \
			  <form action="#"> \
                <p> \
                  <input value="0.075" name="difficulty" type="radio" id="low" checked/> \
                  <label for="low">Low</label> \
                </p> \
                <p> \
                  <input value="0.14" name="difficulty" type="radio" id="medium" /> \
                  <label for="medium">Medium</label> \
                </p> \
                <p> \
                  <input value="0.2" name="difficulty" type="radio" id="high"  /> \
                  <label for="high">High</label> \
                </p> \
                <a class="close" href="#" id="saveSetting">Save</a> \
              </form> \
		</div> \
	</div> \
</div>');
            var btn = body.getElementsByClassName("close")[0];
            btn.onclick = function(){that.reset()};
        }
        
        //method to call to end game
        var endGame = function() {
            
            //the game ends and bombs are not clicked means user wins
            var win = clickedCells !== totalCells;
            if(win) {
                console.log('win');
            }
            
            //stop timer
            stopTimer();
            
            //set remaining mines to 0
            markedMines = totalMines;
            
            //remove clicks
            for(var h = 0; h < height; h++){    
                for(var w = 0; w < width; w++){
                    var cell = cells[h][w];
                    
                    //marked all bombs
                    if(cell.value === 'B' && !cell.clicked){
                        cell.cell.className += ' marked';
                    }
                    
                    cell.cell.onclick = null;
                }
            }
        };
        
        var resetTimer = function(){
            stopTimer();
            timerValue = ['00', '00', '00'];
            timerDiv.textContent = timerValue.join(':');
        }
        
        var startTimer = function(){
            timer = setInterval(function(){
                var numTimes = [Number(timerValue[0]), Number(timerValue[1]), Number(timerValue[2]) + 1];
                
                for(var i = 2; i >= 0; i--) {
                    
                    //if after increment time value is 60, reset to 0 and add 1 to next time value
                    if(numTimes[i] === 60 && (i-1) > -1) {
                        numTimes[i-1] = numTimes[i-1] + 1;
                        numTimes[i] = 0;
                    }
                    
                    var sNum = String(numTimes[i]);
                    if(sNum.length === 1)
                        sNum = '0' + sNum;
                    
                    timerValue[i] = sNum;
                }
                
                timerDiv.textContent = timerValue.join(':');
            }, 1000);
        }
        
        var stopTimer = function(){
            clearInterval(timer);
        }
        
        //function that applies fx to surrounding cells
        var surroundingCells = function(h, w, fx){            
            for(var row = (h - 1); row <= (h + 1); row++) {
                for(var col = (w - 1); col <= (w + 1); col++) {
                    if(!(row === h && col === w) 
                       && (col >= 0 && col < width)
                       && (row >= 0 && row < height)) {
                        var cell = cells[row][col];
                        fx(cell);
                    }
                }
            }
        };
        
        //function that makes all necessary changes when cell is clicked
        var clickCell = function(cell){
            
            if(!cell.clicked) {
                cell.clicked = true;
                cell.cell.className += ' clicked';

                if(cell.value !== 'B') {
                    
                    //if a cell is wrongly marked as bomb, remove the marked class
                    if(cell.cell.className.indexOf('marked') > -1)
                        cell.cell.className = cell.cell.className.replace('marked', '');
                    
                    cell.cell.textContent = cell.value;
                    
                } else {
                    cell.cell.className += ' explode';
                }

                clickedCells++;

                if(clickedCells === 1)
                    startTimer();
            }
            
        }
        
        var updateCounts = function(){
            var remainingCount = (totalMines - markedMines);
            if(remainingMines) {
                remainingMines.innerHTML = '<i class="fa fa-bomb fa-lg" aria-hidden="true"></i><span class="count">'+remainingCount+'</span>';
            }
        };
        
        var setMinesAndCounts = function(){
            var remainingMines = totalMines;
            do{
                var randomRow = Math.floor((Math.random() * 16) + 0);
                var randomColumn = Math.floor((Math.random() * 30) + 0);
                
                var randomCell = cells[randomRow][randomColumn];
                if(randomCell.value === ''){
                    randomCell.value = 'B';
                    remainingMines--;
                }
                    
            }while(remainingMines > 0);
            
            //set other values
            for(var h = 0; h < height; h++){    
                for(var w = 0; w < width; w++){
                    var cell = cells[h][w],
                        bombCount = 0;

                    surroundingCells(h, w, function(cell) {
                        if(cell.value === 'B') {
                            bombCount++;
                        }
                    });
                    
                    //set bombcount only if greater than 0
                    if(cell.value === '' && bombCount > 0) {
                        cell.value = bombCount;
                        cell.cell.className += ' '+cellColor[cells[h][w].value]
                    }
                }
             }
            
            updateCounts();
        };
        
        var toggleMarkedMine = function(cell){
            if(cell.marked) {
                cell.marked = false;
                cell.cell.className = 'cell';
                markedMines--;
            } else if (!cell.clicked){
                cell.marked = true;
                cell.cell.className += ' marked';
                markedMines++;
            }
            
            updateCounts();
        }
        
        var clickMethod = function(cell) {
            var h = cell.row,
                w = cell.col;
            
            if(cells[h][w].marked) {
                                
                toggleMarkedMine(cells[h][w]);

            } else {
                
                clickCell(cells[h][w]);
                
                var value = cells[h][w].value;

                //if bomb, open all
                if(value === 'B') {
                    for(var i = 0; i < height; i++){    
                        for(var j = 0; j < width; j++){
                            clickCell(cells[i][j]);
                        }
                    }

                //if empty, open surrounding non-bomb cells
                } else if (value === '') {

                    var fx = function(cell) {
                        if(!cell.clicked && !cell.marked) {
                            clickMethod(cell);
                        }
                    }

                    surroundingCells(h, w, fx);
                } else {
                    cells[h][w].cell.textContent = cells[h][w].value;
                }
                
                //if all non-bomb cells are clicked or all cells are clicked
                if(totalCells === clickedCells || 
                   (totalCells - clickedCells) === totalMines) {
                    endGame();
                }
                
                updateCounts();
                
            }  
        };
        var addCellClicks = function(){
            for(var h = 0; h < height; h++){    
                for(var w = 0; w < width; w++){
                    cells[h][w].cell.onclick = function(h, w){
                        return function(e) {
                            clickMethod(cells[h][w]);
                        };
                    }(h, w);
                    
                    cells[h][w].cell.oncontextmenu = function(h, w){
                        return function(e) {
                            
                            toggleMarkedMine(cells[h][w]);
                            
                            return false;
                        };
                    }(h, w);
                }
            }
        };
        
        var initCells = function(){
            for(var h = 0; h < height; h++){
                for(var w = 0; w < width; w++){

                    //initialize array
                    if(!cells[h])
                        cells[h] = [];
                    
                    //create 2-dimentional array and store cell details
                    cells[h][w] = { value: '', 
                        clicked: false,
                        marked: false,
                        row: h,
                        col: w };
                }
            }
        };
        
        this.reset = function(options){
            
            var diff = document.querySelector('[name=difficulty]:checked');
            if(diff){
                totalMines = Math.round(totalCells * Number(diff.value));
            }
            
            resetTimer();
            clickedCells = 0;
            markedMines = 0;
            
            for(var h = 0; h < height; h++){    
                for(var w = 0; w < width; w++){
                    var cell = cells[h][w];
                    cell.value = '';
                    cell.clicked = false;
                    cell.marked = false;
                    cell.cell.className = 'cell';
                    cell.cell.textContent = '';
                }
            }
            
            addCellClicks();
            setMinesAndCounts();
            
            return this;
        };
        
        this.init = function(){
            
            var body, 
                doc = document;
            
            // if an id of container is specified, append mine detective to that, else use body
            if(arguments.length > 0)
                body = doc.getElementById(arguments[0]);
            if(!body)
                body = doc.getElementsByTagName('body')[0];
            
            // initialize cells
            initCells();
            
            // draw mine detective
            drawBoard(body);
            
            // add click action to cells
            addCellClicks();
            
            // build settings menu           
            buildSettings(body);
            
            // set level of difficulty and counts
            setMinesAndCounts();
            
            return this;
            
            
        };
        
        var drawBoard = function(body){
            
            var doc = document
            
            //create main minedetective div
            var div = doc.createElement('div');
            div.className = 'minedetective';
            
            //draw header
            var hdr = doc.createElement('div');
            hdr.className = 'header';
            
            hdr.innerHTML = '<div style="float:left;padding: 5px 0px 0px 10px;">MINE DETECTIVE</div><div><ul><li><a href="#popupSettings"><i class="fa fa-wrench" aria-hidden="true"></i></a></li> \
<li><a href="#"><i class="fa fa-trophy" aria-hidden="true"></i></a></li> \
                    <li><a href="javascript:MineDetective.reset()"><i class="fa fa-refresh" aria-hidden="true"></i></a></li> \
                    <li><a href="#"><i class="fa fa-question-circle" aria-hidden="true"></i></a></li></ul></div>';
            
            div.appendChild(hdr);
            
            for(var h = 0; h < height; h++){
                
                //create row div
                var row = doc.createElement('div');
                row.className = 'row';
                
                for(var w = 0; w < width; w++){
                    
                    //define cell
                    var cell = doc.createElement('div');
                    cell.className = 'cell';
                    
                    //append cell to row
                    row.appendChild(cell);
                    
                    //add reference to cells array
                    if(!cells[h])
                        cells[h] = [];
                    cells[h][w].cell = cell;
                    
                }
                
                //add row to main minesweeper div
                div.appendChild(row);
            }
            
            //draw footer
            var ftr = doc.createElement('div');
            ftr.className = 'footer';
            
            remainingMines = doc.createElement('div');
            remainingMines.className = "mine-count";
            
            timerDiv = doc.createElement('div');
            timerDiv.className = 'timer';
            timerDiv.textContent = timerValue.join(':');
            
            ftr.appendChild(remainingMines);
            ftr.appendChild(timerDiv);
            
            div.appendChild(ftr);
           
            body.appendChild(div);
            
            return this;
            
        };
        
        return this;
    };
    
    global.MineDetective = new MineDetective();
    
})(window);