import { createReducer } from '@reduxjs/toolkit';
import { clearRoomState, updateRoomState } from './actions';

type RoomStoreState = {
  hasGameStarted: boolean;
  members: string[];
};

const initialState: RoomStoreState = { hasGameStarted: false, members: [] };

export default createReducer(initialState as RoomStoreState, (builder) =>
  builder
    .addCase(updateRoomState, (state, { payload }) => {
      const { roomState } = payload;
      state.members = roomState.members;
      state.hasGameStarted = roomState.hasGameStarted;
    })
    .addCase(clearRoomState, (state) => {
      state = initialState;
    }),
);
