import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    return (
        <header>
            <div className="header_area">
                <div className="navigate">
                    <a className="logo" onClick={() => {
                       navigate("/");
                    }}>모두의 축제</a>
                    <a onClick={() => {
                        navigate("/festival");
                    }}>축제 일정</a>
                    <a onClick={() => {
                        navigate("/community");
                    }}>축제 후기</a>
                    <a onClick={() => {
                        navigate("/notice/notice");
                    }}>공지 사항</a>
                    <a onClick={() => {
                        navigate("/mypage");
                    }}>마이 페이지</a>
                    <a onClick={() => {
                        navigate("/login");
                    }}>로그인</a>

                </div>
            </div>
        </header>
    );
}

export default Header;