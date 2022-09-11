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
    vault: '0xe3779803D6CB73cd9a888D3078438AB55E0B1D24', // TODO update to vault *
    proxy: '0x882094c153D83DA48Df9660e7470a478199f1bd5', // Update to slpVoter *
    feeDistributor: '0xabd040A92d29CDC59837e79651BB2979EA66ce04', // Update to slpVoter *
    slp: '0x0C6F06b32E6Ae0C110861b8607e67dA594781961', // TODO change from 3crv to slp *
    veSDL: '0xD2751CdBED54B87777E805be36670D7aeAe73bb2', // TODO change locker to sdl*
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
