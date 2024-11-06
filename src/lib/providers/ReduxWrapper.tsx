'use client';

import { store } from '@/lib/store/store';
import { FC, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

const ReduxWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxWrapper;
