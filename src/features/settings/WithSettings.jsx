import { useSettings } from "./useSettings";

export function WithSettings({ children }) {
    const { isLoading, error, settings } = useSettings();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    return children(settings);
}