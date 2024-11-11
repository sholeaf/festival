import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import Pagination from "../../components/Paginstion";
import Header from "../../layout/Header";

const Notice = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // cri 상태 정의
    const [cri, setCri] = useState({
        pagenum: 1,
        amount: 10,
        type: "a",
        keyword: "",
        startrow: 0
    });

    // 더미 데이터 설정
    const [data, setData] = useState({
        list: [
            { noticenum: 1, title: "공지사항 제목 1", replyCnt: 5, userid: "user1", regdate: "2024-11-01", updatedate: "2024-11-02", readcount: 10, newNotice: true },
            { noticenum: 2, title: "공지사항 제목 2", replyCnt: 3, userid: "user2", regdate: "2024-11-05", updatedate: "2024-11-05", readcount: 8, newNotice: false },
            { noticenum: 3, title: "공지사항 제목 3", replyCnt: 2, userid: "user3", regdate: "2024-10-28", updatedate: "2024-10-30", readcount: 15, newNotice: true },
            { noticenum: 4, title: "공지사항 제목 4", replyCnt: 2, userid: "user3", regdate: "2024-10-28", updatedate: "2024-10-30", readcount: 15, newNotice: true },
            { noticenum: 5, title: "공지사항 제목 5", replyCnt: 2, userid: "user3", regdate: "2024-10-28", updatedate: "2024-10-30", readcount: 15, newNotice: true },
            { noticenum: 6, title: "공지사항 제목 6", replyCnt: 2, userid: "user3", regdate: "2024-10-28", updatedate: "2024-10-30", readcount: 15, newNotice: true },
            { noticenum: 7, title: "공지사항 제목 7", replyCnt: 2, userid: "user3", regdate: "2024-10-28", updatedate: "2024-10-30", readcount: 15, newNotice: true },
            { noticenum: 8, title: "공지사항 제목 8", replyCnt: 2, userid: "user3", regdate: "2024-10-28", updatedate: "2024-10-30", readcount: 15, newNotice: true },
            { noticenum: 9, title: "공지사항 제목 9", replyCnt: 2, userid: "user3", regdate: "2024-10-28", updatedate: "2024-10-30", readcount: 15, newNotice: true },
            { noticenum: 10, title: "공지사항 제목 10", replyCnt: 2, userid: "user3", regdate: "2024-10-28", updatedate: "2024-10-30", readcount: 15, newNotice: true },
            { noticenum: 11, title: "공지사항 제목 11", replyCnt: 2, userid: "user3", regdate: "2024-10-28", updatedate: "2024-10-30", readcount: 15, newNotice: true },
        ],
        pageMaker: {
            startpage: 1,
            endPage: 3,
            realEnd: 3,
            total: 3,
            prev: false,
            next: false,
            cri: { ...cri }
        },
        user: { userid: "admin" } // admin 사용자 설정
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
    const list = data.list;
    const noticeList = [];
    if (list && list.length > 0) {
        for (const notice of list) {
            noticeList.push(
                <div className="row" key={notice.noticenum} onClick={() => {
                    navigate(`/notice/${notice.noticenum}`, { state: cri });
                }}>
                    <div>{notice.noticenum}</div>
                    <div>{notice.newNotice ? <sup className="noticenew">New</sup> : ""}
                    <a className="nget">
                        {notice.title}<span id="nreply_cnt">[{notice.replyCnt}]</span>
                    </a>
                    </div>
                    <div>{notice.userid}</div>
                    <div>{notice.regdate}{notice.regdate !== notice.updatedate ? "(수정)" : ""}</div>
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

    // 관리자인지 확인
    const isAdmin = data.user && data.user.userid === "admin";

    return (
        <>
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
                <Pagination pageMaker={data.pageMaker} />
                {isAdmin && (
                    <table className="nbtn_table">
                        <tbody>
                            <tr>
                                <td>
                                    <a className="nwrite nbtn" onClick={() => navigate("/notice/nwrite", { state: cri })}>글쓰기</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
                <div className="nsearch_area">
                    <form name="searchForm" action="/notice/notice" className="row">
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
