import { cn } from '@/lib/utils'

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 lg:p-8">
        <div className={cn('space-y-6', className)} {...props}>
          {children}
        </div>
      </div>
    </div>
  )
}
