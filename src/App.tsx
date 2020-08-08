import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Title from "./Components/Title";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import { fetchQuizQuestions, getCategory } from "./Components/Api/API";
// Components
import QuestionCard from "./Components/Questions/QuestionsCard";
// types
import { QuestionState, CategoryType } from "./Components/Api/API";
// Styles
import "./App.css";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  root1: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const App = () => {
  let percentage = 0;
  const [category, setCategory] = useState(0);
  let [categories, setCetogories] = useState<CategoryType[]>([]);
  const [Tquestions, setTquestions] = useState(10);
  const [qtype, setQtype] = useState("multiple");
  const [qdifficulty, setQdifficulty] = useState("");
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const classes = useStyles();

  useEffect(() => {
    const fetchCategory = async () => {
      const lecategory: CategoryType[] = await getCategory();
      setCetogories(lecategory);
    };
    fetchCategory();
    console.log(fetchCategory());
  }, []);

  const callQuiz = async () => {
    setGameOver(false);

    const Qquestions: QuestionState[] = await fetchQuizQuestions(
      Tquestions,
      category,
      qdifficulty,
      qtype
    );

    setQuestions(Qquestions);
  };

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(parseInt(e.target.value));
  };

  if (!questions.length)
    return (
      <>
        <Title />

        <div className={classes.root}>
          <CssBaseline />
          <Container maxWidth="xl">
            <div
              style={{
                height: "100%",
                paddingTop: "5%",
              }}
            >
              {gameOver && (
                <form
                  className="initialForm"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3} className="Gcategory">
                      <div className="category">
                        <select
                          style={{
                            padding: "10px",
                            width: "280px",
                            margin: "10px",
                          }}
                          required
                          name="Category"
                          onChange={(e) => handleCategory(e)}
                        >
                          <option style={{ fontWeight: 500 }} value="0">
                            Random
                          </option>
                          {categories.map((lecategory) => (
                            <option
                              style={{ fontWeight: 500 }}
                              value={lecategory.id}
                              key={lecategory.id}
                            >
                              {lecategory.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} className="Gtype">
                      <div className="type">
                        <select
                          style={{
                            padding: "10px",
                            width: "280px",
                            margin: "10px",
                          }}
                          required
                          name="type"
                          onChange={(e) => setQtype(e.target.value)}
                        >
                          <option value="multiple">Multiple</option>
                          <option value="boolean">True False</option>
                        </select>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} className="Gdifficulty">
                      <div className="difficulty">
                        <select
                          style={{
                            padding: "10px",
                            width: "280px",
                            margin: "10px",
                          }}
                          required
                          name="type"
                          onChange={(e) => setQdifficulty(e.target.value)}
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} className="GTquestions">
                      <div className="Tquestions">
                        <input
                          style={{
                            padding: "10px",
                            width: "280px",
                            margin: "10px",
                          }}
                          type="number"
                          value={Tquestions}
                          id="textField"
                          onChange={(e) =>
                            setTquestions(parseInt(e.target.value))
                          }
                        />
                      </div>
                    </Grid>
                    {gameOver || userAnswers.length === Tquestions ? (
                      <Button
                        style={{
                          margin: "0px 0px 0px 50%",
                          borderRadius: "0px",
                        }}
                        variant="contained"
                        color="primary"
                        className="start"
                        onClick={() => callQuiz()}
                      >
                        Start
                      </Button>
                    ) : null}
                  </Grid>
                </form>
              )}
            </div>
          </Container>
        </div>
      </>
    );

  const checkAnswer = (e: any) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;

      const correct = questions[number].correct_answer === answer;

      if (correct) setScore((prev) => prev + 1);

      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const handleFinish = () => {
    setScore(0);

    setQuestions([]);
    setCategory(0);
    setQtype("multiple");
    setUserAnswers([]);
  };

  const nextQuestion = () => {
    const nextQ = number + 1;

    if (nextQ === Tquestions) {
      setGameOver(true);
    } else {
      setNumber(nextQ);
    }
  };

  return (
    <>
      <div className="wrapper">
        {!gameOver ? (
          <>
            <div className="container">
              <Grid container spacing={3} justify="center">
                <Grid item xs={12} md={3} component={Card} className="card">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Category: {questions[number].category}
                    </Typography>
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={3} component={Card} className="card">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Question: {number + 1}/{Tquestions}
                    </Typography>
                  </CardContent>
                </Grid>
              </Grid>
            </div>
          </>
        ) : null}

        {!gameOver ? (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={Tquestions}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          ></QuestionCard>
        ) : null}

        {!gameOver && userAnswers.length === number + 1 && (
          <Button
            style={{ margin: "0px 0px 0px 50%", borderRadius: "0px" }}
            variant="contained"
            color="primary"
            className="next"
            onClick={nextQuestion}
          >
            {userAnswers.length === Tquestions ? "Finish" : "Next Question"}
          </Button>
        )}
        {gameOver && userAnswers.length === Tquestions && (
          <div className="container">
            <Card>
              <CardContent>
                <Typography
                  style={{ marginBottom: "20px" }}
                  variant="h6"
                  gutterBottom
                >
                  Quiz completed.
                </Typography>
                <Typography style={{ marginBottom: "20px" }} variant="h3">
                  {(percentage = (score * 100) / Tquestions)}%{"  "}
                  {percentage >= 70 ? "Congratulations! 🚀 " : "Soory "}
                </Typography>
                <Typography
                  style={{ marginBottom: "20px" }}
                  variant="h5"
                  gutterBottom
                >
                  Your Final score is {score}/{Tquestions}
                </Typography>
              </CardContent>
              <Button
                style={{ margin: "0px 0px 30px 30%", borderRadius: "0px" }}
                variant="contained"
                color="secondary"
                onClick={() => handleFinish()}
              >
                Try Again
              </Button>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
