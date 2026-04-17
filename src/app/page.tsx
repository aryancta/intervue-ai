import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  FileText, 
  TrendingUp, 
  Users, 
  Star, 
  Play, 
  CheckCircle,
  ArrowRight,
  Code,
  Briefcase,
  Database,
  GitBranch,
  MessageSquare,
  Building
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Mock Interviews",
    description: "Practice with intelligent AI that asks follow-up questions and provides detailed feedback on your responses."
  },
  {
    icon: FileText,
    title: "Resume Alignment",
    description: "Get personalized questions based on your actual resume, skills, and experience to practice for real interviews."
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "Track your improvement with detailed scoring, performance trends, and personalized study recommendations."
  }
];

const domains = [
  { icon: Code, name: "Software Engineering", color: "bg-blue-100 text-blue-800" },
  { icon: Briefcase, name: "Product Management", color: "bg-green-100 text-green-800" },
  { icon: Database, name: "Data Science", color: "bg-purple-100 text-purple-800" },
  { icon: GitBranch, name: "System Design", color: "bg-orange-100 text-orange-800" },
  { icon: MessageSquare, name: "Behavioral", color: "bg-pink-100 text-pink-800" },
  { icon: Building, name: "HR", color: "bg-indigo-100 text-indigo-800" }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content: "IntervueAI helped me practice with questions directly from my resume. The AI feedback was incredibly detailed and helped me land my dream job!",
    avatar: "SC"
  },
  {
    name: "Rajesh Kumar",
    role: "Product Manager at Microsoft",
    content: "The personalized study plan feature is amazing. It identified my weak areas and gave me exactly what I needed to improve.",
    avatar: "RK"
  },
  {
    name: "Emily Johnson",
    role: "Data Scientist at Meta",
    content: "Best interview prep tool I've used. The progress tracking kept me motivated and the questions felt like real interviews.",
    avatar: "EJ"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">IntervueAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="#leaderboard" className="text-gray-600 hover:text-gray-900">Leaderboard</Link>
              <Link href="#about" className="text-gray-600 hover:text-gray-900">About</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
                Ace Your Next Interview with{" "}
                <span className="text-blue-600">AI-Powered Practice</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                Get personalized mock interviews, real-time feedback, and data-driven study plans. 
                Practice with questions tailored to your resume and experience level.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl flex items-center justify-center">
                <div className="text-white text-center">
                  <Brain className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-lg font-semibold">AI Interview Simulator</p>
                  <p className="text-blue-200">Coming Soon: Interactive Demo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">10,000+</div>
              <div className="text-gray-600">Practice Sessions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">95%</div>
              <div className="text-gray-600">User Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">200+</div>
              <div className="text-gray-600">Interview Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">15+</div>
              <div className="text-gray-600">Domains Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive interview preparation powered by artificial intelligence
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <feature.icon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to interview success
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
              <p className="text-gray-600">Upload your resume and select your target role to get personalized questions</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Practice Interview</h3>
              <p className="text-gray-600">Answer AI-generated questions with real-time feedback and scoring</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Feedback & Improve</h3>
              <p className="text-gray-600">Review detailed feedback and follow your personalized study plan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Practice for any domain
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Specialized questions for different roles and industries
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {domains.map((domain, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <domain.icon className="h-8 w-8 mx-auto mb-3 text-gray-700" />
                <Badge className={domain.color}>
                  {domain.name}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What our users say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to ace your next interview?
          </h2>
          <p className="mt-4 text-lg text-blue-200">
            Join thousands of successful candidates who used IntervueAI to land their dream jobs
          </p>
          <div className="mt-8">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Start Practicing for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">IntervueAI</span>
              </div>
              <p className="text-gray-400">
                AI-powered mock interviews for your career success
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">Questions</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 IntervueAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}