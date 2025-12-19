declare module "react-toggle-dark-mode" {
  import { CSSProperties } from "react";

  export interface DarkModeSwitchProps {
    style?: CSSProperties;
    size?: number | string;
    moonColor?: string;
    sunColor?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
  }

  export const DarkModeSwitch: React.FC<DarkModeSwitchProps>;
}
