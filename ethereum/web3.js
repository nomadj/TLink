import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && window.web3 !== 'undefined') {
  web3 = new Web3(window.ethereum);
  window.ethereum.enable();
} else {
  const provider = new Web3.providers.HttpProvider(
    'https://kovan.infura.io/v3/7f709d402b7e4ec59b7c771c3da42204'
  );
  web3 = new Web3(provider);
}

export default web3;
