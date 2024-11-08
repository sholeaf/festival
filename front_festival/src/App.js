import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './assets/style/style.css';
import 'react-calendar/dist/Calendar.css';
import Main from './pages/Main';
import Festival from './pages/Festival';
import Community from './pages/Community';
import Notice from './pages/notice/Notice';
import MyPage from './pages/MyPage';
import Login from './pages/Login';
import Header from './layout/Header';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Main></Main>}></Route>
          <Route path="/festival" element={<Festival></Festival>}></Route>
          <Route path="/community" element={<Community></Community>}></Route>
          <Route path="/notice/notice" element={<Notice></Notice>}></Route>
          <Route path="/mypage" element={<MyPage></MyPage>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
