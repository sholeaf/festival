import { useEffect, useRef, useState } from "react";

import Header from "../../layout/Header";
import TodayDate from "../../hooks/TodayDate";
import FestivalCalendar from "./FestivalCalendar";
import FestivalMap from "./FestivalMap";
import spring from "../../assets/images/festivalImg/spring.jpg";
import summer from "../../assets/images/festivalImg/summer.jpg";
import fall from "../../assets/images/festivalImg/fall.jpg";
import winter from "../../assets/images/festivalImg/winter.jpg"
import noimage from "../../assets/images/no-image.jpg";

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
        const month = param.eventStartDate.substring(4, 6);  // Get the month part (5th and 6th character of YYYYMMDD format)
        setSeason(month);
    }, [param.eventStartDate]);

    useEffect(() => {
        if (param.areaCode == '') {
            console.log("몇월? : ", season);
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
        else if (param.areaCode != '') {
            if (param.areaCode == '1') {
                setImg(summer);
            }
        }
    }, [season, param.areaCode])

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
                <img className="festival_img_area" src={img}></img>

                <div className="button-container">
                    <div className="slider" style={{ transform: `translateX(${activeTab === 'calendar' ? '0' : activeTab === 'map' ? '180%' : '360%'})` }}></div>

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
