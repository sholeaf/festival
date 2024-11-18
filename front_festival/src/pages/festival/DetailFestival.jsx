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
    const [images, setImages] = useState([]);

    useEffect(() => {
        axios.get(`https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentTypeId=15&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=10&pageNo=1&serviceKey=${API_KEY}&contentId=${contentid}`)
        .then((resp) => {
            const detailFestival = resp.data.response.body.items.item || [];
            setData(detailFestival[0]);
            console.log("응답 데이터",detailFestival);
            console.log("data : ",data)
        })
        .catch((error) => {
            console.error("API 호출 오류:", error);
        });

        axios.get(`https://apis.data.go.kr/B551011/KorService1/detailImage1?MobileOS=ETC&MobileApp=AppTest&_type=json0&imageYN=Y&subImageYN=Y&numOfRows=20&pageNo=1&serviceKey=${API_KEY}&contentId=${contentid}`)
        .then((resp)=>{
            const detailImg = resp.data.response.body.items.item || [];
            setImages(detailImg);
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
                <h2>{data.title}</h2>
                <div>{data.telname} : {data.tel}</div>
                {images.map((image)=>(
                    <div key={image.serialnum}>

                    </div>
                ))}
                <div>주소 : {data.addr1} {data.addr2}</div>
                <div>({data.zipcode})</div>
                <div>경도 : {data.mapx} 위도 : {data.mapy}</div>
                <div>설명 : <span dangerouslySetInnerHTML={{ __html: data.overview }} /></div>
                <div>홈페이지 : <span dangerouslySetInnerHTML={{ __html: data.homepage }} /></div>
            </div>
            <div>
                <div onClick={()=>{
                    navigate("/festival");
                }}>목록</div>
            </div>
        </div>
    );
}

export default DetailFestival;
