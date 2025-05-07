import Sidebar from './sidebar';
import Topbar from './topbar';

export default function PageContainer({ children, title }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-background p-6">
          {title && (
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-display font-bold text-text">{title}</h1>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
}
