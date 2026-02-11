import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

const UserRegistrations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const headers = () => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  };

  useEffect(() => {
    const fetchMine = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/registrations/mine`, {
          headers: headers(),
        });
        if (res.status === 401 || res.status === 403) {
          sessionStorage.clear();
          navigate("/login");
          return;
        }
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("fetch registrations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMine();
  }, []);

  return (
    <Box sx={{ p: 4, mt: 8 }}>
      <Typography variant="h4" color="primary" sx={{ mb: 3 }}>
        My Registrations
      </Typography>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : items.length ? (
          <Grid container spacing={2}>
            {items.map((r) => (
              <Grid size={{ xs: 12, md: 6 }} key={r._id}>
                <Paper sx={{ p: 2 }} variant="outlined">
                  <Typography variant="h6">
                    {r.firstName} {r.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {r.email} • {r.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Dept: {r.department}
                    {r.subOption ? ` (${r.subOption})` : ""}
                  </Typography>
                  {r.location && r.location.lat && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Location: {r.location.lat.toFixed(5)},{" "}
                      {r.location.lng.toFixed(5)}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 1, color: "text.secondary" }}
                  >
                    Submitted: {new Date(r.createdAt).toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">
            You have not submitted any registrations yet.
          </Typography>
        )}
      </Paper>

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={() => navigate("/user")}>
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default UserRegistrations;
