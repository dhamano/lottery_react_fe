import { Component } from 'react';
import '../css/App.css';
import web3 from '../utilities/web3';
import lottery from '../utilities/lottery';

class App extends Component {
    state = {
        manager: '',
        players: [],
        balance: '',
        value: '',
        message: '',
        messageWin: ''
    }

    async componentDidMount() {
        const manager = await lottery.methods.manager().call(),
            players = await lottery.methods.getPlayers().call(),
            balance = await web3.eth.getBalance(lottery.options.address);

        this.setState({ manager, players, balance });
    }

    onSubmit = async (e) => {
        e.preventDefault();
        
        const accounts = await web3.eth.getAccounts();

        this.setState({ message: 'Waiting on transaction success...' });

        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        });
        const players = await lottery.methods.getPlayers().call(),
            balance = await web3.eth.getBalance(lottery.options.address);

        this.setState({ players, balance, message: 'You have been entered!' });
    };

    onClick = async () => {
        const accounts = await web3.eth.getAccounts();

        this.setState({ messageWin: 'Waiting on transaction success...' });

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const winner = await lottery.methods.lastWinner().call();

        this.setState({ messageWin: `A winner has been picked, Congratulations ${winner}!` });
    };


    render() {
        return (
            <div className="App">
                <h2>Lottery Contract</h2>
                <p>
                    This contract is managed by {this.state.manager}.<br />
                    There are currently {this.state.players.length} people entered,
                    competing to win { web3.utils.fromWei(this.state.balance, 'ether') } ether!
                </p>
                <div className="entry-form">
                    {
                        this.state.message === '' ? (
                            <form onSubmit={this.onSubmit}>
                                <h4>Try your luck?</h4>
                                <div>
                                    <label for="ether-to-enter">Amount of ether to enter</label>
                                    <input
                                        id="ether-to-enter"
                                        type="number"
                                        step="0.001"
                                        value={this.state.value}
                                        onChange={e => this.setState({ value: e.target.value })}
                                        placeholder="0"
                                    />
                                    <button>Enter</button>
                                </div>
                            </form>
                        ) : (
                            <p>{this.state.message}</p>
                        )
                    }
                </div>
                <div>
                    {
                        this.state.messageWin === '' ? (
                            <>
                                <h4>Ready to pick a winner?</h4>
                                <button onClick={this.onClick}>Pick a winner!</button>
                            </>
                        ) : (
                                <p>{this.state.messageWin}</p>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default App;
