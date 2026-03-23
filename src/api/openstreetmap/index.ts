import axios from "axios";

interface GeocodeAddressProps {
  address: string;
  city: string;
  state: string
}

export interface GeocodeAddressResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
}

const OPENSTREETMAP_BASE_URL = 'https://nominatim.openstreetmap.org/search';

export const OpenStreetMapApi = {

  async getGeocodeAddress({ address, city, state }: GeocodeAddressProps): Promise<GeocodeAddressResult[]> {
    const query = `${address}, ${city}, ${state}, Brasil`;

    const response = await axios.get<GeocodeAddressResult[]>(`${OPENSTREETMAP_BASE_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`);

    return response.data;
  }
}