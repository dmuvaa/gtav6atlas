import {
  loadBusinesses,
  loadCharacters,
  loadDiscoveries,
  loadGuides,
  loadLocations,
  loadVehicles,
} from "@/lib/data";

export async function AtlasStats() {
  const [characters, locations, vehicles, businesses, guides, discoveries] =
    await Promise.all([
      loadCharacters(),
      loadLocations(),
      loadVehicles(),
      loadBusinesses(),
      loadGuides(),
      loadDiscoveries(),
    ]);

  const stats = [
    { label: "Characters", value: characters.length, hue: "text-[#ff7cc4]" },
    { label: "Locations", value: locations.length, hue: "text-accent-teal" },
    { label: "Vehicles", value: vehicles.length, hue: "text-accent-coral" },
    { label: "Businesses", value: businesses.length, hue: "text-accent-gold" },
    { label: "Guides", value: guides.length, hue: "text-[#a894ff]" },
    { label: "Discoveries", value: discoveries.length, hue: "text-[#bdb0e0]" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="card-leonida rounded-xl border border-border px-4 py-4 text-center"
        >
          <p className={`font-display text-3xl font-medium ${s.hue}`}>{s.value}</p>
          <p className="mt-1 text-xs text-muted">{s.label}</p>
        </div>
      ))}
    </div>
  );
}