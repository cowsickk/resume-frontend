import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import ResumeBuilder from "./ResumeBuilder";
import ResumeAnalyser from "./ResumeAnalyser";
import ATSChecker from "./ATSChecker";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/builder" element={<ResumeBuilder />} />
  <Route path="/resume-analyzer" element={<ResumeAnalyser />} />
  <Route path="/ats-checker" element={<ATSChecker />} />

    </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;