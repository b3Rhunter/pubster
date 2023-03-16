import { createContext } from 'react';

const EtherContext = createContext({
  account: null,  
  signer: null,
  address: null,
  contentPlatformContract: null,
  contentPlatformContractReadOnly: null,
});

export default EtherContext;
