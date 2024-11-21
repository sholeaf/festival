import axios from "axios";
import Slider from 'react-slick';
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../layout/Header";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import map_img from "../../assets/images/festivalImg/map_img.png";
import noimage from "../../assets/images/no-image.jpg";
import bookmark from "../../assets/images/bookmark.png"
import nobookmark from "../../assets/images/nobookmark.png"

const DetailFestival = () => {
    const { contentid } = useParams();
    const navigate = useNavigate();
    const API_KEY = useLocation().state.API_KEY;
    const activeTab = useLocation().state.activeTab;

    const [data, setData] = useState([]);
    const [images, setImages] = useState([]);
    const [intro, setIntro] = useState([]);

    // 각 요소에 대한 ref
    const introRef = useRef(null);
    const festivalInfoRef = useRef(null);
    const locationRef = useRef(null);


    // Slick Slider 설정
    const settings = {
        dots: true,        // 아래에 페이지네이션 표시
        infinite: true,    // 무한 슬라이드
        speed: 1100,       // 전환 속도
        slidesToShow: 1,   // 한 번에 보이는 이미지 수
        slidesToScroll: 1, // 한 번에 스크롤되는 이미지 수
        autoplay: true,    // 자동 재생
        autoplaySpeed: 5000, // 자동 재생 속도 (5초)
    };


    const formatDate = (dateStr) => {
        if (!dateStr) return "-";  // 날짜가 없으면 "-"로 처리
        const date = new Date(dateStr.slice(0, 4), dateStr.slice(4, 6) - 1, dateStr.slice(6, 8));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    // Festival 데이터 불러오기
    useEffect(() => {
        axios.get(`https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentTypeId=15&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=10&pageNo=1&serviceKey=${API_KEY}&contentId=${contentid}`)
            .then((resp) => {
                const detailFestival = resp.data.response.body.items.item || [];
                setData(detailFestival[0]);
            })
            .catch((error) => {
                console.error("API 호출 오류:", error);
            });

        axios.get(`https://apis.data.go.kr/B551011/KorService1/detailImage1?MobileOS=ETC&MobileApp=AppTest&_type=json&imageYN=Y&subImageYN=Y&numOfRows=20&pageNo=1&serviceKey=${API_KEY}&contentId=${contentid}`)
            .then((resp) => {
                const detailImg = resp.data.response.body.items.item || [];
                setImages(detailImg);
            })
            .catch((error) => {
                console.error("API 호출 오류:", error);
            });

        axios.get(`https://apis.data.go.kr/B551011/KorService1/detailIntro1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentTypeId=15&numOfRows=10&pageNo=1&serviceKey=${API_KEY}&contentId=${contentid}`)
            .then((resp) => {
                const detailIntro = resp.data.response.body.items.item || [];
                setIntro(detailIntro[0]);
            });
    }, [contentid]);

    // 지도 로딩
    useEffect(() => {
        if (data.mapx && data.mapy) {
            const script = document.createElement('script');
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=db24bdb6dad4a16a8feeb6f6ef35d0e7&libraries=services,clusterer`;
            script.onload = () => {
                const container = document.getElementById("map");
                const options = {
                    center: new window.kakao.maps.LatLng(data.mapy, data.mapx),
                    level: 3, // 지도 확대 레벨
                };

                const map = new window.kakao.maps.Map(container, options);
                const marker = new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(data.mapy, data.mapx)
                });
                marker.setMap(map);
            };
            document.body.appendChild(script);
        }
    }, [data]);

    // IntersectionObserver 설정
    useEffect(() => {
        const observerOptions = { threshold: 0.1 };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("fade-in");
                } else {
                    entry.target.classList.remove("fade-in");
                }
            });
        }, observerOptions);
        // 각 ref 요소에 대해 observer 적용
        if (introRef.current) observer.observe(introRef.current);
        if (festivalInfoRef.current) observer.observe(festivalInfoRef.current);
        if (locationRef.current) observer.observe(locationRef.current);

        // Cleanup: 옵저버 해제
        return () => {
            if (introRef.current) observer.unobserve(introRef.current);
            if (festivalInfoRef.current) observer.unobserve(festivalInfoRef.current);
            if (locationRef.current) observer.unobserve(locationRef.current);
        };
    }, [data]); // 데이터가 변경될 때마다 옵저버 재실행

    if (!data || data.length === 0) {
        return <>로딩중...</>;
    }

    return (
        <>
            <Header />
            <img className="festival-firstImg" src={data.firstimage} alt="Festival" />
            <div id="wrap">
                <div className="festival-detail-area">
                    <h1>{data.title}</h1>

                    <div className="detail-img">
                        {images.length == 0 ? <img className="detail-img" src={noimage}></img> :
                            images.length <= 1 ? <div className="detail-img"><img src={images[0].originimgurl}></img></div> :
                                <Slider {...settings}>
                                    {images.map((image, index) => (
                                        <div className="detail-img" key={index}>
                                            <img src={image.originimgurl} alt={`Slide ${index + 1}`}></img>
                                        </div>
                                    ))}
                                </Slider>
                        }
                    </div>

                    <div className="festival-info">
                        <div className="festival-intro1">
                            <h2>소개</h2>
                            <div
                                className="festival-introduction"
                                dangerouslySetInnerHTML={{ __html: data.overview }}
                                ref={introRef}
                            />
                        </div>

                        <div className="festival-intro2">
                            <h2>축제 정보</h2>
                            <table ref={festivalInfoRef}>
                                <tbody>
                                    <tr>
                                        <th>축제 기간</th>
                                        <td>{formatDate(intro.eventstartdate)} ~ {formatDate(intro.eventenddate)}</td>
                                    </tr>
                                    <tr>
                                        <th>운영 시간</th>
                                        <td>{intro.playtime === "" ? "-" : <span dangerouslySetInnerHTML={{ __html: intro.playtime }} />}</td>
                                    </tr>
                                    <tr>
                                        <th>요금</th>
                                        <td dangerouslySetInnerHTML={{ __html: intro.usetimefestival }} />
                                    </tr>
                                    <tr>
                                        <th>연령 제한</th>
                                        {intro.agelimit === "" ? <td>-</td> : <td dangerouslySetInnerHTML={{ __html: intro.agelimit }} />}
                                    </tr>
                                    {intro.spendtimefestival !== "" && (
                                        <tr>
                                            <th>공연 시간</th>
                                            <td dangerouslySetInnerHTML={{ __html: intro.spendtimefestival }} />
                                        </tr>
                                    )}
                                    <tr>
                                        <th>페이지</th>
                                        {data.homepage === "" ? <td>-</td> : <td dangerouslySetInnerHTML={{ __html: data.homepage }} />}
                                    </tr>
                                    <tr>
                                        <th>전화</th>
                                        <td>{data.telname} ) <span dangerouslySetInnerHTML={{ __html: data.tel }} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="festival-intro3">
                            <h2 >위치</h2>
                            <div className="festival-location" ref={locationRef}>
                                <div className="map-img-area">
                                    <img src={map_img} />
                                </div>
                                <div className="map-addr-area">
                                    <div id="map" style={{ width: "100%", height: "400px", marginTop: "20px" }}></div>
                                    <div className="festival-addr">
                                        <div dangerouslySetInnerHTML={{ __html: intro.eventplace }} />
                                        <div>[ {data.addr1} {data.addr2} ({data.zipcode}) ]</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="btn-area" onClick={() => navigate("/festival", { state: activeTab })}>
                        목 록
                    </div>
                </div>
            </div>
        </>
    );
}

export default DetailFestival;