import web3 from './web3';
import SchoolFactory from '../artifacts/contracts/School.sol/SchoolFactory.json';

const address = '0x9A89e8Bf2e498B6fa847fA879354240F1C65D236';

const instance = new web3.eth.Contract(SchoolFactory.abi, address);

export default instance;
