# TLink
\
TLink is a decentralized application
that provides transparency and
incentive to the education process.

## Installation

$ git clone https://github.com/nomadj/TLink.git \
$ cd tlink \
$ yarn \
$ emacs ethereum/web3.js \
\
Insert your Infura Kovan endpoint \
\
Kill emacs \
\
$ npx hardhat compile \
$ node server.js \
\
Navigate to localhost:3000, switch to the Kovan network, add a school, and enjoy! \
\
You will want to use your own node and oracle, and add a job that returns a uint256. \
If this is new to you, please watch Patrick Collins's youtube video on running your own chainlink node. \
