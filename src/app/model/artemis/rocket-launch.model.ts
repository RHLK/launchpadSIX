/**
 * RocketLaunch.Live Launch Data Interface
 */
export interface RocketLaunch {
  id: number;
  name: string;
  provider: { name: string };
  vehicle: { name: string };
  pad: { name: string; location: { name: string } };
  missions: { description: string }[];
  launch_description: string;
  win_open: string;
  date_str: string;
}
