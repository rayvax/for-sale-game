import { darken } from 'polished';
import styled from 'styled-components';
import { colors } from '../../constants/theme';

const BaseButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 24px;

  border: none;
  border-radius: 20px;
`;

export const PrimaryButton = styled(BaseButton)`
  color: ${colors.textAlter};
  background-color: ${colors.primary};

  &:focus {
    box-shadow: 0 0 0 1pt ${darken(0.05, colors.primary)};
    background-color: ${darken(0.05, colors.primary)};
  }
  &:hover {
    background-color: ${darken(0.05, colors.primary)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${darken(0.1, colors.primary)};
    background-color: ${darken(0.1, colors.primary)};
  }
  &:disabled {
    background-color: ${darken(0.2, colors.primary)};
    color: ${darken(0.26, colors.primary)};
    cursor: auto;
    box-shadow: none;
    outline: none;
  }
`;

export const SecondaryButton = styled(BaseButton)`
  color: ${colors.textAlter};
  background-color: ${colors.secondary};

  &:focus {
    box-shadow: 0 0 0 1pt ${darken(0.05, colors.secondary)};
    background-color: ${darken(0.05, colors.secondary)};
  }
  &:hover {
    background-color: ${darken(0.05, colors.secondary)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${darken(0.1, colors.secondary)};
    background-color: ${darken(0.1, colors.secondary)};
  }
  &:disabled {
    background-color: ${darken(0.2, colors.secondary)};
    color: ${darken(0.26, colors.secondary)};
    cursor: auto;
    box-shadow: none;
    outline: none;
  }
`;
