import React, { useContext, useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import EtherContext from '../EtherContext';
import ContentDetails from './ContentDetails';
import ContentVoting from './ContentVoting';
import ContentCreation from './ContentCreation';

import { ethers } from 'ethers';

const ContentListing = () => {
  const { signer, contentPlatformContract } = useContext(EtherContext);
  const [contentList, setContentList] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [contentCount, setContentCount] = useState(null);
  const [creators, setCreators] = useState([]);
  const [create, setCreate] = useState(false);


      const fetchContentList = async () => {
      if (!contentPlatformContract) return;
      try {
        const contentCount = await contentPlatformContract.getContentCount();
        console.log(ethers.utils.formatUnits(contentCount, 0))
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

  useEffect(() => {
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

  useEffect(() => {
    if (!contentPlatformContract) return;

    const onContentCreated = async (contentId) => {
      const contentData = await contentPlatformContract.getContent(contentId.toNumber());
      setContentList((prevContentList) => [...prevContentList, contentData]);
      const ensProvider = new ethers.providers.InfuraProvider('mainnet');
      const address = contentData.creator;
      const displayAddress = address?.substr(0, 6) + "...";
      const ens = await ensProvider.lookupAddress(address);
      const creator = ens !== null ? ens : displayAddress;
      setCreators((prevCreators) => [...prevCreators, creator]);
    };

    const listener = contentPlatformContract.on("ContentCreated", onContentCreated);

    return () => {
      contentPlatformContract.off("ContentCreated", listener);
    };
  }, [contentPlatformContract]);

  return (
    <><div className='content'>
      <div className="twitter-container">
      {contentList.slice().reverse().map((content, index) => {

          const contentIndex = contentList.length - index - 1;
          return (
          <div key={index} className="twitter-card">
            <div className="card-header">
              <div className="index">{creators.slice().reverse()[index]}</div>
            </div>
            <div className="card-body">
              <div className="title">{content.title}</div>
              <div className="description">{content.description}</div>
              <ContentVoting contentIndex={contentIndex} />
            </div>
            <div className="card-footer">
              <div className="upvotes">
                {content.upvotes ? 
                  ethers.utils.formatUnits(content.upvotes - content.downvotes, 0) : '0'}</div>
            </div>

          </div>
          );
        })}
      </div>

    </div>
</>
  );
};

export default ContentListing;
