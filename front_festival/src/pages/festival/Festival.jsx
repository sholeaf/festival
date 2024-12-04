import { useEffect, useRef, useState } from "react";
import axios from "axios";

import Header from "../../layout/Header";
import TodayDate from "../../hooks/TodayDate";
import FestivalCalendar from "./FestivalCalendar";
import FestivalMap from "./FestivalMap";
import FestivalSearch from "./FestivalSearch";
import FestivalParam from "../../hooks/FestivalParam";
import spring from "../../assets/images/festivalImg/spring.jpg";
import summer from "../../assets/images/festivalImg/summer.jpg";
import fall from "../../assets/images/festivalImg/fall.jpg";
import winter from "../../assets/images/festivalImg/winter.jpg";
import seoul from "../../assets/images/festivalImg/seoul.jpg";
import incheon from "../../assets/images/festivalImg/incheon.jpg";
import gyeonggi from "../../assets/images/festivalImg/gyeonggi.jpg";
import seajong from "../../assets/images/festivalImg/seajong.jpg";
import chungnam from "../../assets/images/festivalImg/chungnam.jpg";
import chungbuk from "../../assets/images/festivalImg/chungbuk.jpg";
import busan from "../../assets/images/festivalImg/busan.jpg";
import daegu from "../../assets/images/festivalImg/daegu.jpg";
import daejeon from "../../assets/images/festivalImg/daejeon.jpg";
import gangwon from "../../assets/images/festivalImg/gangwon.jpg";
import gwangju from "../../assets/images/festivalImg/gwangju.jpg";
import jeaju from "../../assets/images/festivalImg/jeaju.jpg";
import jeonbuk from "../../assets/images/festivalImg/jeonbuk.jpg";
import jeonnam from "../../assets/images/festivalImg/jeonnam.jpg";
import gyeongbuk from "../../assets/images/festivalImg/gyeongbuk.jpg";
import gyeongnam from "../../assets/images/festivalImg/gyeongnam.jpg";
import ulsan from "../../assets/images/festivalImg/ulsan.jpg";
import area from "../../assets/images/festivalImg/areadefault.jpg";
import { useLocation } from "react-router-dom";
import Footer from "../../layout/Footer";

const API_URL = 'https://apis.data.go.kr/B551011/KorService1/searchFestival1?MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&';
const API_KEY = 'ADUQciriMbR143Lb7A8xLWVlcBZQXuCPTgGmksfopPBMwtmLQhkIrGlBror4PosCYnLLVqtrEnZz1T%2F4N9atVg%3D%3D';



const Festival = () => {
    const location = useLocation();
    const { noHyphen } = TodayDate();
    const [img, setImg] = useState();
    const [imgIndex, setImgIndex] = useState(0);
    const [season, setSeason] = useState();
    const { sampleData, setSampleData} = useState();
    const [animate, setAnimate] = useState(false); // 애니메이션 상태
    const { param, setParam } = FestivalParam(noHyphen);

    const [activeTab, setActiveTab] = useState(location.state || 'calendar');

    const [loginUser, setLoginUser] = useState("");
    const [bmlist, setBmlist] = useState([]);


    // 탭 선택 상태 관리

    const images = [
        seoul, incheon, daejeon, daegu, gwangju,
        busan, ulsan, seajong, gyeonggi, gangwon,
        chungbuk, chungnam, gyeongbuk, gyeongnam,
        jeonbuk, jeonnam, jeaju
    ];

    const todayRef = useRef(noHyphen);

    const props = {
        API_URL,
        API_KEY,
        param,
        setParam,
        activeTab,
        userid: loginUser,
        bmlist,
        setBmlist,
        sampleData: bmlist,
        setSampleData,
        noHyphen
    };


    useEffect(() => {
        if (loginUser == '' || loginUser == null) {
            return;
        }

        axios.get(`/api/bookmark/checkBookmark`, { params: { userid: props.userid } })
            .then((resp) => {
                setBmlist(resp.data);
                console.log("요청 하기! : ", resp.data);
            })
            .catch((error) => {
                console.log("bmlist 오류", error);
            })
    }, [loginUser,sampleData]);

    useEffect(() => {
        axios.get(`/api/user/loginCheck`)
            .then((resp) => {
                setLoginUser(resp.data);
                console.log("yes");
            })
            .catch((error) => {
                console.error("로그인 상태 확인 오류: ", error);
            });
    }, []);

    useEffect(() => {
        const month = param.eventStartDate.substring(4, 6);
        setSeason(month);
    }, [param.eventStartDate]);

    useEffect(() => {
        if (activeTab == 'calendar') {
            if (season >= '03' && season <= '05') {
                setImg(spring);
            } else if (season >= '06' && season <= '08') {
                setImg(summer);
            } else if (season >= '09' && season <= '11') {
                setImg(fall);
            } else if (season === '12' || season === '01' || season === '02') {
                setImg(winter);
            }
        }
        else if (activeTab == 'map') {
            if (param.areaCode == '') {
                setImg(area);
            }
            else if (param.areaCode == '1') {
                setImg(seoul);
            }
            else if (param.areaCode == '2') {
                setImg(incheon);
            }
            else if (param.areaCode == '3') {
                setImg(daejeon);
            }
            else if (param.areaCode == '4') {
                setImg(daegu);
            }
            else if (param.areaCode == '5') {
                setImg(gwangju);
            }
            else if (param.areaCode == '6') {
                setImg(busan);
            }
            else if (param.areaCode == '7') {
                setImg(ulsan);
            }
            else if (param.areaCode == '8') {
                setImg(seajong);
            }
            else if (param.areaCode == '31') {
                setImg(gyeonggi);
            }
            else if (param.areaCode == '32') {
                setImg(gangwon);
            }
            else if (param.areaCode == '33') {
                setImg(chungbuk);
            }
            else if (param.areaCode == '34') {
                setImg(chungnam);
            }
            else if (param.areaCode == '35') {
                setImg(gyeongbuk);
            }
            else if (param.areaCode == '36') {
                setImg(gyeongnam);
            }
            else if (param.areaCode == '37') {
                setImg(jeonbuk);
            }
            else if (param.areaCode == '38') {
                setImg(jeonnam);
            }
            else if (param.areaCode == '39') {
                setImg(jeaju);
            }
        }
        else if (activeTab === 'search') {
            setImg(images[imgIndex]); // search탭에서는 이미지 리스트 순환
        }
    }, [season, param.areaCode, activeTab, imgIndex]);

    useEffect(() => {
        // 탭 전환 시마다 param 초기화
        if (activeTab === 'calendar') {
            // calendar 탭에서는 날짜 초기화
            setParam(prevParam => ({
                ...prevParam,
                pageNo: 1,
                eventStartDate: noHyphen,  // 날짜 초기화
                eventEndDate: noHyphen     // 날짜 초기화
            }));
        } else if (activeTab === 'map') {
            // map 탭에서는 날짜를 그대로 두고 areaCode만 초기화
            setParam(prevParam => ({
                ...prevParam,
                pageNo: 1,
                areaCode: '',
                eventStartDate: noHyphen,  // 날짜 초기화
                eventEndDate: noHyphen    // 날짜 초기화
            }));
        }
    }, [activeTab, noHyphen]); // activeTab 또는 noHyphen이 변경될 때마다 실행


    useEffect(() => {
        let interval;
        if (activeTab === 'search') {
            interval = setInterval(() => {
                setAnimate(true);
                setTimeout(() => {
                    setImgIndex((prevIndex) => (prevIndex + 1) % images.length);
                    setAnimate(false);
                }, 500); // 애니메이션 지속시간
            }, 3000); // 이미지 변경 간격
        }
        return () => clearInterval(interval); // cleanup on tab change
    }, [activeTab]);
    console.log("active tab : ", activeTab)
    return (
        <>
            <Header />
            <div id="wrap">
                <div className={`festival_img_area ${animate ? 'animate' : ''}`}>
                    <img src={img} alt="festival_image" />
                </div>
                <div className="button-container">
                    <div
                        className="slider"
                        style={{ transform: `translateX(${activeTab === 'calendar' ? '0' : activeTab === 'map' ? '180%' : '360%'})` }}
                    ></div>

                    <div
                        onClick={() => setActiveTab('calendar')}
                        className={activeTab === 'calendar' ? 'tab selected' : 'tab'}
                    >
                        축제 달력
                    </div>
                    <div
                        onClick={() => setActiveTab('map')}
                        className={activeTab === 'map' ? 'tab selected' : 'tab'}
                    >
                        축제 지도
                    </div>
                    <div
                        onClick={() => setActiveTab('search')}
                        className={activeTab === 'search' ? 'tab selected' : 'tab'}
                    >
                        축제 검색
                    </div>
                </div>

                <div className="content">
                    {activeTab === 'calendar' && <FestivalCalendar {...props} />}
                    {activeTab === 'map' && <FestivalMap {...props} />}
                    {activeTab === 'search' && <FestivalSearch {...props} />}
                </div>
            </div>
            <Footer></Footer>
        </>
    );
}

export default Festival;