const NoteModal = ({ isOpen, closeModal })=>{
    if(!isOpen) return null;

    return(
        <div className="modal-overlay">
      <div className="modal-content">
        <h2>Note Modal</h2>
        <p>This is the modal content</p>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
    );
};