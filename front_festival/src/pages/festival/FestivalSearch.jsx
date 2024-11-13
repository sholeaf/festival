import Dropdown from "../../components/Dropdown";

const FestivalSearch = ({ setParam, param, API_URL, API_KEY, noHyphen }) => {
    
    const year = (noHyphen+'').substring(0,5);
    const searchType1 = { 
        "서울": "1", "인천": "2", "대전": "3", "대구": "4", "광주": "5", "부산": "6", "울산": "7", "세종": "8", "경기": "31", "강원": "32", "충북": "33",
        "충남": "34", "경북": "35", "경남": "36", "전북": "37", "전남": "38",
        "제주": "39"
    }
    //searchType2는 월 year+ searchType2.value + if(searchType 의 값이 01,03,05,07,08,10,12 이라면 const day = 31 아니면 30 )

    
    const changeType = (value) => {
        const changedParam = { ...param, areaCode: value}
        setParam(changedParam);
    }

    console.log('drop box select areacode:',param.areaCode)

    return (
        <>
            <div>축제 검색</div>
            <Dropdown list={searchType1} name={"type"} width={100} value={param.areaCode} onChange={changeType}></Dropdown>
        </>
    );

}

export default FestivalSearch;