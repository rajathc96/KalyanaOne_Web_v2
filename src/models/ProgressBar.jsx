
function ProgressBar({ percentage }) {
    return (
        <div className="progress-bar">
            <div className="grey-line"></div>
            <div
                className="progress-gradient"
                style={{ '--p': `${percentage}%` }}
            />
        </div>
    )
}

export default ProgressBar;