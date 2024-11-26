import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dropdown from "../../components/Dropdown";
import FestivalParam from "../../hooks/FestivalParam";
import noimage from "../../assets/images/no-image.jpg";
import nobookmark from "../../assets/images/nobookmark.png"
import bookmark from "../../assets/images/bookmark.png"
import ClickBookmark from "../../hooks/ClickBookmark";

const FestivalSearch = (props) => {
    const { API_URL, API_KEY, activeTab, userid, bmlist, setBmlist, sampleData, setSampleData, noHyphen } = props;
    const [festivals, setFestivals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { param, setParam } = FestivalParam("");
    const navigate = useNavigate();

    const [temp, setTemp] = useState({
        areaCode: '',
        eventStartDate: '',
        eventEndDate: '',
    });

    const year = (noHyphen + '').substring(0, 4);
    const getLastDateOfMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const searchType1 = {
        "전체 지역": "", "서울": "1", "인천": "2", "대전": "3", "대구": "4", "광주": "5",
        "부산": "6", "울산": "7", "세종": "8", "경기": "31", "강원": "32", "충북": "33",
        "충남": "34", "경북": "35", "경남": "36", "전북": "37", "전남": "38", "제주": "39"
    };

    const searchType2 = {
        "날짜 선택": "",
        "1월": "01", "2월": "02", "3월": "03", "4월": "04",
        "5월": "05", "6월": "06", "7월": "07", "8월": "08",
        "9월": "09", "10월": "10", "11월": "11", "12월": "12"
    };

    const changeType1 = (value) => {
        setTemp({ ...temp, areaCode: value });
    };

    const changeType2 = (value) => {
        const month = parseInt(value, 10);
        const lastDate = getLastDateOfMonth(parseInt(year, 10), month);
        const eventStartDate = year + value + "01";
        const eventEndDate = year + value + lastDate + "";

        setTemp({ ...temp, eventStartDate: eventStartDate, eventEndDate: eventEndDate });
    };

    const search = (e) => {
        e.preventDefault();
        if (temp.eventStartDate.length < 8) {
            alert("날짜를 선택해야 검색이 가능합니다!");
            return;
        }
        setParam({
            ...param, pageNo: 1,
            areaCode: temp.areaCode,
            eventStartDate: temp.eventStartDate,
            eventEndDate: temp.eventEndDate
        });

        setFestivals([]);  // 기존 축제 목록 초기화
        setHasMore(true);  // 더 많은 데이터가 있을 수 있으므로 초기화
    };

    const fetchFestivals = () => {
        if (isLoading || param.eventStartDate === "") return;

        setIsLoading(true);

        axios
            .get(`${API_URL}numOfRows=${param.numOfRow}&pageNo=${param.pageNo}&arrange=A&serviceKey=${API_KEY}&eventStartDate=${param.eventStartDate}&eventEndDate=${param.eventEndDate}&areaCode=${param.areaCode}`)
            .then((resp) => {
                const festivalsData = resp.data.response.body.items.item || [];
                setFestivals((prevFestivals) => [
                    ...prevFestivals,
                    ...festivalsData, // 기존 데이터에 새로운 데이터를 추가
                ]);

                setIsLoading(false);
                if (festivalsData.length < param.numOfRow) {
                    setHasMore(false);  // 더 이상 데이터가 없으면
                }
            })
            .catch((error) => {
                console.error('Error fetching festivals:', error);
                setIsLoading(false);
            });
    };

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasMore && !isLoading) {
            setParam(prev => ({
                ...prev,
                pageNo: prev.pageNo + 1,  // 페이지 번호 증가
            }));
        }
    };

    const handleBookmarkClick = (festivalContentid,festivalTitle,festivalImage) => {
        ClickBookmark(festivalContentid, festivalTitle, festivalImage, bmlist, setBmlist, userid, setSampleData);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isLoading, hasMore]);

    useEffect(() => {
        fetchFestivals();
        console.log("param : ", param)
    }, [param]);

    return (
        <>
            <div>축제 검색</div>
            <div className="festival-search-area">
                <Dropdown list={searchType1} name={"type1"} width={100} value={param.areaCode} onChange={changeType1}></Dropdown>
                <Dropdown list={searchType2} name={"type2"} width={100} value={param.eventStartDate ? "날짜 선택" : ""} onChange={changeType2}></Dropdown>
                <div className="search-btn" onClick={search}>검 색</div>
            </div>

            {param.eventStartDate === "" && <p>날짜를 선택해주세요.</p>}

            {festivals.length > 0 && (
                <div>
                    <h3>축제 목록</h3>
                    <ul className="festival-list">
                        {festivals.map((festival) => {
                            const isBookmarked = bmlist.includes(festival.contentid); // 즐겨찾기 여부 계산

                            return (
                                <li className={`festiva-${festival.contentid}`} key={festival.contentid}
                                    onClick={() => {
                                        navigate(`/festival/${festival.contentid}`, { state: { API_KEY, activeTab, bmlist } })
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
                                                e.stopPropagation();  // 클릭 이벤트 전파 방지
                                                handleBookmarkClick(festival.contentid,festival.title,festival.firstimage);  // 즐겨찾기 추가/삭제
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

            {festivals.length === 0 && param.eventStartDate !== "" && !isLoading && <p>해당 지역에 축제가 없습니다.</p>}
            {isLoading && <p>Loading...</p>}
            {!hasMore && <p>더 이상 축제가 없습니다.</p>}
        </>
    );
};

export default FestivalSearch;
