import web3 from './web3';
import TLink from '../artifacts/contracts/TLink.sol/TLink.json'

const address = '0x380B09948c40aBb4990C65f676A0956880a6b454';
const instance = new web3.eth.Contract(TLink.abi, address);

export default instance;
