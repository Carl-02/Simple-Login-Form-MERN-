import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import { AppProvider } from "@toolpad/core/AppProvider";
import Button from "@mui/material/Button";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import Dashboard from "./Dashboard";
import Blog from "./Blog";
import axios from "axios";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const NAVIGATION = [
  {
    kind: "header",
    title: "Dashboard",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DescriptionIcon />,
  },
  {
    kind: "header",
    title: "Blog",
  },
  {
    segment: "blog",
    title: "Blog",
    icon: <DescriptionIcon />,
  },
  {
    kind: "header",
    title: "Options",
  },
];

function DemoPageContent({ pathname }) {
  const renderComponent = () => {
    switch (pathname) {
      case "/dashboard":
        return <Dashboard />;
      case "/blog":
        return <Blog />;
      default:
        return <Typography variant="h6">404 - Not Found</Typography>;
    }
  };

  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {renderComponent()}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function Navbar(props) {
  const { window } = props;

  const router = useDemoRouter("/dashboard");

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {});
      console.log("Logged out successfully");
      // You might want to redirect or update the application state after logging out
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error (e.g., show a notification)
    }
  };

  return (
    // preview-start

    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src="https://wallpapers.com/images/featured/developer-png-9wxnnbpbatv5o2dn.jpg" alt="MUI logo" />,
        title: "PROJECT",
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}

Navbar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default Navbar;
