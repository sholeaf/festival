import { useNavigate } from "react-router-dom";
import '../assets/style/usercss.css';
import { useEffect, useState } from "react";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState("");

    const logoutClick = () => {
        var result = confirm("로그아웃 하시겠습니까?");
        if (result) {
            console.log("삭제가 진행되었습니다.");
        } else {
            console.log("삭제가 취소되었습니다.");
        }
    }

    useEffect(() => {
        axios.get(`/api/user/loginCheck`)
            .then((resp) => {
                setLoginUser(resp.data);
            })
    })
    return (
        <>
            <header>
                <div className="wrap">
                    <div className="main">
                        <div className="area">
                            <div className="logo">
                                <p onClick={() => {
                                    navigate("/")
                                }}>모두의 축제</p>
                            </div>
                            <div className="navi">
                                <div className="schedule_btn">
                                    <a onClick={() => {
                                        navigate("/festival")
                                    }}>축제 일정</a>
                                </div>
                                <div className="review_btn">
                                    <a onClick={() => {
                                        navigate("/community")
                                    }}>축제 후기</a>
                                </div>
                                <div className="notice_btn">
                                    <a onClick={() => {
                                        navigate("/notice")
                                    }}>공지사항</a>
                                </div>
                                <div className="mypage_btn">
                                    <a onClick={() => {
                                        navigate("/user/mypage")
                                    }}>마이페이지</a>
                                </div>
                            </div>
                            {loginUser == "" ?
                                <div className="login_btn">
                                    <a onClick={() => {
                                        navigate("/user/login")
                                    }}>로그인</a>
                                </div>
                                :
                                <div className="login_btn">
                                    <a onClick={() => {
                                        logoutClick()
                                    }}>{loginUser}님</a>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
export default Header;