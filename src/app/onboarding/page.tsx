"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Briefcase, 
  Database, 
  GitBranch, 
  MessageSquare, 
  Building,
  Upload,
  Target,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar
} from "lucide-react";

const roles = [
  { id: "swe", name: "Software Engineer", icon: Code, description: "Backend, Frontend, Full Stack" },
  { id: "pm", name: "Product Manager", icon: Briefcase, description: "Strategy, Analytics, Growth" },
  { id: "ds", name: "Data Scientist", icon: Database, description: "ML, Analytics, Research" },
  { id: "design", name: "System Design", icon: GitBranch, description: "Architecture, Scalability" },
  { id: "behavioral", name: "Behavioral", icon: MessageSquare, description: "Leadership, Communication" },
  { id: "hr", name: "HR", icon: Building, description: "General Interview Skills" }
];

const experienceLevels = [
  { id: "junior", name: "Junior", years: "0-2 years", description: "New to the field, learning fundamentals" },
  { id: "mid", name: "Mid-Level", years: "2-5 years", description: "Experienced with core technologies" },
  { id: "senior", name: "Senior", years: "5+ years", description: "Leading projects and teams" }
];

const weeklyGoals = [
  { sessions: 3, description: "Light practice - Perfect for busy schedules" },
  { sessions: 5, description: "Balanced approach - Steady improvement" },
  { sessions: 7, description: "Intensive prep - Maximum progress" }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(5);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save onboarding data
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetRole: selectedRole,
          experienceLevel: selectedLevel,
          weeklyGoal: selectedGoal,
        }),
      });

      if (response.ok) {
        // Show confetti animation
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.type === "text/plain")) {
      setResumeFile(file);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedRole !== "";
      case 2: return selectedLevel !== "";
      case 3: return true; // Resume is optional
      case 4: return selectedGoal > 0;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to IntervueAI!</h1>
          <p className="text-gray-600">Let's personalize your interview preparation journey</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className={currentStep >= 1 ? "text-blue-600" : ""}>Role</span>
            <span className={currentStep >= 2 ? "text-blue-600" : ""}>Experience</span>
            <span className={currentStep >= 3 ? "text-blue-600" : ""}>Resume</span>
            <span className={currentStep >= 4 ? "text-blue-600" : ""}>Goals</span>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <div>
                <CardHeader className="text-center pb-6">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Target className="h-6 w-6" />
                    What's your target role?
                  </CardTitle>
                  <CardDescription>
                    Choose the domain you want to practice for. We'll customize questions to match your field.
                  </CardDescription>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedRole === role.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <role.icon className="h-8 w-8 mb-3 text-gray-700" />
                        <h3 className="font-semibold text-gray-900 mb-1">{role.name}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Experience Level */}
            {currentStep === 2 && (
              <div>
                <CardHeader className="text-center pb-6">
                  <CardTitle>What's your experience level?</CardTitle>
                  <CardDescription>
                    This helps us adjust question difficulty and provide appropriate guidance.
                  </CardDescription>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {experienceLevels.map((level) => (
                    <div
                      key={level.id}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedLevel === level.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedLevel(level.id)}
                    >
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 mb-1">{level.name}</h3>
                        <Badge variant="outline" className="mb-3">{level.years}</Badge>
                        <p className="text-sm text-gray-600">{level.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Resume Upload */}
            {currentStep === 3 && (
              <div>
                <CardHeader className="text-center pb-6">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Upload className="h-6 w-6" />
                    Upload your resume
                  </CardTitle>
                  <CardDescription>
                    Optional: Upload your resume to get personalized questions based on your experience and skills.
                  </CardDescription>
                </CardHeader>
                <div className="max-w-md mx-auto">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all hover:border-gray-400 ${
                      resumeFile ? "border-green-500 bg-green-50" : "border-gray-300"
                    }`}
                  >
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="resume" className="cursor-pointer">
                      {resumeFile ? (
                        <div>
                          <div className="text-green-600 mb-2">
                            <Sparkles className="h-12 w-12 mx-auto" />
                          </div>
                          <p className="font-semibold text-green-800">Resume uploaded!</p>
                          <p className="text-sm text-green-600 mt-1">{resumeFile.name}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-gray-400 mb-4">
                            <Upload className="h-12 w-12 mx-auto" />
                          </div>
                          <p className="text-gray-600 font-medium">Drop your PDF or TXT file here</p>
                          <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                        </div>
                      )}
                    </label>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      Supported formats: PDF, TXT • Max size: 10MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Weekly Goal */}
            {currentStep === 4 && (
              <div>
                <CardHeader className="text-center pb-6">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Calendar className="h-6 w-6" />
                    Set your weekly goal
                  </CardTitle>
                  <CardDescription>
                    How many practice sessions do you want to complete each week?
                  </CardDescription>
                </CardHeader>
                <div className="max-w-2xl mx-auto space-y-4">
                  {weeklyGoals.map((goal) => (
                    <div
                      key={goal.sessions}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedGoal === goal.sessions
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedGoal(goal.sessions)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-blue-600">{goal.sessions}</span>
                            <div>
                              <p className="font-semibold">
                                {goal.sessions} session{goal.sessions > 1 ? "s" : ""} per week
                              </p>
                              <p className="text-sm text-gray-600">{goal.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          ~{goal.sessions * 15} min/week
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Skip onboarding
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!canProceed() || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Setting up...
                </div>
              ) : currentStep === totalSteps ? (
                <>
                  Complete
                  <Sparkles className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}