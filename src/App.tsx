import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MenuDataProvider } from "./context/MenuDataContext";
import { StoreSettingsProvider } from "./context/StoreSettingsContext";
import { CustomerMenu } from "./pages/CustomerMenu";
import { AdminDashboard } from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <StoreSettingsProvider>
        <MenuDataProvider>
          <Routes>
            <Route path="/" element={<CustomerMenu />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </MenuDataProvider>
      </StoreSettingsProvider>
    </BrowserRouter>
  );
}

export default App;
