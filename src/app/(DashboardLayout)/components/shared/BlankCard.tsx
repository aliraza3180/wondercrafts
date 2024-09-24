import { Card } from "@mui/material";

type Props = {
  className?: string;
  children: JSX.Element | JSX.Element[];
};

const BlankCard = ({ children, className }: Props) => {
  return (
    <Card
      sx={{ p: 2, position: "relative", borderRadius: 3 }}
      className={className}
      elevation={9}
      variant={undefined}
    >
      {children}
    </Card>
  );
};

export default BlankCard;
