import { useNavigate } from "react-router-dom";
import '../../assets/style/style.css';
import loginImg from '../../assets/images/로그인바탕.png'
import naverImg from '../../assets/images/네이버.png'
import googleImg from '../../assets/images/구글.png'
import kakaoImg from '../../assets/images/카카오.png'


const Login = () => {
    const navigate = useNavigate();

    return(
        <div className="login_wrap">
            <div className="main">
                <div className="center">
                    <div className="logo">
                        <p onClick={()=>{
                            navigate("/")
                        }}>모두의 축제</p>
                    </div>
                    <div className="float">
                        <div className="img">
                            <img src={loginImg} alt="" />
                        </div>
                        <div className="login_area">
                            <div>
                                <div>
                                    <input type="text" name="userid" id="userid" placeholder="아이디를 입력하세요."/>
                                    <br/>
                                    <input type="password" name="userpw" id="userpw" placeholder="비밀번호를 입력하세요."/>
                                    <div>
                                        <div className="text">
                                            <p>아이디 찾기 / 비밀번호 찾기</p>
                                            <p onClick={()=>{
                                                navigate("/user/join")
                                            }}>회원가입</p>
                                        </div>
                                        {/* Button 컴포넌트 들어갈 예정 */}
                                        <div className="login btn">
                                            <input type="button" value="로그인" />
                                        </div>
                                    </div>
                                    <div className="sns_login">
                                        <img src={naverImg} alt="" />
                                        <img src={kakaoImg} alt="" />
                                        <img src={googleImg} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;