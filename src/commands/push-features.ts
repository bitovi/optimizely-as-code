import { Command, Flags } from "@oclif/core"

export default class PushFeatures extends Command {
  static summary = "Push local features to Optimizely."
  static description =
    "An in-depth description of the command.\nIt can be multiline."

  static flags = {
    dryRun: Flags.boolean({
      description:
        "Outputs what changes would be made without actually making the changes.",
    }),
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(PushFeatures)

    this.log(
      `hello ${args.person} from ${flags.from}! (./src/commands/push-features.ts)`,
    )
  }
}
