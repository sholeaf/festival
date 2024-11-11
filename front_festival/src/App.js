import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './assets/style/style.css';
import 'react-calendar/dist/Calendar.css';
import Main from './pages/Main';
import Festival from './pages/festival/Festival';
import Community from './pages/Community';
import Notice from './pages/notice/Notice';
import MyPage from './pages/user/MyPage';
import Login from './pages/user/Login';
import Join from './pages/user/Join';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main></Main>}></Route>
          <Route path="/festival" element={<Festival></Festival>}></Route>
          <Route path="/community" element={<Community></Community>}></Route>
          <Route path="/user/mypage" element={<MyPage></MyPage>}></Route>
          <Route path="/user/login" element={<Login></Login>}></Route>
          <Route path="/user/join" element={<Join></Join>}></Route>
          <Route path="/notice/notice" element={<Notice></Notice>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
