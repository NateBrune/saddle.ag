import ERC20 from './abi/ERC20.json'
import veCurveVault from './abi/veCurveVault.json'
import SaddleVotingEscrow from './abi/SaddleVotingEscrow.json'
import CurveVesting from './abi/CurveVesting.json'
import StrategyProxy from './abi/StrategyProxy.json'
import CurveBackzapper from './abi/CurveBackzapper.json'
import y3CrvZapper from './abi/y3CrvZapper.json'
import CurveRegistry from './abi/CurveRegistry.json'
import CurveMinter from './abi/CurveMinter.json'
import CurveRewardDistribution from './abi/CurveRewardDistribution.json'
import SaddleSwap from './abi/SaddleSwap.json'
import SaddleSLPVoter from './abi/SaddleSLPVoter.json'

import Web3 from 'web3'
let web3 = new Web3(Web3.givenProvider);

const options = {
  web3: {
    block: false,
  },
  syncAlways: true,
  contracts: [
    {
      contractName: 'veCurveVault',
      web3Contract: new web3.eth.Contract(veCurveVault, "0xc5bDdf9843308380375a611c18B50Fb9341f502A") //TODO change
    },
    {
      contractName: 'SDL',
      web3Contract: new web3.eth.Contract(ERC20, "0xf1Dc500FdE233A4055e25e5BbF516372BC4F6871")
    },
    {
      contractName: 'SLP',
      web3Contract: new web3.eth.Contract(ERC20, "0x0C6F06b32E6Ae0C110861b8607e67dA594781961") 
    },
    {
      contractName: 'SaddleSLP',
      web3Contract: new web3.eth.Contract(SaddleSwap, "0x13Cc34Aa8037f722405285AD2C82FE570bfa2bdc")
    },
    {
      contractName: 'SaddleVotingEscrow',
      web3Contract: new web3.eth.Contract(SaddleVotingEscrow, "0xD2751CdBED54B87777E805be36670D7aeAe73bb2")
    },
    {
      contractName: 'CurveVesting',
      web3Contract: new web3.eth.Contract(CurveVesting, "0x575CCD8e2D300e2377B43478339E364000318E2c") //TODO remove
    },
    {
      contractName: 'StrategyProxy',
      web3Contract: new web3.eth.Contract(StrategyProxy, "0x7A1848e7847F3f5FfB4d8e63BdB9569db535A4f0") //TODO change
    },
    {
      contractName: 'SaddleSLPVoter',
      web3Contract: new web3.eth.Contract(SaddleSLPVoter, "0xF147b8125d2ef93FB6965Db97D6746952a133934")
    },
    {
      contractName: 'CurveBackzapper',
      web3Contract: new web3.eth.Contract(CurveBackzapper, "0x5249dD8DB02EeFB08600C4A70110B0f6B9CDA3cA") //TODO remove
    },
    {
      contractName: 'y3CrvZapper',
      web3Contract: new web3.eth.Contract(y3CrvZapper, "0x5B8F5efD2524a0D2DC9d64CE8F53c82cB5656407") //TODO remove
    },
    {
      contractName: 'CurveRegistry',
      web3Contract: new web3.eth.Contract(CurveRegistry, "0x99Cb6c36816dE2131eF2626bb5dEF7E5cc8b9B14") 
    },
    {
      contractName: 'CurveMinter',
      web3Contract: new web3.eth.Contract(CurveMinter, "0x358fE82370a1B9aDaE2E3ad69D6cF9e503c96018")
    },
    {
      contractName: 'CurveRewardDistribution',
      web3Contract: new web3.eth.Contract(CurveRewardDistribution, "0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc")
    },
  ],
  events: {
  },
  polls: {
    accounts: 15000
  }
}

export default options
