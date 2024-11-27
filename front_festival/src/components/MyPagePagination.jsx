const MyPagePagination = ({ pageNumbers, currentPage, paginate, prevPage, nextPage }) => {
    return (
        <div className="pagination">
            {prevPage && <span onClick={prevPage}>&lt;</span>}
            {pageNumbers.map(number => (
                <span
                    key={number}
                    onClick={() => paginate(number)}
                    className={currentPage === number ? 'active' : ''}
                >
                    {number}
                </span>
            ))}
            {nextPage && <span onClick={nextPage}>&gt;</span>}
        </div>
    );
};
export default MyPagePagination;