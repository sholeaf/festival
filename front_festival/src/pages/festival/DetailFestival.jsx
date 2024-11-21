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
import ClickBookmark from "../../hooks/ClickBookmark";

const DetailFestival = () => {
    const { contentid } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { API_KEY, activeTab, bmlist } = location.state;

    const [data, setData] = useState({});
    const [images, setImages] = useState([]);
    const [intro, setIntro] = useState({});
    const [userid, setUserid] = useState();
    const [list, setList] = useState(bmlist || []);  // 초기 값으로 location에서 전달된 bmlist를 사용
    const [sampleData, setSampleData] = useState(bmlist || []);

    const introRef = useRef(null);
    const festivalInfoRef = useRef(null);
    const locationRef = useRef(null);

    const settings = {
        dots: true,
        infinite: true,
        speed: 1100,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr.slice(0, 4), dateStr.slice(4, 6) - 1, dateStr.slice(6, 8));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    const handleBookmarkClick = (festivalContentid) => {
        ClickBookmark(festivalContentid, list, setList, userid, setSampleData);
    };

    useEffect(() => {
        axios.get(`/api/user/loginCheck`)
            .then((resp) => {
                setUserid(resp.data);
            })
            .catch((error) => {
                console.error("로그인 상태 확인 오류: ", error);
            });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

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
        if (introRef.current) observer.observe(introRef.current);
        if (festivalInfoRef.current) observer.observe(festivalInfoRef.current);
        if (locationRef.current) observer.observe(locationRef.current);

        return () => {
            if (introRef.current) observer.unobserve(introRef.current);
            if (festivalInfoRef.current) observer.unobserve(festivalInfoRef.current);
            if (locationRef.current) observer.unobserve(locationRef.current);
        };
    }, [data]);

    useEffect(() => {
        if (userid == '' || userid == null) {
            return;
        }

        axios.get(`/api/bookmark/checkBookmark`, { params: { userid } })
            .then((resp) => {
                setList(resp.data);
                console.log("요청 하기! : ", resp.data);
            })
            .catch((error) => {
                console.log("bmlist 오류", error);
            });
    }, [userid, sampleData]);

    if (!data || data.length === 0) {
        return <>로딩중...</>;
    }

    const isBookmarked = list.includes(contentid);  // bmlist 대신 list를 사용

    return (
        <>
            <Header />
            <img className="festival-firstImg" src={data.firstimage} alt="Festival" />
            <div id="wrap">
                <div className="festival-detail-area">
                    <h1>{data.title}</h1>

                    <div className="detail-img">
                        {images.length === 0 ? <img className="detail-img" src={noimage} alt="No Image" /> :
                            images.length <= 1 ? <div className="detail-img"><img src={images[0].originimgurl} alt="Festival Image" /></div> :
                                <Slider {...settings}>
                                    {images.map((image, index) => (
                                        <div className="detail-img" key={index}>
                                            <img src={image.originimgurl} alt={`Slide ${index + 1}`} />
                                        </div>
                                    ))}
                                </Slider>
                        }
                    </div>

                    <div className="festival-detail-bookmark" onClick={() => handleBookmarkClick(contentid)}>
                        <img className="bookmark-img" src={isBookmarked ? bookmark : nobookmark} alt="Bookmark" />
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
                                        <td>{intro.playtime || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>요금</th>
                                        <td dangerouslySetInnerHTML={{ __html: intro.usetimefestival }} />
                                    </tr>
                                    <tr>
                                        <th>연령 제한</th>
                                        <td>{intro.agelimit || "-"}</td>
                                    </tr>
                                    {intro.spendtimefestival && (
                                        <tr>
                                            <th>공연 시간</th>
                                            <td dangerouslySetInnerHTML={{ __html: intro.spendtimefestival }} />
                                        </tr>
                                    )}
                                    <tr>
                                        <th>페이지</th>
                                        <td dangerouslySetInnerHTML={{ __html: data.homepage }} />
                                    </tr>
                                    <tr>
                                        <th>전화</th>
                                        <td>{data.telname} ) <span dangerouslySetInnerHTML={{ __html: data.tel }} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="festival-intro3">
                            <h2>위치</h2>
                            <div className="festival-location" ref={locationRef}>
                                <div className="map-img-area">
                                    <img src={map_img} alt="Map" />
                                </div>
                                <div className="map-addr-area">
                                    <div id="map" style={{ width: "100%", height: "400px", marginTop: "20px" }}></div>
                                    <div className="festival-addr">
                                        <div dangerouslySetInnerHTML={{ __html: data.addr1 }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="remote-area" onClick={() => navigate("/festival", { state: activeTab })}>
                            목록
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailFestival;
