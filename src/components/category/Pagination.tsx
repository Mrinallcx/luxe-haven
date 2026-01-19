import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage?: boolean; // If provided, use this instead of totalPages for Next button
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, hasNextPage, onPageChange }: PaginationProps) => {
  // Don't show pagination if we're on page 1 and there's no next page
  const showNext = hasNextPage !== undefined ? hasNextPage : currentPage < totalPages;
  if (currentPage === 1 && !showNext) return null;

  // Only show page numbers we can trust (within a reasonable range around current page)
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    // Always start from 1
    pages.push(1);
    
    // If current page is far from 1, add ellipsis
    if (currentPage > 3) {
      pages.push("...");
    }
    
    // Add pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(currentPage + 1, currentPage + maxVisiblePages);
    
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && !pages.includes(i)) {
        pages.push(i);
      }
    }
    
    // If there might be more pages, show ellipsis and "more" indicator
    if (showNext && currentPage < endPage + 2) {
      // Show a couple more pages if we have next
      const nextPages = [currentPage + 2, currentPage + 3].filter(p => p > endPage);
      nextPages.forEach(p => {
        if (!pages.includes(p)) pages.push(p);
      });
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      {/* Page Numbers */}
      {getVisiblePages().map((page, index) => (
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            className={`w-10 h-10 rounded-full ${currentPage === page ? "bg-charcoal text-cream" : ""}`}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </Button>
        )
      ))}
      
      {/* More indicator if there are more pages */}
      {showNext && (
        <span className="px-2 text-muted-foreground">...</span>
      )}
      
      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!showNext}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Pagination;
