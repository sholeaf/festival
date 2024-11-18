import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../layout/Header";

const DetailFestival = () => {
    const { contentid } = useParams();
    const navigate = useNavigate();
    const API_KEY = useLocation().state;

    // 배열 구조분해를 제대로 사용합니다.
    const [data, setData] = useState([]);
    const [image, setImage] = useState([]);

    useEffect(() => {
        axios.get(`https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentTypeId=15&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=10&pageNo=1&serviceKey=${API_KEY}&contentId=${contentid}`)
        .then((resp) => {
            const detailFestival = resp.data.response.body.items.item || [];
            setData(detailFestival);
            console.log("응답 데이터",detailFestival);
            console.log("data : ",data[0])
        })
        .catch((error) => {
            console.error("API 호출 오류:", error);
        });
    }, [contentid]); 

    if (!data || data.length === 0) {
        return <>로딩중...</>;
    }

    return (
        <div id="wrap">
            <Header />
            <div className="festival-detail-area">
                <div>{data.title}</div>
                <div>{data.telname} : {data.tel}</div>
                <div>이미지 들어갈곳!</div>
                <div>주소 : {data.addr1} {data.addr2}</div>
                <div>({data.zipcode})</div>
                <div>경도 : {data.mapx} 위도 : {data.mapy}</div>
                <div>설명 : {data.overview}</div>
                <div>홈페이지 : {data.homepage}</div>
            </div>
        </div>
    );
}

export default DetailFestival;
