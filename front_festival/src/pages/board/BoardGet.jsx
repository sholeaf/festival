import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Header from "../../layout/Header";

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

    useEffect(()=>{
        getData();
        
    },[])
    
    const getData = async () => {
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
        if(queryParams == []){
            console.log("check");
        }
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
        const reply = {replycontent:replycontents.value, userid:"loginUser", boardnum:data.boardnum};
        axios.post(`/api/reply/regist`,reply)
        .then(resp => {
            alert(`${resp.data}번 댓글 등록 완료!`);
            reply.replynum = resp.data;

            if(list.length == 5){
                setNowPage(Math.ceil((replyCnt+1)/5));
            }
            else{
                setList([...list,reply]);
            }
            replycontents.value = "";
        })
    }
    
    const like = async () =>{
        const response = await axios.post(`/api/board/like/${boardnum}?userid=apple`);
        if(response.data){
            alert("좋아요!");
        }
        else{
            alert("좋아요취소");
        }
    }
    const reportBoard = async()=>{
        const response = await axios.post(`/api/board/reportBoard/${boardnum}?userid=apple`);
        if(response.data){
            alert("신고되었습니다!");
        }
        else{
            alert("이미 신고하셨습니다!");
        }
    }
    const reportReply = async(replynum) =>{
        const response = await axios.post(`/api/board/reportReply/${replynum}?userid=apple`);
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
                        <strong className={`userid${reply.userid}`}>{reply.userid}</strong>
                        <div className={`reply${reply.replynum}`}>
                            {reply.reportcnt < 5 ? reply.replycontent
                            :<BlindReply reply={reply} />
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
                <div className="bgUserid"><strong>{data.userid}</strong></div>
                <div className="bgTitle"><strong>{data.boardtitle}</strong></div>
                <div>
                    <div onClick={reportBoard}>신고하기</div>
                    <div>{data.boardregdate}</div>
                </div>
                <div className="bgContent">
                    <div dangerouslySetInnerHTML={{ __html: data.boardcontent }}/>
                </div>
                <div>
                    <Button value="좋아요" onClick={like}></Button>
                </div>
                <div className="btnArea">
                        { boardnum == 2?
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
                            <input type="text" name="userid" value={"loginUser"} readOnly/>
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
            </>
        )
    }
}
export default BoardGet;