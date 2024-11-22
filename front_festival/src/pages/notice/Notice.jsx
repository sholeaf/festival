import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import Pagination from "../../components/Paginstion";
import Header from "../../layout/Header";
import axios from "axios";
import NoteModal from "../../components/NoteModal";

const Notice = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const sendedCri = location.state;
    //모달테스트
    const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 상태
    const [selectedUserId, setSelectedUserId] = useState(''); 
    const [loginUser, setLoginUser] = useState(null);
    // 모달 열기
    const openModal = (userId) => {
        setSelectedUserId(userId);  // 클릭된 작성자의 userid를 저장
        setIsModalOpen(true);  // 모달 열기
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUserId('');  // 모달 닫을 때 selectedUserId 초기화
    };
    useEffect(() => {
        axios.get(`/api/user/loginCheck`)
            .then((resp) => {
                setLoginUser(resp.data);
            })
            .catch((error) => {
                console.error("로그인 상태 확인 오류: ", error);
            });
    }, []);
//모달부분 끗
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
    // 관리자 여부 설정
    const [isAdmin, setIsAdmin] = useState(false);

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
    useEffect(() => {
        if (location.state) {
            setCri(location.state);
        }
    }, [location.state])
    useEffect(() => {
        // 페이지 로드 시 관리자 여부를 확인
        axios.get('/api/notice/checkadmin')
            .then(response => {
                console.log("응답 데이터:", response.data.admin)
                setIsAdmin(response.data.admin);  // 서버에서 받은 isAdmin 값으로 상태 업데이트
                console.log("isAdmin 상태:", response.data.admin);
            })
            .catch(error => {
                console.error('관리자 여부 확인 실패:', error);
                setIsAdmin(false);  // 에러 발생 시 기본값으로 관리자가 아니라고 설정
            });
    }, []);
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
    console.log(list);
    const noticeList = [];
    if (list && list.length > 0) {
        for (const notice of list) {
            console.log("notice데이터new확인:", notice);
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
                    <div><a onClick={(e) =>{e.stopPropagation(); openModal(notice.userid)}}>{notice.userid}</a>
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
            <div className="noticeWrap">
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
                    <div>
                    <NoteModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                toUserId={selectedUserId}  // 클릭된 작성자의 userid를 전달
                loginUser={loginUser}      // 로그인된 유저의 userid를 전달
            />
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
                    <form name="searchForm" action="/notice/list" className="row searchrow">
                        <Dropdown list={searchType} name={"type"} width={250} value={cri.type} onChange={changeType}>
                        </Dropdown>
                        <input type="search" id="nkeyword" name="keyword" onChange={inputkeyword} value={inputs} onKeyDown={searchenter} />
                        <a id="nsearch-btn" className="btn" onClick={clickSearch}>검색</a>
                        <input type="hidden" name="pagenum" />
                        <input type="hidden" name="amount" />
                    </form>
                </div>
            </div>
            </div>
        </>
    );
};

export default Notice;