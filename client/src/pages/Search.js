import styles from "./Search.module.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Review, ReviewHeader } from "../components/Review";
import { backendRequest } from "../backend";

function backendSearch({queryKey}) {
    const filter = queryKey[1];
    return backendRequest("GET", "/search", Object.fromEntries(Object.entries({
        plecareA: filter.from,
        sosireB: filter.to,
        mijlocTransport: filter.by
    }).filter(([, v]) => !!v)));
}

export default function Search() {
    const [filter, setFilter] = useState({
        from: "",
        to: "",
        by: ""
    });
    const inputProps = (key) => ({
        placeholder: "Empty is any",
        value: filter[key],
        onChange: (ev) => setFilter((old) => ({...old, [key]: ev.target.value}))
    });

    const {data, isLoading, isError, error, isSuccess} = useQuery({
        keepPreviousData: true,
        queryFn: backendSearch,
        queryKey: ["allTrips", filter]
    });

    return (
        <div>
            <div className={styles.filter}>
                <div>Starting from</div>
                <div>Going to</div>
                <div>By</div>

                <input type="text" {...inputProps("from")}/>
                <input type="text" {...inputProps("to")}/>
                <select {...inputProps("by")}>
                    <option value="">any</option>
                    <option value="bus">Bus</option>
                    <option value="metrou">Metro</option>
                    <option value="train">Train</option>
                    <option value="tram">Tram</option>
                </select>
            </div>

            {isError && <h1>{error}</h1>}
            {isLoading && <h1>Loading...</h1>}
            {isSuccess && <div className={styles.results}>
                <ReviewHeader/>
                {data.map((trip) => (
                    <Review key={trip.idTrip} trip={trip}/>
                ))}
            </div>
            }
        </div>
    );
}
