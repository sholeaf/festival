import { useEffect, useState } from "react";
import Dropdown from "../../components/Dropdown";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import Pagination from "../../components/Paginstion";
import Header from "../../layout/Header";

const BoardList = () =>{
    const navigate = useNavigate();
    const location = useLocation();
    const [loginUser, setLoginUser] = useState("");

    const [data, setData] = useState();
    const [cri,setCri] = useState({
        pagenum:1,
        amount:10,
        type:"a",
        keyword:"",
        startrow:0
    });
    const [pageMaker, setPagemaker] = useState({
        startPage:1,
        endPage:1,
        realEnd:1,
        total:0,
        prev:false,
        next:false,
        cri:null
    })
    const [inputs,setInputs] = useState("");
    const inputKeyword = (e) => {
        setInputs(e.target.value);
    }
    const clickSearch = (e) => {
        e.preventDefault();
        const changedCri = {
            ...cri,
            type:document.getElementById("type").value,
            keyword:inputs,
            pagenum:1
        };
        setCri(changedCri);
    }

    useEffect(()=>{
        axios.get(`/api/board/list/${cri.pagenum}`,{params:cri}).then((resp)=>{
            setData(resp.data);
            setPagemaker(resp.data.pageMaker);
            setInputs(resp.data.pageMaker.cri.keyword);
        })
        axios.get(`/api/user/loginCheck`).then(resp=>{
            if(resp.data.trim() != ""){
                setLoginUser(resp.data.trim());
            }
        })
    },[cri])
    useEffect(()=>{
        //만약 이전 페이지에서 cri를 받아온것이 있다면
        if(location.state){
            //pageMaker의 cri를 그 받아온 것으로 세팅
            //State가 변화했으므로 리렌더링 진행
            // > 위에 있는 pageMaker에 종속되어 있는 Effect 호출
            setCri(location.state);
        }
    },[location.state])
    const searchType = {"전체":"a", "제목":"T", "내용":"C", "작성자":"W", "태그":"G"}
    const changeType = (value) => {
        const changedCri = {...cri, type:value}
        if(document.getElementById("type").value == 'a'){
            changedCri.keyword = "";
        }
        setCri(changedCri);
        console.log(inputs);
    }

    const extractTextFromHTML = (htmlString, maxLength) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const textContent = doc.body.textContent || doc.body.innerText;
    
        // 텍스트 길이를 maxLength로 제한
        if (textContent.length > maxLength) {
          return textContent.slice(0, maxLength) + '...'; // 길이를 넘으면 '...'을 추가
        }
        return textContent;
      };

    if(!data){
        return <>로딩중...</>
    }
    else{
        const list = data.list;
        const elList = [];
        if(list && list.length>0){
            for(const board of list){
                elList.push(
                    <div className="board_obj" key={board.boardnum} >
                        <div>{board.userid}</div>
                        <div>{board.boardregdate}</div>
                        <div className="getBoard" onClick={()=>{navigate(`/board/${board.boardnum}`,{state:cri})}}>{board.boardtitle}</div>
                        <div className="getBoard" onClick={()=>{navigate(`/board/${board.boardnum}`,{state:cri})}}>{extractTextFromHTML(board.boardcontent, 210)}</div>
                        <div className="getBoard" onClick={()=>{navigate(`/board/${board.boardnum}`,{state:cri})}}><img src={board.titleImage? `/api/file/thumbnail?systemname=`+board.titleImage:""} ></img></div>
                        <div>좋아요 {board.likeCnt}</div>
                        <div>댓글 {board.replyCnt}</div>
                    </div>
                )
            }
        }
        return (
            <>
            <Header></Header>
            <div id="board_wrap" className="list">
                
                <div>
                    <a className="btn" onClick={()=> {
                        if(loginUser == null || loginUser == ""){
                            alert("로그인해야 글을 쓰실 수 있습니다!");
                            return;
                        }
                        navigate("/board/write",{state:cri})}}>글쓰기</a>
                </div>
                <div className="tbody">
                    <div className="board_obj">
                        <div>아이디</div>
                        <div>등록시간</div>
                        <div>제목</div>
                        <div>내용</div>
                        <div>이미지</div>
                        <div>좋아요</div>
                        <div>댓글</div>
                    </div>
                </div>
                <div style={{height:"30px"}}>
                </div>
                <div>
                    {elList}
                </div>
                <Pagination pageMaker={pageMaker}></Pagination>
                <div className="search_area">
                    <form name="searchForm" id="searchForm" action="/board/list" className="row">
                        <Dropdown list={searchType} name={"type"} width={150} value={cri.type} onChange={changeType}></Dropdown>
                        <input type="search" id="keyword" name="keyword" onChange={inputKeyword} value={inputs}/>
                        <a id="search-btn" className="btn" onClick={clickSearch}>검색</a>
                        <input type="hidden" name="pagenum"/>
                        <input type="hidden" name="amount"/>
                    </form>
                </div>
            </div>
            </>
        )
    }
}
export default BoardList;