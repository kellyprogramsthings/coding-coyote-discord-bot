import Prisma from '@prisma/client';

const { PrismaClient } = Prisma;
const prisma = new PrismaClient();

let recentQuestions = [];

const sanitizeString = (theString) => {
  return theString
    .toLowerCase()
    .trim()
    .replace(/[-'.,?"!\s]/g, '');
}

const truncateRecentQuestions = (wantedLengthOfArray) => {
  // -1 because we're about to add one more in the other function
  let newQuestionArray = [...recentQuestions];
  while (newQuestionArray.length > (wantedLengthOfArray - 1)) {
    newQuestionArray.shift();
  }
  return newQuestionArray;
}

const pushQuestionToRecentAnswers = (question) => {
  let newQuestionArray = truncateRecentQuestions();
  newQuestionArray.push(question);
  return newQuestionArray;
}

const loadQuestions = async () => {
  return await prisma.question.findMany();
}

const loadCountriesCapitals = async () => {
  return await prisma.countryCapital.findMany();
}

const getRandomQuestion = (questionArray) => {
  const randomNumber = Math.floor(Math.random() * questionArray.length);
  if (recentQuestions.includes(questionArray[randomNumber])) {
    getRandomQuestion(questionArray, recentQuestions);
  }
  return questionArray[randomNumber];
}

const isCorrectAnswer = (question, answerText) => {
  return question.answers.contains(answerText);
}

const isCorrectAnswerCityCountry = (questionAnswer, answerText) => {
  // don't bother if one or both is blank
  if (!questionAnswer || !answerText) { return; }
  return sanitizeString(questionAnswer) === sanitizeString(answerText);
}

const initialize = async () => {
  //return await loadQuestions();
  return await loadCountriesCapitals();
}

const question = {
  loadQuestions,
  getRandomQuestion,
  initialize,
  isCorrectAnswer,
  isCorrectAnswerCityCountry
};

export default question;