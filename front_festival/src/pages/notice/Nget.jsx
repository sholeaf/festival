import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Header from "../../layout/Header";
import ClickModal from "../../components/ClickModal";
import Footer from "../../layout/Footer";

const Nget = () => {
    const { noticenum } = useParams();
    const cri = useLocation().state;
    const navigate = useNavigate();

    const [data, setData] = useState({ notice: null, files: null });
    const { notice, files } = data;
    const [loginUser, setLoginUser] = useState("");
    // 댓글 등록 폼을 보여줄지 여부
    const [showReplyForm, setShowReplyForm] = useState(false);
    useEffect(() => {
        axios.get(`/api/user/loginCheck`)
            .then((resp) => {
                setLoginUser(resp.data);
            })
            .catch((error) => {
                console.error("로그인 상태 확인 오류: ", error);
            });
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState(""); // 원본 이미지 URL 저장

    const handleThumbnailClick = (imageUrl) => {
        setModalImage(imageUrl); // 클릭한 썸네일 이미지 URL 저장
        setIsModalOpen(true); // 모달 열기
    };


    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
    };
    const remove = () => {
        axios.delete(`/api/notice/${notice.noticenum}`)
            .then((resp) => {
                alert(`${resp.data}번 게시글이 삭제 되었습니다!`)
                navigate(`/notice/list`, { state: cri });
            })
    }
    useEffect(() => {
    }, [isModalOpen]);
    const [nowPage, setNowPage] = useState(1);
    const [list, setList] = useState([]);
    const [replyCnt, setReplyCnt] = useState(0);
    const openReplyForm = (e) => {
        if (!loginUser) {  // 로그인된 사용자 정보가 없으면 로그인되지 않은 상태로 간주
            alert("로그인 후 이용해 주세요.");
            window.location.href = "/user/login";  // 로그인 페이지로 리다이렉트
        } else {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'flex';
            document.getElementById("replycontents").focus();
            setShowReplyForm(true);  // 로그인 상태일 경우 댓글 폼을 열기
        }


    }

    const clickRegist = (e) => {
        const replycontent = document.getElementById("replycontents");

        if (replycontent.value === "") {
            alert("댓글 내용을 입력하세요!");
            replycontent.focus();
            return;
        }

        const reply = {
            replycontent: replycontent.value,
            userid: loginUser,
            noticenum: notice.noticenum
        };

        axios.post(`/api/nreply/regist`, reply)
            .then(resp => {
                alert(`공지글에 댓글 등록이 완료되었습니다.`);
                reply.replynum = resp.data;
                if (list.length === 5) {
                    setNowPage(Math.ceil((replyCnt + 1) / 5));
                } else {
                    setList([...list, reply]);
                }
                replycontent.value = "";
                document.querySelector(".btn.nregist").style.display = "inline-block";
                const replyForm = document.getElementsByClassName("nreplyForm")[0];
                replyForm.style.display = 'none';
            })
            .catch(error => {
                console.error("Error registering the reply:", error.response ? error.response.data : error.message);
                alert("댓글 등록이 실패했습니다.");
            });
    };

    const clickCancel = (e) => {
        const replycontent = document.getElementById("replycontents");
        replycontent.value = ""; // 댓글 내용 초기화

        // "댓글 등록" 버튼을 다시 보이게 설정
        const registButton = document.querySelector(".btn.nregist");
        if (registButton) {
            registButton.style.display = "inline-block";
        }

        // "댓글 등록 폼" (nreplyForm)을 숨기기
        const replyForm = document.getElementsByClassName("nreplyForm")[0];
        if (replyForm) {
            replyForm.style.display = "none"; // 댓글 폼 숨기기
        }
    }

    // 수정 버튼 클릭 시, 수정 상태 변경
    const modifyReply = (e, replynum) => {
        setList(list.map(reply =>
            reply.replynum === replynum ? { ...reply, isEditing: true } : reply
        ));
    }

    // 수정 완료 버튼 클릭 시, 수정 내용 서버에 업데이트
    const modifyReplyOk = (e, replynum) => {
        const replycontent = document.querySelector(`.mdf${replynum}`);
        if (replycontent.value === "") {
            alert("수정 할 내용을 입력하세요");
            replycontent.focus();
            return;
        }

        const updatedReply = { replynum, replycontent: replycontent.value, userid: loginUser };
        axios.put(`/api/nreply/${replynum}`, updatedReply)
            .then(resp => {
                alert(`댓글 수정 완료`);
                setList(list.map(reply =>
                    reply.replynum === replynum ? { ...reply, replycontent: replycontent.value, isEditing: false } : reply
                ));
            })
    }

    // 댓글 삭제
    const removeReply = (e, replynum) => {
        axios.delete(`/api/nreply/${replynum}`)
            .then(resp => {
                alert(`댓글 삭제 완료`);
                const updatedList = list.filter((data) => data.replynum !== replynum);
                setList(updatedList);
                if (list.length == 1 && nowPage != 1) {
                    setNowPage(nowPage - 1);
                } else {
                    axios.get(`/api/nreply/${noticenum}/${nowPage}`)
                        .then(resp => {
                            setList(resp.data.list);
                            setReplyCnt(resp.data.replyCnt);
                        })
                }
            })
    }

    const replyEndRef = useRef(null);
    const prevPageRef = useRef(1);

    useEffect(() => {
        axios.get(`/api/notice/${noticenum}`)
            .then((resp) => {
                setData(resp.data);
            })
        axios.get(`/api/user/loginCheck`).then(resp => {
            if (resp.data.trim() != "") {
                setLoginUser(resp.data.trim());
            }
        })
    }, [])

    useEffect(() => {
        axios.get(`/api/nreply/${noticenum}/${nowPage}`)
            .then(resp => {
                setList(resp.data.list);
                setReplyCnt(resp.data.replyCnt);
            })
    }, [nowPage])

    useEffect(() => {
        if (prevPageRef.current != nowPage) {
            replyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            prevPageRef.current = nowPage;
        }
    })

    const [chars, setChars] = useState([]);
    useEffect(() => {
        if (!notice) {
            const text = "로딩중...";
            const splitText = text.split("").map((char, index) => ({
                char,
                delay: index * 0.5 // 각 글자에 0.5초씩 딜레이
            }));
            setChars(splitText);
        }
    }, [notice]);

    // 데이터가 없을 때 로딩 텍스트 표시
    if (!notice) {
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


    const replyList = [];
    const paging = [];
    let endPage = Math.ceil(nowPage / 5) * 5;
    let startPage = endPage - 4;
    endPage = (endPage - 1) * 5 >= replyCnt ? Math.ceil(replyCnt / 5) : endPage;
    let prev = startPage != 1;
    let next = endPage * 5 < replyCnt;

    const changePage = (e) => {
        e.preventDefault();
        const page = e.target.getAttribute("href");
        setNowPage(page);
    }

    if (prev) {
        paging.push(<a className="changePage page-btn" href={startPage - 1} key={startPage - 1} onClick={changePage}>&lt;</a>);
    }
    for (let i = startPage; i <= endPage; i++) {
        if (i == nowPage) {
            paging.push(<span className="nowPage" key={i}>{i}</span>);
        } else {
            paging.push(<a href={i} className="changePage page-btn" key={i} onClick={changePage}>{i}</a>);
        }
    }
    if (next) {
        paging.push(<a href={endPage + 1} className="changePage page-btn" key={endPage + 1} onClick={changePage}>&gt;</a>);
    }

    if (list == null || list.length == 0) {
        replyList.push(<li className="no-reply" key={`li0`}>등록된 댓글이 없습니다.</li>);
    }
    for (let i = 0; i < list.length; i++) {
        const reply = list[i];
        replyList.push(
            <li className={`li${reply.replynum} row`} key={`li${reply.replynum}`}>
                <div className="row nreply">
                    <div className="nreplyname">
                        <strong className={`userid${reply.userid}`}>{reply.userid}</strong>
                    </div>
                    <div className="nreplycontent">
                        <p className={`reply${reply.replynum} replycontent`} style={{ border: reply.isEditing ? '1px solid #000' : 'none' }}>
                            {reply.isEditing ?
                                <textarea className={`mdf${reply.replynum}`} defaultValue={reply.replycontent}></textarea>
                                : reply.replycontent
                            }
                        </p>
                    </div>
                </div>
                <div>
                    <strong></strong>
                </div>
                <div>
                    {reply.userid === loginUser && (
                        <>
                            {reply.isEditing ? (
                                <Button value="수정 완료" className="nrfinish btn" onClick={(e) => modifyReplyOk(e, reply.replynum)} />
                            ) : (
                                <Button value="수정" className="nrmodify btn" onClick={(e) => modifyReply(e, reply.replynum)} />
                            )}
                            <Button value="삭제" className="nrremove btn" onClick={(e) => removeReply(e, reply.replynum)} />
                        </>
                    )}
                </div>
            </li>
        )
    }

    return (
        <>
            <Header />
            <div className="noticeWrap">
                <div id="nwrap" className="nget noticeget">
                    <form id="noticeForm getNoticeForm" name="noticeForm">
                        <div className="ngettable">
                            <div className="ngetrow ngetlist">
                                <div>
                                    번호: {notice.noticenum}
                                </div>
                                <div>
                                    {notice.noticetitle}
                                </div>
                                <div>
                                    {notice.noticeregdate}
                                    {notice.noticeregdate !== notice.updatedate && (
                                        <span style={{ color: 'red' }}>(수정)</span>
                                    )}
                                </div>
                                <div>
                                    조회수:{notice.readcount}
                                </div>
                            </div>
                            <div className="ngetrow ngetcontent">
                                <div className=" ngetthumbnail_area">
                                    {/* notice.thumbnail을 표시하는 기존 코드 */}
                                    {notice.thumbnail && notice.thumbnail !== "" ? (
                                        <img
                                            src={`/api/notice/file/thumbnail/${notice.thumbnail}`}
                                            alt={`thumbnail-${notice.noticenum}`}
                                            className="ngetthumbnail"
                                            onClick={() => handleThumbnailClick(`/api/notice/file/thumbnail/${notice.thumbnail}`)}
                                        />
                                    ) : (
                                        ""
                                    )}

                                    {/* files 배열에 있는 썸네일 표시 */}
                                    {files.length > 0 && files.map((file, i) => {
                                        const ext = file.systemname.split('.').pop();
                                        const isThumbnail = ext === 'jpeg' || ext === 'jpg' || ext === 'png' || ext === 'gif' || ext === 'webp';
                                        return (
                                            isThumbnail && (
                                                <div className="file-thumbnail" key={`file-thumbnail-${i}`}>
                                                    <img
                                                        src={`/api/notice/file/thumbnail/${file.systemname}`}
                                                        alt={`thumbnail-${i}`}
                                                        className="nthumbnail"
                                                        onClick={() => handleThumbnailClick(`/api/notice/file/thumbnail/${file.systemname}`)}
                                                    />
                                                </div>
                                            )
                                        );
                                    })}
                                </div>

                                <div className="ngetTextarea">
                                    <textarea name="noticecontents" readOnly value={notice.noticecontent}></textarea>
                                </div>
                                <div className="filetextcontainer">
                                    <hr className="line-left" />
                                    <b className="filetext">첨부파일</b>
                                    <hr className="line-right" />
                                </div>
                            </div>
                            {
                                files.length === 0 ? (
                                    <div className="no-files">첨부된 파일이 없습니다.</div>
                                ) : (
                                    files.map((file, i) => {
                                        let ext = file.systemname.split(".").pop();
                                        let isThumbnail = ext === 'jpeg' || ext === 'jpg' || ext === 'png' || ext === 'gif' || ext === 'webp';

                                        // isThumbnail이 true이면 해당 div 전체를 렌더링하지 않음
                                        if (isThumbnail) {
                                            return null; // 이 부분에서 isThumbnail이 true일 경우 렌더링을 생략합니다.
                                        }

                                        return (
                                            <div className={`row r${i}`} key={`r${i}`}>

                                                <div className={`file${i}_cont ngetfilecont`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div className="ngetfile01"></div>
                                                    <div className="ngetfile02">
                                                        {/* 파일명 클릭 시 다운로드 */}
                                                        <a
                                                            className="ndownload"
                                                            id={`file${i}name`}
                                                            href={`/api/notice/file/download/${file.systemname}`}
                                                            download
                                                        >
                                                            {file.orgname}
                                                        </a>
                                                    </div>
                                                    <div className="ndownload-btn nBtn" style={{ flex: '0 0 auto' }}>
                                                        <a
                                                            href={`/api/notice/file/download/${file.systemname}`}
                                                            className="btn nownload-file-btn"
                                                            download>
                                                            다운로드
                                                        </a>
                                                    </div>
                                                </div>
                                                {isModalOpen && (
                                                    <ClickModal isModalOpen={isModalOpen} closeModal={closeModal} >
                                                        <div onClick={(e) => e.stopPropagation()}>
                                                            <img src={modalImage} alt="Full size" style={{ width: '100%', height: 'auto', top: '20%' }} />
                                                        </div>
                                                    </ClickModal>
                                                )}
                                            </div>
                                        );
                                    })
                                )
                            }


                        </div>
                    </form>
                    <table className="nbtn_area">
                        <tbody>
                            <tr>
                                <td>
                                    {loginUser === notice.userid && (
                                        <>
                                            <Button value="수정" className="btn" onClick={() => navigate(`/notice/nmodify`, { state: { cri, noticenum: notice.noticenum } })}></Button>
                                            <Button value="삭제" className="btn" onClick={remove}></Button>
                                        </>
                                    )}
                                    <Button value="목록" className="btn" onClick={() => navigate("/notice/list", { state: cri })}></Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="nreply_line">
                        <input type="button" value="댓글 등록" className="btn nregist" onClick={openReplyForm} />
                        <div className="nreplyForm row" style={{ display: "none" }}>
                            <div>
                                <h4>작성자</h4>
                                <input type="text" name="userid" value={loginUser} readOnly />
                            </div>
                            <div>
                                <h4>내 용</h4>
                                <textarea name="replycontents" id="replycontents" placeholder="Contents"></textarea>
                            </div>
                            <div>
                                <input type="button" value="등록" className="btn nfinish" onClick={clickRegist} />
                                <input type="button" value="취소" className="btn ncancel" onClick={clickCancel} />
                            </div>
                        </div>
                        <ul className="nreplies">
                            {replyList}
                        </ul>
                        <div className="npage">
                            {paging}
                        </div>
                        <div ref={replyEndRef}></div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}

export default Nget;
