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
          <div className='register'>
            <button
              className='registerBtn'
              variant="primary"
              onClick={registerUser}
              disabled={registering}
            >
              <p>{registering ? 'registering...' : 'register'}</p>
            </button>
            </div>

  );
};

export default UserRegistration;
