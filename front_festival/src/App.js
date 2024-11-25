import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './assets/style/style.css';
import 'react-calendar/dist/Calendar.css';
import Main from './pages/Main';
import Festival from './pages/festival/Festival';
import Notice from './pages/notice/Notice';
import Nwrite from './pages/notice/Nwrite';
import Nget from './pages/notice/Nget';
import Nmodify from './pages/notice/Nmodify';
import Adminpage from './pages/notice/Adminpage';
import MyPage from './pages/user/MyPage';
import Login from './pages/user/Login';
import Join from './pages/user/Join';
import DetailFestival from './pages/festival/DetailFestival';
import BoardWrite from './pages/board/BoardWrite';
import BoardList from './pages/board/BoardList';
import BoardGet from './pages/board/BoardGet';
import BoardModify from './pages/board/BoardModify';
import MainLogin from './pages/MainLogin';
import BoardWriteT from './pages/board/BoardWriteT';



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main></Main>}></Route>
          <Route path="/festival" element={<Festival></Festival>}></Route>
          <Route path="/home" element={<MainLogin></MainLogin>}></Route>
          <Route path="/festival/:contentid" element={<DetailFestival></DetailFestival>}></Route>
          <Route path="/user/mypage" element={<MyPage></MyPage>}></Route>
          <Route path="/user/login" element={<Login></Login>}></Route>
          <Route path="/user/join" element={<Join></Join>}></Route>
          <Route path="/notice/list" element={<Notice></Notice>}></Route>
          <Route path="/notice/nwrite" element={<Nwrite></Nwrite>}></Route>
          <Route path="/notice/nmodify" element={<Nmodify></Nmodify>}></Route>
          <Route path="/notice/:noticenum" element={<Nget></Nget>}></Route>
          <Route path="/notice/adminpage" element={<Adminpage></Adminpage>}></Route>
          <Route path='/board/list' element={<BoardList></BoardList>}></Route>
          {/* <Route path='/board/write' element={<BoardWrite></BoardWrite>}></Route> */}
          <Route path='/board/write' element={<BoardWriteT></BoardWriteT>}></Route>
          <Route path="/board/:boardnum" element={<BoardGet></BoardGet>}></Route>
          <Route path="/board/modify" element={<BoardModify></BoardModify>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
