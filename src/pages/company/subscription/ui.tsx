import { useUnit } from "effector-react";
import { Calendar, CreditCard, XCircle } from "lucide-react";

import { CompanySubscriptionStatus } from "@/shared/types/subscription.interface.ts";
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

import {
  $latestSubscription,
  $subscriptions,
  subscriptionCancelCkicked,
  subscriptionClicked,
} from "./model.ts";

export const CompanySubscriptionPage = () => {
  const [subscriptionPlans, latestSubscription] = useUnit([$subscriptions, $latestSubscription]);
  const [handleSubscriptionClick, handleSubscriptionCancelClick] = useUnit([
    subscriptionClicked,
    subscriptionCancelCkicked,
  ]);

  const SubscriptionStatusBadge = ({ status }: { status: CompanySubscriptionStatus }) => {
    switch (status) {
      case CompanySubscriptionStatus.Active:
        return <Badge className="bg-green-500">Активна</Badge>;
      case CompanySubscriptionStatus.WaitingForPayment:
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Ожидает оплаты
          </Badge>
        );
      case CompanySubscriptionStatus.Expired:
        return <Badge variant="destructive">Истекла</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">Подписка</h1>

        {/* Условный рендеринг в зависимости от наличия latestSubscription */}
        {latestSubscription ? (
          <Card className="mb-8 max-w-3xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Текущая подписка</CardTitle>
                  <CardDescription>Информация о вашей текущей подписке</CardDescription>
                </div>
                <SubscriptionStatusBadge status={latestSubscription.status} />
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
                    <p className="text-sm text-muted-foreground">{latestSubscription.plan}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Следующий платеж</p>
                    <p className="text-sm text-muted-foreground">
                      {latestSubscription.endDate?.toLocaleDateString()}
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
                      Карта {latestSubscription.price.monthly.toLocaleString()} ₽/мес
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive text-xs"
                  onClick={() => handleSubscriptionCancelClick()}
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Отменить подписку
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold mb-2">Выберите подходящий план</h2>
              <p className="text-muted-foreground">
                Получите доступ ко всем возможностям платформы для поиска сотрудников
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {subscriptionPlans.map((plan) => (
                <Card
                  key={plan.plan}
                  className={`flex flex-col ${plan.plan === "Годовая" ? "border-primary shadow-lg relative" : ""}`}
                >
                  {plan.plan === "Годовая" && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary">Популярный выбор</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.plan}</CardTitle>
                    <CardDescription>{plan.duration} месяцев</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-4">
                      <p className="text-3xl font-bold">
                        {plan.price.monthly.toLocaleString()} ₽
                        <span className="text-sm font-normal text-muted-foreground">/мес</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Итого: {plan.price.annual.toLocaleString()} ₽/
                        {plan.duration === 12 ? "год" : `${plan.duration} месяцев`}
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {/* Здесь можно добавить отображение особенностей плана, если они есть */}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.plan === "Годовая" ? "default" : "outline"}
                      onClick={() => handleSubscriptionClick({ planId: plan._id })}
                    >
                      Оформить подписку
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
