import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import Modal from "../../components/Modal";

const Notesend =( {loginUser} ) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [modalData, setModalData]= useState({
        title:'',
        content:'',
        receiveuser:'',
        senduser:loginUser,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(()=>{
        if(location.state && location.state.userid){
            setModalData(prev =>({
                ...prev,
                reveiveuser: location.state.userid,
            }));
            setIsModalOpen(true);
        }
    },[location.state]);
    const closeModal =() =>{
        setIsModalOpen(false);
        setModalData({
            title:'',
            content:'',
            receiveuser: location.state ? location.state.userid:'',
            senduser: loginUser
        });
    };
    const sendNote=()=>{
        const noteData ={
            title:modalData.title,
            content:modalData.content,
            receiveuser:modalData.receiveuser,
            senduser:modalData.senduser
        };
        axios.post(`/api/note/write`, noteData)
            .then((resp)=>{
                console.log("쪽지전송성공",resp);
                alert("쪽지가 전송되었습니다.");
                closeModal();
            })
            .catch((error)=>{
                console.log("쪽지 보내기 실패",error);
                alert("쪽지 전송에 실패했습니다.")
            });
    }
    return (
        <div>
            <Modal isOpen={isModalOpen} closeModal={closeModal}>
            <div id="wrap" className="noteget" style={{width:"500px"}}>
                        <form id="notegetForm" name="notegetForm">
                            <div className="ntable notegettable">
                                <div className="row notegetrow">
                                    <div>제목</div>
                                    <div>
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="제목을 입력하세요"
                                            value={modalData.title || ''}
                    onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="row notegetrow">
                                    <div>To</div>
                                    <div>
                                        <input
                                            type="text"
                                            name="receiveuser"
                                            value={modalData.receiveuser || ''}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="row notegetrow">
                                    <div>From</div>
                                    <div className="sendms">
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={sendNote}  // 답장하기
                                            >
                                                보내기
                                            </button>
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="senduser"
                                            value={loginUser}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="row notegetrow">
                                    <div>내용</div>
                                    <div>
                                        <textarea
                                            name="noticecontent" onChange={(e) => setModalData({ ...modalData, content: e.target.value })}
                                            placeholder="내용을 입력하세요"/>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <table className="notegetbtn_area">
                            <tbody>
                                <tr>
                                    <td>
                                        <button className="btn msbtn" onClick={closeModal}>취소</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
            </Modal>
        </div>
    )
}