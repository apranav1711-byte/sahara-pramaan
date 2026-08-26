import { afterEach, describe, expect, it, vi } from "vitest";
import type { GeocodingResult, PlacesSearchResult } from "./_core/map";

vi.mock("./_core/map", () => ({ makeRequest: vi.fn() }));

import { makeRequest } from "./_core/map";
import { findSupportLocations } from "./realLocations";

const mockedRequest = vi.mocked(makeRequest);

afterEach(() => mockedRequest.mockReset());

describe("findSupportLocations", () => {
  it("geocodes a PIN and returns mapped Google nearby places", async () => {
    mockedRequest
      .mockResolvedValueOnce({ results: [{ geometry: { location: { lat: 28.6139, lng: 77.209 } } }] } as GeocodingResult)
      .mockResolvedValueOnce({ results: [{ place_id: "place-1", name: "India Post", formatted_address: "New Delhi, India", geometry: { location: { lat: 28.6239, lng: 77.209 } }, types: ["post_office"], rating: 4.2 }] } as PlacesSearchResult);

    const response = await findSupportLocations({ pincode: "110001" });

    expect(response.source).toBe("google");
    expect(response.center).toEqual({ lat: 28.6139, lng: 77.209 });
    expect(response.locations[0]).toMatchObject({ id: "place-1", name: "India Post", kind: "Post office", rating: 4.2, location: { lat: 28.6239, lng: 77.209 } });
    expect(response.locations[0]?.mapsUrl).toContain("query_place_id=place-1");
    expect(mockedRequest).toHaveBeenNthCalledWith(1, "/maps/api/geocode/json", { address: "110001, India", region: "in" });
    expect(mockedRequest).toHaveBeenNthCalledWith(2, "/maps/api/place/nearbysearch/json", expect.objectContaining({ location: "28.6139,77.209", radius: 10000 }));
  });

  it("uses consented coordinates without geocoding", async () => {
    mockedRequest.mockResolvedValueOnce({ results: [{ place_id: "place-2", name: "Community Centre", formatted_address: "Bengaluru, India", geometry: { location: { lat: 12.9716, lng: 77.5946 } }, types: ["establishment"] }] } as PlacesSearchResult);

    const response = await findSupportLocations({ lat: 12.9716, lng: 77.5946 });

    expect(response.source).toBe("google");
    expect(response.center).toEqual({ lat: 12.9716, lng: 77.5946 });
    expect(mockedRequest).toHaveBeenCalledTimes(1);
    expect(mockedRequest).toHaveBeenCalledWith("/maps/api/place/nearbysearch/json", expect.objectContaining({ location: "12.9716,77.5946" }));
  });

  it("rejects missing search input into an honest synthetic response", async () => {
    const response = await findSupportLocations({ pincode: "123" });
    expect(response.source).toBe("synthetic");
    expect(response.message).toContain("six-digit Indian PIN code");
    expect(mockedRequest).not.toHaveBeenCalled();
  });

  it("falls back to synthetic locations when the live proxy fails", async () => {
    mockedRequest.mockRejectedValueOnce(new Error("proxy unavailable"));

    const response = await findSupportLocations({ pincode: "110001" });

    expect(response.source).toBe("synthetic");
    expect(response.locations.length).toBeGreaterThan(0);
    expect(response.message).toContain("illustrative");
  });
});
