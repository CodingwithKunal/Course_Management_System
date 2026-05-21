function LoadingButton({loading, loadingText, children, ...rest}) {
    return (
        <>
            <button disabled={loading} {...rest}
                className={`btn ${loading ? 'btn-secondary' : 'btn-primary'} ${rest.className}`}>
                {loading ? loadingText : children}
            </button>

        </>
    )
}
export default LoadingButton