import { useNavigate } from "react-router-dom";

const Pagination = ({ pageMaker }) => {
    const navigate = useNavigate();
    const { startpage, endPage, prev, next, cri } = pageMaker;
    const pagenum = cri.pagenum;

    const elList = [];

    const clickBtn = (e) => {
        e.preventDefault();
        const target = Number(e.target.getAttribute("href"));
        const temp = {
            pagenum: target,
            amount: cri.amount,
            type: cri.type,
            keyword: cri.keyword,
            startrow: cri.startrow
        };
        navigate(`/notice/notice`, { state: temp });
    };

    for (let i = startpage; i <= endPage; i++) {
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
            {prev && (
                <a className="btn changePage" href={startpage - 1} key={startpage - 1} onClick={clickBtn}>&lt;</a>
            )}
            {elList}
            {next && (
                <a className="btn changePage" href={endPage + 1} key={endPage + 1} onClick={clickBtn}>&gt;</a>
            )}
        </div>
    );
};

export default Pagination;
