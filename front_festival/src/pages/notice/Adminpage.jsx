import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/Paginstion";
import Header from "../../layout/Header";
import Note from "../notes/Note";

const Adminpage = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const sendedCri = location.state;
    const { boardnum } = props;
    const [loginUser, setLoginUser] = useState("");
    const [boardList, setBoardList] = useState([]);
    const [replyReportList, setReplyReportList] = useState([]);
    const [test, setTest] = useState([]);
    const [viewMode, setViewMode] = useState('쪽지리스트');  // 초기 화면을 '쪽지리스트'로 설정

    useEffect(() => {
        console.log("상태업데이트");
        console.log("location.state:", location.state);
        console.log("sendedCri 상태:", sendedCri);
    }, [replyReportList, boardList]);

    // 로그인 체크
    useEffect(() => {
        axios.get(`/api/user/loginCheck`)
            .then((resp) => {
                setLoginUser(resp.data);
            })
            .catch((error) => {
                console.error("로그인 상태 확인 오류: ", error);
            });
    }, []);

    const [cri, setCri] = useState({
        pagenum: 1,
        amount: 5,
        type: "a", 
        keyword: "",
        startrow: 0
    });
    const [replyCri, setReplyCri] = useState({
        pagenum: 1,
        amount: 5,
        type: "a", 
        keyword: "",
        startrow: 0
    });

    const [data, setData] = useState();
    const [pageMaker, setPageMaker] = useState({
        startPage: 1,
        endPage: 1,
        realEnd: 1,
        total: 0,
        prev: false,
        next: false,
        cri: null
    });
    const [replyPageMaker, setReplyPageMaker] = useState({
        startPage: 1,
        endPage: 1,
        realEnd: 1,
        total: 0,
        prev: false,
        next: false,
        cri: null
      });
      //탑버튼 눌렀을때
      const [key, setKey] = useState(0);
    const topButtonClick =(viewMode) =>{
        setViewMode(viewMode);
        setCri(
            prevCri =>({
                ...prevCri,
                pagenum:1
            })
            
        )
        setKey(prevKey => prevKey + 1);
    }
    
    // 모달창
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReplyData, setSelectedReplyData] = useState(null);
    const openModal = (replynum) => {
        if (!modalData || modalData.length === 0) {
            console.error("modalData가 비어있거나 null입니다.");
            return;
        }
    
        const selectedReply = modalData.find(reply => reply.replynum === replynum);
        console.log("모달창에 신고내용 띄우기:", selectedReply);
    
        if (selectedReply) {
            setSelectedReplyData(selectedReply);
            setIsModalOpen(true);
        } else {
            console.error("해당 댓글을 찾을 수 없습니다.");
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReplyData(null);
    };


    const [inputs, setInputs] = useState("");
    const [replyInputs, setReplyInputs] = useState("");
    const inputKeyword = (e) => {
        setInputs(e.target.value);
    };
    const inputreplyKeyword = (e) => {
        setReplyInputs(e.target.value);
    };
    const boardSearch = (e) => {
        e.preventDefault();
        const changedCri = {
            ...cri,
            type: document.getElementById("type").value,
            keyword: inputs,
            pagenum: 1
        };
        setCri(changedCri);  // board에 대한 상태만 업데이트
    };
    
    const replySearch = (e) => {
        e.preventDefault();
        const changedCri = {
            ...replyCri,
            type: document.getElementById("type").value,
            keyword: replyInputs,
            pagenum: 1
        };
        setReplyCri(changedCri);  // reply에 대한 상태만 업데이트
    };
    
    const searchenter = (e, type) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (type === 'board') {
                boardSearch(e);  // board 검색
            } else if (type === 'reply') {
                replySearch(e);  // reply 검색
            }
        }
    };

    // 게시글 신고 목록
useEffect(() => {
    const temp = {
        pagenum: cri.pagenum,
        amount: cri.amount,
        type: cri.type,
        keyword: cri.keyword,
        startrow: cri.startrow
    };
    axios.get(`/api/adminpage/${cri.pagenum}`, { params: cri })
    .then((resp) => {

            setData(resp.data);
            setPageMaker(resp.data.pageMaker);
            console.log("게시글 pageMaker 데이터:", resp.data.pageMaker);
            setInputs(resp.data.pageMaker.cri.keyword);
        })
        .catch((error) => {
            console.error('게시글 API 호출 오류:', error);
        });
}, [cri, boardList]);  // cri만 의존성 배열에 넣어서 cri 변경 시만 호출


    // 댓글 신고 목록
useEffect(() => {
    const temp = {
        pagenum: replyCri.pagenum,
        amount: replyCri.amount,
        type: replyCri.type,
        keyword: replyCri.keyword,
        startrow: replyCri.startrow
    };
    console.log("댓글cri전송:", replyCri);
    axios.get(`/api/adminpage/replyreportlist/${replyCri.pagenum}`, { params: replyCri })
    .then((resp) => {
            setReplyReportList(resp.data);
            console.log("댓글데이터내용",resp.data);
            setReplyPageMaker(resp.data.pageMaker);
            console.log("댓글 신고 pageMaker 데이터:", resp.data.pageMaker);
            console.log("댓글페이지메이커셋팅:",replyPageMaker);
            setInputs(resp.data.pageMaker.cri.keyword);
            setModalData(Array.isArray(resp.data.board) ? resp.data.board : []);
        })
        .catch((error) => {
            console.log("댓글 신고 목록 오류:", error);
        });
}, [replyCri, test]); 

    useEffect(() => {
        if (location.state) {
            setCri(location.state);
        }
    }, [location.state]);
// 로딩 화면 텍스트 애니메이션
    const [chars, setChars] = useState([]);
    useEffect(() => {
        if (!data) {
            const text = "로딩중...";
            const splitText = text.split("").map((char, index) => ({
                char,
                delay: index * 0.5
            }));
            setChars(splitText);
        }
    }, [data]);

    if (!data) {
        return (
            <div className="loading-text">
                {chars.map((item, index) => (
                    <span
                        key={index}
                        style={{
                            animationDelay: `${item.delay}s`,
                        }}
                    >
                        {item.char}
                    </span>
                ))}
            </div>
        );
    }

    const handleReportReset = (boardnum) => {
        if (window.confirm('신고 해제를 하시겠습니까?')) {
            axios.delete(`/api/adminpage/boardReportreset/${boardnum}`)
                .then(response => {
                    console.log("신고 횟수 리셋됨:", response.data);
                    setBoardList(prevBoards => prevBoards.filter(board => board.boardnum !== boardnum));
                    alert('신고 해제 완료.');
                })
                .catch(error => {
                    console.error("서버 업데이트 실패:", error);
                    alert("신고 해제 실패.");
                });
        } else {
            console.log("신고 횟수 리셋이 취소되었습니다.");
        }
    };
    
    const deleteList = (boardnum) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            axios.delete(`/api/adminpage/boardremove/${boardnum}`)
                .then((response) => {
                    console.log(response.data);
                    setBoardList(prevBoards => prevBoards.filter(board => board.boardnum !== boardnum));
                    alert('게시글이 삭제되었습니다.');
                })
                .catch((error) => {
                    console.error('게시글 삭제 실패:', error);
                    alert('게시글 삭제에 실패했습니다.');
                });
        }
    };
    const list = data.board;
    const elList = [];
    if (!list || list.length === 0) {
        // list가 비어 있으면 바로 "신고된 게시글이 없습니다." 메시지를 추가
        elList.push(
            <div className="row no-report" key={-1}>
                <div>신고된 게시글이 없습니다.</div>
            </div>
        );
    } else {
        // list가 비어있지 않으면 게시글 목록을 순차적으로 렌더링
        for (const board of list) {
            elList.push(
                <div className="row" key={board.boardnum}>
                    <div>{board.boardnum}</div>
                    <div>
                        <a
                            className="get"
                            onClick={() => {
                                navigate(`/board/${board.boardnum}`, { state: cri });
                            }}
                        >
                            {board.boardtitle}
                        </a>
                    </div>
                    <div>{board.userid}</div>
                    <div>{board.boardregdate}</div>
                    <div>{board.reportcnt}</div>
                    <div>
                        {/* 클릭 시 신고 횟수 0으로 변경 */}
                        <button onClick={() => handleReportReset(board.boardnum)}>신고해제</button>
                        <button onClick={() => deleteList(board.boardnum)}>게시글삭제</button>
                    </div>
                </div>
            );
        }
    }


    // 댓글 신고 해제 함수
    const replyReset = (replynum) => {
        if (window.confirm('댓글 신고 해제를 하시겠습니까?')) {
            axios.delete(`/api/adminpage/replyReportReset/${replynum}`)
                .then(response => {
                    console.log("댓글 신고 해제됨:", response.data);
                    setReplyReportList(prevReplies => prevReplies.filter(reply => reply.replynum !== replynum));
                    alert('댓글 신고 해제 완료.');
                })
                .catch(error => {
                    console.error("댓글 신고 해제 실패:", error);
                    alert('댓글 신고 해제 실패.');
                });
        }
    };

    // 댓글 삭제 함수
    const deletereply = (replynum) => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            axios.delete(`/api/adminpage/replyRemove/${replynum}`)
                .then(response => {
                    console.log("댓글 삭제됨:", response.data);
                    setReplyReportList(prevReplies => prevReplies.filter(reply => reply.replynum !== replynum));
                    alert('댓글이 삭제되었습니다.');
                })
                .catch(error => {
                    console.error("댓글 삭제 실패:", error);
                    alert('댓글 삭제 실패.');
                });
        }
    };

    const replyList = replyReportList.board;
    const reply_reportList = [];
    if (replyList && replyList.length > 0) {
        for (const reply of replyList) {
            reply_reportList.push(
                <div className="row" key={reply.replynum}>
                    <div>{reply.boardnum}</div>
                    <div>{reply.replynum}</div>
                    <div className="replylimited-text" onClick={() => { openModal(reply.replynum) }}>{reply.replycontent}</div>
                    <div>{reply.userid}</div>
                    <div>
                        <button onClick={() => replyReset(reply.replynum)}>신고해제</button>
                        <button onClick={() => deletereply(reply.replynum)}>댓글삭제</button>
                    </div>
                </div>
            );
        }
    }
    if (reply_reportList.length === 0) {
        reply_reportList.push(
            <div className="row">
                <div>내용 없음</div>
            </div>
        );
    }
// 검색 타입
const searchType = {
    "전체": "a", "제목": "T", "내용": "C", "작성자": "W", "제목 또는 작성자": "TW", "제목 또는 내용": "TC", "제목 또는 작성자 또는 내용": "TCW"
};

const changeType = (value) => {
    const changedCri = { ...cri, type: value };
    setCri(changedCri);
};

    return (
        <>
        <Header />
        <div className="noticeWrap">
            <div className="admin-top">
                <button onClick={() => topButtonClick('쪽지리스트')}>쪽지리스트</button>
                <button onClick={() => topButtonClick('게시글리스트')}>게시글리스트</button>
                <button onClick={() => topButtonClick('댓글리스트')}>댓글리스트</button>
            </div>

            <div className="content">
                {viewMode === '쪽지리스트' && (
                    <div className="noteList">
                         <Note loginUser={loginUser} viewMode={viewMode} cri={cri} setCri={setCri} key={key}/>
                    </div>
                )}

                {viewMode === '게시글리스트' && (
                    <div className="boardlist">
                       <div className="nwrap rplist" id="rpwrap">
                <div className="reporttitle">신고리스트</div>
                <div className="rplist rptable">
                    <div className="rpthead tac">
                        <div className="row">
                            <div>번호</div>
                            <div>제목</div>
                            <div>작성자</div>
                            <div>날짜</div>
                            <div>신고횟수</div>
                            <div>처리</div>
                        </div>
                    </div>
                    <div className="rptbody">
                        {elList}
                    </div>
                    <Pagination pageMaker={pageMaker} url="/notice/adminpage" />
                </div>
                <div className="nsearch_area adminsearch_area">
                <form name="searchForm" action="/notice/adminpage" className="row searchrow">
                    <Dropdown list={searchType} name={"type"} width={250} value={cri.type} onChange={changeType}></Dropdown>
                    <input type="search" id="nkeyword" name="keyword" onChange={inputKeyword} value={inputs} onKeyDown={(e) => searchenter(e, 'board')} />
                    <a id="nsearch-btn" className="btn" onClick={(e) => boardSearch(e)}>검색</a>
                    <input type="hidden" name="pagenum" />
                    <input type="hidden" name="amount" />
                </form>
            </div>
            </div>

                    </div>
                )}

                {viewMode === '댓글리스트' && (
                    <div className="replylist">
                        <div className="nwrap replyrplist" id="rpwrap">
                <div className="reporttitle">댓글신고리스트</div>
                <div className="replyrplist replyrptable">
                    <div className="replyrpthead tac">
                        <div className="row">
                            <div>게시글번호</div>
                            <div>댓글번호</div>
                            <div>댓글내용</div>
                            <div>작성자</div>
                            <div>처리</div>
                        </div>
                    </div>
                    <div className="replyrptbody">
                        {reply_reportList}
                    </div>
                    <Pagination pageMaker={replyPageMaker} url="/notice/adminpage" />
                </div>
                <div className="nsearch_area adminsearch_area">
                <form name="searchForm" action="/notice/adminpage" className="row searchrow">
                    <Dropdown list={searchType} name={"type"} width={250} value={replyCri.type} onChange={changeType}></Dropdown>
                    <input type="search" id="nkeyword" name="keyword" onChange={inputreplyKeyword} value={replyInputs} onKeyDown={(e) => searchenter(e, 'reply')} />
                    <a id="nsearch-btn" className="btn" onClick={(e) => replySearch(e)}>검색</a>
                    <input type="hidden" name="pagenum" />
                    <input type="hidden" name="amount" />
                </form>
            </div>
            </div>

                    </div>
                )}
                
            </div>

            {isModalOpen && modalData && (
                <div className="notesend-modal-overlay" onClick={closeModal}>
                <div className="replymodaloverlay"></div>
                <div className="replymodal"onClick={(e) => e.stopPropagation()}>
                  <h2>댓글 내용</h2>
                  <p>{selectedReplyData.replycontent}</p>
                  <p><strong>작성자:</strong> {selectedReplyData.userid}</p>
                  <p><strong>등록일:</strong> {selectedReplyData.replyregdate}</p>
                  <button onClick={closeModal}>닫기</button>
                </div>
              </div>
            )}
            
            </div>
        </>
    );
};

export default Adminpage;
