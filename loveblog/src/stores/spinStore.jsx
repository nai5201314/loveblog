import { createContext, useContext, useState } from 'react';
const SpinCtx = createContext({
  spinning: false,
  setSpinning: () => {},
});
export const SpinProvider = ({ children }) => {
  const [spinning, setSpinning] = useState(false);
  return (
    <SpinCtx.Provider value={{ spinning, setSpinning }}>
      {children}
    </SpinCtx.Provider>
  );
};
export const useGlobalSpin = () => useContext(SpinCtx);