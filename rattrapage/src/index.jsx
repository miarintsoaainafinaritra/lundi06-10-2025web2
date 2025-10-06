const API_BASE = 'http://localhost:3001';

export const api = {
    
    async getQuestions() {
        const response = await fetch(`${API_BASE}/questions`);
        return await response.json();
    },

   
    async checkAnswer(id, answer) {
        const response = await fetch(`${API_BASE}/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, answer }),
        });
        return await response.json();
    },

   
    async submitAllAnswers(answers) {
        const response = await fetch(`${API_BASE}/submit-all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answers }),
        });
        return await response.json();
    }
};