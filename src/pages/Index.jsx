import React, { useState, useEffect } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Input, Text, VStack, useToast, IconButton, CloseButton, Textarea } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();

  const fetchNotes = async () => {
    try {
      const response = await fetch("https://mnwefvnykbgyhbdzpleh.supabase.co/notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      toast({
        title: "Error fetching notes",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const addNote = async () => {
    try {
      const response = await fetch("https://mnwefvnykbgyhbdzpleh.supabase.co/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      fetchNotes();
      setNote("");
      toast({
        title: "Note added",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error adding note",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`https://mnwefvnykbgyhbdzpleh.supabase.co/notes?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      fetchNotes();
      toast({
        title: "Note deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting note",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const updateNote = async () => {
    try {
      const response = await fetch(`https://mnwefvnykbgyhbdzpleh.supabase.co/notes?id=eq.${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      fetchNotes();
      setNote("");
      setEditingId(null);
      toast({
        title: "Note updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating note",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Flex direction="column" p={5}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel htmlFor="note">Note</FormLabel>
          <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </FormControl>
        <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={editingId ? updateNote : addNote}>
          {editingId ? "Update Note" : "Add Note"}
        </Button>
      </VStack>
      {notes.map((note) => (
        <Flex key={note.id} p={2} borderWidth="1px" borderRadius="lg" alignItems="center" justifyContent="space-between">
          <Text>{note.note}</Text>
          <Box>
            <IconButton
              icon={<FaEdit />}
              onClick={() => {
                setNote(note.note);
                setEditingId(note.id);
              }}
              aria-label="Edit Note"
              mr={2}
            />
            <IconButton icon={<FaTrash />} onClick={() => deleteNote(note.id)} aria-label="Delete Note" />
          </Box>
        </Flex>
      ))}
    </Flex>
  );
};

export default Index;
