import { Mail, MessageCircle, MessageSquare, Phone, PhoneCall } from "lucide-react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { Button } from "@/shared/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card.tsx";

export const CompanyHelpPage = () => {
  return (
    <LayoutCompany>
      <div className="flex flex-col h-full items-center">
        <div className="w-full max-w-5xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Нужна помощь?</h1>
            <p className="text-muted-foreground mt-2">
              Выберите удобный способ связи, и мы поможем решить ваш вопрос
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HelpCard
              icon={<Mail className="h-5 w-5" />}
              title="Написать на почту"
              description="Отправьте нам письмо, и мы ответим в течение 24 часов"
              actionText="Написать письмо"
              onClick={() => (window.location.href = "mailto:support@example.com")}
            />

            <HelpCard
              icon={<MessageSquare className="h-5 w-5" />}
              title="Спросить в чате"
              description="Получите быстрый ответ от нашей службы поддержки в чате"
              actionText="Открыть чат"
              onClick={() => console.log("Открыть чат")}
            />

            <HelpCard
              icon={<Phone className="h-5 w-5" />}
              title="Позвонить"
              description="Свяжитесь с нами по телефону для немедленной помощи"
              actionText="Позвонить"
              onClick={() => (window.location.href = "tel:+78001234567")}
            />

            <HelpCard
              icon={<PhoneCall className="h-5 w-5" />}
              title="Заказать звонок"
              description="Оставьте свой номер, и мы перезвоним вам в удобное время"
              actionText="Заказать звонок"
              onClick={() => console.log("Заказать звонок")}
            />

            <HelpCard
              icon={<MessageCircle className="h-5 w-5" />}
              title="Поделиться обратной связью"
              description="Расскажите нам о вашем опыте использования сервиса"
              actionText="Оставить отзыв"
              onClick={() => console.log("Оставить отзыв")}
            />
          </div>

          <div className="mt-8 p-3 bg-muted rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-3">Часто задаваемые вопросы</h2>
            <p className="text-muted-foreground mb-4">
              Возможно, ответ на ваш вопрос уже есть в нашей базе знаний
            </p>
            <Button variant="outline">Перейти в базу знаний</Button>
          </div>
        </div>
      </div>
    </LayoutCompany>
  );
};

interface HelpCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  onClick: () => void;
  className?: string;
}

const HelpCard = ({ icon, title, description, actionText, onClick, className }: HelpCardProps) => {
  return (
    <Card
      className={`transition-all duration-300 hover:shadow-md hover:border-primary/50 flex flex-col h-full ${className}`}
    >
      <CardHeader className="flex flex-row items-center gap-3 pb-2 pt-4">
        <div className="p-1.5 rounded-full bg-primary/10 text-primary">{icon}</div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <CardDescription className="text-sm mb-4 flex-grow">{description}</CardDescription>
        <Button
          variant="outline"
          size="sm"
          className="w-full hover:bg-primary hover:text-primary-foreground mt-auto"
          onClick={onClick}
        >
          {actionText}
        </Button>
      </CardContent>
    </Card>
  );
};
