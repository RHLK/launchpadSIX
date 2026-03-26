/**
 * SpaceX Launchpad Data Interface
 * Structure of a launchpad object from SpaceX API.
 */
export interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  region: string;
  locality: string;
  latitude: number;
  longitude: number;
  launch_attempts: number;
  launch_successes: number;
  status: string;
  wikipedia: string;
  details: string;
  launches: string[];
}
