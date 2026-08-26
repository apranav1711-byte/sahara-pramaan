import { makeRequest, type GeocodingResult, type LatLng, type PlacesSearchResult } from "./_core/map";
import { listSyntheticCamps } from "./demoStore";

export type SupportLocation = {
  id: string;
  name: string;
  address: string;
  kind: string;
  distanceKm: number | null;
  rating?: number;
  placeId?: string;
  location?: LatLng;
  mapsUrl?: string;
};

export type SupportLocationResponse = {
  source: "google" | "synthetic";
  center: LatLng;
  locations: SupportLocation[];
  message: string;
};

type LookupInput = {
  pincode?: string;
  lat?: number;
  lng?: number;
};

const DELHI_CENTER: LatLng = { lat: 28.6139, lng: 77.209 };

function syntheticResponse(pincode?: string, message = "Showing illustrative support locations while live map data is unavailable."): SupportLocationResponse {
  const locations = listSyntheticCamps(pincode).slice(0, 8).map(camp => ({
    id: camp.id,
    name: camp.name,
    address: `${camp.address}, India`,
    kind: camp.kind,
    distanceKm: camp.distanceKm,
  }));
  return { source: "synthetic", center: DELHI_CENTER, locations, message };
}

function geocodedCenter(result: GeocodingResult): LatLng | null {
  const location = result.results[0]?.geometry?.location;
  return location && Number.isFinite(location.lat) && Number.isFinite(location.lng) ? location : null;
}

function distanceKm(from: LatLng, to: LatLng): number {
  const radians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = radians(to.lat - from.lat);
  const dLng = radians(to.lng - from.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(dLng / 2) ** 2;
  return Number((earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
}

export async function findSupportLocations(input: LookupInput): Promise<SupportLocationResponse> {
  const hasCoordinates = Number.isFinite(input.lat) && Number.isFinite(input.lng);
  if (!hasCoordinates && !/^\d{6}$/.test(input.pincode || "")) return syntheticResponse(input.pincode, "Enter a six-digit Indian PIN code or allow location access to search nearby.");

  try {
    let center: LatLng = { lat: input.lat as number, lng: input.lng as number };
    if (!hasCoordinates) {
      const geocode = await makeRequest<GeocodingResult>("/maps/api/geocode/json", { address: `${input.pincode}, India`, region: "in" });
      const resolved = geocodedCenter(geocode);
      if (!resolved) return syntheticResponse(input.pincode, "That PIN code could not be located by the live map service; showing illustrative results instead.");
      center = resolved;
    }

    const places = await makeRequest<PlacesSearchResult>("/maps/api/place/nearbysearch/json", {
      location: `${center.lat},${center.lng}`,
      radius: 10000,
      keyword: "post office bank common service centre",
    });

    const locations = (places.results || []).slice(0, 8).map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      kind: place.types?.includes("post_office") ? "Post office" : "Nearby support place",
      distanceKm: distanceKm(center, place.geometry.location),
      rating: place.rating,
      placeId: place.place_id,
      location: place.geometry.location,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${encodeURIComponent(place.place_id)}`,
    }));

    if (!locations.length) return syntheticResponse(input.pincode, "No nearby support places were returned by the live map service; showing illustrative results instead.");
    return { source: "google", center, locations, message: "Live Google Maps places shown near your selected area. Confirm opening hours before travelling." };
  } catch (error) {
    console.warn("Live support-location lookup failed; using synthetic fallback", error);
    return syntheticResponse(input.pincode);
  }
}
