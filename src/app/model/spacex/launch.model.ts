/**
 * SpaceX Launch Data Interface
 * Represents the structure of a launch object from the SpaceX API.
 */
export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  upcoming: boolean;
  success: boolean | null;
  status: 'Success' | 'Failure' | 'Upcoming';
  details: string;
  flight_number: number;
  links: {
    patch: {
      small: string;
    };
    article: string;
    wikipedia: string;
  };
}
