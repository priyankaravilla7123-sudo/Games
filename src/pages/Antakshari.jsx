
import { useEffect, useRef, useState } from "react";
import "./Antakshari.css";

const industries = [
  {
    id: "tollywood",
    name: "Tollywood Songs",
    language: "Telugu",
    emoji: "🎥",
  },
  {
    id: "bollywood",
    name: "Bollywood Songs",
    language: "Hindi",
    emoji: "🎬",
  },
];

const songLetters = {
  tollywood: [
    "అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఎ",
    "క", "గ", "చ", "జ", "ట", "డ", "త", "ద",
    "న", "ప", "బ", "మ", "య", "ర", "ల", "వ",
    "స", "హ",
  ],
  bollywood: [
    "अ", "आ", "इ", "उ", "ए",
    "क", "ग", "च", "ज", "ट", "ड", "त", "द",
    "न", "प", "ब", "म", "य", "र", "ल", "व",
    "स", "ह",
  ],
};

const heartColors = [
  "💛", "💚", "💜", "💙",
  "🩷", "❤️", "🧡", "🤎",
];

const timerOptions = [
  { label: "30 seconds", value: 0.5 },
  { label: "1 minute", value: 1 },
  { label: "2 minutes", value: 2 },
  { label: "3 minutes", value: 3 },
  { label: "5 minutes", value: 5 },
];

export default function Antakshari({ onBack }) {
  const [industry, setIndustry] = useState("tollywood");
  const [teams, setTeams] = useState([]);
  const [letter, setLetter] = useState("");
  const [round, setRound] = useState(0);
  const [teamsLocked, setTeamsLocked] = useState(false);

  // Timer
  const [timerMinutes, setTimerMinutes] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Game states: ready -> active -> judging -> completed
  const [roundStatus, setRoundStatus] = useState("ready");
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [resultMessage, setResultMessage] = useState("");

  // Prevent duplicate scoring from repeated clicks
  const resultSubmittedRef = useRef(false);

  // Winner popup
  const [gameFinished, setGameFinished] = useState(false);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);

  const selectedIndustry = industries.find(
    (item) => item.id === industry
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

    setLetter("");
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
      alert("Please keep at least two teams to play Antakshari.");
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

  // Generate a letter and start the timer
  const generateLetter = () => {
    if (
      gameFinished ||
      !teamsLocked ||
      roundStatus !== "ready" ||
      teams.length < 2
    ) {
      return;
    }

    const alphabet = songLetters[industry];

    const choices = alphabet.filter((item) => item !== letter);
    const availableLetters = choices.length > 0 ? choices : alphabet;

    const nextLetter =
      availableLetters[
        Math.floor(Math.random() * availableLetters.length)
      ];

    resultSubmittedRef.current = false;

    setLetter(nextLetter);
    setRound((currentRound) => currentRound + 1);
    setSecondsLeft(Math.round(timerMinutes * 60));
    setResultMessage("");
    setRoundStatus("active");
  };

  // Record the result at any time while the round is active,
  // or after the timer reaches zero.
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
        `🎤 ${currentTeam.name} nailed it! +1 point`
      );
    } else {
      // No Point means zero points for the current team.
      // No other team receives a point.
      setResultMessage(
        `❌ No point for ${currentTeam.name} this round.`
      );
    }

    // Stop the timer and finish the round immediately
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

    setLetter("");
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
      alert("Please record the current round's result before ending the game.");
      return;
    }

    setGameFinished(true);
    setShowWinnerPopup(true);
  };

  // Close the winner popup and reset the game
  const restartGame = () => {
    setIndustry("tollywood");
    setTeams([]);
    setLetter("");
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
    <section className="language-screen setup-screen">
      <button
        className="back-button"
        onClick={onBack}
        disabled={gameFinished && showWinnerPopup}
      >
        ← Back to home
      </button>

      <div className="setup-card">
        <span className="eyebrow">🎶 LET THE MUSIC BEGIN</span>

        <h1>Antakshari Game</h1>

        <p className="setup-description">
          Choose your music industry, create your teams,
          and start singing!
        </p>

        {/* Step 1: Choose songs */}
        <h2>🎬 1. Choose Your Songs</h2>

        <div className="industry-grid">
          {industries.map((item) => (
            <button
              key={item.id}
              disabled={teamsLocked || round > 0 || gameFinished}
              className={`industry-card ${
                industry === item.id ? "selected" : ""
              }`}
              onClick={() => {
                setIndustry(item.id);
                setLetter("");
              }}
            >
              <span className="industry-emoji">{item.emoji}</span>
              <strong>{item.name}</strong>
              <span className="industry-language">{item.language}</span>

              {industry === item.id && (
                <span className="selected-label">✓ Selected</span>
              )}
            </button>
          ))}
        </div>

        {/* Step 2: Teams */}
        <h2 className="setup-subheading">👯 2. Create Your Teams</h2>

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
                      {heartColors[(team.id - 1) % heartColors.length]}
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

        {/* Step 3: Timer */}
        <div className="timer-section">
          <h2>⏱️ 3. Choose the Round Timer</h2>

          <p className="setup-description">
            Select how long each team has to sing.
            The timer starts when you generate a letter.
          </p>

          <div className="timer-controls">
            <select
              id="timer-duration"
              value={timerMinutes}
              disabled={gameFinished || roundStatus === "active"}
              onChange={(event) =>
                setTimerMinutes(Number(event.target.value))
              }
            >
              {timerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 4: Letter and gameplay */}
        <div className="letter-section">
          <h2>🔤 4. Generate a Random Letter</h2>

          <p className="setup-description">
            Sing a {selectedIndustry.language} song beginning
            with the displayed letter.
          </p>

          {currentTeam && (
            <div className="current-team-banner">
              🎤 Current turn: <strong>{currentTeam.name}</strong>
            </div>
          )}

          <div className="letter-display">
            <span className={letter ? "letter" : "letter-placeholder"}>
              {letter || "?"}
            </span>

            <span className="letter-caption">
              {letter
                ? `Round ${round} · ${selectedIndustry.name}`
                : "Your letter will appear here"}
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
                : "⏳ Time remaining "}
            </span>

            <strong>{formatTime(secondsLeft)}</strong>
          </div>

          <button
            className="primary-button full-button"
            onClick={generateLetter}
            disabled={
              gameFinished ||
              !teamsLocked ||
              roundStatus !== "ready" ||
              teams.length < 2
            }
          >
            🔀 Generate Letter & Start Timer
          </button>

          {!teamsLocked && (
            <p className="game-hint">
              Create and lock your teams before starting.
            </p>
          )}

          {/* Both result buttons appear immediately after a letter
              is generated and remain visible when the timer expires. */}
          {(roundStatus === "active" ||
            roundStatus === "judging") &&
            currentTeam && (
              <div className="round-actions">
                <h3>
                  {roundStatus === "active"
                    ? "🎤 Make Your Call!"
                    : "⏰ Time's Up! Decide the Result"}
                </h3>

                <p>
                  Can <strong>{currentTeam.name}</strong> sing a
                  song starting with <strong>{letter}</strong>?
                </p>

                <div className="result-buttons">
                  <button
                    type="button"
                    className="result-button nailed-button"
                    onClick={() => recordResult("nailed")}
                  >
                    <span>🎤 Nailed It!</span>
                    <small>
                      Valid song · +1 point to {currentTeam.name}
                    </small>
                  </button>

                  <button
                    type="button"
                    className="result-button pass-button"
                    onClick={() => recordResult("no-point")}
                  >
                    <span>❌ No Point!</span>
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

        {/* Step 5: Scoreboard */}
        <div className="score-section">
          <h2>🏆 5. Team Scoreboard</h2>

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
                    {team.score} {team.score === 1 ? "Point" : "Points"}
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

                <h2 id="winner-title" className="winner-team-name">
                  🥳 {winningTeams[0]?.name} 🥳
                </h2>

                <p className="winner-final-score">
                  {highestScore}{" "}
                  {highestScore === 1 ? "Point" : "Points"}
                </p>

                <p className="winner-message">
                  The music stars have been crowned! 🎤✨
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
