import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../components/Paginstion";
import Dropdown from "../../components/Dropdown";

const ReplyReport =({loginUser,cri, setCri,key}) =>{
    const navigate = useNavigate();
    const location = useLocation();
    const sendedCri = location.state;
    const [replyReportList, setReplyReportList] = useState([]);
    const [data, setData] = useState([]);
    const [viewMode, setViewMode] = useState('쪽지리스트');
    console.log("replycri : ",cri);
    
    
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
    const inputKeyword = (e) => {
        setInputs(e.target.value);
    };
    const clickSearch = (e) => {
        e.preventDefault();
        const changedCri = {
            ...cri,
            type: document.getElementById("type").value,
            keyword: inputs,
            pagenum: 1
        };
        setCri(changedCri);  // reply에 대한 상태만 업데이트
        setInputs(""); 
        document.getElementById("type").value = "";
    };
    
    const searchenter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            clickSearch(e);
        }
    };
    // 댓글 API 호출
    useEffect(() => {
        const temp = {
            ...cri, 
            amount: 5,
            
        };
        axios.get(`/api/adminpage/replyreportlist/${cri.pagenum}`, { params: temp })
            .then((resp) => {
                setData(resp.data);
                setPageMaker(resp.data.pageMaker);
                setInputs(resp.data.pageMaker.cri.keyword);
                setModalData(Array.isArray(resp.data.board) ? resp.data.board : []); 
            })
            .catch((error) => {
                console.error('댓글 API 호출 오류:', error);
            });
    }, [cri,replyReportList]);
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
    // 댓글 신고 해제 함수
    const replyReset = (replynum) => {
        if (window.confirm('댓글 신고 해제를 하시겠습니까?')) {
            axios.delete(`/api/adminpage/replyreset/${replynum}`)
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
            axios.delete(`/api/adminpage/replyremove/${replynum}`)
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

    const replyList = data.board;
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
            <div className="row no-report" key={-1}>
                <div>신고된 댓글이 없습니다.</div>
            </div>
        );
    }
    // 검색 타입
    const searchType = {
        "전체": "a","내용": "C", "작성자": "W"
    };
    const changeType = (value) => {
        const changedCri = { ...cri, type: value };
        setCri(changedCri);
    };
    return(
        <>
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
                                    <hr />
                                    <Pagination pageMaker={pageMaker} url="/notice/adminpage" />
                                </div>
                                <div className="search_area">
                                    <form name="searchForm" action="/notice/adminpage" className="row searchrow">
                                        <Dropdown list={searchType} name={"type"} width={100} value={cri.type[0]} onChange={changeType}></Dropdown>
                                        <input type="search" id="keyword" name="keyword" onChange={inputKeyword} value={inputs || ""} onKeyDown={searchenter} />
                                        <a id="search-btn" className="btn" onClick={(e) => clickSearch(e)}>검색</a>
                                        <input type="hidden" name="pagenum"value={cri.pagenum} />
                                        <input type="hidden" name="amount"value={cri.amount}/>
                                    </form>
                                </div>
                            </div>

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
        </>
    )
}
export default ReplyReport;