import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { bumpVersionCode } from './bump_version_code'
import { deployToGooglePlay } from './deploy_to_google_play'

const CMD_BUMP_VERSION_CODE = 'bump_version_code'
const CMD_DEPLOY_TO_GOOGLE_PLAY = 'deploy_to_google_play'

async function main() {
    const argv = yargs(hideBin(process.argv))
        .command(CMD_BUMP_VERSION_CODE, 'Bump version in the given gradle file', {
            gradle_file: { type: 'string', demandOption: true },
            service_account: { type: 'string', demandOption: true },
            project_number: { type: 'number', demandOption: true },
            app_id: { type: 'string', demandOption: true }
        })
        .command(CMD_DEPLOY_TO_GOOGLE_PLAY, 'Deploys the given APK to Google Play', {
            apk_file: { type: 'string', demandOption: true },
            track: { type: 'string', demandOption: true },
            draft: { type: 'boolean', demandOption: true }
        })
        .demandCommand(1, 1)
        .parseSync()

    const command = argv._[0]

    switch (command) {
        case CMD_BUMP_VERSION_CODE: {
            await bumpVersionCode(
                argv.service_account as string,
                Math.trunc(argv.project_number as number),
                argv.app_id as string,
                argv.gradle_file as string
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
    }
}

main().then()
