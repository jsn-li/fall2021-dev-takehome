import React, { useState } from "react";
import DatePicker from "react-date-picker";
import "./TodoItemForm.css";
import { TodoItem } from "./TodoList";
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Center, HStack, Input, Text, Wrap, WrapItem } from "@chakra-ui/react";
import Tag from "./Tag";

interface PropTypes {
  onSubmit: (todoItem: TodoItem) => void;
}

export default function TodoItemForm({ onSubmit }: PropTypes) {
  const [title, setTitle] = useState("");
  const [tagInputValue, setTagInputValue] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tags, setTags] = useState<Set<string>>(new Set<string>());

  const addTag = (tag: string) => {
    if (tag.trim().length === 0) {
      alert("Tag cannot be empty!");
      return;
    } else if (tags.has(tag)) {
      alert("Tag already exists!");
      return;
    }

    const updatedTags = new Set<string>(tags);
    updatedTags.add(tag);
    setTags(updatedTags);
    setTagInputValue("");
  };

  const removeTag = (tag: string) => {
    const updatedTags = new Set<string>(tags);
    updatedTags.delete(tag);
    setTags(updatedTags);
  };

  const renderTags = () => {
    const tagComponents: JSX.Element[] = [];

    tags.forEach((tag: string) => {
      tagComponents.push(
        <WrapItem>
          <Tag
            key={tag}
            value={tag}
            isRemovable={true}
            onClick={() => removeTag(tag)}
          />
        </WrapItem>
      );
    });

    return <Wrap mt={2.5} justify="center">{tagComponents}</Wrap>;
  };

  const handleSubmit = () => {
    if (title.trim().length === 0 || dueDate === null) {
      alert("Please ensure title and due date fields are populated.");
      return;
    }

    onSubmit({ id: uuidv4(), title: title, dueDate: dueDate, tags: tags });

    setTitle("");
    setTagInputValue("");
    setDueDate(null);
    setTags(new Set<string>());
  };

  return (
    <Box w="100%">
      <Box mb={5}>
        <Text mb={2.5}>Title:</Text>

        <Input
          variant="outline"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Box>

      <Box mb={5}>
        <Text mb={2.5}>Tags:</Text>

        <HStack>
          <Input
            value={tagInputValue}
            onChange={(e) => setTagInputValue(e.target.value)}
          />
          <Button onClick={() => addTag(tagInputValue)}>Create Tag</Button>
        </HStack>

        <Center>{renderTags()}</Center>
      </Box>

      <Box mb={5}>
        <Text mb={2.5}>Due Date:</Text>

        <DatePicker value={dueDate} onChange={setDueDate} />
      </Box>

      <Button w="100%" colorScheme="blue" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
}
