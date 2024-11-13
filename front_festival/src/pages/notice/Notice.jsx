import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import Pagination from "../../components/Paginstion";
import Header from "../../layout/Header";
import axios from "axios";

const Notice = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const sendedCri = location.state;

    const [cri, setCri] = useState(sendedCri || {
        pagenum: 1,
        amount: 10,
        type: "a",
        keyword: "",
        startrow: 0
    });
    useEffect(() => {
        console.log("location.state:", location.state);
        console.log("sendedCri 상태:", sendedCri);
    }, [sendedCri, location.state]);
    const [data, setData] = useState();
    const [pageMaker, setPageMaker] = useState({
        startpage: 1,
        endPage: 1,
        realEnd: 1,
        total: 0,
        prev: false,
        next: false,
        cri: null
    });

    const [inputs, setInputs] = useState("");

    const inputkeyword = (e) => {
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
        setCri(changedCri);
    };

    useEffect(() => {
        const temp = {
            pagenum: cri.pagenum,
            amount: cri.amount,
            type: cri.type,
            keyword: cri.keyword,
            startrow: cri.startrow
        };
        console.log("cri전송:", cri);
        axios.get(`/api/notice/list/${cri.pagenum}`, { params: cri })
            .then((resp) => {
                console.log("응답 데이터:", resp.data);
                setData(resp.data);
                setPageMaker(resp.data.pageMaker);
                setInputs(resp.data.pageMaker.cri.keyword);
            })
            .catch((error) => {
                console.error("API 호출 중 오류 :", error);
                if (error.response) {
                    // 서버 응답이 있을 경우, 서버에서 보낸 에러 메시지 확인
                    console.error('서버 응답 에러:', error.response.data);
                }
            });
    }, [cri]);
    useEffect(()=>{
        if(location.state){
            setCri(location.state);
        }
    },[location.state])
    // 데이터가 없을 때 로딩 텍스트 표시
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

    // 실제 데이터가 있을 경우 리스트 처리
    const list = data?.notice;
    const noticeList = [];
    if (list && list.length > 0) {
        for (const notice of list) {
            noticeList.push(
                <div className="row" key={notice.noticenum} onClick={() => {
                    navigate(`/notice/${notice.noticenum}`, { state: cri });
                }}>
                    <div>{notice.noticenum}</div>
                    <div>{notice.isNew ? <sup className="noticenew">New</sup> : ""}
                        <a className="nget">
                            {notice.noticetitle}<span id="nreply_cnt">[{notice.nreplyCnt}]</span>
                        </a>
                    </div>
                    <div>{notice.userid}</div>
                    <div>{notice.noticeregdate}{notice.noticeregdate !== notice.updatenoticedate ? "(수정)" : ""}</div>
                    <div>{notice.readcount}</div>
                </div>
            );
        }
    } else {
        noticeList.push(
            <div className="row no-list" key={-1}>
                <div>등록된 공지가 없습니다.</div>
            </div>
        );
    }

    // 검색 타입
    const searchType = { "전체": "a", "제목": "T", "내용": "C", "제목 또는 내용": "TC" };

    const changeType = (value) => {
        const changedCri = { ...cri, type: value };
        setCri(changedCri);
    };

    // 관리자인지 확인 (DB에서 userid가 "admin"인지 확인)
    const isAdmin = data && data.user && data.user.userid === "admin";  // 수정된 부분

    return (
        <>
            <Header />
            <div className="nwrap nlist" id="nwrap">
                <div className="notice-title">Notice</div>
                <div className="tar w1000 notice-cnt">글 개수 :{data.pageMaker.total} </div>
                <div className="nlist ntable">
                    <div className="nthead tac">
                        <div className="row">
                            <div>번호</div>
                            <div>제목</div>
                            <div>작성자</div>
                            <div>날짜</div>
                            <div>조회수</div>
                        </div>
                    </div>
                    <div className="ntbody">
                        {noticeList}
                    </div>
                </div>
                <Pagination pageMaker={pageMaker} />

                {/* 관리자일 때만 글쓰기 버튼 보이기 */}
                <div className={`nbtn_table ${isAdmin ? 'show' : ''}`}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <a className="nwrite nbtn" onClick={() => navigate("/notice/nwrite", { state: cri })}>글쓰기</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="nsearch_area">
                    <form name="searchForm" action="/notice/list" className="row">
                        <Dropdown list={searchType} name={"type"} width={250} value={cri.type} onChange={changeType}>
                        </Dropdown>
                        <input type="search" id="nkeyword" name="keyword" onChange={inputkeyword} value={inputs} />
                        <a id="nsearch-btn" className="btn" onClick={clickSearch}>검색</a>
                        <input type="hidden" name="pagenum" />
                        <input type="hidden" name="amount" />
                    </form>
                </div>
            </div>
        </>
    );
};

export default Notice;