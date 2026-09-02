import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GlobalSearchModal } from './GlobalSearchModal';
import { ToastContainer } from '../common/ToastContainer';
import { ConfirmModal } from '../common/ConfirmModal';
import { useApp } from '../../context/AppContext';
import { DashboardView } from '../views/DashboardView';
import { ClassesView } from '../views/ClassesView';
import { StudentsView } from '../views/StudentsView';
import { AssignmentsView } from '../views/AssignmentsView';
import { ExamsView } from '../views/ExamsView';
import { ResultsAnalyticsView } from '../views/ResultsAnalyticsView';
import { SettingsView } from '../views/SettingsView';

export const Layout: React.FC = () => {
  const { activeTab } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'classes':
        return <ClassesView />;
      case 'students':
        return <StudentsView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'exams':
        return <ExamsView />;
      case 'results':
        return <ResultsAnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <ToastContainer />
      <ConfirmModal />
    </div>
  );
};
