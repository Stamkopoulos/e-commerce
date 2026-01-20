export default function AdminTable({ columns, data = [] }) {
  return (
    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="p-2 border">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row._id}>
            {columns.map((col) => (
              <td key={`${row._id}-${col.key}`} className="p-2 border">
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
