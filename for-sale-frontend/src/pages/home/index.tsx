import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createAccount } from '../../api/lobby/api';
import { PrimaryButton } from '../../components/common/Button';
import { Form, Label } from '../../components/common/Form';
import { ErrorSpan } from '../../components/common/Span';
import { colors } from '../../constants/theme';
import { useAppDispatch } from '../../hooks/redux';
import { setAccountData } from '../../store/account/actions';
import { useToken } from '../../store/account/hooks';
import { getErrorMessage } from '../../utils/error';
import { roomPath, roomsDashboardPath } from '../../constants/paths';

const HomePageContainer = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &:before {
    content: '';
    display: block;

    z-index: -2;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    background-color: white;
  }

  &:after {
    content: '';
    display: block;

    z-index: -1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    background-image: url('${process.env.PUBLIC_URL}/cards/background.jpg');
    background-size: cover;
    opacity: 0.3;
  }
`;
const HomePageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  background-color: ${colors.bg1};
  border: 3px solid ${colors.bg2};
  border-radius: 1rem;
  padding: 2rem 3rem;
`;

const HomePageHeading = styled.h1`
  font-size: 75px;
  margin: 0 0 2rem;
`;

function HomePage() {
  const navigate = useNavigate();
  const token = useToken();
  const dispatch = useAppDispatch();

  const [inputName, setInputName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    navigate(roomPath);
  }, [token, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const token = await createAccount(inputName);

      setError(null);
      dispatch(setAccountData({ token, login: inputName }));
      navigate(roomsDashboardPath);
    } catch (e) {
      console.error(e);
      setError(getErrorMessage(e));
    }
  }

  return (
    <HomePageContainer>
      <HomePageWrapper>
        <HomePageHeading>For sale!</HomePageHeading>

        <Form onSubmit={handleSubmit}>
          <Label>
            Enter name:
            <input
              type={'text'}
              id='login'
              name='login'
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
          </Label>
          {error && <ErrorSpan>{error}</ErrorSpan>}
          <PrimaryButton type='submit' disabled={!inputName}>
            Roll in!
          </PrimaryButton>
        </Form>
      </HomePageWrapper>
    </HomePageContainer>
  );
}

export default HomePage;
