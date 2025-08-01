// api/_utils/quizAssembler.js
const { shuffleArray } = require('./arrayUtils');

const getDifficultyRange = (difficulty) => {
    switch (difficulty) {
        case 'easy': return { min: 10, max: 13 };
        case 'medium': return { min: 14, max: 17 };
        case 'hard': return { min: 18, max: 20 };
        default: return { min: 0, max: 100 }; // 'mixed'
    }
};

const fetchQuestionsForSubject = async (tx, subjectKey, totalNeeded, difficultyRange) => {
    let subjectQuestions = [];
    const gatheredQuestionIds = new Set();
    const priorityOrder = ['9th', '8th', '7th'];

    for (const grade of priorityOrder) {
        if (subjectQuestions.length >= totalNeeded) break;

        const needed = totalNeeded - subjectQuestions.length;
        const { rows } = await tx.execute({
            sql: `
                SELECT q.* FROM questions q
                JOIN quiz_topics t ON q.topicId = t.id
                WHERE t.subject = ? 
                AND t.class = ?
                AND q.difficulty BETWEEN ? AND ?;
            `,
            args: [subjectKey, grade, difficultyRange.min, difficultyRange.max]
        });

        const newQuestions = rows.filter(q => !gatheredQuestionIds.has(q.id));
        const questionsToAdd = shuffleArray(newQuestions).slice(0, needed);
        subjectQuestions.push(...questionsToAdd);
        questionsToAdd.forEach(q => gatheredQuestionIds.add(q.id));
    }
    return subjectQuestions;
};

const assembleHomiBhabhaPracticeTest = async (tx, params) => {
    const { quizClass, difficulty, questionComposition } = params;
    const difficultyRange = getDifficultyRange(difficulty);

    const [physicsQs, chemistryQs, biologyQs, gkQs] = await Promise.all([
        fetchQuestionsForSubject(tx, 'physics', questionComposition.physics.total, difficultyRange),
        fetchQuestionsForSubject(tx, 'chemistry', questionComposition.chemistry.total, difficultyRange),
        fetchQuestionsForSubject(tx, 'biology', questionComposition.biology.total, difficultyRange),
        fetchQuestionsForSubject(tx, 'gk', questionComposition.gk.total, difficultyRange) // GK doesn't use class priority
    ]);

    const finalQuestionList = [...physicsQs, ...chemistryQs, ...biologyQs, ...gkQs];
    const totalRequired = Object.values(questionComposition).reduce((acc, rule) => acc + rule.total, 0);

    if (finalQuestionList.length < totalRequired) {
        throw new Error(`Could not assemble the practice test. Only found ${finalQuestionList.length} of ${totalRequired} required questions.`);
    }
    
    return shuffleArray(finalQuestionList);
};


module.exports = { assembleHomiBhabhaPracticeTest };