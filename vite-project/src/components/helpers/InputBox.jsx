function InputBox({name, required, type, rows, placeholder, value, onChange}) {
    return (
        <div className="mb-3">
        <label className="form-label">
            {name}
        </label>
        <textarea
            className="form-control"
            rows={rows}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
        />
        </div>
      
    )

}
export default InputBox;