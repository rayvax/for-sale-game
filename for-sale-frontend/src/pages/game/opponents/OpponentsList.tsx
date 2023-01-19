import styled from 'styled-components';
import { OpponentData } from '../../../models/game';
import { OpponentItem } from './OpponentItem';

const OpponentsListWrapper = styled.ol`
  position: fixed;
  width: 100%;
  top: 0;

  display: flex;
  justify-content: center;
  gap: 3rem;

  margin: 0;
  padding: 0;
`;

interface OpponentsListProps {
  players: OpponentData[];
}

export function OpponentsList({ players }: OpponentsListProps) {
  return (
    <OpponentsListWrapper>
      {players.map((player, i) => (
        <OpponentItem key={`player-${i}`} opponent={player} />
      ))}
    </OpponentsListWrapper>
  );
}
