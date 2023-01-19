import { HashRouter, Route, Routes } from 'react-router-dom';
import NotFound from './pages/errors/NotFound';
import { GamePage } from './pages/game';
import HomePage from './pages/home';
import { RoomPage } from './pages/room';
import { gamePath, homePagePath, roomPath } from './constants/paths';

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path={homePagePath} element={<HomePage />} />
          <Route path={roomPath} element={<RoomPage />} />
          <Route path={gamePath} element={<GamePage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
