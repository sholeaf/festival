import { useNavigate } from "react-router-dom";
import '../assets/style/style.css';

const Header = () => {
    const navigate = useNavigate();
    return(
        <>
            <header>
                <div className="wrap">
                    <div className="main">
                        <div className="area">
                            <div className="logo">
                                <p onClick={()=>{
                                        navigate("/")
                                    }}>모두의 축제</p>
                            </div>
                            <div className="navi">
                                <div className="schedule_btn">
                                    <a onClick={()=>{
                                        navigate("/festival")
                                    }}>축제 일정</a>
                                </div>
                                <div className="review_btn">
                                    <a onClick={()=>{
                                        navigate("/community")
                                    }}>축제 후기</a>
                                </div>
                                <div className="notice_btn">
                                    <a onClick={()=>{
                                        navigate("/notice")
                                    }}>공지사항</a>
                                </div>
                                <div className="mypage_btn">
                                    <a onClick={()=>{
                                        navigate("/user/mypage")
                                    }}>마이페이지</a>
                                </div>
                            </div>
                            <div className="login_btn">
                                <a onClick={()=>{
                                    navigate("/user/login")
                                }}>로그인</a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
export default Header;