import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";

const Nget = () => {
    const { noticenum } = useParams();
    const cri = useLocation().state;
    const navigate = useNavigate();
    const [data, setData] = useState({ board: null, files: null });
    const { board, files } = data;
    const [loginUser, setLoginUser] = useState("");
    const [nowPage, setNowPage] = useState(1);
    const [list, setList] = useState([]);
    const [replyCnt, setReplyCnt] = useState(0);
    const [chars, setChars] = useState([]);

    const replyEndRef = useRef(null);
    const prevPageRef = useRef(1);

    // 로딩 텍스트 처리
    useEffect(() => {
        if (!board) {
            const text = "로딩중...";
            const splitText = text.split("").map((char, index) => ({
                char,
                delay: index * 0.5 // 각 글자에 0.5초씩 딜레이
            }));
            setChars(splitText);
        }
    }, [board]);

    // 더미 데이터 추가
    useEffect(() => {
        // 더미 게시글 데이터
        const dummyBoard = {
            noticenum: 1,
            noticetitle: "더미 게시글 제목",
            userid: "testuser",
            noticecontents: "이곳은 더미 게시글의 내용입니다."
        };
        
        // 더미 파일 데이터
        const dummyFiles = [
            { systemname: "dummy.jpg", orgname: "더미 파일 1" },
            { systemname: "dummy2.jpg", orgname: "더미 파일 2" }
        ];

        // 더미 댓글 데이터
        const dummyReplies = [
            { replynum: 1, userid: "testuser", replycontents: "더미 댓글 1" },
            { replynum: 2, userid: "otheruser", replycontents: "더미 댓글 2" }
        ];

        setData({ board: dummyBoard, files: dummyFiles });
        setList(dummyReplies);
        setReplyCnt(dummyReplies.length);

        // 로그인 사용자 더미 데이터
        setLoginUser("testuser");
    }, [noticenum]);

    useEffect(() => {
        // 댓글 데이터 가져오기
        const dummyReplyList = [
            { replynum: 1, userid: "testuser", replycontents: "더미 댓글 1" },
            { replynum: 2, userid: "otheruser", replycontents: "더미 댓글 2" }
        ];

        setList(dummyReplyList);
        setReplyCnt(dummyReplyList.length);
    }, [nowPage]);

    // 게시글 삭제
    const remove = () => {
        alert(`${board.noticenum}번 게시글 삭제`);
        navigate(`/notice/notice`, { state: cri });
    };

    // 댓글 등록, 수정, 삭제 등
    const openReplyForm = (e) => {
        e.target.style.display = 'none';
        e.target.nextElementSibling.style.display = 'flex';
        document.getElementById("nreplycontents").focus();
    };

    const clickRegist = (e) => {
        const nreplycontents = document.getElementById("nreplycontents");
        if (nreplycontents.value === "") {
            alert("댓글 내용을 입력하세요");
            nreplycontents.focus();
            return;
        }
        const nreply = { replycontents: nreplycontents.value, userid: loginUser, noticenum: noticenum };
        
        const newReply = { ...nreply, replynum: replyCnt + 1 }; // 더미 데이터로 추가된 댓글 번호
        setList([...list, newReply]);
        setReplyCnt(replyCnt + 1);
        
        nreplycontents.value = "";
        document.querySelector(".btn.regist").style.display = "inline-block";
        const nreplyForm = document.getElementsByClassName("nreplyForm")[0];
        nreplyForm.style.display = 'none';
    };
    
    const clickCancel = (e) => {
        const nreplycontents = document.getElementById("nreplycontents");
        nreplycontents.value = "";
        document.querySelector(".btn.regist").style.display = "inline-block";
        const nreplyForm = document.getElementsByClassName("nreplyForm")[0];
        nreplyForm.style.display = 'none';
    };

    const modifyReply = (e, replynum) => {
        const replyTag = document.querySelector(`.nreply${replynum}`);
        const nreplycontents = replyTag.innerHTML.trim();
        replyTag.innerHTML = `<textarea class='${replynum} mdf'>${nreplycontents}</textarea>`;
        e.target.classList.add("hdd");
        e.target.nextElementSibling.classList.remove("hdd");
        document.querySelector(".mdf").focus();
    };

    const modifyReplyOK = (e, replynum) => {
        const nreplycontents = document.querySelector(".mdf");
        if (nreplycontents.value === "") {
            nreplycontents.focus();
            return;
        }
        const nreply = { replynum: replynum, replycontents: nreplycontents.value, userid: loginUser };
        const updatedList = list.map((item) => {
            if (item.replynum === replynum) {
                return nreply;
            } else {
                return item;
            }
        });
        setList(updatedList);
    };

    const removeReply = (e, replynum) => {
        const updatedList = list.filter((item) => item.replynum !== replynum);
        setList(updatedList);
        if (list.length === 1 && nowPage !== 1) {
            setNowPage(nowPage - 1);
        }
    };

    // 데이터가 없을 때 로딩 텍스트 표시
    if (!board) {
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

    // 페이지 내용
    const replyList = [];
    const paging = [];
    let endPage = Math.ceil(nowPage / 5) * 5;
    let startPage = endPage - 4;
    endPage = (endPage - 1) * 5 >= replyCnt ? Math.ceil(replyCnt / 5) : endPage;
    let prev = startPage !== 1;
    let next = endPage * 5 < replyCnt;

    const changePage = (e) => {
        e.preventDefault();
        const page = e.target.getAttribute("href");
        setNowPage(page);
    };

    if (prev) {
        paging.push(<a className="changePage page-btn" href={startPage - 1} key={startPage - 1} onClick={changePage}>&lt;</a>);
    }
    for (let i = startPage; i <= endPage; i++) {
        if (i === nowPage) {
            paging.push(<span className="nowPage" key={i}>{i}</span>);
        } else {
            paging.push(<a className="changePage page-btn" key={i} onClick={changePage}>{i}</a>);
        }
    }
    if (next) {
        paging.push(<a href={endPage + 1} className="changePage page-btn" key={endPage + 1} onClick={changePage}>&gt;</a>);
    }
    if (list === null || list.length === 0) {
        replyList.push(<li className="no-reply" key={`li0`}>등록된 댓글이 없습니다.</li>);
    }
    for (let i = 0; i < list.length; i++) {
        const nreply = list[i];
        replyList.push(
            <li className={`li${nreply.replynum}row`} key={`li${nreply.replynum}`}>
                <div className="row">
                    <strong className={`nuserid${nreply.userid}`}>{nreply.userid}</strong>
                    <p className={`nreply${nreply.replynum}`}>{nreply.replynum}</p>
                </div>
                <div className="nbtn-group">
                    {
                        nreply.userid === loginUser ? 
                            <>
                                <Button value="수정" className={"modify btn"} onClick={(e) => { modifyReply(e, nreply.replynum) }} />
                                <Button value="수정완료" className={"mfinish btn hdd"} onClick={(e) => { modifyReplyOK(e, nreply.replynum) }} />
                                <Button value="삭제" className={"remove btn"} onClick={(e) => { removeReply(e, nreply.replynum) }} />
                            </>
                            : ""
                    }
                </div>
            </li>
        );
    }

    return (
        <div id="nwrap" className="nget">
             <div className="notice-title">Notice</div>
            <form id="noticeForm" name="noticeForm">
                <div className="ntable">
                    <div className="row">
                        <div>제목</div>
                        <div>
                            <input type="text" name="noticetitle" maxLength={50} placeholder="제목을 입력하세요" readOnly value={board.noticetitle} />
                        </div>
                    </div>
                    <div className="row">
                        <div>작성자</div>
                        <div>
                            <input type="text" name="userid" maxLength={50} readOnly value={board.userid} />
                        </div>
                    </div>
                    <div className="row">
                        <div>내용</div>
                        <div>
                            <textarea name="noticecontents" readOnly value={board.noticecontents}></textarea>
                        </div>
                    </div>
                    {
  files.length === 0 ? (
    <div className="no-files">첨부된 파일이 없습니다.</div>
  ) : (
    files.map((file, i) => {
      let ext = file.systemname.split(".").pop();
      let isThumbnail = ext === 'jpeg' || ext === 'jpg' || ext === 'png' || ext === 'gif' || ext === 'webp';
      return (
        <div className={`row r${i}`} key={`r${i}`}>
          <div>첨부파일{i + 1}</div>
          <div className={`file${i}_cont row`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* 파일명 클릭 시 다운로드 */}
            <div className="cols-10">
            {/* 파일명 클릭 시 다운로드 */}
            <a
              className="download"
              id={`file${i}name`}
              href={`/api/file/download/${file.systemname}`}
              download
            >
              {file.orgname}
            </a>
          </div>
          <div className="thumbnail_area">
            {isThumbnail ? (
              <img
                src={`/api/file/thumbnail/${file.systemname}`}
                alt={`thumbnail${i}`}
                className="thumbnail"
              />
            ) : (
              ""
            )}
          </div>
            <div className="ndownload-btn" style={{ flex: '0 0 auto' }}>
              <a
                href={`/api/file/download/${file.systemname}`}
                className="btn nownload-file-btn"
                download
                style={{
                  backgroundColor: 'rgb(179 222 245)', 
                  color: 'white', 
                  padding: '10px 20px', 
                  borderRadius: '5px', 
                  textAlign: 'center',
                  right: '20px',
                  position: 'relative'
                }}
              >
                다운로드
              </a>
            </div>
          </div>
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
                            {
                                loginUser === board.userid ? 
                                    <>
                                        <Button value="수정" className="btn" onClick={() => {
                                            navigate(`/notice/nmodify`, { state: { cri, noticenum: board.noticenum } });
                                        }} />
                                        <Button value="삭제" className="btn" onClick={remove} />
                                    </>
                                    : ""
                            }
                            <Button value="목록" className="btn" onClick={() => {
                                navigate(`/notice/notice`, { state: cri });
                            }} />
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
                        <h4>내용</h4>
                        <textarea name="nreplycontents" id="nreplycontents" placeholder="Contents"></textarea>
                    </div>
                    <div>
                        <input type="button" value="등록" className="btn finish" onClick={clickRegist} />
                        <input type="button" value="취소" className="btn cancel" onClick={clickCancel} />
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
    );
};

export default Nget;
