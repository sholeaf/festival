import { useEffect, useState } from "react";

const TodayDate = () => {
    const [today, setToday] = useState(new Date());

    useEffect(() => {
        setToday(new Date());
    }, []);

    // 'hyphen'을 'yyyy-mm-dd' 형식으로 변환
    const hyphen = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');

    const noHyphen = today.getFullYear() + (today.getMonth() + 1).toString().padStart(2, '0') + today.getDate().toString().padStart(2, '0');

    // 한 달 전 날짜 구하기
    const lastMonthDate = new Date(today);
    lastMonthDate.setMonth(today.getMonth() - 1);

    const lastMonth = lastMonthDate.getFullYear() + '-' + (lastMonthDate.getMonth() + 1).toString().padStart(2, '0') + '-' + lastMonthDate.getDate().toString().padStart(2, '0');


    const todayDate = { hyphen: hyphen, noHyphen: noHyphen, lastMonth: lastMonth };

    return todayDate;
}

export default TodayDate;
