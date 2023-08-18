import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import APISettings from "./routes/APISettings";
import TokenManagement from "./routes/TokenManagement";
import ErrorPage from "./routes/ErrorPage";
import Root from "./routes/App";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "token",
				element: <TokenManagement />,
				errorElement: <ErrorPage />,
			},
			{
				path: "api",
				element: <APISettings />,
				errorElement: <ErrorPage />,
			},
		],
		errorElement: <ErrorPage />,
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
