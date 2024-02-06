import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as APIfootball from '../../services/football.js';
import { Fixture } from '../../types/MatchProps.js';
import Row from '../../components/Row/Row.js';
import InputField from '../../components/InputField/InputField.js';
import Pagination from '../../components/Pagination/Pagination.js';
import MatchFilterPanel from '../../components/Dropdown/Dropdown.js';

const Live = () => {
    const [matches, setMatches] = useState<Fixture[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const matchesPerPage: number = 10;

    const onSearchTermChange = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    useEffect(() => {
        const fetchMatches = async () => {
            setIsLoading(true);
            try {
                const data = await APIfootball.getLiveMatches();
                setMatches(data);
                const savedMatches = localStorage.getItem('sortedMatches');
                if (savedMatches) {
                    setMatches(JSON.parse(savedMatches));
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load matches');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatches();
    }, []);

    function sortLiveMatchesByTime() {
        const sortedMatches = [...matches].sort((a, b) => {
            // @ts-ignore
            return a.fixture.status.elapsed - b.fixture.status.elapsed;
        });

        localStorage.setItem('sortedMatches', JSON.stringify(sortedMatches));
        setMatches(sortedMatches);
    }

    const filteredMatches = matches.filter(match =>
        match.teams.home.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.teams.away.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lastPageIndex = currentPage * matchesPerPage;
    const firstPageIndex = lastPageIndex - matchesPerPage;
    const currentSlicedPage = filteredMatches.slice(firstPageIndex, lastPageIndex);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='flex flex-col m-auto w-full h-full rounded-md bg-slate-300 p-2 relative'>
            <InputField onSearchTermChange={onSearchTermChange} placeholder='Search...' />

            <div className='flex justify-between items-center'>
                <MatchFilterPanel
                    matchesLength={matches.length}
                    sortLiveMatchesByTime={sortLiveMatchesByTime}
                />
            </div>

            <div className='w-full h-full rounded-md overflow-auto'>
                {filteredMatches.length > 0 ? currentSlicedPage.map((m) => (
                    <Link to={`/match-details/${m.fixture.id}`} key={m.fixture.id}>
                        <Row {...m} />
                    </Link>
                )) : searchTerm ? 'No matches found for your search' : 'There are no live matches'}
            </div>
            {filteredMatches.length > 10 && (
                <div className='fixed ml-[250px] left-0 right-0 bottom-[35px] bg-white p-5 shadow-md'>
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalMatches={filteredMatches.length} matchesPerPage={matchesPerPage} />
                </div>
            )}
        </div>
    );
}

export default Live;
