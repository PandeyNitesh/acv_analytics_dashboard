import path from "path";
import fs from "fs/promises";
import { Request, Response } from "express";

const readJson = async (fileName: string) => {
  const filePath = path.join(__dirname, "../../data", fileName);
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

export const getACVByQuarter = async (req: Request, res: Response) => {
  try {
    const customerData = await readJson("customer_type.json");
    const industryData = await readJson("account_industry.json");
    const teamData = await readJson("team.json");
    const acvRangeData = await readJson("acv_range.json");

    const transformData = (
      input: any[],
      labelKey: string,
      labelValue: string,
      quarterKey = "closed_fiscal_quarter"
    ) => {
      return input.map((entry) => ({
        fiscal_quarter: entry[quarterKey],
        [labelKey]: entry[labelValue],
        acv: entry.acv,
        count: entry.count || 0,
      }));
    };

    const response = {
      customer_type: transformData(customerData, "customer_type", "Cust_Type"),
      account_industry: transformData(
        industryData,
        "industry",
        "Acct_Industry"
      ),
      team: transformData(teamData, "team", "Team"),
      acv_range: transformData(acvRangeData, "acv_range", "ACV_Range"),
    };

    res.json(response);
  } catch (err) {
    console.error("Error loading JSON data:", err);
    res.status(500).json({ error: "Failed to load ACV data." });
  }
};
