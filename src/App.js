import React, { useState, useEffect } from 'react';

function App() {
  let w = 25;
  let h = 25;
  let grid = new Array(w);
  let generation = 0;
  let speed = 1000;

  let timer;

  const [running, setRunning] = useState(false);
  const [gen, setGen] = useState(generation);
  const [rando, setRando] = useState(0);

  //if user has started, set an interval to call the simulation function
  //otherwise, get rid of the interval
  useEffect(() => {
    if(running && rando !== 1 && window.grid.length !== 0) {
      window.timer = setInterval(simulation, window.speed);
    } else {
      clearInterval(window.timer);
    }
  }, [running])

  //initialize a starting empty grid using clear()
  useEffect(() => {
    clear();
  }, [])

  //initialize a new grid that has random 1s thrown in to give a random pattern and start it
  const random = () => {
    for(let i = 0; i < w; i++) {
      window.grid[i] = new Array(h);
      for(let j = 0; j < h; j++) {
        window.grid[i][j] = Math.random() < 0.2; 
      }
    }

    window.timer = setInterval(simulation, window.speed);
  }

  //toggle selected cell between dead and alive(0 or 1)
  const select = e => {
    let x = e.clientX;
    let y = e.clientY;

    let x2 = x - (x % 25);
    let y2 = y - (y % 25);

    let temp = window.grid;

    if(!running && temp.length !== 0) {
      if(window.grid[x2 / 25][y2 / 25]) {
        temp[x2 / 25][y2 / 25] = 0;
      } else {
        temp[x2 / 25][y2 / 25] = 1;
      }

      window.grid = temp;
      render();
    }
  }
  
  //see how many neighbors each cell has and if it is alive, check if it has 2 or 3 neighbors
  //else if it's dead, check to see if it has 3 neighbors
  const simulation = () => {
    let neighbors;
    for(let i = 0; i < w; i++) {
      for(let j = 0; j < h; j++) {
        //call getNeighbors on each cell
        neighbors = getNeighbors(i,j);
        window.grid[i][j] = (window.grid[i][j]) ?
          neighbors == 2 || neighbors == 3 :
          neighbors == 3;
      }
    }

    setGen(generation += 1)
    render();
  }
  
  //run through each possible neighbor location and return the num
  const getNeighbors = (x, y) => {
    let num = 0;
    //if cell is not on first row, check cell directly above it
    if(y > 0) {
      num += window.grid[x][y - 1] ? 1 : 0;
    }
    //if cell is not bottom row, check cell directly below it
    if(y < h - 1) {
      num += window.grid[x][y + 1] ? 1 : 0;
    }
    //if cell is not on far left column, check directly to the left of it
    if(x > 0) {
      num += window.grid[x - 1][y] ? 1 : 0;
    }
    //if cell is not on far right column, check directly to the right of it
    if(x < w - 1) {
      num += window.grid[x + 1][y] ? 1 : 0;
    }
    //if cell is not in top left corner, check cell diagonaly above and to the left
    if(y > 0 && x > 0) {
      num += window.grid[x - 1][y -1] ? 1 : 0;
    }
    //if cell is not in top right corner, check cell diagonaly above and to the right
    if(y > 0 && x < w - 1) {
      num += window.grid[x + 1][y - 1] ? 1 : 0;
    }
    //if cell is not in bottom left corner, check cell diagonaly below and to the left
    if(y < h - 1 && x > 0) {
      num += window.grid[x - 1][y + 1] ? 1 : 0;
    }
    //if cell is not in bottom right corner, check cell diagonaly below and to the right
    if(y < h - 1 && x < w - 1) {
      num += window.grid[x + 1][y + 1] ? 1 : 0;
    }
    return num;
  }
  
  //fill in all the cells that are alive
  const render = () => {
    let canvas = document.getElementById('canvas');
    if(canvas.getContext) {
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,625,625);
      for(let i = 0; i < 625; i+=25) {
        for(let j = 0; j < 625; j+= 25) {
          if(window.grid[i / 25][j / 25]) {
            ctx.fillStyle = 'red';
            ctx.fillRect(i, j, 25, 25); 
          }
        }
      }
    }
  }

  //set current grid to a grid of all 0s so it's blank
  const clear = () => {
    setRunning(false);

    window.grid = new Array(w);
    generation = 0;
    setGen(generation);

    for(let i = 0; i < w; i++) {
      window.grid[i] = new Array(h);
      for(let j = 0; j < h; j++) {
        window.grid[i][j] = 0; 
      }
    }
    
    render();
  }

  const load = e => {
    switch(e.target.id) {
      case "1":
        clear();
        window.grid[0][0] = 1;
        window.grid[0][1] = 1;
        window.grid[2][1] = 1;
        window.grid[5][0] = 1;
        window.grid[0][9] = 1;
        window.grid[18][0] = 1;
        window.grid[20][0] = 1;
        render();
        break;
      case "2":
        clear();
        window.grid[0][1] = 1;
        window.grid[1][1] = 1;
        window.grid[2][2] = 1;
        window.grid[8][2] = 1;
        window.grid[3][14] = 1;
        window.grid[22][5] = 1;
        window.grid[23][8] = 1;
        render();
        break;
      case "3":
        clear();
        window.grid[8][3] = 1;
        window.grid[5][22] = 1;
        window.grid[20][17] = 1;
        window.grid[12][13] = 1;
        window.grid[8][19] = 1;
        window.grid[23][8] = 1;
        window.grid[24][18] = 1;
        render();
        break;
        break;
      default:
        break;
    }
  }
  
  return (
    <div className="App">
      <canvas id='canvas' onClick={select} width="625" height="625"></canvas>

      <h1>{`Generation: ${gen}`}</h1>

      <button onClick={() => {
        setRunning(!running);
        setRando(0);
        }}>{running ? 'STOP' : 'START'}</button>

        <button onClick={() => {
          setRunning(false);
          clear();
        }}>CLEAR</button>

        <button onClick={() => {
          setRunning(false);
          clear();
          setRando(1);
          setRunning(true);
          random();
        }}>RANDOM</button>

        <input id="speed" type="text"></input>
        <button onClick={() => {
          let num = document.getElementById('speed');
          window.speed = num.value;
        }}>Apply</button>

        <button onClick={load} id='1'>Preset 1</button>
        <button onClick={load} id='2'>Preset 2</button>
        <button onClick={load} id='3'>Preset 3</button>
    </div>
  );
}

export default App;