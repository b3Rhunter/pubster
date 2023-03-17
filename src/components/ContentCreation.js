import React, { useContext, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import EtherContext from '../EtherContext';
import { ethers } from 'ethers';
import contentPlatformAbi from '../abi.json';

const ContentCreation = ({ setCreate }) => {
  const [creating, setCreating] = useState(false);
  const [contentType, setContentType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createContent = async () => {
    setCreating(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner()
      const contractAddress = '0xa3f39e95104b463f5fb7c8d76cd23f00C6260812';
      const contentPlatformContract = new ethers.Contract(contractAddress, contentPlatformAbi, signer);
      const tx = await contentPlatformContract.createContent(contentType, title, description);
      await tx.wait();
      alert('Content created successfully!');
    } catch (error) {
      console.error('Error while creating content:', error);
      alert('Error while creating content. Check the console for more details.');
    }

    setCreating(false);
  };

  function closeCreate() {
    setCreate(false)
  }

  return (
    <Card className="mt-4 create">
      <button onClick={closeCreate} className='closeCreate'>X</button>
      <Card.Header>
        <h4>Create Content</h4>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group controlId="contentType">
            <Form.Label>Content Type</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter content type"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Button style={{marginTop: "14px"}} variant="primary" onClick={createContent} disabled={creating}>
            {creating ? 'Creating...' : 'Create'}
          </Button>
          
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ContentCreation;
