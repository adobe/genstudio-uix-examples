import React from 'react';
import { Flex, ProgressCircle } from '@adobe/react-spectrum';

interface SpinnerProps {
  message?: string;
}

const Spinner = ({ message = 'Loading...' }: SpinnerProps): React.JSX.Element => {
  return (
    <Flex alignItems="center" justifyContent="center" height="100vh">
      <ProgressCircle aria-label={message} isIndeterminate />
    </Flex>
  );
};

export default Spinner; 