import styled from 'styled-components';
import { colors } from '../../../constants/theme';
import { usePlayerData } from '../../../store/game/hooks';

const PlayerTurnInfoWrapper = styled.div<{ isCurrentTurn: boolean }>`
  grid-area: turn;

  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ isCurrentTurn }) =>
    isCurrentTurn &&
    `
    background: linear-gradient(
    0deg,
    ${colors.primary2} 0%,
    rgba(0, 0, 0, 0) 100%
  );`}
`;

const Nickname = styled.h3`
  margin: 0;
`;

export function PlayerMainInfo() {
  const player = usePlayerData();

  if (!player) return null;

  return (
    <PlayerTurnInfoWrapper isCurrentTurn={player.isCurrentTurn}>
      {player.isCurrentTurn && <div>Your turn</div>}
      <Nickname>
        {player.orderNumber}. {player.nickname}
      </Nickname>
    </PlayerTurnInfoWrapper>
  );
}
