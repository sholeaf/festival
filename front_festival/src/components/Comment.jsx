import React, { useState } from "react";
import Button from "./Button";

const Comment = ({ reply, loginUser, modifyReply, modifyReplyOk, removeReply }) => {
    // 댓글 수정 여부 상태 (수정 중이면 true, 아니면 false)
    const [isEditing, setIsEditing] = useState(false);

    // 수정 버튼 클릭 시 수정 모드로 전환
    const handleModifyClick = () => {
        setIsEditing(true); // 수정 모드 시작
        modifyReply(reply.replynum); // 실제 수정 로직을 호출
    };

    // 수정 완료 버튼 클릭 시 수정 완료 처리
    const handleModifyCompleteClick = () => {
        setIsEditing(false); // 수정 모드 종료
        modifyReplyOk(reply.replynum); // 수정 완료 처리 로직을 호출
    };

    return (
        <div className="comment">
            <p>{reply.replycontent}</p>
            {reply.userid === loginUser && (
                <>
                    {/* 수정 버튼: 수정 모드가 아니면 보임 */}
                    {!isEditing && (
                        <Button
                            value="수정"
                            className={"nrmodify btn"}
                            onClick={handleModifyClick}
                        />
                    )}

                    {/* 수정 완료 버튼: 수정 모드일 때 보임 */}
                    {isEditing && (
                        <Button
                            value="수정 완료"
                            className={"nrfinish btn hdd"}
                            onClick={handleModifyCompleteClick}
                        />
                    )}

                    {/* 삭제 버튼 */}
                    <Button
                        value="삭제"
                        className={"nrremove btn"}
                        onClick={(e) => { removeReply(e, reply.replynum); }}
                    />
                </>
            )}
        </div>
    );
};

export default Comment;
