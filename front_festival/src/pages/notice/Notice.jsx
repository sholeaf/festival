import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import Pagination from "../../components/Paginstion";
import Header from "../../layout/Header";
import axios from "axios";
import NoteModal from "../../components/NoteModal";
import img from "../../assets/images/noticeimg.jpg"
import Footer from "../../layout/Footer";

const Notice = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loginUser, setLoginUser] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
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
    useEffect(() => {
        // 페이지 로드 시 관리자 여부를 확인
        axios.get('/api/notice/checkadmin')
            .then(response => {
                setIsAdmin(response.data.admin);
            })
            .catch(error => {
                setIsAdmin(false);
            });
    }, []);
    //모달테스트
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');

    // 모달 열기
    const openModal = (userId) => {
        if (!loginUser) {
            // 로그인되지 않은 경우, 알림을 띄운 후 종료
            alert("로그인 후 이용 가능합니다.");
            return;
        }
        // 로그인된 경우, 모달을 엽니다.
        setSelectedUserId(userId);
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUserId('');
    };
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
        setInputs("");
        document.getElementById("type").value = "";
    };
    const searchenter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            clickSearch(e);
        }
    }

    useEffect(() => {
        const temp = {
            pagenum: cri.pagenum,
            amount: cri.amount,
            type: cri.type,
            keyword: cri.keyword,
            startrow: cri.startrow
        };

        axios.get(`/api/notice/list/${cri.pagenum}`, { params: cri })
            .then((resp) => {
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
    useEffect(() => {
        if (location.state) {
            setCri(location.state);
        }
        console.log("공지 로케이션 상태", location.state)
    }, [location.state])
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
                    <div>{notice.new ? <sup className="noticenew">New</sup> : ""}
                        <a className="nget" >
                            {notice.noticetitle}
                            {notice.nreplyCnt !== 0 && <span id="nreply_cnt">[{notice.nreplyCnt}]</span>}
                        </a>
                    </div>
                    <div><a onClick={(e) => { e.stopPropagation(); openModal(notice.userid) }}>{notice.userid}</a>
                    </div>
                    <div>
                        {notice.noticeregdate}
                        {notice.noticeregdate !== notice.updatedate && (
                            <span style={{ color: 'red' }}>(수정)</span>
                        )}
                    </div>
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

    return (
        <>
            <Header />
            <img className="notice-title" src={img}/>
            <div className="noticeWrap">
                <div className="nwrap nlist" id="nwrap">
                    {/* 관리자일 때만 글쓰기 버튼 보이기 */}
                    <div className={`nbtn_table ${isAdmin ? 'show' : ''}`}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <a className="nwriteBtn btn" onClick={() => navigate("/notice/nwrite", { state: cri })}>글쓰기</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="tar w1000 notice-cnt">글 개수 :{data.pageMaker.total} </div>
                    <div className="nlist ntable">
                        <div className="nthead tac">
                            <div className="row ntheadrow">
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
                        <div>
                            <NoteModal
                                isOpen={isModalOpen}
                                closeModal={closeModal}
                                toUserId={selectedUserId}  // 클릭된 작성자의 userid를 전달
                                loginUser={loginUser}      // 로그인된 유저의 userid를 전달
                            />
                        </div>
                    </div>
                    <Pagination pageMaker={pageMaker} url="/notice/list" />



                    <div className="search_area">
                        <form name="searchForm" action="/notice/list" className="row searchrow">
                            <Dropdown list={searchType} name={"type"} width={100} value={cri.type[0]} onChange={changeType}>
                            </Dropdown>
                            <input type="search" id="keyword" name="keyword" onChange={inputkeyword} value={inputs} onKeyDown={searchenter} />
                            <a id="search-btn" className="btn" onClick={clickSearch}>검색</a>
                            <input type="hidden" name="pagenum" />
                            <input type="hidden" name="amount" />
                        </form>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
};

export default Notice;