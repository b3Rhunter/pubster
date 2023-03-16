import React, { useContext, useEffect, useState } from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import EtherContext from '../EtherContext';


const ContentDetails = ({ contentId }) => {
  const { signer, contentPlatformContract } = useContext(EtherContext);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        const contentData = await contentPlatformContract.getContent(contentId);
        setContent(contentData);
      } catch (error) {
        console.error('Error while fetching content details:', error);
      }
    };

    fetchContentDetails();
  }, [contentPlatformContract, contentId]);

  if (!content) {
    return <p>Loading content details...</p>;
  }

  return (
    <Card className="mt-4 details">
      <Card.Header>
        <h4>Content Details</h4>
      </Card.Header>
      <Card.Body>
        <Card.Title>{content.title}</Card.Title>
        <Card.Text>{content.description}</Card.Text>
        <ListGroup className="list-group-flush">
          <ListGroupItem>ID: {contentId}</ListGroupItem>
          <ListGroupItem>Type: {content.contentType}</ListGroupItem>
          <ListGroupItem>Creator: {content.creator}</ListGroupItem>
          <ListGroupItem>Score: {content.score}</ListGroupItem>
          {/* Add more content details here */}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default ContentDetails;
