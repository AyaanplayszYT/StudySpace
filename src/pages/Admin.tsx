
// Move these components to top-level scope
import React from 'react';

export function DeleteNotesList() {
  const [notes, setNotes] = React.useState<any[]>([]);
  const { toast } = useToast();
  const fetchNotes = async () => {
    const { data, error } = await supabase.from('notes').select('*').order('date', { ascending: false });
    if (!error && data) setNotes(data);
  };
  React.useEffect(() => { fetchNotes(); }, []);
  const handleDelete = async (id: string, fileUrl?: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Note deleted' });
      setNotes(notes.filter(n => n.id !== id));
      // Optionally delete file from storage
      if (fileUrl) {
        const path = fileUrl.split('/attachments/')[1];
        if (path) await supabase.storage.from('attachments').remove([path]);
      }
    } else {
      console.error('Delete note error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete note: ' + error.message });
    }
  };
  return (
    <div className="space-y-2">
      {notes.length === 0 && <div className="text-muted-foreground">No notes found</div>}
      {notes.map(note => (
        <Card key={note.id} className="flex flex-row items-center justify-between p-2">
          <div>
            <div className="font-semibold">{note.title}</div>
            <div className="text-xs text-muted-foreground">{note.date}</div>
            {note.file_url && <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600">File</a>}
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(note.id, note.file_url)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </Card>
      ))}
    </div>
  );
}

export function DeleteTasksList() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const { toast } = useToast();
  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*').order('deadline', { ascending: true });
    if (!error && data) setTasks(data);
  };
  React.useEffect(() => { fetchTasks(); }, []);
  const handleDelete = async (id: string, fileUrl?: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Task deleted' });
      setTasks(tasks.filter(t => t.id !== id));
      // Optionally delete file from storage
      if (fileUrl) {
        const path = fileUrl.split('/attachments/')[1];
        if (path) await supabase.storage.from('attachments').remove([path]);
      }
    } else {
      console.error('Delete task error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete task: ' + error.message });
    }
  };
  return (
    <div className="space-y-2">
      {tasks.length === 0 && <div className="text-muted-foreground">No tasks found</div>}
      {tasks.map(task => (
        <Card key={task.id} className="flex flex-row items-center justify-between p-2">
          <div>
            <div className="font-semibold">{task.title}</div>
            <div className="text-xs text-muted-foreground">{task.deadline}</div>
            {task.file_url && <a href={task.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600">File</a>}
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id, task.file_url)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </Card>
      ))}
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft, FileText, ListTodo, Send, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { z } from 'zod';

const noteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().trim().min(1, "Description is required").max(5000, "Description must be less than 5000 characters"),
  date: z.string().min(1, "Date is required"),
});

const taskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().trim().max(5000, "Description must be less than 5000 characters").optional(),
  deadline: z.string().min(1, "Deadline is required"),
});

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Admin password state
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteDate, setNoteDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [noteFile, setNoteFile] = useState<File | null>(null);
  const [noteLoading, setNoteLoading] = useState(false);

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskFile, setTaskFile] = useState<File | null>(null);
  const [taskLoading, setTaskLoading] = useState(false);

  // Hardcoded admin password (replace with env or secure method in production)
  const ADMIN_PASSWORD = 'classroom2025';

  // Handle password submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password.');
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Enter the admin password to access the classroom dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit}>
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              className="mb-2"
            />
            {passwordError && <div className="text-red-500 mb-2">{passwordError}</div>}
            <Button type="submit">Enter</Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // ...existing dashboard code...
  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNoteLoading(true);
    let fileUrl = null;
    try {
      const validated = noteSchema.parse({
        title: noteTitle,
        description: noteDescription,
        date: noteDate,
      });
      // Upload file if present
      if (noteFile) {
        const { data, error } = await supabase.storage
          .from('attachments')
          .upload(`notes/${Date.now()}_${noteFile.name}`, noteFile);
        if (error) throw error;
        fileUrl = supabase.storage
          .from('attachments')
          .getPublicUrl(data.path).data.publicUrl;
      }
      const { error } = await supabase
        .from('notes')
        .insert([{ 
          title: validated.title, 
          description: validated.description, 
          date: validated.date,
          file_url: fileUrl
        }], { defaultToNull: true });
      if (error) throw error;
      toast({
        title: "Note published!",
        description: "Your note has been sent to all students.",
      });
      setNoteTitle('');
      setNoteDescription('');
      setNoteDate(format(new Date(), 'yyyy-MM-dd'));
      setNoteFile(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create note",
        });
      }
    } finally {
      setNoteLoading(false);
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskLoading(true);
    let fileUrl = null;
    try {
      const validated = taskSchema.parse({
        title: taskTitle,
        description: taskDescription || undefined,
        deadline: taskDeadline,
      });
      // Upload file if present
      if (taskFile) {
        const { data, error } = await supabase.storage
          .from('attachments')
          .upload(`tasks/${Date.now()}_${taskFile.name}`, taskFile);
        if (error) throw error;
        fileUrl = supabase.storage
          .from('attachments')
          .getPublicUrl(data.path).data.publicUrl;
      }
      const { error } = await supabase
        .from('tasks')
        .insert([{ 
          title: validated.title, 
          description: validated.description || null, 
          deadline: validated.deadline,
          file_url: fileUrl
        }], { defaultToNull: true });
      if (error) throw error;
      toast({
        title: "Task assigned!",
        description: "The task has been assigned to all students.",
      });
      setTaskTitle('');
      setTaskDescription('');
      setTaskDeadline('');
      setTaskFile(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create task",
        });
      }
    } finally {
      setTaskLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground">Manage notes, announcements, and tasks</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <Tabs defaultValue="notes" className="space-y-6">
    <TabsList className="flex w-full max-w-xl mx-auto gap-6 bg-background rounded-lg p-2 justify-center">
            <TabsTrigger value="notes" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-colors">
              <FileText className="h-4 w-4" />
              Notes & Announcements
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-colors">
              <ListTodo className="h-4 w-4" />
              Tasks & Assignments
            </TabsTrigger>
            <TabsTrigger value="delete" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-destructive data-[state=active]:text-white transition-colors">
              <Trash2 className="h-4 w-4" />
              Delete Notes/Tasks
            </TabsTrigger>
          </TabsList>
          <TabsContent value="delete">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Delete Notes & Tasks
                </CardTitle>
                <CardDescription>
                  Remove notes and tasks from the classroom database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <DeleteNotesList />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tasks</h3>
                  <DeleteTasksList />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Create Note or Announcement
                </CardTitle>
                <CardDescription>
                  Share class notes, announcements, or important information with all students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNoteSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="note-title">Title *</Label>
                    <Input
                      id="note-title"
                      placeholder="e.g., Important: Class Cancelled Tomorrow"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      maxLength={200}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note-date">Date *</Label>
                    <Input
                      id="note-date"
                      type="date"
                      value={noteDate}
                      onChange={(e) => setNoteDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note-description">Description *</Label>
                    <Textarea
                      id="note-description"
                      placeholder="Write the full details of your note or announcement here..."
                      value={noteDescription}
                      onChange={(e) => setNoteDescription(e.target.value)}
                      rows={8}
                      maxLength={5000}
                      required
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {noteDescription.length}/5000 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note-file">Attach Image/File (optional)</Label>
                    <Input
                      id="note-file"
                      type="file"
                      accept="image/*,application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                      onChange={e => setNoteFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={noteLoading}>
                    <Send className="h-4 w-4 mr-2" />
                    {noteLoading ? 'Publishing...' : 'Publish Note'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5" />
                  Create Task or Assignment
                </CardTitle>
                <CardDescription>
                  Assign homework, projects, or tasks to students with deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTaskSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Title *</Label>
                    <Input
                      id="task-title"
                      placeholder="e.g., Chapter 5 Reading Assignment"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      maxLength={200}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-deadline">Deadline *</Label>
                    <Input
                      id="task-deadline"
                      type="datetime-local"
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-description">Description (Optional)</Label>
                    <Textarea
                      id="task-description"
                      placeholder="Add details about the assignment, requirements, or instructions..."
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      rows={6}
                      maxLength={5000}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {taskDescription.length}/5000 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-file">Attach Image/File (optional)</Label>
                    <Input
                      id="task-file"
                      type="file"
                      accept="image/*,application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                      onChange={e => setTaskFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={taskLoading}>
                    <Send className="h-4 w-4 mr-2" />
                    {taskLoading ? 'Assigning...' : 'Assign Task'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
