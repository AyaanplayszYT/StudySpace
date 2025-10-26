import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
	id: string;
	title: string;
	description: string | null;
	deadline: string;
	created_at: string;
}

export function TasksSection() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		fetchTasks();
		const channel = supabase
			.channel('tasks-changes')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
				fetchTasks();
			})
			.subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	const fetchTasks = async () => {
		const { data, error } = await supabase
			.from('tasks')
			.select('*')
			.order('deadline', { ascending: true });
		if (!error && data) {
			setTasks(data);
		}
	};

	const filteredTasks = tasks.filter(task =>
		task.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h2 className="text-2xl font-bold text-foreground">Assignments & Tasks</h2>
					<p className="text-muted-foreground">Upcoming deadlines and to-dos</p>
				</div>
			</div>
			<div className="mb-4">
				<Input
					placeholder="Search tasks..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="max-w-md"
				/>
			</div>
			<div className="space-y-4">
				{filteredTasks.map((task) => (
					<Card key={task.id} className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<CardTitle className="text-lg">{task.title}</CardTitle>
									<CardDescription className="flex items-center gap-2 mt-1">
										<Clock className="h-4 w-4" />
										Due: {format(new Date(task.deadline), 'PPP p')}
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						{task.description && (
							<CardContent>
								<p className="text-sm text-muted-foreground whitespace-pre-wrap">
									{task.description}
								</p>
							</CardContent>
						)}
					</Card>
				))}
			</div>
			{filteredTasks.length === 0 && (
				<div className="text-center py-12">
					<p className="text-muted-foreground">No tasks found</p>
				</div>
			)}
		</div>
	);
}
