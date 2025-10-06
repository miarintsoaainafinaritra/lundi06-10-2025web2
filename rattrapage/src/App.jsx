import { useState, useEffect } from 'react';
import { api } from './service/api';
import './App.css';
import Results from './service/Result.jsx';
import Question from './service/Question.jsx';

function App() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({});

    
    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            const data = await api.getQuestions();
            setQuestions(data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du chargement des questions:', error);
            setLoading(false);
        }
    };

    const handleAnswerChange = async (questionId, answer) => {
       
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));

      
        try {
            const res = await api.checkAnswer(questionId, answer);
            setFeedback(prev => ({
                ...prev,
                [questionId]: !!res?.correct
            }));
        } catch (e) {
            console.error('Erreur de vérification de la réponse:', e);
            setFeedback(prev => ({
                ...prev,
                [questionId]: undefined
            }));
        }
    };

    const handleSubmit = async () => {
       
        const unansweredQuestions = questions.filter(q => !answers[q.id]);
        if (unansweredQuestions.length > 0) {
            alert('Veuillez répondre à toutes les questions avant de soumettre.');
            return;
        }

        setSubmitting(true);
        try {
           
            const checkPromises = questions.map(async (q) => {
                const userAnswer = answers[q.id];
                const res = await api.checkAnswer(q.id, userAnswer);
                return {
                    id: q.id,
                    question: q.question,
                    userAnswer,
                    correctAnswer: q.correctAnswer,
                    isCorrect: !!res?.correct
                };
            });

            const results = await Promise.all(checkPromises);
            const score = results.reduce((acc, r) => acc + (r.isCorrect ? 1 : 0), 0);

            setResults({
                score,
                total: questions.length,
                results
            });
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            alert('Erreur lors de la soumission des réponses');
        }
        setSubmitting(false);
    };

    const handleReset = () => {
        setAnswers({});
        setResults(null);
    };

    if (loading) {
        return <div className="loading">Chargement des questions...</div>;
    }

    if (results) {
        return <Results 
            results={results.results} 
            score={results.score} 
            total={results.total}
            onReset={handleReset}
        />;
    }

    return (
        <div className="app">
            <header>
                <h1>Quiz App</h1>
                <p>Testez vos connaissances !</p>
            </header>

            <main>
                <div className="questions-container">
                    {questions.map((question, index) => (
                        <Question
                            key={question.id}
                            index={index}
                            question={question}
                            userAnswer={answers[question.id]}
                            feedback={feedback[question.id]}
                            onAnswerChange={handleAnswerChange}
                        />
                    ))}
                </div>

                <div className="submit-section">
                    <button 
                        onClick={handleSubmit} 
                        disabled={submitting}
                        className="submit-btn"
                    >
                        {submitting ? 'Soumission...' : 'Soumettre mes réponses'}
                    </button>
                    
                    <div className="progress">
                        Répondu: {Object.keys(answers).length}/{questions.length}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
