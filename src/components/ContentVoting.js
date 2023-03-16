import React, { useContext, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import EtherContext from '../EtherContext';

const ContentVoting = () => {
  const { signer, contentPlatformContract } = useContext(EtherContext);
  const [contentId, setContentId] = useState('');
  const [upvote, setUpvote] = useState(true);
  const [voting, setVoting] = useState(false);

  const voteContent = async () => {
    setVoting(true);

    try {
      const tx = await contentPlatformContract.voteContent(contentId, upvote);
      await tx.wait();
      alert('Voted successfully!');
    } catch (error) {
      console.error('Error while voting:', error);
      alert('Error while voting. Check the console for more details.');
    }

    setVoting(false);
  };

  return (
    <Card className="mt-4 voting">
      <Card.Header>
        <h4>Vote on Content</h4>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group controlId="contentId">
            <Form.Label>Content ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter content ID"
              value={contentId}
              onChange={(e) => setContentId(e.target.value)}
            />
          </Form.Group>
          <Form.Check
            type="switch"
            id="upvote-switch"
            label="Upvote"
            checked={upvote}
            onChange={(e) => setUpvote(e.target.checked)}
          />
          <Button style={{marginTop: "14px"}} variant="primary" onClick={voteContent} disabled={voting}>
            {voting ? 'Voting...' : 'Vote'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ContentVoting;
