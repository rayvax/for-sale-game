import styled from 'styled-components';
import {
  cardRemHeight,
  propertyCardAspectRatio,
  propertyCardWidth,
  propertyImgPositions,
} from '../../../constants/static-data';
import { colors } from '../../../constants/theme';

type StyledPropertyCardProps = {
  imgUrl: string;
  imgPosition: { x: number; y: number };
  hoverPointer: boolean;
};
const StyledPropertyCard = styled.div<StyledPropertyCardProps>`
  width: ${propertyCardWidth}rem;
  height: ${cardRemHeight}rem;

  background-image: url(${({ imgUrl }) => imgUrl});
  background-position: ${({ imgPosition }) =>
    `-${imgPosition.x * propertyCardWidth}rem -${
      imgPosition.y * cardRemHeight
    }rem`};
  background-size: ${`${propertyCardWidth * 10}rem ${cardRemHeight * 3}rem`};
  border-radius: 0.5rem;

  transition: transform 0.5s;

  ${({ hoverPointer }) => {
    if (!hoverPointer) return '';

    return `
    :hover{
      cursor: pointer;
      box-shadow: 0 0 10px 5px ${colors.primary2};
    }`;
  }}
`;

type PropertyCardProps = {
  property: number;
  hoverPointer?: boolean;
  onClick?: () => void;
};

export function PropertyCard({
  property,
  hoverPointer,
  onClick,
}: PropertyCardProps) {
  return (
    <StyledPropertyCard
      imgUrl={`${process.env.PUBLIC_URL}/cards/properties.jpg`}
      imgPosition={propertyImgPositions[property]}
      hoverPointer={!!hoverPointer}
      onClick={onClick}
    />
  );
}
