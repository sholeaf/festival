import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import Pagination from "../../components/Paginstion";
import axios from "axios";

const BoardReport = ({loginUser, cri, setCri, key}) =>{
    const navigate = useNavigate();
    const location = useLocation();
    const sendedCri = location.state;
    const [boardList, setBoardList] = useState([]);
    const [data, setData] = useState([]);
    const [viewMode, setViewMode] = useState('쪽지리스트');
    console.log("Boardcri : ",cri);
    
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
    };
    const searchenter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            clickSearch(e);
        }
    };
    // 게시글 API 호출
    useEffect(() => {
        const temp = {
            ...cri, 
            amount: 5   
        };
        axios.get(`/api/adminpage/${cri.pagenum}`, { params: temp })
            .then((resp) => {
                setData(resp.data);
                setPageMaker(resp.data.pageMaker);
                setInputs(resp.data.pageMaker.cri.keyword);
            })
            .catch((error) => {
                console.error('게시글 API 호출 오류:', error);
            });
    }, [cri,boardList]);
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
    // 검색 타입
    const searchType = {
        "전체": "a", "제목": "T", "내용": "C", "작성자": "W"
    };
    const changeType = (value) => {
        const changedCri = { ...cri, type: value };
        setCri(changedCri);
    };
    return (
        <>
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
                                    <hr />
                                    <Pagination pageMaker={pageMaker} url="/notice/adminpage" />
                                </div>
                                <div className="search_area">
                                    <form name="searchForm" action="/notice/adminpage" className="row searchrow">
                                        <Dropdown list={searchType} name={"type"} width={100} value={cri.type[0]}  onChange={changeType}></Dropdown>
                                        <input type="search" id="keyword" name="keyword" onChange={inputKeyword} value={inputs || ""} onKeyDown={searchenter} />
                                        <a id="search-btn" className="btn" onClick={(e) =>clickSearch(e)}>검색</a>
                                        <input type="hidden" name="pagenum" />
                                        <input type="hidden" name="amount" />
                                    </form>
                                </div>
                            </div>

                        </div>
        </>
    )
}
export default BoardReport;