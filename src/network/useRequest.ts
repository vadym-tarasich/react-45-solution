import React from "react";
import { OverlayContext } from "../loading-overlay/LoadingOverlay";

interface UseRequest<R> {
    response: R | Error | null;
    isLoading: boolean;
    makeRequest: () => void;
}

export function isResponseError<R>(response: R | Error | null): response is Error {
    return response instanceof Error;
}

// todo: implement a hook that would help Bob to use the network
// this hook should help to keep track on request status,
// return response or error depending on the result of request

export function useRequest<Response>(request: () => Promise<Response>): UseRequest<Response> {
    const isUnmounted = React.useRef(false);
    const [response, setResponse] = React.useState<Response | null | Error>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const { setIsVisible } = React.useContext(OverlayContext);

    const makeRequest = React.useCallback(() => {
        setIsLoading(true);
    }, []);

    React.useEffect(() => {
        const makeRequest = async () => {
            setIsVisible(true);
            setResponse(null);

            try {
                const result = await request();
                if (!isUnmounted.current) {
                    setResponse(result);
                    setIsLoading(false);
                    setIsVisible(false);
                }
            } catch (e) {
                if (!isUnmounted.current) {
                    setResponse(e as Error);
                    setIsLoading(false);
                    setIsVisible(false);
                    console.log("Request failed:", e);
                }
            }
        };

        if (isLoading) {
            (async () => {
                await makeRequest();
            })();
        }
    }, [isLoading]);

    React.useEffect(() => () => {
        isUnmounted.current = true;
    }, []);

    // interface should be kept as is, implement only functionality
    return {
        response: response,
        isLoading: isLoading,
        makeRequest: makeRequest,
    };
}
