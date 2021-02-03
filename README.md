# Spaced Repetition

* Live App: https://spaced-repetition-lime-two.vercel.app/register
* Database URL: https://stark-temple-37903.herokuapp.com/api
* Client Repo: https://github.com/uimm258/Spaced-Repetition-Client
* Server Repo: https://github.com/uimm258/Spaced-Repetition-api

An application for learning Chinese words using spaced repetition as the quizzing method. Implements a linked list and sorting algorithm.

# Stack Used

* Client: HTML, CSS, React.Js
* Server: Express and Node.Js

# API Endpoint
* /language Endpoint
   * GET 
      * /language: Get user's language and language words.
      * /language/head: Get next word (first word in list) to quiz user, the word's correct/incorrect counts, and the user's total score.
   * POST 
      * /language/guess: Send user's guess, and get back result, answer, next word, next word's correct/incorrect counts, and user's total score.
* /user Endpoint
   * POST
      * /user: Create new user, given a username, password, and name.
* /auth Endpoint
   * POST
      * /auth/token: Send user's username and password, and get JWT.
      * /auth/put: Refresh user's JWT.