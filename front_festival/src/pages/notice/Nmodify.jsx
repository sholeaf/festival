import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Button from "../../components/Button";

const Nmodify = () =>{
    const location = useLocation();
    const {cri, noticenum} = location.state;
    const navigate = useNavigate();

    const [inputs, setInputs] = useState();
    const [files, setFiles] = useState();
    const [board, setBoard] = useState(null);
    const [orgFiles, setOrgFiles] = useState();
    const index = useRef(0);
    const NUM = useRef(0);
    const deleteFiles = useRef([]);
    const uploadFiles = useRef([]);
    const upload = (id) => {
        document.getElementById("file"+id).click();
    }

    const selectFile = (e,id,num) => {
        const fileTag = e.target;
        const file = fileTag.files[0];

        if(!file){
            if(id >= orgFiles.length){
                removeFile(id,num);
            }
            else{
                uploadFiles.current[id] = null;
                deleteFiles.current[id] = null;

                const newFiles = files.map((item)=>{
                    if(item.id == id){
                        const fdto = orgFiles[id];
                        let ext = fdto.systemname.split(".").pop();
                        let isThumbnail = ext == 'jpeg' || ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'webp';
                        return {
                            ...item,
                            file:{
                                name:fdto.orgname,
                                systemname:fdto.systemname
                            },
                            thumbnail:isThumbnail?`/api/file/thumbnail/${fdto.systemname}`:""
                        }
                    }
                    return item;
                });
                setFiles(newFiles);
            }
        }
        else{
            let ext = file.name.split(".").pop();
            let isThumbnail = ext == 'jpeg' || ext == 'jpg' || ext == 'png' || ext =='gif' || ext == 'webp';
            uploadFiles.current[id] = file;
            if(id < orgFiles.length){
                deleteFiles.current[id] = orgFiles[id].systemname;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const newFiles = files.map(item =>{
                    if(item.id == id){
                        return { ...item, file:file?file:'',
                            thumbnail:isThumbnail?e.target.result:''
                        };
                    }
                    return item;
                })
                if(num == NUM.current){
                    index.current++;
                    NUM.current++;
                    newFiles.push({id:index.current, num:NUM.current,file:'',thumbnail:''});
                }
                setFiles(newFiles);
            }
            reader.readAsDataURL(file);
        }
    }
    const removeFile = (id,num) => {
        if(num == NUM.current){

        }
        else{
            files.map((item)=> {
                if(item.id == id){
                    if(item.file.size){
                        uploadFiles.current.splice(id,1);
                    }
                    else{
                        deleteFiles.current[id] = item.file.systemname;
                    }
                }
            })
            const updatedFiles = files.filter(item => item.id != id).map
            ((item,idx)=> {
                return { ...item, num:idx};
            })
            NUM.current--;
            setFiles(updatedFiles);
        }
    }
    const change = (e) => {
        const {name,value} = e.target;
        setInputs({...inputs, [name]:value});
    }
    const modify = () => {
        const formData = new FormData();
        uploadFiles.current.map(file => {
            if(file){
                formData.append("files",file);
            }
        })
        deleteFiles.current.map(systemname => {
            if(systemname){
                formData.append("deleteFiles", systemname);
            }
        })
        formData.append("noticetitle", inputs.noticetitle);
        formData.append("noticecontents", inputs.noticecontents);

        axios.put(`/api/notice/${noticenum}`, formData)
        .then((resp)=> {
            alert(`${resp.data}번 게시글 수정 완료`);
            navigate(`/notice/${noticenum}`,{state:cri});
        })
    }
    useEffect(()=> {
        axios.get(`/api/notice/${noticenum}`)
        .then((resp)=> {
            setOrgFiles(resp.data.files);
            setInputs(resp.data.board);
            setBoard(resp.data.board);

            const temp = [];
            let i = 0;
            for(;i<resp.data.files.length;i++){
                const fdto = resp.data.files[i];
                let ext = fdto.systemname.split(".").pop();
                let isThumbnail = ext == 'jpeg' || ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'webp';
                temp.push({
                    id:i,
                    num:i,
                    file:{
                        name:fdto.orgname,
                        systemname:fdto.systemname
                    },
                    thumbnail:isThumbnail?`/api/file/thumbnail/${fdto.systemname}`:''
                })
            }
            temp.push({id:i, num:i, file:"", thumbnail:""});
            setFiles(temp);
            index.current = resp.data.files.lenth;
            NUM.current = index.current;
        })
    },[])
    if (!board) {
        const text = "로딩중...";
        const [chars, setChars] = useState([]);
    
        useEffect(() => {
            const splitText = text.split('').map((char, index) => ({
                char,
                delay: index * 0.5 // 각 글자에 0.5초씩 딜레이
            }));
            setChars(splitText);
        }, []);
    
        return (
            <div className="loading-text">
                {chars.map((item, index) => (
                    <span
                        key={index}
                        style={{
                            animationDelay: `${item.delay}s`, // 각 글자에 대한 딜레이
                        }}
                    >
                        {item.char}
                    </span>
                ))}
            </div>
        );
    }
    else{
        return (
            <div id="wrap" className="nget">
                <Header></Header>
                <form id="noticeForm" name="noticeForm">
                    <div className="ntable">
                        <div className="row">
                            <div>제목</div>
                            <div>
                                <input type="text" name="noticetitle" maxLength={50} placeholder="제목을 입력하세요" defaultValue={notice.noticetitle} onChange={change} />
                            </div>
                        </div>
                        <div className="row">
                            <div>작성자</div>
                            <div>
                                <input type="text" name="userid" maxLength={50} defaultValue={notice.userid} readOnly />
                            </div>
                        </div>
                        <div className="row">
                            <div>내용</div>
                            <div>
                                <textarea name="noticecontents" defaultValue={notice.noticecontents} onChange={change}></textarea>
                            </div>
                        </div>
                        {
                            files.map(item =>{
                                return (
                                    <div className={`row r${item.num}`} key={item.id}>
                                        <div>파일 첨부{item.num + 1}</div>
                                        <div className={`file${item.num}_cont row`}>
                                            <div className="cols-7">
                                                <input type="file" name="files" id={`file${item.num}`} style={{ display : 'none'}} onChange={(e)=> {
                                                    selectFile(e,file.id, item.num);
                                                }} />
                                                <span id={`file${item.num}name`}>{item.file.name || '선택된 파일 없음'}</span>
                                            </div>
                                            <div className="cols-3 row">
                                                <Button className="btn" value="파일 선택" onClick={()=>{
                                                    upload(item.num)
                                                }}></Button>
                                                <Button className="btn" value="첨부 삭제" onClick={()=>{
                                                    removeFile(item.id, item.num)
                                                }}></Button>
                                            </div>
                                            {
                                                item.thumbnail ? 
                                                <div className="thumbnail_area">
                                                    <img src={item.thumbnail} alt={`thumbnail${item.id}`} className="thumbnail" />
                                                </div>
                                                :""
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
                                    <Button value="수정완료" className="btn" onClick={modify}></Button>
                                    <Button value="목록" className="btn" onClick={()=>{
                                        navigate("/board/notice", {state:cri});
                                    }}></Button>
                                </td>
                            </tr>
                        </tbody>
                </table>
            </div>
        )
    }
}
export default Nmodify;