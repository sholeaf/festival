import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../../components/Paginstion";
import Dropdown from "../../components/Dropdown";

const ReplyReport = ( cri, setCri, pageMaker, setPageMaker) => {
    const [replyReportList, setReplyReportList] = useState([]);
    const [inputs, setInputs] = useState("");
    
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReplyData, setSelectedReplyData] = useState(null);

    // 댓글 신고 리스트 요청
    useEffect(() => {
        const temp = {
            pagenum: cri.pagenum,
            amount: cri.amount,
            type: cri.type,
            keyword: cri.keyword,
            startrow: cri.startrow
        };
        axios.get(`/api/adminpage/replyreportlist/${cri.pagenum}`, { params: cri })
            .then((resp) => {
                setReplyReportList(resp.data);
                setPageMaker(resp.data.pageMaker);
                setInputs(resp.data.pageMaker.cri.keyword);
            })
            .catch((error) => {
                console.log("댓글 신고 목록 오류:", error);
            });
    }, [cri, setPageMaker]);

    // 검색 함수
    const replySearch = (e) => {
        e.preventDefault();
        const changedCri = {
            ...cri,
            type: document.getElementById("type").value,
            keyword: inputs,
            pagenum: 1
        };
        setCri(changedCri);
    };

    // Enter 키로 검색
    const searchenter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            replySearch(e);
        }
    };

    // 모달 열기
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

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReplyData(null);
    };

    // 댓글 신고 해제
    const replyReset = (replynum) => {
        if (window.confirm('댓글 신고 해제를 하시겠습니까?')) {
            axios.delete(`/api/adminpage/replyReportReset/${replynum}`)
                .then(response => {
                    setReplyReportList(prevReplies => prevReplies.filter(reply => reply.replynum !== replynum));
                    alert('댓글 신고 해제 완료.');
                })
                .catch(error => {
                    alert('댓글 신고 해제 실패.');
                });
        }
    };

    // 댓글 삭제
    const deletereply = (replynum) => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            axios.delete(`/api/adminpage/replyRemove/${replynum}`)
                .then(response => {
                    setReplyReportList(prevReplies => prevReplies.filter(reply => reply.replynum !== replynum));
                    alert('댓글이 삭제되었습니다.');
                })
                .catch(error => {
                    alert('댓글 삭제 실패.');
                });
        }
    };

    // 댓글 목록 렌더링
    const list = replyReportList.board || [];
    const replyReportListEl = list.length === 0 ? (
        <div className="row">
            <div>내용 없음</div>
        </div>
    ) : list.map(reply => (
        <div className="row" key={reply.replynum}>
            <div>{reply.boardnum}</div>
            <div>{reply.replynum}</div>
            <div>{reply.replycontent}</div>
            <div>{reply.userid}</div>
            <div>
                <button onClick={() => replyReset(reply.replynum)}>신고해제</button>
                <button onClick={() => deletereply(reply.replynum)}>댓글삭제</button>
            </div>
        </div>
    ));

    return (
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
                    {replyReportListEl}
                </div>
                <Pagination pageMaker={pageMaker} url="/notice/adminpage" />
            </div>
            <div className="nsearch_area adminsearch_area">
                <form name="searchForm" className="row searchrow">
                    <Dropdown list={["a", "b", "c"]} name={"type"} width={250} value={cri.type} onChange={(e) => setCri({ ...cri, type: e.target.value })} />
                    <input type="search" id="nkeyword" name="keyword" onChange={(e) => setInputs(e.target.value)} value={inputs} onKeyDown={searchenter} />
                    <a id="nsearch-btn" className="btn" onClick={replySearch}>검색</a>
                </form>
            </div>
            {isModalOpen && selectedReplyData && (
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
    );
};

export default ReplyReport;
