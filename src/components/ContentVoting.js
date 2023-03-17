import React, { useContext, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import EtherContext from '../EtherContext';
import { ethers } from 'ethers'

const ContentVoting = ({ contentIndex }) => {
  const { signer, contentPlatformContract } = useContext(EtherContext);
  const [upvote, setUpvote] = useState(true);
  const [voting, setVoting] = useState(false);
  const [downvoting, setDownvoting] = useState(false);

  const voteContent = async () => {
    setVoting(true);
  
    try {
      console.log(contentIndex)
      const tx = await contentPlatformContract.voteContent(contentIndex, upvote);
      await tx.wait();
      alert('Voted successfully!');
    } catch (error) {
      console.error('Error while voting:', error);
      alert('Error while voting. Check the console for more details.');
    }
  
    setVoting(false);
  };
  
  const downVote = async () => {
    setDownvoting(true);
    setUpvote(false);
  
    try {
      const tx = await contentPlatformContract.voteContent(contentIndex, upvote);
      await tx.wait();
      alert('Voted successfully!');
    } catch (error) {
      console.error('Error while voting:', error);
      alert('Error while voting. Check the console for more details.');
    }
  
    setDownvoting(false);
  };
  

  
  return (

    <div className='voteBtns'>
      <button style={{ marginTop: '14px' }} variant="primary" onClick={voteContent} disabled={voting || contentIndex === null}>
        <p className='voteText'>{voting ? '...' : '👍'}</p>
      </button>
      <button style={{ marginTop: '14px', marginLeft: "14px" }} variant="primary" onClick={downVote} disabled={downvoting || contentIndex === null}>
        <p className='voteText'>{downvoting ? '...' : '👎'}</p>
      </button>
      </div>
  );
};



export default ContentVoting;
