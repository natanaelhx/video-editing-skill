import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// ──────────────────────────────────────────────
// IDENTIDADE VISUAL — myQuickClaw
// ──────────────────────────────────────────────
const COLORS = {
  bg:          "#080B14",   // fundo escuro profundo
  bgCard:      "rgba(15, 20, 40, 0.9)",
  primary:     "#6C63FF",   // roxo vibrante (brand)
  cyan:        "#00D4AA",   // ciano neon (AI highlight)
  cyanGlow:    "rgba(0, 212, 170, 0.3)",
  white:       "#FFFFFF",
  gray:        "#A0AEC0",
  dimmed:      "#4A5568",
  gradBrand:   "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
  gradDark:    "linear-gradient(180deg, #080B14 0%, #0F1628 100%)",
  gridLine:    "rgba(108, 99, 255, 0.12)",
};

const FONT = "'Inter', 'Poppins', sans-serif";

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────
const ease = (frame: number, from: number, to: number, inF: number, outF: number) =>
  interpolate(frame, [inF, outF], [from, to], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fadeIn  = (frame: number, start: number, duration = 20) =>
  ease(frame, 0, 1, start, start + duration);
const fadeOut = (frame: number, start: number, duration = 15) =>
  ease(frame, 1, 0, start, start + duration);
const slideUp = (frame: number, start: number, duration = 25) =>
  ease(frame, 40, 0, start, start + duration);

// ──────────────────────────────────────────────
// COMPONENT: Grid Background
// ──────────────────────────────────────────────
const GridBg: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill style={{ opacity }}>
    {/* Linhas verticais */}
    {Array.from({ length: 20 }, (_, i) => (
      <div key={`v${i}`} style={{
        position: "absolute",
        left: `${i * 5.26}%`,
        top: 0, bottom: 0,
        width: 1,
        background: COLORS.gridLine,
      }} />
    ))}
    {/* Linhas horizontais */}
    {Array.from({ length: 12 }, (_, i) => (
      <div key={`h${i}`} style={{
        position: "absolute",
        top: `${i * 8.33}%`,
        left: 0, right: 0,
        height: 1,
        background: COLORS.gridLine,
      }} />
    ))}
    {/* Gradiente radial central (glow) */}
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(108,99,255,0.08) 0%, transparent 70%)",
    }} />
  </AbsoluteFill>
);

// ──────────────────────────────────────────────
// COMPONENT: Glow Orb
// ──────────────────────────────────────────────
const GlowOrb: React.FC<{ x: string; y: string; color: string; size?: number; opacity?: number }> = ({
  x, y, color, size = 400, opacity = 0.15,
}) => (
  <div style={{
    position: "absolute",
    left: x, top: y,
    width: size, height: size,
    borderRadius: "50%",
    background: color,
    filter: `blur(${size / 2}px)`,
    opacity,
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  }} />
);

// ──────────────────────────────────────────────
// COMPONENT: Neon Badge
// ──────────────────────────────────────────────
const Badge: React.FC<{ text: string; color?: string }> = ({ text, color = COLORS.cyan }) => (
  <div style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: `${color}18`,
    border: `1px solid ${color}55`,
    borderRadius: 100,
    padding: "8px 20px",
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: 600,
    color,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  }}>
    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
    {text}
  </div>
);

// ──────────────────────────────────────────────
// COMPONENT: Typing Text
// ──────────────────────────────────────────────
const TypingText: React.FC<{ text: string; frame: number; startFrame: number; fps: number }> = ({
  text, frame, startFrame, fps,
}) => {
  const elapsed = Math.max(0, frame - startFrame);
  const charsPerFrame = 2;
  const visible = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const showCursor = frame % Math.round(fps / 2) < Math.round(fps / 4);

  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.white }}>
      {text.slice(0, visible)}
      <span style={{ opacity: showCursor ? 1 : 0, color: COLORS.cyan }}>|</span>
    </span>
  );
};

// ──────────────────────────────────────────────
// COMPONENT: UI Card (simula painel gerado por IA)
// ──────────────────────────────────────────────
const UICard: React.FC<{ title: string; items: string[]; accent: string; delay: number; frame: number; fps: number }> = ({
  title, items, accent, delay, frame, fps,
}) => {
  const prog = spring({ frame: frame - delay, fps, config: { stiffness: 120, damping: 18 } });
  return (
    <div style={{
      background: "rgba(15, 20, 45, 0.95)",
      border: `1px solid ${accent}44`,
      borderRadius: 16,
      padding: "20px 24px",
      minWidth: 260,
      boxShadow: `0 0 30px ${accent}22, inset 0 0 20px rgba(0,0,0,0.5)`,
      transform: `scale(${prog}) translateY(${(1 - prog) * 30}px)`,
      opacity: prog,
    }}>
      <div style={{
        fontFamily: FONT, fontSize: 14, fontWeight: 700,
        color: accent, marginBottom: 12, letterSpacing: 1,
        textTransform: "uppercase" as const,
      }}>
        {title}
      </div>
      {items.map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10,
          marginBottom: 8, fontFamily: FONT, fontSize: 15, color: COLORS.gray,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0 }} />
          {item}
        </div>
      ))}
    </div>
  );
};

// ──────────────────────────────────────────────
// COMPONENT: Metric Card
// ──────────────────────────────────────────────
const MetricCard: React.FC<{ value: string; label: string; frame: number; delay: number; fps: number }> = ({
  value, label, frame, delay, fps,
}) => {
  const prog = spring({ frame: frame - delay, fps, config: { stiffness: 150, damping: 20 } });
  return (
    <div style={{
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.primary}33`,
      borderRadius: 20,
      padding: "28px 36px",
      textAlign: "center",
      boxShadow: `0 0 40px ${COLORS.primary}18`,
      transform: `translateY(${(1 - prog) * 40}px)`,
      opacity: prog,
    }}>
      <div style={{
        fontFamily: FONT, fontSize: 52, fontWeight: 800,
        background: COLORS.gradBrand,
        WebkitBackgroundClip: "text" as any,
        WebkitTextFillColor: "transparent" as any,
        lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 16, color: COLORS.gray, marginTop: 8 }}>
        {label}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// CENA 1 — 0:00 → 0:08 (0–240 frames @ 30fps)
// "What if building software felt as effortless as having an idea?"
// ──────────────────────────────────────────────
const Scene1: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const line1 = "What if building software";
  const line2 = "felt as effortless as";
  const line3 = "having an idea?";

  const wordsByLine = [line1, line2, line3];

  return (
    <AbsoluteFill style={{ background: COLORS.gradDark, overflow: "hidden" }}>
      <GridBg opacity={fadeIn(frame, 0, 30)} />
      <GlowOrb x="30%" y="30%" color={COLORS.primary} size={600} opacity={0.12} />
      <GlowOrb x="70%" y="70%" color={COLORS.cyan} size={500} opacity={0.10} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 8 }}>
        {/* Badge */}
        <div style={{ opacity: fadeIn(frame, 10, 20), marginBottom: 32 }}>
          <Badge text="AI-Powered Platform" />
        </div>

        {/* Headline */}
        {wordsByLine.map((line, li) => (
          <div key={li} style={{
            overflow: "hidden",
            opacity: fadeIn(frame, 20 + li * 18, 20),
            transform: `translateY(${slideUp(frame, 20 + li * 18)}px)`,
          }}>
            <div style={{
              fontFamily: FONT,
              fontSize: li === 2 ? 80 : 74,
              fontWeight: 800,
              color: li === 2 ? "transparent" : COLORS.white,
              background: li === 2 ? COLORS.gradBrand : "none",
              WebkitBackgroundClip: li === 2 ? "text" as any : "unset",
              WebkitTextFillColor: li === 2 ? "transparent" as any : COLORS.white,
              lineHeight: 1.1,
              textAlign: "center",
              letterSpacing: -2,
            }}>
              {line}
            </div>
          </div>
        ))}

        {/* Subtext */}
        <div style={{
          fontFamily: FONT, fontSize: 22, color: COLORS.gray,
          marginTop: 28, opacity: fadeIn(frame, 80, 20),
          textAlign: "center", maxWidth: 700,
        }}>
          Deploy your AI assistant in under 60 seconds.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────
// CENA 2 — 0:08 → 0:18 (240–540 frames)
// Logo + grade digital 3D abstrata
// ──────────────────────────────────────────────
const Scene2: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const lf = frame; // local frame
  const logoScale = spring({ frame: lf, fps, config: { stiffness: 100, damping: 15 } });
  const ringProg  = spring({ frame: lf - 10, fps, config: { stiffness: 80, damping: 14 } });

  // Anel pulsando
  const pulse = 1 + Math.sin(lf / 15) * 0.04;

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      <GridBg opacity={0.8} />

      {/* Orbs de fundo */}
      <GlowOrb x="50%" y="50%" color={COLORS.primary} size={700} opacity={0.15} />
      <GlowOrb x="20%" y="80%" color={COLORS.cyan} size={400} opacity={0.08} />

      {/* Anéis concêntricos */}
      {[320, 480, 640, 800].map((size, i) => (
        <div key={i} style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: size * ringProg,
          height: size * ringProg,
          borderRadius: "50%",
          border: `1px solid ${i % 2 === 0 ? COLORS.primary : COLORS.cyan}${Math.round((0.3 - i * 0.06) * 255).toString(16).padStart(2, "0")}`,
          transform: "translate(-50%, -50%) rotate(" + (lf * (i % 2 === 0 ? 0.3 : -0.2)) + "deg)",
          opacity: ringProg,
        }} />
      ))}

      {/* Logo central */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{
          transform: `scale(${logoScale * pulse})`,
          opacity: logoScale,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          {/* Ícone */}
          <div style={{
            width: 100, height: 100,
            background: COLORS.gradBrand,
            borderRadius: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 60px ${COLORS.primary}66, 0 0 120px ${COLORS.cyan}33`,
            marginBottom: 24,
            fontSize: 52,
          }}>
            ⚡
          </div>

          {/* Nome */}
          <div style={{
            fontFamily: FONT, fontSize: 64, fontWeight: 800,
            color: COLORS.white, letterSpacing: -2, lineHeight: 1,
          }}>
            my<span style={{
              background: COLORS.gradBrand,
              WebkitBackgroundClip: "text" as any,
              WebkitTextFillColor: "transparent" as any,
            }}>QuickClaw</span>
          </div>

          <div style={{
            fontFamily: FONT, fontSize: 20, color: COLORS.gray,
            marginTop: 12, letterSpacing: 2, textTransform: "uppercase" as const,
          }}>
            OpenClaw · Deploy em 1 Clique
          </div>
        </div>

        {/* Stats abaixo */}
        <div style={{
          display: "flex", gap: 48, marginTop: 60,
          opacity: fadeIn(frame, 40, 25),
        }}>
          {[["180+", "Bots ativos"], ["99.9%", "Uptime"], ["< 60s", "Deploy"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: FONT, fontSize: 36, fontWeight: 800,
                background: COLORS.gradBrand,
                WebkitBackgroundClip: "text" as any,
                WebkitTextFillColor: "transparent" as any,
              }}>{v}</div>
              <div style={{ fontFamily: FONT, fontSize: 14, color: COLORS.gray, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────
// CENA 3 — 0:18 → 0:29 (540–870 frames)
// Split: prompt digitando | UI sendo gerada
// ──────────────────────────────────────────────
const Scene3: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const lf = frame;

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      <GridBg opacity={0.5} />
      <GlowOrb x="25%" y="50%" color={COLORS.primary} size={500} opacity={0.12} />
      <GlowOrb x="75%" y="50%" color={COLORS.cyan} size={500} opacity={0.12} />

      {/* Linha divisória central */}
      <div style={{
        position: "absolute", left: "50%", top: "10%", bottom: "10%",
        width: 1,
        background: `linear-gradient(180deg, transparent, ${COLORS.primary}88, ${COLORS.cyan}88, transparent)`,
        opacity: fadeIn(lf, 5, 20),
      }} />

      {/* LADO ESQUERDO — Prompt */}
      <div style={{
        position: "absolute", left: 0, top: 0, right: "50%", bottom: 0,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "0 60px",
        opacity: fadeIn(lf, 0, 25),
      }}>
        <Badge text="Prompt" color={COLORS.primary} />
        <div style={{ marginTop: 32, fontFamily: FONT, fontSize: 26, color: COLORS.gray, marginBottom: 24 }}>
          Just describe what you want:
        </div>

        {/* Terminal box */}
        <div style={{
          background: "rgba(10, 12, 25, 0.95)",
          border: `1px solid ${COLORS.primary}55`,
          borderRadius: 16,
          padding: "24px 28px",
          width: "100%",
          boxShadow: `0 0 40px ${COLORS.primary}22`,
        }}>
          {/* Dots */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["#FF5F57", "#FFBD2E", "#28CA42"].map((c) => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
            ))}
          </div>

          {["Quero um bot no Telegram", "que responde em português", "usando Claude Sonnet", "deploy automático ⚡"].map((line, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              {lf > i * 18 && (
                <TypingText text={line} frame={lf} startFrame={i * 18} fps={fps} />
              )}
            </div>
          ))}

          {/* Enter key indicator */}
          <div style={{
            marginTop: 16,
            opacity: fadeIn(lf, 80, 20),
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{
              background: COLORS.primary,
              color: COLORS.white,
              fontFamily: FONT, fontSize: 13, fontWeight: 700,
              padding: "6px 14px", borderRadius: 8,
              letterSpacing: 1,
            }}>
              DEPLOY →
            </div>
          </div>
        </div>
      </div>

      {/* LADO DIREITO — UI gerada */}
      <div style={{
        position: "absolute", left: "50%", top: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        gap: 16, padding: "0 40px",
      }}>
        <Badge text="Gerado por IA" color={COLORS.cyan} />
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <UICard
            title="Canal" items={["Telegram ✓", "WhatsApp ✓", "Discord ✓"]}
            accent={COLORS.cyan} delay={15} frame={lf} fps={fps}
          />
          <UICard
            title="Modelo de IA" items={["Claude Sonnet 4", "GPT-4o", "Gemini 2.0"]}
            accent={COLORS.primary} delay={30} frame={lf} fps={fps}
          />
          <UICard
            title="Deploy" items={["✅ Container isolado", "✅ 99.9% uptime", "✅ Pronto em 47s"]}
            accent={COLORS.cyan} delay={45} frame={lf} fps={fps}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────
// CENA 4 — 0:29 → 0:40 (870–1200 frames)
// Montagem rápida: edit → refine → scale
// ──────────────────────────────────────────────
const Scene4: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const lf = frame;
  const totalFrames = 330;
  const segDur = Math.floor(totalFrames / 3);

  const segments = [
    { label: "EDIT", desc: "Personalize o comportamento", icon: "✏️", color: COLORS.primary },
    { label: "REFINE", desc: "Ajuste o modelo e skills", icon: "🎯", color: COLORS.cyan },
    { label: "SCALE", desc: "Cresça sem limites", icon: "📈", color: "#A78BFA" },
  ];

  const currentSeg = Math.min(2, Math.floor(lf / segDur));
  const seg = segments[currentSeg];
  const segFrame = lf % segDur;

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      <GridBg opacity={0.4} />
      <GlowOrb x="50%" y="50%" color={seg.color} size={800} opacity={0.10} />

      {/* Step indicators */}
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 32,
      }}>
        {segments.map((s, i) => (
          <div key={i} style={{
            fontFamily: FONT, fontSize: 14, fontWeight: 700,
            color: i === currentSeg ? s.color : COLORS.dimmed,
            letterSpacing: 2,
            borderBottom: i === currentSeg ? `2px solid ${s.color}` : "2px solid transparent",
            paddingBottom: 8,
            transition: "all 0.3s",
          }}>
            {`0${i + 1}. ${s.label}`}
          </div>
        ))}
      </div>

      {/* Conteúdo da cena atual */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{
          fontSize: 120,
          opacity: spring({ frame: segFrame, fps, config: { stiffness: 200, damping: 20 } }),
          transform: `scale(${spring({ frame: segFrame, fps, config: { stiffness: 200, damping: 20 } })})`,
        }}>
          {seg.icon}
        </div>

        <div style={{
          fontFamily: FONT, fontSize: 72, fontWeight: 800,
          color: seg.color, marginTop: 24,
          opacity: fadeIn(segFrame, 5, 15),
          letterSpacing: -2,
        }}>
          {seg.label}
        </div>

        <div style={{
          fontFamily: FONT, fontSize: 28, color: COLORS.gray,
          marginTop: 16, opacity: fadeIn(segFrame, 15, 20),
        }}>
          {seg.desc}
        </div>

        {/* Barra de progresso da cena */}
        <div style={{
          marginTop: 60, width: 400, height: 4,
          background: "rgba(255,255,255,0.1)", borderRadius: 2,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${(segFrame / segDur) * 100}%`,
            background: seg.color,
            borderRadius: 2,
            boxShadow: `0 0 10px ${seg.color}`,
          }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────
// CENA 5 — 0:40 → 0:53 (1200–1590 frames)
// CTA final
// ──────────────────────────────────────────────
const Scene5: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const lf = frame;
  const logoScale = spring({ frame: lf, fps, config: { stiffness: 80, damping: 14 } });
  const btnPulse = 1 + Math.sin(lf / 20) * 0.03;

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      <GridBg opacity={0.6} />
      <GlowOrb x="50%" y="35%" color={COLORS.primary} size={700} opacity={0.15} />
      <GlowOrb x="50%" y="70%" color={COLORS.cyan} size={500} opacity={0.10} />

      {/* Anéis decorativos */}
      {[200, 380, 560].map((size, i) => (
        <div key={i} style={{
          position: "absolute", left: "50%", top: "38%",
          width: size, height: size,
          borderRadius: "50%",
          border: `1px solid ${i % 2 === 0 ? COLORS.primary : COLORS.cyan}28`,
          transform: `translate(-50%, -50%) rotate(${lf * (i % 2 === 0 ? 0.2 : -0.15)}deg)`,
          opacity: fadeIn(lf, i * 8, 20),
        }} />
      ))}

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        {/* Logo */}
        <div style={{
          transform: `scale(${logoScale})`,
          opacity: logoScale,
          display: "flex", flexDirection: "column", alignItems: "center",
          marginBottom: 40,
        }}>
          <div style={{
            width: 80, height: 80,
            background: COLORS.gradBrand,
            borderRadius: 22,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 50px ${COLORS.primary}66`,
            fontSize: 40, marginBottom: 20,
          }}>⚡</div>

          <div style={{
            fontFamily: FONT, fontSize: 52, fontWeight: 800,
            color: COLORS.white, letterSpacing: -1.5,
          }}>
            my<span style={{
              background: COLORS.gradBrand,
              WebkitBackgroundClip: "text" as any,
              WebkitTextFillColor: "transparent" as any,
            }}>QuickClaw</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{
          opacity: fadeIn(lf, 25, 25),
          transform: `translateY(${slideUp(lf, 25)}px)`,
        }}>
          <div style={{
            fontFamily: FONT, fontSize: 58, fontWeight: 800,
            color: COLORS.white, textAlign: "center",
            lineHeight: 1.1, letterSpacing: -2, marginBottom: 16,
          }}>
            Start building with
          </div>
          <div style={{
            fontFamily: FONT, fontSize: 68, fontWeight: 900,
            background: COLORS.gradBrand,
            WebkitBackgroundClip: "text" as any,
            WebkitTextFillColor: "transparent" as any,
            textAlign: "center",
            lineHeight: 1, letterSpacing: -3,
          }}>
            myQuickClaw
          </div>
        </div>

        {/* CTA Button */}
        <div style={{
          marginTop: 56,
          opacity: fadeIn(lf, 50, 25),
          transform: `scale(${btnPulse})`,
        }}>
          <div style={{
            background: COLORS.gradBrand,
            borderRadius: 100,
            padding: "22px 64px",
            fontFamily: FONT, fontSize: 24, fontWeight: 700,
            color: COLORS.white,
            boxShadow: `0 0 60px ${COLORS.primary}66, 0 8px 32px rgba(0,0,0,0.4)`,
            letterSpacing: 0.5,
            cursor: "pointer",
          }}>
            ⚡ Deploy em 1 Clique          </div>
        </div>

        {/* URL */}
        <div style={{
          marginTop: 28,
          opacity: fadeIn(lf, 70, 25),
          fontFamily: FONT, fontSize: 18, color: COLORS.gray,
          letterSpacing: 1,
        }}>
          myquickclaw.com · A partir de R$ 67/mês
        </div>

        {/* Plataformas */}
        <div style={{
          display: "flex", gap: 20, marginTop: 32,
          opacity: fadeIn(lf, 80, 20),
        }}>
          {["Telegram", "WhatsApp", "Discord", "Claude", "GPT", "Gemini"].map((p) => (
            <div key={p} style={{
              fontFamily: FONT, fontSize: 13, fontWeight: 600,
              color: COLORS.dimmed,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, padding: "6px 14px",
            }}>
              {p}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────
// COMPOSIÇÃO PRINCIPAL — 53 segundos @ 30fps
// ──────────────────────────────────────────────
interface MyQuickClawAdProps {
  // sem props obrigatórias
}

export const MyQuickClawAd: React.FC<MyQuickClawAdProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Tempos em frames (30fps)
  const SCENE1_START = 0;    const SCENE1_END = 240;   // 0:00 → 0:08
  const SCENE2_START = 225;  const SCENE2_END = 540;   // 0:07.5 → 0:18  (overlap 15f)
  const SCENE3_START = 525;  const SCENE3_END = 870;   // 0:17.5 → 0:29  (overlap 15f)
  const SCENE4_START = 855;  const SCENE4_END = 1200;  // 0:28.5 → 0:40  (overlap 15f)
  const SCENE5_START = 1185; const SCENE5_END = 1590;  // 0:39.5 → 0:53  (overlap 15f)

  // Transição cross-fade entre cenas
  const crossFade = (start: number, end: number, overlapEnd: number) => {
    if (frame < start) return 0;
    if (frame < end - 15) return 1;
    return interpolate(frame, [end - 15, overlapEnd], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* CENA 1 */}
      <Sequence from={SCENE1_START} durationInFrames={SCENE1_END + 15}>
        <AbsoluteFill style={{ opacity: crossFade(SCENE1_START, SCENE1_END, SCENE2_START + 15) }}>
          <Scene1 frame={frame - SCENE1_START} fps={fps} />
        </AbsoluteFill>
      </Sequence>

      {/* CENA 2 */}
      <Sequence from={SCENE2_START} durationInFrames={SCENE2_END - SCENE2_START + 15}>
        <AbsoluteFill style={{
          opacity: interpolate(frame, [SCENE2_START, SCENE2_START + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            * crossFade(SCENE2_START, SCENE2_END, SCENE3_START + 15),
        }}>
          <Scene2 frame={frame - SCENE2_START} fps={fps} />
        </AbsoluteFill>
      </Sequence>

      {/* CENA 3 */}
      <Sequence from={SCENE3_START} durationInFrames={SCENE3_END - SCENE3_START + 15}>
        <AbsoluteFill style={{
          opacity: interpolate(frame, [SCENE3_START, SCENE3_START + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            * crossFade(SCENE3_START, SCENE3_END, SCENE4_START + 15),
        }}>
          <Scene3 frame={frame - SCENE3_START} fps={fps} />
        </AbsoluteFill>
      </Sequence>

      {/* CENA 4 */}
      <Sequence from={SCENE4_START} durationInFrames={SCENE4_END - SCENE4_START + 15}>
        <AbsoluteFill style={{
          opacity: interpolate(frame, [SCENE4_START, SCENE4_START + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            * crossFade(SCENE4_START, SCENE4_END, SCENE5_START + 15),
        }}>
          <Scene4 frame={frame - SCENE4_START} fps={fps} />
        </AbsoluteFill>
      </Sequence>

      {/* CENA 5 */}
      <Sequence from={SCENE5_START} durationInFrames={SCENE5_END - SCENE5_START}>
        <AbsoluteFill style={{
          opacity: interpolate(frame, [SCENE5_START, SCENE5_START + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <Scene5 frame={frame - SCENE5_START} fps={fps} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
