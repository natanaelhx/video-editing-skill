import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Audio,
} from "remotion";

// ──────────────────────────────────────────────
// DESIGN TOKENS
// ──────────────────────────────────────────────
const COLORS = {
  bg: "#080B14",
  surface: "#0F1628",
  primary: "#6C63FF",
  cyan: "#00D4AA",
  white: "#FFFFFF",
  gray: "#A0AEC0",
  dimmed: "#4A5568",
  whatsappGreen: "#25D366",
  whatsappDark: "#111B21",
  whatsappText: "#E5E5EA",
};

const F = "'Inter', sans-serif";
const MONO = "'JetBrains Mono', monospace";

// ──────────────────────────────────────────────
// iPhone Frame Component
// ──────────────────────────────────────────────
const IPhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      height: 800,
      background: "#000",
      borderRadius: 50,
      border: "12px solid #000",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 1px #333",
      overflow: "hidden",
    }}
  >
    {/* Notch */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 150,
        height: 30,
        background: "#000",
        borderRadius: "0 0 30px 30px",
        zIndex: 10,
      }}
    />
    {/* Screen content */}
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLORS.whatsappDark,
        paddingTop: 40,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

// ──────────────────────────────────────────────
// WhatsApp Chat Bubble
// ──────────────────────────────────────────────
const ChatBubble: React.FC<{
  message: string;
  sender: "user" | "bot";
  delay: number;
  frame: number;
  fps: number;
}> = ({ message, sender, delay, frame, fps }) => {
  const isVisible = frame >= delay;
  const slideProgress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  if (!isVisible) return null;

  const isUser = sender === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 12,
        paddingHorizontal: 12,
        transform: `translateX(${(1 - slideProgress) * (isUser ? 100 : -100)}px)`,
        opacity: slideProgress,
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "8px 12px",
          borderRadius: 18,
          background: isUser ? COLORS.whatsappGreen : COLORS.surface,
          color: isUser ? "#000" : COLORS.whatsappText,
          fontFamily: F,
          fontSize: 14,
          lineHeight: 1.4,
          fontWeight: 500,
          wordWrap: "break-word",
          boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        {message}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// WhatsApp Header
// ──────────────────────────────────────────────
const WhatsAppHeader: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 16px",
      borderBottom: `1px solid #1f2937`,
      background: COLORS.whatsappDark,
    }}
  >
    {/* Avatar */}
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: COLORS.whatsappGreen,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
      }}
    >
      ⚡
    </div>
    {/* Info */}
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, color: COLORS.white, fontSize: 14 }}>
        myQuickClaw Bot
      </div>
      <div style={{ fontSize: 12, color: COLORS.dimmed, marginTop: 2 }}>
        online
      </div>
    </div>
  </div>
);

// ──────────────────────────────────────────────
// Website Header (Background)
// ──────────────────────────────────────────────
const WebsiteHeader: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 100,
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.cyan} 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      fontSize: 32,
      fontWeight: 800,
      color: COLORS.white,
      zIndex: 0,
    }}
  >
    ⚡ myQuickClaw
  </div>
);

// ──────────────────────────────────────────────
// CENA 1: Website + iPhone Mockup (0:00 - 0:05)
// ──────────────────────────────────────────────
const Scene1: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const fadeIn = spring({ frame: Math.max(0, frame), fps, config: { damping: 20, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Background: Website */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: "50%",
          bottom: 0,
          background: `linear-gradient(135deg, ${COLORS.primary}22 0%, ${COLORS.cyan}11 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeIn,
        }}
      >
        <WebsiteHeader />
        <div style={{ marginTop: 120, textAlign: "center", color: COLORS.white, fontFamily: F }}>
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
            Deploy em 1 Clique
          </div>
          <div style={{ fontSize: 16, color: COLORS.gray, maxWidth: 300 }}>
            Seu bot de IA no ar em menos de 60 segundos. Sem código.
          </div>
        </div>
      </div>

      {/* iPhone Mockup */}
      <IPhoneFrame>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            opacity: fadeIn,
          }}
        >
          <WhatsAppHeader />
          <div style={{ flex: 1, overflow: "hidden", padding: "8px 0" }} />
        </div>
      </IPhoneFrame>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────
// CENA 2: iPhone WhatsApp Chat (0:05 - 0:30)
// ──────────────────────────────────────────────
const Scene2: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const chatMessages = [
    { text: "Oi! Quero criar um bot para meu negócio", sender: "user" as const, delay: 30 },
    { text: "👋 Olá! Bem-vindo ao myQuickClaw!", sender: "bot" as const, delay: 45 },
    { text: "Posso ajudar. Qual tipo de bot você precisa?", sender: "bot" as const, delay: 60 },
    { text: "Um que responde perguntas sobre meu produto", sender: "user" as const, delay: 80 },
    { text: "Perfeito! Deixe-me configurar isso...", sender: "bot" as const, delay: 100 },
    { text: "✅ Bot criado! Ele está pronto em 47 segundos", sender: "bot" as const, delay: 130 },
    { text: "Já posso começar a usar?", sender: "user" as const, delay: 155 },
    { text: "✅ Sim! Está ativo no seu WhatsApp agora", sender: "bot" as const, delay: 170 },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Background fade */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          background: COLORS.surface,
          opacity: 0.3,
        }}
      />

      {/* iPhone */}
      <IPhoneFrame>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <WhatsAppHeader />

          {/* Chat */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {chatMessages.map((msg, i) => (
              <ChatBubble key={i} {...msg} frame={frame} fps={fps} />
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "8px 12px",
              borderTop: `1px solid #1f2937`,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Mensagem..."
              style={{
                flex: 1,
                background: COLORS.surface,
                border: "none",
                borderRadius: 20,
                padding: "8px 12px",
                color: COLORS.white,
                fontSize: 14,
                fontFamily: F,
              }}
              disabled
            />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: COLORS.whatsappGreen,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ➤
            </div>
          </div>
        </div>
      </IPhoneFrame>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────
// CENA 3: Features Grid (0:30 - 0:45)
// ──────────────────────────────────────────────
const Scene3: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const features = [
    { icon: "💬", label: "Telegram", desc: "Bots inteligentes" },
    { icon: "📱", label: "WhatsApp", desc: "Suporte 24/7" },
    { icon: "💻", label: "Discord", desc: "Comunidades" },
    { icon: "🤖", label: "Claude/GPT", desc: "IA poderosa" },
    { icon: "⚡", label: "1 Minuto", desc: "Deploy rápido" },
    { icon: "💰", label: "Acessível", desc: "A partir de R$ 67" },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          maxWidth: 800,
          padding: 40,
        }}
      >
        {features.map((f, i) => {
          const prog = spring({
            frame: Math.max(0, frame - i * 15),
            fps,
            config: { damping: 15, stiffness: 100 },
          });

          return (
            <div
              key={i}
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.primary}44`,
                borderRadius: 16,
                padding: 24,
                textAlign: "center",
                transform: `scale(${prog}) translateY(${(1 - prog) * 30}px)`,
                opacity: prog,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.white, marginBottom: 6 }}>
                {f.label}
              </div>
              <div style={{ fontSize: 12, color: COLORS.gray }}>{f.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────
// CENA 4: CTA Final (0:45 - 0:53)
// ──────────────────────────────────────────────
const Scene4: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const logoScale = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 14, stiffness: 80 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: 80,
          transform: `scale(${logoScale})`,
          opacity: logoScale,
        }}
      >
        ⚡
      </div>

      {/* Headline */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: COLORS.white, marginBottom: 12 }}>
          myQuickClaw
        </div>
        <div
          style={{
            fontSize: 24,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.cyan})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Deploy em 1 Clique
        </div>
      </div>

      {/* URL */}
      <div style={{ fontSize: 16, color: COLORS.gray, marginTop: 20 }}>
        myquickclaw.com
      </div>

      {/* CTA Button */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.cyan})`,
          borderRadius: 100,
          padding: "14px 40px",
          fontSize: 16,
          fontWeight: 700,
          color: COLORS.white,
          marginTop: 20,
          boxShadow: `0 0 40px ${COLORS.primary}66`,
        }}
      >
        Comece Agora
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────
// MAIN COMPOSITION — 53 segundos @ 30fps
// ──────────────────────────────────────────────
interface MyQuickClawDemoProps {}

export const MyQuickClawDemo: React.FC<MyQuickClawDemoProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const SCENE1_FRAMES = 150; // 0:00 - 0:05
  const SCENE2_FRAMES = 750; // 0:05 - 0:30
  const SCENE3_FRAMES = 450; // 0:30 - 0:45
  const SCENE4_FRAMES = 240; // 0:45 - 0:53

  return (
    <AbsoluteFill>
      {/* Cena 1 */}
      <Sequence from={0} durationInFrames={SCENE1_FRAMES + 30}>
        <AbsoluteFill
          style={{
            opacity: interpolate(frame, [SCENE1_FRAMES - 15, SCENE1_FRAMES + 15], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Scene1 frame={frame} fps={fps} />
        </AbsoluteFill>
      </Sequence>

      {/* Cena 2 */}
      <Sequence from={SCENE1_FRAMES} durationInFrames={SCENE2_FRAMES + 30}>
        <AbsoluteFill
          style={{
            opacity: interpolate(
              frame,
              [SCENE1_FRAMES, SCENE1_FRAMES + 20, SCENE1_FRAMES + SCENE2_FRAMES - 15, SCENE1_FRAMES + SCENE2_FRAMES + 15],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <Scene2 frame={frame - SCENE1_FRAMES} fps={fps} />
        </AbsoluteFill>
      </Sequence>

      {/* Cena 3 */}
      <Sequence from={SCENE1_FRAMES + SCENE2_FRAMES} durationInFrames={SCENE3_FRAMES + 30}>
        <AbsoluteFill
          style={{
            opacity: interpolate(
              frame,
              [SCENE1_FRAMES + SCENE2_FRAMES, SCENE1_FRAMES + SCENE2_FRAMES + 20, SCENE1_FRAMES + SCENE2_FRAMES + SCENE3_FRAMES - 15],
              [0, 1, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <Scene3 frame={frame - (SCENE1_FRAMES + SCENE2_FRAMES)} fps={fps} />
        </AbsoluteFill>
      </Sequence>

      {/* Cena 4 */}
      <Sequence from={SCENE1_FRAMES + SCENE2_FRAMES + SCENE3_FRAMES} durationInFrames={SCENE4_FRAMES}>
        <AbsoluteFill
          style={{
            opacity: interpolate(
              frame,
              [SCENE1_FRAMES + SCENE2_FRAMES + SCENE3_FRAMES, SCENE1_FRAMES + SCENE2_FRAMES + SCENE3_FRAMES + 20],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <Scene4 frame={frame - (SCENE1_FRAMES + SCENE2_FRAMES + SCENE3_FRAMES)} fps={fps} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
