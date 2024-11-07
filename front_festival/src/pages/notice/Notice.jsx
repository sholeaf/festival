import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import Pagination from "../../components/Paginstion";
import Header from "../../layout/Header";

const Notice = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const sendedCri = location.state;

    const [cri, setCri] = useState({
        pagenum: 1,
        amount: 10,
        type: "a",
        keyword: "",
        startrow: 0
    });

    const [data, setData] = useState();
    const [pageMaker, setPageMaker] = useState({
        startpage: 1,
        endPage: 1,
        realEnd: 1,
        total: 0,
        prev: false,
        next: false,
        cri: null
    })

    const [inputs, setInputs] = useState("");
    const inputkeyword = (e) => {
        setInputs(e.target.value)
    }
    const clickSearch = (e) => {
        e.preventDrfault();
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
            keyword: cri.keyword,
            startrow: cri.startrow
        }
        axios.get(`/api/notice/notice/${cri.pagenum}`, { params: cri })
            .then((resp) => {
                setData(resp.data);
                setPageMaker(resp.data.pageMaker);
                setInputs(resp.data.pageMaker.cri.keyword);
            })
    }, [cri]);
    useEffect(() => {
        if (location.state) {
            setCri(location.state)
        }
    }, [location.state]);
    if (!data) {
        const text = "로딩중...";
        const [chars, setChars] = useState([]);

        useEffect(() => {
            const splitText = text.split('').map((char, index) => ({
                char,
                delay: index * 0.5 // 각 글자에 0.5초씩 딜레이
            }));
            setChars(splitText);
        }, []);

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
    else {
        const list = data.list;
        const noticeList = [];
        if (list && list.length > 0) {
            for (const notice of list) {
                noticeList.push(
                    <div class="row" key="{notice.noticenum}">
                        <div>{notice.noticenum}</div>
                        <div>{notice.newNotice ? <sup class="noticenew">New</sup> : ""}</div>
                        <a class="nget">
                            <div>{notice.title}<span id="nreply_cnt">[{notice.replyCnt}]</span></div>
                        </a>
                        <div>{notice.userid}</div>
                        <div>{notice.regdate}{notice.regdate != notice.updatedate ? "(수정)" : ""}</div>
                        <div>{notice.readcount}</div>
                    </div>
                )
            }
        }
        else {
            noticeList.push(
                <div className="row no-list" key={-1}>
                    <div>등록된 공지가 없습니다.</div>
                </div>
            )
        }
        const searchType = { "전체": "a", "제목": "T", "내용": "C", "작성자": "W", "제목 또는 내용": "TC", "제목 또는 작성자": "TW", "제목 또는 내용 또는 작성자": "TCW" }
        const changeType = (value) => {
            const changedCri = { ...cri, type: value }
            setCri(changedCri);
        }
        // 관리자인지 확인
        const isAdmin = data.user && data.user.userid === "admin";
        return (
            <>
                <div className="wrap list">
                    <Header></Header>
                    <div className="notice-title">NOTICE</div>
                    <div className="tar w1000 notice-cnt">글 개수 :{pageMaker.total} </div>
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
                    <Pagination pageMaker={pageMaker}></Pagination>
                    {
                        isAdmin && (
                            <table className="nbtn_table">
                                <tbody>
                                    <tr>
                                        <td>
                                            <a className="nwrite nbtn" href="">글쓰기</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )
                    }
                    <div className="search_area">
                        <form name="searchForm" action="/notice/notice" className="row">
                            <Dropdown list={searchType} name={"type"} width={250} value={cri.type} onChange={changeType}>
                            </Dropdown>
                            <input type="search" id="keyword" name="keyword" onChange={inputkeyword} value={inputs} />
                            <a id="search-btn" className="btn" onClick={clickSearch}>검색</a>
                            <input type="hidden" name="pagenum" />
                            <input type="hidden" name="amount" />
                        </form>
                    </div>
                </div>
            </>
        )
    }

}
export default Notice;