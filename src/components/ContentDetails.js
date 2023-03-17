import React, { useContext, useEffect, useState } from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import EtherContext from '../EtherContext';
import { ethers } from 'ethers';

const ContentDetails = ({ content }) => {
  const { signer, contentPlatformContract } = useContext(EtherContext);

  const [creator, setCreator] = useState("")
  const [ name, setName] = useState("")
  const [ getContent, setContent] = useState("")

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        const contentData = await contentPlatformContract.getContent(content);
        setContent(contentData);
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
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
        
      } catch (error) {
        console.error('Error while fetching content details:', error);
      }
    };

    fetchContentDetails();
  }, [contentPlatformContract, content]);

  if (!content) {
    return <p>Connect to show posts...</p>;
  }



  return (
      <div className='twitter-container'>
        <div className="twitter-card">
          <div className='card-header'>
            <p className='description'>{content.creator}</p>
          </div>
          <div className='card-body'>
          <p className='title'>{content.title}</p>
            <p className='description'>
            {content.description}
            </p>
          </div>
          <div>Score: {content.upvotes ? ethers.utils.formatEther(content.upvotes) : '0'}</div>
        </div>
        </div>
  );
};

export default ContentDetails;
