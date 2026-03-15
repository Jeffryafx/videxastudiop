/*
 * VIDEXA STUDIO — Process Section
 * Design: Horizontal numbered steps with connecting line, dark surface background
 */

import { MessageSquare, FileVideo, Wand2, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Brief",
    description: "Nos cuentas tu vision, objetivos y referencias. Definimos el estilo y alcance del proyecto.",
    color: "#00E5A0",
  },
  {
    number: "02",
    icon: FileVideo,
    title: "Material",
    description: "Nos envias el material raw. Aceptamos cualquier formato de video, audio e imagenes.",
    color: "#22D3EE",
  },
  {
    number: "03",
    icon: Wand2,
    title: "Edicion",
    description: "Nuestro equipo edita con precision. Motion graphics, captions y color grading incluidos.",
    color: "#7C5CFC",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Entrega",
    description: "Recibes tu video en 48h. Incluye hasta 2 rondas de revision sin costo adicional.",
    color: "#00E5A0",
  },
];

export default function ProcessSection() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "#0E1220" }}
    >
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="section-label block mb-3">Como trabajamos</span>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 2.5rem)",
              color: "#EEF0F7",
              letterSpacing: "-0.01em",
            }}
          >
            Proceso simple, resultados profesionales
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden md:block absolute top-12 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #252D42 20%, #252D42 80%, transparent)" }}
          />

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="reveal flex flex-col items-center text-center"
                  style={{ transitionDelay: `${index * 0.12}s` }}
                >
                  {/* Number + Icon circle */}
                  <div className="relative mb-6">
                    {/* Outer ring */}
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center"
                      style={{
                        background: "#1C2335",
                        border: `1px solid ${step.color}30`,
                        boxShadow: `0 0 30px ${step.color}15`,
                      }}
                    >
                      <Icon size={28} style={{ color: step.color }} />
                    </div>
                    {/* Step number badge */}
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}, ${step.color}aa)`,
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        color: "#080B12",
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      {step.number}
                    </div>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      color: "#EEF0F7",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-[#6B7494] text-sm leading-relaxed"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
