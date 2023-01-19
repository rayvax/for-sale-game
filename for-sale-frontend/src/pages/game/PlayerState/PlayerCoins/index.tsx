import React, { useState } from 'react';
import styled from 'styled-components';
import { useGameAPI } from '../../../../api/game/hooks';
import { PrimaryButton } from '../../../../components/common/Button';
import { colors } from '../../../../constants/theme';
import { GamePhase } from '../../../../models/game';
import { useGamePhase, useHand, usePlayerData } from '../../../../store/game/hooks';
import { getErrorMessage } from '../../../../utils/error';
import { BidInput } from './BidInput';
import { toast } from 'react-toastify';

const PlayerCoinsWrapper = styled.div`
  grid-area: coins;

  min-height: 230px;
  box-sizing: border-box;

  padding: 1.5rem 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  background-color: ${colors.bg1};
  border: 5px solid ${colors.bg2};
  border-bottom: none;
  border-radius: 20px 20px 0 0;
`;

const BidForm = styled.form`
  display: flex;
  gap: 0.5rem;
`;

const CoinsInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export function PlayerCoins() {
  const player = usePlayerData();
  const hand = useHand();
  const gamePhase = useGamePhase();
  const gameApi = useGameAPI();
  const [isLoading, setIsLoading] = useState(false);

  const [bidInput, setBidInput] = useState<number | null>();

  if (!player || !hand) return null;

  const { isCurrentTurn } = player;
  const { coins } = hand;

  function handleBid(event: React.FormEvent) {
    event.preventDefault();
    if (!gameApi || !bidInput) return;

    (async function () {
      setIsLoading(true);
      try {
        await gameApi.bidCoins(bidInput);
        await gameApi.updateGameState();
      } catch (e) {
        console.error(e);
        toast.error(getErrorMessage(e));
      } finally {
        setIsLoading(false);
      }
    })();
  }

  function handlePass() {
    if (!gameApi) return;
    (async function () {
      setIsLoading(true);

      try {
        await gameApi.pass();
        await gameApi.updateGameState();
      } catch (e) {
        console.error(e);
        toast.error(getErrorMessage(e));
      } finally {
        setIsLoading(false);
      }
    })();
  }

  return (
    <PlayerCoinsWrapper>
      <CoinsInfo>
        <div>Hand: {coins} $</div>
        {gamePhase === GamePhase.BID_COINS && (
          <div>{!!player.bid ? `Bid: ${player.bid} $` : 'No bid'}</div>
        )}
      </CoinsInfo>

      {isCurrentTurn && gamePhase === GamePhase.BID_COINS && (
        <>
          <BidForm onSubmit={handleBid}>
            <BidInput
              value={bidInput ? bidInput.toString() : ''}
              onChange={(e) => setBidInput(Number(e.target.value))}
              min={1}
              max={18}
            />
            <PrimaryButton
              type='submit'
              onClick={handleBid}
              disabled={!bidInput || isLoading}
            >
              Bid
            </PrimaryButton>
          </BidForm>
          <PrimaryButton type='button' onClick={handlePass} disabled={isLoading}>
            Pass
          </PrimaryButton>
        </>
      )}
    </PlayerCoinsWrapper>
  );
}
