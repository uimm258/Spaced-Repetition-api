const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const LinkedList = require('./linked-list');

const languageRouter = express.Router();
const jsonBodyParser = express.json();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  try {
    const word = await LanguageService.getNextWord(
      req.app.get('db'),
      req.language.id,
      req.user.id
    );

    res.json(word);
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post('/guess', jsonBodyParser, async (req, res, next) => {
  let { guess } = req.body;

  if (!guess) {
    return res.status(400).json({ error: `Missing 'guess' in request body` });
  }

  let [head] = await LanguageService.getHeadNode(
    req.app.get('db'),
    req.language.head
  );
  
  const list = new LinkedList();
  list.insertFirst(head);
  let node = list.head;
  console.log('THIS IS THE NODE', node)
  while (node.value && node.value.next !== null) {
    let [word] = await LanguageService.getWord(
      req.app.get('db'),
      node.value.next
    );
    list.insertLast(word);
    node = node.next;
    console.log("This is the new node", node)
  }

  try {
    let llHead = list.head.value;
    let memVal;
    let isCorrect;
    let wordCountCorrect = llHead.correct_count;
    let wordCountIncorrect = llHead.incorrect_count;
    let { total_score } = await LanguageService.getScore(
      req.app.get('db'),
      req.user.id,
      req.language.id
    );

    if (guess !== llHead.translation.toLowerCase()) {
      memVal = 1; 
      isCorrect = false; 
      wordCountIncorrect = llHead.incorrect_count + 1;
    } else {
      memVal = llHead.memory_value * 2; 
      isCorrect = true;
      wordCountCorrect = llHead.correct_count + 1;
      total_score++;
    }

    let moved = llHead;
    list.removeHead();
    list.insertAt(moved, memVal);

    let currNode = list.head;
    while (currNode.next != null) {
      await LanguageService.updateNext(
        req.app.get('db'),
        req.language.id,
        currNode.value.id,
        currNode.next.value.id
      );
      currNode = currNode.next;
    }

    await LanguageService.updateWord(
      req.app.get('db'),
      req.language.id,
      moved.id,
      memVal,
      wordCountCorrect,
      wordCountIncorrect
    );

    await LanguageService.updateHead(
      req.app.get('db'),
      req.language.id,
      list.head.value.id 
    );

    await LanguageService.updateTotalScore(
      req.app.get('db'),
      req.language.id,
      req.user.id,
      total_score
    );

    res.status(200).json({
      nextWord: list.head.value.original,
      wordCorrectCount: list.head.value.correct_count,
      wordIncorrectCount: list.head.value.incorrect_count,
      totalScore: total_score,
      answer: moved.translation,
      isCorrect: isCorrect,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;
