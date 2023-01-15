import { useUserName } from "../state/User"

export default function MyAccount() {
    const userName = useUserName();
    return (
        <h1>
            Hello, {userName}
        </h1>
    );
}
