import { useState } from 'react';
import styled from 'styled-components';
import { propertyCardWidth } from '../../../../constants/static-data';
import { GamePhase } from '../../../../models/game';
import {
  useGamePhase,
  useHand,
  usePlayerData,
} from '../../../../store/game/hooks';
import { PlayerPropertyCard } from './PlayerProperty';

const PlayerPropertiesStyledList = styled.ul<{ cardCount: number }>`
  display: grid;
  grid-template-columns: repeat(${({ cardCount }) => cardCount}, 1fr);
  grid-template-rows: auto;

  grid-area: prop;

  margin: 0;
  padding: 0;
  list-style: none;

  width: calc(100% - ${propertyCardWidth}rem);

  & li {
    min-width: 0;
  }
`;

export function PlayerPropertiesList() {
  const hand = useHand();
  const gamePhase = useGamePhase();
  const player = usePlayerData();

  const [isLoading, setIsLoading] = useState(false);

  if (!hand || !player) return null;

  const { properties } = hand;
  const canBid = player.isCurrentTurn && gamePhase === GamePhase.BID_PROPERTY;

  return (
    <PlayerPropertiesStyledList cardCount={properties.length}>
      {properties.map((property) => (
        <li key={`${property}-hand-property`}>
          <PlayerPropertyCard
            property={property}
            canBid={canBid}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </li>
      ))}
    </PlayerPropertiesStyledList>
  );
}
