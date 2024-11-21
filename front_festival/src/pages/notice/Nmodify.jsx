import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Header from "../../layout/Header";

const Nmodify = () => {
    const location = useLocation();
    const {cri,noticenum} = location.state; // { "cri" : {} , "boardnum" : 133}
    console.log("받아오는공지번호:", noticenum);
    useEffect(() => {
      // noticenum이 없다면 빨리 종료
      if (!noticenum) {
        console.error("공지번호 없음");
        return;
      }
    
      // 정상적으로 noticenum이 있을 때 API 호출
      axios.get(`/api/notice/${noticenum}`)
        .then((resp) => {
          console.log("받아오는 데이터:", resp.data);
          setOrgFiles(resp.data.files);
          setInputs(resp.data.notice);
          setNotice(resp.data.notice);
    
          // 파일 처리
          const temp = resp.data.files.map((nfdto, i) => {
            let ext = nfdto.systemname.split(".").pop();
            let isThumbnail = ['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(ext);
            return {
              id: i,
              num: i,
              file: {
                name: nfdto.orgname,
                systemname: nfdto.systemname
              },
              thumbnail: isThumbnail ? `/api/notice/file/thumbnail/${nfdto.systemname}` : ''
            };
          });
    
          // 마지막 파일은 빈 상태로 추가 (파일 선택을 위한 공간)
          temp.push({ id: temp.length, num: temp.length, file: '', thumbnail: '' });
          setFiles(temp);
          index.current = temp.length - 1;
          NUM.current = index.current;
        })
        .catch((error) => {
          console.error("공지데이터 없음:", error);
        });
    }, [noticenum]); // noticenum이 변경될 때만 호출
    const navigate = useNavigate();
    useEffect(() => {
      if (noticenum) {
          axios.get(`/api/notice/${noticenum}`)
              .then((resp) => {
                  setNotice(resp.data.notice);  // 서버에서 받은 notice를 state에 저장
                  setInputs(resp.data.notice);
                  setOrgFiles(resp.data.files);  // 파일 정보 저장
              })
              .catch((error) => {
                  console.error("Error loading notice data:", error);
              });
      } else {
          console.error("서버에서 받은 공지번호:", noticenum);  // noticenum이 유효하지 않다면 에러 출력
      }
  }, [noticenum]); 
    const [inputs,setInputs] = useState();
    const [files, setFiles] = useState();

    const [notice, setNotice] = useState(null);
    const [orgFiles, setOrgFiles] = useState();

    const index = useRef(0);
    const NUM = useRef(0);
    const deleteFiles = useRef([]);
    const uploadFiles = useRef([]);

    const upload = (id) => {
        console.log(id);
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
                        const nfdto = orgFiles[id];
                        let ext = nfdto.systemname.split(".").pop();
                        let isThumbnail = ext == 'jpeg' || ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'webp'; 
                        return {
                            ...item,
                            file:{
                                name:nfdto.orgname,
                                systemname:nfdto.systemname
                            },
                            thumbnail:isThumbnail?`/api/notice/file/thumbnail/${nfdto.systemname}`:""
                        }
                    }
                    return item;
                });
                setFiles(newFiles);
            }
        }
        else{
            let ext = file.name.split(".").pop();
            let isThumbnail = ext == 'jpeg' || ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'webp';
            uploadFiles.current[id] = file;
            if(id < orgFiles.length){
                deleteFiles.current[id] = orgFiles[id].systemname;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const newFiles = files.map(item => {
                    if(item.id == id){
                        return { ...item, file:file?file:'', thumbnail:isThumbnail?e.target.result:'' };
                    }
                    return item;
                })
                if(num == NUM.current){
                    index.current++;
                    NUM.current++;
                    newFiles.push({id:index.current, num:NUM.current, file:'', thumbnail:''});
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
            files.map((item) => {
                if(item.id == id){
                     if(item.file.size){
                        uploadFiles.current.splice(id,1);
                    }
                    else{
                        deleteFiles.current[id] = item.file.systemname;
                    }
                }
            })
            const updatedFiles = files.filter(item => item.id != id).map((item,idx)=>{
                return {...item,num:idx};
            })
            NUM.current--;
            setFiles(updatedFiles);
        }
    }

    const change = (e) => {
        const {name,value} = e.target;
        setInputs({...inputs,[name]:value});
    }

    // map 호출 전에 배열이 정의되었는지 체크
const modify = () => {
  console.log("modify", uploadFiles.current);
  console.log("modify", deleteFiles.current);
  console.log("modify", inputs);

  const formData = new FormData();

  // uploadFiles.current가 undefined가 아닐 때만 map 사용
  if (uploadFiles.current && Array.isArray(uploadFiles.current)) {
      uploadFiles.current.map(file => {
          if (file) {
              formData.append("files", file);
          }
      });
  }

  // deleteFiles.current가 undefined가 아닐 때만 map 사용
  if (deleteFiles.current && Array.isArray(deleteFiles.current)) {
      deleteFiles.current.map(systemname => {
          if (systemname) {
              formData.append("deleteFiles", systemname);
          }
      });
  }

  formData.append("noticetitle", inputs.noticetitle || '');
  formData.append("noticecontent", inputs.noticecontent || '');

  axios.put(`/api/notice/${noticenum}`, formData)
      .then((resp) => {
          alert(`${resp.data}번 게시글 수정 완료!`);
          navigate(`/notice/${noticenum}`, { state: cri });
      })
      .catch((error) => {
          console.error("Error modifying notice:", error);
          alert("게시글 수정 중 오류가 발생했습니다.");
      });
};


    useEffect(()=>{
      console.log("noticenum:", noticenum);
      console.log("notice:", notice); 
        axios.get(`/api/notice/${noticenum}`)
        .then((resp)=>{
            console.log("Response data:", resp.data);
            setOrgFiles(resp.data.files);
            setInputs(resp.data.notice);
            setNotice(resp.data.notice);

            const temp = [];
            let i = 0;
            
            // resp.data.files가 존재하고 배열인지 확인
            if (resp.data.files && Array.isArray(resp.data.files)) {
                for (; i < resp.data.files.length; i++) {
                    const nfdto = resp.data.files[i];
                    
                    // systemname이 null 또는 undefined가 아닌지 확인
                    if (nfdto && nfdto.systemname) {
                        let ext = nfdto.systemname.split(".").pop();
                        let isThumbnail = ext == 'jpeg' || ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'webp';
                        
                        temp.push({
                            id: i,
                            num: i,
                            file: {
                                name: nfdto.orgname,
                                systemname: nfdto.systemname
                            },
                            thumbnail: isThumbnail ? `/api/notice/file/thumbnail/${nfdto.systemname}` : ''
                        });
                    } else {
                        console.warn(`Invalid systemname for file at index ${i}`, nfdto);
                    }
                }
            } else {
                console.warn("No files found in response data or files is not an array.");
            }
            
            
            temp.push({id:i,num:i,file:"",thumbnail:""});
            setFiles(temp);
            index.current = resp.data.files.length;
            NUM.current = index.current;
            console.log(index.current, NUM.current, temp)
        })
    },[noticenum])
    const [chars, setChars] = useState([]);
    useEffect(() => {
        if (!notice) {
            const text = "로딩중...";
            const splitText = text.split("").map((char, index) => ({
                char,
                delay: index * 0.5 // 각 글자에 0.5초씩 딜레이
            }));
            setChars(splitText);
        }
    }, [notice]);

    // 데이터가 없을 때 로딩 텍스트 표시
    if (!notice) {
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
          <>
          <Header/>
          <div id="nwrap" className="nmodify">
            <div className="notice-title">Notice</div>
            <form id="noticeForm" name="noticeForm">
              <div className="ntable">
                <div className="row">
                  <div>제목</div>
                  <div>
                    <input
                      type="text"
                      name="noticetitle"
                      maxLength={50}
                      placeholder="제목을 입력하세요"
                      value={inputs.noticetitle || ""}
                      onChange={change}
                    />
                  </div>
                </div>
                <div className="row">
                  <div>작성자</div>
                  <div>
                    <input
                      type="text"
                      name="userid"
                      maxLength={50}
                      value={inputs.userid || ""}
                      readOnly
                    />
                  </div>
                </div>
                {
                            files.map((item) => (
                                item.thumbnail ? (
                                    <div className="row">
                                        <div>첨부사진</div>
                                        <div key={item.id} className="nthumbnail_area nwritethumbnail_area">
                                            <img src={item.thumbnail} alt={`thumbnail${item.id}`} className="nwritethumbnail" />
                                        </div>
                                        <div className=" row">
                                            <Button className={"btn"} value={"파일 선택"} onClick={() => { upload(item.id); }}></Button>
                                            <Button className={"btn"} value={"파일 삭제"} onClick={() => { removeFile(item.id); }}></Button>
                                        </div>
                                    </div>
                                ) : ""
                            ))
                        }
                <div className="row">
                  <div>내용</div>
                  <div>
                    <textarea
                      name="noticecontent"
                      value={inputs.noticecontent || ""}
                      onChange={change}
                    ></textarea>
                  </div>
                </div>
                {files.map((item) => {
                  return (
                    <div className={`row r${item.num}`} key={item.id}>
                      <div>파일 첨부{item.num + 1}</div>
                      <div className={`file${item.num}_cont row`}>
                        <div className="cols-7">
                          <input
                            type="file"
                            name="files"
                            id={`file${item.num}`}
                            style={{ display: "none" }}
                            onChange={(e) => {
                              selectFile(e, item.id, item.num);
                            }}
                          />
                          <span id={`file${item.num}name`}>
                            {item.file.name || "선택된 파일 없음"}
                          </span>
                        </div>
                        <div className="cols-3 row">
                          <Button
                            className="btn"
                            value="파일 선택"
                            onClick={() => {
                              upload(item.num);
                            }}
                          />
                          <Button
                            className="btn"
                            value="첨부 삭제"
                            onClick={() => {
                              removeFile(item.id, item.num);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </form>
            <table className="nbtn_area">
              <tbody>
                <tr>
                  <td>
                    <Button value="수정완료" className="btn" onClick={modify}></Button>
                    <Button
                      value="목록"
                      className="btn"
                      onClick={() => {
                        navigate("/notice/list", { state: cri });
                      }}
                    ></Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          </>    
        );
    }
}
export default Nmodify;