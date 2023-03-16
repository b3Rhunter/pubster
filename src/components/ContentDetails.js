import React, { useContext, useEffect, useState } from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import EtherContext from '../EtherContext';
import { ethers } from 'ethers';

const ContentDetails = ({ contentId }) => {
  const { signer, contentPlatformContract } = useContext(EtherContext);
  const [content, setContent] = useState(null);
  const [creator, setCreator] = useState("")
  const [name, setName] = useState("")

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        const contentData = await contentPlatformContract.getContent(contentId);
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
  }, [contentPlatformContract, contentId]);

  if (!content) {
    return <p>Connect to show posts...</p>;
  }



  return (
      <div className='twitter-container'>
        <div className="twitter-card">
          <div className='card-header'>
            <p className='description'>{name}</p>
          </div>
          <div className='card-body'>
          <p className='title'>{content.title}</p>
            <p className='description'>
            {content.description}
            </p>
          </div>
          <div>Score: {ethers.utils.formatEther(content.upvotes)}</div>
        </div>
        </div>
  );
};

export default ContentDetails;
