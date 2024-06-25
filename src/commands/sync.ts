import { Command, Flags } from "@oclif/core"

import sync, { Delta, EntityType } from "../lib/optimizely/sync-legacy/index.js"

export default class SyncCommand extends Command {
  static summary = "Push local features to Optimizely."

  static flags = {
    accessToken: Flags.string({
      description:
        "Your Optimizely access token. Can also be provided via the environment variable OPTIMIZELY_ACCESS_TOKEN.",
      env: "OPTIMIZELY_ACCESS_TOKEN",
      required: true,
    }),
    projectId: Flags.string({
      description:
        "Your Optimizely Project Id. Can also be provided via the environment variable OPTIMIZELY_PROJECT_ID.",
      env: "OPTIMIZELY_PROJECT_ID",
      required: true,
    }),
    "dry-run": Flags.boolean({
      description:
        "Output what changes would be made without actually making the changes.",
      default: false,
    }),
  }

  async run(): Promise<Partial<Record<EntityType, Delta>>> {
    const { flags } = await this.parse(SyncCommand)
    const projectPath = process.cwd()

    const deltas = await sync(
      flags.accessToken,
      flags.projectId,
      projectPath,
      flags["dry-run"],
    )

    return deltas
  }
}
