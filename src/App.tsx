import React, { useState } from 'react';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { HomePage } from './components/HomePage';
import { ProductDetail } from './components/ProductDetail';
import { CommunityPage } from './components/CommunityPage';
import { AdminVerificationPageSimple as AdminVerificationPage } from './components/AdminVerificationPageSimple';
import { ReviewQuestionsPage } from './components/ReviewQuestionsPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'product' | 'community' | 'admin' | 'questions' | 'product-community'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('1');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigateToProduct={(productId) => {
          setSelectedProductId(productId);
          setCurrentView('product');
        }} />;
      case 'product':
        return <ProductDetail
          productId={selectedProductId}
          onNavigateToCommunity={() => setCurrentView('product-community')}
          onBack={() => setCurrentView('home')}
        />;
      case 'product-community':
        return <ProductDetail
          productId={selectedProductId}
          onBack={() => setCurrentView('product')}
          showCommunity={true}
        />;
      case 'community':
        return <CommunityPage onBack={() => setCurrentView('product')} />;
      case 'admin':
        return <AdminVerificationPage />;
      case 'questions':
        return <ReviewQuestionsPage onBack={() => setCurrentView('home')} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 relative">
        <div className="flex flex-col min-h-screen">
                           {currentView !== 'admin' && currentView !== 'questions' && <Header onNavigateToQuestions={() => setCurrentView('questions')} />}
          {currentView !== 'community' && currentView !== 'admin' && currentView !== 'questions' && currentView !== 'product-community' && <CategoryNav />}
          
          <main className="flex-1 pb-16 sm:pb-0">
            {renderCurrentView()}
          </main>
          
                 
                 {/* Admin button - 左下に配置（メッセージボタンと重ならないように） */}
                 <div className="fixed bottom-4 left-4 z-50">
                   <button
                     onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
                     className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 text-xs sm:text-sm font-bold transform hover:scale-105"
                   >
                     {currentView === 'admin' ? 'ホーム 🏠' : '管理者 👨‍💼'}
                   </button>
                 </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;