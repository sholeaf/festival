import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/Paginstion";
import Header from "../../layout/Header";
import Modal from "../../components/Modal";
import Note from "../notes/Note";

const Adminpage = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const sendedCri = location.state;
    const { boardnum } = props;
    const [ loginUser, setLoginUser] = useState("");
    const [boardList, setBoardList] = useState([]);
    const [replyReportList, setReplyReportList] =useState([]);
    const [test, setTest] = useState([]);
    useEffect(() => {
        console.log("상태업데이트");
    }, [replyReportList, boardList]);
    //로그인체크
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
        amount: 10,
        type: "a", // 검색 타입: "전체", "제목", "내용", "작성자" 등
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


    // 모달창 영역
    
    const [modalData, setModalData] = useState(null); // Modal에 표시할 데이터
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReplyData, setSelectedReplyData] = useState(null);
    const openModal = (replynum) => {
        // modalData에서 해당 댓글을 찾아 모달에 전달
        if (!modalData || modalData.length === 0) {
            console.error("modalData가 비어있거나 null입니다.");
            return;
        }
    
        const selectedReply = modalData.find(reply => reply.replynum === replynum);
        console.log("모달창에 신고내용 띄우기:", selectedReply);
    
        if (selectedReply) {
            setSelectedReplyData(selectedReply);  // 선택된 댓글 데이터를 모달에 전달
            setIsModalOpen(true);  // 모달 열기
        } else {
            console.error("해당 댓글을 찾을 수 없습니다.");
        }
    };
    
    // 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReplyData(null);  // 모달 닫을 때만 데이터 초기화
    };
    const [inputs, setInputs] = useState(""); // 검색어 상태

    // 검색어 입력
    const inputKeyword = (e) => {
        setInputs(e.target.value);
    };

    // 검색 버튼 클릭
    const clickSearch = (e) => {
        e.preventDefault();
        const changedCri = {
            ...cri,
            type: document.getElementById("type").value,
            keyword: inputs,
            pagenum: 1 // 검색 시 페이지를 1로 리셋
        };
        setCri(changedCri);
    };

    // 엔터키로 검색
    const searchenter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            clickSearch(e);
        }
    };

    // cri가 변경될 때마다 API를 호출하여 데이터 불러오기
    useEffect(() => {
        const temp = {
            pagenum: cri.pagenum,
            amount: cri.amount,
            type: cri.type,
            keyword: cri.keyword,
            startrow: cri.startrow
        };

        // API 호출
        axios.get(`/api/adminpage/${cri.pagenum}`, { params: temp })
            .then((resp) => {
                setData(resp.data);
                console.log("신고게시판호출",resp.data)           // 데이터 세팅
                setPageMaker(resp.data.pageMaker); // 페이지네이션 설정
                setInputs(resp.data.pageMaker.cri.keyword);
            })
            .catch((error) => {
                console.error('API 호출 오류:', error);
            });
    }, [cri,boardList]);


    // location.state가 있을 때 cri 상태 업데이트
    useEffect(() => {
        if (location.state) {
            setCri(location.state);
        }
    }, [location.state]);

    //댓글신고목록 불러오기
   
    useEffect(() => {
        const temp = {
            pagenum: cri.pagenum,
            amount: cri.amount,
            type: cri.type,
            keyword: cri.keyword,
            startrow: cri.startrow
        };
        axios.get(`/api/adminpage/replyreportlist/${cri.pagenum}`, {params: temp})  // 게시글의 댓글 신고 목록 가져오기
            .then((resp) => {
                console.log("댓글신고목록 api 요청",resp.data)
                setReplyReportList(resp.data);  // 댓글 신고 목록을 상태로 저장
                setModalData(Array.isArray(resp.data.board) ? resp.data.board : []);
            })
            .catch((error) => {
                console.log("댓글 신고 목록 오류", error);
            });
    }, [cri,test]);
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
                delay: index * 0.5 // 각 글자에 0.5초씩 딜레이
            }));
            setChars(splitText);
        }
    }, [data]);

    // 데이터가 없을 때 로딩 텍스트 표시
    if (!data) {
        return (
            <div className="loading-text">
                {chars.map((item, index) => (
                    <span
                        key={index}
                        style={{
                            animationDelay: `${item.delay}s`, // 각 글자에 대한 딜레이
                        }}
                    >
                        {item.char}
                    </span>
                ))}
            </div>
        );
    }
    //신고목록
     // 신고 횟수 리셋 처리
     const handleReportReset = (boardnum) => {
        if (window.confirm('신고 해제를 하시겠습니까?')) {
            axios.delete(`/api/adminpage/boardReportreset/${boardnum}`)
                .then(response => {
                    console.log("신고 횟수 리셋됨:", response.data);
                    setBoardList(prevBoards => prevBoards.filter(board => board.boardnum !== boardnum));
                    alert('신고 해제 완료.');
                    // navigate('/notice/adminpage', { state: { pagenum: 1 } });
                })
                .catch(error => {
                    console.error("서버 업데이트 실패:", error);
                    alert("신고 해제 실패.");
                });
        } else {
            console.log("신고 횟수 리셋이 취소되었습니다.");
        }
    };
    
    //게시글 삭제
    const deleteList = (boardnum) => {
        
            if (window.confirm('정말로 삭제하시겠습니까?')) {
                axios.delete(`/api/adminpage/boardremove/${boardnum}`)
                    .then((response) => {
                        console.log(response.data); // 삭제 성공 메시지
                        // 삭제 후 클라이언트에서 해당 게시글만 제거
                        setBoardList(prevBoards => prevBoards.filter(board => board.boardnum !== boardnum));
                        alert('게시글이 삭제되었습니다.');
                        // navigate('/notice/adminpage', { state: { pagenum: 1 } });
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
    const replyReset = (replynum) => {
        if (window.confirm('신고를 해제하시겠습니까?')) {
            axios.delete(`/api/adminpage/replyreset/${replynum}`)
                .then((response) => {
                    console.log("신고 해제 성공:", response.data);
                        setTest("check ok");
                    // 신고 해제된 댓글을 상태에서 제거
                        setReplyReportList(prevReplies => 
                        Array.isArray(prevReplies) ? prevReplies.filter(reply => reply.replynum !== replynum) : []
                    );
    
                    alert('신고 해제 완료.');
                    // navigate('/notice/adminpage', { state: { pagenum: 1 } });
                })
                .catch((error) => {
                    console.log("신고해제 실패", error);
                    alert("신고 해제 실패.");
                });
        }
    };

    const deletereply =(replynum)=>{
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            axios.delete(`/api/adminpage/${replynum}`)
                .then((resp) => {
                    console.log(resp.data); 
                    setTest("check ok");
                    setReplyReportList(prevReplies => 
                        Array.isArray(prevReplies) ? prevReplies.filter(reply => reply.replynum !== replynum) : []
                    );
                    alert('게시글이 삭제되었습니다.');
                    // navigate('/notice/adminpage', { state: { pagenum: 1 } });
                })
                .catch((error) => {
                    console.error('게시글 삭제 실패:', error);
                    alert('게시글 삭제에 실패했습니다.');
                });
        }
    }
    
    //댓글신고목록
    const replyList = replyReportList.board;
    const reply_reportList = [];
if (replyList && replyList.length > 0) {
    for (const reply of replyList) {
        reply_reportList.push(
            <div className="row" key={reply.replynum}>
                <div>{reply.boardnum}</div>
                <div>{reply.replynum}</div>
                <div className="replylimited-text" onClick={()=>{openModal(reply.replynum)}}>{reply.replycontent}</div>
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
        <div className="row no-report" key={-1}>
            <div>신고된 댓글이 없습니다.</div>
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
            <div>
                <Note loginUser={loginUser} />
            </div>
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
                <Pagination pageMaker={pageMaker}></Pagination>
                </div>
            </div>
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
                <Pagination pageMaker={pageMaker}></Pagination>
                </div>
                
            </div>
            <div className="nsearch_area adminsearch_area">
                <form name="searchForm" action="/notice/adminpage" className="row searchrow">
                    <Dropdown list={searchType} name={"type"} width={250} value={cri.type} onChange={changeType}></Dropdown>
                    <input type="search" id="nkeyword" name="keyword" onChange={inputKeyword} value={inputs} onKeyDown={searchenter} />
                    <a id="nsearch-btn" className="btn" onClick={clickSearch}>검색</a>
                    <input type="hidden" name="pagenum" />
                    <input type="hidden" name="amount" />
                </form>
            </div>
            {isModalOpen && modalData && (
                <div className="replycontentmodal">
                <div className="replymodal">
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
