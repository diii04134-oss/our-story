"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Scene =
  | "home"
  | "signal"
  | "chapter"
  | "terminal"
  | "final"
  | "ksyusha"
  | "letter";

type TerminalLine = {
  text: string;
  type: "system" | "user" | "error" | "secret" | "success";
};

const stars = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  left: (i * 37.17 + 11) % 100,
  top: (i * 61.73 + 7) % 100,
  delay: (i % 9) * 0.4,
  duration: 2 + (i % 5),
  size: i % 13 === 0 ? 3 : i % 4 === 0 ? 2 : 1,
}));

const memories = [
  {
    id: "embankment",
    index: "MEMORY 001",
    coordinates: "ORENBURG · OUR BEGINNING",
    kicker: "THE MOMENT EVERYTHING CHANGED",
    title: "The First Kiss",
    lines: [
      "Набережная в Оренбурге.",
      "Наш первый поцелуй — момент, который теперь всегда с нами.",
    ],
    photo: "/memories/embankment/photo.jpg",
    alt: "Набережная в Оренбурге",
  },
  {
    id: "moscow",
    index: "MEMORY 002",
    coordinates: "MOSCOW · FIRST TRIP",
    kicker: "A CITY FULL OF POSSIBILITIES",
    title: "Moscow, Just Us",
    lines: [
      "Наша первая совместная поездка.",
      "Новый город и воспоминания, которые принадлежат только нам.",
    ],
    photo: "/memories/moscow/photo.jpg",
    alt: "Мы в Москве",
  },
  {
    id: "overnights",
    index: "MEMORY 003",
    coordinates: "LATE NIGHTS · EARLY CLASSES",
    kicker: "JUST FIVE MORE MINUTES",
    title: "Five More Minutes",
    lines: [
      "Ночёвки вместе, разговоры и утро, когда на первую пару мы снова опаздывали.",
    ],
    photo: "/memories/overnights/photo.jpg",
    alt: "Наши ночёвки",
  },
  {
    id: "ksyusha",
    index: "MEMORY 004",
    coordinates: "SPECIAL ENTITY DETECTED",
    kicker: "THE THIRD MAIN CHARACTER",
    title: "Ksyusha.exe",
    lines: [
      "Маленькая пушистая часть нашей вселенной.",
      "У Ксюши здесь отдельный уровень любви.",
    ],
    photo: "/memories/ksyusha/photo.jpg",
    alt: "Ксюша",
  },
];

const ksyushaPhotos = [
  {
    src: "/memories/ksyusha/photo.jpg",
    caption: "Главная подозреваемая",
  },
  {
    src: "/memories/ksyusha/photo-2.jpg",
    caption: "Похищение личного пространства",
  },
  {
    src: "/memories/ksyusha/photo-3.jpg",
    caption: "Ночное проникновение",
  },
  {
    src: "/memories/ksyusha/photo-4.jpg",
    caption: "Невинность? Не доказана",
  },
  {
    src: "/memories/ksyusha/photo-5.jpg",
    caption: "Скрывается от правосудия",
  },
];

export default function Home() {
  const [scene, setScene] = useState<Scene>("home");

  const [terminalCommand, setTerminalCommand] = useState("");
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { text: "Connection established.", type: "system" },
    {
      text: 'Type "help" to begin the reconstruction.',
      type: "system",
    },
  ]);

  const [questStage, setQuestStage] = useState(0);
  const [finalUnlocked, setFinalUnlocked] = useState(false);

  const [secretOpen, setSecretOpen] = useState(false);
  const [secretTerminalOpen, setSecretTerminalOpen] = useState(false);
  const [secretAnswer, setSecretAnswer] = useState("");
  const [secretSolved, setSecretSolved] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
const [letterReplay, setLetterReplay] = useState(0);

  const [elapsed, setElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    // 16 октября 2023 года — начало нашей истории.
    const startDate = new Date(2023, 9, 16, 0, 0, 0);

    const updateElapsed = () => {
      const diff = Math.max(0, Date.now() - startDate.getTime());

      const days = Math.floor(diff / 86_400_000);
      const hours = Math.floor((diff % 86_400_000) / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);

      setElapsed({ days, hours, minutes });
    };

    updateElapsed();
    const timer = window.setInterval(updateElapsed, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  // Секретная комбинация клавиш: S A S H A.
  useEffect(() => {
    const sequence = ["s", "a", "s", "h", "a"];
    let position = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key.length !== 1) return;

      const key = event.key.toLowerCase();

      if (key === sequence[position]) {
        position += 1;

        if (position === sequence.length) {
          setSecretTerminalOpen(true);
          position = 0;
        }
      } else {
        position = key === sequence[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function executeCommand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const command = terminalCommand.trim().toLowerCase();
    if (!command) return;

    const addLines = (...lines: TerminalLine[]) => {
      setTerminalLines((previous) => [
        ...previous,
        { text: `guest@between-us:~$ ${command}`, type: "user" },
        ...lines,
      ]);
      setTerminalCommand("");
    };

    if (command === "clear") {
      setTerminalLines([]);
      setTerminalCommand("");
      return;
    }

    if (command === "help") {
      addLines(
        { text: "AVAILABLE COMMANDS", type: "system" },
        { text: "help — список команд", type: "system" },
        { text: "hint — получить подсказку", type: "system" },
        { text: "status — прогресс квеста", type: "system" },
        { text: "clear — очистить терминал", type: "system" }
      );
      return;
    }

    if (command === "status") {
      addLines({
        text: `ARCHIVE RESTORATION: ${questStage}/3`,
        type: "system",
      });
      return;
    }

    if (command === "hint") {
      const hints = [
        "Вы учились в одном месте и одной группе.",
        "Вспомни дату начала ваших отношений.",
        'Последний ключ — английское слово "мы".',
      ];

      addLines({
        text:
          questStage < 3
            ? hints[questStage]
            : "Все фрагменты восстановлены.",
        type: "secret",
      });
      return;
    }

    if (questStage >= 3) {
      addLines({
        text: 'Архив восстановлен. Нажми "OPEN THE FINAL SCENE".',
        type: "success",
      });
      return;
    }

    const answers = [
      {
        accepted: ["college", "колледж"],
        success: "LOCATION VERIFIED.",
        message: "Первый фрагмент найден. Теперь введи дату начала отношений.",
      },
      {
        accepted: ["16.10.2023", "16-10-2023", "16/10/2023"],
        success: "DATE VERIFIED: 16 OCTOBER 2023.",
        message: 'Остался последний ключ. Что объединяет вас двоих? Введи "us".',
      },
      {
        accepted: ["us", "мы"],
        success: "FINAL KEY ACCEPTED. ARCHIVE RESTORED.",
        message: "Все воспоминания восстановлены. Финал открыт.",
      },
    ];

    const current = answers[questStage];

    if (!current.accepted.includes(command)) {
      addLines(
        { text: "FRAGMENT NOT RECOGNIZED.", type: "error" },
        { text: 'Попробуй ещё раз или введи "hint".', type: "system" }
      );
      return;
    }

    const nextStage = questStage + 1;
    setQuestStage(nextStage);

    if (nextStage === 3) {
      setFinalUnlocked(true);
    }

    addLines(
      { text: current.success, type: "success" },
      { text: current.message, type: "secret" }
    );
  }

  return (
    <main className="cinema">
      <div className="grain" aria-hidden="true" />

      <div className="stars" aria-hidden="true">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <header className="topbar">
        <a
          className="logo"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            setScene("home");
          }}
          aria-label="На главную"
        >
          us<span>.</span>
        </a>

        <span className="edition">A STORY IN THREE ACTS</span>
        <span className="topbar-mark">✳</span>
      </header>

      {scene === "home" && (
        <section key="home" className="hero scene-enter">
          <button
            type="button"
            className="secret-star"
            aria-label="Неизвестный космический объект"
            title="Неизвестный сигнал"
            onClick={() => setSecretOpen(true)}
          >
            ✦
            <span className="secret-star-pulse" />
          </button>

          <div className="eyebrow">
            <span className="status-dot" />
            AN ONGOING STORY
          </div>

          <h1 className="hero-title">
            three years
            <br />
            <span>in production.</span>
          </h1>

          <p className="hero-description">
            A little universe built around
            <br />
            my favorite person.
          </p>

          <div className="hero-divider">
            <span />
            <span className="divider-star">✳</span>
            <span />
          </div>

          <p className="counter-label">TIME SINCE OUR STORY BEGAN</p>

          <p className="counter">
            {elapsed.days} days · {elapsed.hours} hours
          </p>

          <button
            className="enter-button"
            onClick={() => setScene("signal")}
          >
            <span>ENTER OUR UNIVERSE</span>
            <span className="button-arrow">↗</span>
          </button>

          <p className="hint">
            BEST EXPERIENCED WITH A LITTLE CURIOSITY
          </p>
        </section>
      )}

      {scene === "signal" && (
        <section key="signal" className="story-scene scene-enter">
          <p className="scene-code">SIGNAL ESTABLISHED · 001</p>

          <span className="scene-symbol" aria-hidden="true">
            ✳
          </span>

          <h1 className="story-title">
            A universe
            <br />
            <span>of two.</span>
          </h1>

          <div className="story-copy">
            <p>Всё началось в колледже.</p>
            <p>
              Одна группа, одни и те же пары,
              <br />
              обычные дни.
            </p>
            <p>
              Тогда мы ещё не знали,
              <br />
              что среди всех людей вокруг
              <br />
              найдём друг друга.
            </p>
          </div>

          <p className="scene-caption">
            SASHA &amp; DIANA · EST. 16.10.2023
          </p>

          <button
            className="enter-button"
            onClick={() => setScene("chapter")}
          >
            <span>RECONSTRUCT OUR STORY</span>
            <span className="button-arrow">↗</span>
          </button>

          <button
            className="text-button"
            onClick={() => setScene("home")}
          >
            ← BACK TO THE BEGINNING
          </button>
        </section>
      )}

      {scene === "chapter" && (
        <section
          key="chapter"
          className="story-scene chapter-scene scene-enter"
        >
          <p className="scene-code">ARCHIVE FOUND · FILE 001</p>

          <span className="scene-symbol" aria-hidden="true">
            ♡
          </span>

          <p className="eyebrow">CHAPTER ONE</p>

          <h1 className="story-title">
            Before we
            <br />
            <span>were us.</span>
          </h1>

          <div className="story-copy">
            <p>16 октября 2023 года.</p>
            <p>
              Дата, с которой началась наша
              <br />
              общая история.
            </p>
            <p>
              Мы ещё не знали, сколько воспоминаний
              <br />
              впереди. Не знали, какими станут
              <br />
              наши обычные дни.
            </p>
            <p>
              Но теперь у нас есть целая вселенная,
              <br />
              которую мы создали вместе.
            </p>
          </div>

          <div className="archive-card">
            <span className="archive-label">TIME IN OUR UNIVERSE</span>
            <span className="archive-number">
              {elapsed.days.toLocaleString("ru-RU")}
            </span>
            <span className="archive-unit">DAYS TOGETHER</span>
            <span className="archive-divider" />
            <span className="archive-note">
              Sasha + Diana
              <br />
              <span>One story. Two main characters.</span>
            </span>
          </div>

          <p className="scene-caption">
            MORE MEMORIES WAIT TO BE DISCOVERED
          </p>

          <button
            className="enter-button"
            onClick={() => setScene("terminal")}
          >
            <span>CONTINUE THE STORY</span>
            <span className="button-arrow">↗</span>
          </button>

          <button
            className="text-button"
            onClick={() => setScene("signal")}
          >
            ← PREVIOUS SCENE
          </button>
        </section>
      )}

      {scene === "terminal" && (
        <section
          key="terminal"
          className="story-scene terminal-scene scene-enter"
        >
          <p className="scene-code">MEMORY CORE · ACCESS POINT 001</p>

          <h1 className="story-title terminal-title">
            memory<span>_core</span>
          </h1>

          <p className="terminal-description">
            Архив Саши и Дианы.
            <br />
            Некоторые воспоминания скрыты.
          </p>

          <div className="terminal-window">
            <div className="terminal-bar">
              <div className="terminal-dots">
                <span />
                <span />
                <span />
              </div>
              <span>between-us — terminal</span>
              <span className="terminal-online">ONLINE</span>
            </div>

            <div className="terminal-output" aria-live="polite">
              {terminalLines.map((line, index) => (
                <p
                  key={`${index}-${line.text}`}
                  className={`terminal-line terminal-${line.type}`}
                >
                  {line.text}
                </p>
              ))}
            </div>

            <form className="terminal-form" onSubmit={executeCommand}>
              <label htmlFor="terminal-command">
                <span className="terminal-prompt">guest@us:~$</span>
                <input
                  id="terminal-command"
                  value={terminalCommand}
                  onChange={(event) =>
                    setTerminalCommand(event.target.value)
                  }
                  placeholder="enter command..."
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Команда терминала"
                />
              </label>

              <button type="submit" className="terminal-submit">
                RUN ↗
              </button>
            </form>
          </div>

          {finalUnlocked && (
            <div className="terminal-unlocked scene-enter">
              <span>✳</span>
              <p>HIDDEN MEMORY DISCOVERED</p>
              <p>Ты нашёл первое секретное послание.</p>
              <button
                type="button"
                className="terminal-submit"
                onClick={() => setScene("final")}
              >
                OPEN THE FINAL SCENE ↗
              </button>
            </div>
          )}

          <button
            className="text-button"
            onClick={() => setScene("chapter")}
          >
            ← BACK TO THE STORY
          </button>
        </section>
      )}

      {scene === "final" && (
        <section
          key="final"
          className="story-scene memories-scene scene-enter"
        >
          <p className="scene-code">ARCHIVE RESTORED · FILES 001–004</p>

          <span className="scene-symbol" aria-hidden="true">
            ✳
          </span>

          <p className="eyebrow">OUR PRIVATE UNIVERSE</p>

          <h1 className="story-title">
            little things,
            <br />
            <span>forever us.</span>
          </h1>

          <div className="story-copy memories-intro">
            <p>Некоторые моменты становятся целой вселенной.</p>
            <p>
              Вот несколько историй,
              <br />
              которые навсегда останутся нашими.
            </p>
          </div>

          <div className="memories-grid">
            {memories.map((memory) => {
              const isKsyusha = memory.id === "ksyusha";

              return (
                <article
                  key={memory.id}
                  className={`memory-card memory-${memory.id} ${
                    isKsyusha ? "memory-clickable" : ""
                  }`}
                  onClick={() => {
                    if (isKsyusha) setScene("ksyusha");
                  }}
                  role={isKsyusha ? "button" : undefined}
                  tabIndex={isKsyusha ? 0 : undefined}
                  onKeyDown={(event) => {
                    if (
                      isKsyusha &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      setScene("ksyusha");
                    }
                  }}
                >
                  <div className="memory-art memory-art--photo">
                    <Image
                      src={memory.photo}
                      alt={memory.alt}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={95}
                      className="memory-photo"
                      style={{ width: "100%", height: "auto" }}
                    />
                    <span className="memory-index">{memory.index}</span>
                    <span className="memory-coordinates">
                      {memory.coordinates}
                    </span>
                  </div>

                  <div className="memory-content">
                    <p className="memory-kicker">{memory.kicker}</p>
                    <h2>{memory.title}</h2>
                    {memory.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="memories-ending">
            <span className="memories-heart">♡</span>
            <p className="memories-ending-title">TO BE CONTINUED...</p>
            <p className="memories-ending-copy">
              Саша и Диана.
              <br />
              История, которую мы продолжаем писать вместе.
            </p>
          </div>

          <button
            className="enter-button letter-entry-button"
            onClick={() => {
              setLetterOpen(false);
              setScene("letter");
            }}
          >
            <span>ONE LAST THING</span>
            <span className="button-arrow">♡</span>
          </button>

          <button
            className="enter-button"
            onClick={() => setScene("home")}
          >
            <span>BACK TO THE BEGINNING</span>
            <span className="button-arrow">↗</span>
          </button>

          <button
            className="text-button"
            onClick={() => setScene("terminal")}
          >
            ← RETURN TO MEMORY CORE
          </button>
        </section>
      )}

      
{scene === "letter" && (
  <section className="letter-scene">
    <div className="letter-stars" aria-hidden="true">
      <span>✦</span>
      <span>·</span>
      <span>✧</span>
      <span>·</span>
      <span>✦</span>
    </div>

    <div className="letter-container">
      <div className="letter-topline">
        <span className="letter-topline-line" />
        <span>A LITTLE SOMETHING FOR YOU</span>
        <span className="letter-topline-line" />
      </div>

      {!letterOpen ? (
        <div className="letter-envelope">
          <div className="letter-envelope-symbol">♡</div>

          <p className="letter-eyebrow">JUST FOR YOU, SASHA</p>

          <h2 className="letter-closed-title">
            A letter
            <br />
            from my heart.
          </h2>

          <p className="letter-closed-copy">
            Есть кое-что, что я хочу,
            <br />
            чтобы ты мог перечитывать.
          </p>

          <button
            className="enter-button letter-open-button"
            onClick={() => setLetterOpen(true)}
          >
            <span>OPEN MY LETTER</span>
            <span className="button-arrow">↗</span>
          </button>
        </div>
      ) : (
        <div className="letter-content" key={letterReplay}>
          <p className="letter-eyebrow">16 OCTOBER 2023 — FOREVER</p>

          <h2 className="letter-title">Мой красивый,</h2>

          <div className="letter-body">
            <p className="letter-paragraph">
              Если бы мне дали возможность прожить всё заново,
              я бы всё равно захотела встретить тебя.
            </p>

            <p className="letter-paragraph">
              Я бы снова оказалась в том же колледже, снова
              прожила бы все наши обычные дни и снова дождалась
              бы момента, когда мы стали нами.
            </p>

            <p className="letter-paragraph">
              Потому что теперь я знаю: за самыми обычными
              моментами иногда скрывается что-то, что меняет
              всю твою жизнь.
            </p>

            <p className="letter-paragraph letter-highlight">
              И для меня это — ты.
            </p>

            <p className="letter-paragraph">
              Мне не нужно, чтобы наша история всегда была
              идеальной. Я хочу, чтобы в ней были мы —
              настоящие. С нашими разговорами, смехом,
              маленькими привычками, ночёвками, воспоминаниями
              и Ксюшей, которая, конечно, считает себя
              главной героиней.
            </p>

            <p className="letter-paragraph">
              Я хочу ещё много обычных дней с тобой.
              Потому что именно они для меня и становятся
              чем-то особенным.
            </p>

            <p className="letter-paragraph">
              Спасибо, что ты есть в моей жизни.
              И если однажды ты забудешь, насколько ты мне дорог,
              просто вернись сюда и прочитай это ещё раз.
            </p>

            <p className="letter-signature">
              Люблю до луны и обратно,
              <br />
              <span>Дианя ♡</span>
            </p>
          </div>

          <div className="letter-ending">
            <span className="letter-ending-heart">♡</span>

            <p>I WOULD CHOOSE YOU AGAIN.</p>

            <span className="letter-ending-caption">
              IN EVERY LIFETIME. IN EVERY VERSION OF OUR STORY.
            </span>
          </div>

          <button
            className="text-button letter-replay-button"
            onClick={() => setLetterReplay((value) => value + 1)}
          >
            ↻ READ IT AGAIN
          </button>

          <button
            className="text-button letter-home-button"
            onClick={() => setScene("home")}
          >
            ← BACK TO THE BEGINNING
          </button>
        </div>
      )}
    </div>
  </section>
)}




      {scene === "ksyusha" && (
        <section
          key="ksyusha"
          className="story-scene ksyusha-scene scene-enter"
        >
          <p className="scene-code">
            CONFIDENTIAL FILE · SUBJECT 001
          </p>

          <span className="scene-symbol" aria-hidden="true">
            🐾
          </span>

          <p className="eyebrow">MOST WANTED IN THIS HOUSE</p>

          <h1 className="story-title">
            Ksyusha<span>.exe</span>
            <br />
            <span>the fluffy criminal.</span>
          </h1>

          <p className="ksyusha-subtitle">
            Досье на самую пушистую преступницу
            <br />
            в нашей маленькой вселенной.
          </p>

          <div className="ksyusha-file">
            <div className="ksyusha-file-header">
              <span>CASE № 001-K</span>
              <span className="ksyusha-stamp">TOP SECRET</span>
            </div>

            <div className="ksyusha-profile">
              <div className="ksyusha-profile-photo">
                <Image
                  src="/memories/ksyusha/photo-6.jpg"
                  alt="Главная подозреваемая — Ксюша"
                  width={600}
                  height={700}
                  quality={95}
                  className="ksyusha-main-photo"
                />
                <span className="ksyusha-photo-label">
                  SUBJECT IDENTIFIED
                </span>
              </div>

              <div className="ksyusha-details">
                <p className="ksyusha-field-label">NAME</p>
                <h2>Ксюша</h2>

                <p className="ksyusha-field-label">SPECIES</p>
                <p>Пушистая домашняя угроза</p>

                <p className="ksyusha-field-label">THREAT LEVEL</p>
                <p className="ksyusha-danger">MAXIMUM FLUFFINESS</p>

                <p className="ksyusha-field-label">SPECIAL ABILITIES</p>
                <p>
                  Гипноз взглядом, захват территории,
                  внезапное появление в самый неподходящий момент.
                </p>

                <p className="ksyusha-field-label">STATUS</p>
                <p className="ksyusha-status">
                  ● Слишком мила, чтобы арестовать
                </p>
              </div>
            </div>
          </div>

          <div className="ksyusha-crimes">
            <p className="eyebrow">KNOWN OFFENCES</p>

            <h2 className="ksyusha-section-title">
              Список преступлений
            </h2>

            <div className="ksyusha-crime-list">
              <article className="ksyusha-crime">
                <span>01</span>
                <div>
                  <h3>Кража сердечек</h3>
                  <p>
                    Обвиняется в систематическом похищении
                    любви всех присутствующих.
                  </p>
                </div>
                <span className="crime-status">CONFIRMED</span>
              </article>

              <article className="ksyusha-crime">
                <span>02</span>
                <div>
                  <h3>Незаконное лежание</h3>
                  <p>
                    Самовольно занимает кровати, пледы
                    и любые поверхности с комфортом выше среднего.
                  </p>
                </div>
                <span className="crime-status">CONFIRMED</span>
              </article>

              <article className="ksyusha-crime">
                <span>03</span>
                <div>
                  <h3>Похищение внимания</h3>
                  <p>
                    Прерывает любые дела одним взглядом.
                    Подозреваемая не раскаивается.
                  </p>
                </div>
                <span className="crime-status">ONGOING</span>
              </article>

              <article className="ksyusha-crime">
                <span>04</span>
                <div>
                  <h3>Чрезмерная милота</h3>
                  <p>
                    Превышение допустимого уровня пушистости.
                    Смягчающих обстоятельств слишком много.
                  </p>
                </div>
                <span className="crime-status">UNFORGIVABLE</span>
              </article>
            </div>
          </div>

          <div className="ksyusha-gallery">
            <p className="eyebrow">SURVEILLANCE ARCHIVE</p>

            <h2 className="ksyusha-section-title">
              Фотодоказательства
            </h2>

            <p className="ksyusha-gallery-intro">
              Материалы дела. Все совпадения неслучайны.
            </p>

            <div className="ksyusha-gallery-grid">
              {ksyushaPhotos.map((photo, index) => (
                <figure
                  key={photo.src}
                  className="ksyusha-gallery-item"
                >
                  <div className="ksyusha-gallery-image">
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      width={600}
                      height={700}
                      quality={90}
                      className="ksyusha-gallery-photo"
                    />
                    <span>
                      EVIDENCE {String(index + 1).padStart(3, "0")}
                    </span>
                  </div>
                  <figcaption>{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="ksyusha-verdict">
            <span>♡</span>
            <p className="eyebrow">FINAL VERDICT</p>

            <h2>
              Виновна.
              <br />
              <span>В том, что мы её любим.</span>
            </h2>

            <p>
              Приговор: пожизненное пребывание
              <br />
              в нашей семье с неограниченным доступом
              <br />
              к любви, заботе и вкусняшкам.
            </p>

            <span className="ksyusha-signature">
              CASE CLOSED · PURR-FOREVER
            </span>
          </div>

          <button
            className="enter-button"
            onClick={() => setScene("final")}
          >
            <span>BACK TO OUR MEMORIES</span>
            <span className="button-arrow">↗</span>
          </button>

          <button
            className="text-button"
            onClick={() => setScene("home")}
          >
            ← BACK TO THE BEGINNING
          </button>
        </section>
      )}

      {/* SECRET EASTER EGG: STAR MESSAGE */}
      {secretOpen && (
        <div
          className="secret-overlay"
          onClick={() => setSecretOpen(false)}
        >
          <section
            className="secret-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="secret-message-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="secret-modal-code">SIGNAL RECEIVED · 001</p>

            <span className="secret-modal-star">✦</span>

            <p className="eyebrow">A MESSAGE FROM THE UNIVERSE</p>

            <h2 id="secret-message-title">
              Ты нашёл то,
              <br />
              что не было предназначено
              <br />
              для случайных глаз.
            </h2>

            <p className="secret-modal-text">
              Среди миллиардов звёзд есть одна маленькая вселенная,
              в которой мне хочется оставаться снова и снова.
            </p>

            <button
              type="button"
              className="enter-button"
              onClick={() => {
                setSecretOpen(false);
                setSecretTerminalOpen(true);
              }}
            >
              <span>DECODE THE NEXT SIGNAL</span>
              <span className="button-arrow">↗</span>
            </button>

            <button
              type="button"
              className="text-button"
              onClick={() => setSecretOpen(false)}
            >
              CLOSE SIGNAL
            </button>
          </section>
        </div>
      )}

      {/* SECRET EASTER EGG: ENCRYPTED TERMINAL */}
      {secretTerminalOpen && (
        <div
          className="secret-overlay"
          onClick={() => setSecretTerminalOpen(false)}
        >
          <section
            className="secret-modal secret-terminal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="secret-terminal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="secret-modal-code">
              ENCRYPTED CHANNEL · 002
            </p>

            <p className="eyebrow">IDENTITY CONFIRMED</p>

            <h2 id="secret-terminal-title">Маленькая загадка</h2>

            <p className="secret-terminal-question">
              Что становится больше, когда им делятся,
              и не исчезает, даже если отдать его целиком?
            </p>

            {!secretSolved ? (
              <form
                className="secret-answer-form"
                onSubmit={(event) => {
                  event.preventDefault();

                  if (
                    secretAnswer.trim().toLocaleLowerCase("ru") === "любовь"
                  ) {
                    setSecretSolved(true);
                  }
                }}
              >
                <label htmlFor="secret-answer">ВВЕДИ ОТВЕТ</label>

                <input
                  id="secret-answer"
                  value={secretAnswer}
                  onChange={(event) => setSecretAnswer(event.target.value)}
                  placeholder="..."
                  autoComplete="off"
                />

                <button type="submit" className="enter-button">
                  <span>ПРОВЕРИТЬ</span>
                  <span className="button-arrow">↗</span>
                </button>

                <p className="secret-hint">
                  Подсказка: это то, из-за чего создан весь этот сайт.
                </p>
              </form>
            ) : (
              <div className="secret-solved">
                <span className="secret-solved-icon">♡</span>

                <p className="eyebrow">ACCESS GRANTED</p>

                <h3>Ты разгадал.</h3>

                <p>
                  Если ты читаешь это, значит, ты нашёл ещё
                  одну маленькую часть моей вселенной.
                </p>

                <p>
                  Я хотела спрятать здесь напоминание:
                  среди всех случайностей моей любимой
                  случайностью стала наша встреча.
                </p>

                <span className="secret-signature">
                  ENDLESSLY YOURS · DIANA
                </span>
              </div>
            )}

            <button
              type="button"
              className="text-button"
              onClick={() => setSecretTerminalOpen(false)}
            >
              ← RETURN TO THE UNIVERSE
            </button>
          </section>
        </div>
      )}

      <footer className="footer">
        <span>MADE OF MEMORIES</span>
        <span className="footer-center">♥</span>
        <span>VERSION 3.0.0</span>
      </footer>
    </main>
  );
}
