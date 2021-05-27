import Chess  from 'chess.js';
import Chessboard from 'chessboardjsx';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import $ from 'jquery';

const highlightStyles = document.createElement('style');
document.head.append(highlightStyles);
const whiteSquareGrey = 'rgb(240,217,181)';
const blackSquareGrey = 'gray';

function App() {
  const [fen,setFen]=useState("start");

  let game = useRef(null);

  useEffect(()=>{
    game.current = new Chess();
  },[])

  const onDrop=({sourceSquare,targetSquare})=>{
    onMouseoutSquare(sourceSquare);
    let move=game.current.move({
      from: sourceSquare,
      to: targetSquare
    })
    // console.log(move)
    if(move===null)return null; //checks illegal moves
    setFen(game.current.fen())

  }


  const reset=()=>{
    game.current.clear();
    game.current.reset();
    setFen("start")
  }

  /////////////////////////////////////
 
  const greySquare = (square)=> {
    // console.log(highlightStyles)
    console.log(square)
    // const highlightColor = (square.charCodeAt(0) % 2) ^ (square.charCodeAt(1) % 2)
    //   ? whiteSquareGrey
    //   : blackSquareGrey;
    // console.log(highlightColor)
    var str='[data-squareid=' + square +']'
    $(str).css("background-color","rgba(255, 255, 0, 0.5")
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
    const highlightColor = (square.charCodeAt(0) % 2) ^ (square.charCodeAt(1) % 2)
      ? whiteSquareGrey
      : blackSquareGrey;
    // console.log(highlightColor)
    var str='[data-squareid=' + square +']'
    $(str).css("background-color",highlightColor)
  }
  
  const onDragStart= (source, piece)=>{
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // or if it's not that side's turn
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false
    }
  }
  /////////////////////////////////////

  return (
    <div className="App">
      <button onClick={reset}>New Game</button>
      <div id="initial"><span>White Moves First</span></div>
      {
        game.current && game.current.game_over() ?
        alert("Game Over"):<span></span>
      }
        <div className="container">
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
