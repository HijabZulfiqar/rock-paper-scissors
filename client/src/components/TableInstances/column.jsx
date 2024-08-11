export const columns = [
  {
    accessorKey: "player1",
    header: "Player 1",
  },
  {
    accessorKey: "player2",
    header: "Player 2",
  },
  {
    accessorKey: "winner",
    header: "Winner",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
  },
];
