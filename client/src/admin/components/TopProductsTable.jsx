import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TopProductsTable({ products = [] }) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-lg">Top Products</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Top products by unit sales
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 max-h-[400px] overflow-auto px-2 pt-4 sm:px-6 sm:pt-6 ">
        <Table className=" overflow-hidden rounded-lg border border-black">
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Units Sold</TableHead>
              <TableHead className="text-center">Revenue (€)</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  No product data available
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.productId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image || "/images/placeholder.png"}
                        alt={p.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">{p.totalSold}</TableCell>

                  <TableCell className="text-center">
                    €{p.revenue.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
