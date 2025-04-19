import { Calendar, Check, CreditCard, XCircle } from "lucide-react";
import { useState } from "react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { Badge } from "@/shared/ui/badge.tsx";
import { Button } from "@/shared/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card.tsx";

// Интерфейс для текущей подписки
interface CurrentSubscription {
  name: string;
  nextPayment: string;
  paymentMethod: string;
  status: "active" | "pending" | "expired";
}

// Интерфейс для вариантов подписки
interface SubscriptionPlan {
  id: string;
  name: string;
  period: string;
  pricePerMonth: number;
  totalPrice: number;
  features: string[];
  popular?: boolean;
}

export const CompanySubscriptionPage = () => {
  // Моковые данные для текущей подписки (в реальном приложении будут приходить с сервера)
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>({
    name: "Годовая подписка",
    nextPayment: "15 июня 2025",
    paymentMethod: "**** 4242",
    status: "active",
  });

  // Моковые данные для вариантов подписки
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "yearly",
      name: "Годовая",
      period: "12 месяцев",
      pricePerMonth: 4999,
      totalPrice: 59988,
      features: [
        "Неограниченное количество вакансий",
        "Доступ к базе резюме",
        "Приоритетная поддержка",
        "Аналитика откликов",
      ],
      popular: true,
    },
    {
      id: "half-yearly",
      name: "6 месяцев",
      period: "6 месяцев",
      pricePerMonth: 9999,
      totalPrice: 59994,
      features: [
        "Неограниченное количество вакансий",
        "Доступ к базе резюме",
        "Стандартная поддержка",
      ],
    },
    {
      id: "quarterly",
      name: "3 месяца",
      period: "3 месяца",
      pricePerMonth: 14999,
      totalPrice: 44997,
      features: ["До 10 активных вакансий", "Ограниченный доступ к базе резюме"],
    },
  ];

  // Функция для отмены подписки
  const handleCancelSubscription = () => {
    if (confirm("Вы уверены, что хотите отменить подписку?")) {
      setCurrentSubscription(null);
    }
  };

  // Функция для оформления подписки
  const handleSubscribe = (planId: string) => {
    alert(`Оформление подписки: ${planId}`);
    // Здесь будет логика оформления подписки
  };

  // Компонент для отображения статуса подписки
  const SubscriptionStatusBadge = ({ status }: { status: CurrentSubscription["status"] }) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Активна</Badge>;
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Ожидает оплаты
          </Badge>
        );
      case "expired":
        return <Badge variant="destructive">Истекла</Badge>;
      default:
        return null;
    }
  };

  return (
    <LayoutCompany>
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-6">Подписка</h1>

          {/* Блок с текущей подпиской */}
          {currentSubscription && (
            <Card className="mb-8 max-w-3xl mx-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Текущая подписка</CardTitle>
                    <CardDescription>Информация о вашей текущей подписке</CardDescription>
                  </div>
                  <SubscriptionStatusBadge status={currentSubscription.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Тип подписки</p>
                      <p className="text-sm text-muted-foreground">{currentSubscription.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Следующий платеж</p>
                      <p className="text-sm text-muted-foreground">
                        {currentSubscription.nextPayment}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Способ оплаты</p>
                      <p className="text-sm text-muted-foreground">
                        Карта {currentSubscription.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive text-xs"
                    onClick={handleCancelSubscription}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Отменить подписку
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Заголовок для блока с вариантами подписок */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-2">Выберите подходящий план</h2>
            <p className="text-muted-foreground">
              Получите доступ ко всем возможностям платформы для поиска сотрудников
            </p>
          </div>

          {/* Блок с вариантами подписок */}
          <div className="grid gap-6 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`flex flex-col ${plan.popular ? "border-primary shadow-lg relative" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary">Популярный выбор</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.period}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-4">
                    <p className="text-3xl font-bold">
                      {plan.pricePerMonth.toLocaleString()} ₽
                      <span className="text-sm font-normal text-muted-foreground">/мес</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Итого: {plan.totalPrice.toLocaleString()} ₽/
                      {plan.id === "yearly" ? "год" : plan.period}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    Оформить подписку
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </LayoutCompany>
  );
};
