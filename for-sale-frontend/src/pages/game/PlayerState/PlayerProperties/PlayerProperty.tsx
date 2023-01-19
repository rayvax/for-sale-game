import { useGameAPI } from '../../../../api/game/hooks';
import { PropertyCard } from '../../cards/PropertyCard';

type PlayerPropertyProps = {
  property: number;
  canBid: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export function PlayerPropertyCard({
  property,
  canBid,
  isLoading,
  setIsLoading,
}: PlayerPropertyProps) {
  const gameApi = useGameAPI();

  function handleBidProperty() {
    if (!canBid || !gameApi || isLoading) return;

    (async function () {
      try {
        setIsLoading(true);

        await gameApi.bidProperty(property);
        await gameApi.updateGameState();
      } catch (e) {
        console.error('Error while bidding property: ', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }

  return (
    <PropertyCard
      property={property}
      hoverPointer={canBid && !isLoading}
      onClick={handleBidProperty}
    />
  );
}
