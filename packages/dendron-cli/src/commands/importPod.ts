import {
  getAllImportPods,
  podClassEntryToPodItemV4,
  PodItemV4,
} from "@dendronhq/pods-core";
import yargs from "yargs";
import { CommandCLIOpts, PodCLICommand } from "./pod";

export class ImportPodCLICommand extends PodCLICommand {
  static getPods() {
    return getAllImportPods();
  }

  static async buildArgs(args: yargs.Argv<CommandCLIOpts>) {
    const podItems: PodItemV4[] = ImportPodCLICommand.getPods().map((p) =>
      podClassEntryToPodItemV4(p)
    );
    return ImportPodCLICommand.buildArgsCore(args, podItems);
  }

  static async run(args: CommandCLIOpts) {
    const ctx = "ImportPod:run";
    const cmd = new ImportPodCLICommand();
    cmd.L.info({ ctx, msg: "enter", args });
    const pods = await ImportPodCLICommand.getPods();
    const opts = await cmd.enrichArgs(args, pods, "import");
    cmd.L.info({ ctx, msg: "enrichArgs:post", args });
    await cmd.execute(opts);
    cmd.L.info({ ctx, msg: "exit", args });
    return cmd;
  }
}
