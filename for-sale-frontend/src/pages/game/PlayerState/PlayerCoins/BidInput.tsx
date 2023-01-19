import styled from 'styled-components';

export const BidInput = styled.input.attrs(() => ({
  type: 'number',
}))`
  width: 45px;
  height: 42px;
  line-height: 1.65;
  float: left;
  display: block;
  padding: 0;
  margin: 0;
  padding-left: 20px;
  border: 1px solid #eee;

  font-size: 1.5rem;

  &:focus {
    outline: 0;
  }
`;
