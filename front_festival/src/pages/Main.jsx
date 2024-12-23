import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../layout/Header";
import Slider from "react-slick";
import TodayDate from "../hooks/TodayDate";
import { useNavigate } from "react-router-dom";
import noimage from "../assets/images/no-image.jpg";
import mainimg from "../assets/images/mainimg.jpg"
import section1 from "../assets/images/section1.jpg"
import Footer from "../layout/Footer";

const Main = () => {
    const API_KEY = 'ADUQciriMbR143Lb7A8xLWVlcBZQXuCPTgGmksfopPBMwtmLQhkIrGlBror4PosCYnLLVqtrEnZz1T%2F4N9atVg%3D%3D';

    const [loginUser, setLoginUser] = useState([]);
    const [festivals, setFestivals] = useState([]);
    const [bmlist, setBmlist] = useState([]);
    const [bestReview, setBestReview] = useState([]);
    const [bookmark, setBookmark] = useState([]);
    const [notice, setNotice] = useState([]);

    const { noHyphen, hyphen, lastMonth } = TodayDate();
    const navigate = useNavigate();
    const activeTab = 'calendar';

    const reviewimg = `/api/file/thumbnail?systemname=`;

    const settings = {
        dots: false,
        infinite: true,
        speed: 1100,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    const extractTextFromHTML = (htmlString, maxLength) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const textContent = doc.body.textContent || doc.body.innerText;

        // 텍스트 길이를 maxLength로 제한
        if (textContent.length > maxLength) {
            return textContent.slice(0, maxLength) + '...'; // 길이를 넘으면 '...'을 추가
        }
        return textContent;
    };

    useEffect(() => {
        axios.get(`/api/user/loginCheck`)
            .then((resp) => {
                setLoginUser(resp.data);
                console.log("yes");
            })
            .catch((error) => {
                console.error("로그인 상태 확인 오류: ", error);
            });
    }, []);

    useEffect(() => {
        if (loginUser == '' || loginUser == null) {
            return;
        }

        axios.get(`/api/bookmark/checkBookmark`, { params: { userid: loginUser } })
            .then((resp) => {
                setBmlist(resp.data);
                console.log("요청 하기! : ", resp.data);
            })
            .catch((error) => {
                console.log("bmlist 오류", error);
            });
    }, [loginUser]);

    useEffect(() => {
        axios.get('/api/main/bestboard', { params: { lastMonth: lastMonth, toDay: hyphen } })
            .then((resp) => {
                setBestReview(resp.data);
                console.log(resp.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    console.log(hyphen)
    useEffect(() => {
        axios.get('/api/main/bookmark', { params: { loginUser } })
            .then((resp) => {
                setBookmark(resp.data);
                console.log(resp.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [loginUser])

    useEffect(() => {
        axios.get('/api/main/notice')
            .then((resp) => {
                setNotice(resp.data);
                console.log(resp.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    console.log(bmlist)
    useEffect(() => {
        axios.get(`https://apis.data.go.kr/B551011/KorService1/searchFestival1?MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&serviceKey=${API_KEY}&numOfRows=12&pageNo=1&arrange=A&eventStartDate=${noHyphen}`)
            .then((resp) => {
                const data = resp.data.response.body.items.item || [];
                setFestivals(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [noHyphen]);

    return (
        <>
            <Header></Header>
            <img src={mainimg} className="main-img" />
            <div className="main-area" id="wrap">
                <div className="main-festival-list">
                    <h2>현재 진행중인 축제</h2>
                    <div className="more-btn btn" onClick={() => {
                        navigate('/festival');
                    }}>more+</div>
                    <Slider className="main-slide" {...settings}>
                        {festivals.map((festival, index) => {
                            return (
                                <div className="main-festival detail-img" key={index}>
                                    <img src={festival.firstimage || noimage} alt={`Slide ${index + 1}`} onClick={() => {
                                        navigate(`/festival/${festival.contentid}`, { state: { API_KEY, activeTab, bmlist } })
                                    }} />
                                    <div>
                                        <div className="main-festival-info">
                                            {festival.title}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                </div>

                <div className="main-festival-review">
                    <h2>Best 후기</h2>
                    <div className="more-btn btn" onClick={() => {
                        navigate('/board/list');
                    }}>more+</div>
                    {bestReview.length > 0 ? (
                        bestReview.map((review, index) => (
                            <div className="review-item" key={index} onClick={() => { navigate(`/board/${review.boardnum}`) }}>
                                <div>제목 :{review.boardtitle}</div>
                                <div>내용 :{extractTextFromHTML(review.boardcontent, 103) == "" || null ? "글이 없는 게시글" : extractTextFromHTML(review.boardcontent, 103)}</div>
                                <div>{review.userid}</div>
                                <div>좋아요 {review.likeCnt}</div>
                                {review.titleImage == null ? <img src={noimage} style={{ width: "90px", height: "90px" }} /> : <img src={reviewimg + review.titleImage} style={{ width: "90px", height: "90px" }} />}
                            </div>
                        ))
                    ) : (
                        <p className="waring-text">Best 후기가 없습니다.</p>
                    )}
                </div>

                <div className="main-festival-bookmark">
                    <h2>즐겨찾기 목록</h2>
                    <div className="more-btn btn" onClick={() => {
                        navigate('/user/mypage');
                    }}>more+</div>
                    <ul className="festival-list">
                        {loginUser == null || loginUser === "" ? (
                            <p className="waring-text"> 로그인 후 즐겨찾기를 확인할 수 있습니다.</p>
                        ) : (
                            bookmark.length > 0 ? (
                                bookmark.slice(0, 4).map((item, index) => (
                                    <li key={index} className="bookmark-item" onClick={() => {
                                        navigate(`/festival/${item.contentid}`, { state: { API_KEY, activeTab, bmlist } })
                                    }}>
                                        <p className="festival-title">{item.title}</p>
                                        {item.image ? (
                                            <img className="festival-img bookmark-img" src={item.image} alt={item.title} style={{ width: "100%", height: "200px" }} />
                                        ) : (
                                            <img className="festival-img bookmar-img" src={noimage} alt="no-image" style={{ width: "100%", height: "200px" }} />
                                        )}
                                    </li>
                                ))
                            ) : (
                                <p className="waring-text">즐겨찾기가 없습니다.</p>
                            )
                        )}
                    </ul>
                </div>

                <div className="main-festival-notice">
                    <h2>공지사항</h2>
                    <div className="more-btn btn" onClick={() => {
                        navigate('/notice/list');
                    }}>more+</div>
                    <div className="main-notice">
                        <table>
                            <thead>
                                <tr className="notice-item">
                                    <td>번호</td>
                                    <td>제목</td>
                                    <td>작성자</td>
                                    <td>등록일</td>
                                </tr>
                            </thead>
                            <tbody>
                                {notice.length > 0 ? (
                                    notice.map((noticeItem, index) => (
                                        <tr className="notice-item" key={index} onClick={()=>{
                                            navigate(`/notice/${noticeItem.noticenum}`)
                                        }}>
                                            <td>{noticeItem.noticenum}</td>
                                            <td>{noticeItem.noticetitle}</td>
                                            <td>{noticeItem.userid}</td>
                                            <td>{noticeItem.noticeregdate}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <p className="waring-text">공지사항이 없습니다.</p>
                                )}
                            </tbody>
                        </table>
                        <img src={section1} style={{width:"500px",height:"350px"}}/>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
};

export default Main;
