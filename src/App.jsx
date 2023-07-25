import { useState } from 'react'
import './App.css'

export default function App() {
  return (
    <div>
      <Question question="This is a test question" answers={[{answer: "This is false", correct: false}, {answer: "This is false", correct: false}, {answer: "This is right", correct: true}, {answer: "This is false", correct: false}]}/>
    </div>
  )
}

function Question(props) {
  function answerClicked(correct) {
    console.log(correct ? "YOU CLICKED THE CORRECT ANSWER" : "YOU CLICKED THE WRONG ANSWER")
  }

  return (
    <div className="Question">
      <h2>{props.question}</h2>
      <div className="Answers">
        {props.answers.map(answer => <AnswerButton text={answer.answer} onClick={() => answerClicked(answer.correct)}/>)}
      </div>
    </div>
  )
}

function AnswerButton(props) {
  return (
    <div onClick={props.onClick} className="AnswerButton">
      <p>{props.text}</p>
    </div>
  )
}