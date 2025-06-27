import * as React from 'react';

interface DetailsHoverCardProps {
  children?: React.ReactNode;
  copied: boolean;
  createdAt?: string;
  createdAtBelowId?: boolean;
  id: string;
  loading: boolean;
  onCopy?: (id: string) => void;
  title: string;
  updatedAt?: string;
}

export const DetailsHoverCard: React.FC<DetailsHoverCardProps> = ({
  children,
  copied,
  createdAt,
  createdAtBelowId = false,
  id,
  loading,
  onCopy,
  title,
  updatedAt,
}) => (
  <div className="bg-background relative min-w-[180px] rounded-lg p-1 shadow-md">
    {loading && <div>Loading data...</div>}
    {!loading && (
      <div className="space-y-2 pb-5 text-sm">
        <div className="flex items-center gap-2 text-base font-semibold">
          {title}
          {children}
        </div>
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <b>ID:</b> {id}
          {onCopy && (
            <button
              className="hover:bg-accent focus:ring-accent ml-1 rounded px-1 py-0.5 focus:ring-2 focus:outline-none"
              onClick={() => onCopy(id)}
              title="Copy ID"
              type="button"
            >
              <svg
                className="inline align-middle"
                fill="none"
                height="14"
                viewBox="0 0 20 20"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  fill="none"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  width="10"
                  x="7"
                  y="3"
                />
                <rect
                  fill="none"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  width="10"
                  x="3"
                  y="7"
                />
              </svg>
            </button>
          )}
          {copied && (
            <span className="ml-1 text-green-600 transition-opacity duration-200">
              Copied
            </span>
          )}
        </div>
        {/* CreatedAt below ID for models */}
        {createdAtBelowId && createdAt && (
          <div className="text-muted-foreground text-xs select-none">
            Created {createdAt}
          </div>
        )}
        {/* CreatedAt bottom right for datasets (default) */}
        {!createdAtBelowId && createdAt && (
          <div className="text-muted-foreground absolute right-4 bottom-2 text-right text-xs select-none">
            Created {createdAt}
          </div>
        )}
        {updatedAt && (
          <div className="text-muted-foreground absolute right-4 bottom-2 text-right text-xs select-none">
            Updated {updatedAt}
          </div>
        )}
      </div>
    )}
    {!loading && !id && <div>No data found.</div>}
  </div>
);
