export default function AuthPage() {
  // ... (keep all your existing state and hooks)

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* LEFT PANEL - Keep your existing content */}
      <div className="relative hidden md:flex md:w-1/2 bg-gray-900 text-white overflow-hidden items-center justify-center p-10">
        {/* ... your existing left panel content ... */}
      </div>

      {/* RIGHT PANEL - Pure Glass Morphism */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="relative">
            {/* Frosted glass background */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl" />
            
            {/* Auth content */}
            <div className="relative z-10 p-8">
              {location === "/login" && (
                <SignIn 
                  signInUrl="/login"
                  fallbackRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none",
                      headerTitle: "text-gray-900",
                      headerSubtitle: "text-gray-700",
                      socialButtonsBlockButton: "border-gray-300 hover:bg-white/30",
                      socialButtonsBlockButtonText: "text-gray-900",
                      dividerLine: "bg-gray-300",
                      dividerText: "text-gray-700",
                      formFieldLabel: "text-gray-900",
                      formFieldInput: "bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:bg-white/70",
                      formButtonPrimary: "bg-gray-900 text-white hover:bg-gray-800",
                      footerActionText: "text-gray-700",
                      footerActionLink: "text-gray-900 hover:text-gray-800",
                    }
                  }}
                />
              )}

              {location === "/signup" && (
                <SignUp 
                  fallbackRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none",
                      headerTitle: "text-gray-900",
                      headerSubtitle: "text-gray-700",
                      socialButtonsBlockButton: "border-gray-300 hover:bg-white/30",
                      socialButtonsBlockButtonText: "text-gray-900",
                      dividerLine: "bg-gray-300",
                      dividerText: "text-gray-700",
                      formFieldLabel: "text-gray-900",
                      formFieldInput: "bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:bg-white/70",
                      formButtonPrimary: "bg-gray-900 text-white hover:bg-gray-800",
                      footerActionText: "text-gray-700",
                      footerActionLink: "text-gray-900 hover:text-gray-800",
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}