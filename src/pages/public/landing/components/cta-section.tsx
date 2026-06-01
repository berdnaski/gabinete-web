import { useNavigate } from "react-router-dom"
import { ArrowRight, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useInView } from "../hooks/use-in-view"

export function CTASection() {
  const navigate = useNavigate()
  const { ref, visible } = useInView()

  return (
    <section className="py-28 bg-background">
      <div ref={ref} className="max-w-4xl mx-auto px-5 sm:px-8">
        <div
          className={cn(
            "relative rounded-3xl overflow-hidden bg-foreground",
            "transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[480px] rounded-full bg-primary/25 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-16 right-1/4 size-56 rounded-full bg-primary/10 blur-[56px] pointer-events-none" />

          <div className="relative px-8 sm:px-16 py-16 sm:py-20 flex flex-col items-center text-center gap-6">
            <div className="inline-flex items-center gap-2 border border-background/10 rounded-full px-3.5 py-1.5 bg-background/5 backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-2xs font-semibold uppercase tracking-widest text-background/40">
                Comece hoje mesmo
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-background leading-[1.1] max-w-lg">
              Pronto para transformar seu mandato?
            </h2>

            <p className="text-sm text-background/50 max-w-sm leading-relaxed">
              Sem cartão de crédito. Configuração em minutos.<br className="hidden sm:block" />
              Suporte humano desde o primeiro dia.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                onClick={() => navigate("/sign-up")}
                className="cursor-pointer inline-flex items-center gap-2 bg-background text-foreground font-semibold rounded-lg px-6 py-3 text-sm hover:bg-background/90 active:scale-95 transition-all duration-150 shadow-sm"
              >
                Começar grátis
                <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => navigate("/sign-up")}
                className="cursor-pointer inline-flex items-center gap-2 bg-background/5 border border-background/10 text-background/70 font-medium rounded-lg px-6 py-3 text-sm hover:bg-background/10 hover:text-background/90 active:scale-95 transition-all duration-150"
              >
                <MessageCircle className="size-4" />
                Falar com o CEO
              </button>
            </div>

            <p className="text-2xs text-background/25 tracking-wide mt-1">
              Sem cartão de crédito · Cancele quando quiser
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
