const ClickModal = ({ isModalOpen, children, closeModal, modalStyle }) => {
    console.log("Modal isModalOpen: ", isModalOpen);  // isOpen 상태를 확인하기 위한 로그

    if (!isModalOpen) {
        return null;  // isOpen이 false면 모달을 렌더링하지 않음
    }

    return (
        <div style={{ 
            visibility: isModalOpen ? "visible" : "hidden", 
            opacity: isModalOpen ? 1 : 0, // opacity 0일 때 투명하게 처리
            transition: "opacity 0.3s ease",  // 애니메이션 추가 가능
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            zIndex: 10,
            overflow: "auto"
        }} onClick={closeModal}>
            <div 
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // 정확히 중앙에 위치시킴
                    maxWidth: "100%",
                    maxHeight: "80%",
                    overflowY: "auto",
                    backgroundColor: "white",
                    zIndex: 11,
                    textAlign: "center",
                    ...modalStyle
                }} 
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="children scrollbar">{children}</div>
            </div>
        </div>
    );
};
export default ClickModal;