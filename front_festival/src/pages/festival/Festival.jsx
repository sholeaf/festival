import { useEffect, useRef, useState } from "react";

import Header from "../../layout/Header";
import TodayDate from "../../hooks/TodayDate";
import FestivalCalendar from "./FestivalCalendar"
import FestivalMap from "./FestivalMap";

// API 관련
const API_URL = 'https://apis.data.go.kr/B551011/KorService1/searchFestival1?MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&';
const API_KEY = 'ADUQciriMbR143Lb7A8xLWVlcBZQXuCPTgGmksfopPBMwtmLQhkIrGlBror4PosCYnLLVqtrEnZz1T%2F4N9atVg%3D%3D';



//축제 검색 컴포넌트
const FestivalSearch = () => {
    return (
        <div>축제 검색</div>
    );
}


const Festival = () => {
    const { noHyphen } = TodayDate();
    const [activeTab, setActiveTab] = useState('calendar');  // 기본값을 'calendar'로 
    const todayRef = useRef(noHyphen);

    const [param, setParam] = useState({
        numOfRow: 10, //페이지 결과 수
        pageNo: 1, // 페이지 num
        eventStartDate: noHyphen, // YYYYMMDD 형식의 시작 날짜
        eventEndDate: '', // 기본 값은 없음 값이 있다면 YYYYMMDD 형식
        areaCode: '', // 지역코드
        sigunguCode: '' //시군 코드 (만약 지역코드로만 된다면 삭제)
    });


    useEffect(() => {
        if (activeTab !== 'calendar') {
            setParam(prevParam => ({
                ...prevParam,
                eventStartDate: noHyphen // 현재 날짜로 설정
            }));
        }
    }, [activeTab, noHyphen]);
    useEffect(() => {
        if (activeTab !== 'map') {
            setParam(prevParam => ({
                ...prevParam,
                eventStartDate: noHyphen, // 현재 날짜로 설정
                areaCode: '',
            }));
        }
    }, [activeTab, noHyphen]);
    return (
        <>
            <Header />
            <div id="wrap">
                <div className="button-container">
                    <button onClick={() => setActiveTab('calendar')}>축제 달력</button>
                    <button onClick={() => setActiveTab('map')}>축제 지도</button>
                    <button onClick={() => setActiveTab('search')}>축제 검색</button>
                </div>

                <div className="content">
                    {activeTab === 'calendar' && <FestivalCalendar setParam={setParam} param={param} API_URL={API_URL} API_KEY={API_KEY} />}
                    {activeTab === 'map' && <FestivalMap setParam={setParam} param={param} API_URL={API_URL} API_KEY={API_KEY} noHyphen={noHyphen}/>}
                    {activeTab === 'search' && <FestivalSearch />}
                </div>
            </div>
        </>
    );
}

export default Festival;