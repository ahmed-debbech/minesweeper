let grid = []
let MAX_X = 20
let MAX_Y =20
let MAX_B = 50
let LEFT_B = MAX_B

let EMPTY = 'E'
let BOMB = 'B'

var countColors = {1: 'blue', 2: 'green', 3: 'red', 4: 'blue-dark', 5: 'maroon', 6: 'turquoise', 7: 'purple', 8: 'gray-dark'};

function buildGrid(){
  for(let i=0; i<MAX_X; i++){
    let row = []
    for(let j=0; j<MAX_Y; j++){

      let obj = {
        type : EMPTY,
        clicked : false,
        flagged : false
      }
      row.push(obj)
    }
    grid.push(row)
  }
}

function setBombs(){
  for(let i=0; i<MAX_B; i++){
    let x = Math.floor((Math.random() * 20) + 0);
    let y = Math.floor((Math.random() * 20) + 0);
    if(grid[x][y].type != BOMB){
      grid[x][y].type = BOMB
    }
  }
}

function isOutside(x, y){
  if((x<0) || (x>=MAX_X)) return true
  if((y<0) || (y>=MAX_Y)) return true
  return false
}

function countSurroundings(){
  for(let i=0; i<MAX_X; i++){
    for(let j=0; j<MAX_Y; j++){

      if(grid[i][j].type == BOMB) continue;

      let b_c = 0

      if(!isOutside(i-1,j))
      if(grid[i-1][j].type == BOMB){ b_c++;}

      if(!isOutside(i-1,j+1))
      if(grid[i-1][j+1].type == BOMB) { b_c++;}

      if(!isOutside(i,j+1))
      if(grid[i][j+1].type == BOMB){ b_c++;}

      if(!isOutside(i+1,j+1))
      if(grid[i+1][j+1].type == BOMB){ b_c++;}

      if(!isOutside(i+1,j))
      if(grid[i+1][j].type == BOMB){ b_c++;}
      
      if(!isOutside(i+1,j-1))
      if(grid[i+1][j-1].type == BOMB) { b_c++;}

      if(!isOutside(i,j-1))
      if(grid[i][j-1].type == BOMB){ b_c++;}

      if(!isOutside(i-1,j-1))
      if(grid[i-1][j-1].type == BOMB){ b_c++;}

      if(b_c > 0) grid[i][j].type = b_c
    }
  }
}

function openCells(x,y){
  if(isOutside(x,y)) return
  if(grid[x][y].clicked == true) return;
  if(grid[x][y].type == BOMB ) return

  grid[x][y].clicked = true

  if(grid[x][y].type == EMPTY){
  openCells(x-1,y)
  openCells(x-1, y+1)
  openCells(x, y+1)
  openCells(x+1, y+1)
  openCells(x+1, y)
  openCells(x+1, y-1)
  openCells(x, y-1)
  openCells(x-1, y-1)
  }
}

function checkWin(){

  let k=true
  for(let i=0; i<=grid.length-1; i++){
    for(let j =0; j<=grid[i].length-1; j++){
      if((grid[i][j].flagged == true) || (grid[i][j].clicked == true) ){
        continue;
      }else{
        return "not yet"
      }
    }
  }
  return "won";
}
function clickCell(e, x, y ){
  let over = "not yet"
  if(e.altKey || e.which === 3){

    if(grid[x][y].flagged){
      if(LEFT_B <= MAX_B){
        grid[x][y].flagged = false
        LEFT_B++
      }
    }else{
      if(LEFT_B >= 0) {
        grid[x][y].flagged = true
        LEFT_B--
      }
    }
  }else{
    grid[x][y].flagged = false
    if(grid[x][y].type == EMPTY){
      openCells(x,y)
    }else{
      grid[x][y].clicked = true
      if(grid[x][y].type == BOMB){
        over = "bomb"
      }
    }
  }
  print(over)
  print(checkWin())
}

function print(over){
  $('#grid').html('')
  $("#minecounter").html(LEFT_B)

  for(let i=0; i<MAX_X; i++){
    let attrrow = {
      id : 'r'+i,
      class : "row"
    }
    $("<div>", attrrow).appendTo("#grid")
    for(let j=0; j<MAX_Y; j++){

      let attrcell = {
        id : i+"-"+j,
        class : 'cell',
        html : '',
        onclick : 'clickCell(event, '+i + ","+ j +')'
      }

      if(grid[i][j].type == BOMB){
        attrcell.html = "<i style='font-size: x-small;'>💣</i>"
        attrcell.class += " orange "
      }

      if(grid[i][j].clicked){
        attrcell.class += " revealed "
      }

      if((grid[i][j].type != EMPTY) && (grid[i][j].type != BOMB)){
        attrcell.class += " " + countColors[grid[i][j].type] + " "
        attrcell.html = "<i>"+grid[i][j].type+"</i>"
      }
      if(grid[i][j].flagged){
        attrcell.class += " flaged "
        attrcell.html = " <span class='flag'></span>"
      }
      $("<div>", attrcell).appendTo("#r"+i)
    }
  }
  if (over == "bomb"){
    setTimeout(()=>{
      $('#grid').html('GAMEOVER')
    },1000)
    return;
  } else{
    if(over == "won"){
      setTimeout(()=>{
        $('#grid').html('YOU WON!')
      },1000)
      return;
    }
  }
}

function init(){
  grid = []
  buildGrid()
  setBombs()
  countSurroundings()
  print()
  console.log(grid)
}

init()