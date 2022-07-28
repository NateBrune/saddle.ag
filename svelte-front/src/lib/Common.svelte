<script context="module">

//export const ssr = false;
import { NETWORKS } from '$lib/config';
import { accountProvider, walletAddress } from '$lib/stores/provider';
import { ethers } from 'ethers';
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
];

export const approveVault = () => new Promise((resolve, reject) => {
    const provider = new ethers.providers.Web3Provider(get(accountProvider))
    const signer = provider.getSigner(get(walletAddress))
    const contract = new ethers.Contract(NETWORKS[0].sdlAddress, erc20Abi, provider);
    const contractWithSigner = contract.connect(signer);
    const max = ethers.constants.MaxUint256
    contractWithSigner.approve(NETWORKS[0].vault, max).then(function(result) {
    //    alert(`transaction submitted: ${tx}`)
        console.log(result)
    })

    //resolve(true)
})
export const depositVault = () => new Promise((resolve, reject) => {
    const provider = new ethers.providers.Web3Provider(get(accountProvider))
    const signer = provider.getSigner(get(walletAddress))
    const contract = new ethers.Contract(NETWORKS[0].vault, erc20Abi, provider);
    const contractWithSigner = contract.connect(signer);
    const max = ethers.constants.MaxUint256
    contractWithSigner.approve(NETWORKS[0].vault, max).then(function(result) {
    //    alert(`transaction submitted: ${tx}`)
        console.log(result)
    })
})

</script>


