import { useEffect, useRef, useState } from "react";
import Button from "./Button";

const Hobby = ({name,data}) => {
    const [list,setList] = useState([]);
    const [result,setResult] = useState("")
    const inputRef = useRef(null);
    
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter'){
            addData();
        }
    }
    const addData = () => {
        if(inputRef.current.value == ""){
            alert(`${name}를(을) 입력해 주세요.`);
            inputRef.current.focus();
            return;
        }
        if(list.indexOf('#'+inputRef.current.value) != -1){
            alert(`중복된 ${name}입니다.`);
            inputRef.current.focus();
            inputRef.current.value = "";
            return;
        }
        if(!/^[가-힣a-zA-Z\s]+$/.test(inputRef.current.value)){
            alert(`정확한 ${name}를 입력해 주세요.`)
            inputRef.current.focus();
            inputRef.current.value = "";
            return;
        }
        if(list.length >= 5){
            alert(`${name}는(은) 5개 이하로 입력해 주세요.`)
            inputRef.current.focus();
            inputRef.current.value="";
            return;
        }
        const addData = "#"+inputRef.current.value;
        // setList([...list,inputRef.current.value]);
        setList([...list,addData]);
        inputRef.current.value = "";
        inputRef.current.focus();
    }

    const deleteData = (data) => {
        const updatedList = list.filter((item) => item != data);
        setList(updatedList);
    }

    useEffect(()=>{
        setResult(list.join("\\"));
    },[list])

    useEffect(()=>{
        if(data){
            setList(data);
        }
    },[])

    return (
        <div>
            <div className="hobby_input">
                <input type="text"  name="hobby" ref={inputRef} onKeyDown={handleKeyDown}/><Button className="btn hbBtn" value="추가"  onClick={addData}/>
            </div>
            <div className="hobby_list">
                {
                    list.map((data) => {
                        return (
                            <span className="userhobby" name="userhobby" onClick={()=>{ deleteData(data) }} key={data}>
                                <span>{data}</span>
                                {/* <a className="xBox" onClick={()=>{
                                    deleteData(data);
                                }}></a> */}
                            </span>
                        )
                    })
                }
            </div>
            <input type="hidden" name="userhobby" readOnly value={result}/>
        </div>
    )
}
export default Hobby;