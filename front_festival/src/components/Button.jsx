const Button = (className, id , value, onClick) => {
    return <input type="button" className={className} id={id} value={value} onClick={onClick}></input>
}
export default Button;