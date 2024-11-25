import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Pagination = ({ pageMaker, url }) => {
    const navigate = useNavigate();
    const startPage = pageMaker.startPage;
    const endPage = pageMaker.endPage;
    const cri = pageMaker.cri;
    const pagenum = cri.pagenum;
    const location = useLocation();
    const [stateCri, setStateCri] = useState(cri);
    
    const elList = [];

    const clickBtn = (e, pageNumber) => {
        e.preventDefault();

        const target = e.target.getAttribute("href");
        console.log(target);
        const temp = {
            pagenum: target,
            amount: cri.amount,
            type: cri.type,
            keyword: cri.keyword,
            startrow: cri.startrow
        };
        
        navigate(`${url}?pagenum=${pageNumber}`, { state:temp });
    };

    for (let i = startPage; i <= endPage; i++) {
        if (pagenum === i) {
            elList.push(<span className="nowPage" key={i}>{i}</span>);
        } else {
            elList.push(
                <a className="btn changePage" href={i} key={i} onClick={clickBtn}>{i}</a>
            );
        }
    }

    return (
        <div className="pagination w1000 tac">
            {
                pageMaker.prev ?
                <a className="btn changePage" href={startPage - 1} key={startPage - 1} onClick={clickBtn}>&lt;</a>:""
            }
            {elList}
            {
                pageMaker.next ? 
                <a className="btn changePage" href={endPage + 1} key={endPage + 1} onClick={clickBtn}>&gt;</a>:""
            }
        </div>
    );
};

export default Pagination;
