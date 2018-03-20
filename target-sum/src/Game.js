import React, { Component } from 'react';
import logo from './logo.svg';
import './Game.css';
// https://lodash.com/docs/4.17.4#sampleSize
// Gets n random elements from collection
import sampleSize from 'lodash.samplesize';

class Number extends Component {
    render() {
        return <div className="number">{this.props.value}</div>;
    }
}

class Game extends Component {

    challengeNumbers = Array
        .from({length: this.props.challengeSize})
        .map(() => this.randomNumberBetween(...this.props.challengeRange));

    // sampleSize(collection, n)
    target = sampleSize(
        this.challengeNumbers,
        this.props.challengeSize - 2 // 2 numbers will be wrong
    ).reduce((accumulator, current) => accumulator + current, 0); // sum

    randomNumberBetween = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    render() {
        return (
            <div className="game">
                <div className="target">{this.target}</div>

                <div className="challenge-numbers">
                    {this.challengeNumbers.map((value, index) =>
                        // we must specify a key when we create a list
                        <Number key={index} value={value} />
                    )}
                </div>

                <div className="footer">
                    <div className="timer-value">10</div>
                    <button>Start</button>
                </div>
            </div>
        );
    }
}

// class Game extends Component {
//     constructor(props) {
//         super(props);
//         console.log('Game ctor', this.props);
//     }

//     render() {
//         return (
//             <div className="game">
//                 <p>ok</p>
//                 <p>{this.props.challengeSize}</p>
//                 <p>{this.props.challengeRange}</p>
//             </div>
//         );
//     }
// }

export default Game;
