import React, { useState } from 'react';
import axios from 'axios';

const NoteModal = ({ isOpen, closeModal, toUserId, loginUser }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 쪽지 전송 함수
    const handleSendNote = () => {
        if (!title || !content) {
            alert('제목과 내용을 모두 입력해주세요!');
            return;
        }

        const noteData = {
            title,
            content,
            receiveuser: toUserId,  // 게시판에서 클릭한 유저의 ID
            senduser: loginUser,    // 로그인된 유저의 ID
        };

        axios.post('/api/note/send', noteData)
            .then((response) => {
                alert('쪽지가 전송되었습니다!');
                closeModal();  // 모달 닫기
            })
            .catch((error) => {
                console.error('쪽지 전송 중 오류:', error);
                alert('쪽지 전송에 실패했습니다.');
            });
    };

    return (
        isOpen && (
            <div className="notesend-modal-overlay" onClick={closeModal}>
                <div className="notesend-modal-background"></div>
                <div className="notesend-modal-content" onClick={(e) => e.stopPropagation()}>
                    <span className="notesend-close" onClick={closeModal}>&times;</span>
                    <h2>쪽지 보내기</h2>
                    <div className="notesend-row">
                        <div>받는 사람</div>
                        <div>
                            <input 
                                type="text" 
                                className="notesend-note-input" 
                                value={toUserId} 
                                readOnly 
                            />
                        </div>
                    </div>
                    <div className="notesend-row">
                        <div>보내는 사람</div>
                        <div>
                            <input 
                                type="text" 
                                className="notesend-note-input" 
                                value={loginUser} 
                                readOnly 
                            />
                        </div>
                    </div>
                    <div className="notesend-row">
                        <div>제목</div>
                        <div>
                            <input
                                type="text"
                                className="notesend-note-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목을 입력하세요"
                            />
                        </div>
                    </div>
                    <div className="notesend-row">
                        <div>내용</div>
                        <div>
                            <textarea
                                className="notesend-note-textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="내용을 입력하세요"
                                rows="5"
                            />
                        </div>
                    </div>
                    <div className="notesend-row">
                        <div className="notesend-sendms">
                            <button 
                                type="button" 
                                className="notesend-btn notesend-btn-send" 
                                onClick={handleSendNote}
                            >
                                보내기
                            </button>
                        </div>
                    </div>
                    <table className="notesend-notegetbtn_area">
                        <tbody>
                            <tr>
                                <td>
                                    <button className="notesend-btn notesend-msbtn" onClick={closeModal}>취소</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    );
};

export default NoteModal;
