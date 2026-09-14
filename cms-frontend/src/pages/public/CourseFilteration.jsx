
import { MdFilterList } from "react-icons/md";


const CourseFilteration = ({ filters, setfilters }) => {

    const level = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
    const category = [
        "Web Development",
        "App Development",
        "Data Science",
        "AI & Machine Learning",
        "Cloud Computing",
        "DevOps",
        "UI/UX Design",
        "Other",
    ]


    const  handCheckboxchange = (filterType, value) => {
        setfilters((prev) => {

            // 1. Current array ko Set mein convert karo
            const updateset = new Set(prev[filterType] || [])
            
            // 2. Agar value pehle se hai toh Delete (Uncheck), nahi toh Add (Check)
            if(updateset.has(value)){
                updateset.delete(value)
            }else{
                updateset.add(value)
            }

            return {
                ...prev,
                [filterType]:Array.from(updateset),
                page:1 // Change prr filter reset on first page 
            }
        })
    }

    const handleClearAll = () => {
        setfilters((prev)=>({
            ...prev,
            level:[],
            category:[],
            search:"",
            page:1,
        }))
    }

    return (
        <div className="w-1/6 min-w-60 rounded-2xl border border-gray-700 bg-gray-900 p-5 text-white shadow-lg">

            {/* Header */}
            <div className="mb-10 flex items-center justify-between  ">
                <h1 className="text-lg font-semibold gap-2 flex items-center "> <MdFilterList size={20} /> Filters</h1>

                <button onClick={handleClearAll} className="ext-sm text-blue-400 transition hover:text-blue-300 cursor-pointer">
                    Clear All
                </button>
            </div>

            <div className="flex flex-col gap-7">

                {/* Level */}
                <div>

                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
                        Level
                    </h2>

                    <div className="flex flex-col gap-3">
                        {level.map((lvl) => (
                            <label key={lvl} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-gray-800">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer accent-blue-500"
                                    checked={filters?.level?.includes(lvl) || false}
                                    onChange={()=>handCheckboxchange("level", lvl)}
                                    
                                />
                                <span className="text-sm text-gray-200">
                                    {lvl}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600" />

                {/* Category */}
                <div>

                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
                        Category
                    </h2>

                    <div className="flex flex-col gap-3">
                       {category.map((cate)=>(
                         <label key={cate} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-gray-800">
                            <input
                                type="checkbox"
                                className="h-4 w-4 cursor-pointer accent-blue-500"
                                checked={filters?.category?.includes(cate) || false}
                                onChange={()=>handCheckboxchange("category",cate)}
                            />
                            <span className="text-sm text-gray-200">
                                {cate}
                            </span>
                        </label>
                       ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CourseFilteration
