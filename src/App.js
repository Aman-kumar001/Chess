import Chess  from 'chess.js';
import Chessboard from 'chessboardjsx';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import $ from 'jquery';
import pic1 from './images/pic1.svg'
import pic2 from './images/pic2.svg'
import pic3 from './images/pic3.svg'

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
    $(str).css("boxShadow",turn=="black"?"inset 0 0 1px 4px black":"inset 0 0 1px 6px white")
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
      <img src={pic1} alt="" className="pawn"/>
      <img src={pic2} alt="" className="king"/>
      <img src={pic3} alt="" className="knight"/>

        <div className="container">
        <div className="turn">
          <div className="chance" style={{backgroundColor:"gray",color:(turn=="white"?"white":"black")}}>
            {turn=="white"? <h2>White's turn</h2>:<h2>Black's turn</h2>}
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
