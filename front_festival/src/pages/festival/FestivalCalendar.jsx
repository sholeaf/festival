import { useEffect, useState } from "react";
import Calendar from 'react-calendar';
import axios from "axios";
import noimage from "../../assets/images/no-image.jpg";

const FestivalCalendar = ({ setParam, param, API_URL, API_KEY }) => {
    const [festivals, setFestivals] = useState([]);  // 축제 데이터 상태
    const [isLoading, setIsLoading] = useState(false);  // 로딩 상태
    const [hasMore, setHasMore] = useState(true);  // 추가 데이터 여부

    // 날짜 선택 시 처리 함수
    const handleDateChange = (date) => {
        const selectedDate = date.getFullYear().toString() +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            date.getDate().toString().padStart(2, '0'); // YYYYMMDD 형식

        // setParam을 호출하여 eventStartDate를 업데이트하고, 페이지 번호를 1로 리셋
        setParam({
            ...param,
            eventStartDate: selectedDate,
            pageNo: 1, // 날짜가 바뀔 때 페이지를 1로 리셋
        });

        // 전체 페이지 스크롤을 최상단으로 이동
        window.scrollTo(0, 0);  // 페이지 전체를 상단으로 스크롤

        // 축제 목록을 초기화
        setFestivals([]);
        setHasMore(true); // 더 이상 데이터가 없다는 상태를 리셋
    };

    // API 요청 함수
    const fetchFestivals = () => {
        if (isLoading) return;  // 로딩 중이면 API 요청을 방지
        setIsLoading(true);

        axios.get(`${API_URL}numOfRows=${param.numOfRow}&pageNo=${param.pageNo}&arrange=A&serviceKey=${API_KEY}&eventStartDate=${param.eventStartDate}`)
            .then((resp) => {
                const festivalsData = resp.data.response.body.items.item || [];
                setFestivals((prevFestivals) => [
                    ...prevFestivals,
                    ...festivalsData, // 기존 데이터에 새로운 데이터를 추가
                ]);
                setIsLoading(false);

                // 추가로 더 데이터를 요청할 수 있는지 체크
                if (festivalsData.length < param.numOfRow) {
                    setHasMore(false);  // 더 이상 데이터가 없으면
                }
            })
            .catch((error) => {
                console.error('Error fetching festivals:', error);
                setIsLoading(false);
            });
    };

    // 스크롤 이벤트 처리
    const handleScroll = () => {
        // 페이지 하단에 다다르면 추가 데이터 요청
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasMore && !isLoading) {
            setParam((prev) => ({
                ...prev,
                pageNo: prev.pageNo + 1,  // 페이지 번호 증가
            }));
        }
    };

    // 페이지가 처음 로드되거나 날짜가 변경될 때마다 축제 데이터를 가져옴
    useEffect(() => {
        fetchFestivals();
    }, [param]);

    // 페이지 스크롤 이벤트 리스너 추가
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hasMore, isLoading]);

    return (
        <div>
            <Calendar onChange={handleDateChange} />
            {/* 축제 목록 */}
            {festivals.length > 0 && (
                <div>
                    <h3>축제 목록</h3>
                    <ul className="festival-list">
                        {festivals.map((festival) => (
                            <li className={`festiva-${festival.contentid}`} key={festival.contentid}>
                                <h4>{festival.title}</h4>
                                <p>{festival.addr1}</p>
                                {festival.firstimage ? (
                                    <img src={festival.firstimage} alt={festival.title} style={{ width: "100px", height: "100px" }} />
                                ) : (
                                    <img src={noimage} alt="no-image" style={{ width: "100px", height: "100px" }} />
                                )}
                                <p>{festival.eventstartdate} ~ {festival.eventenddate}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 축제 목록이 없을 때 */}
            {festivals.length === 0 && <p>해당 날짜에 대한 축제가 없습니다.</p>}

            {/* 로딩 상태 */}
            {isLoading && <p>Loading...</p>}

            {/* 더 이상 데이터가 없을 때 */}
            {!hasMore && <p>더 이상 축제가 없습니다.</p>}
        </div>
    );
};

export default FestivalCalendar;