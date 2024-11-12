import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import { useEffect, useState } from "react";
import axios from "axios";

const MyPage = () => {
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState("");

    useEffect(() => {
        axios.get(`/api/user/loginCheck`)
            .then((resp) => {
                if (!resp.data) {
                    alert("로그인 후 이용 가능합니다.");
                    navigate("/", { replace: true });
                } else {
                    setLoginUser(resp.data);
                }
            })
            .catch((error) => {
                console.error("로그인 상태 확인 오류: ", error);
            });
    }, [navigate]);

    return (
        <>
            <Header />
            <div className="mypage">
                <div className="profile">
                    <div className="info_area">
                        프로필 및 유저의 개인정보
                    </div>
                    <div className="btn_area">
                        프로필 수정 및 개인정보 수정 / 회원탈퇴
                    </div>
                </div>
                <div className="bookmark">

                </div>
                <div className="community">

                </div>
            </div>
        </>
    );
}
export default MyPage;