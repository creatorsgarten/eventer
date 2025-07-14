import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Sans_Thai, Inter } from "next/font/google";
import ReactQueryProvider from "@/lib/react-query-provider";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});
const ibmPlexSansThai = IBM_Plex_Sans_Thai({
	subsets: ["latin", "thai"],
	display: "swap",
	variable: "--font-ibm-plex-sans-thai",
	weight: ["300", "400", "500", "600", "700"],
	style: ["normal"],
});

export const metadata: Metadata = {
	title: "Eventer",
	description: "A simple event management app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable} ${ibmPlexSansThai.variable}`}>
				<ReactQueryProvider>{children}</ReactQueryProvider>
			</body>
		</html>
	);
}
