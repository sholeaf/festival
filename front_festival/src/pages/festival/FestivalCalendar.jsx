import { useEffect, useState } from "react";
import Calendar from 'react-calendar';
import axios from "axios";
import ClickBookmark from "../../hooks/ClickBookmark";  // 훅 임포트
import noimage from "../../assets/images/no-image.jpg";
import bookmark from "../../assets/images/bookmark.png";
import nobookmark from "../../assets/images/nobookmark.png";
import { useNavigate } from "react-router-dom";

const FestivalCalendar = (props) => {
    const { API_URL, API_KEY, param, setParam, activeTab, userid, bmlist, setBmlist, data, setData, noHyphen } = props;
    const [festivals, setFestivals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    console.log("data check : ",data);
    console.log("calendar props : ", props);

    const handleDateChange = (date) => {
        const selectedDate = date.getFullYear().toString() +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            date.getDate().toString().padStart(2, '0'); // YYYYMMDD 형식

        setParam({
            ...param,
            eventStartDate: selectedDate,
            eventEndDate: selectedDate,
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

        axios.get(`${API_URL}numOfRows=${param.numOfRow}&pageNo=${param.pageNo}&arrange=A&serviceKey=${API_KEY}&eventStartDate=${param.eventStartDate}&eventEndDate=${param.eventEndDate}`)
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

    useEffect(() => {
        fetchFestivals();
        console.log("calendarParam : ", param);
    }, [param]);

    // 페이지 스크롤 이벤트 리스너 추가
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hasMore, isLoading]);


    const handleBookmarkClick = (festivalContentid) => {
        ClickBookmark(festivalContentid, bmlist, setBmlist, userid, setData);
    };

    return (
        <div>
            <Calendar onChange={handleDateChange} />
            {/* 축제 목록 */}
            {festivals.length > 0 && (
                <div>
                    <h3>축제 목록</h3>
                    <ul className="festival-list">
                        {festivals.map((festival) => {
                            const isBookmarked = bmlist.includes(festival.contentid); // 즐겨찾기 여부 확인

                            return (
                                <li className={`festival-${festival.contentid}`} key={festival.contentid}
                                    onClick={() => {
                                        navigate(`/festival/${festival.contentid}`, { state: { API_KEY, activeTab } })
                                    }}>
                                    <p className="festival-title">{festival.title}</p>
                                    <div className="festival-list-area">
                                        {festival.firstimage ? (
                                            <img className="festival-img" src={festival.firstimage} alt={festival.title} style={{ width: "100%", height: "150px" }} />
                                        ) : (
                                            <img className="festival-img" src={noimage} alt="no-image" style={{ width: "100%", height: "150px" }} />
                                        )}
                                        <div className="festival-small-info">
                                            <div>
                                                <p className="festival-addr">{festival.addr1.split(" ")[0]} {festival.addr1.split(" ")[1]}</p>
                                                <p className="festival-date">{festival.eventstartdate} ~ {festival.eventenddate}</p>
                                            </div>
                                            <div onClick={(e) => {
                                                e.stopPropagation();  // 클릭 이벤트가 목록 아이템에 전파되지 않도록 방지
                                                handleBookmarkClick(festival.contentid); // 북마크 클릭 처리
                                            }}>
                                                <img className="bookmark-img" src={isBookmarked ? bookmark : nobookmark} alt="bookmark" />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
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
