
export async function backendRequest(method, path, params, headers={}) {
    let url = path;
    const hdr = {...headers};
    let body;
    if (params && method === "GET") {
        url += "?" + new URLSearchParams(params);  
    }

    if (method !== "GET") {
        hdr["Content-Type"] = "application/json";
        body = JSON.stringify(params);
    }

    const resp = await fetch(url, {
        method,
        headers: hdr,
        body
    });
    const json = await resp.json();
    if (resp.status > 299) {
        throw new Error(json.message);
    }
    return json;
}
