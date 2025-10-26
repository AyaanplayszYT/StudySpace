import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotesSection } from '@/components/NotesSection';
import { TasksSection } from '@/components/TasksSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, BookOpen, ClipboardList, Settings } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">StudySpace</h1>
                <p className="text-sm text-muted-foreground">Classroom Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="default" onClick={() => navigate('/admin')}>
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="notes" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Tasks
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes">
            <NotesSection />
          </TabsContent>
          
          <TabsContent value="tasks">
            <TasksSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}