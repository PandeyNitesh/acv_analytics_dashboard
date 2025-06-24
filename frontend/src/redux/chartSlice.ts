// redux/chartSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface ACVItem {
  fiscal_quarter: string;
  acv: number;
  count: number;
  [key: string]: any; // allows flexible keys like "customer_type", "team", etc.
}

interface ChartState {
  acvData: {
    customer_type: ACVItem[];
    account_industry: ACVItem[];
    team: ACVItem[];
    acv_range: ACVItem[];
  } | null;
  loading: boolean;
}

const initialState: ChartState = {
  acvData: null,
  loading: false,
};

export const fetchACVData = createAsyncThunk("chart/fetch", async () => {
  const res = await axios.get("http://localhost:3001/api/data/acv-by-quarter");
  return res.data;
});

const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchACVData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchACVData.fulfilled, (state, action) => {
        state.acvData = action.payload;
        state.loading = false;
      })
      .addCase(fetchACVData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default chartSlice.reducer;
