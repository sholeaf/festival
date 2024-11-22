const Modal = ({isOpen, children, closeModal, modalStyle }) => {
    return (
        <div style={{display:isOpen ? "block":"none"}} onClick={closeModal}>
           <div style={{
            position:"fixed",
            top:0,
            left:0,
            width:"100vw",
            height:"100vh",
            backgroundColor:"rgba(0,0,0,0.35)",
            zIndex:10,
           }}></div>
           <div style={{
            position:"absolute",
            top:"50%",
            left:"50%",
            transform:"translate(-50%,-50%)",
            maxWidth:"100%",
            maxHeight:"80%",
            overflowY:"auto",
            backgroundColor:"white",
            zIndex:11,
            borderRadius:"30px",
            textAlign:"center",
            ...modalStyle
           }}  onClick={(e) => e.stopPropagation()} >
            <div className="children">{children}</div>
           </div>
        </div>
    )
}
export default Modal;