import React, { Component, PureComponent } from 'react';
import logo from './logo.svg';
import './Game.css';
// https://lodash.com/docs/4.17.4#sampleSize
// Gets n random elements from collection
import sampleSize from 'lodash.samplesize';

const backgroundColors = {
    playing: '#ccc',
    won: 'green',
    lost: 'red'
};

// PureComponent will re-render only if props have changed
class Number extends PureComponent {

    componentWillUpdate() {

        console.log(`Number component updated: ${this.props.id}`);

    }

    render() {
        return (
            <div
                className="number"
                style={{ opacity: this.props.clickable ? 1 : 0.3 }}
                onClick={() => {
                    if (this.props.clickable) {

                        this.props.onSelected(this.props.id);

                    }
                }}
            >
                {this.props.value}
            </div>
        );
    }
}

class Game extends Component {

    constructor(props) {

        super(props);

        this.state = {
            gameStatus: 'new', // new, playing, won, lost
            remainingSeconds: this.props.initialSeconds,
            selectedIds: []
        };

        this.challengeNumbers = Array
            .from({length: this.props.challengeSize})
            .map(() => this.randomNumberBetween(...this.props.challengeRange));

        // sampleSize(collection, n)
        this.target = sampleSize(
            this.challengeNumbers,
            this.props.challengeSize - 2 // 2 numbers will be wrong
        ).reduce((accumulator, current) => accumulator + current, 0); // sum

    }

    //============ lifecycle methods ============

    componentDidMount() {

        if (this.props.autoPlay) {

            this.startGame();

        }

    }

    componentWillMount() {

        clearInterval(this.intervalId);

    }

    //============ triggers ============

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

    // triggered when we click on a number
    selectNumber = (numberIndex) => {

        if (this.state.gameStatus !== 'playing') {
            return;
        }

        this.setState(
            (prevState) => ({
                selectedIds: [...prevState.selectedIds, numberIndex],
                gameStatus: this.computeGameStatus([...prevState.selectedIds, numberIndex])
            }),
            // once setState call complete
            () => {

                if (this.state.gameStatus !== 'playing') {

                    clearInterval(this.intervalId);

                }

            }
        );

    };


    //============ helpers ============

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

    // available means not clicked yet
    isNumberAvailable = (numberIndex) =>
        this.state.selectedIds.indexOf(numberIndex) === -1;

    randomNumberBetween = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    render() {
        return (
            <div className="game">
                <div
                    className="target"
                    style={{ backgroundColor: backgroundColors[this.state.gameStatus]}}
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
                            onSelected={this.selectNumber}
                        />
                    )}
                </div>

                <div className="footer">
                    {this.state.gameStatus === 'new' ? (
                        <button onClick={this.startGame} >Start</button>
                    ) : (
                        <div className="timer-value">{this.state.remainingSeconds}</div>
                    )}

                    {['won', 'lost'].includes(this.state.gameStatus) && (
                        <button onClick={this.props.onPlayAgain}>
                            Play Again
                        </button>
                    )}
                </div>
            </div>
        );
    }
}

export default Game;
