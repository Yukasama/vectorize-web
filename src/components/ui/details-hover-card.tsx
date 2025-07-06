import * as React from 'react';

interface DetailsHoverCardProps {
  children?: React.ReactNode;
  copied: boolean;
  copiedTag?: boolean;
  createdAt?: string;
  createdAtBelowId?: boolean;
  id: string;
  loading: boolean;
  maxLength?: number;
  onCopy?: (id: string) => void;
  onCopyTag?: (tag: string) => void;
  tag?: string;
  title: string;
  updatedAt?: string;
}

const truncate = (str: string, max = 24) =>
  str.length > max ? str.slice(0, max - 1) + '…' : str;

export const DetailsHoverCard: React.FC<DetailsHoverCardProps> = ({
  children,
  copied,
  copiedTag = false,
  createdAt,
  createdAtBelowId = false,
  id,
  loading,
  maxLength = 40,
  onCopy,
  onCopyTag,
  tag,
  title,
  updatedAt,
}) => (
  <div className="bg-background relative min-w-[120px] rounded-lg shadow-md">
    {loading && <div>Loading data...</div>}
    {!loading && (
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-base font-semibold">
          {truncate(title, maxLength)}
          {children}
        </div>
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <b>ID:</b> {truncate(id, maxLength)}
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
        {tag && (
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <b>Tag:</b> {truncate(tag.toLowerCase(), maxLength)}
            {onCopyTag && (
              <button
                className="hover:bg-accent focus:ring-accent ml-1 rounded px-1 py-0.5 focus:ring-2 focus:outline-none"
                onClick={() => onCopyTag(tag)}
                title="Copy Tag"
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
            {copiedTag && (
              <span className="ml-1 text-green-600 transition-opacity duration-200">
                Copied
              </span>
            )}
          </div>
        )}
        <div className="text-muted-foreground text-xs select-none">
          Created {createdAt}
        </div>
      </div>
    )}
    {!loading && !id && <div>No data found.</div>}
  </div>
);
