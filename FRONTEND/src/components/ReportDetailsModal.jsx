import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  Paper,
  Box,
  Divider,
  alpha,
  useTheme,
  Grid,
} from "@mui/material";
import { InfoOutlined, ReportProblemOutlined } from "@mui/icons-material";

const ReportDetailsModal = ({ open, onClose, item }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 8,
          bgcolor: isDark
            ? alpha(theme.palette.background.paper, 0.9)
            : alpha("#fff", 0.9),
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.1),
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 900,
          pb: 0,
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <ReportProblemOutlined color="error" /> Service Reports
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {item && (
            <>
              <Box
                sx={{
                  p: 2.5,
                  bgcolor: alpha(theme.palette.error.main, 0.05),
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: alpha(theme.palette.error.main, 0.1),
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    color: "error.main",
                    mb: 1,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Incident Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      RECIPIENT
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {item.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      TYPE
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {item.wasteType || item.issueType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      ADDRESS
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {item.address}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Reports History
                </Typography>
                <Chip
                  label={`${item.reports?.length || 0} incidents`}
                  size="small"
                  variant="filled"
                  color="error"
                  sx={{ fontWeight: 800 }}
                />
              </Box>

              <Divider sx={{ opacity: 0.1 }} />

              {item.reports && item.reports.length > 0 ? (
                <Stack spacing={2}>
                  {item.reports.map((report, idx) => (
                    <Paper
                      key={idx}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 4,
                        bgcolor: isDark
                          ? alpha(theme.palette.background.paper, 0.4)
                          : alpha("#fff", 0.5),
                        border: "1px solid",
                        borderColor: alpha(theme.palette.divider, 0.1),
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          bgcolor:
                            report.status === "resolved"
                              ? "success.main"
                              : "error.main",
                        },
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 800 }}
                          >
                            Report #{idx + 1}
                          </Typography>
                          <Chip
                            label={report.status || "unresolved"}
                            size="small"
                            color={
                              report.status === "resolved"
                                ? "success"
                                : report.status === "acknowledged"
                                  ? "warning"
                                  : "error"
                            }
                            sx={{
                              fontWeight: 800,
                              borderRadius: 1.5,
                              height: 22,
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, lineHeight: 1.6 }}
                          >
                            <strong>Reason:</strong> {report.reason}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{
                              mt: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <InfoOutlined fontSize="inherit" /> Reported on{" "}
                            {new Date(report.reportedAt).toLocaleString()}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary">
                    No reports recorded for this task.
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 50,
            fontWeight: 800,
            textTransform: "none",
            py: 1.5,
            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDetailsModal;
