import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../layout/Header";

const DetailFestival = () =>{
    const {contentid} = useParams();
    const navigate = useNavigate();
    const API_KEY = useLocation().state;
    const API_URL = 'https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentTypeId=15&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=10&pageNo=1&';

    const {data , setData} = useState([]);

    useEffect(()=>{
        axios.get(`${API_URL}serviceKey=${API_KEY}&contentId=${contentid}`)
        .then((resp)=>{
            const detailFestival = resp.data.response.body.items.item || [];
            setData(detailFestival);
        })
    },[]);

    return (
        <>
            <Header></Header>

        </>
    );
}

export default DetailFestival;