"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { env } from "@/env";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing authentication...");
  const [userInfo, setUserInfo] = useState<{
    id: string;
    email: string;
    username: string;
    avatar_url?: string;
  } | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL fragment (everything after #)
        const hash = window.location.hash.substring(1);

        if (!hash) {
          setStatus("error");
          setMessage("No authentication data found in URL");
          return;
        }

        // Parse the fragment as URL parameters
        const params = new URLSearchParams(hash);

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (!accessToken || !refreshToken) {
          setStatus("error");
          setMessage("Missing authentication tokens");
          return;
        }

        // Send tokens to backend
        const response = await fetch(
          `${env.NEXT_PUBLIC_BACKEND_URL}/api/auth/callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_token: accessToken,
              refresh_token: refreshToken,
            }),
            credentials: "include", // Important for cookies
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          setStatus("success");
          setMessage("Authentication successful!");
          setUserInfo(result.user);

          // Store user info in localStorage for persistence
          localStorage.setItem("user", JSON.stringify(result.user));

          // Clear the URL fragment
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          // Redirect to your desired page after a delay
          setTimeout(() => {
            router.push("/test");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(result.error || "Authentication failed");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage("An error occurred during authentication");
      }
    };

    // Run the callback handler when component mounts
    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">
                Processing Authentication
              </h2>
              <p className="text-gray-600 mt-2">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Success"
                >
                  <title>Success</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-900">Success!</h2>
              <p className="text-green-600 mt-2">{message}</p>

              {userInfo && (
                <div className="mt-6 p-4 bg-white rounded-lg shadow border">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Welcome!
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      {userInfo.avatar_url && (
                        <Image
                          src={userInfo.avatar_url}
                          alt="Profile"
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full mr-3"
                        />
                      )}
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {userInfo.username}
                        </p>
                        <p className="text-sm text-gray-500">
                          {userInfo.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Redirecting to dashboard in a few seconds...
                  </p>
                </div>
              )}
            </>
          )}

          {status === "error" && (
            <>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Error"
                >
                  <title>Error</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-red-900">
                Authentication Failed
              </h2>
              <p className="text-red-600 mt-2">{message}</p>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
