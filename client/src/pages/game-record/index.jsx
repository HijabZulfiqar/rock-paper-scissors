import React from "react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "../../components/TableInstances/column";
import { DataTable } from "../../components/Datatable/data-table";
import { fetchGameRecords } from "../../services/api/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

function GameRecord() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["gameRecords"],
    queryFn: fetchGameRecords,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-7xl">
        <LoaderCircle />
      </div>
    );
  }

  if (error) {
    return <div>Error loading game data</div>;
  }

  return (
    <div className="container mx-auto py-10 text-white ">
      <h1 className="text-2xl font-bold mb-4 text-center">Leader-Board</h1>
      <DataTable columns={columns} data={data} />
      <div className="flex justify-center mt-8">
        <Link to="/get-started">
          <Button className="bg-[#184e77] text-white group">
            Play game
            <span className="group-hover:translate-x-[-2px] transition-all ms-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-chevrons-left"
              >
                <path d="m11 17-5-5 5-5" />
                <path d="m18 17-5-5 5-5" />
              </svg>
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default GameRecord;
