import axios from "axios";
import Slider from 'react-slick';
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../layout/Header";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DetailFestival = () => {
    const { contentid } = useParams();
    const navigate = useNavigate();
    const API_KEY = useLocation().state;

    // 배열 구조분해를 제대로 사용합니다.
    const [data, setData] = useState([]);
    const [images, setImages] = useState([]);

    const settings = {
        dots: true,        // 아래에 페이지네이션 표시
        infinite: true,    // 무한 슬라이드
        speed: 500,        // 전환 속도
        slidesToShow: 1,   // 한 번에 보이는 이미지 수
        slidesToScroll: 1, // 한 번에 스크롤되는 이미지 수
        autoplay: true,    // 자동 재생
        autoplaySpeed: 3000, // 자동 재생 속도 (3초)
    };

    useEffect(() => {
        axios.get(`https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentTypeId=15&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=10&pageNo=1&serviceKey=${API_KEY}&contentId=${contentid}`)
            .then((resp) => {
                const detailFestival = resp.data.response.body.items.item || [];
                setData(detailFestival[0]);
                console.log("응답 데이터", detailFestival);
                console.log("data : ", data)
            })
            .catch((error) => {
                console.error("API 호출 오류:", error);
            });

        axios.get(`https://apis.data.go.kr/B551011/KorService1/detailImage1?MobileOS=ETC&MobileApp=AppTest&_type=json&imageYN=Y&subImageYN=Y&numOfRows=20&pageNo=1&serviceKey=${API_KEY}&contentId=${contentid}`)
            .then((resp) => {
                const detailImg = resp.data.response.body.items.item || [];
                setImages(detailImg);
                console.log("reso images : ", detailImg);
                console.log("images : ", detailImg);
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

                <Slider {...settings}>
                    {images.map((image, index) => (
                        <div className="detail-img" key={index}>
                            <img src={image.originimgurl} alt={`Slide ${index + 1}`}></img>
                        </div>
                    ))}
                </Slider>
                <div className="festival-info">
                    <div>{data.telname} : {data.tel}</div>
                    <div>주소 : {data.addr1} {data.addr2}</div>
                    <div>({data.zipcode})</div>
                    <div>경도 : {data.mapx} 위도 : {data.mapy}</div>
                    <div>설명 : <span dangerouslySetInnerHTML={{ __html: data.overview }} /></div>
                    <div>홈페이지 : <span dangerouslySetInnerHTML={{ __html: data.homepage }} /></div>
                </div>
            </div>
            <div>
                <div onClick={() => {
                    navigate("/festival");
                }}>목록</div>
            </div>
        </div>
    );
}

export default DetailFestival;
