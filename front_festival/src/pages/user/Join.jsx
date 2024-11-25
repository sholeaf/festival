import '../../assets/style/usercss.css';
import { useNavigate } from "react-router-dom";
import DaumPostCode from "../../components/DaumPostCode";
import axios from 'axios';
import { useState } from "react";
import Button from '../../components/Button';

const Join = () => {
    const navigate = useNavigate();
    const [emailCode, setEmailCode] = useState("");
    let codeFlag = false;

    const idCheck = (e) => {
        const result = document.getElementById(`id_result`);
        const user = document.joinForm.userid;
        let userid = user.value;
        if (e.target.value == "" || e.target.value == null) {
            result.style.display = "none";
            return;
        }
        if (e.target.value.length > 12) {
            user.blur();
            return;
        }

        if (user.value.length >= 5) {
            axios.get('/api/user/checkId', { params: { userid } })
                .then(resp => {
                    if (resp.data == "O") {
                        result.innerHTML = "사용할 수 있는 아이디입니다!";
                        if (user.value.length > 12) {
                            result.innerHTML = "아이디는 최대 12자 입니다!";
                            return;
                        }
                    }
                    else {
                        result.innerHTML = "중복된 아이디가 있습니다!";
                        return;
                    }
                })
        }
        if (user.value.length < 5) {
            result.style.display = "block";
            result.innerHTML = "아이디는 최소 5자 입니다!";
            return;
        }
    }
    const pwCheck = (e) => {
        const userpw = document.joinForm.userpw;
        const userpw_re = document.joinForm.userpw_re;
        const pw_result = document.getElementById(`pw_result`);
        const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@#$%^&*\-]).{4,}$/;

        if (userpw.value.length == "" || userpw.value.length == null) {
            pw_result.style.display = "none";
            return;
        }
        if (userpw.value.length <= 8) {
            pw_result.style.display = "block";
            pw_result.innerHTML = "비밀번호의 길이는 최소 9자 입니다!";
            return;
        }
        if (userpw.value.length > 12) {
            pw_result.innerHTML = "비밀번호의 길이는 최대 12자 입니다!";
            return;
        }
        if (!reg.test(userpw.value)) {
            pw_result.innerHTML = "비밀번호는 영어 대문자, 소문자, 숫자, 특수문자(~,?,!,@,#,$,%,^,&,-)를 조합해서 만들어주세요";
            return;
        }
        if (userpw.value.length != userpw_re.value.length) {
            pw_result.innerHTML = "비밀번호 확인을 완료해주세요!";
            return;
        }

        if (userpw.value != userpw_re.value) {
            pw_result.innerHTML = "비밀번호가 일치하지 않습니다!";
            return;
        }
        else {
            pw_result.innerHTML = "비밀번호 확인 완료!";
            document.joinForm.username.focus();
        }
    }

    const getCode = () => {
        const formData = new FormData();

        const email = document.joinForm.useremail.value;

        formData.append('email', email);

        axios.post('/api/mail/confirm.json', formData)
            .then((resp) => {
                alert("인증번호 : " + resp.data);
                setEmailCode(resp.data);
            })
            .catch((err) => {
                alert("실패");
            })
    }

    const codeCheck = () => {
        const codeCheck = document.joinForm.codeCheck;
        if (codeCheck.value == "") {
            codeFlag = false;
        }
        if (codeCheck.value != emailCode) {
            codeFlag = false;
        }
        if (codeCheck.value == emailCode) {
            codeFlag = true;
            alert("인증 성공되었습니다!");
        }
    }

    const clickJoin = () => {
        const joinForm = document.joinForm;

        const userid = joinForm.userid;
        if (userid.value == "") {
            alert("아이디를 입력하세요!")
            userid.focus();
            return false;
        }
        if (userid.value.length < 5 || userid.value.length > 12) {
            alert("아이디는 5자 이상 12자 이하로 입력하세요!");
            userid.focus();
            return false;
        }

        const result = document.getElementById("id_result");
        if (result.innerHTML == "") {
            alert("아이디 중복검사를 진행해주세요!");
            userid.focus();
            return false;
        }
        if (result.innerHTML == "중복된 아이디가 있습니다!") {
            alert("중복체크 통과 후 가입이 가능합니다!");
            userid.focus();
            return false;
        }

        const userpw = joinForm.userpw;
        const userpw_re = document.joinForm.userpw_re;
        const pw_result = document.getElementById(`pw_result`);
        if (userpw.value == "") {
            alert("비밀번호를 입력해주세요!");
            userpw.focus();
            return false;
        }
        if (userpw_re.value == "") {
            alert("비밀번호 확인을 입력해주세요!");
            userpw_re.focus();
            return false;
        }
        if (pw_result.innerHTML != "비밀번호 확인 완료!") {
            alert("비밀번호 확인을 완료해주세요!");
            userpw_re.focus();
            return false;
        }

        const username = joinForm.username;
        if (username.value == "") {
            alert("이름을 입력하세요!");
            username.focus();
            return false;
        }

        const exp_name = /[가-힣]+$/;
        if (!exp_name.test(username.value)) {
            alert("이름에는 한글만 입력하세요!");
            username.focus();
            return false;
        }

        const userphone = joinForm.userphone;
        const exp_phone = /^\d{11}$/;
        if (userphone.value.length != 11) {
            alert("전화번호 11자를 입력해주새요!");
            userphone.focus();
            return false;
        }
        if (!exp_phone.test(userphone.value)) {
            alert("전화번호는 숫자만 입력해주새요!");
            userphone.focus();
            return false;
        }

        const useremail = joinForm.useremail;
        const exp_email = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (useremail.value == "") {
            alert("이메일을 입력해주세요!")
            return false;
        }
        if (!exp_email.test(useremail.value)) {
            alert("이메일 형식에 맞도록 작성해 주세요!");
            return false;
        }
        if (!codeFlag) {
            alert("이메일 인증을 진행해 주세요!");
            return false;
        }


        const usergender = joinForm.usergender;
        if (!usergender[0].checked && !usergender[1].checked) {
            alert("성별을 선택하세요!");
            return false;
        }

        const zipcode = joinForm.zipcode;
        if (zipcode.value == "") {
            alert("주소찾기를 진행해주세요!");
            return false;
        }

        const addrdetail = joinForm.addrdetail;
        if (addrdetail.value == "") {
            alert("나머지 주소를 입력해주세요.")
            addrdetail.focus();
            return false;
        }

        const user = {
            userid: userid.value,
            userpw: userpw.value,
            username: username.value,
            userphone: userphone.value,
            usergender: usergender.value.trim(),
            useremail: useremail.value,
            zipcode: zipcode.value,
            addr: joinForm.addr.value,
            addrdetail: addrdetail.value,
            addretc: joinForm.addretc.value,
        }

        const name = joinForm.name;
        const email = joinForm.email;
        const gender = joinForm.gender;
        
        const userInfo = {
            userid : userid.value,
            nameinfo : name.value,
            emailinfo : email.value,
            genderinfo : gender.value
        }

        const userData = { user, userInfo };

        axios.post('/api/user/join', userData)
            .then((resp) => {
                alert("회원가입 성공!");
                navigate("/user/login");
            })
            .catch((err) => {
                alert("회원가입 실패!");
            })

    }

    return (
        <div className="joinpage">
            <div className="wrap">
                <div className="logo">
                    <p onClick={() => {
                        navigate("/")
                    }}>모두의 축제</p>
                </div>
                <form action="/user/join" method="post" name="joinForm">
                    <input type="text" name="userid" id="userid" placeholder="아이디를 입력 하세요" onChange={idCheck} />
                    <p id="id_result"></p>
                    <input type="password" name="userpw" id="userpw" placeholder="비밀번호를 입력 하세요" onChange={pwCheck} />
                    <input type="password" name="userpw_re" id="userpw_re" placeholder="비밀번호확인" onChange={pwCheck} />
                    <p id="pw_result"></p>
                    <input type="text" name="username" id="username" placeholder="이름을 입력 하세요" />
                    <div className='infoSelect'>
                        <div>
                            <input type="radio" name="name" id="name1" value="T" checked/>
                            <label htmlFor="name1">공개</label>
                        </div>
                        <div>
                            <input type="radio" name="name" id="name2" value="F" />
                            <label htmlFor="name2">비공개</label>
                        </div>
                    </div>
                    <input type="text" name="userphone" id="userphone" placeholder="전화번호를 입력 하세요" />
                    <input type="email" name="useremail" id="useremail" placeholder="이메일을 입력 하세요" />
                    <div className='infoSelect'>
                        <div>
                            <input type="radio" name="email" id="email1" value="T" checked/>
                            <label htmlFor="email1">공개</label>
                        </div>
                        <div>
                            <input type="radio" name="email" id="email2" value="F" />
                            <label htmlFor="email2">비공개</label>
                        </div>
                    </div>
                    <input type="button" value="인증번호 받기" className='codeGet' onClick={getCode} />
                    <input type="text" name="codeCheck" className="codeCheck" placeholder="인증번호를 입력 하세요" onChange={(e) => {
                        codeCheck(e)
                    }} />
                    <div className='radioBox'>
                        <div className="flexBox">
                            <div className="radio_item">
                                <input type="radio" id="usergender1" name="usergender" value="M" checked/>
                                <label htmlFor="usergender1">
                                    남자
                                </label>
                            </div>
                            <div className="radio_item">
                                <input type="radio" id="usergender2" name="usergender" value="W" />
                                <label htmlFor="usergender2">
                                    여자
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='infoSelect'>
                        <div>
                            <input type="radio" name="gender" id="gender1" value="T" checked/>
                            <label htmlFor="gender1">공개</label>
                        </div>
                        <div>
                            <input type="radio" name="gender" id="gender2" value="F" />
                            <label htmlFor="gender2">비공개</label>
                        </div>
                    </div>
                    <div className="zipcode_area">
                        <DaumPostCode></DaumPostCode>
                        <input type="text" name="addr" id="addr" placeholder="주소" readOnly />
                        <input type="text" name="addrdetail" id="addrdetail" placeholder="상세주소" />
                        <input type="text" name="addretc" id="addretc" placeholder="참고항목" readOnly />
                    </div>
                    <Button value="회원가입" className="joinBtn" onClick={() => {
                        clickJoin()
                    }}></Button>
                </form>
            </div>
        </div>
    )
}
export default Join;
