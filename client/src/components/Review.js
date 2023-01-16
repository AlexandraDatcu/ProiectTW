export function Review({trip}) {
    return(
        <>
            <div>{trip.plecareA}</div>
            <div>{trip.sosireB}</div>
            <div>{trip.mijlocTransport}</div>
            <div>{trip.oraPlecare}</div>
            <div>{trip.durataCalatoriei}</div>
            <div>{trip.gradAglomerare}</div>
            <div>{trip.observatii}</div>
            <div>{trip.nivelulSatisfactiei}</div>
        </>
    );
}

export function ReviewHeader() {
    return (
        <>
            <div>
                From (A)
            </div>
            <div>
                To (B)
            </div>
            <div>
                Mode
            </div>
            <div>
                Departure time
            </div>
            <div>
                Duration
            </div>
            <div>
                Crowded factor
            </div>
            <div>
                Comments
            </div>
            <div>
                Rating
            </div>
        </>
    );
}
