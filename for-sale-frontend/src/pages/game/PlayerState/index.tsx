import styled from 'styled-components';
import { PlayerCoins } from './PlayerCoins';
import { PlayerMoneyList } from './PlayerMoney';
import { PlayerPropertiesList } from './PlayerProperties';
import { PlayerMainInfo } from './PlayerMainInfo';

const PlayerWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);

  padding: 0 3rem 1rem;

  display: grid;
  grid-template-areas: 'turn turn turn' 'money coins prop';

  grid-template-columns: minmax(0, 1fr) 200px minmax(0, 1fr);
`;

export function PlayerState() {
  return (
    <PlayerWrapper>
      <PlayerMainInfo />
      <PlayerMoneyList />
      <PlayerCoins />
      <PlayerPropertiesList />
    </PlayerWrapper>
  );
}
