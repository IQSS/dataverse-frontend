import { Table } from '@iqss/dataverse-design-system'

interface TableProps {
  title: string
  versionRows: { key: string; value: string }[]
  fileRows: { col1: string; col2: string; col3: string }[]
}

export function DatasetVersionsDifferenceTable({ title, versionRows, fileRows }: TableProps) {
  return (
    <div className="mt-3">
      <h5>{title}</h5>

      {/* First Table - Version Information (2 Columns) */}
      <Table bordered>
        <tbody>
          {versionRows.map((row, index) => (
            <tr key={index}>
              <td>{row.key}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Second Table - Files Information (3 Columns, All Headers "Files") */}
      <Table bordered>
        <thead>
          <tr>
            <th>Files</th>
            <th>Files</th>
            <th>Files</th>
          </tr>
        </thead>
        <tbody>
          {fileRows.map((row, index) => (
            <tr key={index}>
              <td>{row.col1}</td>
              <td>{row.col2}</td>
              <td>{row.col3}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
