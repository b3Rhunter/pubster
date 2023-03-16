import React, { useContext, useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import EtherContext from '../EtherContext';
import ContentDetails from './ContentDetails';

const ContentListing = () => {
  const { signer, contentPlatformContract } = useContext(EtherContext);
  const [contentList, setContentList] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [contentCount, setContentCount] = useState(null);

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
      } catch (error) {
        console.error('Error while fetching content list:', error);
      }
    };

    fetchContentList();
  }, [contentPlatformContract]);

  const handleRowClick = (contentId) => {
    setSelectedContentId(contentId);
  };

  return (
    <div>
    <Card className="mt-4 listing">
      <Card.Header>
        <h4>Content List</h4>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Title</th>
              <th>Description</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {contentList.map((content, index) => (
              <tr key={index} onClick={() => handleRowClick(index)}>
                <td>{index}</td>
                <td>{content.contentType}</td> {/* Updated */}
                <td>{content.title}</td> {/* Updated */}
                <td>{content.description}</td> {/* Updated */}
                <td>{content.title + " replace me"}</td> {/* Updated */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
    {selectedContentId !== null && <ContentDetails contentId={selectedContentId} />}
    </div>
  );
};

export default ContentListing;
