import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { updateVersionCode } from './update_version_code'
import { deployToGooglePlay } from './deploy_to_google_play'
import { inviteTestersToRelease } from './invite_testers_to_release'

const CMD_SYNC_VERSION_CODE = 'sync_version_code'
const CMD_BUMP_VERSION_CODE = 'bump_version_code'
const CMD_DEPLOY_TO_GOOGLE_PLAY = 'deploy_to_google_play'
const CMD_INVITE_TESTERS_TO_RELEASE = 'invite_testers_to_release'

async function main() {
    const argv = yargs(hideBin(process.argv))
        .command(CMD_SYNC_VERSION_CODE, 'Sync version code in the given gradle file', {
            app_id: { type: 'string', demandOption: true },
            gradle_file: { type: 'string', demandOption: true },
            project_number: { type: 'string', demandOption: true },
            service_account: { type: 'string', demandOption: true }
        })
        .command(CMD_BUMP_VERSION_CODE, 'Bump version code in the given gradle file', {
            app_id: { type: 'string', demandOption: true },
            gradle_file: { type: 'string', demandOption: true },
            project_number: { type: 'string', demandOption: true },
            service_account: { type: 'string', demandOption: true }
        })
        .command(CMD_DEPLOY_TO_GOOGLE_PLAY, 'Deploys the given APK to Google Play', {
            apk_file: { type: 'string', demandOption: true },
            track: { type: 'string', demandOption: true },
            draft: { type: 'boolean', demandOption: true }
        })
        .command(
            CMD_INVITE_TESTERS_TO_RELEASE,
            'Invites testers in the given group to the latest release',
            {
                app_id: { type: 'string', demandOption: true },
                group: { type: 'string', demandOption: true },
                project_number: { type: 'number', demandOption: true },
                service_account: { type: 'string', demandOption: true }
            }
        )
        .demandCommand(1, 1)
        .parseSync()

    const command = argv._[0]

    switch (command) {
        case CMD_SYNC_VERSION_CODE: {
            await updateVersionCode(
                argv.app_id as string,
                argv.gradle_file as string,
                argv.project_number as string,
                argv.service_account as string
            )
            break
        }
        case CMD_BUMP_VERSION_CODE: {
            await updateVersionCode(
                argv.app_id as string,
                argv.gradle_file as string,
                argv.project_number as string,
                argv.service_account as string,
                1
            )
            break
        }
        case CMD_DEPLOY_TO_GOOGLE_PLAY: {
            await deployToGooglePlay(
                argv.apk_file as string,
                argv.track as string,
                argv.draft as boolean
            )
            break
        }
        case CMD_INVITE_TESTERS_TO_RELEASE: {
            await inviteTestersToRelease(
                argv.app_id as string,
                argv.group as string,
                argv.project_number as string,
                argv.service_account as string
            )
            break
        }
    }
}

main().then()
