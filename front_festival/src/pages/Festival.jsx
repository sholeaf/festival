import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Calendar from 'react-calendar';
import TodayDate from "../hooks/TodayDate";

// API 관련
const API_URL = 'https://apis.data.go.kr/B551011/KorService1/searchFestival1?';
const API_KEY = 'ADUQciriMbR143Lb7A8xLWVlcBZQXuCPTgGmksfopPBMwtmLQhkIrGlBror4PosCYnLLVqtrEnZz1T%2F4N9atVg%3D%3D';


//축제 달력 컴포넌트
const FestivalCalendar = ({ setParam, param }) => {

    const [festivals, setFestivals] = useState([]);
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

    useEffect(() => {
        console.log('param.eventStart : ',param.eventStartDate);
        axios.get(`${API_URL}serviceKey=${API_KEY}&numOfRows=${param.numOfRow}&pageNo=${param.pageNo}&MobileOS=${param.MobileOS}&MobileApp=${param.MobileApp}&_type=json&listYN=Y&arrange=A&eventStartDate=${param.eventStartDate}`)
            .then((resp) => {
                console.log("resp: " ,resp);
                const festivalsData = resp.data.response.body.items.item|| [];
                console.log("item: " ,festivalsData);

                setFestivals(festivalsData);
            })

    }, [param]);

    return (
        <div>
            <Calendar onChange={handleDateChange} />

            {/* 축제 목록 */}
            {festivals.length > 0 && (
                <div>
                    <h3>축제 목록</h3>
                    <ul>
                        {festivals.map((festival) => (
                            <li key={festival.contentid}>
                                <h4>{festival.title}</h4>
                                <p>{festival.addr1}</p>
                                {festival.firstimage != null && festival.firstimage !== "" ?
                                    (<img
                                    src={festival.firstimage}
                                    alt={festival.title}
                                    style={{ width: "100px", height: "100px" }}
                                />) :
                                (<img src="front_festival\src\assets\images\no-image.jpg"></img>)
                                }
                                
                                <p>
                                    {festival.eventstartdate} ~ {festival.eventenddate}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 축제 목록이 없을 때 */}
            {festivals.length === 0 && <p>해당 날짜에 대한 축제가 없습니다.</p>}
        </div>
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

    const { noHyphen } = TodayDate();


    const [activeTab, setActiveTab] = useState('calendar');  // 기본값을 'calendar'로 
    const todayRef = useRef(noHyphen);


    const [param, setParam] = useState({
        numOfRow: 10, //페이지 결과 수
        pageNo: 1, // 페이지 num
        MobileOS: 'ETC',
        MobileApp: 'AppTest',
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