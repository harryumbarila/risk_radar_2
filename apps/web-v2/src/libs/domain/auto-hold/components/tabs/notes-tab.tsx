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
import { Plus, ChevronLeft, ChevronRight, Pin, PinOff } from 'lucide-react';

interface Note {
  id: string;
  note: string;
  dateCreated: string;
  createdBy: string;
  pushToIris: boolean;
  pinned: boolean;
}

interface NotesTabProps {
  merchantId: string;
  onAddNote?: (note: Omit<Note, 'id'>) => void;
  externalNotes?: Note[];
}

export default function NotesTab({ merchantId, onAddNote, externalNotes }: NotesTabProps) {
  const [notes, setNotes] = React.useState<Note[]>([
    {
      id: '1',
      note: 'Initial review completed. Merchant appears to be legitimate.',
      dateCreated: '2025-04-01',
      createdBy: 'John Doe',
      pushToIris: true,
      pinned: true,
    },
    {
      id: '2',
      note: 'Follow-up required for additional documentation.',
      dateCreated: '2025-04-05',
      createdBy: 'Jane Smith',
      pushToIris: false,
      pinned: false,
    },
    {
      id: '3',
      note: 'Merchant verified. All checks passed.',
      dateCreated: '2025-04-08',
      createdBy: 'John Doe',
      pushToIris: true,
      pinned: false,
    },
  ]);

  // Merge external notes (auto-generated) with local notes
  const allNotes = React.useMemo(() => {
    const external = externalNotes || [];
    const local = notes;
    // Combine and deduplicate by id
    const combined = [...external, ...local];
    const unique = combined.filter((note, index, self) => 
      index === self.findIndex((n) => n.id === note.id)
    );
    return unique;
  }, [notes, externalNotes]);
  const [newNote, setNewNote] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // Sort notes: pinned first, then by date (newest first)
  const sortedNotes = React.useMemo(() => {
    return [...allNotes].sort((a, b) => {
      // Pinned notes first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Then sort by date (newest first)
      return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
    });
  }, [allNotes]);

  const totalPages = Math.ceil(sortedNotes.length / itemsPerPage);
  const paginatedNotes = sortedNotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSaveNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      note: newNote,
      dateCreated: new Date().toISOString().substring(0, 10),
      createdBy: 'Current User', // In real app, get from auth context
      pushToIris: false,
      pinned: false,
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

  const handleTogglePin = (noteId: string) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? { ...note, pinned: !note.pinned }
          : note
      )
    );
    setCurrentPage(1); // Reset to first page after pinning
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
                <Table.ColumnHeader width="40px"></Table.ColumnHeader>
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
                  <Table.Cell colSpan={5} textAlign="center" py={8}>
                    <Text fontSize="sm" color="gray.600">
                      No notes found.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                paginatedNotes.map((note) => (
                  <Table.Row 
                    key={note.id}
                    bg={note.pinned ? 'yellow.50' : 'white'}
                    borderLeft={note.pinned ? '3px solid' : 'none'}
                    borderLeftColor={note.pinned ? 'yellow.400' : 'transparent'}
                  >
                    <Table.Cell>
                      <IconButton
                        size="xs"
                        variant="ghost"
                        onClick={() => handleTogglePin(note.id)}
                        aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                        colorPalette={note.pinned ? 'yellow' : 'gray'}
                      >
                        {note.pinned ? (
                          <Pin size={16} fill="currentColor" />
                        ) : (
                          <PinOff size={16} />
                        )}
                      </IconButton>
                    </Table.Cell>
                    <Table.Cell>
                      <HStack gap={2} align="center">
                        {note.pinned && (
                          <Text fontSize="xs" color="yellow.600" fontWeight="semibold">
                            PINNED
                          </Text>
                        )}
                        <Text fontSize="sm" color="gray.800" fontWeight={note.pinned ? 'semibold' : 'normal'}>
                          {note.note}
                        </Text>
                      </HStack>
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

