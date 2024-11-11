import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/Paginstion";

const Adminpage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const sendedCri = location.state;
    const [cri, setCri] = useState({
        pagenum: 1,
        amount: 10,
        type: "a",
        keyword: "",
        startrow: 0
    })

    const [data, setData] = useState();
    const [pageMaker, setPageMaker] = useState({
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
        const temp = {
            pagenum: cri.pagenum,
            amount: cri.amount,
            type: cri.type,
            Keyword: cri.keyword,
            startrow: cri.startrow
        }
        // axios.get(`/api/board_report/${cri.pagenum}`, { params: cri })
        //     .then((resp) => {
        //         setData(resp.data);
        //         setPageMaker(resp.data.pageMaker);
        //         setInputs(resp.data.pageMaker.cri.keyword);
        //     })
    },[cri]);
    useEffect(() => {
        if (location.state) {
            setCri(location.state);
        }
    }, [location.state]);

    if (!data) {
        return <>로딩중...</>
    }
    else {
        const list = data.list;
        const elList = [];
        if (list && list.length > 0) {
            for (const board of list) {
                elList.push(
                    <div className="row" key={board.boardnum} onclick={() => {
                        navigate(`/board/${board.baordnum}`, { state: cri })
                    }}>
                        <div>{board.boardnum}</div>
                        <div><a className="get">{board.boardtitle}</a></div>
                        <div>{board.userid}</div>
                        <div>{board.regdate}{board.regdate != board.updatedate ? "(수정)" : ""}</div>
                        <div>{board.reportCnt}</div>
                    </div>
                )
            }
        }
        else {
            elList.push(
                <div className=" row no-report" kyt={-1}>
                    <div>신고된 게시글이 없습니다.</div>
                </div>
            )
        }
         // 검색 타입
    const searchType = { "전체": "a", "제목": "T", "내용": "C","작성자":"W", "제목 또는 작성자":"TW", "제목 또는 내용": "TC","제목 또는 작성자 또는 내용":"TCW" };

    const changeType = (value) => {
        const changedCri = { ...cri, type: value };
        setCri(changedCri);
    };

    // 관리자인지 확인
    const isAdmin = data.user && data.user.userid === "admin";

        return (
            <>
                <div className="adminpage" id="wrap">
                    <div className="adminpage ntable">
                        <div className="nthead tac">
                            <div className="row">
                                <div>번호</div>
                                <div>제목</div>
                                <div>작성자</div>
                                <div>날짜</div>
                                <div>신고횟수</div>
                            </div>
                        </div>
                    </div>
                    <div className="ntbody">
                        {elList}
                    </div>
                    <Pagination pageMaker={pageMaker}></Pagination>
                </div>
                <div className="asearch_area">
                    <form name="asearchForm" action="/notice/adminpage" className="row">
                        <Dropdown list={searchType} name={"type"} width={250} value={cri.type} onChange={changeType}></Dropdown>
                        <input type="search" id="keyword" name="keyword" onChange={inputKeyword} value={inputs} />
                        <a id="nsearch-btn" className="btn" onClick={clickSearch}>검색</a>
                        <input type="hidden" name="pagenum" />
                        <input type="hidden" name="amount" />
                    </form>
                </div>
            </>
        )
    }
}
export default Adminpage;