'use client';
import React from 'react';
import {
  Box,
  VStack,
  Text,
  Table,
  HStack,
  Input,
  Button,
  Checkbox,
  IconButton,
} from '@chakra-ui/react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface Note {
  id: string;
  note: string;
  dateCreated: string;
  createdBy: string;
  pushToIris: boolean;
}

interface NotesTabProps {
  merchantId: string;
}

export default function NotesTab({ merchantId }: NotesTabProps) {
  const [notes, setNotes] = React.useState<Note[]>([
    {
      id: '1',
      note: 'Initial review completed. Merchant appears to be legitimate.',
      dateCreated: '2025-04-01',
      createdBy: 'John Doe',
      pushToIris: true,
    },
    {
      id: '2',
      note: 'Follow-up required for additional documentation.',
      dateCreated: '2025-04-05',
      createdBy: 'Jane Smith',
      pushToIris: false,
    },
    {
      id: '3',
      note: 'Merchant verified. All checks passed.',
      dateCreated: '2025-04-08',
      createdBy: 'John Doe',
      pushToIris: true,
    },
  ]);
  const [newNote, setNewNote] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(notes.length / itemsPerPage);
  const paginatedNotes = notes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSaveNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      note: newNote,
      dateCreated: new Date().toISOString().split('T')[0],
      createdBy: 'Current User', // In real app, get from auth context
      pushToIris: false,
    };

    setNotes([note, ...notes]);
    setNewNote('');
    setCurrentPage(1);
  };

  const handleTogglePushToIris = (noteId: string) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? { ...note, pushToIris: !note.pushToIris }
          : note
      )
    );
  };

  return (
    <VStack align="stretch" gap={6}>
      {/* Add New Note */}
      <Box
        p={6}
        bg="white"
        borderRadius="xl"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <Text fontSize="md" fontWeight="semibold" color="gray.900" mb={4}>
          Add New Note
        </Text>
        <HStack gap={3}>
          <Input
            placeholder="Enter note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSaveNote();
              }
            }}
            flex={1}
          />
          <Button colorPalette="blue" onClick={handleSaveNote}>
            <Plus size={16} />
            Save
          </Button>
        </HStack>
      </Box>

      {/* Notes Table */}
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        borderWidth="1px"
        borderColor="gray.200"
        overflowX="auto"
      >
        <Table.ScrollArea>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Note</Table.ColumnHeader>
                <Table.ColumnHeader>Date Created</Table.ColumnHeader>
                <Table.ColumnHeader>Created By</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Push to IRIS
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedNotes.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={4} textAlign="center" py={8}>
                    <Text fontSize="sm" color="gray.600">
                      No notes found.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                paginatedNotes.map((note) => (
                  <Table.Row key={note.id}>
                    <Table.Cell>
                      <Text fontSize="sm" color="gray.800">
                        {note.note}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>{note.dateCreated}</Table.Cell>
                    <Table.Cell>{note.createdBy}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Checkbox.Root
                        checked={note.pushToIris}
                        onCheckedChange={() => handleTogglePushToIris(note.id)}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                      </Checkbox.Root>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <HStack justify="center" gap={2}>
          <IconButton
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </IconButton>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? 'solid' : 'outline'}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <IconButton
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </IconButton>
        </HStack>
      )}
    </VStack>
  );
}

