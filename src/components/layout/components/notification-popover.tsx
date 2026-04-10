import { useState, useMemo } from "react";
import { 
  Bell, 
  Check, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2,
  X,
  ChevronDown
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { type Notification, type NotificationType } from "@/api/notifications";

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Nova demanda de Iluminação",
    message: "Uma nova demanda de iluminação foi aberta para o seu gabinete.",
    type: "SUCCESS",
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    userId: "user-1",
  },
  {
    id: "2",
    title: "Atualização de Status",
    message: "A demanda #123 foi marcada como 'Em análise'.",
    type: "INFO",
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    userId: "user-1",
  },
  {
    id: "3",
    title: "Alerta de Prazo",
    message: "Você tem 3 demandas com prazo vencendo hoje.",
    type: "WARNING",
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    userId: "user-1",
  },
  {
    id: "4",
    title: "Erro na Sincronização",
    message: "Não foi possível sincronizar os dados com o portal externo.",
    type: "ERROR",
    readAt: "2024-03-20T10:00:00Z",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    userId: "user-1",
  },
  {
    id: "5",
    title: "Mensagem do Cidadão",
    message: "O cidadão Carlos Mendes enviou um novo comentário.",
    type: "INFO",
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    userId: "user-1",
  },
  {
    id: "6",
    title: "Nova demanda de Infraestrutura",
    message: "Nova solicitação recebida via Portal do Cidadão.",
    type: "SUCCESS",
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    userId: "user-1",
  },
  {
    id: "7",
    title: "Lembrete de Reunião",
    message: "Reunião de equipe programada para às 14:00.",
    type: "INFO",
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
    userId: "user-1",
  },
];

const TYPE_CONFIG: Record<NotificationType, { icon: any; colorClass: string; bgClass: string }> = {
  INFO: {
    icon: Info,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-50 dark:bg-blue-950/30",
  },
  SUCCESS: {
    icon: CheckCircle2,
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  WARNING: {
    icon: AlertTriangle,
    colorClass: "text-amber-500",
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
  },
  ERROR: {
    icon: AlertCircle,
    colorClass: "text-rose-500",
    bgClass: "bg-rose-50 dark:bg-rose-950/30",
  },
};

export function NotificationPopover() {
  const [visibleCount, setVisibleCount] = useState(5);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.readAt).length, 
    [notifications]
  );

  const visibleNotifications = useMemo(() => 
    notifications.slice(0, visibleCount),
    [notifications, visibleCount]
  );

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date().toISOString() })));
  };

  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVisibleCount(prev => prev + 5);
  };

  return (
    <Popover onOpenChange={(open) => !open && setVisibleCount(5)}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-muted transition-all duration-200 group">
          <Bell className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-background animate-in zoom-in">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent align="end" className="w-[380px] p-0 rounded-2xl shadow-xl overflow-hidden border-border/50">
        <div className="flex items-center justify-between p-4 px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-10 border-b">
          <h3 className="font-bold text-lg text-foreground tracking-tight">Notificações</h3>
          <Button 
            variant="link" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            className="text-primary font-semibold hover:no-underline text-xs"
          >
            Marcar todas como lidas
          </Button>
        </div>

        <div className="max-h-[480px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-muted">
          {visibleNotifications.length > 0 ? (
            <div className="flex flex-col">
              <div className="px-6 py-3 bg-muted/30">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Recentes</span>
              </div>
              
              {visibleNotifications.map((notification, index) => {
                const config = TYPE_CONFIG[notification.type];
                const Icon = config.icon;
                
                return (
                  <div key={notification.id} className="relative group">
                    <button
                      className={cn(
                        "w-full flex items-start gap-4 p-5 px-6 transition-all hover:bg-muted/50 text-left border-b border-border/40",
                        !notification.readAt && "bg-primary/[0.02]"
                      )}
                    >
                      <div className={cn(
                        "size-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-200",
                        config.bgClass
                      )}>
                        <Icon className={cn("size-5", config.colorClass)} />
                      </div>
                      
                      <div className="flex flex-col gap-1 min-w-0 pr-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn(
                            "text-sm font-semibold truncate",
                            !notification.readAt ? "text-foreground" : "text-muted-foreground/80 font-medium"
                          )}>
                            {notification.title}
                          </p>
                          {!notification.readAt && (
                            <span className="size-2 bg-primary rounded-full shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 font-medium mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </button>
                    {index === visibleNotifications.length - 1 && index < notifications.length - 1 && (
                       <div className="p-4 flex justify-center bg-background/50">
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           onClick={handleLoadMore}
                           className="text-xs font-bold text-primary gap-2 hover:bg-primary/5 rounded-full px-4 h-9"
                         >
                           Ver mais notificações
                           <ChevronDown className="size-3" />
                         </Button>
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="size-16 rounded-3xl bg-muted/30 flex items-center justify-center mb-4">
                <Bell className="size-8 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-semibold text-foreground">Tudo limpo por aqui!</p>
              <p className="text-xs text-muted-foreground mt-1">Você não tem novas notificações no momento.</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
