import { google } from 'googleapis'
import * as fs from 'fs'
import { PathLike } from 'fs'
import fetch from 'node-fetch'
import { replaceInFile } from 'replace-in-file'

/**
 * Returns Google API access token
 * @param filePath Path to service account's private key in JSON format
 */
async function generateAccessToken(filePath: PathLike): Promise<string> {
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

/**
 * Returns the version code of the last deployed app
 * @param projectNumber Firebase project number
 * @param appId Firebase project App ID
 * @param token Google API access token
 */
async function getVersionCode(projectNumber: number, appId: string, token: string) {
    const url = new URL('https://firebaseappdistribution.googleapis.com')
    url.pathname = `v1/projects/${projectNumber}/apps/${appId}/releases`
    url.searchParams.append('orderBy', 'buildVersion') // probably redundant
    url.searchParams.append('pageSize', '1')

    const response = await fetch(url.href, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    type ResponseType = {
        releases: {
            name: string
            displayVersion: string
            buildVersion: string
            createTime: string
        }[]
        nextPageToken: string
    }

    const json = (await response.json()) as ResponseType
    const releases = json.releases
    if (releases.length === 0) {
        return 1
    }

    return parseInt(releases[0].buildVersion)
}

/**
 * Replaces the version code string in-place
 * @param filePath Path to build.gradle file
 * @param code New version code
 */
async function replaceVersionCode(filePath: string, code: number) {
    await replaceInFile({
        files: filePath,
        from: new RegExp('versionCode.+'),
        to: `versionCode ${code}`
    })
}

export async function bumpVersionCode(
    serviceAccount: string,
    projectNumber: number,
    appId: string,
    gradleFile: string
) {
    const token = await generateAccessToken(serviceAccount)
    const versionCode = await getVersionCode(projectNumber, appId, token)

    const newVersionCode = versionCode + 1

    console.info(`Bumping version code from ${versionCode} to ${newVersionCode}`)

    await replaceVersionCode(gradleFile, newVersionCode)
}
