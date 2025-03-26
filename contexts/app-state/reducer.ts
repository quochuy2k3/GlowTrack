export type AppState = {
  uuid: string;
  deviceId: string;
};

export type AppAction =
  | { type: 'SET_UUID'; payload: string }
  | { type: 'SET_DEVICE_ID'; payload: string };

export const initialState: AppState = {
  uuid: '',
  deviceId: '',
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_UUID':
      return {
        ...state,
        uuid: action.payload,
      };
    case 'SET_DEVICE_ID':
      return {
        ...state,
        deviceId: action.payload,
      };
    default:
      return state;
  }
}
