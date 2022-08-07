export type Network = {
  chainId: number,
  rpcUrl: string,
  chainName: String,
  nativeCurrency: { name: string, symbol: string, decimals: number },
  sdlAddress: string,
  retroVesting: string,
  vault: string,
  proxy: string,
  feeDistributor: string,
  slp: string,
  veSDL: string,
  blockExplorerUrl?: string,
  //vaults
  fraxBP: string
}

export const NETWORKS: Network[] = [
  {
    chainId: 1,
    rpcUrl: 'https://rpc.ankr.com/eth', // Your RPC endpoint
    //rpcUrl: 'http://localhost:8545',
    chainName: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    sdlAddress: '0xf1dc500fde233a4055e25e5bbf516372bc4f6871',
    retroVesting: '0x5DCA270671935cf3dF78bd8373C22BE250198a03',
    vault: '0xc5bDdf9843308380375a611c18B50Fb9341f502A', // TODO update to vault
    proxy: '0xF147b8125d2ef93FB6965Db97D6746952a133934', // Update to slpVoter
    feeDistributor: '0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc', // Update to slpVoter
    slp: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490', // TODO change from 3crv to slp
    veSDL: '0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2', // TODO change locker to sdl
    blockExplorerUrl: 'https://etherscan.com',

    // vaults
    fraxBP: '0x5a770DbD3Ee6bAF2802D29a901Ef11501C44797A' // TODO change to fraxBP vault
  },
  // {
  //   chainId: 31337,
  //   rpcUrl: 'http://localhost:8545',
  //   chainName: 'Hardhat',
  //   nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  //   multicall2Address: ''
  // }
]
