import web3 from './web3';
import SchoolFactory from '../artifacts/contracts/School.sol/SchoolFactory.json';

const address = '0xf673F2c2e7b939fCC3f0Ad30F48B69f3aBc76077';

const instance = new web3.eth.Contract(SchoolFactory.abi, address);

export default instance;
