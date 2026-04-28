import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function Table<T>({ columns, data, keyExtractor, emptyMessage = 'Aucune donnée', onRowClick }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map(col => (
              <th
                key={col.key}
                className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-10 text-gray-400 dark:text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(item => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={`border-b border-gray-100 dark:border-gray-700/50 last:border-0 ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30' : ''} transition-colors`}
              >
                {columns.map(col => (
                  <td key={col.key} className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
