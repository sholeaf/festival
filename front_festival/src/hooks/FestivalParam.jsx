import { useState } from "react";

const FestivalParam = (noHyphen) => {
    const [param, setParam] = useState({
        numOfRow: 20,
        pageNo: 1,
        eventStartDate: noHyphen,
        eventEndDate: noHyphen,
        areaCode: '',
        sigunguCode: ''
    });

    return { param, setParam };
};

export default FestivalParam;