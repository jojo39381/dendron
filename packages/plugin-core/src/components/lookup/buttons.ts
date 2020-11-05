import _ from "lodash";
import * as vscode from "vscode";
import { QuickInputButton, ThemeIcon } from "vscode";
import {
  LookupEffectType,
  LookupFilterType,
  LookupNoteType,
  LookupSelectionType,
  LookupSplitType,
} from "../../commands/LookupCommand";
import { DendronQuickPickerV2 } from "./types";

export type ButtonType =
  | LookupEffectType
  | LookupNoteType
  | LookupSelectionType
  | LookupSplitType
  | LookupFilterType;

export type ButtonCategory =
  | "selection"
  | "note"
  | "split"
  | "filter"
  | "effect";

export function getButtonCategory(button: DendronBtn): ButtonCategory {
  if (isSelectionBtn(button)) {
    return "selection";
  }
  if (isNoteBtn(button)) {
    return "note";
  }
  if (isSplitButton(button)) {
    return "split";
  }
  if (isFilterButton(button)) {
    return "filter";
  }
  if (isEffectButton(button)) {
    return "effect";
  }
  throw Error(`unknown btn type ${button}`);
}

function isEffectButton(button: DendronBtn) {
  return _.includes(["copyNoteLink", "copyNoteRef"], button.type);
}
function isFilterButton(button: DendronBtn) {
  return _.includes(["directChildOnly"], button.type);
}

function isSelectionBtn(button: DendronBtn) {
  return _.includes(["selection2link", "selectionExtract"], button.type);
}

function isNoteBtn(button: DendronBtn) {
  return _.includes(["journal", "scratch"], button.type);
}

function isSplitButton(button: DendronBtn) {
  return _.includes(["horizontal", "vertical"], button.type);
}

export type IDendronQuickInputButton = QuickInputButton & {
  type: ButtonType;
  pressed: boolean;
  onLookup: (payload: any) => Promise<void>;
};

export class DendronBtn implements IDendronQuickInputButton {
  public iconPathNormal: ThemeIcon;
  public iconPathPressed: ThemeIcon;
  public type: ButtonType;
  public pressed: boolean;
  public canToggle: boolean;
  public title: string;
  onLookup = async (_payload: any) => {
    return;
  };

  constructor(opts: {
    title: string;
    iconOff: string;
    iconOn: string;
    type: ButtonType;
    pressed?: boolean;
    canToggle?: boolean;
  }) {
    const { iconOff, iconOn, type, title, pressed } = opts;
    this.iconPathNormal = new vscode.ThemeIcon(iconOff);
    this.iconPathPressed = new vscode.ThemeIcon(iconOn);
    this.type = type;
    this.pressed = pressed || false;
    this.title = title;
    this.canToggle = opts.canToggle || true;
  }

  get iconPath() {
    return !this.pressed ? this.iconPathNormal : this.iconPathPressed;
  }

  get tooltip(): string {
    return `${this.title}, status: ${this.pressed ? "on" : "off"}`;
  }

  toggle() {
    this.pressed = !this.pressed;
  }
}

class Selection2LinkBtn extends DendronBtn {
  static create(pressed?: boolean) {
    return new DendronBtn({
      title: "Selection to Link",
      iconOff: "link",
      iconOn: "menu-selection",
      type: "selection2link",
      pressed,
    });
  }
}

class SlectionExtractBtn extends DendronBtn {
  static create(pressed?: boolean) {
    return new DendronBtn({
      title: "Selection Extract",
      iconOff: "find-selection",
      iconOn: "menu-selection",
      type: "selectionExtract",
      pressed,
    });
  }
}

class JournalBtn extends DendronBtn {
  static create(pressed?: boolean) {
    return new DendronBtn({
      title: "Create Journal Note",
      iconOff: "calendar",
      iconOn: "menu-selection",
      type: "journal",
      pressed,
    });
  }
}

class ScratchBtn extends DendronBtn {
  static create(pressed?: boolean) {
    return new DendronBtn({
      title: "Create Scratch Note",
      iconOff: "new-file",
      iconOn: "menu-selection",
      type: "scratch",
      pressed,
    });
  }
}
class HorizontalSplitBtn extends DendronBtn {
  static create(pressed?: boolean) {
    return new DendronBtn({
      title: "Split Horizontal",
      iconOff: "split-horizontal",
      iconOn: "menu-selection",
      type: "horizontal",
      pressed,
    });
  }
}
class DirectChildFilterBtn extends DendronBtn {
  static create(pressed?: boolean) {
    return new DendronBtn({
      title: "Direct Child Filter",
      iconOff: "git-branch",
      iconOn: "menu-selection",
      type: "directChildOnly" as LookupFilterType,
      pressed,
    });
  }
}
export class CopyNoteLinkButton extends DendronBtn {
  static create(pressed?: boolean) {
    return new DendronBtn({
      title: "Copy Note Link",
      iconOff: "clippy",
      iconOn: "menu-selection",
      type: "copyNoteLink" as LookupEffectType,
      pressed,
      canToggle: false,
    });
  }
}

// // @ts-ignore
// class VerticalSplitBtn extends DendronBtn {
//   static create(pressed?: boolean) {
//     return new DendronBtn({
//       title: "Split Vertical",
//       iconOff: "split-vertical",
//       iconOn: "menu-selection",
//       type: "vertical",
//       pressed,
//     });
//   }
// }

export function refreshButtons(
  quickpick: DendronQuickPickerV2,
  buttons: IDendronQuickInputButton[]
) {
  quickpick.buttons = buttons;
}

export function createAllButtons(
  typesToTurnOn: ButtonType[] = []
): DendronBtn[] {
  const buttons = [
    CopyNoteLinkButton.create(),
    DirectChildFilterBtn.create(),
    SlectionExtractBtn.create(),
    Selection2LinkBtn.create(),
    JournalBtn.create(),
    ScratchBtn.create(),
    HorizontalSplitBtn.create(),
    // VerticalSplitBtn.create(),
  ];
  typesToTurnOn.map((btnType) => {
    (_.find(buttons, { type: btnType }) as DendronBtn).pressed = true;
  });
  return buttons;
}
