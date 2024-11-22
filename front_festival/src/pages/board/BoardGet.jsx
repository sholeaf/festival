import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Header from "../../layout/Header";
import NoteModal from "../../components/NoteModal";

const BoardGet = () =>{
    const {boardnum} = useParams();
    const [data, setData] = useState();
    const navigate = useNavigate();
    const cri = useLocation().state;

    const replyEndRef = useRef(null);
    const prevPageRef = useRef(1);

    const [nowPage,setNowPage] = useState(1);
    const [list,setList] = useState([]);
    const [replyCnt, setReplyCnt] = useState(0);
    const [loginUser, setLoginUser] = useState("");
    const [checkLike, setcheckLike] = useState();

    const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 상태
    const [selectedUserId, setSelectedUserId] = useState(''); 

    useEffect(()=>{
        getData();
    },[])
    
    const openModal = (userId) => {
        setSelectedUserId(userId);  // 클릭된 작성자의 userid를 저장
        setIsModalOpen(true);  // 모달 열기
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUserId('');  // 모달 닫을 때 selectedUserId 초기화
    };


    const getData = async () => {
        await axios.get(`/api/user/loginCheck`).then(resp=>{
            if(resp.data.trim() != ""){
                setLoginUser(resp.data.trim());
                axios.get(`/api/board/like/${boardnum}?userid=${resp.data}`).then(resp=>{
                    resp.data? setcheckLike(true) : setcheckLike(false);
                })
            }
        })
        const response = await axios.get(`/api/board/${boardnum}`);
        setData(response.data);
    };
    
    window.addEventListener('popstate', (e)=>{
        // navigate('/board/list');
        e.preventDefault();
    });
    
    useEffect(()=>{
        
        axios.get(`/api/reply/${boardnum}/${nowPage}`)
        .then(resp => {
            setList(resp.data.list);
            setReplyCnt(resp.data.replyCnt);
        })
    },[nowPage])

    useEffect(()=>{
        if(prevPageRef.current != nowPage){
            replyEndRef.current?.scrollIntoView({behavior:'smooth'});
            prevPageRef.current = nowPage;
        }
    },[list])

    const remove = async () => {
        const regex = /systemname=([a-zA-Z0-9\-]+(?:\.[a-zA-Z]{3,4})?)"/g;
        const useImages = [];
        let useImage;

        // `exec` 메서드를 이용해 여러번 찾을 수 있음
        while ((useImage = regex.exec(data.boardcontent)) !== null) {
        useImages.push(useImage[1]); // targetWord 뒤의 단어를 추출
        }
        // if (useImages.length === 0) {
        //     const response = await axios.delete(`/api/board/${boardnum}`);
        //     alert(`${response.data}번 게시글 삭제!`);
        //     navigate(`/board/list`, { state: cri });
        //     return; // 이후 코드 실행을 멈춤
        // }
        const queryParams = new URLSearchParams();
            useImages.forEach((image) => {
                queryParams.append('useImages[]', image); // useImages[]로 배열을 전달
        });
        const response = await axios.delete(`/api/board/${boardnum}?${queryParams.toString()}`);
        alert(`${response.data}번 게시글 삭제!`)
        navigate(`/board/list`,{state:cri});
    }

    const clickRegist = async ()=>{
        const replycontents = document.getElementById("replycontents");
        if(replycontents.value == ""){
            alert("댓글 내용을 입력하세요!");
            replycontents.focus();
            return;
        }
        const reply = {replycontent:replycontents.value, userid:loginUser, boardnum:data.boardnum};
        axios.post(`/api/reply/regist`,reply)
        .then(resp => {
            alert(`댓글 등록 완료!`);
            reply.replynum = resp.data;

            if(list.length == 5){
                setNowPage(Math.ceil((replyCnt+1)/5));
            }
            else{
                setList([...list,resp.data]);
            }
            replycontents.value = "";
        })
    }
    
    const like = async () =>{
        const response = await axios.post(`/api/board/like/${boardnum}?userid=${loginUser}`);
        if(response.data){
            setcheckLike(true);
            alert("좋아요!");
        }
        else{
            setcheckLike(false);
            alert("좋아요취소");
        }
    }
    const reportBoard = async()=>{
        const response = await axios.post(`/api/board/reportBoard/${boardnum}?userid=${loginUser}`);
        if(response.data){
            alert("신고되었습니다!");
        }
        else{
            alert("이미 신고하셨습니다!");
        }
    }
    const reportReply = async(replynum) =>{
        const response = await axios.post(`/api/board/reportReply/${replynum}?userid=${loginUser}`);
        if(response.data){
            alert("신고되었습니다!");
        }
        else{
            alert("이미 신고하셨습니다!");
        }
    }

    const BlindReply = ({ reply }) => {
        // `isContentVisible` 상태를 사용하여 댓글 내용이 보일지 여부를 관리
        const [isContentVisible, setIsContentVisible] = useState(false);
      
        const toggleContentVisibility = () => {
          setIsContentVisible(!isContentVisible); // 클릭 시 상태를 토글
        };
        return (
            <div onClick={()=>setIsContentVisible(true)}>
                {isContentVisible ? (
                <div>{reply.replycontent}</div> // 내용이 보일 때
                ) : (
                <div>(블라인드 처리된 댓글입니다. 클릭하시면 내용이 보입니다.)</div> // 내용이 숨겨져 있을 때
                )}
            </div>
        );
    };

    const NormalReply = ({ reply }) => {
        const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
        const [editedContent, setEditedContent] = useState(reply.replycontent); // 수정된 댓글 내용

        // 수정 버튼 클릭 시 수정 모드 활성화
        const handleEditClick = () => {
          setIsEditing(true);
        };
      
        // 수정된 댓글 내용 업데이트
        const handleContentChange = (e) => {
          setEditedContent(e.target.value);
        };
        
        // 수정 완료 버튼 클릭 시 댓글 수정 완료
        const handleSaveClick = async (replynum) => {
            const replycontents = document.querySelector("#replycontents2");
            if(editedContent == ""){
                alert("수정할 댓글 내용을 입력하세요!")
                replycontents.focus();
                return;
            }
            const reply = {replynum:replynum, replycontent:editedContent, userid:loginUser};
            const response = await axios.put(`/api/reply/${replynum}`, reply);
            alert(`댓글 수정 완료!`);
            const updatedList = list.map((item) => {
                if(item.replynum == replynum){
                    return response.data;
                }
                else{
                    return item;
                }
            })
            setList(updatedList);
            
            setIsEditing(false);
        };
      
        // 수정 취소 버튼 클릭 시 수정 취소
        const handleCancelClick = () => {
          setIsEditing(false);
          setEditedContent(reply.replycontent); // 원래 내용으로 돌아갑니다.
        };
        return (
            <div>
              {isEditing ? (
                // 수정 모드일 때, 댓글 내용을 텍스트 입력란으로 보여줌
                <div>
                    <div>
                        <textarea name="replycontents" id="replycontents2" value={editedContent} placeholder="Contents" onChange={handleContentChange} rows="3" cols="40" ></textarea>
                    </div>
                  <div>
                    <button onClick={()=>handleSaveClick(reply.replynum)}>수정 완료</button>
                    <button onClick={handleCancelClick}>수정 취소</button>
                  </div>
                </div>
              ) : (
                // 수정 모드가 아닐 때, 댓글 내용 표시
                <div>
                  <div>{reply.replycontent}</div>
                  <div>{
                    reply.userid == loginUser?
                        <>
                            <button onClick={handleEditClick}>수정</button>
                            <button onClick={()=>removeReply(reply.replynum)}>삭제</button>
                        </>
                        :""
                    }
                  </div>
                </div>
              )}
            </div>
        );
    };
    const removeReply = (replynum) =>{
        axios.delete(`/api/reply/${replynum}`)
        .then(resp => {
            alert(`댓글 삭제 완료!`)
            if(list.length == 1 && nowPage != 1){
                setNowPage(nowPage-1);
            }
            else{
                axios.get(`/api/reply/${boardnum}/${nowPage}`)
                .then(resp => {
                    setList(resp.data.list);
                    setReplyCnt(resp.data.replyCnt);
                })
            }
        })
    }

    if(!data){
        return <>로딩중...</>
    }
    else{
        const replyList = [];
        const paging = [];
        let endPage = Math.ceil(nowPage/5)*5;
        let startPage = endPage - 4;
        endPage = (endPage-1)*5 >= replyCnt ? 
                Math.ceil(replyCnt/5) : endPage;
        let prev = startPage != 1;
        let next = endPage*5 < replyCnt;
        const changePage = (e) => {
            e.preventDefault();
            const page = e.target.getAttribute("href");
            setNowPage(page);
        }
        if(prev){
            paging.push(<a className="changePage page-btn" href={startPage-1} key={startPage-1} onClick={changePage}>&lt;</a>)
        }
        for(let i=startPage; i<=endPage; i++) {
            if(i == nowPage){
                paging.push(<span className="nowPage" key={i}>{i}</span>);
            }
            else{
                paging.push(<a href={i} className="changePage page-btn" key={i} onClick={changePage}>{i}</a>)
            }
        }
        if(next){
            paging.push(<a href={endPage+1} className="changePage page-btn" key={endPage+1} onClick={changePage}>&gt;</a>)
        }

        if(list == null || list.length == 0){
            replyList.push(<li className="no-reply" key={`li0`}>등록된 댓글이 없습니다.</li>);
        }
        for(let i=0; i<list.length; i++){
            const reply = list[i];
            replyList.push(
                <li className={`li${reply.replynum} row`} key={`li${reply.replynum}`}>
                    <div className="row rrow">
                    <a onClick={() => openModal(reply.userid)}><strong className={`userid${reply.userid}`}>{reply.userid}</strong> </a>

                        
                        <div className={`reply${reply.replynum}`}>
                            {reply.reportcnt < 5 ?(
                                <NormalReply reply={reply} />
                            )
                            :(<BlindReply reply={reply}/>)
                        }</div>
                            <Button className="btn" value="신고" onClick={()=> reportReply(reply.replynum)}></Button>
                        <div className={`reply${reply.replyregdate}`}>{reply.replyregdate}</div>
                    </div>
                    <div>
                        <strong></strong>
                        
                    </div>
                    {/* <div>
                        {
                            reply.userid == loginUser?
                            <>
                                <Button value="수정" className={"modify btn"} onClick={(e)=>{ modifyReply(e,reply.replynum) }}></Button>
                                <Button value="수정 완료" className={"mfinish btn hdd"} onClick={(e)=>{ modifyReplyOk(e,reply.replynum) }}></Button>
                                <Button value="삭제" className={"remove btn"} onClick={(e)=>{ removeReply(e,reply.replynum) }}></Button>
                            </>
                            :""
                        }
                    </div> */}
                </li>
            )
            
        }

        

        return(
            <>
            <Header></Header>
            <div className="boardget_wrap">
                <div className="bgUserid"><a onClick={() => openModal(data.userid)}><strong>{data.userid}</strong></a>
                </div>
                <div className="bgTitle"><strong>{data.boardtitle}</strong></div>
                <div>
                    <div onClick={reportBoard}>신고하기</div>
                    <div>{data.boardregdate}</div>
                </div>
                <div className="bgContent">
                    <div dangerouslySetInnerHTML={{ __html: data.boardcontent }}/>
                </div>
                <div>{ checkLike? <Button value="좋아요취소" onClick={like}></Button>
                    :<Button value="좋아요" onClick={like}></Button>
                    }
                </div>
                <div className="btnArea">
                        { data.userid == loginUser?
                        <>
                            <div>
                            <input type="button" value="수정" onClick={()=>{        
                                navigate('/board/modify',{state:{"cri":cri, "boardnum":data.boardnum}})}}></input>
                            </div>
                            <div>
                            <input type="button" value="삭제" onClick={remove}></input>
                            </div>
                            <div>
                                <input type="button" value="목록" onClick={()=>{
                                    navigate('/board/list',{ state: cri })}}></input>
                            </div>
                        </>:
                            <div>
                                <input type="button" value="목록" onClick={()=>{
                                    navigate('/board/list',{ state: cri })}}></input>
                            </div>
                        }   
                </div>
                <div className="reply_line">
                    <div className="reply_write">

                        <div>
                            {/* <h4>작성자</h4> */}
                            <input type="text" name="userid" value={loginUser} readOnly/>
                        </div>
                        <div>
                            {/* <h4>내 용</h4> */}
                            <textarea name="replycontents" id="replycontents" placeholder="Contents"></textarea>
                        </div>
                        <div>
                            <input type="button" value="등록" className="btn finish" onClick={clickRegist}/>
                        </div>
                    </div>
                    <ul className="replies">
                        {replyList}
                    </ul>
                    <div className="page">
                        {paging}
                    </div>
                    <div ref={replyEndRef}></div>
                </div>
            </div>
            <div>
                    <NoteModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                toUserId={selectedUserId}  // 클릭된 작성자의 userid를 전달
                loginUser={loginUser}      // 로그인된 유저의 userid를 전달
            />
                    </div>
            </>
        )
    }
}
export default BoardGet;