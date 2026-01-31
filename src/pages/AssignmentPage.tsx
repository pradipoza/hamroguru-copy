import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPersonalizedAssignment, submitHomework } from '@/services/subject.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Sparkles,
  X
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

export default function AssignmentPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: assignment, isLoading, isError } = useQuery({
    queryKey: ['personalized-assignment', assignmentId],
    queryFn: () => getPersonalizedAssignment(assignmentId!),
    enabled: !!assignmentId,
  });

  const submitMutation = useMutation({
    mutationFn: (images: string[]) => submitHomework(assignmentId!, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalized-assignment', assignmentId] });
      queryClient.invalidateQueries({ queryKey: ['homework'] });
      setUploadedImages([]);
      setIsSubmitting(false);
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (uploadedImages.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitMutation.mutateAsync(uploadedImages);
    } catch (error) {
      console.error('Failed to submit homework:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isError || !assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Assignment not found</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isPersonalizedReady = assignment.status === 'ready';
  const isPreparing = assignment.status === 'preparing';
  const isSubmitted = assignment.assignment?.submittedAt || false;
  const dueDate = new Date(assignment.assignment.dueDate);
  const isOverdue = dueDate < new Date();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{assignment.assignment.title}</h1>
              <p className="text-sm text-muted-foreground">
                {assignment.assignment.subjectName} • {assignment.assignment.chapter}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Due Date</div>
              <div className={`font-medium ${isOverdue ? 'text-destructive' : ''}`}>
                {format(dueDate, 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {isPreparing && !isSubmitted ? (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              Your personal HW provider is preparing HW for you...
            </AlertDescription>
          </Alert>
        ) : isSubmitted ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              You have already submitted this assignment.
            </AlertDescription>
          </Alert>
        ) : isPersonalizedReady ? (
          <div className="space-y-6">
            {/* Personalized Content Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="w-3 h-3" />
                Personalized Assignment
              </Badge>
              <span className="text-sm text-muted-foreground">
                Generated {formatDistanceToNow(new Date(assignment.generatedAt), { addSuffix: true })}
              </span>
            </div>

            {/* Personalized Instructions */}
            {assignment.personalizedInstructions && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personalized Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{assignment.personalizedInstructions}</p>
                </CardContent>
              </Card>
            )}

            {/* Learning Objectives */}
            {assignment.learningObjectives && assignment.learningObjectives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {assignment.learningObjectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Questions */}
            {assignment.questions && assignment.questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Questions</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Estimated time: {assignment.estimatedTime} minutes • 
                    Difficulty: {assignment.difficulty}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {assignment.questions.map((question: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium mb-2">{question.question}</p>
                            {question.description && (
                              <p className="text-sm text-muted-foreground mb-3">{question.description}</p>
                            )}
                            {question.hint && (
                              <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{question.hint}</AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This assignment is not yet available. Please check back later.
            </AlertDescription>
          </Alert>
        )}

        {/* Submission Section */}
        {isPersonalizedReady && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submit Your Homework</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload images of your completed homework
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload */}
              <div>
                <Label htmlFor="images">Upload Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2"
                />
              </div>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div>
                  <Label>Uploaded Images ({uploadedImages.length})</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || uploadedImages.length === 0}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Homework
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
