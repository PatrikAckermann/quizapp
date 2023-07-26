import React from 'react'
import './App.css'

// Der Index der aktuellen Frage. Wird gebraucht um zum richtig Ort zu scrollen.
var currentQuestion = 0

export default function App() {
  var [score, setScore] = React.useState(0)
  var [wrong, setWrong] = React.useState(0)
  var [questions, setQuestions] = React.useState([])

  // Lädt die Fragen von einer API und fügt sie zum questions state hinzu.
  function updateQuestions() {

    // Zuerst werden die Antworten gemischt und dann zum Array hinzugefügt.
    function addToQuestions(newQuestions) {
      newQuestions = newQuestions.map(question => {return {...question, answers: [{answer: question.incorrectAnswers[0], correct: false}, {answer: question.incorrectAnswers[1], correct: false}, {answer: question.incorrectAnswers[2], correct: false}, {answer: question.correctAnswer, correct: true}].sort((a, b) => 0.5 - Math.random())}})
      setQuestions(oldQuestions => {
        newQuestions = oldQuestions.concat(newQuestions)
        return newQuestions
      })
    }

    // Mit Fetch werden die Fragen von der API angefragt.
    fetch("https://the-trivia-api.com/api/questions").then(res => res.json()).then(res => addToQuestions(res))
  }

  // Lädt die ersten 10 Fragen nach dem Laden der Seite.
  React.useEffect(() => {
    updateQuestions()
    var questionsDiv = document.getElementById("Questions")
    questionsDiv.scrollTo({left: 0, behavior: "smooth"})
  }, [])

  // Löst einen Scroll aus, wenn die Fragen aktualisiert wurden.
  React.useEffect(() => {
    if (![0, 10].includes(questions.length)) {
      scroll()
    }
  }, [questions])

  // Speichert den Highscore.
  React.useEffect(() => {
    if (score > localStorage.getItem("highscore")) {
      localStorage.setItem("highscore", score)
    }
  }, [score])

  // Scrollt nach rechts zur nächsten Frage. Wenn es keine Fragen mehr hat, werden neue geladen.
  function scroll() {
    if (currentQuestion === questions.length) {
      updateQuestions()
      return
    }
    var questionsDiv = document.getElementById("Questions")
    questionsDiv.scrollTo({left: currentQuestion * window.innerWidth, behavior: "smooth"})
  }

  return (
    <div className="Questions" id="Questions">
      {questions === null ? <div className="QuestionContainer"><div className="Question"><h1>Loading...</h1></div></div> : <>
        {questions.map(question => {
          return <Question scroll={scroll} setScore={setScore} setWrong={setWrong} key={question.question} category={question.category} question={question.question} answers={question.answers}/>
      })}
      </>}
      <div className="Scores">
        <p>Score: {score} / {Math.round(100 / (score + wrong) * score)}%</p>
        <p>Highscore: {localStorage.getItem("highscore")}</p>
      </div>
    </div>
  )
}

function Question(props) {
  var [isAnswerClicked, setIsAnswerClicked] = React.useState(false)

  // Wird ausgeführt, wenn eine Antwort angeklickt wird.
  function answerClicked(correct) {
    currentQuestion += 1
    setIsAnswerClicked(true)
    setTimeout(props.scroll, 1000)
    if (correct) {
      props.setScore(oldScore => oldScore + 1)
    } else {
      props.setWrong(oldWrong => oldWrong + 1)
    }
  }

  return (
    <div className="QuestionContainer">
      <div className="Question">
        <p>Category: {props.category}</p>
        <h1>{props.question}</h1>
        <div className="Answers">
          {props.answers.map(answer => <AnswerButton answered={isAnswerClicked} isAnswerClicked={isAnswerClicked} key={answer.answer} text={answer.answer} correct={answer.correct} onClick={() => answerClicked(answer.correct)}/>)}
        </div>
      </div>
    </div>
  )
}

function AnswerButton(props) {
  var [isCorrect, setIsCorrect] = React.useState()

  // Wird ausgeführt, wenn eine Antwort angeklickt wird.
  function click() {
    if (props.isAnswerClicked === false) {
      props.onClick()
      setIsCorrect(props.correct)
    }
  }

  var className = "AnswerButton "
  if (props.correct && props.answered) {
    className += "ButtonGreen"
  } else if (isCorrect !== undefined && !props.isCorrect) {
    className += "ButtonRed"
  }

  return (
    <div onClick={() => click()} className={className}>
      <p>{props.text}</p>
    </div>
  )
}