import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Pagination = ({ pageMaker, url, replyPageMaker, fetchReplies  }) => {
    const navigate = useNavigate();
    const startPage = pageMaker?.startPage;
    const endPage = pageMaker?.endPage;
    const cri = pageMaker?.cri;
    const pagenum = cri?.pagenum;
    const replyStartPage = replyPageMaker?.startPage;
    const replyEndPage = replyPageMaker?.endPage;
    const replyCri = replyPageMaker?.cri;
    const replyPagenum = replyCri?.pagenum;
    const [replies, setReplies] = useState([]);
    
    const elList = [];
    const replyElList =[];

    const fetchReplyData = async (pageNum) => {
        const response = await fetchReplies(pageNum);
        setReplies(response);  // 댓글 데이터를 상태로 업데이트
    };

    const clickBtn = (e, isReplyPage) => {
        e.preventDefault();
        const target = e.target.getAttribute("href");


      const pageNum = Number(target);

        const temp = isReplyPage ? {
            pagenum: pageNum,
            amount: replyCri.amount,
            type: replyCri.type,
            keyword: replyCri.keyword,
            startrow: replyCri.startrow,
        } : {
            pagenum: pageNum, 

        console.log(target);
        const temp = {
            pagenum: target,

            amount: cri.amount,
            type: cri.type,
            keyword: cri.keyword,
            startrow: cri.startrow,
        };
        navigate(`${url}?pagenum=${pageNum}`, { state:temp });
        if (isReplyPage) {
            fetchReplyData(pageNum); 
        }
    };
    if (pageMaker) {
    for (let i = startPage; i <= endPage; i++) {
        if (pagenum === i) {
            elList.push(<span className="nowPage" key={i}>{i}</span>);
        } else {
            elList.push(
                <a className="btn changePage" href={i} key={i} onClick={clickBtn}>{i}</a>
            );
        }
    }
}
    if (replyPageMaker) {
        for (let i = replyStartPage; i <= replyEndPage; i++) {
            if (replyPagenum === i) {
                replyElList.push(<span className="nowPage" key={i}>{i}</span>);
            } else {
                replyElList.push(
                    <a className="btn changePage" href={i} key={i} onClick={(e) => clickBtn(e, i, true)}>{i}</a>
                );
            }
        }
    }

    return (
        <div className="pagination w1000 tac"> 
    {replyPageMaker ? (
        replyPageMaker.prev ? 
        <a className="btn changePage" href={replyStartPage - 1} key={replyStartPage - 1} onClick={(e) => clickBtn(e, replyStartPage - 1, true)}>&lt;</a> 
        : ""
    ) : (
        pageMaker.prev ? 
        <a className="btn changePage" href={startPage - 1} key={startPage - 1} onClick={clickBtn}>&lt;</a> 
        : ""
    )} 
    {replyPageMaker ? replyElList : elList}  
    {replyPageMaker ? (
        replyPageMaker.next ? 
        <a className="btn changePage" href={replyEndPage + 1} key={replyEndPage + 1} onClick={(e) => clickBtn(e, replyEndPage + 1, true)}>&gt;</a> 
        : ""
    ) : (
        pageMaker.next ? 
        <a className="btn changePage" href={endPage + 1} key={endPage + 1} onClick={clickBtn}>&gt;</a> 
        : ""
    )}
</div>
    );
};

export default Pagination;
