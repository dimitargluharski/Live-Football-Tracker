import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import * as APIfootball from '../../services/football.js'
import { Fixture } from '../../types/MatchProps.js';
import Row from '../../components/Row/Row.js';
import InputField from '../../components/InputField/InputField.js';


const Live = () => {
    const [matches, setMatches] = useState<Fixture[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const onSearchTermChange = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    useEffect(() => {
        const fetchMatches = () => {
            setIsLoading(true);
            APIfootball.getLiveMatches().then((data: Fixture[]) => {
                setMatches(data);
            }).catch((err: any) => {
                console.log(err);
                setError('Failed to load matches');
            }).finally(() => {
                setIsLoading(false);
            });
        }

        fetchMatches(); // Fetch matches immediately on component mount

        const intervalId = setInterval(fetchMatches, 5 * 60 * 1000); // Fetch matches every 5 minutes

        return () => {
            clearInterval(intervalId); // Clear the interval when the component unmounts
        }
    }, []);

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>{error}</div>
    }

    const filteredMatches = matches.filter(match =>
        match.teams.home.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.teams.away.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='flex flex-col m-auto w-full rounded-md'>
            <InputField onSearchTermChange={onSearchTermChange} />

            <h1>Live: {filteredMatches.length}</h1>

            <div className='w-full rounded-md'>
                {filteredMatches.length > 0
                    ? filteredMatches.map((m) => (
                        <Link to={`/match-details/${m.fixture.id}`} key={m.fixture.id}>
                            <Row {...m} />
                        </Link>
                    ))
                    : searchTerm
                        ? 'No matches found for your search'
                        : 'There are no live matches'
                }
            </div>
        </div>
    )
}

export default Live;