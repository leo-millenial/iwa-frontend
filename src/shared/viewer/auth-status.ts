import { createStore } from "effector";

// Определяем возможные статусы пользователя
export enum ViewerStatus {
  Initial = 0,
  Pending,
  Authenticated,
  Anonymous,
}

// Создаем стор для хранения статуса авторизации
export const $viewerStatus = createStore(ViewerStatus.Initial);

// Создаем стор для хранения состояния авторизации (для совместимости)
export const $isAuthenticated = $viewerStatus.map(
  (status) => status === ViewerStatus.Authenticated,
);
