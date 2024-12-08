import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { refreshToken } from "@/utils/refresh"; // Adjust the import path as necessary
import { useRouter } from "next/router";
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedRefreshToken) {
      const interval = setInterval(async () => {
        try {
          await refreshToken();
        } catch (error) {
          clearInterval(interval);
          if (
            confirm("Failed to refresh token. Do you want to sign in again?")
          ) {
            router.push("/signin");
          } else {
            localStorage.clear();
          }
        }
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [router]);

  return <Component {...pageProps} />;
}
