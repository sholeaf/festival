import { useNavigate } from "react-router-dom";
import '../assets/style/usercss.css';
import { useEffect, useState } from "react";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState("");
    const handleNavigation = (path) => {
        navigate(path);
    };
    const logoutClick = () => {
        axios.get(`/api/user/logout`)
            .then(resp => {
                if (resp.data === "O") {
                    alert("안녕히 가세요!");
                    setLoginUser("");
                    handleNavigation("/");
                }
            })
            .catch((error) => {
                console.error("로그아웃 오류: ", error);
            });
    };
    useEffect(() => {
        axios.get(`/api/user/loginCheck`)
            .then((resp) => {
                setLoginUser(resp.data);
            })
            .catch((error) => {
                console.error("로그인 상태 확인 오류: ", error);
            });
    }, []);
    const renderLoginButton = () => {
        if (loginUser === "") {
            return (
                <div className="login_btn">
                    <a onClick={() => handleNavigation("/user/login")}>로그인</a>
                </div>
            );
        } else {
            return (
                <div className="login_btn">
                    <a onClick={logoutClick}>{loginUser}님</a>
                </div>
            );
        }
    };

    return (
        <header>
            <div className="header_area">
                <div className="navigate">
                    <div className="logo" onClick={() => handleNavigation("/")}>
                        <p>모두의 축제</p>
                    </div>
                    <div className="schedule_btn">
                        <a onClick={() => handleNavigation("/festival")}>축제 일정</a>
                    </div>
                    <div className="review_btn">
                        <a onClick={() => handleNavigation("/community")}>축제 후기</a>
                    </div>
                    <div className="notice_btn">
                        <a onClick={() => handleNavigation("/notice")}>공지사항</a>
                    </div>
                    <div className="mypage_btn">
                        <a onClick={() => handleNavigation("/user/mypage")}>마이페이지</a>
                    </div>

                    {renderLoginButton()}
                </div>
            </div>
        </header>
    );
}
export default Header;