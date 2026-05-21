function EmptyState({ message, cta, oncta }) {
    return (
        <>
            <div className="  d-flex flex-column items-center justify-center p-5">
            
                <h3>{message}</h3> 
                {cta && <button className="bg-amber-100 px-2 rounded-2xl mt-5 text-black cursor-pointer" onClick={oncta}> 
                    {cta}
                </button>}

            </div>


        </>
    )
}
export default EmptyState;