import React, { useContext, useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import EtherContext from '../EtherContext';
import ContentDetails from './ContentDetails';
import ContentVoting from './ContentVoting';
import { ethers } from 'ethers';

const ContentListing = () => {
  const { signer, contentPlatformContract } = useContext(EtherContext);
  const [contentList, setContentList] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [contentCount, setContentCount] = useState(null);
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    const fetchContentList = async () => {
      if (!contentPlatformContract) return;
      try {
        const contentCount = await contentPlatformContract.getContentCount();
        const contentPromises = [];

        for (let i = 0; i < contentCount; i++) {
          contentPromises.push(contentPlatformContract.getContent(i));
        }

        const contentData = await Promise.all(contentPromises);
        console.log(contentData)
        setContentList(contentData);
        fetchCreators(contentData);
      } catch (error) {
        console.error('Error while fetching content list:', error);
      }
    };

    fetchContentList();
  }, [contentPlatformContract]);


  const fetchCreators = async (contentData) => {
    if (!contentPlatformContract) return;
    const ensProvider = new ethers.providers.InfuraProvider("mainnet");
    
    const creatorsPromises = contentData.map(async (content) => {
      const address = content.creator;
      const displayAddress = address?.substr(0, 6) + "...";
      const ens = await ensProvider.lookupAddress(address);
      return ens !== null ? ens : displayAddress;
    });
    
    const creatorsData = await Promise.all(creatorsPromises);
    setCreators(creatorsData);
  };
  


  const handleRowClick = (contentId) => {
    setSelectedContentId(contentId);
  };

  function closeDetails() {
    setSelectedContentId(null)
  }

  return (
    <><div className='content'>
      <div className="twitter-container">
        {contentList.slice().reverse().map((content, index) => (
          <div key={index} onClick={() => handleRowClick(index)} className="twitter-card">
            <div className="card-header">
              <div className="index">{creators.slice().reverse()[index]}</div>
            </div>
            <div className="card-body">
              <div className="title">{content.title}</div>
              <div className="description">{content.description}</div>
              <ContentVoting selectedContentId={selectedContentId} />
            </div>
            <div className="card-footer">
              <div className="upvotes">{ethers.utils.formatEther(content.upvotes)}</div>
            </div>

          </div>
        ))}
      </div>

    </div>
    <div className='contentDetails'>
        {selectedContentId !== null &&
          <div onClick={closeDetails} className='details'>
            <ContentDetails creators={creators} contentId={selectedContentId} />
          </div>}
      </div></>
  );
};

export default ContentListing;
