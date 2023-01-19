import styled from 'styled-components';
import { moneyCardWidth } from '../../../constants/static-data';
import { useHand } from '../../../store/game/hooks';
import { MoneyCard } from '../cards/MoneyCard';

const StyledPlayerMoneyList = styled.ul<{ cardCount: number }>`
  list-style: none;
  margin: 0;
  padding: 1rem 1rem 1rem 3rem;

  display: grid;
  grid-template-columns: repeat(${({ cardCount }) => cardCount}, 1fr);
  grid-template-rows: auto;

  width: calc(100% - ${moneyCardWidth}rem);

  grid-area: money;

  & li {
    min-width: 0;
  }
`;

const StyledPlayerMoneyItem = styled.li`
  margin: auto 0;
`;

export function PlayerMoneyList() {
  const hand = useHand();

  if (!hand) return null;

  const { money } = hand;

  return (
    <StyledPlayerMoneyList cardCount={money.length}>
      {money.map((m, i) => (
        <StyledPlayerMoneyItem key={`hand-money-${i}`}>
          <MoneyCard value={m} />
        </StyledPlayerMoneyItem>
      ))}
    </StyledPlayerMoneyList>
  );
}
