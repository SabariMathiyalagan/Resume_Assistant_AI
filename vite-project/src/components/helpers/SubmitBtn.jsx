function SubmitBtn({loading, disabled, name}) {
    return (
        <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={disabled}
      >
        {loading ? 'Processing...' : name}
      </button>
    )
}
export default SubmitBtn;