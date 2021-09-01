import { Button } from "@chakra-ui/react";

interface PropTypes {
  value: string;
  colorScheme?: string;
  isRemovable: boolean;
  onClick?: () => void;
}

export default function Tag({
  value,
  colorScheme = "teal",
  isRemovable,
  onClick = () => Function.prototype(),
}: PropTypes) {
  // if the tag is removable, render it with an X (times symbol) in front of the value
  const tagBody = isRemovable ? <>&times; {value}</> : <>{value}</>;

  return (
    <Button
      colorScheme={colorScheme}
      size="xs"
      onClick={() => onClick()}
    >
      {tagBody}
    </Button>
  );
}
