import dotenv from "dotenv";
import { Client, Intents } from 'discord.js';
import quiz from './questions.js';

dotenv.config();

// ugh so may global variables I hate this
const questionInterval = 1000 * 20; // twenty seconds?
const quizTimeout = 1000 * 2;
const capitalsChannelId = "890280563322273843"
let intervalId;
let currentQuestion = {};
let isQuizActive = false;
let countryCapitalAnswerType;
let questionArray = [];
let capitalsChannel;
let isQuestionAnswered = true;





const client = new Client({ intents: [
  Intents.FLAGS.GUILDS, 
  Intents.FLAGS.GUILD_MESSAGES, 
  Intents.FLAGS.DIRECT_MESSAGES, 
  Intents.FLAGS.DIRECT_MESSAGE_TYPING
] });

// startQuiz = (msg) => {
//   intervalId = null;
//   msg.channel.send("Starting the quiz.");
//   let questionArray = await quiz.initialize();
//   setTimeout(() => {
//     currentQuestion = quiz.getRandomQuestion(questionArray);
//     msg.channel.send(currentQuestion.text);
//     intervalId = setInterval(() => {
//       currentQuestion = quiz.getRandomQuestion(questionArray);
//       msg.channel.send(currentQuestion.text);
//     }, questionInterval);
//   });
// }

// msg to get the channel, probably better way to do this
const handleInterval = (msg) => {
  setTimeout(() => {
    //currentQuestion = quiz.getRandomQuestion(questionArray);
    //msg.channel.send(currentQuestion.text);
    intervalId = setInterval(() => {
      if (!isQuestionAnswered && currentQuestion) {
        quizTimeout = 1000 * 2; // wait two seconds after answer... does this work?
        msg.channel.send(`The answer was: **${currentQuestion[countryCapitalAnswerType]}**`);
        setQuizInfoToOriginalState(); // does THIS work?
      }
      isQuestionAnswered = false;
      // ohhhhh the poorly written code
      currentQuestion = quiz.getRandomQuestion(questionArray);
      while (!currentQuestion.capital) {
        // skip the countries with no capitals from the file
        currentQuestion = quiz.getRandomQuestion(questionArray);
      }
      countryCapitalAnswerType = Math.floor(Math.random() * 2) === 1 ? "capital" : "country";
      let questionText = `**${currentQuestion.capital}** is the capital of what country?`;
      if (countryCapitalAnswerType === "capital") {
        questionText = `What is the capital of **${currentQuestion.country}**?`;
      }
      msg.channel.send(questionText);
    }, questionInterval);
  }, quizTimeout);
}

const startQuiz = async (msg) => {
  quizTimeout = 0;
  isQuizActive = true;
  intervalId = null;
  msg.channel.send("Countries/Capitals quiz starting! Use /stop to end the quiz.");
  questionArray = await quiz.initialize();
  handleInterval(msg);
}

const restartQuiz = async () => {
  clearInterval(intervalId);
  intervalId = null;
  handleInterval(msg);
}

const setQuizInfoToOriginalState = (questionAnswered = false) => {
  isQuestionAnswered = questionAnswered;
  clearInterval(intervalId);
  intervalId = null;
  quizTimeout = 1000 * 2; // wait two seconds after answer
  handleInterval(msg);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.channels.fetch("889544129636343809")
    //.then(channel => console.log(channel));
    .then(channel => {
      capitalsChannel = channel;
      //capitalsChannel.send(`We're in the '${capitalsChannel.name}' channel.`);
      capitalsChannel.send("Bot is back online!");
    });
});

client.on("messageCreate", async msg => {
  let messageText = msg.content.toLowerCase();
  try {
    if (msg.author.bot) return;
    if (messageText.startsWith("/ping")) {
      msg.channel.send(`pong, ${msg.author}`);
      return;
    }
    if (messageText.includes("stupid bot") || messageText.includes("bots are stupid")) {
      msg.reply(`Rude.`);
      return;
    }
    if (messageText.startsWith("/quiz") && !isQuizActive) {
      startQuiz(msg); // contains the channel to send the questions to?
      return;
    }
    if (messageText.startsWith("/stop") && intervalId) {
      clearInterval(intervalId);
      isQuizActive = false;
      msg.channel.send("Ending the quiz. Use /play to start again.");
      return;
    }
    if (messageText.startsWith("/help")) {
      msg.reply("Start the quiz with /quiz, stop the quiz with /stop");
      return;
    }
    if (currentQuestion && quiz.isCorrectAnswerCityCountry(currentQuestion[countryCapitalAnswerType], messageText)) {
      msg.channel.send(`Correct! The answer is ${currentQuestion[countryCapitalAnswerType]}.`);
      setQuizInfoToOriginalState();
    }
  }
  catch(e) {
    console.log("something went wrong ", e);
  }
});

client.login(process.env.CLIENT_TOKEN);