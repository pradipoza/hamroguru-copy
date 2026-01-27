import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAiTutorSession, postAiTutorMessage } from '@/services/subject.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Subject, ChatMessage } from '@/lib/types';
import { Send, ImagePlus, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface AITutorTabProps {
  subject: Subject;
}

export function AITutorTab({ subject }: AITutorTabProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: session, isLoading, isError } = useQuery({
    queryKey: ['aiTutorSession', subject.id],
    queryFn: () => getAiTutorSession(subject.id),
  });

  const mutation = useMutation({
    mutationFn: (newMessage: { role: 'user'; content: string }) => 
      postAiTutorMessage(subject.id, session.id, newMessage),
    onSuccess: (updatedSession) => {
      queryClient.setQueryData(['aiTutorSession', subject.id], updatedSession);
    },
  });

  const messages = session?.messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || mutation.isPending) return;

    const userMessage = { role: 'user' as const, content: input };
    setInput('');
    // Optimistically update the UI
    queryClient.setQueryData(['aiTutorSession', subject.id], (old: any) => ({
      ...old,
      messages: [...old.messages, userMessage],
    }));

    mutation.mutate(userMessage);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          {subject.name} AI Tutor
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask questions, upload homework problems, or request explanations
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-destructive" />
              <p className="text-muted-foreground">Could not load chat session.</p>
            </div>
          </div>
        ) : (
          <ScrollArea ref={scrollRef} className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {messages.map((message: ChatMessage, index: number) => (
                <div
                  key={index}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' && 'flex-row-reverse'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                      message.role === 'assistant'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-4 py-3',
                      message.role === 'assistant'
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    )}
                  >
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="shrink-0">
              <ImagePlus className="w-4 h-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or describe your problem..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}