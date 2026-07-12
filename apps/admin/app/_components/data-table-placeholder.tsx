import { Card } from '@ak-strannik/ui/components/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@ak-strannik/ui/components/table';
import type { ReactNode } from 'react';

export function DataTablePlaceholder({
  columns,
  children,
}: {
  columns: readonly string[];
  children: ReactNode;
}) {
  return (
    <Card className="gap-0 py-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead className="whitespace-nowrap" key={column}>
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-transparent">
            <td className="p-4" colSpan={columns.length}>
              {children}
            </td>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}
