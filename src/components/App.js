import React, { useEffect } from 'react';
import { useState } from 'react';
import Navbar from './Navbar';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import Rwd from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Main from './Main';

const App = () => {
  const [account, setAccount] = useState(null);
  const [tether, setTether] = useState({});
  const [rwd, setRwd] = useState({});
  const [decentralBank, setDecentralBank] = useState({});
  const [tetherBalance, setTetherBalance] = useState('0');
  const [rwdBalance, setRwdBalance] = useState('0');
  const [stakingBalance, setStakingBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert('No ethereum browser detected! checkout metamask');
    }
  };
  const loadBlockChainData = async () => {
    const web3 = await window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  };

  const loadTetherContract = async () => {
    const web3 = await window.web3;
    const networkId = await web3.eth.net.getId();
    //load tether contract
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      setTether(tether);
      let tetherBalance = await tether.methods.balanceOf(account).call();
      setTetherBalance(tetherBalance.toString());
    } else {
      alert('tether contract not deployed to detect network');
    }
    setLoading(false);
  };
  const loadRwdContract = async () => {
    const web3 = await window.web3;
    const networkId = await web3.eth.net.getId();
    //load tether contract
    const rwdData = Rwd.networks[networkId];
    if (rwdData) {
      const rwd = new web3.eth.Contract(Rwd.abi, rwdData.address);
      setRwd(rwd);
      let rwdBalance = await rwd.methods.balanceOf(account).call();
      setRwdBalance(rwdBalance.toString());
    } else {
      alert('rwd contract not deployed to detect network');
    }
    setLoading(false);
  };
  const loadDecentralBankContract = async () => {
    const web3 = await window.web3;
    const networkId = await web3.eth.net.getId();
    const decentralBankData = DecentralBank.networks[networkId];
    if (decentralBankData) {
      let decentralBank = await new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      setDecentralBank(decentralBank);
      let stakingBalance = await decentralBank.methods
        .stakingBalance(account)
        .call();
      setStakingBalance(stakingBalance.toString());
    } else {
      alert('DecentalBank contract not deployed to detect network');
    }
    setLoading(false);
  };

  const stakeTokens = async (amount) => {
    tether.methods
      .approve(decentralBank._address, amount)
      .send({ from: account })
      .on('transactionHash', (e) => {
        decentralBank.methods.depositTokens(amount).send({ from: account });
      });
  };

  const unstakeToekns = () => {
    setLoading(true);
    decentralBank.methods.unstakeTokens().send({ from: account });
    setLoading(false);
  };
  useEffect(() => {
    loadWeb3();
    loadBlockChainData();
  }, []);

  useEffect(() => {
    if (account) {
      loadTetherContract();
      loadRwdContract();
      loadDecentralBankContract();
    }
  }, [account]);

  return (
    <div>
      <Navbar account={account} />
      <div className='container-fluid mt-5'>
        <div className='row'>
          <main
            role='main'
            className='col-lg-12 ml-auto mr-auto'
            style={{ maxWidth: '600px' }}
          >
            {!loading && (
              <div>
                <Main
                  tetherBalance={tetherBalance}
                  stakingBalance={stakingBalance}
                  rwdBalance={rwdBalance}
                  stakeTokens={stakeTokens}
                  unstakeToekns={unstakeToekns}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
