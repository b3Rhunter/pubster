import React, { useContext, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import EtherContext from '../EtherContext';

const ContentVoting = ({ selectedContentId }) => {
  const { signer, contentPlatformContract } = useContext(EtherContext);
  const [contentId, setContentId] = useState('');
  const [upvote, setUpvote] = useState(true);
  const [voting, setVoting] = useState(false);

  const voteContent = async () => {
    setVoting(true);

    try {
      console.log(selectedContentId)
      const tx = await contentPlatformContract.voteContent(selectedContentId, upvote);
      await tx.wait();
      alert('Voted successfully!');
    } catch (error) {
      console.error('Error while voting:', error);
      alert('Error while voting. Check the console for more details.');
    }

    setVoting(false);
  };

  const downVote = async () => {
    setUpvote(false);

    try {
      console.log(selectedContentId)
      const tx = await contentPlatformContract.voteContent(selectedContentId, upvote);
      await tx.wait();
      alert('Voted successfully!');
    } catch (error) {
      console.error('Error while voting:', error);
      alert('Error while voting. Check the console for more details.');
    }

    setVoting(false);
  };

  
  return (

    <div className='voteBtns'>
      <button style={{ marginTop: '14px' }} variant="primary" onClick={voteContent} disabled={voting || selectedContentId === null}>
        <p className='voteText'>{voting ? 'Voting...' : '👍'}</p>
      </button>
      <button style={{ marginTop: '14px', marginLeft: "14px" }} variant="primary" onClick={downVote} disabled={voting || selectedContentId === null}>
        <p className='voteText'>{voting ? 'Voting...' : '👎'}</p>
      </button>
      </div>
  );
};



export default ContentVoting;
