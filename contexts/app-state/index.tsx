import { useStorageState } from '@/hooks/useStorageState';
import { useContext, createContext, type PropsWithChildren, useEffect, useReducer } from 'react';
import { randomUUID } from 'expo-crypto';
import * as Application from 'expo-application';
import { appReducer, AppAction, AppState, initialState } from './reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function useAppState() {
  const value = useContext(AppStateContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useAppState must be wrapped in a <AppStateProvider />');
    }
  }

  return value;
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [[isLoadingUUID, storedUuid], setUuid] = useStorageState('uuid');
  const deviceId = Application.applicationId ?? '';

  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    deviceId,
  });

  useEffect(() => {
    if (isLoadingUUID) {
      return;
    }

    let uuid = storedUuid;
    if (!uuid) {
      uuid = randomUUID();
    }

    setUuid(uuid);
    dispatch({ type: 'SET_UUID', payload: uuid });
  }, [isLoadingUUID, storedUuid]);

  return (
    <AppStateContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
