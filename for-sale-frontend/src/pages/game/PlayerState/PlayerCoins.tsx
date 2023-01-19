import React, { useState } from 'react';
import styled from 'styled-components';
import { markDbError } from '../../../api/game/api';
import { useGameAPI } from '../../../api/game/hooks';
import { ErrorSpan } from '../../../components/common/Span';
import { GamePhase } from '../../../models/game';
import {
  useGamePhase,
  useHand,
  usePlayerData,
} from '../../../store/game/hooks';
import { getErrorMessage } from '../../../utils/error';

const PlayerCoinsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;

  grid-area: coins;
`;

export function PlayerCoins() {
  const player = usePlayerData();
  const hand = useHand();
  const gamePhase = useGamePhase();
  const gameApi = useGameAPI();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const [bidInput, setBidInput] = useState<number | null>();

  if (!player || !hand) return null;

  const { isCurrentTurn } = player;
  const { coins } = hand;

  function handleBid(event: React.FormEvent) {
    event.preventDefault();
    if (!gameApi || !bidInput) return;

    (async function () {
      setIsLoading(true);
      console.log('Bid coins');
      try {
        await gameApi.bidCoins(bidInput);
        await gameApi.updateGameState();
      } catch (e) {
        setError(getErrorMessage(e));
        markDbError(getErrorMessage(e));
      } finally {
        setIsLoading(false);
      }
    })();
  }

  function handlePass() {
    if (!gameApi) return;
    (async function () {
      setIsLoading(true);
      console.log('Pass');

      try {
        await gameApi.pass();
        await gameApi.updateGameState();
      } catch (e) {
        setError(getErrorMessage(e));
      } finally {
        setIsLoading(false);
      }
    })();
  }

  return (
    <PlayerCoinsWrapper>
      <div>Hand: {coins} Coins</div>
      {!!player.bid && <div>Bid: {player.bid}</div>}

      {isCurrentTurn && gamePhase === GamePhase.BID_COINS && (
        <>
          <h2>Your turn</h2>
          <form onSubmit={handleBid}>
            <input
              type='number'
              value={bidInput ? bidInput.toString() : ''}
              onChange={(e) => setBidInput(Number(e.target.value))}
            />
            <button
              type='submit'
              onClick={handleBid}
              disabled={!bidInput || isLoading}
            >
              Bid
            </button>
            <button type='button' onClick={handlePass} disabled={isLoading}>
              Pass
            </button>
          </form>
          {error && <ErrorSpan>{error}</ErrorSpan>}
        </>
      )}
    </PlayerCoinsWrapper>
  );
}
