import fs, { PathLike } from 'fs'
import { google } from 'googleapis'
import fetch from 'node-fetch'

export type Release = {
    name: string
    displayVersion: string
    buildVersion: string
    createTime: string
}

/**
 * Returns Google API access token
 * @param filePath Path to service account's private key in JSON format
 */
export async function generateAccessToken(filePath: PathLike): Promise<string> {
    // Load the service account key JSON file.
    const serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    // Define the required scopes.
    const scopes = ['https://www.googleapis.com/auth/cloud-platform']

    // Authenticate a JWT client with the service account.
    const jwtClient = new google.auth.JWT(
        serviceAccount.client_email,
        undefined,
        serviceAccount.private_key,
        scopes
    )

    // Use the JWT client to generate an access token.
    const credentials = await jwtClient.authorize()

    const { access_token } = credentials

    if (!access_token) {
        throw new Error(`Undefined access_token. Credentials:\n${JSON.stringify(credentials)}`)
    }

    return access_token
}

export async function makeApiRequest<T>(args: {
    body?: Record<string, unknown>
    params?: Record<string, string>
    pathname: string
    token: string
}) {
    const { body, params, pathname, token } = args

    const url = new URL('https://firebaseappdistribution.googleapis.com')
    url.pathname = pathname

    for (const key in params) {
        url.searchParams.append(key, params[key]) // max
    }

    const response = await fetch(url.href, {
        method: body ? 'POST' : 'GET',
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (response.status != 200) {
        throw new Error(`API Request Error:\n${response}`)
    }

    return (await response.json()) as T
}

/**
 * Returns the latest deployed app release sorted by buildNumber
 * @param projectNumber Firebase project number
 * @param appId Firebase project App ID
 * @param token Google API access token
 */
export async function getLatestRelease(
    projectNumber: string,
    appId: string,
    token: string
): Promise<Release> {
    type Releases = {
        releases: Release[]
        nextPageToken: string
    }

    const response = await makeApiRequest<Releases>({
        pathname: `v1/projects/${projectNumber}/apps/${appId}/releases`,
        params: { pageSize: '100' },
        token
    })

    const releases = response.releases

    if (releases.length === 0) {
        throw Error('No release found')
    }

    return releases.reduce(
        (previous, current) =>
            parseInt(previous.buildVersion) > parseInt(current.buildVersion) ? previous : current,
        releases[0]
    )
}
