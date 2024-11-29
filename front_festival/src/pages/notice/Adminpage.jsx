import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../layout/Header";
import Note from "../notes/Note";
import ReplyReport from "../admin/ReplyReport";
import BoardReport from "../admin/BoardReport";

const Adminpage = () => {
    const location = useLocation();
    const [viewMode, setViewMode] = useState('쪽지리스트');  // 초기 화면을 '쪽지리스트'로 설정
    const [trigger, setTrigger] = useState(false);
    const [loginUser, setLoginUser] =useState("");
    // 상태 변화를 통해 리렌더링 트리거
    const forceRerender = () => {
        setTrigger(prev => !prev); // 상태를 변경하여 리렌더링을 유도
    };
    useEffect(() => {
        console.log("Adminpage location.state:", location.state);
    }, []);

    // 로그인 체크
    useEffect(() => {
        axios.get(`/api/user/loginCheck`)
            .then((resp) => {
                setLoginUser(resp.data);
            })
            .catch((error) => {
                console.error("로그인 상태 확인 오류: ", error);
            });
    }, []);

    const [cri, setCri] = useState({
        pagenum: 1,
        amount: 5,
        type: "a",
        keyword: "",
        startrow: 0
    });
    //탑버튼 눌렀을때
    const [key, setKey] = useState(0);
    const topButtonClick = (viewMode) => {
        setViewMode(viewMode);
        setCri(
            prevCri => ({
                ...prevCri,
                pagenum: 1
            })
        )
        setKey(prevKey => prevKey + 1);
    }
    useEffect(() => {
        setCri(prevCri => ({
            ...prevCri,
            pagenum: 1  // viewMode가 변경되면 pagenum을 1로 초기화
        }));
    }, [viewMode]);

    return (
        <>
            <Header />
            <div className="adminWrap">
                <div className="admin-top">
                    <button onClick={() => topButtonClick('쪽지리스트')}>쪽지리스트</button>
                    <button onClick={() => topButtonClick('게시글리스트')}>게시글리스트</button>
                    <button onClick={() => topButtonClick('댓글리스트')}>댓글리스트</button>
                </div>

                <div className="content">
                    {viewMode === '쪽지리스트' && (
                        <div className="noteList">
                            <Note loginUser={loginUser} viewMode={viewMode} cri={cri} setCri={setCri} key={key} />
                        </div>
                    )}

                    {viewMode === '게시글리스트' && (
                        <div className="boardlist">
                           <BoardReport loginUser={loginUser} viewMode={viewMode} cri={cri} setCri={setCri} key={key}></BoardReport>

                        </div>
                    )}

                    {viewMode === '댓글리스트' && (
                        <div className="replylist">
                            <ReplyReport loginUser={loginUser} viewMode={viewMode} cri={cri} setCri={setCri} key={key}></ReplyReport>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default Adminpage;
