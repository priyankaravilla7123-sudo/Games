
import { useEffect, useRef, useState } from "react";
import "./DumbCharades.css";

const industries = [
  {
    id: "tollywood",
    name: "Tollywood Movies",
    language: "Telugu",
    emoji: "🎥",
  },
  {
    id: "bollywood",
    name: "Bollywood Movies",
    language: "Hindi",
    emoji: "🎬",
  },
];

const movieEras = [
  {
    id: "2001-2010",
    name: "Classic Favorites",
    years: "2001–2010",
    emoji: "📼",
    description: "Timeless movie favorites",
  },
  {
    id: "2011-2020",
    name: "Blockbuster Era",
    years: "2011–2020",
    emoji: "🍿",
    description: "Popular blockbuster movies",
  },
  {
    id: "2021-present",
    name: "Latest Hits",
    years: "2021–Present",
    emoji: "🔥",
    description: "New-age movie favorites",
  },
  {
    id: "surprise",
    name: "Surprise Me",
    years: "All Eras",
    emoji: "🎲",
    description: "Movies from every era",
  },
];

// Local sample database. Add more movies whenever needed.
const movieDatabase = {
  tollywood: {
    "2001-2010": [
      "Pokiri",
      "Okkadu",
      "Athadu",
      "Bommarillu",
      "Magadheera",
      "Arundhati",
      "Happy Days",
      "Ready",
      "Desamuduru",
      "Nuvvostanante Nenoddantana",
      "Jalsa",
      "Chirutha",
      "Yamadonga",
      "Vikramarkudu",
      "Aparichitudu",
    ],
    "2011-2020": [
      "Dookudu",
      "Eega",
      "Gabbar Singh",
      "Attarintiki Daredi",
      "Race Gurram",
      "Srimanthudu",
      "Baahubali",
      "Arjun Reddy",
      "Rangasthalam",
      "Ala Vaikunthapurramuloo",
      "Julayi",
      "Temper",
      "Janatha Garage",
      "Fidaa",
      "Bharat Ane Nenu",
    ],
    "2021-present": [
      "Pushpa",
      "RRR",
      "Sita Ramam",
      "DJ Tillu",
      "Karthikeya 2",
      "Hi Nanna",
      "Salaar",
      "Kalki 2898 AD",
      "Lucky Baskhar",
      "Hanu-Man",
      "Major",
      "Dasara",
      "Waltair Veerayya",
      "Devara",
      "Game Changer",
    ],
  },

  bollywood: {
    "2001-2010": [
      "Lagaan",
      "Dil Chahta Hai",
      "Devdas",
      "Munna Bhai M.B.B.S.",
      "Dhoom",
      "Veer-Zaara",
      "Rang De Basanti",
      "Taare Zameen Par",
      "3 Idiots",
      "Dabangg",
      "Koi Mil Gaya",
      "Kal Ho Naa Ho",
      "Bhool Bhulaiyaa",
      "Jab We Met",
      "Ghajini",
    ],
    "2011-2020": [
      "Zindagi Na Milegi Dobara",
      "Barfi!",
      "Chennai Express",
      "Queen",
      "PK",
      "Bajrangi Bhaijaan",
      "Dangal",
      "Raazi",
      "Gully Boy",
      "War",
      "Yeh Jawaani Hai Deewani",
      "Bajirao Mastani",
      "Sultan",
      "Andhadhun",
      "Uri: The Surgical Strike",
    ],
    "2021-present": [
      "Shershaah",
      "Gangubai Kathiawadi",
      "Brahmastra",
      "Drishyam 2",
      "Pathaan",
      "Jawan",
      "12th Fail",
      "Laapataa Ladies",
      "Stree 2",
      "Chhaava",
      "Bhool Bhulaiyaa 2",
      "Rocky Aur Rani Kii Prem Kahaani",
      "Animal",
      "Crew",
      "Sikandar",
    ],
  },
};

const heartColors = [
  "💛",
  "💚",
  "💜",
  "💙",
  "🩷",
  "❤️",
  "🧡",
  "🤎",
];

const timerOptions = [
  { label: "30 seconds", value: 0.5 },
  { label: "1 minute", value: 1 },
  { label: "2 minutes", value: 2 },
  { label: "3 minutes", value: 3 },
  { label: "5 minutes", value: 5 },
];

export default function DumbCharades({ onBack }) {
  const [industry, setIndustry] = useState("tollywood");
  const [movieEra, setMovieEra] = useState("2001-2010");
  const [teams, setTeams] = useState([]);
  const [movieName, setMovieName] = useState("");
  const [round, setRound] = useState(0);
  const [teamsLocked, setTeamsLocked] = useState(false);

  // Timer
  const [timerMinutes, setTimerMinutes] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Game states: ready -> active -> judging -> completed
  const [roundStatus, setRoundStatus] = useState("ready");
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [resultMessage, setResultMessage] = useState("");

  // Prevent duplicate scoring
  const resultSubmittedRef = useRef(false);

  // Winner popup
  const [gameFinished, setGameFinished] = useState(false);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);

  const selectedIndustry = industries.find(
    (item) => item.id === industry
  );

  const selectedMovieEra = movieEras.find(
    (era) => era.id === movieEra
  );

  const currentTeam = teams[activeTeamIndex];

  // Calculate winner
  const highestScore =
    teams.length > 0
      ? Math.max(...teams.map((team) => team.score))
      : 0;

  const winningTeams = teams.filter(
    (team) => team.score === highestScore
  );

  const isDraw = winningTeams.length > 1;

  // Countdown timer
  useEffect(() => {
    if (roundStatus !== "active") return;

    const timeoutId = setTimeout(() => {
      if (secondsLeft <= 1) {
        setSecondsLeft(0);
        setRoundStatus("judging");
      } else {
        setSecondsLeft((current) => current - 1);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [roundStatus, secondsLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Create the default two teams
  const createTeams = () => {
    setTeams([
      { id: 1, name: "Team A", members: 2, score: 0 },
      { id: 2, name: "Team B", members: 2, score: 0 },
    ]);

    setMovieName("");
    setRound(0);
    setTeamsLocked(false);
    setTimerMinutes(1);
    setSecondsLeft(0);
    setRoundStatus("ready");
    setActiveTeamIndex(0);
    setResultMessage("");
    resultSubmittedRef.current = false;

    setGameFinished(false);
    setShowWinnerPopup(false);
  };

  // Add a team (maximum 8)
  const addTeam = () => {
    if (teamsLocked || gameFinished || teams.length >= 8) return;

    const id = Math.max(0, ...teams.map((team) => team.id)) + 1;

    setTeams((currentTeams) => [
      ...currentTeams,
      {
        id,
        name: `Team ${String.fromCharCode(64 + id)}`,
        members: 2,
        score: 0,
      },
    ]);
  };

  // Delete a team before locking
  const deleteTeam = (id) => {
    if (teamsLocked || gameFinished) return;

    setTeams((currentTeams) =>
      currentTeams.filter((team) => team.id !== id)
    );
  };

  // Edit team name
  const updateTeamName = (id, name) => {
    if (teamsLocked || gameFinished) return;

    setTeams((currentTeams) =>
      currentTeams.map((team) =>
        team.id === id ? { ...team, name } : team
      )
    );
  };

  // Update member count
  const updateMembers = (id, value) => {
    if (teamsLocked || gameFinished) return;

    const count = Math.min(50, Math.max(1, Number(value) || 1));

    setTeams((currentTeams) =>
      currentTeams.map((team) =>
        team.id === id ? { ...team, members: count } : team
      )
    );
  };

  // Confirm and lock teams
  const toggleTeamsLock = () => {
    if (round > 0 || gameFinished) {
      alert("Teams cannot be changed after the game starts.");
      return;
    }

    if (teamsLocked) {
      setTeamsLocked(false);
      return;
    }

    if (teams.length < 2) {
      alert("Please keep at least two teams to play Dumb Charades.");
      return;
    }

    if (teams.some((team) => !team.name.trim())) {
      alert("Please enter a name for every team.");
      return;
    }

    setTeams((currentTeams) =>
      currentTeams.map((team) => ({
        ...team,
        name: team.name.trim(),
      }))
    );

    setTeamsLocked(true);
  };

  // Generate a movie based on the selected industry and era.
  const generateMovie = () => {
    if (
      gameFinished ||
      !teamsLocked ||
      roundStatus !== "ready" ||
      teams.length < 2
    ) {
      return;
    }

    const industryMovies = movieDatabase[industry];

    const availableMovies =
      movieEra === "surprise"
        ? Object.values(industryMovies).flat()
        : industryMovies[movieEra];

    if (!availableMovies || availableMovies.length === 0) {
      alert("No movies available for this selection yet.");
      return;
    }

    // Avoid repeating the previous movie when alternatives exist.
    const choices = availableMovies.filter(
      (movie) => movie !== movieName
    );

    const moviesToChooseFrom =
      choices.length > 0 ? choices : availableMovies;

    const nextMovie =
      moviesToChooseFrom[
        Math.floor(Math.random() * moviesToChooseFrom.length)
      ];

    resultSubmittedRef.current = false;

    setMovieName(nextMovie);
    setRound((currentRound) => currentRound + 1);
    setSecondsLeft(Math.round(timerMinutes * 60));
    setResultMessage("");
    setRoundStatus("active");
  };

  // Record the result during an active round or after time runs out.
  const recordResult = (result) => {
    if (
      gameFinished ||
      !["active", "judging"].includes(roundStatus) ||
      !currentTeam ||
      resultSubmittedRef.current
    ) {
      return;
    }

    resultSubmittedRef.current = true;

    if (result === "nailed") {
      setTeams((currentTeams) =>
        currentTeams.map((team, index) =>
          index === activeTeamIndex
            ? { ...team, score: team.score + 1 }
            : team
        )
      );

      setResultMessage(
        `🎬 ${currentTeam.name} guessed it! +1 point`
      );
    } else {
      setResultMessage(
        `❌ No point for ${currentTeam.name} this round.`
      );
    }

    // Stop the timer and finish the round immediately.
    setSecondsLeft(0);
    setRoundStatus("completed");
  };

  // Move to the next team
  const nextRound = () => {
    if (
      gameFinished ||
      roundStatus !== "completed" ||
      teams.length < 2
    ) {
      return;
    }

    setActiveTeamIndex(
      (currentIndex) => (currentIndex + 1) % teams.length
    );

    setMovieName("");
    setSecondsLeft(0);
    setResultMessage("");
    resultSubmittedRef.current = false;
    setRoundStatus("ready");
  };

  // Finish the game and announce the winner
  const finishGame = () => {
    if (teams.length < 2) {
      alert("Please create at least two teams first.");
      return;
    }

    if (!teamsLocked) {
      alert("Please confirm and lock your teams first.");
      return;
    }

    if (
      roundStatus === "active" ||
      roundStatus === "judging"
    ) {
      alert(
        "Please record the current round's result before ending the game."
      );
      return;
    }

    setGameFinished(true);
    setShowWinnerPopup(true);
  };

  // Close the winner popup and reset the game
  const restartGame = () => {
    setIndustry("tollywood");
    setMovieEra("2001-2010");
    setTeams([]);
    setMovieName("");
    setRound(0);
    setTeamsLocked(false);

    setTimerMinutes(1);
    setSecondsLeft(0);

    setRoundStatus("ready");
    setActiveTeamIndex(0);
    setResultMessage("");
    resultSubmittedRef.current = false;

    setGameFinished(false);
    setShowWinnerPopup(false);
  };

  return (
    <section className="dumb-charades-page language-screen setup-screen">
      <button
        className="back-button"
        onClick={onBack}
        disabled={gameFinished && showWinnerPopup}
      >
        ← Back to home
      </button>

      <div className="setup-card">
        <span className="eyebrow">🍿 TIME TO ACT IT OUT</span>

        <h1>Dumb Charades Game</h1>

        <p className="setup-description">
          Pick your movie industry, choose your movie era,
          gather your teams, and act it out!
        </p>

        {/* Step 1: Choose Movie Industry */}
        <h2>🎬 1. Choose Your Movie Industry</h2>

        <div className="industry-grid">
          {industries.map((item) => (
            <button
              type="button"
              key={item.id}
              disabled={
                teamsLocked || round > 0 || gameFinished
              }
              className={`industry-card ${
                industry === item.id ? "selected" : ""
              }`}
              onClick={() => {
                setIndustry(item.id);
                setMovieName("");
              }}
            >
              <span className="industry-emoji">
                {item.emoji}
              </span>

              <strong>{item.name}</strong>

              <span className="industry-language">
                {item.language}
              </span>

              {industry === item.id && (
                <span className="selected-label">
                  ✓ Selected
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Step 2: Choose Movie Era */}
        <h2 className="setup-subheading">
          🎞️ 2. Choose Your Movie Era
        </h2>

        <p className="setup-description">
          Pick your favorite period or surprise yourself
          with a movie from any era!
        </p>

        <div className="industry-grid movie-era-grid">
          {movieEras.map((era) => (
            <button
              type="button"
              key={era.id}
              disabled={
                teamsLocked || round > 0 || gameFinished
              }
              className={`industry-card movie-era-card ${
                movieEra === era.id ? "selected" : ""
              }`}
              onClick={() => {
                setMovieEra(era.id);
                setMovieName("");
              }}
            >
              <span className="industry-emoji">
                {era.emoji}
              </span>

              <strong>{era.years}</strong>

              <span className="industry-language">
                {era.name}
              </span>

              <span className="era-description">
                {era.description}
              </span>

              {movieEra === era.id && (
                <span className="selected-label">
                  ✓ Selected
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Step 3: Teams */}
        <h2 className="setup-subheading">
          👯 3. Create Your Teams
        </h2>

        {teams.length === 0 ? (
          <button
            className="primary-button full-button"
            onClick={createTeams}
          >
            ➕ Create Teams
          </button>
        ) : (
          <>
            <div className="teams-grid">
              {teams.map((team) => (
                <div className="team-card" key={team.id}>
                  <div className="team-card-top">
                    <div className="team-icon">
                      {
                        heartColors[
                          (team.id - 1) % heartColors.length
                        ]
                      }
                    </div>

                    {!teamsLocked && (
                      <button
                        className="delete-team-button"
                        onClick={() => deleteTeam(team.id)}
                        aria-label={`Delete ${team.name}`}
                        title="Delete team"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>

                  <label htmlFor={`team-name-${team.id}`}>
                    Team name
                  </label>

                  <input
                    id={`team-name-${team.id}`}
                    type="text"
                    value={team.name}
                    maxLength={30}
                    disabled={teamsLocked || gameFinished}
                    onChange={(event) =>
                      updateTeamName(team.id, event.target.value)
                    }
                  />

                  <label
                    htmlFor={`members-${team.id}`}
                    style={{ marginTop: 14 }}
                  >
                    Number of members
                  </label>

                  <input
                    id={`members-${team.id}`}
                    type="number"
                    min="1"
                    max="50"
                    value={team.members}
                    disabled={teamsLocked || gameFinished}
                    onChange={(event) =>
                      updateMembers(team.id, event.target.value)
                    }
                  />

                  <span className="member-caption">
                    👤 {team.members} player(s)
                  </span>
                </div>
              ))}
            </div>

            {!teamsLocked && teams.length < 8 && (
              <button
                className="secondary-button"
                onClick={addTeam}
                disabled={gameFinished}
              >
                ➕ Add Another Team
              </button>
            )}

            <button
              className={`lock-teams-button ${
                teamsLocked ? "locked" : ""
              }`}
              onClick={toggleTeamsLock}
              disabled={gameFinished}
            >
              {teamsLocked
                ? "🔒 Teams Locked — Unlock to Edit"
                : "Confirm & Lock Teams"}
            </button>

            {teamsLocked && (
              <p className="teams-locked-message">
                🎉 Teams confirmed! Your teams are ready to play.
              </p>
            )}
          </>
        )}

        {/* Step 4: Timer */}
        <div className="timer-section">
          <h2 className="setup-subheading">
            ⏱️ 4. Choose the Round Timer
          </h2>

          <p className="setup-description">
            Select how long each team has to act out the movie.
            The timer starts when you generate a movie name.
          </p>

          <div className="timer-controls">
            <select
              id="timer-duration"
              value={timerMinutes}
              disabled={
                gameFinished || roundStatus === "active"
              }
              onChange={(event) =>
                setTimerMinutes(Number(event.target.value))
              }
            >
              {timerOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 5: Movie and gameplay */}
        <div className="letter-section">
          <h2 className="setup-subheading">
            🎬 5. Get a Random Movie Name
          </h2>

          <p className="setup-description">
            Act out a {selectedIndustry.language} movie scene
            and let your team guess the movie name! 🎭
          </p>

          <p className="setup-description">
            Selected era: <strong>{selectedMovieEra?.years}</strong>
          </p>

          {currentTeam && (
            <div className="current-team-banner">
              🎭 Current turn:{" "}
              <strong>{currentTeam.name}</strong>
            </div>
          )}

          <div className="letter-display movie-display">
            <span
              className={
                movieName
                  ? "letter movie-title"
                  : "letter-placeholder"
              }
            >
              {movieName || "🎬"}
            </span>

            <span className="letter-caption">
              {movieName
                ? `Round ${round} · ${selectedIndustry.name} · ${selectedMovieEra?.years}`
                : "Your movie name will appear here"}
            </span>
          </div>

          <div
            className={`countdown-display ${
              secondsLeft <= 10 && roundStatus === "active"
                ? "timer-warning"
                : ""
            }`}
          >
            <span>
              {roundStatus === "judging"
                ? "⏰ Time's up!"
                : roundStatus === "completed"
                ? "✅ Round completed"
                : roundStatus === "ready"
                ? "⏳ Ready to play "
                : "⏳ Time remaining"}
            </span>

            <strong>{formatTime(secondsLeft)}</strong>
          </div>

          <button
            className="primary-button full-button"
            onClick={generateMovie}
            disabled={
              gameFinished ||
              !teamsLocked ||
              roundStatus !== "ready" ||
              teams.length < 2
            }
          >
            🎲 Get a Random Movie Name & Start Timer
          </button>

          {!teamsLocked && (
            <p className="game-hint">
              Create and lock your teams before starting.
            </p>
          )}

          {/* Result buttons remain available after time expires */}
          {(roundStatus === "active" ||
            roundStatus === "judging") &&
            currentTeam && (
              <div className="round-actions">
                <h3>
                  {roundStatus === "active"
                    ? "🎭 Make Your Call!"
                    : "⏰ Time's Up! Decide the Result"}
                </h3>

                <p>
                  Can <strong>{currentTeam.name}</strong> act out
                  the movie while the team guesses the correct title?
                </p>

                <div className="result-buttons">
                  <button
                    type="button"
                    className="result-button nailed-button"
                    onClick={() => recordResult("nailed")}
                  >
                    <span>🎬 Guessed It!</span>
                    <small>
                      Correct guess · +1 point to {currentTeam.name}
                    </small>
                  </button>

                  <button
                    type="button"
                    className="result-button pass-button"
                    onClick={() => recordResult("no-point")}
                  >
                    <span>❌ Couldn't Guess!</span>
                    <small>
                      No points awarded to {currentTeam.name}
                    </small>
                  </button>
                </div>

                {roundStatus === "active" && (
                  <p className="game-hint">
                    Choose the result before the timer runs out.
                  </p>
                )}
              </div>
            )}

          {/* Completed round */}
          {roundStatus === "completed" && round > 0 && (
            <div className="round-completed">
              <h3>🎉 Round Finished!</h3>
              <p>{resultMessage}</p>

              <button
                className="primary-button full-button"
                onClick={nextRound}
                disabled={gameFinished}
              >
                ➡️ Next Team's Turn
              </button>
            </div>
          )}
        </div>

        {/* Step 6: Scoreboard */}
        <div className="score-section">
          <h2 className="setup-subheading">
            🏆 6. Team Scoreboard
          </h2>

          {teams.length === 0 ? (
            <p className="setup-description">
              Create teams to see the scoreboard.
            </p>
          ) : (
            <div className="scoreboard">
              {teams.map((team) => (
                <div className="score-card" key={team.id}>
                  <div className="score-card-icon">🏆</div>
                  <h3>{team.name}</h3>
                  <p className="score-points">
                    {team.score}{" "}
                    {team.score === 1 ? "Point" : "Points"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {teams.length >= 2 && (
            <button
              type="button"
              className="finish-game-button"
              onClick={finishGame}
              disabled={gameFinished}
            >
              🏆 Finish the Game
            </button>
          )}

          {gameFinished && (
            <p className="teams-locked-message">
              🏁 Game finished! Final scores are locked.
            </p>
          )}
        </div>
      </div>

      {/* Winner celebration popup */}
      {showWinnerPopup && (
        <div
          className="winner-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="winner-title"
        >
          <div className="winner-popup">
            <div className="winner-confetti">🎉 🎊 🎉</div>
            <div className="winner-trophy">🏆</div>

            {isDraw ? (
              <>
                <h2 id="winner-title">It's a Tie!</h2>

                <p className="winner-message">
                  Amazing game! The teams are tied.
                </p>

                <div className="winner-names">
                  {winningTeams.map((team) => (
                    <div className="winner-name" key={team.id}>
                      <span>🏆 {team.name}</span>
                      <strong>{team.score} points</strong>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="winner-message">
                  🎉 THE SPOTLIGHT IS YOURS! 🎉
                </p>

                <h2
                  id="winner-title"
                  className="winner-team-name"
                >
                  🥳 {winningTeams[0]?.name} 🥳
                </h2>

                <p className="winner-final-score">
                  {highestScore}{" "}
                  {highestScore === 1 ? "Point" : "Points"}
                </p>

                <p className="winner-message">
                  The movie stars have been crowned! 🎬🏆✨
                </p>
              </>
            )}

            <div className="final-scores">
              <h3>🏅 Final Scoreboard</h3>

              {[...teams]
                .sort((a, b) => b.score - a.score)
                .map((team) => (
                  <div className="final-score-row" key={team.id}>
                    <span>
                      {team.score === highestScore ? "🏆 " : "😔 "}
                      {team.name}
                    </span>

                    <strong>
                      {team.score}{" "}
                      {team.score === 1 ? "point" : "points"}
                    </strong>
                  </div>
                ))}
            </div>

            <button
              type="button"
              className="restart-game-button"
              onClick={restartGame}
            >
              Close & Restart Game
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
