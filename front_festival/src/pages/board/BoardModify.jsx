import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import Hobby from "../../components/Hobby";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

const BoardModify = () =>{
    const location = useLocation();
    const {cri,boardnum} = location.state;
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState("");

    const quillRef = useRef(null);
    const [content, setContent] = useState("");     
    const [data, setData] = useState();
    const [inputs, setInputs] = useState({boardtitle:"", tag:""});
    const [tempImages, setTempImages] = useState([]); // 수정에서 사용된 모든 이미지 배열
    const [addImages, setAddImages] = useState([]); //수정에서 추가된 이미지 배열

    const change = (e) => {
        const {name,value} = e.target;
        setInputs({...inputs,[name]:value});
        setData({...data,[name]:value})
    }

    useEffect(()=>{
        getData();
        
    },[])
    const getData = async () => {
        const response = await axios.get(`/api/board/${boardnum}`);
        setData(response.data);
        setContent(response.data.boardcontent);

        const regex = /systemname=([a-zA-Z0-9\-]+(?:\.[a-zA-Z]{3,4})?)"/g;
        const useImages = [];
        let useImage;

        // `exec` 메서드를 이용해 여러번 찾을 수 있음
        while ((useImage = regex.exec(response.data.boardcontent)) !== null) {
            useImages.push(useImage[1]); // targetWord 뒤의 단어를 추출
        }
        setTempImages(useImages);
    };
    
    
    const handleContent = (e) => {
        setContent(e);
    };

    const modules = useMemo(
        () => ({
          toolbar: {
            container: [
              ['image'],
              [{ header: '1' }, { header: '2' }],
              [{ size: [] }],
              [{ color: [] }, 'bold', 'italic', 'underline'],
              [{ align: [] }],
            ]
          },
          clipboard: {
            matchVisual: false,
          },
        }),
        [],
    );
    const formats = [
        'header','font','size','bold','italic','underline','strike','blockquote','list','bullet','align','color','image',
    ];

    const generateFileName = (url) => {
        const regex = /^data:image\/([a-zA-Z]*);base64,/;
        const match = url.match(regex);
        if(match == null || match ==""){
            return;
        }
        const ext = '.'+match[1];
        
        
        // 현재 날짜와 시간 가져오기
        const now = new Date();
        const time = now.toISOString().replace(/[-:T\.Z]/g, '').slice(0, 17); // yyyyMMddHHmmssSSS 형식으로 포맷
        // UUID 생성 (crypto API 사용)
        const uuid = crypto.randomUUID();
        const systemname = time + uuid + ext;
        
        return systemname; // 예: "image_20231125090000.jpg"
    };
    
    // 이미지 다운로드 함수
    const downloadImage = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        console.log(blob);
        const systemname = generateFileName(url); // 임의의 이름 생성
        const file = new File([blob], systemname, { type: blob.type }); // 임의의 파일 이름으로 생성
        console.log(file);
        return { file, systemname }; // 파일과 이름을 반환
    };
    
    // 파일 업로드 함수 (Axios 사용)
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file); // 수정된 파일 이름을 사용
    
        try {
        const response = await axios.post('/api/file/saveImage', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
    
        if (response.status === 200) {
            return true; // 업로드 성공
        }
        } catch (error) {
        console.error('업로드 실패', error);
        return false; // 업로드 실패
        }
    };
  
  // HTML 내의 모든 이미지 URL을 찾아 배열로 저장하고, 다운로드 후 업로드하는 함수
    const processImagesInHtml = async () => {
        if (!content) return; // content가 비어있는 경우 처리하지 않음

        // HTML 문자열을 DOM 요소로 변환
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        
        // HTML 내에서 모든 이미지 URL을 찾아 배열로 저장
        const images = Array.from(doc.querySelectorAll('img')).map((img) => img.src);
        const useImg = [];
        // 각 이미지 URL을 다운로드하고 업로드 후 이름 변경 및 HTML 수정
        if(images == null || images == ""){
            return content;
        }
        for (const url of images) {
            if(url.match(/^data:image\/([a-zA-Z]*);base64,/) == null){
                continue;
            }
            const { file, systemname } = await downloadImage(url); // 이미지 다운로드 및 임의의 이름 생성 
            
            // 파일 업로드
            const uploadSuccess = await uploadImage(file);
            if (uploadSuccess) {
                const newFileUrl = `/api/file/thumbnail?systemname=${systemname}`; 
                useImg.push(newFileUrl);
            }
        }
        let index = 0;
    // content 상태에서 img 태그의 src 속성을 순차적으로 수정
        const updatedContent = content.replace(/src="data:image\/[^;]+;base64,[^"]+"/g, (match) => {
            const newUrl = useImg[index];
            index = (index + 1) % useImg.length; // 배열을 순차적으로 반복
            return `src="${newUrl}"`; // 새로운 URL로 교체
        });
        console.log("url :" +useImg);
        setContent(updatedContent);
        return updatedContent;
    };


    const modify = async ()=>{
        const writeForm = document.writeForm;
        if(!writeForm.boardtitle.value || writeForm.boardtitle.value == ""){
        alert("제목을 입력해 주세요!");
        return;
        }
        if(!writeForm.userhobby.value || writeForm.userhobby.value == ""){
        alert("태그를 추가해 주세요!");
        return;
        }
        if(!content || content ==""){
        alert("내용을 입력해 주세요!");
        return;
        }
        const upContent = await processImagesInHtml();

        const regex = /systemname=([a-zA-Z0-9\-]+(?:\.[a-zA-Z]{3,4})?)"/g;
        const useImages = [];
        let useImage;

        // `exec` 메서드를 이용해 여러번 찾을 수 있음
        while ((useImage = regex.exec(upContent)) !== null) {
            useImages.push(useImage[1]); // targetWord 뒤의 단어를 추출
        }
        const removeImages = tempImages.filter((name) => !useImages.includes(name));

        const board = {
            boardnum : boardnum,
            boardtitle: writeForm.boardtitle.value,
            boardcontent: upContent,
            userid : loginUser,
            tag : writeForm.userhobby.value,
            titleImage: useImages[0]
        };
        
        const data = {
            board : board,
            removeImages : removeImages
        }

        await axios.put('/api/board/modify', data);
        navigate(`/board/${boardnum}`,{state: cri});
    }

    useEffect(()=>{
        axios.get(`/api/user/loginCheck`).then(resp=>{
            if(resp.data.trim() != ""){
                setLoginUser(resp.data.trim());
            }
            else{
              alert("로그인 하셔야 글을 쓸 수 있습니다!");
              navigate(`/board/list`,{state: cri});
            }
        })
        // const writeForm = document.writeForm;
        // writeForm.boardtitle.focus();
      },[])

    if(!data){
        return <>로딩중...</>
    }
    else{
        return (
            <>
            <Header></Header>
            <div id="board_wrap">
                <form name="writeForm" onSubmit={modify}>
                    <table className="boardWrite">
                        <tr>
                            <th>제목</th>
                            <td><input name="boardtitle" type="text" onChange={change} value={data.boardtitle}   maxlength="30" style={{width:"430px"}}></input></td>
                        </tr>
                        <tr>
                            <th>아이디</th>
                            <td className="bwUserid">{loginUser}</td>
                        </tr>
                        <tr>
                            <th>태그</th>
                            <Hobby name={"태그"}  data={data.tag.split("\\")}></Hobby>
                        </tr>
                    </table>
                    <div className="text-editor" style={{height:"650px"}}>
                        {/* <CustomToolbar/> */}
                        <ReactQuill theme="snow" ref={quillRef} modules={modules} formats={formats} value={content} onChange={handleContent} style={{width:"1000px", height:"600px", borderRadius: "10px important!"}}/>
                        </div>
                        <div style={{textAlign:"center"}}>
                        <input className="btn bBtn bgBtn" type="button" value="수정" onClick={modify}></input>
                        <input className="btn bBtn bgBtn" type="button" value="취소" onClick={()=>{
                            navigate(`/board/${boardnum}`, { state: cri })}}></input>
                    </div>
                </form>
            </div>
            <Footer></Footer>
            </>                
        )
    }
}
export default BoardModify;