export type Network = {
  chainId: number,
  rpcUrl: string,
  chainName: String,
  nativeCurrency: { name: string, symbol: string, decimals: number },
  sdlAddress: string,
  vault: string,
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
