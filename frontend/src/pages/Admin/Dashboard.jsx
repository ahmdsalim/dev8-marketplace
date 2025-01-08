import { useState } from "react";
import { Overview } from "@/components/admin/Overview";
import { RecentOrders } from "@/components/admin/RecentOrders";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingBag, TrendingUp, Users } from "lucide-react";
import useDashboard from "@/hooks/admin/useDashboard";
import { formatRupiah } from "@/utils/FormatRupiah";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useOrderChart from "@/hooks/admin/useOrderChart";

const Dashboard = () => {
  const [filterChart, setFilterChart] = useState("week");
  const { isLoading, data } = useDashboard();
  const { isLoading: isOrderChartLoading, data: orderChart } = useOrderChart({ filter: filterChart });

  const filterChartOptions = [
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
  ];

  const getPercentageText = (percentage) => {
    if (percentage > 0) {
      return `+${percentage}% from last month`;
    } else if (percentage < 0) {
      return `${percentage}% from last month`;
    } else {
      return "No change from last month";
    }
  };

  const handleFilterChart = (value) => {
    setFilterChart(value);
  };

  return (
    <>
      <div className="flex">
        <h2 className="text-3xl font-semibold text-slate-800 tracking-tight">
          Dashboard
        </h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total User</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-7 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {data?.metrics?.totalUsers}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getPercentageText(data?.percentages.user)}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Order</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-7 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {data?.metrics?.totalOrders}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getPercentageText(data?.percentages.order)}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-7 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatRupiah(data?.metrics?.totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getPercentageText(data?.percentages.revenue)}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-7 bg-slate-200 rounded animate-pulse"></div>
              ) : (
                <div className="text-2xl font-bold">
                  {formatRupiah(data?.metrics?.totalPendingRevenue)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          <Card className="sm:col-span-8">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Sales Overview</CardTitle>
              <Select
                value={`${filterChart}`}
                onValueChange={handleFilterChart}
              >
                <SelectTrigger className="h-8 w-24">
                  <SelectValue placeholder={`${filterChart}`} />
                </SelectTrigger>
                <SelectContent>
                  {filterChartOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {isOrderChartLoading ? (
                <div className="w-full h-[350px] bg-slate-200 rounded animate-pulse"></div>
              ) : (
                <Overview chartData={orderChart} />
              )}
            </CardContent>
          </Card>
          <Card className="sm:col-span-4">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                You made {data?.metrics.totalOrdersThisMonth} orders this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid gap-y-8 animate-pulse">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-8 bg-slate-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <RecentOrders orders={data?.recentOrders} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
