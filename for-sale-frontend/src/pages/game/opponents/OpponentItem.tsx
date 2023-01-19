import { Check, X } from 'react-feather';
import styled from 'styled-components';
import { colors } from '../../../constants/theme';
import { OpponentData } from '../../../models/game';

const OpponentWrapper = styled.li<{ needHightlight: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;

  min-width: 170px;
  max-width: 300px;

  background-color: ${colors.bg1};
  border: 3px solid ${colors.bg2};
  border-radius: 20px;

  ${({ needHightlight }) =>
    needHightlight && `box-shadow: 0 0 10px 5px ${colors.primary2};`}
`;

const OpponentInfoRow = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 0.75rem;

  display: flex;

  &:not(:last-child) {
    border-bottom: 3px solid ${colors.bg2};
  }
`;

const OpponentNickname = styled.h3`
  margin: 0;

  width: 100%;
  text-align: center;
`;

const OpponentInfoRowDD = styled.dd`
  margin-left: auto;
`;

interface OppenentProps {
  opponent: OpponentData;
}

export function OpponentItem({ opponent }: OppenentProps) {
  return (
    <OpponentWrapper needHightlight={opponent.isCurrentTurn}>
      <OpponentInfoRow>
        <OpponentNickname>
          {opponent.orderNumber}. {opponent.nickname || 'Bot'}
        </OpponentNickname>
      </OpponentInfoRow>
      <OpponentInfoRow>
        <dt>Passed</dt>
        <OpponentInfoRowDD>{opponent.passed ? <Check /> : <X />}</OpponentInfoRowDD>
      </OpponentInfoRow>
      <OpponentInfoRow>
        <dt>Bid</dt>
        <OpponentInfoRowDD>{opponent.bid}</OpponentInfoRowDD>
      </OpponentInfoRow>
      {!!opponent.lastBidProperty && opponent.lastBidMoney !== undefined && (
        <>
          <OpponentInfoRow>
            <dt>Last bid property</dt>
            <dd>{opponent.lastBidProperty}</dd>
          </OpponentInfoRow>
          <OpponentInfoRow>
            <dt>Last taken money</dt>
            <dd>{opponent.lastBidMoney}</dd>
          </OpponentInfoRow>
        </>
      )}
    </OpponentWrapper>
  );
}
