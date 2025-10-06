import express from 'express';
import cors from 'cors';
import { questions } from './index.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


app.get('/questions', (req, res) => {
    res.json(questions);
});

// Ajouter une nouvelle question
app.post('/questions', (req, res) => {
    const { question, options, correctAnswer } = req.body;
    if (
        !question ||
        !Array.isArray(options) ||
        options.length < 2 ||
        typeof correctAnswer !== 'string' ||
        !options.includes(correctAnswer)
    ) {
        return res.status(400).json({
            error: 'Payload invalide. Requis: { question: string, options: string[], correctAnswer: string (doit être dans options) }'
        });
    }

    const nextId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    const newQuestion = { id: nextId, question, options, correctAnswer };
    questions.push(newQuestion);
    return res.status(201).json(newQuestion);
});


app.post('/answer', (req, res) => {
    const { id, answer } = req.body;
    
    const question = questions.find(q => q.id === id);
    if (!question) {
        return res.status(404).json({ error: 'Question non trouvée' });
    }
    
    const isCorrect = question.correctAnswer === answer;
    res.json({ correct: isCorrect });
});


app.post('/submit-all', (req, res) => {
    const answers = req.body.answers; 
    const results = [];
    let score = 0;

    answers.forEach(({ id, answer }) => {
        const question = questions.find(q => q.id === id);
        if (question) {
            const isCorrect = question.correctAnswer === answer;
            if (isCorrect) score++;
            results.push({
                id,
                question: question.question,
                userAnswer: answer,
                correctAnswer: question.correctAnswer,
                isCorrect
            });
        }
    });

    res.json({
        score,
        total: questions.length,
        results
    });
});

app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});