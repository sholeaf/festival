import { useNavigate } from "react-router-dom";
import '../assets/style/usercss.css';
import { useEffect, useState } from "react";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState("");
    const handleNavigation = (path, state) => {
        navigate(path, { state: { ...state } });
    };
        //관리자체크
    const [isAdmin, setIsAdmin] = useState(false);

    const logoutClick = () => {
        if (window.confirm("로그아웃하시겠습니까?")) {
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
        }
    };
    useEffect(() => {
        axios.get(`/api/user/loginCheck`)
            .then((resp) => {
                setLoginUser(resp.data);  // 로그인 정보로 loginUser를 설정   
            })
            .catch((error) => {
                console.error("로그인 상태 확인 오류: ", error);
            });
    }, []);
    // 페이지 로드 시 관리자 여부를 확인
    useEffect(() => {
        axios.get('/api/notice/checkadmin')
            .then(response => {
                setIsAdmin(response.data.admin); 
            })
            .catch(error => {
                setIsAdmin(false);  
            });
    }, []);
    const renderLoginButton = () => {
        if (loginUser == "") {
            return (
                <div className="login_btn">
                    <a onClick={() => handleNavigation("/user/login", { state: { from: window.location.pathname } })}>로그인</a>
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
                    <div className="logo" onClick={() =>
                        navigate("/")
                        }>
                        <a>모두의 축제</a>
                    </div>
                    <div className="schedule_btn">
                        <a onClick={() => navigate("/festival")}>축제 일정</a>
                    </div>
                    <div className="review_btn">
                        <a onClick={() => navigate("/board/list")}>축제 후기</a>
                    </div>
                    <div className="notice_btn">
                        <a onClick={() => handleNavigation("/notice/list")}>공지사항</a>
                    </div>

                    {/* 관리자가 아닐 경우에만 '마이페이지' 버튼을 보여주고, 관리자가 아닐 경우 '관리자페이지'는 감춤 */}
                    {!isAdmin && (
                        <div className="mypage_btn">
                            <a onClick={() => handleNavigation("/user/mypage")}>마이페이지</a>
                        </div>
                    )}

                    {/* 관리자인 경우에만 '관리자페이지' 버튼을 보여주고, '마이페이지'는 감춤 */}
                    {isAdmin && (
                        <div className="mypage_btn">
                            <a onClick={() => handleNavigation("/notice/adminpage")}>관리자페이지</a>
                        </div>
                    )}

                    {renderLoginButton()}
                </div>
            </div>
        </header>
    );
}
export default Header;