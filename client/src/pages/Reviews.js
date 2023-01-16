import { useUserJwt } from "../state/User";
import { useState, Fragment } from "react";
import styles from "./Reviews.module.css";
import { backendRequest } from "../backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Review, ReviewHeader } from "../components/Review";

function addTrip(data) {
    return backendRequest("POST", "/share/trip", data.trip, {
        Authorization: `Bearer ${data.jwt}`
    });
}

function deleteTrip(data) {
    return backendRequest("DELETE", "/share/trip", {id: data.id}, {
        Authorization: `Bearer ${data.jwt}`
    });
}

function EditRow({initial = {}, onCancel}) {
    const jwt = useUserJwt();
    const [state, setState] = useState(initial);
    const formId = `form_for_${initial.idTrip}`;
    const doCancel = () => onCancel ? onCancel() : setState({});
    const inputProps = (prop, tk="value") => ({
        required: true,
        form: formId,
        name: prop,
        value: state[prop] ?? "",
        onChange: (ev) => setState((old) => ({...old, [prop]: ev.target[tk]}))
    });
    const queryClient = useQueryClient();
    const {mutate, isLoading} = useMutation({
        mutationFn: addTrip,
        onSuccess() {
            queryClient.invalidateQueries({queryKey: ["reviews", jwt]});
            queryClient.invalidateQueries({queryKey: ["allTrips"]});
            doCancel();
        },
        onError(err) {
            alert(`${err}`);
        }
    });

    return (
        <>
            <form id={formId} onSubmit={(ev) => {
                ev.preventDefault();
                mutate({
                    trip: state,
                    jwt
                });
            }}>
                <input type="text" placeholder="Departure Station" {...inputProps("plecareA")}/>
            </form>
            <input type="text" placeholder="Arrival Station" {...inputProps("sosireB")}/>
            <select {...inputProps("mijlocTransport")}>
                <option value="">Pick one</option>
                <option value="bus">Bus</option>
                <option value="metrou">Metro</option>
                <option value="train">Train</option>
                <option value="tram">Tram</option>
            </select>
            <input type="time" {...inputProps("oraPlecare")}/>
            <input type="number" placeholder="minute" {...inputProps("durataCalatoriei", "valueAsNumber")}/>
            <select {...inputProps("gradAglomerare")}>
                <option value="">Pick one</option>
                <option value="liber">Clear</option>
                <option value="mediu">Medium</option>
                <option value="aglomerat">Crowded</option>
            </select>
            <textarea placeholder="Whatever comments you may have" {...inputProps("observatii")}>
            </textarea>
            <select {...inputProps("nivelulSatisfactiei")}>
                <option value="">Pick one</option>
                <option value="foarte slab">Very Low</option>
                <option value="slab">Low</option>
                <option value="mediu">Medium</option>
                <option value="bun">Good</option>
                <option value="foarte bun">Very Good</option>
            </select>
            <button disabled={isLoading} type="submit" form={formId}>
                {isLoading? "Loading..." : "Save"}
            </button>
            <button disabled={isLoading} type="button" onClick={doCancel}>
                Cancel
            </button>
        </>
    );
}

function fetchReviews({queryKey}) {
    return backendRequest("GET", "/share/trips", undefined, {
        Authorization: `Bearer ${queryKey[1]}`
    });
}

export default function Reviews() {
    const jwt = useUserJwt();
    const {data, isError, error, isLoading} = useQuery({
        queryKey: ["reviews", jwt],
        queryFn: fetchReviews
    });
    const [editing, setEditing] = useState(null);
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: deleteTrip,
        onSuccess() {
            queryClient.invalidateQueries({queryKey: ["reviews", jwt]});
            queryClient.invalidateQueries({queryKey: ["allTrips"]});
        },
        onError(err) {
            alert(`${err}`);
        }
    })

    if (!jwt) {
        return (
            <h1>You need to be authenticated!</h1>
        );
    }

    if (isLoading) {
        return <h1>Loading</h1>;
    }


    return (
        <div className={styles.revTable}>
            {isError && <h1 className={styles.error}>{`${error}`}</h1>}
            <ReviewHeader/>
            <div></div>
            <div></div>
            <EditRow/>

            {data.map((trip) => (
                editing === trip.idTrip ?
                <EditRow key={trip.idTrip} initial={trip} onCancel={() => setEditing(null)}/> :
                <Fragment key={trip.idTrip}>
                    <Review trip={trip}/>
                    <button type="button" onClick={() => setEditing(trip.idTrip)}>Edit</button>
                    <button disabled={deleteMutation.isLoading} type="button"
                        onClick={() => window.confirm("Are you sure?") && deleteMutation.mutate({
                            id: trip.idTrip,
                            jwt
                        })}
                    >
                        Delete
                    </button>
                </Fragment>
            ))}
        </div>
    );
}
