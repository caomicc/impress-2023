import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

export const RemoveButton = ({ onClick }: IconButtonProps) => {
  return (
    <IconButton
      aria-label="Remove"
      title="Remove"
      icon={<CloseIcon />}
      size="xs"
      borderRadius="full"
      boxShadow="lg"
      backgroundColor={'grey.100'}
      onClick={onClick}
      _hover={{
        // Override night mode's fade-out on hover
        opacity: 1,
        transform: "scale(1.15, 1.15)",
      }}
      _focus={{
        transform: "scale(1.15, 1.15)",
        boxShadow: "outline",
      }}
    />
  );
}
