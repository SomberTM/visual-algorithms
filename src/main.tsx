import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { RootStoreProvider } from "./components/RootStoreProvider.tsx";
import { configure } from "mobx";

import "./index.css";

configure({
	enforceActions: "never",
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RootStoreProvider>
			<App />
		</RootStoreProvider>
	</React.StrictMode>
);
