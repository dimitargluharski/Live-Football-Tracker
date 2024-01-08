export interface Fixture {
    id: number;
    date: string;
    periods: Periods; // ???
    // referee: string;
    status: Status;
    timestamp: number;
    goals: Goals;
    venue: Venue;
    league: League;
    teams: Teams;
    timezone: string;
    fixture: Fixtures;
    events: Events;
}

type Goals = {
    home: number;
    away: number;
};

type Periods = {
    first: number;
    second: number;
};

type Venue = {
    city: string | null;
    id: number | null;
    name: string | null;
};

type League = {
    coutnry: string;
    flag: string;
    id: number;
    logo: string;
    name: string;
    season: number;
    round: string;
};

type Teams = {
    home: Home;
    away: Away;
};

type Home = {
    id: number;
    name: string;
    logo: string;
    winner: boolean; // this should be enum type
};

type Away = {
    id: number;
    name: string;
    logo: string;
    winner: boolean; // this should be enum type
};

type Status = {
    elapsed: number | null;
    long: string;
    short: string;
};

type Fixtures = {
    venue: any;
    id: number;
    date: string;
    timezone: string;
    status: Status;
    referee: string;
};

type Events = {
    assist: Assist;
    comments: string | null;
    player: Player;
    team: Team;
    time: Time;
    type: string;
};

type Time = {
    elapsed: number;
    extran: number | null;
};

type Team = {
    id: number;
    name: string;
    logo: number;
};

type Player = {
    id: number;
    name: string;
};

type Assist = {
    id: number;
    name: string;
};
