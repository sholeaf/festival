import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/Paginstion";
import Header from "../../layout/Header";
import Note from "../notes/Note";
import ReplyReport from "../admin/ReplyReport";
import BoardReport from "../admin/BoardReport";

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
    const [trigger, setTrigger] = useState(false);

    // 상태 변화를 통해 리렌더링 트리거
    const forceRerender = () => {
        setTrigger(prev => !prev); // 상태를 변경하여 리렌더링을 유도
    };
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
        replytype: "a",
        replykeyword: "",
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
        pagenum:1,
        cri: null
    });
    const [replyPageMaker, setReplyPageMaker] = useState({
        startPage: 1,
        endPage: 1,
        realEnd: 1,
        total: 0,
        prev: false,
        next: false,
        pagenum:1,
        cri: null
    });


    useEffect(() => {
        // 게시글 페이지네이션 데이터가 로딩되었을 때 댓글 데이터를 불러옵니다.
        if (pageMaker.total > 0) {  // 페이지네이션 데이터가 있으면 댓글 데이터를 로딩
            fetchReplies(replyPageMaker.pagenum); // replyPageMaker의 pagenum을 기준으로 데이터를 불러옴
        }
    }, [pageMaker.total]);  // pageMaker.total이 변경될 때마다 실행됩니다.
    
    useEffect(() => {
        // replyPageMaker가 변경될 때마다 댓글 데이터를 불러옵니다.
        if (replyPageMaker.pagenum) {
            fetchReplies(replyPageMaker.pagenum);
        }
    }, [replyPageMaker.pagenum]);

    // cri.pagenum이 변경될 때마다 데이터를 다시 불러옵니다.
  useEffect(() => {
    fetchReplies(cri.pagenum); // cri.pagenum이 변경되면 데이터를 다시 가져옵니다.
  }, [cri.pagenum]);

    const handlePageChange = (newPageNum) => {
        setCri(prevCri => ({
            ...prevCri,
            pagenum: newPageNum
          }));
    };
    //탑버튼 눌렀을때

    
    const [key, setKey] = useState(0);
    const topButtonClick = (viewMode) => {
        setViewMode(viewMode);
        setCri(
            prevCri => ({
                ...prevCri,
                pagenum: 1
            })

        )
        setKey(prevKey => prevKey + 1);
    }
    useEffect(() => {
        setCri(prevCri => ({
            ...prevCri,
            pagenum: 1  // viewMode가 변경되면 pagenum을 1로 초기화
        }));
    }, [viewMode]);

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
        console.log("검색시 게시글 넘어가는 cri", replyCri);
        setCri(changedCri);  // board에 대한 상태만 업데이트
    };

    const replySearch = (e) => {
        e.preventDefault();
        const changedCri = {
            ...replyCri,
            replytype: document.getElementById("type").value,
            replykeyword: replyInputs,
            pagenum: 1
        };
        console.log("검색시 댓글 넘어가는 cri", replyCri);
        setReplyCri(changedCri);  // reply에 대한 상태만 업데이트
        fetchReplies(1, changedCri);
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

    useEffect(() => {
        // 게시글 API 호출
        axios.get(`/api/adminpage/${cri.pagenum}`, { params: cri })
            .then((resp) => {
                setData(resp.data);
                setPageMaker(resp.data.pageMaker);
                setInputs(resp.data.pageMaker.cri.keyword);
            })
            .catch((error) => {
                console.error('게시글 API 호출 오류:', error);
            });
    }, [cri,boardList]);  // cri 상태만 의존성 배열에 넣어 cri가 변경될 때만 호출
    
    // 댓글 데이터를 가져오는 함수 fetchReplies 정의
    const fetchReplies = async (pagenum, replyCri) => {
        const temp = {
            pagenum: cri.pagenum,
            amount: cri.amount,
            type: cri.type,
            keyword: cri.keyword,
            startrow: cri.startrow
        };
        console.log("amount:",cri.amount);
        try {
            const response = await axios.get(`/api/adminpage/replyreportlist/${cri.pagenum}`, { params: replyCri });
            setTest(response.data);
            console.log("댓글데이터리스트test:",setTest);
            setReplyPageMaker(response.data.pageMaker); // 페이지네이션 정보 업데이트
            setModalData(Array.isArray(response.data.board) ? response.data.board : []); // 모달 데이터 업데이트
        } catch (error) {
            console.error("댓글 데이터를 불러오는 중 오류 발생:", error);
        }
    };

    // useEffect 안에서 댓글 데이터를 불러오기 위해 호출
    useEffect(() => {
        fetchReplies(replyCri.pagenum); // 댓글을 불러옵니다.
    }, [replyCri.pagenum]);  // 페이지 번호가 바뀔 때마다 호출됩니다.// replyCri가 변경될 때마다 댓글 데이터를 불러옴
    useEffect(() => {
        if (replyCri.pagenum) {
            fetchReplies(replyCri.pagenum, replyCri); // replyCri 상태를 파라미터로 넘겨줍니다.
        }
    }, [replyCri, ]);
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
                    forceRerender();  // 강제 리렌더링
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
                    forceRerender();  // 강제 리렌더링
                    alert('게시글이 삭제되었습니다.');
                })
                .catch((error) => {
                    console.error('게시글 삭제 실패:', error);
                    alert('게시글 삭제에 실패했습니다.');
                });
        }
    };
   
    // 댓글 신고 해제 함수
    const replyReset = (replynum) => {
        if (window.confirm('댓글 신고 해제를 하시겠습니까?')) {
            axios.delete(`/api/adminpage/replyreset/${replynum}`)
                .then(response => {
                    console.log("댓글 신고 해제됨:", response.data);
                    setReplyReportList(prevReplies => prevReplies.filter(reply => reply.replynum !== replynum));
                    forceRerender();  // 강제 리렌더링
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
            axios.delete(`/api/adminpage/replyremove/${replynum}`)
                .then(response => {
                    console.log("댓글 삭제됨:", response.data);
                    setReplyReportList(prevReplies => prevReplies.filter(reply => reply.replynum !== replynum));
                    forceRerender();  // 강제 리렌더링
                    alert('댓글이 삭제되었습니다.');
                })
                .catch(error => {
                    console.error("댓글 삭제 실패:", error);
                    alert('댓글 삭제 실패.');
                });
        }
    };

    const replyList = test.board;
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

    const changeType = (value, type) => {
        if (type === 'board') {
            // 게시글 검색에서 사용하는 cri의 type 값만 업데이트
            setCri(prevCri => ({
                ...prevCri,
                type: value
            }));
        } else if (type === 'reply') {
            // 댓글 검색에서 사용하는 replyCri의 type 값만 업데이트
            setReplyCri(prevReplyCri => ({
                ...prevReplyCri,
                type: value
            }));
        }
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
                            <Note loginUser={loginUser} viewMode={viewMode} cri={cri} setCri={setCri} key={key} />
                        </div>
                    )}

                    {viewMode === '게시글리스트' && (
                        <div className="boardlist">
                           <BoardReport loginUser={loginUser} viewMode={viewMode} cri={cri} setCri={setCri} key={key}></BoardReport>

                        </div>
                    )}

                    {viewMode === '댓글리스트' && (
                        <div className="replylist">
                            <ReplyReport loginUser={loginUser} viewMode={viewMode} cri={cri} setCri={setCri} key={key}></ReplyReport>
                        </div>
                    )}

                </div>

                {isModalOpen && modalData && (
                    <div className="notesend-modal-overlay" onClick={closeModal}>
                        <div className="replymodaloverlay"></div>
                        <div className="replymodal" onClick={(e) => e.stopPropagation()}>
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
