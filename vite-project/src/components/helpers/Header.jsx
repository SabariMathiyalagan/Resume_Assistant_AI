function Header({title, description}) {
    return (
        <>
        <h1 className="display-4 fw-bold mb-3">{title}</h1>
            <p className="lead text-muted">
            {description}
            </p>
            </>
    )
}
export default Header;