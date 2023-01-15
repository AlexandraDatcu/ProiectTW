import { useUserName, useUserStore } from "../state/User"

export default function MyAccount() {
    const setJwt = useUserStore((state) => state.setJwt);
    const userName = useUserName();
    return (
        <div>
            <h1>
                Hello, {userName}
            </h1>
            <button onClick={() => setJwt(null)}>Log Out</button>
        </div>
    );
}
