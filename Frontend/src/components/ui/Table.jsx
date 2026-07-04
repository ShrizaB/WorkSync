import { ChevronLeft, ChevronRight } from 'lucide-react';

const Table = ({ columns, data, loading, emptyMessage = 'No data found' }) => {
  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-warm-400 text-sm">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-warm-50 border-b border-warm-100">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="table-header" style={col.width ? { width: col.width } : {}}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-14 text-warm-400 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id ?? i} className="table-row">
                {columns.map(col => (
                  <td key={col.key} className="table-cell">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export const Pagination = ({ page, totalPages, onPage }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="p-2 rounded-xl text-warm-400 hover:text-warm-900 hover:bg-warm-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPage(p)}
          className={`w-8 h-8 rounded-xl text-sm font-semibold transition-colors ${
            p === page ? 'bg-warm-900 text-white' : 'text-warm-500 hover:text-warm-900 hover:bg-warm-100'
          }`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
        className="p-2 rounded-xl text-warm-400 hover:text-warm-900 hover:bg-warm-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Table;
