import { createBrowserRouter } from "react-router-dom";
import TicketApp from "../pages/Index";

export const router = createBrowserRouter ([
    {
        path: "/",
        element: <TicketApp/ >
    }
])