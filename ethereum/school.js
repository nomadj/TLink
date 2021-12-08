import web3 from './web3';
import School from '../artifacts/contracts/School.sol/School.json';

export default (address) => {
  return new web3.eth.Contract(School.abi, address);
}

// const instance = (address) => {
//   return new web3.eth.Contract(abi, address);
// }

// export default instance;
