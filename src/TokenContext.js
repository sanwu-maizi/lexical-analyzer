// TokenContext.js
import React from 'react';

const TokenContext = React.createContext({
  tokens: [],
  setTokens: () => {},
  lexErrors: [],
  setLexErrors: () => {},
});

export default TokenContext;
