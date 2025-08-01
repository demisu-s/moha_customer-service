export const Spinner = () => {
    return (
        <div className="h-80 flex justify-center items-center">
            <div
                className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-main-color border-r-transparent align-[-0.125em] text-main-color motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span>
            </div>
        </div>
    )
}
