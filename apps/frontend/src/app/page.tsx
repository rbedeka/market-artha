import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function Home() {
  return (
    <NavigationMenu className="w-full border-b">
      <NavigationMenuList className="bg-blue-400  backdrop-blur-md w-full">
        <NavigationMenuItem className="w-1/3">Item 1</NavigationMenuItem>
        <NavigationMenuItem className="w-1/3">Item 2</NavigationMenuItem>
        <NavigationMenuItem className="w-1/3">Item 3</NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
