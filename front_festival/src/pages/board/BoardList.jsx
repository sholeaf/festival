import { useEffect, useState } from "react";
import Dropdown from "../../components/Dropdown";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import Pagination from "../../components/Paginstion";
import Header from "../../layout/Header";
import NoteModal from "../../components/NoteModal";
import Modal from "../../components/Modal";

const BoardList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loginUser, setLoginUser] = useState("");
    // 쪽지 모달 상태
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    // 회원 정보 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [user, setUser] = useState({
        userid: '',
        userpw: '',
        username: '',
        userphone: '',
        useremail: '',
        usergender: '',
        zipcode: '',
        addr: '',
        addrdetail: '',
        addretc: ''
    });
    const [userInfo, setUserInfo] = useState({
        userid: '',
        nameinfo: '',
        emailinfo: '',
        genderinfo: ''
    });
    const [userFile, setUserFile] = useState();

    const [data, setData] = useState();
    const [cri, setCri] = useState({
        pagenum: 1,
        amount: 10,
        type: "a",
        keyword: "",
        startrow: 0
    });
    const [pageMaker, setPagemaker] = useState({
        startPage: 1,
        endPage: 1,
        realEnd: 1,
        total: 0,
        prev: false,
        next: false,
        cri: null
    })
    const [inputs, setInputs] = useState("");
    const inputKeyword = (e) => {
        setInputs(e.target.value);
    }
    const clickSearch = (e) => {
        e.preventDefault();
        const changedCri = {
            ...cri,
            type: document.getElementById("type").value,
            keyword: inputs,
            pagenum: 1
        };
        setCri(changedCri);
    }

    useEffect(() => {
        axios.get(`/api/board/list/${cri.pagenum}`, { params: cri }).then((resp) => {
            setData(resp.data);
            setPagemaker(resp.data.pageMaker);
            setInputs(resp.data.pageMaker.cri.keyword);
        })
        axios.get(`/api/user/loginCheck`).then(resp => {
            if (resp.data.trim() != "") {
                setLoginUser(resp.data.trim());
            }
        })
    }, [cri])
    useEffect(() => {
        //만약 이전 페이지에서 cri를 받아온것이 있다면
        if (location.state) {
            //pageMaker의 cri를 그 받아온 것으로 세팅
            //State가 변화했으므로 리렌더링 진행
            // > 위에 있는 pageMaker에 종속되어 있는 Effect 호출
            setCri(location.state);
        }
    }, [location.state])
    const searchType = { "전체": "a", "제목": "T", "내용": "C", "작성자": "W", "태그": "G" }
    const changeType = (value) => {
        const changedCri = { ...cri, type: value }
        if (document.getElementById("type").value == 'a') {
            changedCri.keyword = "";
        }
        setCri(changedCri);
        console.log(inputs);
    }

    const extractTextFromHTML = (htmlString, maxLength) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const textContent = doc.body.textContent || doc.body.innerText;

        // 텍스트 길이를 maxLength로 제한
        if (textContent.length > maxLength) {
            return textContent.slice(0, maxLength) + '...'; // 길이를 넘으면 '...'을 추가
        }
        return textContent;
    };
    // 쪽지 보내기 모달
    const openNoteModal = () => {
        if (loginUser == "" || loginUser == null) {
            alert("로그인 후 이용할 수 있습니다.");
            document.getElementsByClassName('popup')[0].style.display = "none";
            setSelectedUserId('');
            return;
        }
        if (loginUser == selectedUserId) {
            alert("본인에게는 쪽지를 보낼 수 없습니다.");
            document.getElementsByClassName('popup')[0].style.display = "none";
            setSelectedUserId('');
            return;
        }
        setIsNoteModalOpen(true);  // 모달 열기
    };

    // 모달 닫기
    const closeNoteModal = () => {
        setIsNoteModalOpen(false);
    };

    // 회원 정보 모달
    const openModal = () => {
        if (loginUser == "" || loginUser == null) {
            alert("로그인 후 이용할 수 있습니다.");
            document.getElementsByClassName('popup')[0].style.display = "none";
            setSelectedUserId('');
            return;
        }
        setIsModalOpen(true);  // 모달 열기
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // 팝업열기
    const openPopup = (e, userId) => {
        setSelectedUserId(userId);
        const rect = e.target.getBoundingClientRect()
        console.log(rect.left)

        const popup = document.getElementsByClassName('popup')[0]
        popup.style.display = "block";
        popup.style.left = rect.left + "px";
        popup.style.top = (rect.top + 20) + "px";


        const handleClickOutside = (event) => {
            if (!popup.contains(event.target) && event.target !== e.target) {
                popup.style.display = "none"; // 팝업 숨기기
                document.body.removeEventListener('click', handleClickOutside); // 이벤트 리스너 제거
            }
        };
        // body에 클릭 이벤트 리스너 추가
        document.body.addEventListener('click', handleClickOutside);

        axios.get('/api/user/userInfo', { params: { userid: userId } })
            .then(resp => {
                if (resp) {
                    console.log(resp.data)
                    setUser(resp.data.user)
                    setUserInfo(resp.data.userInfo)
                    setUserFile(resp.data.file)
                }
            })
    }




    if (!data) {
        return <>로딩중...</>
    }
    else {
        const list = data.list;
        const elList = [];
        if (list && list.length > 0) {
            for (const board of list) {
                elList.push(
                    <div className="board_obj" key={board.boardnum} >
                        <div className="board_title getBoard" onClick={() => { navigate(`/board/${board.boardnum}`, { state: cri }) }}>{board.boardtitle}</div>
                        <div className="boardbox2 boardbox">
                            <div className="getBoard" onClick={() => { navigate(`/board/${board.boardnum}`, { state: cri }) }}>{extractTextFromHTML(board.boardcontent, 203)}</div>
                            <div><img src={board.titleImage ? `/api/file/thumbnail?systemname=` + board.titleImage : ""} className="getBoard" onClick={() => { navigate(`/board/${board.boardnum}`, { state: cri }) }}></img></div>
                        </div>
                        <div className="boardbox3 boardbox">
                            <div className="boardbox4 boardbox">
                                <div className="getBoard"><a onClick={(e) => openPopup(e, board.userid)}>{board.userid}</a></div>
                                <div>{board.boardregdate}</div>
                            </div>
                            <div className="boardbox5 boardbox">
                                <div>좋아요 {board.likeCnt}</div>
                                <div>댓글 {board.replyCnt}</div>
                            </div>
                        </div>

                        {/* <div>
                            <a onClick={() => openModal(board.userid)}>{board.userid}</a>
                            </div>
                        <div>{board.boardregdate}</div>
                        <div className="getBoard" onClick={()=>{navigate(`/board/${board.boardnum}`,{state:cri})}}>{board.boardtitle}</div>
                        <div className="getBoard" onClick={()=>{navigate(`/board/${board.boardnum}`,{state:cri})}}>{extractTextFromHTML(board.boardcontent, 210)}</div>
                        <div className="getBoard" onClick={()=>{navigate(`/board/${board.boardnum}`,{state:cri})}}><img src={board.titleImage? `/api/file/thumbnail?systemname=`+board.titleImage:""} ></img></div>
                        <div>좋아요 {board.likeCnt}</div>
                        <div>댓글 {board.replyCnt}</div> */}
                    </div>
                )
            }
        }
        return (
            <>
                <Header></Header>
                <div id="board_wrap" className="list">
                    <div>
                        <a className="btn" onClick={() => {
                            if (loginUser == null || loginUser == "") {
                                alert("로그인해야 글을 쓰실 수 있습니다!");
                                return;
                            }
                            navigate("/board/write", { state: cri })
                        }}>글쓰기</a>
                    </div>
                    <div style={{ height: "30px" }}>
                        <div id="board_wrap" className="list">
                            <div>
                                <a className="btn" onClick={() => {
                                    if (loginUser == null || loginUser == "") {
                                        alert("로그인해야 글을 쓰실 수 있습니다!");
                                        return;
                                    }
                                    navigate("/board/write", { state: cri })
                                }}>글쓰기</a>
                            </div>
                            <div className="tbody">
                                <div className="board_obj">
                                    <div className="board_title">제목</div>
                                    <div className="boardbox2 boardbox">
                                        <div>내용</div>
                                        <div>이미지</div>
                                    </div>
                                    <div className="boardbox3 boardbox">
                                        <div className="boardbox4 boardbox">
                                            <div>아이디</div>
                                            <div>등록시간</div>
                                        </div>
                                        <div className="boardbox5 boardbox">
                                            <div>좋아요</div>
                                            <div>댓글</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ height: "30px" }}>
                            </div>
                            <div>
                                {elList}
                            </div>
                            <Pagination pageMaker={pageMaker}></Pagination>
                            <div className="search_area">
                                <form name="searchForm" id="searchForm" action="/board/list" className="row">
                                    <Dropdown list={searchType} name={"type"} width={150} value={cri.type} onChange={changeType}></Dropdown>
                                    <input type="search" id="keyword" name="keyword" onChange={inputKeyword} value={inputs} />
                                    <a id="search-btn" className="btn" onClick={clickSearch}>검색</a>
                                    <input type="hidden" name="pagenum" />
                                    <input type="hidden" name="amount" />
                                </form>
                            </div>
                            <div className="popup">
                                <a onClick={() => openNoteModal()}>쪽지 보내기</a>
                                <a onClick={() => openModal()}>회원 정보</a>
                            </div>
                        </div>
                    </div>
                    <div className="BoardModal">
                        <Modal isOpen={isModalOpen} closeModal={closeModal}>
                            <p className="id">{user.userid}님의 정보</p>
                            <div className="closeBoardModal" onClick={() => {
                                setIsModalOpen(false);
                                setSelectedUserId('');
                            }}>x</div>
                            <div className="img">
                                <img src={`/api/user/file/thumbnail/${userFile}`} />
                            </div>
                            {
                                userInfo.nameinfo == "T" ?
                                    <div className="name">이름 : {user.username}</div>
                                    :
                                    <div className="name">이름 : 비공개</div>
                            }
                            {
                                userInfo.genderinfo == "T" ?
                                    <div className="gender">성별 : {user.usergender == "M" ? "남성" : "여성"}</div>
                                    :
                                    <div className="gender">성별 : 비공개</div>
                            }
                            {
                                userInfo.emailinfo == "T" ?
                                    <div className="email">이메일 : {user.useremail}</div>
                                    :
                                    <div className="email">이메일 : 비공개</div>
                            }

                        </Modal>
                    </div>
                    <div>
                        <NoteModal
                            isOpen={isNoteModalOpen}
                            closeModal={closeNoteModal}
                            toUserId={selectedUserId}  // 클릭된 작성자의 userid를 전달
                            loginUser={loginUser}      // 로그인된 유저의 userid를 전달
                        />
                    </div>
                </div>
            </>
        )
    }
}
export default BoardList;