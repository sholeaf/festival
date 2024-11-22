import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Header from "../layout/Header";
import { useNavigate } from "react-router-dom";

const Main = () => {
    const [showTitle, setShowTitle] = useState(true);

    const navigate = useNavigate();

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
            <Header></Header>
            <div className="main-logout">
                {showTitle && (
                    <div className="main-title">모두의 축제</div>
                )}
                <div className="main-section">
                    <img className="main-text-img" src="" />
                    <div className="main-text1">국내 모든 축제들을 찾아보세요!</div>
                    <div className="main-text2">다양한 축제들이 준비되어있어요!</div>
                    <div className="go-page-btn">바로가기</div>
                </div>
                <div className="main-section">
                    <img className="main-text-img" src="" />
                    <div className="main-text1">축제를 다녀온 많은 사람들의 후기!</div>
                    <div className="main-text2">축제 후기를 작성해서 사람들에게 알려주세요!</div>
                    <div className="go-page-btn">바로가기</div>
                </div>
                <div className="main-section">
                    <img className="main-text-img" src="" />
                    <div className="main-text1">축제 내용 변경 등 중요사항을 공지해드립니다!</div>
                    <div className="go-page-btn">바로가기</div>
                </div>

            </div>
        </>
    );
}

export default Main;