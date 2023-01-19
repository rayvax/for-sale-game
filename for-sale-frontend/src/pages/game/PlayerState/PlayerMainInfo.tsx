import styled from 'styled-components';
import { colors } from '../../../constants/theme';
import { usePlayerData, useTurnEndsIn } from '../../../store/game/hooks';

const PlayerTurnInfoWrapper = styled.div<{ isCurrentTurn: boolean }>`
  grid-area: turn;

  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 1rem;

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
  const turnEndsIn = useTurnEndsIn();

  if (!player) return null;

  return (
    <PlayerTurnInfoWrapper isCurrentTurn={player.isCurrentTurn}>
      <Nickname>
        {player.orderNumber}. {player.nickname}
      </Nickname>
      {player.isCurrentTurn && <div>Turn ends in: {turnEndsIn}</div>}
    </PlayerTurnInfoWrapper>
  );
}
