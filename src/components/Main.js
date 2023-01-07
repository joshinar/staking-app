import React, { Component, useState } from 'react';
import tether from '../tether.png';
// import Airdrop from './Airdrop'
const Main = ({
  tetherBalance,
  unstakeToekns,
  stakingBalance,
  rwdBalance,
  stakeTokens,
}) => {
  const [inputVal, setInputVal] = useState();
  return (
    <div id='content' className='mt-3'>
      <table className='table text-muted text-center'>
        <thead>
          <tr>
            <th scope='col'>Staking Balance</th>
            <th scope='col'>Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> {window.web3.utils.fromWei(stakingBalance, 'ether')} USDT</td>
            <td>{window.web3.utils.fromWei(rwdBalance, 'ether')} RWD</td>
          </tr>
        </tbody>
      </table>
      <div className='card mb-2' style={{ opacity: '.9' }}>
        <form className='mb-3'>
          <div style={{ borderSpacing: '0 1em' }}>
            <label className='float-left' style={{ marginLeft: '15px' }}>
              <b>Stake Tokens</b>
            </label>
            <span className='float-right' style={{ marginRight: '8px' }}>
              Balance:{window.web3.utils.fromWei(tetherBalance, 'ether')}
            </span>
            <div className='input-group mb-4'>
              <input
                type='text'
                placeholder='0'
                required
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <div className='input-group-open'>
                <div className='input-group-text'>
                  <img src={tether} alt='tether' height='32' />
                  &nbsp;&nbsp;&nbsp; USDT
                </div>
              </div>
            </div>
            <button
              className='btn btn-primary btn-lg btn-block'
              onClick={(e) => {
                e.preventDefault();
                stakeTokens(window.web3.utils.toWei(inputVal, 'ether'));
              }}
            >
              DEPOSIT
            </button>
          </div>
        </form>
        <button
          type='submit'
          className='btn btn-primary btn-lg btn-block'
          onClick={(e) => {
            e.preventDefault();
            unstakeToekns();
          }}
        >
          WITHDRAW
        </button>
        <div className='card-body text-center' style={{ color: 'blue' }}>
          AIRDROP{' '}
          {/* <Airdrop
            stakingBalance={this.props.stakingBalance}
            decentralBankContract={this.props.decentralBankContract}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Main;
