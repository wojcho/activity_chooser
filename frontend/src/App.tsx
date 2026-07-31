import { Route, Routes } from "react-router";
import HomePage from "./components/HomePage";
import SessionPage from "./components/SessionPage";
import NewSessionPage from "./components/NewSessionPage";
import NotFoundPage from "./components/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/new-session/:sessionId/:aUserToken/:bUserToken" element={<NewSessionPage />} />
      <Route path="/session/:sessionId/:userToken" element={<SessionPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
