import { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Authenticating...
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Please wait a moment
              </p>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
