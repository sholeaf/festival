import '../../assets/style/usercss.css';
import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from '../../components/Modal';
import DaumPostCode from '../../components/DaumPostCode';
import Button from '../../components/Button';

const MyPage = () => {
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [file, setFile] = useState("");
    const [deleteFile, setDeleteFile] = useState("");
    const [updateFile, setUpdateFile] = useState();
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeModal, setActiveModal] = useState('');

    const [emailCode, setEmailCode] = useState("");
    let codeFlag = false;


    const openModal1 = () => {
        setActiveModal('userModify');  // 'userModify' 모달을 여는 것
        setIsModalOpen(true);
    };
    const openModal2 = () => {
        setActiveModal('pwModify');  // 'pwModify' 모달을 여는 것
        setIsModalOpen(true);
    };
    const openModal3 = () => {
        setActiveModal('profileModify');  // 'userDelete' 모달을 여는 것
        setIsModalOpen(true);
    };
    const openModal4 = () => {
        setActiveModal('userDelete');  // 'userDelete' 모달을 여는 것
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);  // 모달을 닫는 함수
    };

    const userphone = () => {
        return `${user.userphone.substring(0, 3)}-${user.userphone.substring(3, 7)}-${user.userphone.substring(7, 11)}`
    }

    const getCode = () => {
        const formData = new FormData();

        const codeCheck = document.modifyForm.codeCheck;
        codeCheck.style.display = "block";
        if (codeFlag) {
            codeCheck.style.display = "none";
        }

        const email = document.modifyForm.useremail.value;

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
        const codeCheck = document.modifyForm.codeCheck;
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

    const userModify = () => {
        const modifyForm = document.modifyForm;

        const phone = modifyForm.userphone;
        const exp_phone = /^\d{11}$/;
        if (phone.value == "") {
            alert("전화번호를 입력해주세요!");
            phone.focus();
            return false;
        }
        if (!exp_phone.test(phone.value)) {
            alert("전화번호는 숫자만 입력해주새요!");
            phone.focus();
            return false;
        }
        if (phone.value.length != 11) {
            alert("전화번호 11자를 입력해주새요!");
            phone.focus();
            return false;
        }

        const email = modifyForm.useremail;
        const exp_email = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (email.value == "") {
            alert("이메일을 입력해주세요!")
            return false;
        }
        if (!exp_email.test(email.value)) {
            alert("이메일 형식에 맞도록 작성해 주세요!");
            return false;
        }
        if (email.value != user.useremail) {
            if (!codeFlag) {
                alert("이메일변경시 인증을 다시 받아야합니다!");
                return false;
            }
        }

        const zipcode = modifyForm.zipcode;
        if (zipcode.value == "") {
            alert("주소찾기를 진행해 주세요!");
            return false;
        }

        const addrdetail = modifyForm.addrdetail;
        if (addrdetail.value == "") {
            alert("나머지 주소를 입력해주세요.")
            addrdetail.focus();
            return false;
        }

        if (phone.value == user.userphone && email.value == user.useremail &&
            zipcode.value == user.zipcode && addrdetail.value == user.addrdetail) {
            alert("변경사항이 존재하지 않습니다.");
            return;
        }

        const updateUser = {
            userid: user.userid,
            userpw: user.userpw,
            username: user.username,
            userphone: phone.value,
            usergender: user.usergender,
            useremail: email.value,
            zipcode: zipcode.value,
            addr: modifyForm.addr.value,
            addrdetail: addrdetail.value,
            addretc: modifyForm.addretc.value,
        }

        axios.put('/api/user/modify', { user: updateUser })
            .then(resp => {
                if (resp.data == "O") {
                    alert("개인정보 변경에 성공하였습니다.");
                    setUser(updateUser);
                    setIsModalOpen(false);
                }
                else {
                    alert("개인정보 변경에 실패하였습니다.");
                    setIsModalOpen(false);
                }
            })
    }

    const pwModify = () => {
        const pw = user.userpw;
        const orgPw = document.getElementById("orgPw");
        const newPw = document.getElementById("newPw");
        const newPw_re = document.getElementById("newPw_re");

        const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@#$%^&*\-]).{4,}$/;

        if (orgPw.value == "") {
            alert("현재 비밀번호를 입력해 주세요!");
            orgPw.focus();
            return;
        }
        if (orgPw.value != pw) {
            alert("현재 비밀번호가 일치하지 않습니다.\n확인 후 다시 입력해 주세!");
            orgPw.value = "";
            orgPw.focus();
            return;
        }
        if (newPw.value == "") {
            alert("새 비밀번호를 입력해 주세요!");
            newPw.focus();
            return;
        }
        if (newPw.value == orgPw.value) {
            alert("현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다!");
            newPw.focus();
            return;
        }
        if (newPw.value.length < 9) {
            alert("비밀번호는 최소 9자 입니다.");
            newPw.focus();
            return;
        }
        if (newPw.value.length > 12) {
            alert("비밀번호는 최대 12자 입니다.");
            newPw.focus();
            return;
        }
        if (!reg.test(newPw.value)) {
            alert("비밀번호는 영어 대문자, 소문자, 숫자, 특수문자(~,?,!,@,#,$,%,^,&,-)를 조합해서 만들어주세요");
            newPw.focus();
            return;
        }
        if (newPw_re.value == "") {
            alert("새 비밀번호 확인을 입력해 주세요!");
            newPw_re.focus();
            return;
        }
        if (newPw.value != newPw_re.value) {
            alert("새 비밀번호 확인이 일치하지 않습니다.\n다시 시도해 주세요!");
            newPw_re.value = "";
            newPw_re.focus();
            return;
        }

        const updatePw = {
            userid: user.userid,
            userpw: newPw.value
        }
        axios.put('/api/user/pwModify', updatePw).then(resp => {
            if (resp.data == "O") {
                alert("비밀번호 변경에 성공하였습니다.");
                setUser(user => ({
                    ...user,
                    userpw: newPw.value
                }));
                setIsModalOpen(false);
            }
            else {
                alert("비밀번호 변경에 실패하였습니다.");
                setIsModalOpen(false);
            }
        })
            .catch(resp => {
                alert("비밀번호 변경에 실패하였습니다.");
                setIsModalOpen(false);
            })
    }

    const openFile = () => {
        const profile = document.getElementById("profile");
        profile.click();
    }

    const selectFile = (e) => {
        const files = e.target.files;
        const img = document.getElementById("profileImg");
        const file = files[0];
        const reader = new FileReader();

        if (files.length === 0) {
            return;
        }


        reader.onload = (e) => {
            const newProfile = e.target.result;
            img.src = newProfile;
            setUpdateFile(file);
        }
        reader.readAsDataURL(file);


    }

    const returnProfile = () => {
        const img = document.getElementById("profileImg");
        const defaultProfile = `/api/user/file/thumbnail/test.png`;
        img.src = defaultProfile;
        setFile("test.png");
        setUpdateFile("");
    }

    const profileModify = () => {
        const formData = new FormData();

        console.log("file : " + file)
        console.log("updateFile : " + updateFile)
        console.log("deleteFile : " + deleteFile)


        if (deleteFile == updateFile) {
            alert("변경사항이 없습니다.");
            return;
        }
        if (window.confirm("프로필을 수정 하시겠습니까?")) {
            if (updateFile && updateFile != "") {
                formData.append("file", updateFile);
            }
            else {
                const emptyFile = new File([], "emptyFile.txt", { type: "text/plain" });
                formData.append("file", emptyFile);  // 빈 파일을 추가
            }
            formData.append("deleteFile", deleteFile);
            formData.append("userid", user.userid);

            axios.put('/api/user/profileModify', formData)
                .then(resp => {
                    if (resp.data == "O") {
                        alert("프로필이 변경되었습니다.");
                        setIsModalOpen(false);
                    }
                })
        }
    }

    const deleteUser = () => {
        const pw = document.getElementById("userpw");
        const userid = user.userid;

        if (pw.value == "") {
            alert("비밀번호를 입력해주세요!");
            pw.focus();
            return;
        }
        if (pw.value != user.userpw) {
            alert("비밀번호가 일치하지 않습니다!\n확인 후 다시 시도해 주세요!");
            return;
        }
        if (window.confirm("정말 탈퇴하시겠습니까?")) {
            pw.value = "";
            axios.delete('/api/user/delete', { params: { userid } }).then(resp => {
                if (resp.data == "O") {
                    alert("회원 탈퇴가 완료되었습니다.\n그동안 이용해 주셔서 감사합니다. 안녕히 가십시오.");
                    navigate("/");
                }
            })
        }
        else {
            alert("회원 탈퇴가 취소되었습니다.");
            pw.value = "";
            setIsModalOpen(false);
        }
    }

    // 페이지 로드 시 관리자 여부를 확인하는 API 호출
    useEffect(() => {
        axios.get('/api/notice/checkadmin')
            .then(response => {
                setIsAdmin(response.data.admin);
            })
            .catch(error => {
                setIsAdmin(false);
            });
    }, []);

    // 관리자일 경우 자동으로 AdminPage로 리디렉션
    useEffect(() => {
        if (isAdmin) {
            navigate('/notice/adminpage');
        }
    }, [isAdmin, navigate]);

    // 유저 로그인 확인
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

    // 유저 정보 가져오기
    useEffect(() => {
        if (loginUser) {
            axios.get(`/api/user/userInfo`, { params: { userid: loginUser } })
                .then((resp) => {
                    setUser(resp.data.user);
                    setFile(resp.data.file);
                    setDeleteFile(resp.data.file);
                    setUpdateFile(resp.data.file);
                })
                .catch((error) => {

                });
            
        }
    }, [loginUser, isModalOpen]);

    return (
        <>
            {loginUser ? (
                <>
                    <Header />
                    {!isAdmin && (
                        <div className="mypage">
                            <div className="profile">
                                <div className="info_area">
                                    <div className='img'>
                                        <img src={`/api/user/file/thumbnail/${file}`} alt="" />
                                    </div>
                                    <div className='info'>
                                        <div>이름 : {user.username}</div>
                                        <div>이메일 : {user.useremail}</div>
                                        <div>전화번호 : {userphone()}
                                        </div>
                                        <div>주소 : {user.addr + user.addretc}</div>
                                    </div>
                                </div>
                                <div className="btn_area">
                                    <p onClick={openModal1}>개인정보 변경</p>
                                    <p onClick={openModal2}>비밀번호 변경</p>
                                    <p onClick={openModal3}>프로필 변경</p>
                                    <p onClick={openModal4}>회원 탈퇴</p>
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
                            <Modal isOpen={isModalOpen} closeModal={closeModal}>
                                {activeModal === 'userModify' && (
                                    <div id='userModify'>
                                        <h3>개인정보 변경</h3>
                                        <form action="/user/modify" method="post" name="modifyForm">
                                            <div>전화번호</div><input type="text" name="userphone" id="userphone" placeholder="전화번호를 입력 하세요" defaultValue={user.userphone} />
                                            <div>이메일</div>
                                            <input type="email" name="useremail" id="useremail" placeholder="이메일을 입력 하세요" defaultValue={user.useremail} />
                                            <input type="button" value="인증번호 받기" onClick={getCode} />
                                            <input type="text" name="codeCheck" id="codeCheck" placeholder="인증번호를 입력 하세요" onChange={(e) => {
                                                codeCheck(e)
                                            }} style={{ display: 'none' }} />
                                            <div className="zipcode_area">
                                                <div>주소</div>
                                                <DaumPostCode defaultValue={user.zipcode}></DaumPostCode>
                                                <input type="text" name="addr" id="addr" placeholder="주소" readOnly defaultValue={user.addr} />
                                                <input type="text" name="addrdetail" id="addrdetail" placeholder="상세주소" defaultValue={user.addrdetail} />
                                                <input type="text" name="addretc" id="addretc" placeholder="참고항목" readOnly defaultValue={user.addretc} />
                                                <input type="hidden" name="orgZipcode" id="orgZipcode" readOnly value={user.zipcode} />
                                            </div>
                                        </form>
                                        <Button value="변경" onClick={userModify}></Button>
                                        <Button value="취소" onClick={() => {
                                            setIsModalOpen(false)
                                        }}></Button>
                                    </div>
                                )}
                                {activeModal === 'pwModify' && (
                                    <div id='pwModify'>
                                        <h3>비밀번호 변경</h3>
                                        <div onKeyDown={(e) => {
                                            if (e.key == 'Enter') {
                                                e.preventDefault();
                                                pwModify();
                                            }
                                        }}>
                                            <input type="password" name="orgPw" id="orgPw" placeholder='현재 비밀번호' />
                                            <input type="password" name="newPw" id="newPw" placeholder='새 비밀번호' />
                                            <input type="password" name="newPw_re" id="newPw_re" placeholder='새 비밀번호 확인' />
                                        </div>
                                        <Button value="변경" onClick={pwModify}></Button>
                                        <Button value="취소" onClick={() => {
                                            setIsModalOpen(false)
                                        }}></Button>
                                    </div>
                                )}
                                {activeModal === 'profileModify' && (
                                    <div id='profileModify'>
                                        <h3>프로필 변경</h3>
                                        <div className='img'>
                                            <img src={`/api/user/file/thumbnail/${deleteFile}`} alt="" id='profileImg' />
                                        </div>
                                        <Button onClick={openFile} value="프로필 변경"></Button>
                                        <Button value="기본 프로필 변경" onClick={returnProfile}></Button>
                                        <Button value="적용" onClick={profileModify}></Button>
                                        <Button value="취소" onClick={() => {
                                            setIsModalOpen(false)
                                        }}></Button>
                                        <input type="file" name="profile" id="profile" style={{ display: 'none' }} onChange={selectFile} />
                                    </div>
                                )}
                                {activeModal === 'userDelete' && (
                                    <div id='userDelete'>
                                        <h3>회원 탈퇴</h3>
                                        <div>
                                            <p>비밀번호 확인</p>
                                            <input type="password" name="userpw" id="userpw" placeholder='비밀번호' />
                                        </div>
                                        <Button value="탈퇴" onClick={deleteUser}></Button>
                                        <Button value="취소" onClick={() => {
                                            setIsModalOpen(false)
                                        }}></Button>
                                    </div>
                                )}
                            </Modal>
                        </div>
                    )}
                </>
            ) : (
                <div>로딩중</div>
            )}
        </>
    );
}
export default MyPage;
