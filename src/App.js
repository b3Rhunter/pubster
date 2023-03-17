import React, { useContext, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import EtherContext from './EtherContext';
import { Container } from 'react-bootstrap';
import UserRegistration from './components/UserRegistration';
import ContentCreation from './components/ContentCreation';
import ContentListing from './components/ContentListing';
import UserProfile from './components/UserProfile';
import { ethers } from 'ethers';
import tokenAbi from './tokenABI.json';
import contentPlatformAbi from './abi.json';
import logo from './imgs/baseLogo.png';
import { CSSTransition } from 'react-transition-group';
import './transitions.css';

function App() {

  const [signer, setSigner] = useState(null);
  const [contentPlatformContract, setContentPlatformContract] = useState(null);
  const [account, setAccount] = useState(null)
  const [address, setAddress] = useState(null)

  const [create, setCreate] = useState(false)
  const [user, setUser] = useState(false)

  const [connected, setConnected] = useState(false)
  const [name, setName] = useState("")

  const [balance, setBalance] = useState("")

  const [closing, setClosing] = useState(false);
  const [userClosing, setUserClosing] = useState(false);



  const connect = async () => {
    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
      const account = await web3Provider.send("eth_requestAccounts", []);
      setAccount(account)
      const signer = web3Provider.getSigner();
      setSigner(signer)
      const chain = await signer.getChainId()
      if (chain !== 84531) {
        alert("Please switch to Base Goerli chain...")
      }
      const address = signer.getAddress();
      setAddress(address)
      const contractAddress = '0xa3f39e95104b463f5fb7c8d76cd23f00C6260812';
      const tokenAddress = '0x02E1EA569CCfCE9C20BE85BB8697939ff1873A10'
      const contentPlatformContract = new ethers.Contract(contractAddress, contentPlatformAbi, signer);
      const user = await contentPlatformContract.users(address)
      const registered = user.registered
      console.log(registered)
      if (registered === false) {
        alert("Please Register...")
      }
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer)
      const getBalance = await tokenContract.balanceOf(address)
      const parseBalance = ethers.utils.formatEther(getBalance)
      setBalance(parseBalance)
      setContentPlatformContract(contentPlatformContract)
      const { ethereum } = window;
      if(ethereum) {
        const ensProvider = new ethers.providers.InfuraProvider('mainnet');
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        const displayAddress = address?.substr(0, 6) + "...";
        const ens = await ensProvider.lookupAddress(address);
        if (ens !== null) {
          setName(ens)
        } else {
          setName(displayAddress)
        }
      }
      setConnected(true)
    } catch (error) {
      console.log(error.message)
    }

  }


  function startCreate() {
    setCreate(true)
  }

  function openUser() {
    setUser(true)
  }

  function disconnect() {
    setConnected(false)
  }

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setCreate(false);
    }, 300);
  };

  const handleUserClose = () => {
    setUserClosing(true);
    setTimeout(() => {
      setUserClosing(false);
      setUser(false);
    }, 300);
  };

  return (
    <EtherContext.Provider value={{ signer, account, address, contentPlatformContract }}>
      <button className='createBtn' onClick={startCreate}><p>+</p></button>
      <button className='userBtn' onClick={openUser}><p>P</p></button>
      <p className='rewards'>reward tokens: {balance}</p>
    <Container>
      <div className='logoContainer'>
      <img className='logo' src={logo} alt="logo"/>
      </div>
      <button 
        className='connectBtn'
        variant="primary" 
        onClick={() => (connected ? disconnect() : connect())}>
        {!connected && (
          <p>connect</p>
        )} 
        {connected && (
          <p>{name}</p>
        )}
      </button>

      {create && (
        <>
        <CSSTransition
        in={create}
        timeout={300}
        classNames="fade"
        unmountOnExit
        >
          <ContentCreation setCreate={handleClose} closing={closing} />
        </CSSTransition>
        </>
      )}
      <UserRegistration />

      {user && (

<CSSTransition
in={user}
timeout={300}
classNames="fade"
unmountOnExit
>
        <UserProfile setUser={handleUserClose} closing={userClosing} />
        </CSSTransition>
      )}
      
      <ContentListing />


      
      {/* Add more components here */}
    </Container>
    </EtherContext.Provider>
  );
}

export default App;

