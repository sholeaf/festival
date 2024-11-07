import { useRef, useState } from "react";
import Calendar from 'react-calendar';
import TodayDate from "../hooks/TodayDate";

//축제 달력 컴포넌트
const FestivalCalendar = ({ setParam, param }) => {
    // 날짜 선택 시 처리 함수
    const handleDateChange = (date) => {
        // 선택한 날짜를 YYYYMMDD 형식으로 변환
        const selectedDate = date.getFullYear().toString() + 
                             (date.getMonth() + 1).toString().padStart(2, '0') + 
                             date.getDate().toString().padStart(2, '0'); // YYYYMMDD 형식

        // setParam을 호출하여 eventStartDate를 업데이트
        setParam({
            ...param,
            eventStartDate: selectedDate
        });
    };

    console.log('변경된 날짜 : ', param.eventStartDate);

    return (
        <>
            <Calendar onChange={handleDateChange} />
            <div>축제 달력</div>
        </>
    );
}


//축제 지도 컴포넌트
const FestivalMap = () => {
    return (
        <div>축제 지도</div>
    );
}


//축제 검색 컴포넌트
const FestivalSearch = () => {
    return (
        <div>축제 검색</div>
    );
}


const Festival = () => {
    const API_URL = 'http://apis.data.go.kr/B551011/KorService1/';
    const API_KEY = 'ADUQciriMbR143Lb7A8xLWVlcBZQXuCPTgGmksfopPBMwtmLQhkIrGlBror4PosCYnLLVqtrEnZz1T%2F4N9atVg%3D%3D';

    const { noHyphen } = TodayDate();


    const [activeTab, setActiveTab] = useState('calendar');  // 기본값을 'calendar'로 
    const todayRef = useRef(noHyphen);


    const [param, setParam] = useState({
        numOfRow: 10, //페이지 결과 수
        pageNo: 1, // 페이지 num
        MobileOS: 'ETC',
        MobileApp: 'AppTest',
        type: 'json',
        listYN: 'Y', // 목록으로
        arrange: 'A', // 제목순
        eventStartDate: noHyphen, // YYYYMMDD 형식의 시작 날짜
        eventEndDate: '', // 기본 값은 없음 값이 있다면 YYYYMMDD 형식
        areaCode: '', // 지역코드
        sigunguCode: '' //시군 코드 (만약 지역코드로만 된다면 삭제)
    });
    return (
        <>
            <div className="button-container">
                <button onClick={() => setActiveTab('calendar')}>축제 달력</button>
                <button onClick={() => setActiveTab('map')}>축제 지도</button>
                <button onClick={() => setActiveTab('search')}>축제 검색</button>
            </div>

            <div className="content">
                {activeTab === 'calendar' && <FestivalCalendar setParam={setParam} param={param} />}
                {activeTab === 'map' && <FestivalMap />}
                {activeTab === 'search' && <FestivalSearch />}
            </div>
        </>
    );
}

export default Festival;