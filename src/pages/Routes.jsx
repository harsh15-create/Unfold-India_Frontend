// React and hooks for state
import React, { useState } from "react";

// Animation library you use for beautiful effects
import { motion } from "framer-motion";

// Icons for UI
import { MapPin, Navigation, Clock, Shield, Route } from "lucide-react";

// Map libraries for displaying/mapping routes
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// axios for making API requests
import axios from "axios";

// Safety Score Circle Component
const SafetyScore = ({ score }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="hsl(220 20% 20%)"
          strokeWidth="8"
          fill="transparent"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke="hsl(120 100% 50%)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 0 8px hsl(120 100% 50% / 0.3))' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{score}</span>
      </div>
    </div>
  );
};

const GEOAPIFY_API_KEY = "18a53cc064074dd3b34c0f14ec3ee10c"; // <-- REPLACE THIS

const Routes = () => {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [routes, setRoutes] = useState(null);
  const [error, setError] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  React.useEffect(() => {
    if (useCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setStartLocation(`${lat},${lon}`);
      });
    }
  }, [useCurrentLocation]);

  // Geocode address to coordinates
  async function geocode(address) {
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${GEOAPIFY_API_KEY}`
    );
    if (response.data.features.length > 0) {
      return response.data.features[0].geometry.coordinates; // [lon, lat]
    }
    throw new Error(`Location "${address}" not found`);
  }

  // Get alternative routes
  async function fetchRoutes(
    originCoords,
    destCoords
  ) {
    const response = await axios.get(
      "https://api.geoapify.com/v1/routing",
      {
        params: {
          waypoints: `${originCoords[1]},${originCoords[0]}|${destCoords[1]},${destCoords[0]}`,
          mode: "drive", // change to "foot" or "bike" as needed
          apiKey: GEOAPIFY_API_KEY,
          alternatives: 10
        }
      }
    );
    return response.data.features;
  }

  // Simulate safety score based on distance and major roads
  async function fetchSafetyScore(route) {
    const baseScore = 90;
    const distancePenalty = (route.properties.distance / 1000) * 2;
    const turns = route.properties.legs?.reduce((sum, leg) => sum + leg.steps.length, 0) || 0;
    const turnPenalty = turns * 1.5;
    const randomizer = Math.random() * 10;
    return Math.max(30, baseScore - distancePenalty - turnPenalty + randomizer);
  }

  // ==== THE MAIN ROUTE HANDLER ====
  const handleFindRoutes = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setRoutes(null);
    try {
      const originCoords = await geocode(startLocation);
      const destCoords = await geocode(destination);
      const alternatives = await fetchRoutes(originCoords, destCoords);

      // Compute fake safety scores
      const scoredRoutes = await Promise.all(
        alternatives.map(async route => ({
          route,
          distance: route.properties.distance,
          duration: route.properties.time,
          safetyScore: await fetchSafetyScore(route)
        }))
      );
      // Fastest: shortest duration
      const fastest = scoredRoutes.reduce((min, curr) =>
        curr.duration < min.duration ? curr : min, scoredRoutes[0]);
      // Safest of the "not-too-long" routes
      const candidateSafest = scoredRoutes
        .filter(r => r.distance <= 1.2 * fastest.distance)
        .reduce((min, curr) => curr.safetyScore > min.safetyScore ? curr : min, scoredRoutes[0]);
      if (!candidateSafest) throw new Error("No safe route within 20% length margin.");

      // Format for UI
      setRoutes({
        fastest: {
          duration: (fastest.duration / 60).toFixed(1) + " min",
          distance: (fastest.distance / 1000).toFixed(2) + " km",
          route: decodeRouteForPreview(fastest.route.properties.legs),
          geometry: fastest.route.geometry,
        },
        safest: {
          duration: (candidateSafest.duration / 60).toFixed(1) + " min",
          distance: (candidateSafest.distance / 1000).toFixed(2) + " km",
          safety_score: Math.round(candidateSafest.safetyScore),
          features: ["Well-lit", "AI evaluated", "Typical police patrolling"], // You can enhance these if you use a real safety API
          route: decodeRouteForPreview(candidateSafest.route.properties.legs),
          geometry: candidateSafest.route.geometry,
        }
      });
    } catch (err) {
      setError(err.message || "Failed to find routes");
    } finally {
      setIsLoading(false);
    }
  };

  // For now, preview the major steps as a string
  function decodeRouteForPreview(legs) {
    if (!legs) return "No preview";
    return legs.map(
      (leg) =>
        leg.steps
          .map((s) => s.instruction.text)
          .join("\n")
    ).join(" → ");
  }

  // --- MAP RENDERING (using react-leaflet) ---
// Decode geometry from Geoapify into valid Leaflet format
function decodeGeometry(geometry) {
  if (!geometry || !geometry.coordinates) return null;
  return geometry.coordinates.flatMap((coords) => {
    if (Array.isArray(coords) && coords.length === 2) {
      return [[coords[1], coords[0]]];
    }
    if (Array.isArray(coords) && Array.isArray(coords[0])) {
      return coords.map((c) => [c[1], c[0]]);
    }
    return [];
  });
}

function RoutesMap() {
  if (
    !routes ||
    !routes.fastest ||
    !routes.safest ||
    !routes.fastest.geometry ||
    !routes.safest.geometry ||
    !Array.isArray(routes.fastest.geometry.coordinates) ||
    !routes.fastest.geometry.coordinates.length // no points
  ) {
    return <div className="text-red-500">Map data not available.</div>;
  }

  const fastestCoords = decodeGeometry(routes.fastest.geometry);
  const safestCoords = decodeGeometry(routes.safest.geometry);

  // fallback center if coords are missing/invalid
  const center =
    (fastestCoords && fastestCoords[0] &&
      typeof fastestCoords[0][0] === "number" &&
      typeof fastestCoords[0][1] === "number")
      ? fastestCoords[0]
      : [28.6139, 77.2090]; // Delhi fallback

  if (!center || !Array.isArray(center) || center.length !== 2 || typeof center[0] !== 'number' || typeof center[1] !== 'number') {
    return <div className="text-red-500">Invalid map center coordinates.</div>;
  }

  // fastest route shown solid, safest shown dashed
  return (
    <MapContainer center={center} zoom={13} style={{ height: "400px", width: "100%" }} className="mt-8">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {fastestCoords && <Polyline positions={fastestCoords} weight={6} />}
      {safestCoords && <Polyline positions={safestCoords} weight={6} dashArray="8,6" color="green" />}
    </MapContainer>
  );
}


  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Safe Directions
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">AI-powered route planning with safety insights</p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          onSubmit={handleFindRoutes}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass glass-hover p-8 rounded-2xl mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 items-start">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setUseCurrentLocation(prev => !prev)}
                className="mb-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-foreground rounded-xl border border-primary/30 transition-all"
              >
                {useCurrentLocation ? "Using Current Location" : "Use My Current Location"}
              </button>
              <div className="relative flex flex-col">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
                <input
                  type="text"
                  placeholder="Start Location"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            <div className="relative flex flex-col mt-2 md:mt-6">
              <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || !startLocation || !destination}
            className="w-full backdrop-blur-[20px] bg-primary/25 border border-primary/30 hover:bg-primary/35 hover:backdrop-blur-[25px] p-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Finding Routes...</span>
                </>
              ) : (
                <>
                  <Route className="w-5 h-5" />
                  <span>Find Routes</span>
                </>
              )}
            </span>
          </motion.button>
        </motion.form>

        {/* Error notice */}
        {error && (
          <div className="text-red-500 text-center font-semibold py-2">{error}</div>
        )}

        {/* Results */}
        {routes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            {/* Fastest Route */}
            <div className="glass glass-hover p-6 rounded-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-xl glow-primary">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">🚗 Fastest Route</h3>
                  <p className="text-muted-foreground">Quickest way to reach</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-2xl font-bold text-primary">{routes.fastest.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="text-xl font-semibold text-foreground">{routes.fastest.distance}</span>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Route Preview:</p>
                  <div className="max-h-32 overflow-y-auto text-foreground whitespace-pre-line">
                    {routes.fastest.route}
                  </div>
                </div>
                <div className="flex justify-start mt-2">
                  <button
                    type="button"
                    onClick={() => setIsNavigating('fastest')}
                    className="mt-6 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-foreground rounded-xl border border-primary/30 transition-all"
                  >
                    Start Navigation
                  </button>
                </div>
              </div>
            </div>

            {/* Safest Route */}
            <div className="glass glass-hover p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-2xl" />
              <div className="flex items-center space-x-3 mb-6 relative z-10">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl glow-secondary">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">🛡️ Safest Route</h3>
                  <p className="text-muted-foreground">AI Recommended</p>
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-xl font-semibold text-foreground">{routes.safest.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="text-xl font-semibold text-foreground">{routes.safest.distance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Safety Score</span>
                  <SafetyScore score={routes.safest.safety_score} />
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Safety Features:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {routes.safest.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNavigating('safest')}
                  className="mt-4 px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-foreground rounded-xl border border-secondary/30 transition-all"
                >
                  Start Navigation
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Real Map Below */}
       {routes &&
  routes.fastest &&
  routes.fastest.geometry &&
  Array.isArray(routes.fastest.geometry.coordinates) &&
  routes.fastest.geometry.coordinates.length > 0 &&
  <RoutesMap />
}

        {/* Navigation Instructions */}
        {isNavigating && (
          <div className="mt-4 glass p-4 rounded-xl">
            <h3 className="font-bold mb-2">Navigation Instructions:</h3>
            <p className="text-sm whitespace-pre-line text-muted-foreground">
              {isNavigating === 'fastest' ? routes.fastest.route : routes.safest.route}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Routes;
