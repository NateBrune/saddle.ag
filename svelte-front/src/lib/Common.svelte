<script lang="ts" context="module">

//export const ssr = false;
import { NETWORKS } from '$lib/config';
import { accountProvider, walletAddress } from '$lib/stores/provider';
import { BigNumber, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { get } from 'svelte/store'

const erc20Abi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    // Get the account balance
    "function balanceOf(address) view returns (uint)",
    // Send some of your tokens to someone else
    "function transfer(address to, uint amount)",
    // Approve someone to spend your coins
    "function approve(address to, uint amount)",
    // An event triggered whenever anyone transfers to someone else
    "event Transfer(address indexed from, address indexed to, uint amount)"
  ];
const vaultAbi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",

    // Get the account balance
    "function balanceOf(address) view returns (uint)",
    // Deposit funds into vault
    "function deposit(uint _amount)",
    // Deposit all funds
    "function depositAll()",
    // Deposit funds into vault
    "function withdraw(uint _amount)",
    // Deposit all funds
    "function withdrawAll()",
    
    // Claim SLP rewards
    "function claim()"
];

export const approveVault = (vault) => new Promise((resolve, reject) => {
    const provider = new ethers.providers.Web3Provider(get(accountProvider))
    const signer = provider.getSigner(get(walletAddress))
    const contract = new ethers.Contract(NETWORKS[0].sdlAddress, erc20Abi, provider);
    const contractWithSigner = contract.connect(signer);
    const max = ethers.constants.MaxUint256
    contractWithSigner.approve(vault, max).then(function(result) {
        console.log(`transaction submitted`)
        console.log(result)
        resolve(true)
    })
})

export const vaultDeposit = (vault, amount) => new Promise((resolve, reject) => {
    const provider = new ethers.providers.Web3Provider(get(accountProvider))
    const signer = provider.getSigner(get(walletAddress))
    const contract = new ethers.Contract(vault, vaultAbi, provider);
    const contractWithSigner = contract.connect(signer);
    contractWithSigner.deposit(amount).then(function(result) {
    //    alert(`transaction submitted: ${tx}`)
        console.log(result)
    })
})

export const vaultWithdraw = (vault, amount) => new Promise((resolve, reject) => {
    const provider = new ethers.providers.Web3Provider(get(accountProvider))
    const signer = provider.getSigner(get(walletAddress))
    const contract = new ethers.Contract(vault, vaultAbi, provider);
    const contractWithSigner = contract.connect(signer);
    contractWithSigner.withdraw(amount).then(function(result) {
    //    alert(`transaction submitted: ${tx}`)
        console.log(result)
    })
})

export const depositAllinVault = () => new Promise((resolve, reject) => {
    const provider = new ethers.providers.Web3Provider(get(accountProvider))
    const signer = provider.getSigner(get(walletAddress))
    const contract = new ethers.Contract(NETWORKS[0].vault, vaultAbi, provider);
    const contractWithSigner = contract.connect(signer);
    contractWithSigner.depositAll().then(function(result) {
    //    alert(`transaction submitted: ${tx}`)
        console.log(result)
    })
})
export const claimRewards = () => new Promise((resolve, reject) => {
    const provider = new ethers.providers.Web3Provider(get(accountProvider))
    const signer = provider.getSigner(get(walletAddress))
    const contract = new ethers.Contract(NETWORKS[0].vault, vaultAbi, provider);
    const contractWithSigner = contract.connect(signer);
    contractWithSigner.claim().then(function(result) {
    //    alert(`transaction submitted: ${tx}`)
        console.log(result)
    })
})

export const ezFormatEth = (_number, _decimals ) => {
    let dec = 10 ** _decimals
    return Math.round(parseInt(formatEther(_number.mul(dec)))) / dec
}
</script>

