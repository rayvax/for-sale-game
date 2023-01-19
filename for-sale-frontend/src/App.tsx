import { HashRouter, Route, Routes } from 'react-router-dom';
import NotFound from './pages/errors/NotFound';
import { GamePage } from './pages/game';
import HomePage from './pages/home';
import { RoomPage } from './pages/room';
import { gamePath, homePagePath, roomPath } from './constants/paths';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        pauseOnHover
        theme='light'
      />
    </>
  );
}

export default App;
