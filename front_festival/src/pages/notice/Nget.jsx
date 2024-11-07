import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Nget = () => {
    const { noticenum } = useParams();
    const cri = useLocation().state;
    const navigate = useNavigate();

    const [data, setData] = useState({ board: null, files: null });
    const { board, files } = data;
    const [loginUser, setLoginUser] = useState("");

    const remove = () => {
        axios.delete(`/api/notice/${board.noticenum}`)
            .then((resp) => {
                alert(`${resp.data}번 게시글 삭제`)
                navigate(`/notice/notice`, { state: cri });
            });
    }
    const [nowPage, setNowPage] = useState(1);
    const [list, setList] = useState([]);
    const [replyCnt, setReplyCnt] = useState(0);

    const openReplyForm = (e) => {
        e.target.style.display = 'none';
        e.target.nextElementSibling.style.display = 'flex';
        document.getElementById("nreplycontents").focus();
    }
    const clickRegist = (e) => {
        const nreplycontents = document.getElementById("nreplycontents");
        if (nreplycontents.value == "") {
            alert("댓글 내용을 입력하세요");
            nreplycontents.focus();
            return;
        }
        const nreply = { replycontents: nreplycontents.value, userid: loginUser, noticenum: notice.noticenum };
        axios.post(`/api/nreply/regist`, nreply)
            .then(resp => {
                alert(`${resp.data}번 댓글 등록 완료`);
            })
        nreply.replynum = resp.data;
        if (list.length == 5) {
            setNowPage(Math.ceil((replyCnt + 1) / 5));
        }
        else {
            setList([...list, nreply]);
        }
        nreplycontents.value = "";
        document.querySelector(".btn.regist").style.display = "inline-block";
        const nreplyForm = document.getElementsByClassName("nreplyForm")[0];
        nreplyForm.style.display = 'none';

    }
    const clickCancel = (e) => {
        const nreplycontents = document.getElementById("nreplycontents");
        nreplycontents.value = "";
        document.querySelector(",btn,regist").style.display = "inline-block";
        const nreplyForm = document.getElementsByClassName("nreplyForm")[0];
        nreplyForm.style.display = 'none';
    }
    const modifyReply = (e, replynum) => {
        const replyTag = document.querySelector(`.nreply${replynum}`);
        const replycontents = replyTag.innerHTML.trim();
        replyTag.innerHTML = `<textarea class='${replynum} mdf'>${nreplycontents}</textarea>`;
        e.target.classList.add("hdd");
        e.target.nextElementSibling.classList.remove("hdd");
        document.querySelector(".mdf").focus();
    }
    const modifyReplyOK = (e, replynum) => {
        const nreplycontents = document.querySelector(".mdf");
        if (nreplycontents.value == "") {
            nreplycontents.focus();
            return;
        }
        const nreply = { replynum: replynum, replycontents: nreplycontents.value, userid: loginUser };
        axios.put(`/api/nreply/${replynum}`, nreply)
            .then(resp => {
                alert(`${resp.data}번 댓글 수정 완료`);
                const updatedList = list.map((item) => {
                    if (item.replynum == replynum) {
                        return nreply;
                    }
                    else {
                        return item;
                    }
                });
                setList(updatedList);
            })
    }
    const removeReply = (e, replynum) => {
        axios.delete(`/api/nreply/${replynum}`)
            .then(resp => {
                alert(`${resp.data}번 댓글 삭제 완료`);
                const pudatedList = list.filter((item.replynum != replynum));
                setList(updatedList);
                if (list.length == 1 && nowPage != 1) {
                    setNowPage(nowPage - 1);
                }
                else {
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
        axios.get(`/api/user/loginCheck`)
            .then((resp) => {
                if (resp.data.trim() != "") {
                    setLoginUser(resp.data.trim());
                }
            })
    }, []);
    useEffect(() => {
        axios.get(`/api/nreply/${noticenum}/${nowPage}`)
            .then(resp => {
                setList(resp.data.list);
                setReplyCnt(resp.data.replyCnt);
            })
    }, [nowPage]);
    useEffect(() => {
        if (prevPageRef.current != nowPage) {
            replyEndRef.current?.scrollIntoView({ behavior: 'smoth' });
            prevPageRef.current = nowPage;
        }
    });
}
if (!board) {
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
    const replyList = [];
    const paging = [];
    let endPage = Math.ceil(nowPage / 5) * 5;
    let startPage = endPage - 4;
    endPage = (endPage - 1) * 5 >= replyCnt ?
        Math.ceil(replyCnt / 5) : endPage;
    let prev = startPage != 1;
    let next = endPage * 5 < replyCnt;
    const changePage = (e) => {
        e.preventDefault();
        const page = e.target.getAttribute("href");
        setNowPage(page);
    }
    if(prev){
        paging.push(<a className="changePage page-btn" href={startPage - 1} key={startPage - 1} onClick={changePage}>&lt;</a>)
    }
    for(let i = startPage; i <= endPage; i++){
        if(i == nowPage){
            paging.push(<span className="nowPage" key={i}>{i}</span>);
        }
        else{
            paging.push(<a className="changePage page-btn" key={i} onClick={changePage}>{i}</a>);
        }
    }
    if(next){
        paging.push(<a href={endPage +1} className="changePage page-btn" key={endPage + 1} onClick={changePage}>&gt;</a>)
    }
    if(list == null || list.length == 0){
        replyList.push(<li className="no-reply" key={`li0`}>동록된 댓글이 없습니다.</li>);
    }
    for(let i = 0; i < list.length; i++){
        const reply = list[i];
        replyList.push(
            <li className={`li${reply.replynum}row`} key={`li${reply.replynum}`}>
                <div className="row">
                    <strong className={`userid${reply.userid}`}>{reply.userid}</strong>
                    <p className={`reply${reply.replynum}`}>{reply.replynum}</p>
                </div>
                <div>
                    <strong></strong>
                </div>
                <div>
                    {
                        reply.userid == loginUser ?
                            <>
                                <Button value="수정" className={"modify btn"} onClick={(e)=>{
                                    modifyReply(e,replynum)
                                }}></Button>
                                <Button value="수정완료" className={"mfinish btn hdd"} onClick={(e)=>{
                                    modifyReplyOK(e,replynum)
                                }}></Button>
                                <Button value="삭제" className={"remove btn"} onClick={(e)=>{
                                    removeReply(e,reply.replynum)
                                }}></Button>
                            </>
                            :""
                    }
                </div>
            </li>
        )
    }
    return (
        <div id="wrap" className="nget">
            <Header></Header>
            <form id="noticeForm" name="noticeForm">
                <div className="ntable">
                    <div className="row">
                        <div>제목</div>
                        <div>
                            <input type="text" name="noticetitle" maxLength={50} placeholder="제목을 입력하세요" readOnly value={notice.noticetitle} />
                        </div>
                    </div>
                    <div className="row">
                        <div>작성자</div>
                        <div>
                            <input type="text" name="userid" maxLength={50} readOnly value={notice.userid} />
                        </div>
                    </div>
                    <div className="row">
                        <div>내용</div>
                        <div>
                            <textarea name="noticecontents" readOnly value={notice.noticecontents}></textarea>
                        </div>
                    </div>
                    {
                        files.map((file,i) => {
                            let ext = file.systemname.split(".").pop();
                            let isThumbnail = ext == 'jpeg' || ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'webp';
                            return (
                                <div className={`row r${i}`} key={`r${i}`}>
                                    <div>첨부파일{i + 1}</div>
                                    <div className={`file${i}_cont row`}>
                                        <div className="cols-10">
                                            <a className="download" id={`file${i}name`} href={`/api/file/download/${file.systemname}`}>{file.orgname}</a>
                                        </div>
                                        <div className="thumbnail_area">
                                            {
                                                isThumbnail ? 
                                                    <img src={`/api/file/thumbnail/${file.systemname}`} alt={`thumbnail${i}`} className="thumbnail"></img>
                                                    :""
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </form>
            <table className="btn_area">
                <tbody>
                    <tr>
                        <td>
                            {
                                loginUser == notice.userid ? 
                                    <>
                                        <Button value="수정" className="btn" onClick={()=>{
                                            navigate(`/board/nmodify`, { state:{"cri": cri, "noticenum": notice.noticenum}})
                                        }}></Button>
                                        <Button value="삭제" className="btn" onClick={remove}></Button>
                                    </>
                                    :""
                            }
                            <Button value="목록" className="btn" onClick={()=>{
                                navigate(`/notice/notice`, {state: cri});
                            }}></Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="nreply_line">
                <input type="button" value="댓글 등록" className="btn regist" onClick={openReplyForm} />
                <div className="replyForm row" style={{display:"none"}}>
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
    )
}
export default Nget;