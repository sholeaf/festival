import { useEffect, useState } from "react";
import axios from "axios";
import festival_map from "../../assets/images/festivalImg/festival_map.png";
import noimage from "../../assets/images/no-image.jpg";
import { useNavigate } from "react-router-dom";


const FestivalMap = ({ API_URL, API_KEY, noHyphen, param, setParam, activeTab}) => {
    const [festivals, setFestivals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);  
    const [hasMore, setHasMore] = useState(true); 
    const [selectedArea, setSelectedArea] = useState(null);  
    const navigate = useNavigate();

    const areas = [
        { id: '1', name: '서울' },
        { id: '2', name: '인천' },
        { id: '3', name: '대전' },
        { id: '4', name: '대구' },
        { id: '5', name: '광주' },
        { id: '6', name: '부산' },
        { id: '7', name: '울산' },
        { id: '8', name: '세종' },
        { id: '31', name: '경기' },
        { id: '32', name: '강원' },
        { id: '33', name: '충북' },
        { id: '34', name: '충남' },
        { id: '35', name: '경북' },
        { id: '36', name: '경남' },
        { id: '37', name: '전북' },
        { id: '38', name: '전남' },
        { id: '39', name: '제주' }
    ];

    // 지역 클릭 시 처리 함수
    const handleAreaChange = (areaId) => {
        console.log("지역코드 : ", areaId);
        setFestivals([]);
        setHasMore(true);
        setSelectedArea(areaId);
        setParam((prev) => ({
            ...prev,
            areaCode: areaId,
            eventStartDate: noHyphen,
            eventEndDate: noHyphen,
            pageNo: 1,
        }));

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // 축제 데이터를 API에서 가져오는 함수
    const fetchFestivals = () => {
        if (isLoading || !param.areaCode) return;  // 로딩 중이면 API 요청을 방지하고, areaCode가 없으면 요청하지 않음
        setIsLoading(true);

        axios
            .get(`${API_URL}numOfRows=${param.numOfRow}&pageNo=${param.pageNo}&arrange=A&serviceKey=${API_KEY}&eventStartDate=${param.eventStartDate}&eventEndDate=${param.eventenddate}&areaCode=${param.areaCode}`)
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

    // 페이지 번호가 변경될 때마다 축제 데이터를 요청
    useEffect(() => {
        fetchFestivals();
        console.log("map.param : ", param);
    }, [param]);  // param이 변경될 때마다 effect 실행

    // 스크롤이 페이지 하단에 도달했을 때 추가 데이터를 요청하는 함수
    const handleScroll = () => {
        const bottom = document.documentElement.scrollHeight === document.documentElement.scrollTop + window.innerHeight;
        if (bottom && !isLoading && hasMore) {
            setParam((prev) => ({
                ...prev,
                pageNo: prev.pageNo + 1,  // 페이지 번호를 증가시켜 추가 데이터를 요청
            }));
        }
    };

    // 스크롤 이벤트 리스너를 등록하는 effect
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        // Cleanup: 컴포넌트가 언마운트될 때 스크롤 이벤트 리스너 제거
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isLoading, hasMore]);  // isLoading과 hasMore가 변경될 때마다

    return (
        <>
            <div className="festival_map_area">
                <img className="festival_map" src={festival_map} alt="festival_map" />
                {/* 지역 목록을 map()으로 렌더링 */}
                <div className="festival_select_area">
                    {areas.map((area) => (
                        <div
                            key={area.id}
                            className={`area-${area.id} festival_map_detail ${selectedArea === area.id ? 'selected' : ''}`}
                            onClick={() => handleAreaChange(area.id)}  // 지역 클릭 시 handleAreaChange 호출
                        >
                            {area.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* 지역이 선택되지 않은 경우 */}
            {!selectedArea && <p>지역을 선택해주세요</p>}

            {festivals.length > 0 && (
                <div>
                    <h3>축제 목록</h3>
                    <ul className="festival-list">
                        {festivals.map((festival) => (
                            <li className={`festiva-${festival.contentid}`} key={festival.contentid}
                            onClick={()=>{
                                navigate(`/festival/${festival.contentid}`,{state:{API_KEY, activeTab}})
                            }}>
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
            {festivals.length === 0 && selectedArea && !isLoading && <p>해당 지역에 축제가 없습니다.</p>}

            {/* 로딩 상태 */}
            {isLoading && <p>Loading...</p>}

            {/* 더 이상 데이터가 없을 때 */}
            {!hasMore && <p>더 이상 축제가 없습니다.</p>}
        </>
    );
};

export default FestivalMap;
