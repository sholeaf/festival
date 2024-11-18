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
    const openModal = (notenum) => {
        axios.get(`/api/note/${notenum}`)
            .then((resp) => {
                setModalData(resp.data);  // Modal에 보여줄 데이터
                setIsModalOpen(true);      // Modal 열기
            })
            .catch((error) => {
                console.error("쪽지 세부 정보 호출 중 오류:", error);
            });
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);  // Modal 닫을 때 데이터 초기화
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
                setData(resp.data);           // 데이터 세팅
                setPageMaker(resp.data.pageMaker); // 페이지네이션 설정
                setInputs(resp.data.pageMaker.cri.keyword);
            })
            .catch((error) => {
                console.error('API 호출 오류:', error);
            });
    }, [cri]);

    // location.state가 있을 때 cri 상태 업데이트
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

    const list = data.board;
    const elList = [];
    if (list && list.length >= 0) {
        // 신고 횟수가 5 이상인 게시글만 표시
        for (const board of list) {
            if (board.reportcnt >= 5) {
                elList.push(
                    <div className="row" key={board.boardnum} >
                        <div>{board.boardnum}</div>
                        <div><a className="get" onClick={() => {
                            navigate(`/board/${board.boardnum}`, { state: cri });
                        }}>{board.boardtitle}</a></div>
                        <div>{board.userid}</div>
                        <div>{board.boardregdate}</div>
                        <div>
                            {/* 클릭 시 신고 횟수 0으로 변경 */}
                            <a onClick={() => handleReportReset(board.boardnum)}>
                                {board.reportcnt}
                            </a>
                        </div>
                    </div>
                );
            }
        }

        // 신고 횟수가 5 이상인 게시글이 없으면 "신고된 게시글이 없습니다." 메시지 표시
        if (elList.length === 0) {
            elList.push(
                <div className="row no-report" key={-1}>
                    <div>신고된 게시글이 없습니다.</div>
                </div>
            );
        }
    }

    // 검색 타입
    const searchType = {
        "전체": "a", "제목": "T", "내용": "C", "작성자": "W", "제목 또는 작성자": "TW", "제목 또는 내용": "TC", "제목 또는 작성자 또는 내용": "TCW"
    };

    const changeType = (value) => {
        const changedCri = { ...cri, type: value };
        setCri(changedCri);
    };

    // 신고 횟수 리셋 처리
    const handleReportReset = (boardnum) => {
        // 서버에 신고 횟수를 0으로 업데이트 요청
        axios.post('/api/adminpage/updateReportCount', { boardnum, reportcnt: 0 })
            .then(response => {
                console.log("신고 횟수 리셋됨:", response.data);
                // 리셋 후 상태 업데이트
                setData(prevData => ({
                    ...prevData,
                    board: prevData.board.map(board => 
                        board.boardnum === boardnum 
                        ? { ...board, reportcnt: 0 } 
                        : board
                    )
                }));
            })
            .catch(error => {
                console.error("서버 업데이트 실패:", error);
            });
    };

    return (
        <>
            <Header />
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
                        </div>
                    </div>
                    <div className="rptbody">
                        {elList}
                    </div>
                <Pagination pageMaker={pageMaker}></Pagination>
                </div>
            </div>
            <div className="nsearch_area">
                <form name="searchForm" action="/notice/adminpage" className="row">
                    <Dropdown list={searchType} name={"type"} width={250} value={cri.type} onChange={changeType}></Dropdown>
                    <input type="search" id="nkeyword" name="keyword" onChange={inputKeyword} value={inputs} onKeyDown={searchenter} />
                    <a id="nsearch-btn" className="btn" onClick={clickSearch}>검색</a>
                    <input type="hidden" name="pagenum" />
                    <input type="hidden" name="amount" />
                </form>
            </div>
        </>
    );
};

export default Adminpage;
