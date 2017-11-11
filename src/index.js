import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        // Using arrow function to bind "i" argument to handleClick.
        onClick={() => this.props.onClick(i)} />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [Array(9).fill(null)],
      xIsNext: true,
      stepNumber: 0
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(i) {
    // Erase history back until the stepNumber.
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // Copy the current squares array (immutability improves performance).
    const currentSquares = history[history.length - 1].slice();
    if (currentSquares[i] || calculateWinner(currentSquares)) {
      return;
    }
    currentSquares[i] = this.state.xIsNext ? 'X' : 'O';
    // Advance to the next step.
    history.push(currentSquares);
    this.setState(prevState =>({
      history: history,
      stepNumber: prevState.stepNumber + 1,
      xIsNext: !prevState.xIsNext
    }));
  }
  jumpTo(stepNumber) {
    this.setState({
      stepNumber: stepNumber,
      xIsNext: stepNumber % 2 === 0
    });
  }
  render() {
    const currentSquares = this.state.history[this.state.stepNumber];
    const winner = calculateWinner(currentSquares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    const moves = this.state.history.map((step, index) => {
      const desc = index ? 'Go to move #' + index :
        'Go to game start';
      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)}>{desc}</button>
        </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentSquares}
            xIsNext = {this.state.xIsNext}
            onClick = {this.handleClick} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// Helper function. Returns "winner sign" in case somebody has won, or null otherwise.
function calculateWinner(squares) {
  const lines = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const i in lines) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] &&
      squares[b] === squares[c]) {
        return squares[a];
      }
  }
  return null;
}

// ============================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
