import React, { useState } from "react";

const ClaimCoins = () => {
  const [key, setKey] = useState("");
  const [password, setPassword] = useState("");
  const [coins, setCoins] = useState(5); // Default coin value
  const [message, setMessage] = useState("");
  const [blockData, setBlockData] = useState(null); // Store full block details
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    if (!key || !password || coins <= 0) {
      setMessage("⚠️ Please enter key, password, and a valid coin amount!");
      return;
    }

    setLoading(true);
    setMessage("");
    setBlockData(null);

    try {
      const response = await fetch(
        `http://localhost:5001/claim?key=${encodeURIComponent(
          key
        )}&password=${encodeURIComponent(password)}&coins=${coins}`,
        { method: "GET" }
      );

      console.log("Response:", response);
      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Claim Successful!");
        setBlockData(data.block); // Store full block data
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to connect to the blockchain node.");
      console.error("Blockchain claim error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center">Claim FreeJournalCoin</h2>
      <div className="card p-4 shadow-sm">
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Enter Your Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Enter Coins to Claim"
          value={coins}
          onChange={(e) => setCoins(Number(e.target.value))}
        />
        <button
          className="btn btn-primary w-100"
          onClick={handleClaim}
          disabled={loading}
        >
          {loading ? "Claiming..." : `Claim ${coins} Coins`}
        </button>
        {message && <p className="mt-2 text-center">{message}</p>}

        {blockData && (
          <div className="mt-3 p-3 border rounded bg-light">
            <h5>🛠 Block Details:</h5>
            <pre className="small">{JSON.stringify(blockData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimCoins;
