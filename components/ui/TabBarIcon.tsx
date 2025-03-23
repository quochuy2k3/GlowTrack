import { LucideIcon } from "lucide-react-native";

export default function TabBarIcon({
  color,
  Icon,
}: {
  color: string;
  Icon: LucideIcon;
}) {
  return <Icon color={color}  />;
}
