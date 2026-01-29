import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAiTutorSession, postAiTutorMessage, uploadImage } from '@/services/subject.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Subject, ChatMessage } from '@/lib/types';
import { Send, ImagePlus, Bot, User, Loader2, AlertCircle, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AITutorTabProps {
  subject: Subject;
}

export function AITutorTab({ subject }: AITutorTabProps) {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: session, isLoading, isError } = useQuery({
    queryKey: ['aiTutorSession', subject.code],
    queryFn: () => getAiTutorSession(subject.code),
  });

  const mutation = useMutation({
    mutationFn: async (newMessage: { role: 'user'; content: string; imageUrl?: string }) => {
      return postAiTutorMessage(subject.code, newMessage);
    },
    onSuccess: (updatedSession) => {
      queryClient.setQueryData(['aiTutorSession', subject.code], updatedSession);
      queryClient.invalidateQueries({ queryKey: ['aiTutorSession', subject.code] });
    },
  });

  const messages = session?.messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || mutation.isPending || isUploading) return;

    let imageUrl: string | undefined;

    if (selectedImage) {
      setIsUploading(true);
      try {
        const uploadResult = await uploadImage(selectedImage);
        imageUrl = uploadResult.imageUrl;
      } catch (error) {
        console.error('Failed to upload image:', error);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const userMessage = { 
      role: 'user' as const, 
      content: input || (selectedImage ? 'Image uploaded' : ''),
      imageUrl,
      timestamp: new Date().toISOString(),
    };

    setInput('');
    removeImage();

    queryClient.setQueryData(['aiTutorSession', subject.code], (old: any) => ({
      ...old,
      messages: [...(old?.messages || []), userMessage],
    }));

    mutation.mutate(userMessage);
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      
      if (isToday) {
        return format(date, 'h:mm a');
      }
      return format(date, 'MMM d, h:mm a');
    } catch {
      return '';
    }
  };

  return (
    <Card className="h-[calc(100vh-200px)] min-h-[400px] max-h-[800px] flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="truncate">{subject.name} AI Tutor</span>
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Ask questions, upload homework problems, or request explanations
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
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
          <ScrollArea ref={scrollRef} className="flex-1 px-2 sm:px-4">
            <div className="space-y-3 sm:space-y-4 py-4">
              {messages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Start a conversation with your AI tutor!</p>
                  <p className="text-sm mt-1">You can ask questions or upload images of problems.</p>
                </div>
              )}
              {messages.map((message: ChatMessage, index: number) => (
                <div
                  key={index}
                  className={cn(
                    'flex gap-2 sm:gap-3',
                    message.role === 'user' && 'flex-row-reverse'
                  )}
                >
                  <div
                    className={cn(
                      'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0',
                      message.role === 'assistant'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-3',
                      message.role === 'assistant'
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    )}
                  >
                    {message.imageUrl && (
                      <div className="mb-2">
                        <img 
                          src={message.imageUrl} 
                          alt="Uploaded" 
                          className="max-w-full max-h-48 sm:max-h-64 rounded-md object-contain"
                        />
                      </div>
                    )}
                    <div className={cn(
                      "prose prose-sm max-w-none",
                      message.role === 'user' && "prose-invert"
                    )}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    {message.timestamp && (
                      <div className={cn(
                        "text-[10px] sm:text-xs mt-1 opacity-70",
                        message.role === 'user' ? 'text-right' : 'text-left'
                      )}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {mutation.isPending && (
                <div className="flex gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 bg-primary text-primary-foreground">
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
        
        <div className="p-2 sm:p-4 border-t flex-shrink-0">
          {imagePreview && (
            <div className="relative inline-block mb-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-20 sm:max-h-24 rounded-md object-contain"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
            <Button 
              variant="outline" 
              size="icon" 
              className="shrink-0 h-10 w-10"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || mutation.isPending}
            >
              <ImagePlus className="w-4 h-4" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or describe your problem..."
              className="min-h-[40px] max-h-32 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button 
              onClick={handleSend} 
              disabled={(!input.trim() && !selectedImage) || isUploading || mutation.isPending}
              className="shrink-0 h-10"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
