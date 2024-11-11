import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Button from "../../components/Button";

const Nwrite = () =>{
    const location = useLocation();
    const cri = location.state;
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({noticetitle:"", noticecontents:""});
    const change = (e) =>{
        const {name, value} = e.target;
        setInputs({...inputs,[name]:value});
    }
    const index = useRef(0);
    const [files, setFiles] = useState([{id:0, file:"",thumbnail:""}]);
    const upload = (id) =>{
        document.getElementById("file"+id).click();
    }
    const selectFile = (e,id) =>{
        const file = e.target.files[0];
        if(!file){
            removeFile(id);
        }
        else{
            let ext = file.name.split(".").pop();
            let isThumbnail = ext == 'jpeg' || ext == 'png' || ext =='gif' || ext == 'webp';
            const reader = new FileReader();
            reader.onload = (e) =>{
                const newFiles = files.map(item =>{
                    if(item.id === id){
                        return { ...item, file:file?file:'', thumbnail:isThumbnail?e.target.result:''}                        
                    }
                    return item;
                });
                if(id === index.current){
                    index.current ++;
                    newFiles.push({id:index.current, file:'', thumbnail:''});
                }
                setFiles(newFiles);
            }
            reader.readAsDataURL(file);
        }
    }
    const removeFile = (id) =>{
        if(id !== index.current){
            const updatedFiles = files.filter( item => item.id !== id).map((item,idx) =>{
                return { ...item, id:idx};
            })
            index.current--;
            setFiles(updatedFiles);
        }
    }
    const regist = () =>{
        const formData = new FormData();
        files.map((item) => {
            if(item.file){
                formData.append("files",item.file);
            }
        })
        formData.append("noticetitle", inputs.noticetitle);
        formData.append("noticecontents", inputs.noticecontents);
        // axios.post(`/api/notice/nwrite`, formData)
        // .then(resp=>{
        //     let noticenum = resp.data;
        //     alert(`${noticenum}번 게시들 등록 성공`);
        //     navigate(`/notice/notice`,{state:cri});
        // })
        // .catch(err=>{
        //     console.log(err);
        //     alert(`${noticenum}번 게시들 등록 실패`);
        // })
    }
    useEffect(()=>{
        // axios.get(`/api/user/loginCheck`)
        // .then(resp =>{
        //     if(resp.data.trim() != ""){
        //         document.noticeForm.userid.value = resp.data.trim();
        //     }
        // })
    })
    return (
        <div id="nwrap" className="nwrite">
            <div className="notice-title">Notice</div>
            <form id ="noticeForm" name="noticeForm">
                <div className="ntable">
                    <div className="row">
                        <div>제목</div>
                        <div>
                            <input type="text" name="noticetitle" maxLength={50} placeholder="제목을 입력하세요" onChange={change} />
                        </div>
                    </div>
                    <div className="row">
                        <div>작성자</div>
                        <div>
                            <input type="text" name="userid" maxLength={50} readOnly />
                        </div>
                    </div>
                    <div className="row">
                        <div>내용</div>
                        <div>
                            <textarea name="noticecontents" onChange={change} id=""></textarea>
                        </div>
                    </div>
                    {
                        files.map((item)=>{
                            return (
                                <div className={`row r${item.id}`} key={item.id}>
                                    <div>파일첨부{item.id + 1}</div>
                                    <div className={`file${item.id}_cont row`}>
                                        <div className="cols-7">
                                            <input type="file" name="files" id={`file${item.id}`} style={{display:'none'}} onChange={(e)=>{
                                                selectFile(e,item.id);
                                            }} />
                                            <span id={`files${item.id}name`}>{item.file.name || '선택된 파일 없음'}</span>
                                        </div>
                                        <div className="cols-3 row">
                                            <Button className={"btn"} value={"파일 선택"} onClick={()=>{
                                                upload(item.id);
                                            }}></Button>
                                            <Button className={"btn"} value={"파일 삭제"} onClick={()=>{
                                                removeFile(item.id);
                                            }}></Button>
                                        </div>
                                        {
                                            item.thumbnail ?
                                            <div className="nthumbnail_area">
                                                <img src={item.thumbnail} alt={`thumbnail${item.id}`} className="nthumbnail" />
                                            </div> : ""
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </form>
            <table className="nbtn_area">
                <tbody>
                    <tr>
                        <td>
                            <Button value="등록" className="btn" onClick={regist}></Button>
                            <Button value="목록" className="btn" onClick={()=>{
                                navigate("/notice/notice",{state:cri});
                            }}></Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export default Nwrite;