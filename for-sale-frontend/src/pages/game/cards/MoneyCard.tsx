import styled from 'styled-components';
import { cardRemHeight, moneyCardWidth } from '../../../constants/static-data';

type StyledMoneyCardProps = {
  imgUrl: string;
};
const StyledMoneyCard = styled.div<StyledMoneyCardProps>`
  width: ${moneyCardWidth}rem;
  height: ${cardRemHeight}rem;

  background-image: url(${({ imgUrl }) => imgUrl});
  background-size: contain;
  background-repeat: no-repeat;

  border-radius: 5px;
`;

type PropertyCardProps = {
  value: number;
};

export function MoneyCard({ value }: PropertyCardProps) {
  return (
    <StyledMoneyCard
      imgUrl={`${process.env.PUBLIC_URL}/cards/money_${value}.jpg`}
    />
  );
}
