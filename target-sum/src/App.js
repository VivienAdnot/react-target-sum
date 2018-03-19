import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Number extends Component {
    render() {
        return <div className="number">{this.props.value}</div>;
    }
}

class App extends Component {
    render() {
        return (
            <div className="game">
                <div className="target">42</div>

                <div className="challenge-numbers">
                    <Number value={8} />
                    <Number value={5} />
                    <Number value={12} />
                    <Number value={13} />
                    <Number value={5} />
                    <Number value={16} />
                </div>

                <div className="footer">
                    <div className="timer-value">10</div>
                    <button>Start</button>
                </div>
            </div>
        );
    }
}

export default App;
