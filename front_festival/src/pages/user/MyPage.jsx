import '../../assets/style/usercss.css';
import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import { useEffect, useState } from "react";
import axios from "axios";

const MyPage = () => {
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState("");
    const [user, setUser] = useState({
        userid: '',
        userpw: '',
        username: '',
        userphone: '',
        useremail: '',
        usergender: '',
        zipcode: '',
        addr: '',
        addrdetail: '',
        addretc: ''
    });
    const [file, setFile] = useState("");

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
    }, []);

    useEffect(() => {
        if (loginUser) {
            axios.get(`/api/user/userInfo`, { params: { userid: loginUser } })
                .then((resp) => {
                    setUser(resp.data.user);
                    setFile(resp.data.file);
                })
                .catch((error) => {

                });

        }
    }, [loginUser]);

    return (
        <>
            {loginUser ? (
                <>
                    <Header />
                    <div className="mypage">
                        <div className="profile">
                            <div className="info_area">
                                <div className='img'>
                                    <img src={`/api/user/file/thumbnail/${file}`} alt="" />
                                </div>
                                <div className='info'>
                                    <div>이름</div>
                                    <div>이메일</div>
                                    <div>전화번호</div>
                                    <div>주소</div>
                                </div>
                            </div>
                            <div className="btn_area">
                                <p>개인정보 변경</p>
                                <p>비밀번호 변경</p>
                                <p>프로필 변경</p>
                                <p>회원탈퇴</p>
                            </div>
                        </div>
                        <div className="bookmark">
                            <span>즐겨찾기 목록</span>
                            <span>더 보기</span>
                            <div>
                                목록 3개
                            </div>
                        </div>
                        <div className="community">
                            <span>후기 목록</span>
                            <span>더 보기</span>
                            <div>
                                목록 4개
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div>로딩중</div>
            )}
        </>
    );
}
export default MyPage;