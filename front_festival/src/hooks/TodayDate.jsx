import { useEffect, useState } from "react";

const TodayDate = () => {
    const [today, setToday] = useState(new Date());

    useEffect(() => {
        setToday(new Date());
    }, []);
    
    const hyphen = today.toLocaleDateString();
    const noHyphen = today.getFullYear() + (today.getMonth()+1).toString().padStart(2,'0') + today.getDate().toString().padStart(2,'0');

    const todayDate = {hyphen : hyphen, noHyphen : noHyphen};

    return todayDate;
}

export default TodayDate;