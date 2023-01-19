import { createAction } from '@reduxjs/toolkit';
import { GameStoreState } from './reducer';

export const setGameStoreState = createAction<GameStoreState>('game/setGameStoreState');

export const clearGameStoreState = createAction('game/clearGameStoreState');
