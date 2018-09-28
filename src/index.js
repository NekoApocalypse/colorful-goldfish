import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

var documentMouseState = 0;
var globalVar = {};

document.onmousedown = () => {
    documentMouseState = 1;
    globalVar.callback(documentMouseState);
}

document.onmouseup = () => {
    documentMouseState = 0;
    globalVar.callback(documentMouseState);
}


class DocumentMouseStateIndicator extends React.Component {
    constructor(props) {
        super(props)
        globalVar.callback = (mouseState) => {
            this.setState({mouseState: mouseState})
        };
        this.state = {
            mouseState: documentMouseState
        };
    }
    /*
    componentWillMount() {
        globalVar.callback = (mouseState) => {
            this.setState({mouseState: mouseState})
        };
    }
    */
    render() {
        const message = `Mouse State: ${this.state.mouseState}`
        return (
            <p className='col-12'>{message}</p>
        )
    } 
}

function MouseStateIndicator(props) {
    return (
        <p className='col-12'>Mouse State: {props.mouseState}</p>
    )
}

function Square(props) {
    return (
        <span 
            className='square'
            style={{background: props.color}}
            onMouseDown={props.onMouseDown}
            onMouseOver={props.onMouseOver}
        />
    )
}

class Board extends React.Component {
    rednerSquare(color, i, j) {
        return (
            <Square
                color={color}
                onMouseDown={() => this.props.onMouseDown(i, j)}
                onMouseOver={() => this.props.onMouseOver(i, j)}
            />
        )
    }

    render() {
        return(
            <div className='board'>
                {
                    this.props.colorGrid.map((row, index) => {
                        return (
                            <div className='board-row row my-0 mx-0'>
                            {
                                row.map((color, i) => {
                                    return(this.rednerSquare(color, index, i))
                                })
                            }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        const defaultX = 10;
        const defaultY = 10;
        this.state = {
            gridX: 10,
            gridY: 10,
            mouseState: 0,
            currentColor: '#ff5733',
            colorGrid: this.makeGrid(defaultX, defaultY),
        };
    }

    handleMouseState(e, state) {
        e.preventDefault();
        this.setState({
            mouseState: state
        })
    }

    handleClick(i, j) {
        const grid = this.state.colorGrid;
        const color = '#ff5566';
        grid[i][j] = color;
        this.setState({
            colorGrid: grid
        });
    }

    handleMouseOver(i, j) {
        if (this.state.mouseState > 0)
            this.handleClick(i, j);
    }

    makeGrid(x, y, defaultVal='#00ffff') {
        let target = [];
        for (let i=0;i<x;i++) {
            let newRow = Array(y).fill(defaultVal);
            target.push(newRow);
        }
        return(target);
    }

    render() {
        const grid = this.state.colorGrid;
        const colorStat = `Color: ${this.state.currentColor}`;
        const gridStat = `Grid size: ${this.state.gridX} x 
            ${this.state.gridY}`;
        return(
            <div
                className='app container'
                onMouseDown={(e) => this.handleMouseState(e, 1)}
                onMouseUp={(e) => this.handleMouseState(e, 0)}
            >
                <div className='app-info row'>
                    <p className='col-12'>{gridStat}</p>
                    <p className='col-12'>{colorStat}</p>
                    <MouseStateIndicator mouseState={this.state.mouseState}/>
                    <DocumentMouseStateIndicator mouseState={documentMouseState}/>
                </div>
                <Board 
                    colorGrid={grid}
                    onMouseDown={(i, j) => this.handleClick(i, j)}
                    onMouseOver={(i, j) => this.handleMouseOver(i, j)}
                />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)