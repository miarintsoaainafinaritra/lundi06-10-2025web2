const Question = ({ index, question, userAnswer, feedback, onAnswerChange }) => {
    return (
        <div className="question-card">
            <h3>
                Question {index + 1}: {question.question}
            </h3>
            <div className="options">
                {question.options.map((option) => (
                    <label key={option} className={`option ${userAnswer === option ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={userAnswer === option}
                            onChange={() => onAnswerChange(question.id, option)}
                        />
                        {option}
                    </label>
                ))}
            </div>
            {userAnswer && (
                <div className={`feedback ${feedback === true ? 'correct' : feedback === false ? 'incorrect' : ''}`}>
                    {feedback === true && '✅ Correct'}
                    {feedback === false && '❌ Incorrect'}
                </div>
            )}
        </div>
    );
};

export default Question;
