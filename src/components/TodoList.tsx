import {
  Box,
  Checkbox,
  HStack,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Tag from "./Tag";
import TodoItemForm from "./TodoItemForm";

export type TodoItem = {
  id: string;
  title: string;
  dueDate: Date;
  tags: Set<string>;
};

export default function TodoList() {
  const COMPLETED_COLOR = "gray";

  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [sortByDate, setSortByDate] = useState(false);
  const [sortByCompleted, setSortByCompleted] = useState(false);
  const [itemCompletions, setItemCompletions] = useState<{
    [key: string]: boolean;
  }>({});
  const [filterTags, setFilterTags] = useState<Set<string>>(new Set<string>());

  const addTodoItem = (todoItem: TodoItem) => {
    setTodoItems([...todoItems, todoItem]);
  };

  //
  // SORTING LOGIC
  //
  const compareCompletion = (a: TodoItem, b: TodoItem) => {
    const isAComplete = itemCompletions[a.id];
    const isBComplete = itemCompletions[b.id];

    if (isAComplete === isBComplete) {
      return 0;
    } else if (isAComplete === true) {
      // we want completed items at the bottom
      return 1;
    }

    return -1;
  };

  const compareDates = (a: TodoItem, b: TodoItem) => {
    return a.dueDate.getTime() - b.dueDate.getTime();
  };

  const getSortedTodoItems = () => {
    const sortedTodoItems = [...todoItems];

    if (sortByDate && sortByCompleted) {
      sortedTodoItems.sort(
        (a, b) => compareCompletion(a, b) || compareDates(a, b)
      );
    } else if (sortByDate) {
      sortedTodoItems.sort((a, b) => compareDates(a, b));
    } else if (sortByCompleted) {
      sortedTodoItems.sort((a, b) => compareCompletion(a, b));
    }

    return sortedTodoItems;
  };

  //
  // RENDERING
  //
  const toggleFilterTag = (tag: string) => {
    const updatedFilterTags = new Set<string>(filterTags);

    if (updatedFilterTags.has(tag)) {
      updatedFilterTags.delete(tag);
    } else {
      updatedFilterTags.add(tag);
    }

    setFilterTags(updatedFilterTags);
  };

  const renderTags = (todoItem: TodoItem, isComplete: boolean) => {
    const tagComponents: JSX.Element[] = [];

    todoItem.tags.forEach((tag: string) => {
      tagComponents.push(
        <WrapItem key={tag}>
          <Tag
            value={tag}
            isRemovable={false}
            colorScheme={
              // if the tag is being used as a filter, set it to orange.
              // otherwise, if the todo item is complete, set it to the COMPLETED_COLOR.
              // otherwise, the color scheme is determined by the Tag component itself.
              filterTags.has(tag)
                ? "orange"
                : isComplete
                ? COMPLETED_COLOR
                : undefined
            }
            onClick={() => toggleFilterTag(tag)}
          />
        </WrapItem>
      );
    });

    return <Wrap mt={1.5}>{tagComponents}</Wrap>;
  };

  const renderTodoItems = () => {
    return getSortedTodoItems()
      .filter((todoItem) => {
        let shouldRender = true;
        filterTags.forEach(
          (tag) => (shouldRender = shouldRender && todoItem.tags.has(tag))
        );

        return shouldRender;
      })
      .map((todoItem) => {
        const isComplete = itemCompletions[todoItem.id];

        return (
          <Box
            w="100%"
            key={todoItem.id}
            color={isComplete ? COMPLETED_COLOR : "inherit"}
            border="1px"
            borderColor="gray.200"
            borderRadius="5px"
          >
            <Checkbox
              m={5}
              isChecked={isComplete}
              onChange={() =>
                setItemCompletions({
                  ...itemCompletions,
                  [todoItem.id]: !isComplete,
                })
              }
            >
              <Box>
                <Text>Title: {todoItem.title}</Text>
                <Text>Due Date: {todoItem.dueDate.toDateString()}</Text>

                {renderTags(todoItem, isComplete)}
              </Box>
            </Checkbox>
          </Box>
        );
      });
  };

  const renderSortOptions = () => {
    return (
      <VStack spacing={5}>
        <HStack spacing={5}>
          <Checkbox
            isChecked={sortByDate}
            onChange={() => setSortByDate(!sortByDate)}
          >
            Sort by Date
          </Checkbox>

          <Checkbox
            isChecked={sortByCompleted}
            onChange={() => setSortByCompleted(!sortByCompleted)}
          >
            Sort by Completion
          </Checkbox>
        </HStack>

        <Text>Click on tags to filter.</Text>
      </VStack>
    );
  };

  return (
    <VStack
      spacing={10}
      p={25}
      border="1px"
      borderColor="gray.200"
      borderRadius="5px"
      minW={400}
      maxW={600}
    >
      <TodoItemForm onSubmit={addTodoItem}></TodoItemForm>

      {renderSortOptions()}

      <VStack w="100%" spacing={2.5}>
        {renderTodoItems()}
      </VStack>
    </VStack>
  );
}
