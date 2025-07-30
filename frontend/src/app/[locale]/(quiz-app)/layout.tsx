import { QuizNav } from '@/components/navigation/quiz-nav';

export default function QuizAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <QuizNav />
      <main>{children}</main>
    </div>
  );
}