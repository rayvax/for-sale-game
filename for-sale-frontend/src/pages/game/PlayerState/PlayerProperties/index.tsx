import { useState } from 'react';
import styled from 'styled-components';
import { propertyCardWidth } from '../../../../constants/static-data';
import { colors } from '../../../../constants/theme';
import { GamePhase } from '../../../../models/game';
import { useGamePhase, useHand, usePlayerData } from '../../../../store/game/hooks';
import { PlayerPropertyCard } from './PlayerProperty';

const PlayerPropertiesStyledList = styled.ul<{ cardCount: number }>`
  grid-area: prop;

  display: grid;
  grid-template-columns: repeat(${({ cardCount }) => cardCount}, 1fr);
  grid-template-rows: auto;

  margin: 0;
  padding: 0;
  padding: 1rem 3rem 1rem 1rem;
  list-style: none;

  width: calc(100% - ${propertyCardWidth}rem);

  & li {
    min-width: 0;
  }
`;

const PlayerPropertiesItem = styled.li`
  margin: auto 0;
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
        <PlayerPropertiesItem key={`${property}-hand-property`}>
          <PlayerPropertyCard
            property={property}
            canBid={canBid}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </PlayerPropertiesItem>
      ))}
    </PlayerPropertiesStyledList>
  );
}
