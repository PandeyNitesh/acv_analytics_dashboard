import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import type { ACVItem } from "../redux/chartSlice";

interface Props {
  data: ACVItem[];
  categoryKey: string;
}

export const ACVTable: React.FC<Props> = ({ data, categoryKey }) => {
  const quarters = Array.from(
    new Set(data.map((item) => item.fiscal_quarter))
  ).sort();
  const groups = Array.from(new Set(data.map((item) => item[categoryKey])));

  // Group data by quarter and type
  const grouped: Record<
    string,
    Record<string, { count: number; acv: number }>
  > = {};
  const totals: Record<string, { count: number; acv: number }> = {};

  for (const item of data) {
    const quarter = item.fiscal_quarter;
    const key = item[categoryKey];
    if (!grouped[quarter]) grouped[quarter] = {};
    if (!grouped[quarter][key]) grouped[quarter][key] = { count: 0, acv: 0 };
    grouped[quarter][key].count += item.count;
    grouped[quarter][key].acv += item.acv;

    if (!totals[key]) totals[key] = { count: 0, acv: 0 };
    totals[key].count += item.count;
    totals[key].acv += item.acv;
  }

  const grandTotal = Object.values(totals).reduce(
    (acc, curr) => {
      acc.count += curr.count;
      acc.acv += curr.acv;
      return acc;
    },
    { count: 0, acv: 0 }
  );

  const format = (val: number) => `$${val.toLocaleString()}`;

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell rowSpan={1}>
              <strong>Closed Fiscal Quarter</strong>
            </TableCell>
            {quarters.map((q) => (
              <TableCell
                key={q}
                align="center"
                colSpan={3}
                sx={{ backgroundColor: "#1976d2", color: "white" }}
              >
                {q}
              </TableCell>
            ))}
            <TableCell
              align="center"
              colSpan={3}
              sx={{ backgroundColor: "#1565c0", color: "white" }}
            >
              Total
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell rowSpan={1}>
              <strong>Cust Type</strong>
            </TableCell>
            {quarters.map((_) => (
              <>
                <TableCell align="right"># of Opps</TableCell>
                <TableCell align="right">ACV</TableCell>
                <TableCell align="right">% of Total</TableCell>
              </>
            ))}
            <TableCell align="right"># of Opps</TableCell>
            <TableCell align="right">ACV ↓</TableCell>
            <TableCell align="right">% of Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group}>
              <TableCell>
                <strong>{group}</strong>
              </TableCell>
              {quarters.map((q) => {
                const entry = grouped[q]?.[group] || { count: 0, acv: 0 };
                const quarterTotal = Object.values(grouped[q] || {}).reduce(
                  (acc, curr) => acc + curr.acv,
                  0
                );
                return (
                  <>
                    <TableCell align="right">{entry.count}</TableCell>
                    <TableCell align="right">{format(entry.acv)}</TableCell>
                    <TableCell align="right">
                      {quarterTotal
                        ? `${Math.round((entry.acv / quarterTotal) * 100)}%`
                        : "0%"}
                    </TableCell>
                  </>
                );
              })}
              <TableCell align="right">{totals[group].count}</TableCell>
              <TableCell align="right">{format(totals[group].acv)}</TableCell>
              <TableCell align="right">
                {grandTotal.acv
                  ? `${Math.round((totals[group].acv / grandTotal.acv) * 100)}%`
                  : "0%"}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <strong>Total</strong>
            </TableCell>
            {quarters.map((q) => {
              const quarterTotal = Object.values(grouped[q] || {}).reduce(
                (acc, curr) => {
                  acc.count += curr.count;
                  acc.acv += curr.acv;
                  return acc;
                },
                { count: 0, acv: 0 }
              );
              return (
                <>
                  <TableCell align="right">
                    <strong>{quarterTotal.count}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{format(quarterTotal.acv)}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>100%</strong>
                  </TableCell>
                </>
              );
            })}
            <TableCell align="right">
              <strong>{grandTotal.count}</strong>
            </TableCell>
            <TableCell align="right">
              <strong>{format(grandTotal.acv)}</strong>
            </TableCell>
            <TableCell align="right">
              <strong>100%</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
