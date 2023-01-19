import { useMemo } from 'react';
import styled from 'styled-components';
import { CardType, FinalRating, GamePhase } from '../../../models/game';
import { useGamePhase, useGameStoreState } from '../../../store/game/hooks';
import { TableCardList } from '../cards/TableCardList';
import { FinalRatingTable } from './FinalRatingTable';

type TableState = {
  title: string;
  cardType?: CardType;
  cards?: number[];
  finalRatings?: FinalRating[];
};

const TableWrapper = styled.div`
  position: fixed;
  top: 45%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
`;

const TableTitle = styled.h2`
  text-align: center;
  width: 100%;
`;

export function GameTable() {
  const gameStoreState = useGameStoreState();
  const gamePhase = useGamePhase();

  const tableState: TableState | null = useMemo(() => {
    if (!gameStoreState) return null;

    switch (gamePhase) {
      case GamePhase.BID_COINS:
        return {
          title: 'Table property',
          cardType: 'property',
          cards: gameStoreState.table.properties,
        };
      case GamePhase.BID_PROPERTY:
        return {
          title: 'Table money',
          cardType: 'money',
          cards: gameStoreState.table.money,
        };
      case GamePhase.END:
        return {
          title: 'Final score',
          finalRatings: gameStoreState.finalRatings,
        };
      default:
        return null;
    }
  }, [gamePhase, gameStoreState]);

  if (!gameStoreState || !tableState) return null;

  const { title, cardType, cards, finalRatings } = tableState;

  return (
    <TableWrapper>
      <TableTitle>{title}</TableTitle>
      {cardType && cards && <TableCardList cardType={cardType} cards={cards} />}
      {finalRatings && <FinalRatingTable finalRatings={finalRatings} />}
    </TableWrapper>
  );
}
