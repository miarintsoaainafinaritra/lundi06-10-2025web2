const Results = ({ results, score, total, onReset }) => {
    return (
        <div className="results">
            <h2>Résultats du Quiz</h2>
            <div className="score">
                Votre score : <strong>{score}/{total}</strong> 
                ({Math.round((score / total) * 100)}%)
            </div>
            
            <div className="detailed-results">
                {results.map((result, index) => (
                    <div key={result.id} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                        <h4>Question {index + 1}: {result.question}</h4>
                        <p>Votre réponse: {result.userAnswer}</p>
                        <p>Réponse correcte: {result.correctAnswer}</p>
                        <p className="status">
                            {result.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                        </p>
                    </div>
                ))}
            </div>
            
            <button onClick={onReset} className="reset-btn">
                Recommencer le quiz
            </button>
        </div>
    );
};

export default Results;