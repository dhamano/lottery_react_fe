import react, { Component } from 'react';
import logo from '../imgs/logo.svg';
import '../css/App.css';
import web3 from '../utilities/web3';
import lottery from '../utilities/lottery';

class App extends Component {
    state = {
        manager: '',
        players: [],
        balance: ''
    }

    async componentDidMount() {
        const manager = await lottery.methods.manager().call(),
            players = await lottery.methods.getPlayers().call(),
            balance = await web3.eth.getBalance(lottery.options.address);

        this.setState({ manager, players, balance });
    }

    render() {
        return (
            <div className="App">
                <h2>Lottery Contract</h2>
                <p>
                    This contract is managed by {this.state.manager}.<br />
                    There are currently {this.state.players.length} people entered,
                    competing to win { web3.utils.fromWei(this.state.balance, 'ether') } ether!
                </p>
            </div>
        );
    }
}

export default App;
