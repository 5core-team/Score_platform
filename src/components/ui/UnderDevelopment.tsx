import { Construction } from 'lucide-react';

interface UnderDevelopmentProps {
  title?: string;
}

export function UnderDevelopment({ title = 'Cette page' }: UnderDevelopmentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-900/20 mb-5">
        <Construction size={32} className="text-amber-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title} est en développement</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">
        Cette fonctionnalité sera disponible prochainement. Notre équipe y travaille activement.
      </p>
      <div className="mt-5 flex gap-1.5">
        {[...Array(3)].map((_, i) => (
          <span key={i} className={`w-2 h-2 rounded-full bg-amber-400 animate-bounce`} style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}
