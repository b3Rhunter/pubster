import React, { useContext, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import EtherContext from '../EtherContext';

const UserRegistration = () => {
  const { signer, contentPlatformContract } = useContext(EtherContext);
  const [registering, setRegistering] = useState(false);

  const registerUser = async () => {
    setRegistering(true);

    try {
      const tx = await contentPlatformContract.registerUser();
      await tx.wait();
      alert('User registered successfully!');
    } catch (error) {
      console.error('Error while registering user:', error);
      alert('Error while registering user. Check the console for more details.');
    }

    setRegistering(false);
  };

  return (
    <Card className="mt-4 register">
      <Card.Header>
        <h4>User Registration</h4>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group>
            <Button
              variant="primary"
              onClick={registerUser}
              disabled={registering}
            >
              {registering ? 'Registering...' : 'Register'}
            </Button>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UserRegistration;
