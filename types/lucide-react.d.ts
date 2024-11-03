declare module "lucide-react" {
  import { FC, SVGProps } from "react";
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  export type Icon = FC<IconProps>;

  export const Users: Icon;
  export const BarChart2: Icon;
  export const Settings: Icon;
  export const Bell: Icon;
  export const Search: Icon;
  export const Plus: Icon;
  export const MoreHorizontal: Icon;
  export const Calendar: Icon;
  export const TrendingUp: Icon;
  export const Loader2: Icon;
  // Add other icons as needed
}
