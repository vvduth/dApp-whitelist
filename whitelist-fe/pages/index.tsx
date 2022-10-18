import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract, Signer } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../contants/constant";
import pukedukelogo from '../assets/pukedukelogo.png'

import Head from "next/head";
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

  // the number of whitelisted addre
  // TODO: implement to get number of  address in the whitlisy

  // manage number of whitelist
  const getNumberOfWhiteList = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _numberOfWhiteListed =
        await whiteListContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhiteListed);
    } catch (e) {
      console.error(e);
    }
  };

  // add address to white list
  const addAddresstoWhiteList = async () => {
    try {
      // we need signer since this is a write function
      const signer = await getProviderOrSigner(true);

      // create a new instance of the contract with a signer, which allows
      // uodate method
      const whiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // the method from teh contract
      const tx = await whiteListContract.addAddressToWhiteList();
      setIsLoading(true);
      // wait for the transaction to get mined
      await tx.await();
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const checkIfAddressInWhiteList = async () => {
    try {
      const signer = (await getProviderOrSigner(true)) as Signer;
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      // use signer although this is read function cuz sign can use for read as well
      // get the address
      const address = await signer.getAddress();
      // call the whitelistedAddresses from the contract
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhiteLisr(_joinedWhitelist);
    } catch (e) {
      console.error(e);
    }
  };
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressInWhiteList();
      getNumberOfWhiteList();
    } catch (e) {
      console.error(e);
    }
  };
  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhiteList) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddresstoWhiteList} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    // Assign the Web3Modal class to the reference object by setting it's `current` value
    // The `current` value is persisted throughout as long as this page is open
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
    connectWallet();
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to PukeDuke!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfwhiteListed} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src={`https://source.unsplash.com/1600x900/?$web3`} />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Duc Thai - inspired by web 3 Dao
      </footer>
    </div>
  );
};

export default Home;
