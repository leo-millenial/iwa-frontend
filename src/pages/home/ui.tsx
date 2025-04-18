import { Button } from "@/shared/ui/button.tsx";

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm z-10">
        <div className="text-2xl font-bold cursor-pointer">{import.meta.env.VITE_APP_NAME}</div>
        <div className="flex gap-4">
          <Button variant="outline">Зарегистрироваться</Button>
          <Button>Войти</Button>
        </div>
      </header>

      <div className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('images/blue-backgraund.jpg')",
          }}
        />
      </div>
    </div>
  );
};
