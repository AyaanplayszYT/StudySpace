import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GraduationCap, BookOpen, ClipboardList, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/10 to-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="p-6 rounded-2xl bg-primary/10 backdrop-blur-sm">
                <GraduationCap className="h-16 w-16 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground">
              Welcome to StudySpace
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your central platform for class notes, assignments, and staying organized. 
              Students can view updates, while admins manage the content.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8">
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')} className="text-lg px-8">
              View as Guest
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-12">
            <div className="space-y-4 p-6 rounded-xl bg-card hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Class Notes</h3>
              <p className="text-muted-foreground">
                Stay updated with daily class notes and important announcements
              </p>
            </div>
            <div className="space-y-4 p-6 rounded-xl bg-card hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto">
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Assignments</h3>
              <p className="text-muted-foreground">
                Track all your assignments and deadlines in one place
              </p>
            </div>
            <div className="space-y-4 p-6 rounded-xl bg-card hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Real-time Updates</h3>
              <p className="text-muted-foreground">
                Get instant notifications when new content is posted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
