import React from 'react';

import { Collapsible, Table, useCollapsible } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';

import { BaseModel } from '@/data/interfaces/api';
import { DataRowProps } from './data-row.model';

const textAlignMap: Record<string, string> = {
  left: 'start',
  center: 'center',
  right: 'end',
};

export default function DataRow<Entry extends BaseModel>({
  row,
  colSpan,
  CollapsibleBody,
}: DataRowProps<Entry>): React.JSX.Element {
  const collapsible = useCollapsible();

  return (
    <>
      <Table.Row
        onClick={() =>
          CollapsibleBody && collapsible.setOpen(!collapsible.open)
        }
      >
        {row.getVisibleCells().map((cell) => {
          const align = (cell.column.columnDef?.meta as Record<string, unknown>)
            ?.align as string;
          return (
            <Table.Cell key={cell.id} textAlign={textAlignMap[align]}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Table.Cell>
          );
        })}
      </Table.Row>

      {CollapsibleBody && (
        <Collapsible.RootProvider as={Table.Row} value={collapsible}>
          <Collapsible.Content
            as={Table.Cell}
            bg="bg.subtle"
            // @ts-expect-error colSpan is valid on <td>
            colSpan={colSpan || 0}
            p={4}
          >
            <CollapsibleBody row={row} />
          </Collapsible.Content>
        </Collapsible.RootProvider>
      )}
    </>
  );
}
