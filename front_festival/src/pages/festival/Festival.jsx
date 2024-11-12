import { useEffect, useRef, useState } from "react";

import Header from "../../layout/Header";
import TodayDate from "../../hooks/TodayDate";
import FestivalCalendar from "./FestivalCalendar";
import FestivalMap from "./FestivalMap";

const API_URL = 'https://apis.data.go.kr/B551011/KorService1/searchFestival1?MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&';
const API_KEY = 'ADUQciriMbR143Lb7A8xLWVlcBZQXuCPTgGmksfopPBMwtmLQhkIrGlBror4PosCYnLLVqtrEnZz1T%2F4N9atVg%3D%3D';

const FestivalSearch = () => {
    return <div>축제 검색</div>;
}

const Festival = () => {
    const { noHyphen } = TodayDate();
    const [activeTab, setActiveTab] = useState('calendar');
    const todayRef = useRef(noHyphen);

    const [param, setParam] = useState({
        numOfRow: 20,
        pageNo: 1,
        eventStartDate: noHyphen,
        eventEndDate: noHyphen,
        areaCode: '',
        sigunguCode: ''
    });

    useEffect(() => {
        if (activeTab !== 'calendar') {
            setParam(prevParam => ({
                ...prevParam,
                eventStartDate: noHyphen
            }));
        }
    }, [activeTab, noHyphen]);

    useEffect(() => {
        if (activeTab !== 'map') {
            setParam(prevParam => ({
                ...prevParam,
                eventStartDate: noHyphen,
                areaCode: '',
            }));
        }
    }, [activeTab, noHyphen]);

    return (
        <>
            <Header />
            <div id="wrap">
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
