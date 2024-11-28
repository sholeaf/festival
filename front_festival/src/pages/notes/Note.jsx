import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../components/Paginstion";
import Modal from "../../components/Modal";

const Note = ({ loginUser , cri, setCri, key}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isReplyMode, setIsReplyMode] = useState(false); // 답장 모드 상태
    const [content, setContent] = useState(''); // 답장 내용
    const [note, setNote] = useState();
    const [pageMaker, setPageMaker] = useState({
        startpage: 1,
        endPage: 1,
        relEnd: 1,
        total: 0,
        prev: false,
        next: false,
        cri: null
    });
    useEffect(() => {
        setCri((prevCri) => ({
            ...prevCri,
            pagenum: 1 // key 변경 시 pagenum을 1로 설정
        }));
    }, [key]);
    useEffect(() => {
        // cri나 다른 props가 변경될 때마다 다시 데이터를 로딩하는 로직을 넣을 수 있습니다.
        console.log("Note 컴포넌트가 리렌더링되었습니다. cri:", cri);
        // 데이터를 새로 가져오는 API 호출 등을 수행할 수 있습니다.
    }, [cri]); 
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal 열림 상태
    const [modalData, setModalData] = useState(null); // Modal에 표시할 데이터
    // Pagination에 동적으로 URL 전달
    const dynamicUrl = location.pathname;
    // 삭제 요청 함수
    const removenote = (notenum) => {
        axios.delete(`/api/note/${notenum}`)
            .then((resp) => {
                alert(`${resp.data}번글 삭제 완료`);
                // 삭제 후 note 목록에서 해당 항목 제거
                setNote(prevNote => ({
                    ...prevNote,
                    note: prevNote.note.filter(note => note.notenum !== notenum)
                }));
                closeModal(); // 삭제 후 Modal 닫기
            })
            .catch((error) => {
                console.error("삭제 오류:", error);
                alert("삭제에 실패했습니다. 다시 시도해주세요.");
            });
    };

    // noteList 생성 부분에서 체크박스에 대한 상태 관리
    const [checkedItems, setCheckedItems] = useState([]); // 선택된 항목들을 저장

    const handleCheckboxChange = (notenum) => {
        setCheckedItems((prevCheckedItems) => {
            if (prevCheckedItems.includes(notenum)) {
                return prevCheckedItems.filter(item => item !== notenum); // 이미 선택된 항목은 제거
            } else {
                return [...prevCheckedItems, notenum]; // 선택되지 않은 항목은 추가
            }
        });
    };

    const handleDeleteSelected = () => {
        if (checkedItems.length === 0) {
            alert("삭제할 항목을 선택해주세요.");
            return;
        }
        // 선택된 쪽지들 삭제 요청
        axios.delete('/api/note/delete-multiple', { data: { notenums: checkedItems } })
            .then((response) => {
                alert("선택된 쪽지가 삭제되었습니다.");
                // 삭제 후 리스트 갱신
                setCheckedItems([]); // 체크된 항목 초기화
                setCri((prevCri) => ({
                    ...prevCri,  // 기존 cri 값을 유지하면서 새로 요청을 트리거
                    pagenum: 1
                }));
            })
            .catch((error) => {
                console.error("삭제 중 오류 발생:", error);
                alert("삭제에 실패했습니다. 다시 시도해주세요.");
            });
    };

    const [chars, setChars] = useState([]);
    useEffect(() => {
        if (!note) {
            const text = "로딩중...";
            const splitText = text.split("").map((char, index) => ({
                char,
                delay: index * 0.5
            }));
            setChars(splitText);
        }
    }, [note]);

    // 페이지 로드 시 API 호출
    useEffect(() => {
        const temp = {
            pagenum: cri.pagenum,
            amount: 5,
            startrow: cri.startrow,
            
        };
        axios.get(`/api/note/list/${cri.pagenum}`, { params: temp })
            .then((resp) => {
                setNote(resp.data);
                setPageMaker(resp.data.pageMaker);
            })
            .catch((error) => {
                console.error("쪽지 API 호출 중 오류:", error);
            });
    }, [cri]);

    useEffect(() => {
        if (location.state) {
            setCri(location.state);
        }
    }, [location.state]);

    const filteredNotes = note?.note?.filter((item) => item.receiveuser === loginUser);

    // 데이터 로딩이 완료되지 않으면 로딩 텍스트 표시
    if (!note) {
        return (
            <div className="loading-text">
                {chars.map((item, index) => (
                    <span
                        key={index}
                        style={{
                            animationDelay: `${item.delay}s`,
                        }}
                    >
                        {item.char}
                    </span>
                ))}
            </div>
        );
    }

    const list = note?.note;

    // Modal 열기 (API 요청 없이 list에서 데이터를 찾음)
    const openModal = (notenum) => {
        const selectedNote = list.find(note => note.notenum === notenum); // notenum으로 찾기
        if (selectedNote) {
            setModalData(selectedNote);  // 찾은 데이터를 modalData에 설정
            setIsModalOpen(true);        // Modal 열기
            setIsReplyMode(false);
        }
    };

    // Modal 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);  // Modal 닫을 때 데이터 초기화
    };

    // 답장하기
    const handleReply = () => {
        if (modalData) {
            setModalData({
                ...modalData,
                title: `Re: ${modalData.title}`,  // 제목에 "Re:" 붙이기
                content: '',  // 내용은 비워두고 답장 작성 가능하게 만들기
                receiveuser: modalData.senduser,  // 받는 사람
                senduser: loginUser
            });
            setIsReplyMode(true);  // 답장 모드 활성화
        }
    };

    // 답장 전송
    const handleSubmitReply = () => {
        if (modalData) {
            const replyData = {
                title: modalData.title,  // 제목
                content: modalData.content,  // 내용
                receiveuser: modalData.receiveuser,  // 받는 사람
                senduser: modalData.senduser, // 로그인된 사용자를 보내는 사람으로 설정
            };

            axios.post('/api/note/receive', replyData)
                .then((resp) => {
                    console.log("답장 전송 성공:", resp);
                    alert("답장이 성공적으로 전송되었습니다.");
                    closeModal();  // 답장 후 Modal 닫기
                })
                .catch((error) => {
                    console.error("답장 전송 중 오류:", error);
                    alert("답장 전송에 실패했습니다.");
                });
        }
        setIsReplyMode(false);  // 답장 전송 후 답장 모드 종료
    };

    const noteList = filteredNotes?.length > 0 ? filteredNotes.map(note => (
        <div className="row noterow" key={note.notenum}>
            <div>
                <a
                    className="nget"
                    onClick={() => openModal(note.notenum)} // 클릭 시 Modal 열기
                >
                    {note.title}
                </a>
            </div>
            <div>{note.senduser}</div>
            <div>{note.regdate}</div>
            <div>
                <input
                    type="checkbox"
                    id={`notecheck-${note.notenum}`}
                    checked={checkedItems.includes(note.notenum)}
                    onChange={() => handleCheckboxChange(note.notenum)}  // 체크박스 클릭 시 처리
                />
            </div>
        </div>
    )) : (
        <div className="row no-list" key={-1}>
            <div>받은 쪽지가 없습니다.</div>
        </div>
    );

    return (
        <>
        
            <div className="notewrap notelist" id="rpwrap">
                <div className="notetitle">쪽지리스트</div>
                <div className="notelist notetable">
                    <div className="thead tac notethead">
                        <div className="row noterow">
                            <div>제목</div>
                            <div>보낸사람</div>
                            <div>날짜</div>
                            <div>선택</div>
                        </div>
                    </div>
                    <div className="tbody notetbody">
                        {noteList}
                    </div>
                    <hr />
                    <div className="noteselectbtn">
                        <button onClick={handleDeleteSelected}>선택삭제</button>
                    </div>
                    <Pagination pageMaker={pageMaker} url={dynamicUrl} />
                </div>
            </div>
            
            {/* Modal 창 */}
            {isModalOpen && modalData && (
                <Modal isOpen={isModalOpen} closeModal={closeModal}  >
                    <div id="wrap" className="noteget" style={{ width: "500px" }}>
                        <form id="notegetForm" name="notegetForm">
                            <div className="ntable notegettable">
                                <div className="row notegetrow">
                                    <div>제목</div>
                                    <div>
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="제목을 입력하세요"
                                            value={modalData.title || ''}
                                            onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                                            readOnly={!isReplyMode}  // 답장 모드일 때만 수정 가능
                                        />
                                    </div>
                                </div>
                                <div className="row notegetrow">
                                    <div>To</div>
                                    <div>
                                        <input
                                            type="text"
                                            name="receiveuser"
                                            value={modalData.receiveuser || ''}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="row notegetrow">
                                    <div>From</div>
                                    <div className="sendms">
                                        {isReplyMode ? (
                                            <button
                                                type="button"
                                                value="답장 전송"
                                                className="btn"
                                                onClick={handleSubmitReply}  // 답장 전송
                                            >
                                                답장 전송
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                value="답장하기"
                                                className="btn"
                                                onClick={handleReply}  // 답장하기
                                            >
                                                답장하기
                                            </button>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="senduser"
                                            value={modalData.senduser || ''}
                                            readOnly={!isReplyMode}  // 답장 모드일 때만 수정 가능
                                        />
                                    </div>
                                </div>
                                <div className="row notegetrow">
                                    <div>내용</div>
                                    <div>
                                        <textarea
                                            name="noticecontent"
                                            value={modalData.content || ''}
                                            onChange={(e) => setModalData({ ...modalData, content: e.target.value })}
                                            readOnly={!isReplyMode}  // 답장 모드일 때만 수정 가능
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                        <table className="notegetbtn_area">
                            <tbody>
                                <tr>
                                    <td>
                                        <button value="삭제" className="btn msbtn" onClick={() => removenote(modalData.notenum)}>삭제</button>
                                        <button className="btn msbtn" onClick={closeModal}>목록</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}
            
        </>
    );

};

export default Note;
