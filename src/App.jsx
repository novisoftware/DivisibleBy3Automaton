import { useEffect, useMemo, useState } from "react";

const STATES = ["S0", "S1", "S2"];
const END_STATE_ACCEPT = "ACCEPT";
const END_STATE_REJECT = "REJECT";
const STEP_MS = 700;

const NODE_LAYOUT = {
  START: { x: 80, y: 90, kind: "start" },
  S0: { x: 331, y: 134, kind: "state" },
  S1: { x: 278, y: 324, kind: "state" },
  S2: { x: 471, y: 272, kind: "state" },
  ACCEPT: { x: 760, y: 170, kind: "terminal" },
  REJECT: { x: 760, y: 350, kind: "terminal" },
};

const EDGE_LAYOUT = [
  { key: "START->S0", path: "M 106 100 Q 195 86 309 127", label: "start", labelX: 208, labelY: 78 },
  { key: "S0->S0", path: "M 350 116 C 398 74 436 120 370 139", label: "0, 3, 6, 9", labelX: 448, labelY: 84 },
  { key: "S1->S1", path: "M 256 343 C 205 386 218 432 270 368", label: "0, 3, 6, 9", labelX: 164, labelY: 392 },
  { key: "S2->S2", path: "M 486 293 C 534 338 530 382 484 326", label: "0, 3, 6, 9", labelX: 575, labelY: 388 },
  { key: "S0->S1", path: "M 324 157 Q 309 228 286 299", label: "1, 4, 7", labelX: 318, labelY: 242 },
  { key: "S0->S2", path: "M 353 151 Q 413 188 451 253", label: "2, 5, 8", labelX: 418, labelY: 188 },
  { key: "S1->S0", path: "M 288 301 Q 305 238 326 157", label: "2, 5, 8", labelX: 238, labelY: 224 },
  { key: "S2->S0", path: "M 452 250 Q 400 188 354 151", label: "1, 4, 7", labelX: 468, labelY: 210 },
  { key: "S1->S2", path: "M 302 317 Q 375 301 447 279", label: "1, 4, 7", labelX: 378, labelY: 286 },
  { key: "S2->S1", path: "M 447 296 Q 375 326 302 329", label: "2, 5, 8", labelX: 381, labelY: 360 },
  { key: "S0->ACCEPT", path: "M 355 136 Q 557 139 700 165", label: "END", labelX: 570, labelY: 124 },
  { key: "S1->REJECT", path: "M 302 327 Q 520 338 700 346", label: "END", labelX: 536, labelY: 321 },
  { key: "S2->REJECT", path: "M 495 277 Q 612 300 700 346", label: "END", labelX: 621, labelY: 289 },
];

function parseIntegerString(raw) {
  const text = raw.trim();
  if (text.length === 0) {
    return { ok: false, reason: "Please input an integer." };
  }

  const normalized = text[0] === "+" || text[0] === "-" ? text.slice(1) : text;
  if (!/^\d+$/.test(normalized)) {
    return { ok: false, reason: "Only decimal integer strings are supported." };
  }

  return { ok: true, digits: normalized };
}

function nextState(state, digit) {
  const remainder = Number(state[1]);
  const d = Number(digit);
  const next = (remainder * 10 + d) % 3;
  return `S${next}`;
}

function buildRun(digits) {
  let state = "S0";
  const transitions = [];

  for (const ch of digits) {
    const to = nextState(state, ch);
    transitions.push({ symbol: ch, from: state, to });
    state = to;
  }

  const final = state === "S0" ? END_STATE_ACCEPT : END_STATE_REJECT;
  transitions.push({ symbol: "END", from: state, to: final });

  return {
    transitions,
    final,
  };
}

function transitionLabel(from, to) {
  if (to === END_STATE_ACCEPT || to === END_STATE_REJECT) {
    return "END";
  }
  return `${from} -> ${to}`;
}

function edgeKey(from, to) {
  return `${from}->${to}`;
}

function AutomatonDiagram({ activeState, currentTransition }) {
  const activeEdge = currentTransition ? edgeKey(currentTransition.from, currentTransition.to) : null;

  return (
    <svg viewBox="0 0 900 460" className="automaton-svg" role="img" aria-label="Finite automaton for divisibility by three">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>

      {EDGE_LAYOUT.map((edge) => {
        const isActive = edge.key === activeEdge;
        return (
          <g key={edge.key} className={isActive ? "edge active" : "edge"}>
            <path d={edge.path} markerEnd="url(#arrow)" />
            <text x={edge.labelX} y={edge.labelY} textAnchor="middle">{edge.label}</text>
          </g>
        );
      })}

      {Object.entries(NODE_LAYOUT).map(([name, node]) => {
        const isActive = name === activeState;

        if (node.kind === "terminal") {
          return (
            <g key={name} className={isActive ? "node terminal active" : "node terminal"}>
              <rect x={node.x - 58} y={node.y - 24} width="116" height="48" rx="14" ry="14" />
              <text x={node.x} y={node.y + 7} textAnchor="middle">{name}</text>
            </g>
          );
        }

        return (
          <g key={name} className={isActive ? "node active" : "node"}>
            <circle cx={node.x} cy={node.y} r={name === "START" ? 28 : 24} />
            <text x={node.x} y={node.y + 7} textAnchor="middle">{name}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function App() {
  const [inputValue, setInputValue] = useState("123");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [transitions, setTransitions] = useState([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [activeState, setActiveState] = useState("S0");
  const [result, setResult] = useState(null);

  const currentTransition = useMemo(() => {
    if (stepIndex < 0 || stepIndex >= transitions.length) {
      return null;
    }
    return transitions[stepIndex];
  }, [stepIndex, transitions]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const timer = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= transitions.length) {
          setIsRunning(false);
          return prev;
        }

        const nextStateName = transitions[next].to;
        setActiveState(nextStateName);

        if (next === transitions.length - 1) {
          setResult(nextStateName === END_STATE_ACCEPT ? "DIVISIBLE" : "NOT_DIVISIBLE");
        }

        return next;
      });
    }, STEP_MS);

    return () => clearInterval(timer);
  }, [isRunning, transitions]);

  const onStart = () => {
    const parsed = parseIntegerString(inputValue);
    if (!parsed.ok) {
      setError(parsed.reason);
      setTransitions([]);
      setStepIndex(-1);
      setActiveState("S0");
      setResult(null);
      setIsRunning(false);
      return;
    }

    const run = buildRun(parsed.digits);
    setError("");
    setTransitions(run.transitions);
    setStepIndex(-1);
    setActiveState("S0");
    setResult(null);
    setIsRunning(true);
  };

  const onReset = () => {
    setIsRunning(false);
    setTransitions([]);
    setStepIndex(-1);
    setActiveState("S0");
    setResult(null);
    setError("");
  };

  const statusText = (() => {
    if (error) {
      return error;
    }
    if (isRunning) {
      return "Running automaton...";
    }
    if (result === "DIVISIBLE") {
      return "Result: divisible by 3";
    }
    if (result === "NOT_DIVISIBLE") {
      return "Result: not divisible by 3";
    }
    return "Enter an integer and press Start.";
  })();

  return (
    <div className="page-shell">
      <header className="hero">
        <h1>Divisible by 3 Automaton</h1>
        <p>
          Decimal string input is processed symbol by symbol. Final acceptance occurs only if
          the automaton ends in S0 at END.
        </p>
      </header>

      <section className="panel controls">
        <label htmlFor="num-input">Integer string</label>
        <div className="row">
          <input
            id="num-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. 12039"
            disabled={isRunning}
          />
          <button onClick={onStart} disabled={isRunning}>Start</button>
          <button className="ghost" onClick={onReset}>Reset</button>
        </div>
        <p className={`status ${error ? "error" : ""}`}>{statusText}</p>
      </section>

      <section className="panel">
        <h2>Automaton Graph</h2>
        <div className="diagram">
          <AutomatonDiagram activeState={activeState} currentTransition={currentTransition} />
        </div>
      </section>

      <section className="panel grid-two">
        <div>
          <h2>Current State</h2>
          <div className="state-chip-wrap">
            {STATES.map((s) => (
              <div key={s} className={`state-chip ${activeState === s ? "on" : ""}`}>{s}</div>
            ))}
            <div className={`state-chip terminal ${activeState === END_STATE_ACCEPT ? "accept" : ""}`}>
              ACCEPT
            </div>
            <div className={`state-chip terminal ${activeState === END_STATE_REJECT ? "reject" : ""}`}>
              REJECT
            </div>
          </div>
          {currentTransition && (
            <p className="now">
              Symbol <strong>{currentTransition.symbol}</strong>: {transitionLabel(currentTransition.from, currentTransition.to)}
            </p>
          )}
        </div>

        <div>
          <h2>Transition Trace</h2>
          <ol className="trace">
            {transitions.map((t, idx) => (
              <li key={`${idx}-${t.from}-${t.symbol}`} className={idx === stepIndex ? "active" : ""}>
                {idx + 1}. {t.from} --{t.symbol}--&gt; {t.to}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
