import React, { useContext, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import EtherContext from './EtherContext';
import { Container } from 'react-bootstrap';
import UserRegistration from './components/UserRegistration';
import ContentCreation from './components/ContentCreation';
import ContentVoting from './components/ContentVoting';
import ContentListing from './components/ContentListing';
import UserProfile from './components/UserProfile';
import { ethers } from 'ethers';
import contentPlatformAbi from './abi.json';

function App() {

  const [signer, setSigner] = useState(null);
  const [contentPlatformContract, setContentPlatformContract] = useState(null);
  const [account, setAccount] = useState(null)
  const [address, setAddress] = useState(null)

  const connect = async () => {
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
  }

  return (
    <EtherContext.Provider value={{ signer, account, address, contentPlatformContract }}>
    <Container>
      <h1 className="text-center mt-5">PUBSTER</h1>
      <Button style={{position: "fixed", top: "14px", right: "14px", zIndex: "10px"}} variant="primary" onClick={connect}>
        Connect 
      </Button>
      <UserRegistration />
      <ContentCreation />
      <ContentVoting />
      <ContentListing />
      <UserProfile />
      {/* Add more components here */}
    </Container>
    </EtherContext.Provider>
  );
}

export default App;

