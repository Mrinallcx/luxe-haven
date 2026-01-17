import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { ActivityItem } from "@/lib/market-api";
import { truncateAddress, formatTxDate, getEtherscanTxUrl } from "@/utils/product-helpers";

interface TransactionHistoryProps {
  transactions: ActivityItem[];
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const [visibleTransactions, setVisibleTransactions] = useState(10);

  const displayedTransactions = transactions.slice(0, visibleTransactions);
  const hasMore = visibleTransactions < transactions.length;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-serif font-light text-foreground mb-8">Transaction History</h2>
      {transactions.length > 0 ? (
        <>
          <div className="bg-muted/20 border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Sl No</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Type</TableHead>
                  <TableHead className="text-muted-foreground font-medium">From</TableHead>
                  <TableHead className="text-muted-foreground font-medium">To</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Chain</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-center">Tx</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedTransactions.map((tx, index) => (
                  <TableRow key={tx.hash || `tx-${index}`} className="border-border">
                    <TableCell className="text-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-gold/10 text-gold text-xs rounded-full">
                        {tx.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {truncateAddress(tx.from)}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {truncateAddress(tx.to)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatTxDate(tx.timestamp)}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{tx.chain}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {tx.hash ? (
                        <a
                          href={getEtherscanTxUrl(tx.hash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 hover:bg-gold/20 text-gold transition-colors"
                          title="View on Etherscan"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                className="rounded-full border-gold text-gold hover:bg-gold hover:text-charcoal"
                onClick={() => setVisibleTransactions((prev) => prev + 10)}
              >
                View More
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-muted/20 border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No transaction history available</p>
        </div>
      )}
    </section>
  );
};

export default TransactionHistory;

