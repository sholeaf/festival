import axios from "axios";
import React, { useRef, useState, useEffect,Component, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Hobby from "../../components/Hobby";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../layout/Header";

const BoardWrite = () => {
  const quillRef = useRef(null);
  const [content, setContent] = useState("");

  const [inputs, setInputs] = useState({boardtitle:"", tag:""});
  const [tempImages, setTempImages] = useState([]);
  const navigate = useNavigate();
  const cri = useLocation().state;
  const [loginUser, setLoginUser] = useState("");

  const change  = (e)=>{
    const {name,value} = e.target;
    setInputs({...inputs,[name]:value});
  }
  const handleContent = (e) => {
    setContent(e);
  };
  const imageHandler = () => { //업로드할 이미지를 서버에 저장하고 이름을 받아오는 함수
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.addEventListener('change', async () => {
      const file = input.files[0];

      try {
        const formData = new FormData();
        formData.append('file', file); // FormData에 파일 추가
        
        // axios로 파일 전송
        const response = await axios.post('/api/file/saveImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const systemname = response.data;
        const editor = quillRef.current.getEditor(); 
        const range = editor.getSelection();
        editor.insertEmbed(range.index, 'image', `/api/file/thumbnail?systemname=`+systemname);
        editor.setSelection(range.index + 1);
        setTempImages((prevImages) => [...prevImages, systemname]);
        console.log("image:"+tempImages);
      } catch (error) {
        console.log(error);
      }
    });
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
        ],
        handlers: { image: imageHandler },
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

  const regist = async () =>{
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

    // const regex = /systemname=([a-zA-Z0-9\-]+(?:\.[a-zA-Z]{3,4})?)/g;
    const regex = /systemname=([a-zA-Z0-9\-]+(?:\.[a-zA-Z]{3,4})?)"/g;
    const useImages = [];
    let useImage;

    // `exec` 메서드를 이용해 여러번 찾을 수 있음
    while ((useImage = regex.exec(content)) !== null) {
      useImages.push(useImage[1]); // targetWord 뒤의 단어를 추출
    }
    const removeImages = tempImages.filter((name) => !useImages.includes(name));

    
    const board = {
      boardtitle: writeForm.boardtitle.value,
      boardcontent: content,
      userid : loginUser,
      tag : writeForm.userhobby.value,
      titleImage: useImages[0]
    };
    
    const data = {
      board : board,
      removeImages : removeImages
    }

    const response = await axios.post('/api/board/write', data);
    let boardnum = response.data;

    navigate(`/board/${boardnum}`,{state: cri});
  }
  
  const canselWrite = async ()=>{
    await axios.post('/api/board/canselWrite', tempImages);
  }
  
  // popstate 이벤트 리스너 등록(뒤로가기시 함수 작동)
  // window.addEventListener('popstate', (e)=>{
  //   canselWrite();
  // });

  useEffect(()=>{
    axios.get(`/api/user/loginCheck`).then(resp=>{
        if(resp.data.trim() != ""){
            // document.writeForm.userid.value = resp.data.trim();
            setLoginUser(resp.data.trim());
        }
        else{
          alert("로그인 하셔야 글을 쓸 수 있습니다!");
          navigate(`/board/list`,{state: cri});
        }
    })
    const writeForm = document.writeForm;
    writeForm.boardtitle.focus();
  },[])

  return (
    <>
    <Header></Header>
    <div id="board_wrap">
      <form name="writeForm" onSubmit={regist}>
        <table>
          <tr>
              <th>제목</th>
              <td><input name="boardtitle" type="text" onChange={change}></input></td>
          </tr>
          <tr>
              <th>아이디</th>
              <td>{loginUser === ""? "":loginUser}</td>
              {/* <td><div>
                  <input type="text" name="userid" maxLength={50} readOnly />
              </div>
              </td> */}
          </tr>
          <tr>
            <th>태그</th>
            <td>
                <Hobby name={"태그"}></Hobby>
            </td>
          </tr>
        </table>
        <div className="text-editor" style={{height:"550px"}}>
          {/* <CustomToolbar/> */}
          <ReactQuill theme="snow" ref={quillRef} modules={modules} formats={formats} value={content} onChange={handleContent} style={{width:"1000px", height:"500px"}}/>
        </div>
        <div style={{textAlign:"center"}}>
          <input type="button" value="작성완료" onClick={regist}></input>
          <input type="button" value="돌아가기" onClick={()=>{
            canselWrite();
            navigate('/board/list',{state: cri})}}></input>
        </div>
      </form>
    </div>
    </>
  );
};

export default BoardWrite;
