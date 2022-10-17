import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../contants/constant";
const Home: NextPage = () => {
  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  // check if the current mate mask account join the whote list yet or not
  const [joinedWhiteList, setJoinedWhiteLisr] = useState<boolean>(false);

  const [loading, setIsLoading] = useState<boolean>(false);

  // track the number of address in the list

  const [numberOfwhiteListed, setNumberOfWhitelisted] = useState<number>(0);
  const web3ModalRef = useRef() as any;

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner: any = false) => {
    // connect to metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // if user is not connect to the goerli network , let them knwo and then throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Please change network to goerli.");
      throw new Error("change network to goerli");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  // add address to white list
  const addAddresstoWhiteList = async () => {
    try {
      // we need signer since this is a write function
      const signer = await getProviderOrSigner(true) ; 

      // create a new instance of the contract with a signer, which allows 
      // uodate method
      const whiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS, 
        abi, 
        signer 
      ); 
      // the method from teh contract
      const tx = await whiteListContract.addAddressToWhiteList() ; 
      setIsLoading(true) ; 
      await tx.await() ; 

    } catch(e) {

    }
  }

  return <div>hello</div>;
};

export default Home;
