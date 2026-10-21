import "./Home.css";
const games = [
  {
    id: "antakshari",
    emoji: "🎤",
    decoration: "🎵",
    title: "Antakshari",
    subtitle: "Sing your heart out!",
    description:
      "Get your letter and sing a song that begins with it.",
    tags: ["🎥 Tollywood", "🎬 Bollywood"],
    button: "Let's Sing",
    theme: "pink",
  },
  {
    id: "charades",
    emoji: "🎭",
    decoration: "🍿",
    title: "Dumb Charades",
    subtitle: "Act it, Guess it & Laugh!",
    description:
      "Get a movie name, act out the scene, and let your team guess it!",
    tags: ["🎥 Tollywood", "🎬 Bollywood"],
    button: "Let's Act",
    theme: "lavender",
  },
];

export default function Home({
  onPlayAntakshari,
  onPlayCharades,
}) {
  const openGame = (gameId) => {
    if (gameId === "antakshari") {
      onPlayAntakshari();
    } else {
      onPlayCharades();
    }
  };

  return (
    <>
      <section className="hero">
        <span className="floating-emoji emoji-one">✨</span>
        <span className="floating-emoji emoji-two">🎀</span>
        <span className="floating-emoji emoji-three">♫</span>
        <span className="floating-emoji emoji-four">🍿</span>

        <div className="hero-content">
          <div className="welcome-pill">
            <span>🌷</span> YOUR HAPPY PLACE TO PLAY
          </div>

          <h1>
            Good vibes
            <br />
            <span>Great games</span>
          </h1>

          <p className="hero-description">
            A little singing, a little acting, and a whole lot
            of laughter. Make every get-together a memory.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              document.getElementById("games")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Find your fun <span>♡</span>
          </button>

          <div className="hero-social-proof">
            <span className="mini-emoji">🎤</span>
            <span className="mini-emoji">🎭</span>
            <span className="mini-emoji">💗</span>
            <p>Made for friends, family & fun nights</p>
          </div>
        </div>
      </section>

      <section className="games-section" id="games">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE FUN STARTS HERE ✨</span>
            <h2>What are we playing?</h2>
            <p>
              Pick a game, gather your gang, and let the fun begin.
            </p>
          </div>

          <span className="heading-doodle">♡</span>
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <article
              className={`game-card ${game.theme}`}
              key={game.id}
            >
              <div className="card-art">
                <span className="card-sparkle sparkle-left">✦</span>
                <span className="card-sparkle sparkle-right">✧</span>

                <span className="card-decoration">
                  {game.decoration}
                </span>

                <div className="game-illustration">
                  <span>{game.emoji}</span>
                </div>

                <span className="card-caption">
                  A LITTLE FUN, A LOT OF LOVE
                </span>
              </div>

              <div className="card-content">
                <span className="card-kicker">
                  {game.subtitle}
                </span>

                <h3>{game.title}</h3>

                <p className="card-description">
                  {game.description}
                </p>

                <div className="game-tags">
                  {game.tags.map((tag) => (
                    <span className="game-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  className="game-button"
                  onClick={() => openGame(game.id)}
                >
                  {game.button} <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="coming-note">
          <span>💌</span>
          <p>
            Gather, Play & Laugh — Make unforgettable memories
            with your favourite people!
          </p>
          <span>💌</span>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-heart">♡</div>

        <span className="eyebrow">A LITTLE NOTE FROM LIKYAO</span>

        <h2>
          Less screen time alone
          <br />
          More happy time together
        </h2>

        <p>
          Likyao is all about connecting people through play.
        </p>

        <div className="about-emojis">
          🎶 &nbsp; 💗 &nbsp; 🎬
        </div>
      </section>
    </>
  );
}
