import { useEffect, useRef, useState } from "react";

import Header from "../../layout/Header";
import TodayDate from "../../hooks/TodayDate";
import FestivalCalendar from "./FestivalCalendar";
import FestivalMap from "./FestivalMap";
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

const API_URL = 'https://apis.data.go.kr/B551011/KorService1/searchFestival1?MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&';
const API_KEY = 'ADUQciriMbR143Lb7A8xLWVlcBZQXuCPTgGmksfopPBMwtmLQhkIrGlBror4PosCYnLLVqtrEnZz1T%2F4N9atVg%3D%3D';

const FestivalSearch = () => {
    return <div>축제 검색</div>;
}

const Festival = () => {
    const { noHyphen } = TodayDate();
    const [activeTab, setActiveTab] = useState('calendar');
    const [img, setImg] = useState();
    const [season, setSeason] = useState()
    const [param, setParam] = useState({
        numOfRow: 20,
        pageNo: 1,
        eventStartDate: noHyphen,
        eventEndDate: noHyphen,
        areaCode: '',
        sigunguCode: ''
    });

    const todayRef = useRef(noHyphen);

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
            if (param.areaCode == '1') {
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
    }, [season, param.areaCode, activeTab])

    useEffect(() => {
        if (activeTab !== 'calendar') {
            setParam(prevParam => ({
                ...prevParam,
                eventStartDate: noHyphen,
                eventEndDate: noHyphen
            }));
        }
    }, [activeTab, noHyphen]);

    useEffect(() => {
        if (activeTab !== 'map') {
            setParam(prevParam => ({
                ...prevParam,
                eventStartDate: noHyphen,
                eventEndDate: noHyphen,
                areaCode: ''
            }));
        }
    }, [activeTab, noHyphen]);

    return (
        <>
            <Header />
            <div id="wrap">
                <img className="festival_img_area" src={img} alt="Festival" />

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
                    {activeTab === 'calendar' && <FestivalCalendar setParam={setParam} param={param} API_URL={API_URL} API_KEY={API_KEY} />}
                    {activeTab === 'map' && <FestivalMap setParam={setParam} param={param} API_URL={API_URL} API_KEY={API_KEY} noHyphen={noHyphen} />}
                    {activeTab === 'search' && <FestivalSearch />}
                </div>
            </div>
        </>
    );
}

export default Festival;