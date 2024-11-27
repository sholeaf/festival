import { useLocation, useNavigate } from "react-router-dom";
import '../../assets/style/usercss.css';
import loginImg from '../../assets/images/로그인바탕.png'
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

const API_KEY = 'ADUQciriMbR143Lb7A8xLWVlcBZQXuCPTgGmksfopPBMwtmLQhkIrGlBror4PosCYnLLVqtrEnZz1T%2F4N9atVg%3D%3D';

const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [inputs, setInputs] = useState({ userid: "", userpw: "" })
    const { userid, userpw } = inputs;
    const [loginUser, setLoginUser] = useState("");
    const [emailCode, setEmailCode] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeModal, setActiveModal] = useState('');

    const openModal1 = () => {
        setActiveModal('findId');
        setIsModalOpen(true);
    };
    const openModal2 = () => {
        setActiveModal('findPw');
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);  // 모달을 닫는 함수
    };

    const inputRef = useRef([]);



    const addInputRef = (el) => {
        if (!inputRef.current.includes(el)) {
            inputRef.current.push(el);
        }
    }

    const change = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        })
    }

    const login = () => {
        let from = "";
        let detailFestival = false;
        if(location.state != null){
            from = location.state.state.from;
            const txt = from.split('/');
            console.log(txt)
            if(txt[1] == "festival" && txt.length >= 3){
                detailFestival = true;
            }
        }
        else{
            from = '/';
        }

        if (!userid) {
            alert("아이디를 입력해주세요!");
            inputRef.current[0].focus();
            return;
        }
        if (!userpw) {
            alert("비밀번호를 입력해주세요!");
            inputRef.current[1].focus();
            return;
        }

        const user = { userid, userpw };

        axios.get('/api/user/login', { params: user }).then((resp) => {
            if (resp.data.trim() == "O") {
                alert(`${userid}님 환영합니다!`);
                if(detailFestival){
                    navigate(`${from}`, { state: { API_KEY }});
                }
                else{
                    navigate(`${from}`);
                }

                setLoginUser(userid);
            }
            else {
                alert("로그인을 실패하였습니다.\n아이디 및 비밀번호를 다시 확인 후 시도해 주세요.");
                setInputs({ userid: "", userpw: "" })
                inputRef.current[0].focus();
            }
        })
    }

    const getCode1 = () => {
        const formData = new FormData();

        let email = document.getElementById("useremail1").value;

        formData.append('email', email);

        axios.post('/api/mail/confirm.json', formData)
            .then((resp) => {
                setEmailCode(resp.data);
                alert("인증번호 : " + resp.data);
            })
            .catch((err) => {
                alert("실패");
            })
    }

    const codeCheck1 = () => {
        const code = document.getElementById("code1");
        if (code.value == "") {
            alert("인증번호를 입력하신 후 확인을 클릭해 주세요.");
            return;
        }
        if (code.value != emailCode) {
            alert("인증번호가 일치하지 않습니다. 정확한 인증번호를 입력했는지 다시 한번 확인해 주세요.");
            return;
        }
        if (code.value == emailCode) {
            alert("인증이 완료되었습니다!");
            findId();
        }
    }

    const findId = () => {
        const result = document.getElementById("result1");
        const result_id = document.getElementById("result_id");
        let email = document.getElementById("useremail1").value;

        axios.get('/api/user/getUser', { params: { email } })
            .then(resp => {
                if (!resp.data) {
                    result_id.innerHTML = "";
                    return;
                }
                else {
                    result.style.display = "block";
                    result_id.innerHTML = `${resp.data.userid}`;
                }
            })
    }
    const getCode2 = () => {
        const formData = new FormData();

        const email = document.getElementById("useremail2");
        const user = document.getElementById("userId");

        let userid = user.value;

        if (!userid) {
            alert("아이디를 입력해 주세요!");
            return;
        }
        if (!email.value) {
            alert("이메일을 입력하신 후 인증번호 받기를 클릭해 주세요.");
            return;
        }

        axios.get('/api/user/userInfo', { params: { userid } })
            .then(resp => {
                if (!resp.data.user.useremail) {
                    alert("아이디에 해당하는 이메일이 존재하지 않습니다.\n아이디를 다시 확인해 주세요.");
                    return;
                }
                if (resp.data.user.useremail != email.value) {
                    alert("아이디에 해당하는 이메일과 작성하신 이메일이 일치하지 않습니다.\n이메일을 다시 작성해 주세요.");
                    return;
                }
                if (resp.data.user.useremail == email.value) {
                    formData.append('email', email.value);


                    axios.post('/api/mail/confirm.json', formData)
                        .then((resp) => {
                            setEmailCode(resp.data);
                            alert("인증번호 : " + resp.data);
                        })
                        .catch((err) => {
                            alert("실패");
                        })
                }
            })


    }

    const codeCheck2 = () => {
        const code = document.getElementById("code2");

        if (code.value == "") {
            alert("인증번호를 입력하신 후 확인을 클릭해 주세요.");
            return;
        }
        if (code.value != emailCode) {
            alert("인증번호가 일치하지 않습니다. 정확한 인증번호를 입력했는지 다시 한번 확인해 주세요.");
            return;
        }
        if (code.value == emailCode) {
            alert("인증이 완료되었습니다!");
            findPw();
        }
    }

    const findPw = () => {
        const result = document.getElementById("result2");
        const result_pw = document.getElementById("result_pw");
        const user = document.getElementById("userId");

        let userid = user.value;

        axios.get('/api/user/userInfo', { params: { userid } })
            .then(resp => {
                if (!resp.data) {
                    result_pw.innerHTML = "";
                    return;
                }
                else {
                    result.style.display = "block";
                    result_pw.innerHTML = `${resp.data.user.userpw}`;
                }
            })
    }

    useEffect(() => {
        axios.get("/api/user/joinCheck").then((resp) => {
            const joinid = resp.data;
            setInputs({ ...inputs, userid: joinid });
        })
    }, [])

    return (
        <div className="login_wrap" id="headernone">
            <div className="main">

                <div className="logo">
                    <p onClick={() => {
                        navigate("/")
                    }}>모두의 축제</p>
                </div>
                <div className="flex">
                    <div className="img">
                        <img src={loginImg} alt="" />
                    </div>
                    <div className="login_area">
                        <div className="wrap">
                            <input type="text" name="userid" id="userid" placeholder="아이디를 입력하세요." value={inputs.userid} ref={addInputRef} onChange={change} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    login();
                                }
                            }} />
                            <input type="password" name="userpw" id="userpw" placeholder="비밀번호를 입력하세요." value={inputs.userpw} ref={addInputRef} onChange={change} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    login();
                                }
                            }} />
                            <div className="text">
                                <p><span onClick={openModal1}>아이디 찾기</span> / <span onClick={openModal2}>비밀번호 찾기</span></p>
                                <p>
                                    <span onClick={() => { navigate("/user/join") }}>회원가입</span>
                                </p>
                            </div>
                            <div className="login">
                                <Button value="로그인" className={"btn"} onClick={login}></Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={isModalOpen} closeModal={closeModal}>
                    {
                        activeModal === 'findId' && (
                            <div className="findId">
                                <h2>아이디 찾기</h2>
                                <input type="email" name="useremail" id="useremail1" placeholder="이메일" />
                                <Button id={getCode1} value="인증번호 받기" onClick={getCode1}></Button>
                                <input type="text" name="code" id="code1" placeholder="인증번호" />
                                <Button id={codeCheck1} value="인증번호 확인" onClick={codeCheck1}></Button>
                                <div id="result1">
                                    <h4>찾으시는 아이디</h4>
                                    <p id="result_id"></p>
                                </div>
                            </div>
                        )}
                    {
                        activeModal === 'findPw' && (
                            <div className="findPw">
                                <h2>비밀번호 찾기</h2>
                                <input type="text" name="userId" id="userId" placeholder="아이디" />
                                <input type="email" name="useremail" id="useremail2" placeholder="이메일" />
                                <Button id={getCode2} value="인증번호 받기" onClick={getCode2}></Button>
                                <input type="text" name="code" id="code2" placeholder="인증번호" />
                                <Button id={codeCheck2} value="인증번호 확인" onClick={codeCheck2}></Button>
                                <div id="result2">
                                    <h4>찾으시는 비밀번호</h4>
                                    <p id="result_pw"></p>
                                </div>
                            </div>
                        )}
                </Modal>
            </div>
        </div >
    )
}
export default Login;