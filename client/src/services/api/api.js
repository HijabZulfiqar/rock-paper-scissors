import axios from "axios";

export async function fetchGameRecords() {
  try {
    const response = await axios.get("http://localhost:3000/api/games");
    return response.data;
  } catch (error) {
    console.error("Error fetching game data:", error);
    throw error;
  }
}
