import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Header from "../../layout/Header";
import NoteModal from "../../components/NoteModal";
import Modal from "../../components/Modal";
import likeA from "../../assets/images/likeA.png";
import likeN from "../../assets/images/likeN.png";
import report from "../../assets/images/report1.png";

const BoardGet = () => {
    const { boardnum } = useParams();
    const [data, setData] = useState();
    const navigate = useNavigate();
    const cri = useLocation().state;

    const replyEndRef = useRef(null);
    const prevPageRef = useRef(1);

    const [nowPage, setNowPage] = useState(1);
    const [list, setList] = useState([]);
    const [replyCnt, setReplyCnt] = useState(0);
    const [loginUser, setLoginUser] = useState("");
    const [checkLike, setcheckLike] = useState();
    // 쪽지 보내기 모달 상태
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

    useEffect(() => {
        getData();
    }, [])

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


    const getData = async () => {
        await axios.get(`/api/user/loginCheck`).then(resp => {
            if (resp.data.trim() != "") {
                setLoginUser(resp.data.trim());
                axios.get(`/api/board/like/${boardnum}?userid=${resp.data}`).then(resp => {
                    resp.data ? setcheckLike(true) : setcheckLike(false);
                })
            }
        })
        const response = await axios.get(`/api/board/${boardnum}`);
        setData(response.data);
    };

    window.addEventListener('popstate', (e) => {
        // navigate('/board/list');
        e.preventDefault();
    });

    useEffect(() => {

        axios.get(`/api/reply/${boardnum}/${nowPage}`)
            .then(resp => {
                setList(resp.data.list);
                setReplyCnt(resp.data.replyCnt);
            })
    }, [nowPage])

    useEffect(() => {
        if (prevPageRef.current != nowPage) {
            replyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            prevPageRef.current = nowPage;
        }
    }, [list])

    const remove = async () => {
        const regex = /systemname=([a-zA-Z0-9\-]+(?:\.[a-zA-Z]{3,4})?)"/g;
        const useImages = [];
        let useImage;

        // `exec` 메서드를 이용해 여러번 찾을 수 있음
        while ((useImage = regex.exec(data.boardcontent)) !== null) {
            useImages.push(useImage[1]); // targetWord 뒤의 단어를 추출
        }
        // if (useImages.length === 0) {
        //     const response = await axios.delete(`/api/board/${boardnum}`);
        //     alert(`${response.data}번 게시글 삭제!`);
        //     navigate(`/board/list`, { state: cri });
        //     return; // 이후 코드 실행을 멈춤
        // }
        const queryParams = new URLSearchParams();
        useImages.forEach((image) => {
            queryParams.append('useImages[]', image); // useImages[]로 배열을 전달
        });
        const response = await axios.delete(`/api/board/${boardnum}?${queryParams.toString()}`);
        alert(`${response.data}번 게시글 삭제!`)
        navigate(`/board/list`, { state: cri });
    }

    const clickRegist = async () => {
        let flag = false;
        if (list == null || list.length == 0){
            flag = true;
        }
        const replycontents = document.getElementById("replycontents");
        if (replycontents.value == "") {
            alert("댓글 내용을 입력하세요!");
            replycontents.focus();
            return;
        }
        const reply = { replycontent: replycontents.value, userid: loginUser, boardnum: data.boardnum };
        axios.post(`/api/reply/regist`, reply)
            .then(resp => {
                alert(`댓글 등록 완료!`);
                reply.replynum = resp.data;
                if (list.length == 5) {
                    setReplyCnt(replyCnt+1);
                    setNowPage(Math.ceil((replyCnt + 1) / 5));
                }
                else {
                    setReplyCnt(replyCnt+1);
                    setList([...list, resp.data]);
                }
                
                replycontents.value = "";
            })
    }

    const like = async () => {
        if(loginUser == null || loginUser ==""){
            alert("로그인 하셔야 좋아요가 가능합니다!");
            return;
        }

        const response = await axios.post(`/api/board/like/${boardnum}?userid=${loginUser}`);
        if (response.data) {
            setcheckLike(true);
            alert("좋아요!");
        }
        else {
            setcheckLike(false);
            alert("좋아요취소");
        }
    }
    const reportBoard = async () => {
        if(loginUser == null || loginUser == ""){
            alert("로그인 후 신고 가능합니다!");
            return;
        }
        if(loginUser == data.userid){
            alert("자신의 게시물은 신고 할 수 없습니다!");
            return;
        }
        const response = await axios.post(`/api/board/reportBoard/${boardnum}?userid=${loginUser}`);
        if (response.data) {
            alert("신고되었습니다!");
        }
        else {
            alert("이미 신고하셨습니다!");
        }
    }
    const reportReply = async (replynum) => {
        if(loginUser == null || loginUser == ""){
            alert("로그인 후 신고 가능합니다!");
            return;
        }
        if(loginUser == data.userid){
            alert("자신의 댓글은 신고 할 수 없습니다!");
            return;
        }
        const response = await axios.post(`/api/board/reportReply/${replynum}?userid=${loginUser}`);
        if (response.data) {
            alert("신고되었습니다!");
        }
        else {
            alert("이미 신고하셨습니다!");
        }
    }

    const BlindReply = ({ reply }) => {
        // `isContentVisible` 상태를 사용하여 댓글 내용이 보일지 여부를 관리
        const [isContentVisible, setIsContentVisible] = useState(false);

        const toggleContentVisibility = () => {
            setIsContentVisible(!isContentVisible); // 클릭 시 상태를 토글
        };
        return (
            <div onClick={() => setIsContentVisible(true)}>
                {isContentVisible ? (
                <div className="rpBody">{reply.replycontent}</div> // 내용이 보일 때
                ) : (
                <div className="rpBody getBoard">(블라인드 처리된 댓글입니다. 클릭하시면 내용이 보입니다.)</div> // 내용이 숨겨져 있을 때
                )}
            </div>
        );
    };

    const NormalReply = ({ reply }) => {
        const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
        const [editedContent, setEditedContent] = useState(reply.replycontent); // 수정된 댓글 내용

        // 수정 버튼 클릭 시 수정 모드 활성화
        const handleEditClick = () => {
            setIsEditing(true);
        };

        // 수정된 댓글 내용 업데이트
        const handleContentChange = (e) => {
            setEditedContent(e.target.value);
        };

        // 수정 완료 버튼 클릭 시 댓글 수정 완료
        const handleSaveClick = async (replynum) => {
            const replycontents = document.querySelector("#replycontents2");
            if (editedContent == "") {
                alert("수정할 댓글 내용을 입력하세요!")
                replycontents.focus();
                return;
            }
            const reply = { replynum: replynum, replycontent: editedContent, userid: loginUser };
            const response = await axios.put(`/api/reply/${replynum}`, reply);
            alert(`댓글 수정 완료!`);
            const updatedList = list.map((item) => {
                if (item.replynum == replynum) {
                    return response.data;
                }
                else {
                    return item;
                }
            })
            setList(updatedList);

            setIsEditing(false);
        };

        // 수정 취소 버튼 클릭 시 수정 취소
        const handleCancelClick = () => {
            setIsEditing(false);
            setEditedContent(reply.replycontent); // 원래 내용으로 돌아갑니다.
        };
        return (
            <div  className="rpBody" style={{display:"flex"}}>
                {isEditing ? (
                    // 수정 모드일 때, 댓글 내용을 텍스트 입력란으로 보여줌
                    <>
                        <div>
                            <textarea name="replycontents" id="replycontents2" className="replycontents" value={editedContent} placeholder="Contents" onChange={handleContentChange} rows="3" cols="40" ></textarea>
                        </div>
                        <div className="rpBtn" >
                            <div onClick={() => handleSaveClick(reply.replynum)}>완료</div>
                            <div onClick={handleCancelClick}>취소</div>
                        </div>
                    </>
                ) : (
                    // 수정 모드가 아닐 때, 댓글 내용 표시
                    <>
                        <div style={{width:"680px"}}>{reply.replycontent}</div>
                        <div className="rpBtn" >{
                            reply.userid == loginUser ?
                                <>
                                    <div onClick={handleEditClick}>수정</div>
                                    <div onClick={() => removeReply(reply.replynum)}>삭제</div>
                                </>
                                : ""
                        }
                        </div>
                    </>
                )}
            </div>
        );
    };
    const removeReply = (replynum) => {
        axios.delete(`/api/reply/${replynum}`)
            .then(resp => {
                alert(`댓글 삭제 완료!`)
                if (list.length == 1 && nowPage != 1) {
                    setNowPage(nowPage - 1);
                }
                else {
                    axios.get(`/api/reply/${boardnum}/${nowPage}`)
                        .then(resp => {
                            setList(resp.data.list);
                            setReplyCnt(resp.data.replyCnt);
                        })
                }
            })
    }

    if (!data) {
        return <>로딩중...</>
    }
    else {
        const replyList = [];
        const paging = [];
        let endPage = Math.ceil(nowPage / 5) * 5;
        let startPage = endPage - 4;
        endPage = (endPage - 1) * 5 >= replyCnt ?
            Math.ceil(replyCnt / 5) : endPage;
        let prev = startPage != 1;
        let next = endPage * 5 < replyCnt;

        const changePage = (e) => {
            e.preventDefault();
            const page = e.target.getAttribute("href");
            setNowPage(page);
        }
        if (prev) {
            paging.push(<a className="changePage page-btn" href={startPage - 1} key={startPage - 1} onClick={changePage}>&lt;</a>)
        }
        for (let i = startPage; i <= endPage; i++) {
            if (i == nowPage) {
                paging.push(<span className="nowPage" key={i}>{i}</span>);
            }
            else {
                paging.push(<a href={i} className="changePage page-btn" key={i} onClick={changePage}>{i}</a>)
            }
        }
        if (next) {
            paging.push(<a href={endPage + 1} className="changePage page-btn" key={endPage + 1} onClick={changePage}>&gt;</a>)
        }

        if (list == null || list.length == 0) {
            replyList.push(<li className="no-reply" key={`li0`}><div className="rpBody_wrap" style={{textAlign:"center"}}><div style={{width:"900px"}}>등록된 댓글이 없습니다.</div></div></li>);
        }
        for (let i = 0; i < list.length; i++) {
            const reply = list[i];
            replyList.push(
                <li className={`li${reply.replynum}`} key={`li${reply.replynum}`}>
                    <div className=" rrow rpBody_wrap">
                        <a className="getBoard" onClick={(e) => openPopup(e, reply.userid)} style={{width:"40px"}}><strong className={`userid${reply.userid}`}>{reply.userid}</strong></a>
                        <div className={`reply${reply.replynum}`} >
                            {reply.reportcnt < 5 ? (
                                <NormalReply reply={reply} />
                            )
                                : (<BlindReply reply={reply} />)
                            }</div>
                        <div className="rpDate">
                            <div className={`reply${reply.replyregdate} rpDate`}>{reply.replyregdate}</div>
                            <div className="getBoard" onClick={() => reportReply(reply.replynum)}><img src={report} style={{width: "18px", marginLeft:"10px", marginTop:"5px"}}></img></div>
                        </div>
                    </div>
                    <div>
                        <strong></strong>

                    </div>
                </li>
            )
        }

        return (
            <>
                <Header></Header>
                <div className="boardget_wrap">
                    <div className="bgTitle"><strong>{data.boardtitle}</strong></div>
                    <div className="bgUserid">
                        <a className="getBoard" onClick={(e) => openPopup(e, data.userid)}><strong>{data.userid}</strong></a>
                    </div>
                    <div className="bgDate" style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div>{data.boardregdate}</div>
                        <div className="getBoard" onClick={reportBoard}><img src={report} style={{width: "25px"}}></img></div>
                    </div>
                    <div className="bgContent">
                        <div dangerouslySetInnerHTML={{ __html: data.boardcontent }} />
                    </div>
                    <div className="boardTag">{data.tag.replace(/\\/g, ' ')}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
                        <div>{checkLike ?
                             <div className="getBoard" onClick={like}><img src={likeA} style={{width: "30px"}}></img></div>
                            : 
                            <div className="getBoard" onClick={like}><img src={likeN} style={{width: "30px"}}></img></div>
                        }
                        </div>
                        <div className="btnArea">
                            {data.userid == loginUser ?
                                <>
                                    <div>
                                        <input className="btn bgBtn" type="button" value="수정" onClick={() => {
                                            navigate('/board/modify', { state: { "cri": cri, "boardnum": data.boardnum } })
                                        }}></input>
                                    </div>
                                    <div>
                                        <input className="btn bgBtn" type="button" value="삭제" onClick={remove}></input>
                                    </div>
                                    <div>
                                        <input className="btn bgBtn" type="button" value="목록" onClick={() => {
                                            navigate('/board/list', { state: cri })
                                        }}></input>
                                    </div>
                                </> :
                                <div>
                                    <input className="btn bgBtn" type="button" value="목록" onClick={() => {
                                        navigate('/board/list', { state: cri })
                                    }}></input>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="reply_line">
                        <div className="reply_write rpBody_wrap">
                            {loginUser == "" ? <div style={{textAlign:"center", width:"900px"}}>로그인 하셔야 댓글을 등록할 수 있습니다.</div>
                                : <>
                                    <div style={{width:"40px"}}>{loginUser}</div>
                                    <div className="rpBody">
                                        <textarea name="replycontents" id="replycontents"  className="replycontents" placeholder="댓글 입력"></textarea>
                                        <div className="rpBtn">
                                            <input type="button" value="등록" className="btn rpreg" onClick={clickRegist} />
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                        <ul className="replies">
                            {replyList}
                        </ul>
                        <div className="page">
                            {paging}
                        </div>
                        <div ref={replyEndRef}></div>
                    </div>
                    <div className="popup">
                        <a onClick={() => openNoteModal()}>쪽지 보내기</a>
                        <a onClick={() => openModal()}>회원 정보</a>
                    </div>
                </div>
                <div className="BoardModal">
                    <Modal isOpen={isModalOpen} closeModal={closeModal}>
                        <p className="id">{user.userid}님의 정보</p>
                        <div className="closeBoardModal" onClick={() => {
                            setIsModalOpen(false);
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
            </>
        )
    }
}
export default BoardGet;