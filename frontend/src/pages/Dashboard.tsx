import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid, Typography, Paper } from "@mui/material";
import { D3StackedBarChart } from "../components/StackedBarChart";
import { D3DonutChart } from "../components/DonutChart";
import { ACVTable } from "../components/ACVTable";
import { fetchACVData } from "../redux/chartSlice";
import type { RootState, AppDispatch } from "../redux/store";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { acvData: data, loading } = useSelector(
    (state: RootState) => state.chart
  );

  useEffect(() => {
    dispatch(fetchACVData());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data available.</p>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        ACV Dashboard
      </Typography>
      {/* Grid for Customer Type Charts */}
      <Typography variant="h6">Customer Type</Typography>
      <Grid container spacing={2}>
        {/* @ts-ignore */}
        <Grid size={8}>
          <Paper sx={{ p: 2 }}>
            <D3StackedBarChart
              data={data.customer_type}
              categoryKey="customer_type"
            />
          </Paper>
        </Grid>
        {/* @ts-ignore */}
        <Grid size={4}>
          <Paper sx={{ p: 2 }}>
            <D3DonutChart
              data={data.customer_type}
              categoryKey="customer_type"
            />
          </Paper>
        </Grid>
        {/* @ts-ignore */}
        <Grid xs={12} size={12}>
          <Paper sx={{ p: 2 }}>
            <ACVTable data={data.customer_type} categoryKey="customer_type" />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
