import { useState, useMemo } from "react";
import { Mail, Instagram, MessageCircle, Send, CheckCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const servicesQuery = trpc.services.list.useQuery();
  const services = servicesQuery.data || [];

  const selectedService = useMemo(() => {
    if (!formData.service) return null;
    return services.find((s: any) => s.id === parseInt(formData.service));
  }, [formData.service, services]);

  const createQuoteMutation = trpc.quotes.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("¡Cotización enviada! Te contactaremos pronto.");
      setTimeout(() => setSubmitted(false), 5000);
      setFormData({ name: "", email: "", service: "", message: "" });
    },
    onError: (err) => {
      toast.error(err.message || "Error al enviar la cotización");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.service || !formData.message) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    createQuoteMutation.mutate({
      serviceId: parseInt(formData.service) || 1,
      title: formData.name,
      description: formData.message,
      estimatedPrice: undefined,
    });
  };

  return (
    <section
      id="contacto"
      className="relative py-24 overflow-hidden"
      style={{ background: "#0E1220" }}
    >
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div
        className="glow-orb"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(0,229,160,0.08) 0%, transparent 70%)",
          bottom: "-100px",
          left: "-100px",
        }}
      />

      <div className="container relative z-10">
        {}
        <div className="text-center mb-16 reveal">
          <span className="section-label block mb-3">Hablemos</span>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 2.5rem)",
              color: "#EEF0F7",
              letterSpacing: "-0.01em",
            }}
          >
            Cotizar ahora
          </h2>
          <p
            className="text-[#6B7494] mt-4 max-w-lg mx-auto"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1rem", lineHeight: 1.7 }}
          >
            Cuéntanos sobre tu proyecto y te respondemos en menos de 24 horas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {}
          <div className="reveal-left flex flex-col gap-8">
            <div>
              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  color: "#EEF0F7",
                  marginBottom: "1rem",
                }}
              >
                Contacto directo
              </h3>
              <p
                className="text-[#6B7494] leading-relaxed"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Estamos disponibles para proyectos de cualquier tamaño. Desde un reel hasta un paquete mensual completo.
              </p>
            </div>

            {}
            <div className="flex flex-col gap-4">
              {[
                { icon: Mail, label: "Email", value: "jeffry.editor06@gmail.com", color: "#00E5A0" },
                { icon: Instagram, label: "Instagram", value: "@videxa.studio", color: "#7C5CFC" },
                { icon: MessageCircle, label: "WhatsApp", value: "+57 300 649 3668", color: "#22D3EE" },
              ].map((contact) => {
                const Icon = contact.icon;
                return (
                  <div
                    key={contact.label}
                    className="flex items-center gap-4 p-4 rounded-xl border border-[#252D42] transition-all duration-200 hover:border-[#00E5A0]/30 group"
                    style={{ background: "#1C2335" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${contact.color}15` }}
                    >
                      <Icon size={18} style={{ color: contact.color }} />
                    </div>
                    <div>
                      <div
                        className="text-[#6B7494] text-xs mb-0.5"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}
                      >
                        {contact.label}
                      </div>
                      <div
                        className="text-[#EEF0F7] text-sm font-medium group-hover:text-[#00E5A0] transition-colors"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {contact.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {}
            <div
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{ background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.15)" }}
            >
              <div className="w-2 h-2 rounded-full bg-[#00E5A0] animate-pulse flex-shrink-0" />
              <p
                className="text-[#6B7494] text-sm"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Tiempo de respuesta promedio:{" "}
                <span className="text-[#00E5A0] font-semibold">menos de 4 horas</span>
              </p>
            </div>
          </div>

          {}
          <div className="reveal-right">
            <div
              className="p-8 rounded-2xl border border-[#252D42]"
              style={{ background: "#1C2335" }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,229,160,0.15)" }}
                  >
                    <CheckCircle size={32} style={{ color: "#00E5A0" }} />
                  </div>
                  <h3
                    style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "#EEF0F7" }}
                  >
                    Mensaje enviado
                  </h3>
                  <p
                    className="text-[#6B7494] text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Te respondemos en menos de 24 horas. Gracias por contactarnos.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-[#6B7494] text-xs font-semibold"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}
                      >
                        Tu nombre
                      </label>
                      <input
                        type="text"
                        placeholder="Nombre Completo"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="videxa-input"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-[#6B7494] text-xs font-semibold"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="hola@videxa.studio"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="videxa-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[#6B7494] text-xs font-semibold"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}
                    >
                      Servicio
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="videxa-input"
                      required
                      style={{ appearance: "none" }}
                      disabled={servicesQuery.isLoading}
                    >
                      <option value="" disabled>{servicesQuery.isLoading ? "Cargando..." : "Selecciona un servicio..."}</option>
                      {services.map((service: any) => (
                        <option key={service.id} value={service.id.toString()}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                    {selectedService && (
                      <div
                        className="p-3 rounded-lg flex items-center justify-between"
                        style={{ background: "rgba(0, 229, 160, 0.1)", border: "1px solid rgba(0, 229, 160, 0.3)" }}
                      >
                        <span className="text-[#6B7494] text-sm">{selectedService.description}</span>
                        <span className="text-[#00E5A0] font-bold text-lg ml-4 whitespace-nowrap">
                          ${selectedService.basePrice}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[#6B7494] text-xs font-semibold"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}
                    >
                      Mensaje
                    </label>
                    <textarea
                      placeholder="Cuéntanos sobre tu proyecto, plataforma objetivo, referencias de estilo..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="videxa-input resize-none"
                      rows={4}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createQuoteMutation.isPending}
                    className="btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createQuoteMutation.isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Enviar cotización
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
