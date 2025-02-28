
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import StudentHome from "./pages/StudentHome";
import FacultyHome from "./pages/FacultyHome";
import StudentResults from "./pages/StudentResults";
import ExamPage from "./pages/ExamPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Student Routes */}
          <Route path="/student" element={<StudentHome />} />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/student/exam/:examId" element={<Navigate to="/exam/1" replace />} />
          
          {/* Faculty Routes */}
          <Route path="/faculty" element={<FacultyHome />} />
          
          {/* Exam Pages */}
          <Route path="/exam/:page" element={<ExamPage />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
