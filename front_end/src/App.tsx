import React from 'react';

import {DAppProvider, ChainId} from "@usedapp/core"
import {Header} from "./components/Header"
import Container from "@mui/material/Container"

function App() {
  return (
    <DAppProvider config={{
      supportedChains: [ChainId.Kovan, ChainId.Rinkeby]
    }}>
      <Header/>
      <Container maxWidth="md">

        <div>
          Hi!
        </div>
      </Container>
    </DAppProvider>
  );
}

export default App;
