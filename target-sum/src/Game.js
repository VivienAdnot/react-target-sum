import React, { Component } from 'react';
import logo from './logo.svg';
import './Game.css';
// https://lodash.com/docs/4.17.4#sampleSize
// Gets n random elements from collection
import sampleSize from 'lodash.samplesize';

class Number extends Component {
    render() {
        return (
            <div
                className="number"
                style={{ opacity: this.props.clickable ? 1 : 0.3 }}
                onClick={() => console.log(this.props.id)}
            >
                {this.props.value}
            </div>
        );
    }
}

class Game extends Component {

    // triggered when we click on a number
    selectNumber = (numberIndex) => {

        if (this.state.gameStatus !== 'playing') {
            return;
        }

        const newSelectedIds = [...prevState.selectedIds, numberIndex];

        this.setState(
            (prevState) => ({
                selectedIds: newSelectedIds,
                gameStatus: this.computeGameStatus(newSelectedIds)
            }),
            // once setState call complete
            () => {

                if (this.state.gameStatus !== 'playing') {

                    clearInterval(this.intervalId);

                }

            }
        );

    };

    computeGameStatus = (selectedIds) => {

        const sumSelected = selectedIds.reduce(
            (acc, current) => acc + this.challengeNumbers[current],
            0
        );

        if (sumSelected < this.target) {
            return 'playing';
        }

        return sumSelected === this.target ? 'won' : 'lost'

    }

    // triggered when we click on button start
    startGame = () => {

        // start the timer only after the setState call is complete
        this.setState({ gameStatus: 'playing' }, () => {

            this.intervalId = setInterval(() => {

                this.setState((prevState) => {

                    const newRemainingSeconds = prevState.remainingSeconds - 1;

                    if (newRemainingSeconds === 0) {

                        clearInterval(this.intervalId);

                        return {
                            gameStatus: 'lost',
                            remainingSeconds: 0 // vivien: why do we need to send this property
                        };

                    }

                    return { remainingSeconds: newRemainingSeconds};

                });

            }, 1000);

        });
    };

    // available means not clicked yet
    isNumberAvailable = (numberIndex) =>
        this.state.selectedIds.indexOf(numberIndex) === -1;

    static backgroundColors = {
        playing: '#ccc',
        won: 'green',
        lost: 'red'
    };

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
                <div
                    className="target"
                    style={{ backgroundColor: Game.backgroundColors[gameStatus]}}
                >
                    {this.state.gameStatus === 'new' ? '?' : this.target}
                </div>

                <div className="challenge-numbers">
                    {this.challengeNumbers.map((value, index) =>
                        // we must specify a key when we create a list
                        <Number
                            key={index}
                            id={index}
                            value={this.state.gameStatus === 'new' ? '?' : value}
                            clickable={this.isNumberAvailable(index)}
                        />
                    )}
                </div>

                <div className="footer">
                    {this.state.gameStatus === 'new' ? (
                        <button>Start</button>
                    ) : (
                        <div className="timer-value">{this.state.remainingSeconds}</div>
                    )}

                    {['won', 'lost'].includes(this.state.gameStatus) && (
                        <button>Play Again</button>
                    )}
                </div>
            </div>
        );
    }
}

export default Game;
