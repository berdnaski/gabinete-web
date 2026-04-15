import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  name?: string;
  avatarUrl?: string;
  size?: "default" | "sm" | "lg"
}

export function UserAvatar({
  name,
  avatarUrl,
  size = 'lg',
}: UserAvatarProps) {
  return (
    <Avatar size={size}>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
        {name ? getFirstLettersFromNames(name) : <User />}
      </AvatarFallback>
    </Avatar>
  )
}