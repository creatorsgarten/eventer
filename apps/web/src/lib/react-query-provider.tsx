// lib/react-query.tsx

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
	const [queryClient] = React.useState(() => new QueryClient());

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
