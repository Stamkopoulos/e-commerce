import React, { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import DatePicker from "./DatePicker";
import { addDays } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { getDashboardOverview } from "../services/AdminApi";
import { useAuth } from "@clerk/clerk-react";

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--primary)" },
  orders: { label: "Orders", color: "var(--primary)" },
};

export default function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const { getToken } = useAuth();

  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dateRange.from || !dateRange.to) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const params = {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        };
        const data = await getDashboardOverview(token, params);

        const formattedData = data.salesOverview.map((d) => ({
          date: d._id,
          revenue: d.revenue,
          orders: d.orders,
        }));

        // console.log("Fetched chart data:", formattedData);

        setChartData(formattedData);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, getToken]);

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between gap-2">
        {/* Left side */}
        <div className=" ">
          <CardTitle className="text-lg pb-2">Total Revenue & Orders</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              Total for selected range
            </span>
          </CardDescription>
        </div>

        {/* Right side */}
        <div className="w-full sm:w-auto">
          <DatePicker date={dateRange} setDate={setDateRange} />
        </div>
      </CardHeader>

      {/* 
      <CardHeader>
        <CardTitle className="text-lg">Top Products</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Top products by unit sales
          </span>
        </CardDescription>
      </CardHeader> */}

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="text-center py-20">Loading chart...</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-orders)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-orders)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="orders"
                type="natural"
                fill="url(#fillOrders)"
                stroke="var(--color-orders)"
                stackId="a"
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
