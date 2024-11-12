import { useNavigate } from "react-router-dom";
import '../../assets/style/style.css';
import loginImg from '../../assets/images/로그인바탕.png'
import naverImg from '../../assets/images/네이버.png'
import googleImg from '../../assets/images/구글.png'
import kakaoImg from '../../assets/images/카카오.png'
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "../../components/Button";


const Login = () => {
    const navigate = useNavigate();
    const [inputs,setInputs] = useState({userid:"",userpw:""})
    const {userid,userpw} = inputs;
    const [loginUser, setLoginUser] = useState("");
    
    const inputRef = useRef([]);
    const addInputRef = (el) => {
        if(!inputRef.current.includes(el)){
            inputRef.current.push(el);
        }
    }

    const change = (e) => {
        const {name,value} = e.target;
        setInputs({
            ...inputs,
            [name]:value,
        })
    }

    const login = () => {
        if(!userid){
            alert("아이디를 입력해주세요!");
            inputRef.current[0].focus();
            return;
        }
        const user = {userid,userpw};
        console.log(user)

        axios.get('/api/user/login',{params:user}).then((resp)=>{
            if(resp.data.trim() == "O"){
                alert(`${userid}님 환영합니다!`);
                navigate("/");
                setLoginUser(userid);
            }
            else{
                setInputs({userid:"",userpw:""})
                inputRef.current[0].focus();
            }
        })
    }

    useEffect(()=>{
        axios.get("/api/user/joinCheck").then((resp)=>{
            const joinid = resp.data;
            setInputs({...inputs, userid:joinid});
        })
    },[])

    return(
        <div className="login_wrap" id="headernone">
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
                                    <input type="text" name="userid" id="userid" placeholder="아이디를 입력하세요." value={inputs.userid} ref={addInputRef} onChange={change}/>
                                    <br/>
                                    <input type="password" name="userpw" id="userpw" placeholder="비밀번호를 입력하세요." value={inputs.userpw} ref={addInputRef} onChange={change}/>
                                    <div>
                                        <div className="text">
                                            <p>아이디 찾기 / 비밀번호 찾기</p>
                                            <p onClick={()=>{
                                                navigate("/user/join")
                                            }}>회원가입</p>
                                        </div>
                                        <div className="login btn">
                                            <Button  value="로그인" onClick={login}></Button>
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