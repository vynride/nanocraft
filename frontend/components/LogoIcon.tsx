import React from "react";

interface LogoIconProps {
  className?: string;
  size?: number;
}

const LogoIcon: React.FC<LogoIconProps> = ({ className = "", size = 32 }) => (
  <img
    src="/logo.svg"
    alt="NanoCraft logo"
    width={size}
    height={size}
    className={className}
  />
);

export default LogoIcon;
