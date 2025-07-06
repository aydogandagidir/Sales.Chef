import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { useState } from "react";
import { QuoteBuilder } from "./components/QuoteBuilder";
import { CustomerManager } from "./components/CustomerManager";
import { ProductManager } from "./components/ProductManager";
import { QuoteList } from "./components/QuoteList";
import { Reports } from "./components/Reports";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Authenticated>
        <MainApp />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md mx-auto p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Offer Management System
              </h1>
              <p className="text-gray-600">
                Professional quotation management for sales teams
              </p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
      <Toaster />
    </div>
  );
}

function MainApp() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'quotes' | 'new-quote' | 'customers' | 'products' | 'reports'>('dashboard');
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">
                Offer Management
              </h1>
              <nav className="flex space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('quotes')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'quotes'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Quotes
                </button>
                <button
                  onClick={() => setCurrentView('customers')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'customers'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Customers
                </button>
                <button
                  onClick={() => setCurrentView('products')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'products'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => setCurrentView('reports')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'reports'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Reports
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {loggedInUser?.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'quotes' && (
          <QuoteList onCreateNew={() => setCurrentView('new-quote')} />
        )}
        {currentView === 'new-quote' && (
          <QuoteBuilder onBack={() => setCurrentView('quotes')} />
        )}
        {currentView === 'customers' && <CustomerManager />}
        {currentView === 'products' && <ProductManager />}
        {currentView === 'reports' && <Reports />}
      </main>
    </>
  );
}
