import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import Hobby from "../../components/Hobby";
import Header from "../../layout/Header";

const BoardModify = () =>{
    const location = useLocation();
    const {cri,boardnum} = location.state;
    const navigate = useNavigate();

    const quillRef = useRef(null);
    const [content, setContent] = useState("");     
    const [data, setData] = useState();
    const [inputs, setInputs] = useState({boardtitle:"", tag:""});
    const [tempImages, setTempImages] = useState([]); // 수정에서 사용된 모든 이미지 배열
    const [addImages, setAddImages] = useState([]); //수정에서 추가된 이미지 배열

    const change = (e) => {
        const {name,value} = e.target;
        setInputs({...inputs,[name]:value});
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
        while ((useImage = regex.exec(content)) !== null) {
            useImages.push(useImage[1]); // targetWord 뒤의 단어를 추출
        }
        setTempImages(useImages);
    };
    useEffect(()=>{
        console.log(data);
    })
    
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
                setAddImages((prevImages) => [...prevImages, systemname]);
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

    const modify = async ()=>{
        const regex = /systemname=([a-zA-Z0-9\-]+(?:\.[a-zA-Z]{3,4})?)"/g;
        const useImages = [];
        let useImage;

        // `exec` 메서드를 이용해 여러번 찾을 수 있음
        while ((useImage = regex.exec(content)) !== null) {
        useImages.push(useImage[1]); // targetWord 뒤의 단어를 추출
        }
        console.log("used:  "+useImages);
        const removeImages = tempImages.filter((name) => !useImages.includes(name));
        console.log("remove:  "+removeImages);

        const writeForm = document.writeForm;
        const board = {
            boardnum : boardnum,
            boardtitle: writeForm.boardtitle.value,
            boardcontent: content,
            userid : "apple",
            tag : writeForm.userhobby.value,
            titleImage: useImages[0]
        };
        
        const data = {
            board : board,
            removeImages : removeImages
        }

        const response = await axios.put('/api/board/modify', data);
        navigate(`/board/${boardnum}`,{state: cri});
    }

    const canselModify = async ()=>{
        await axios.post('/api/board/canselWrite', addImages);
    }

    if(!data){
        console.log("check");
        return <>로딩중...</>
    }
    else{
        return (
            <>
            <Header></Header>
            <div id="board_wrap">
                <form name="writeForm" onSubmit={modify}>
                    <table>
                        <tr>
                            <th>제목</th>
                            <td><input name="boardtitle" type="text" onChange={change} value={data.boardtitle}></input></td>
                        </tr>
                        <tr>
                            <th>아이디</th>
                            <td>apple</td>
                        </tr>
                        <tr>
                            <th>태그</th>
                            <Hobby name={"태그"}  data={data.tag.split("\\")}></Hobby>
                        </tr>
                    </table>
                    <div className="text-editor" style={{height:"650px"}}>
                        {/* <CustomToolbar/> */}
                        <ReactQuill theme="snow" ref={quillRef} modules={modules} formats={formats} value={content} onChange={handleContent} style={{width:"1000px", height:"600px"}}/>
                        </div>
                        <div>
                        <input type="button" value="수정" onClick={modify}></input>
                        <input type="button" value="취소" onClick={()=>{
                            canselModify();
                            navigate(`/board/${boardnum}`, { state: cri })}}></input>
                    </div>
                </form>
            </div>
            </>                
        )
    }
}
export default BoardModify;