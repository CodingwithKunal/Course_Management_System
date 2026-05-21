export function ProgressBar({progress}) {
    const progessPercentage = {
        "NOT_STARTED": 0,
        "IN_PROGRESS": 50,
        "COMPLETED": 100,
        "Default": 0
    }

    const colors = {
        "NOT_STARTED": "bg-gray-300",
        "IN_PROGRESS": "bg-yellow-500",
        "COMPLETED": "bg-green-600",
        "Default": "bg-gray-300"
    }
    return (
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
                className={`h-4 rounded-full transition-all duration-500 ${colors[progress] || colors["Default"]}`}
                style={{ width: `${progessPercentage[progress] || progessPercentage["Default"]}%` }}
            ></div>
        </div>
    )
}