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
import contentPlatformAbi from './abi.json';

function App() {

  const [signer, setSigner] = useState(null);
  const [contentPlatformContract, setContentPlatformContract] = useState(null);
  const [account, setAccount] = useState(null)
  const [address, setAddress] = useState(null)

  const [create, setCreate] = useState(false)
  const [user, setUser] = useState(false)

  const [connected, setConnected] = useState(false)
  const [name, setName] = useState("")

  const connect = async () => {
    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
      const account = await web3Provider.send("eth_requestAccounts", []);
      setAccount(account)
      const signer = web3Provider.getSigner();
      setSigner(signer)
      const address = signer.getAddress();
      setAddress(address)
      const contractAddress = '0xaf3b67786F945305b816498Fa8b0c53724fb3C8a';
      const contentPlatformContract = new ethers.Contract(contractAddress, contentPlatformAbi, signer);
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

  return (
    <EtherContext.Provider value={{ signer, account, address, contentPlatformContract }}>
      <button className='createBtn' onClick={startCreate}><p>+</p></button>
      <button className='userBtn' onClick={openUser}><p>P</p></button>
    <Container>
      <h1 className="text-center mt-5">PUBSTER</h1>
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
        
        <ContentCreation setCreate={setCreate}/>
        </>
      )}
      <UserRegistration />

      {user && (
        <UserProfile setUser={setUser} />
      )}
      
      <ContentListing />


      
      {/* Add more components here */}
    </Container>
    </EtherContext.Provider>
  );
}

export default App;

