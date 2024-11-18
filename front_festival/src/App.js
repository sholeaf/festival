import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './assets/style/style.css';
import 'react-calendar/dist/Calendar.css';
import Main from './pages/Main';
import Festival from './pages/festival/Festival';
import Community from './pages/Community';
import Notice from './pages/notice/Notice';
import Header from './layout/Header';
import Nwrite from './pages/notice/Nwrite';
import Nget from './pages/notice/Nget';
import Nmodify from './pages/notice/Nmodify';
import Adminpage from './pages/notice/Adminpage';
import MyPage from './pages/user/MyPage';
import Login from './pages/user/Login';
import Join from './pages/user/Join';
import DetailFestival from './pages/festival/DetailFestival';
import Note from './pages/notes/Note';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main></Main>}></Route>
          <Route path="/festival" element={<Festival></Festival>}></Route>
          <Route path="/festival/:contentid" element={<DetailFestival></DetailFestival>}></Route>
          <Route path="/community" element={<Community></Community>}></Route>
          <Route path="/user/mypage" element={<MyPage></MyPage>}></Route>
          <Route path="/user/login" element={<Login></Login>}></Route>
          <Route path="/user/join" element={<Join></Join>}></Route>
          <Route path="/notice/list" element={<Notice></Notice>}></Route>
          <Route path="/notice/nwrite" element={<Nwrite></Nwrite>}></Route>
          <Route path="/notice/nmodify" element={<Nmodify></Nmodify>}></Route>
          <Route path="/notice/:noticenum" element={<Nget></Nget>}></Route>
          <Route path="/notice/adminpage" element={<Adminpage></Adminpage>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
