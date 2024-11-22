import { useEffect, useRef, useState } from "react";
import backgroundimg from "../assets/images/backgroundimg.gif";

const MainLogout = () => {
    const [showTitle, setShowTitle] = useState(true);

    const textRef1 = useRef(null);
    const textRef2 = useRef(null);
    const textRef3 = useRef(null);
    const textRef4 = useRef(null);
    const textRef5 = useRef(null);

    // 페이지가 로드되면 애니메이션 후 main-title을 숨기기
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTitle(false);  // 2초 후에 main-title을 숨깁니다.
        }, 5000);  // 애니메이션 지속 시간과 동일한 시간 (2초)

        return () => clearTimeout(timer); // cleanup
    }, []);

    return (
        <>
            <div className="main-logout">
                {showTitle && (
                    <div className="main-title">모두의 축제</div>
                )}
                <div className="main-section">
                    <div className="main-text">국내 모든 축제들을 찾아보세요!</div>
                    <img className="main-text-img" src="" />
                    <div className="go-page-btn">바로가기</div>
                </div>

            </div>
        </>
    );
}

export default MainLogout;
