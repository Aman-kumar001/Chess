import Chess  from 'chess.js';
import Chessboard from 'chessboardjsx';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import $ from 'jquery';

function App() {
  const [turn,setTurn]=useState("white")
  const [fen,setFen]=useState("start");

  let game = useRef(null);

  useEffect(()=>{
    game.current = new Chess();
  },[])


  const onDrop=({sourceSquare,targetSquare})=>{
    onMouseoutSquare(sourceSquare);
    let move=game.current.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'    //used queen to for promotion for simplicity
    })
    // console.log(move)
    if(move===null)return null; //checks illegal moves
    setFen(game.current.fen())

    // update turn
    if(turn=="white"){
      setTurn("black")
    }
    else setTurn("white")
  }


  const reset=()=>{
    game.current.clear();
    game.current.reset();
    setFen("start")
    setTurn("white")
  }

  /////////////////////////////////////
 
  const greySquare = (square)=> {
    // console.log(highlightStyles)
    console.log(square)
    var str='[data-squareid=' + square +']'
    $(str).css("boxShadow","inset 0 0 1px 4px rgba(0,0,255,0.7)")
  };

  const onMouseoverSquare=(square,piece)=>{
      let move=game.current.moves({
        square: square,
        verbose: true
      });
      console.log(move)
      if(move.length===0)return;

      
      // greySquare(square);
      for (var i = 0; i < move.length; i++) {
        greySquare(move[i].to);
    }
  }

  const onMouseoutSquare =(square)=>{
    let move=game.current.moves({
      square: square,
      verbose: true
    });
    console.log(move)
    if(move.length===0)return;

    // greySquare(square);
    for (var i = 0; i < move.length; i++) {
      removeGreySquares(move[i].to);
  }
  };
  const removeGreySquares=(square)=>{
    var str='[data-squareid=' + square +']'
    $(str).css("boxShadow","")
  }
  
  const onDragStart= (source, piece)=>{
    // do not pick up pieces if the game is over
    if (game.current.game_over()) return false

    // or if it's not that side's turn
    if ((game.current.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.current.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false
    }
    else return true;
  }
  console.log(turn)
  /////////////////////////////////////

  return (
    <div className="App">
      
        <div className="container">
        <div className="turn">
          <div className="chance" style={{backgroundColor:turn,color:(turn=="white"?"black":"white")}}>
            <h2>Player to Move</h2>
          </div>
          <button onClick={reset}>New Game</button>
        </div>
        
      {
        game.current && game.current.game_over() ?
        alert("Game Over!! CheckMate"):<span></span>
      }
          <Chessboard
          darkSquareStyle={{backgroundColor:"gray"}}
          dropSquareStyle={{boxShadow: 'inset 0 0 1px 4px black'}}
          onMouseOverSquare={onMouseoverSquare}
          onMouseOutSquare={onMouseoutSquare}
          onDragStart={onDragStart}
          position={fen} 
          onDrop={onDrop}/>
        </div>
    </div>
  );
}

export default App;
