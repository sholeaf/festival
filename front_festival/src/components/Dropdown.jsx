import { useEffect, useRef, useState } from "react";

const Dropdown = ({list, name, width, onChange, value}) => {
    let label;
    for(const key in list){
        if(list[key] == value){
            label = key;
            break;
        }
    }
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    const [selectedLabel, setSelectedLavel] = useState("");
    const dropdwonRef = useRef(null);

    const toggleDropdown = () =>{
        setIsOpen(!isOpen);    
    }
    const clickElement = (e)=>{
        let value;
        let label = e.target.innerHTML;
        value = list[label];
        setSelectedLavel(label);
        setSelectedValue(value);
        setIsOpen(false);
        document.getElementById(name).value = value;
        if(onChange){
            onChange(value);
        }
    }
    const elList = [];
    for(const key in list){
        elList.push(<li key={key} onClick={clickElement} style={{width:`${width}px`}}>{key}</li>)
    }
    useEffect(()=>{
        const handleClickOutside = (e)=>{
            if(dropdwonRef.current && !dropdwonRef.current.contains(e.target)){
                setIsOpen(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () =>{
            document.removeEventListener("click", handleClickOutside);
        }
    },[]);
    useEffect(()=>{
        const label = Object.keys(list).find(key=>list[key] == value);
        if(label){
            setSelectedLavel(label);
            setSelectedValue(value);
        }
    },[value]);

    return(
        <div ref={dropdwonRef} className={`common-dropdown ${isOpen ? 'show':''}`} style={{width:`${width}px`}}>
            <input type="hidden" defaultValue={selectedValue} name={name} id={name}/>
            <input type="button" className="dropdown-button" defaultValue={selectedLabel} style={{width:`${width}px`}} onClick={toggleDropdown} />
            <div className={`dropdown-content ${isOpen? 'show':''}`}>
                <ul style={{width:`${width}px`}}>
                    {elList}
                </ul>
            </div>
        </div>
    )
}
export default Dropdown;