import React from "react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "../../components/TableInstances/column";
import { DataTable } from "../../components/Datatable/data-table";
import { fetchGameRecords } from "../../services/api/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function GameRecord() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["gameRecords"],
    queryFn: fetchGameRecords,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading game data</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Game Records</h1>
      <DataTable columns={columns} data={data} />
      <div className="flex justify-center mt-4">
        <Link to="/get-started">
          <Button className="bg-black text-white">
            Back to get started Page
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default GameRecord;
