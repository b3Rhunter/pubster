import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import EtherContext from '../EtherContext';
import { CSSTransition } from 'react-transition-group';
import '../transitions.css';

const UserProfile = ({ setUser, closing, handleUserClose }) => {
  const { signer, contentPlatformContract } = useContext(EtherContext);
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [updating, setUpdating] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    return () => {
      setVisible(false);
    };
  }, []);

  useEffect(() => {
    if (!closing) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [closing]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!signer || !contentPlatformContract) return;
      
      try {
        const address = await signer.getAddress();
        const userData = await contentPlatformContract.getUserProfile(address);
        setProfile(userData);
        setDisplayName(userData.displayName);
        setBio(userData.bio);
      } catch (error) {
        console.error('Error while fetching user profile:', error);
      }
    };

    
    

    fetchProfile();
  }, [signer, contentPlatformContract]);

  const updateProfile = async () => {
    setUpdating(true);

    try {
      const tx = await contentPlatformContract.updateUserProfile(displayName, bio);
      await tx.wait();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error while updating profile:', error);
      alert('Error while updating profile. Check the console for more details.');
    }

    setUpdating(false);
  };

  if (!profile) {
    return <p>Loading user profile...</p>;
  }

  function closeUser() {
    setUser(handleUserClose)
  }





  return (
    <Card className="mt-4 profile" style={{ opacity: visible ? 1 : 0, transition: 'opacity 300ms' }}>
      <button className='closeUser' onClick={closeUser}>X</button>
      <Card.Header>
        <h4>Profile</h4>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group controlId="displayName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="bio">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Form.Group>
          <Button style={{marginTop: "14px"}} variant="primary" onClick={updateProfile} disabled={updating}>
            {updating ? 'Updating...' : 'Update Profile'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UserProfile;
