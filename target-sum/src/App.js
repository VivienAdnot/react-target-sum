import React, { Component } from 'react';
import Game from "./Game";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameId: 1
        };
    }

    resetGame = () =>
        this.setState((prevState) => ({
            gameId: prevState.gameId + 1
        }));

    render() {

        return (
            <Game
                key={this.state.gameId}
                autoPlay={this.state.gameId > 1}
                challengeSize={6}
                challengeRange={[2, 9]}
                initialSeconds={20}
                onPlayAgain={this.resetGame}
            />
        );

    }

}

export default App;