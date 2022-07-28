export type Network = {
  chainId: number,
  rpcUrl: string,
  chainName: String,
  nativeCurrency: { name: string, symbol: string, decimals: number },
  sdlAddress: string,
  retroVesting: string,
  vault: string,
  slp: string,
  veSDL: string,
  blockExplorerUrl?: string
}

export const NETWORKS: Network[] = [
  {
    chainId: 1,
    rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/52J3V2vSvpezdbzm6a7n4_VZXzCJv6r4', // Your RPC endpoint
    chainName: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    sdlAddress: '0xf1dc500fde233a4055e25e5bbf516372bc4f6871',
    retroVesting: '0x5DCA270671935cf3dF78bd8373C22BE250198a03',
    vault: '0xc5bDdf9843308380375a611c18B50Fb9341f502A', // TODO update
    slp: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490', // TODO change from 3crv to slp
    veSDL: '0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2', // TODO change locker to sdl
    blockExplorerUrl: 'https://etherscan.com'
  },
  // {
  //   chainId: 31337,
  //   rpcUrl: 'http://localhost:8545',
  //   chainName: 'Hardhat',
  //   nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  //   multicall2Address: ''
  // }
]
