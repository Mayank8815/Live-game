import { createContext, useContext, useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbzXDQI6uzmPLdiPrWsOyTl7T6LWZZOmAi6ijB7HFH6PKsOpjPBupBnrxKp3zzc7ViChRg/exec";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  const fetchData = async (showLoader = false) => {
    if (showLoader) setLoading(true);

    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      // update only if data changed
      setData((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(json)) {
          return json;
        }
        return prev;
      });
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // AUTO LOAD + AUTO REFRESH
  useEffect(() => {
    fetchData(true); 

    const interval = setInterval(() => {
      fetchData(false); 
    }, 5000); 

    const handleFocus = () => fetchData(false);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // CREATE
  const createData = async (newData) => {
    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "create", ...newData }),
        // CRITICAL FIX: Must be text/plain to bypass Google Sheets CORS blocking
        headers: { "Content-Type": "text/plain;charset=utf-8" },
      });
      fetchData(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create profile");
      throw err; // Rethrow so Home.jsx knows it failed
    }
  };

// UPDATE
  const updateData = async (id, updatedData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        redirect: "follow", // Forces the browser to follow Google's internal redirect
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // Bypasses CORS blocks
        body: JSON.stringify({ 
          action: "update", 
          ...updatedData,
          Id: String(id) // Ensure ID is a string
        }),
      });

      const resultText = await response.text();
      let result;
      
      try {
        result = JSON.parse(resultText);
      } catch (e) {
        console.error("Google responded with non-JSON:", resultText);
        throw new Error("Invalid response from Google Sheets.");
      }

      // Check if our Google Script explicitly returned an error
      if (result.status === "error") {
        throw new Error(result.message);
      }

      // Wait 1 second for Google Sheets to finish writing before fetching the updated data
      setTimeout(() => {
        fetchData(false);
      }, 1000);

    } catch (err) {
      console.error("Update Error:", err);
      // This will pop up on your screen with the exact reason it failed!
      alert(`Update Failed: ${err.message}`);
      throw err;
    }
  };
  // DELETE
  const deleteData = async (id) => {
    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "delete", Id: id }),
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // CRITICAL FIX
      });
      fetchData(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete profile");
      throw err;
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        loading,
        refetch: fetchData,
        createData,
        updateData,
        deleteData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}