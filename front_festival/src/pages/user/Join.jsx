import { useNavigate } from "react-router-dom";
import DaumPostCode from "../../components/DaumPostCode";
import axios from 'axios';

const Join = () => {
    const navigate = useNavigate();
    let pwTest = [false, false, false, false, false]
    const checkId = (e) => {
        const result = document.getElementById(`id_result`);
        const userid = document.joinForm.userid;
        console.log(userid.value);
        if (userid.value.length >= 5) {
            axios.get('/api/user/checkId', userid.value)
                .then(resp => {
                    if (resp.data == "O") {
                        result.innerHTML = "사용할 수 있는 아이디입니다!";
                    }
                    else {
                        result.innerHTML = "중복된 아이디가 있습니다!";
                        userid.value = "";
                        userid.focus();
                    }
                })
        }
        if(userid.value.length == 0){
            result.innerHTML = "아이디를 입력해 주세요!";
            userid.focus();
        }
    }
    const pwCheck = (e) => {
        const userpw = document.joinForm.userpw;
        const userpw_re = document.joinForm.userpw_re;
        const pw_result = document.getElementById(`pw_result`);
        const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@-]).{4,}$/;
        console.log(userpw.value);
        console.log(userpw_re.value);

        if(userpw.value.length <= 8){
            pw_result.innerHTML = "비밀번호의 길이는 9자 이상으로 해주세요!";
            return;
        }
        if(!reg.test(userpw.value)){
            pw_result.innerHTML = "비밀번호는 영어 대문자, 소문자, 숫자, 특수문자를 조합해서 만들어주세요";
            return;
        }
        if(userpw.value.length != userpw_re.value.length){
            pw_result.innerHTML = "비밀번호 확인을 완료해주세요!";
            return;
        }

        if(userpw.value != userpw_re.value){
            pw_result.innerHTML = "비밀번호가 일치하지 않습니다!";
            return;
        }
        else{
            pw_result.innerHTML = "비밀번호 확인 완료!";
            document.joinForm.username.focus();
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
        if(userpw.value == ""){
            alert("비밀번호를 입력해주세요!");
            userpw.focus();
            return false;
        }
        if(userpw_re.value == ""){
            alert("비밀번호 확인을 입력해주세요!");
            userpw_re.focus();
            return false;
        }
        if(pw_result.innerHTML != "비밀번호 확인 완료!"){
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
        const exp_phone =/^\d{11}$/;
        if(userphone.value.length != 11){
            alert("전화번호 11자를 입력해주새요!");
            userphone.focus();
            return false;
        }
        if(!exp_phone.test(userphone.value)){
            alert("전화번호는 숫자만 입력해주새요!");
            userphone.focus();
            return false;
        }

        const usergender = joinForm.usergender;
        if (!usergender[0].checked && !usergender[1].checked) {
            alert("성별을 선택하세요!");
            return false;
        }

        const useremail = joinForm.useremail;


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
        console.log(user);

        axios.post('/api/user/join', user)
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
                    <input type="text" name="userid" id="userid" placeholder="아이디를 입력 하세요" onChange={checkId} />
                    <p id="id_result"></p>
                    <input type="password" name="userpw" id="userpw" placeholder="비밀번호를 입력 하세요" onChange={pwCheck} />
                    <input type="password" name="userpw_re" id="userpw_re" placeholder="비밀번호확인" onChange={pwCheck} />
                    <p id="pw_result"></p>
                    <input type="text" name="username" id="username" placeholder="이름을 입력 하세요" />
                    <input type="text" name="userphone" id="userphone" placeholder="전화번호를 입력 하세요" />
                    <input type="email" name="useremail" id="useremail" placeholder="이메일을 입력 하세요" />
                    <input type="button" value="인증번호 받기" />
                    <input type="text" name="checknum" id="checknum" placeholder="인증번호를 입력 하세요" />
                    <div className="flexBox">
                        <div className="radio_item">
                            <input type="radio" id="usergender1" name="usergender" value="M" />
                            <label htmlFor="usergender1">
                                남자
                            </label>
                        </div>
                        <div className="radio_item">
                            <input type="radio" id="usergender2" name="usergender" value="M" />
                            <label htmlFor="usergender2">
                                여자
                            </label>
                        </div>
                    </div>
                    <div className="zipcode_area">
                        <DaumPostCode></DaumPostCode>
                        <input type="text" name="addr" id="addr" placeholder="주소" readOnly />
                        <input type="text" name="addrdetail" id="addrdetail" placeholder="상세주소" />
                        <input type="text" name="addretc" id="addretc" placeholder="참고항목" readOnly />
                    </div>
                </form>
                <input type="button" value="회원가입" onClick={() => {
                    clickJoin()
                }} />
            </div>
        </div>
    )
}
export default Join;
